/**
 * ============================================
 * iGEM SZPU-2026 - 首页 dbtl-cycle 屏「PAGER 原理」滚动叙事动画
 * ============================================
 *
 * @description
 *   用户创意：把原来那张整幅「工作流程与原理」示意图换成一段滚动叙事——
 *   页面滚动到本屏后画面被钉住不动，滚动进度直接当动画进度（0 → 1）：
 *     0.02–0.10  hM1Dq 受体自画面右侧擦入（clip-path 由右向左展开），
 *                 最终固定在原示意图所在的舞台中部；
 *     0.09–0.17  MT1 抑制药丸从上方落回，横置在受体上（无抗原 → 受体被抑制）；
 *     0.30–0.65  五个 HA 抗原分别从页面各处、不同方向、远近不同地接近 Nb 受体
 *                 （环境中抗原很多），其中体积最大的那一个在 0.655 结合到 Nb；
 *     0.66–0.97  抗原结合后 MT1 被解除：缓缓上飘右移、转回素材原生倾角并淡出。
 *
 *   - 触发与进度：滚动驱动，进度 = (scrollY - 轨道顶) / (轨道高 - 视口高)。
 *     本屏在桌面端被拉高为 360vh 轨道（<html class="pager-story-track">，由本脚本
 *     确认视口与动效偏好后才加）、舞台 sticky 钉住，所以「滚动时锁页面位置」；
 *     钉住期间整页 scroll-snap 被关掉（否则 mandatory 吸附会在两屏之间的空档里
 *     反复把滚动位置拉回吸附点），退出轨道时恢复。
 *   - 几何全部运行时量测：图层方框与舞台都是 CSS 百分比定位，禁止把某个断点的
 *     像素坐标写死；三张素材同出一张 1600×1600 画布，图层方框与 transform-origin
 *     即该画布坐标，位移量按舞台尺寸换算成 px。
 *   - 只写 transform / opacity / clip-path，不碰布局属性。
 *   - 降级红线：无 JS、prefers-reduced-motion、窄屏（≤768px）、矮视口（≤560px 高）
 *     一律不接管：页面直接是静态终态（受体 + HA 结合于 Nb + MT1 横置于受体上），
 *     本屏也仍是普通 100vh 吸附屏（不加高、不放开吸附）。
 *
 * 依赖：window.iGEMUtils（core/utils.js）；缺失时回退到原生实现。
 */
(function () {
  'use strict';

  var ARMED = 'js-pager-story';
  var TRACK = 'pager-story-track';
  var PINNED = 'pager-story-pinned';
  var TRACK_MQ = '(min-width: 769px) and (min-height: 561px)';

  /** 参数集中区（交付微调入口） */
  var T = {
    /**
     * 前导 / 收尾缓冲（占整段滚动进度的比例）。
     *
     * 没有缓冲时，上一屏刚锁住就开始擦入、动画刚走完就立刻解锁，进出都很突兀。
     * 前导段：锁住后先让标题 / 说明 / 吉祥物安静地停一拍，再开始叙事；
     * 收尾段：叙事走到终态后再停一拍才解锁，让下一屏的进入不至于砸下来。
     * 两段都只是把叙事区间压缩到 [lead, 1-trail]，动画本身的节奏不变。
     */
    lead: 0.08,
    trail: 0.08,
    enter: [0.02, 0.10],      // 受体入场区间（占总进度）
    enterFromX: 70,          // 入场起始横向偏移（占图层方框宽度的 %）
    idle: [0.10, 0.66],      // 受体已落位、HA 未动之前的极缓呼吸区间
    idleAmp: 0.012,          // 呼吸缩放幅度
    mt1In: [0.09, 0.17],     // MT1 淡入并落回结合位
    mt1Drop: 0.03,           // MT1 入场时的起始高度（占图层尺寸，向为上）
    mt1Out: [0.66, 0.97],    // MT1 解除、上飘、淡出
    mt1FadeFrom: 0.42,       // MT1 飘走过程中的淡出起点（占解除进度）
    haOut: [0.95, 1.00]      // 环境抗原淡出区间（结合那颗不参与）
  };

  /** MT1 位姿：位移是「相对素材里药丸原始位置」的图层尺寸比例 */
  var MT1 = {
    rotHold: 40,             // 横置角度：抵消素材约 40° 的原生倾角
    rotOut: 4,               // 飘走时转回接近素材原生倾角
    // 横置结合位 = 画布 (866,825) - 药丸原始中心 (1000,444)，再 /1600：
    // 落在受体顶面两颗 DCZ 小球（画布 717,809 与 1015,795，间距 298）的正中空档上；
    // 药丸旋转后的外接宽度约 249，配合 holdScale 0.88 留出两侧余量
    attach: { x: -0.08375, y: 0.238125 },
    holdScale: 0.88,         // 横置期间略收，避免压住两侧小球
    leave: { x: 0.22, y: -0.26 },        // 飘走终点：越过素材原始位置继续向右上方
    scaleOut: 0.78
  };

  /** 图层里飘着的抗原要「闲得住」：到位后原地缓慢浮动（幅度是舞台百分比） */
  var FLOAT = {
    cycles: [2.4, 2.0],      // x / y 方向的浮动周期数（整段进度内）
    rotAmp: 7,               // 浮动时的自转角（度）
    breath: 0.035            // 浮动时的缩放呼吸
  };

  /**
   * HA 抗原分镜。from/park 都是抗原本体中心在舞台上的百分比位置。
   *
   * - 结合那颗（bind）：from 起飞 → win 末帧落到 Nb（= 图层天然位置，位移 0），之后不再动。
   * - 环境抗原：inWin 区间内从画面外飞到 park 停住，随后原地浮动到 haOut 才淡出。
   *   scale = 远近（越大越近），wob = 浮动幅度（舞台 %），ph = 相位（错开节奏）。
   */
  var SCENES = [
    { key: 'bind', win: [0.260, 0.655], from: [104, 6], scale: 1.10 },
    { key: '1', inWin: [0.150, 0.330], from: [-10, 88], park: [44, 30], scale: 0.82, wob: [1.5, 1.1], ph: 0.0 },
    { key: '2', inWin: [0.170, 0.360], from: [8, 116], park: [38, 72], scale: 0.66, wob: [1.2, 1.4], ph: 2.1 },
    { key: '3', inWin: [0.160, 0.350], from: [38, -14], park: [71, 15], scale: 1.00, wob: [1.6, 1.2], ph: 4.2 },
    { key: '4', inWin: [0.180, 0.340], from: [104, 96], park: [93, 48], scale: 0.88, wob: [1.3, 1.5], ph: 5.6 }
  ];

  /* ---------------- 小工具 ---------------- */

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function reducedMotion() {
    if (window.iGEMUtils && typeof window.iGEMUtils.prefersReducedMotion === 'function') {
      return window.iGEMUtils.prefersReducedMotion();
    }
    return typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function debounce(fn, wait) {
    if (window.iGEMUtils && typeof window.iGEMUtils.debounce === 'function') {
      return window.iGEMUtils.debounce(fn, wait);
    }
    var timer = null;
    return function () {
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(null, args); }, wait);
    };
  }

  function clamp01(v) { return v < 0 ? 0 : (v > 1 ? 1 : v); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  /** 把总进度 p 映射到 [a,b] 区间内的 0→1 局部进度 */
  function seg(p, a, b) { return clamp01((p - a) / (b - a)); }

  function easeOutCubic(t) { var u = 1 - t; return 1 - u * u * u; }
  function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function easeInOutSine(t) { return -(Math.cos(Math.PI * t) - 1) / 2; }

  /** 轻微回弹：抗原「落到 Nb 上」时压一下再稳住 */
  function easeOutBack(t) {
    var c1 = 0.8, c3 = 1.8, u = t - 1;
    return 1 + c3 * u * u * u + c1 * u * u;
  }

  function smoothstep(edge0, edge1, v) {
    var t = clamp01((v - edge0) / (edge1 - edge0));
    return t * t * (3 - 2 * t);
  }

  /* ---------------- 主流程 ---------------- */

  ready(function () {
    var section = document.getElementById('dbtl-cycle');
    if (!section) return;
    var stage = section.querySelector('.art-stage--dbtl-cycle');
    if (!stage) return;
    var receptor = stage.querySelector('.pager__receptor');
    var mt1 = stage.querySelector('.pager__mt1');
    if (!receptor || !mt1) return;

    var actors = [];
    for (var i = 0; i < SCENES.length; i++) {
      var node = stage.querySelector('.pager__ha[data-ha="' + SCENES[i].key + '"]');
      if (!node) continue;
      actors.push({ cfg: SCENES[i], el: node, dx: 0, dy: 0, fx: 0, fy: 0, px: 0, py: 0 });
    }
    if (!actors.length) return;

    var root = document.documentElement;
    var trackMQ = window.matchMedia ? window.matchMedia(TRACK_MQ) : null;
    var armed = false;
    var freeScroll = false;
    var lastP = -1;
    var frame = 0;

    // 轨道进入「视口底再往下 0.35 屏」→ 放开吸附；轨道底部完全滚出视口 → 恢复。
    // rootMargin 只接受绝对长度或百分比（vh 无效，构造时会直接抛错），故用 35%。
    var trackObserver = null;

    // 轨道几何：一次量测、滚动期间不再读布局（滚动热路径不调 getBoundingClientRect）
    var trackTop = 0;
    var span = 1;
    var size = 1;
    var stageW = 1;
    var stageH = 1;
    var naturalX = 0;
    var naturalY = 0;

    function measure() {
      var sectionRect = section.getBoundingClientRect();
      var stageRect = stage.getBoundingClientRect();
      var boxRect = receptor.getBoundingClientRect();
      if (!boxRect.width || !stageRect.width) return false;

      trackTop = sectionRect.top + window.scrollY;
      span = sectionRect.height - window.innerHeight;
      if (span <= 0) return false;

      size = boxRect.width;
      stageW = stageRect.width;
      stageH = stageRect.height;

      // HA 图层天然位置（= Nb 结合位，抗原正好坐在 Nb 方框顶上）
      naturalX = boxRect.left - stageRect.left + size * 0.4341;
      naturalY = boxRect.top - stageRect.top + size * 0.2663;

      for (var i = 0; i < actors.length; i++) {
        var a = actors[i];
        a.fx = stageW * a.cfg.from[0] / 100 - naturalX;
        a.fy = stageH * a.cfg.from[1] / 100 - naturalY;
        // park 是舞台百分比 → 换成相对天然位置的 px 偏移（只算一次，滚动热路径纯算术）
        if (a.cfg.park) {
          a.px = stageW * a.cfg.park[0] / 100 - naturalX;
          a.py = stageH * a.cfg.park[1] / 100 - naturalY;
          a.wx = stageW * a.cfg.wob[0] / 100;
          a.wy = stageH * a.cfg.wob[1] / 100;
        }
        // 结合那颗的终点就是天然位置（位移 0）
        a.dx = 0;
        a.dy = 0;
      }
      return true;
    }

    /** 未夹位的进度：<0 本屏尚未钉住，>1 本屏已滚完 */
    function rawProgress() {
      return (window.scrollY - trackTop) / span;
    }

    /**
     * 放开 / 恢复整页 mandatory 吸附。
     *
     * 相邻两屏之间被这条轨道撑出 260vh 以上的空档，浏览器会在「滚动结束」时把位置
     * 拉回最近的吸附点，叙事动画就无法在中途停留，所以钉住期间必须关掉吸附。
     *
     * 判据用 IntersectionObserver（下边扩 35vh，见 trackObserver）而不是滚动事件里的
     * 几何比较：轨道顶部还在视口底之下很远时吸附就已经放开，因此即使用户拖滚动条
     * 一次跳过整段也能在同一帧解控，不会被吸附拽回上一屏。恢复时机是轨道底部完全
     * 滚出视口——此时下一屏正好贴住视口顶，重新开启吸附不产生位移跳变。
     */
    function setFreeScroll(on) {
      if (freeScroll === on) return;
      freeScroll = on;
      root.classList.toggle(PINNED, on);
    }

    function render(p) {
      // ---- 受体：自右向左擦入并落定 ----
      var e = seg(p, T.enter[0], T.enter[1]);
      var ee = easeOutCubic(e);
      var breath = 1 + T.idleAmp * Math.sin(Math.PI * seg(p, T.idle[0], T.idle[1]));
      receptor.style.transform = 'translateX(' + ((1 - ee) * T.enterFromX).toFixed(2)
        + '%) scale(' + (breath * (0.965 + 0.035 * ee)).toFixed(4) + ')';
      // 必须始终写显式值：清空内联会回落到 armed 类的 inset(0 0 0 100%) 隐藏态
      receptor.style.clipPath = 'inset(0 0 0 ' + ((1 - ee) * 100).toFixed(2) + '%)';
      receptor.style.opacity = clamp01(e / 0.4).toFixed(3);

      // ---- MT1：落回横置 → 被解除后上飘淡出 ----
      var mi = easeOutCubic(seg(p, T.mt1In[0], T.mt1In[1]));
      var mo = easeInOutCubic(seg(p, T.mt1Out[0], T.mt1Out[1]));
      var mx = lerp(MT1.attach.x, MT1.leave.x, mo) * size;
      var my = (lerp(MT1.attach.y, MT1.leave.y, mo) - (1 - mi) * T.mt1Drop) * size;
      var mrot = lerp(MT1.rotHold, MT1.rotOut, mo);
      var mscale = lerp(MT1.holdScale, MT1.scaleOut, mo);
      mt1.style.transform = 'translate(' + mx.toFixed(1) + 'px,' + my.toFixed(1) + 'px) rotate('
        + mrot.toFixed(2) + 'deg) scale(' + mscale.toFixed(3) + ')';
      mt1.style.opacity = (mi * (1 - smoothstep(T.mt1FadeFrom, 1, mo))).toFixed(3);

      // ---- HA 抗原 ----
      for (var i = 0; i < actors.length; i++) {
        var a = actors[i];
        if (a.cfg.park) {
          renderIdleHa(a, p);
        } else {
          renderBinder(a, p);
        }
      }
    }

    /** 结合那颗：飞到 Nb 上定格（此后不再动） */
    function renderBinder(a, p) {
      var t = seg(p, a.cfg.win[0], a.cfg.win[1]);
      var te = easeOutBack(t);
      var hx = lerp(a.fx, 0, te) + Math.sin(Math.PI * t) * 0.008 * size;   // 两端归零的微摆
      var hy = lerp(a.fy, 0, te) - Math.sin(Math.PI * t) * 0.006 * size;
      // 越接近越大：0.82 → 1，制造「由远及近」的纵深
      var hs = a.cfg.scale * lerp(0.82, 1, clamp01(te));
      a.el.style.transform = 'translate(' + hx.toFixed(1) + 'px,' + hy.toFixed(1)
        + 'px) scale(' + hs.toFixed(3) + ') rotate(0deg)';
      a.el.style.opacity = clamp01(t / 0.15).toFixed(3);
    }

    /** 环境抗原：飞到停泊位 → 原地缓慢浮动 → 末段淡出 */
    function renderIdleHa(a, p) {
      var t = seg(p, a.cfg.inWin[0], a.cfg.inWin[1]);
      var te = easeInOutSine(t);
      var hx = lerp(a.fx, a.px, te);
      var hy = lerp(a.fy, a.py, te);

      // 浮动幅度随「到位程度」渐入，避免到位瞬间被正弦项拽一下
      var w = te;
      var ang = Math.PI * 2 * p;
      hx += w * a.wx * Math.sin(ang * FLOAT.cycles[0] + a.cfg.ph);
      hy += w * a.wy * Math.cos(ang * FLOAT.cycles[1] + a.cfg.ph * 1.7);
      var rot = w * FLOAT.rotAmp * Math.sin(ang * 1.6 + a.cfg.ph * 2.3);

      // 越接近越大：0.82 → 1，制造「由远及近」的纵深；到位后保留极缓的呼吸
      var hs = a.cfg.scale * lerp(0.82, 1, clamp01(t))
        * (1 + w * FLOAT.breath * Math.sin(ang * 1.3 + a.cfg.ph));

      a.el.style.transform = 'translate(' + hx.toFixed(1) + 'px,' + hy.toFixed(1)
        + 'px) scale(' + hs.toFixed(3) + ') rotate(' + rot.toFixed(2) + 'deg)';
      a.el.style.opacity = (clamp01(t / 0.2) * (1 - smoothstep(T.haOut[0], T.haOut[1], p))).toFixed(3);
    }

    /**
     * 原始进度 → 叙事进度：两端各留一段缓冲。
     * 缓冲区内叙事进度被夹在 0（空场待机）与 1（终态定格），画面不动但仍在钉住状态，
     * 所以进出轨道都有一段「锁住但静止」的过渡，不会一锁就开始、一走完就解锁。
     */
    function storyProgress() {
      var raw = rawProgress();
      var spanP = 1 - T.lead - T.trail;
      if (spanP <= 0) return clamp01(raw);
      return clamp01((raw - T.lead) / spanP);
    }

    function update() {
      frame = 0;
      var p = storyProgress();
      if (p === lastP) return;
      lastP = p;
      render(p);
    }

    function schedule() {
      if (frame) return;
      frame = requestAnimationFrame(update);
    }

    function arm() {
      if (armed) return false;
      // 先加轨道类再量测：轨道高度本身由这个类决定（360vh），
      // 不加类量到的会是未加高的 100vh，进度分母就错了
      root.classList.add(TRACK);
      if (!measure()) {
        root.classList.remove(TRACK);
        return false;
      }
      armed = true;
      stage.classList.add(ARMED);
      lastP = -1;
      update();
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', onResize);
      trackObserver.observe(section);      if (trackMQ) trackMQ.addEventListener('change', onTrackChange);
      return true;
    }

    function disarm() {
      if (!armed) return;
      armed = false;
      stage.classList.remove(ARMED);
      root.classList.remove(TRACK);
      setFreeScroll(false);
      trackObserver.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', onResize);
      if (trackMQ) trackMQ.removeEventListener('change', onTrackChange);
      if (frame) { cancelAnimationFrame(frame); frame = 0; }
    }

    function onResize() {
      if (!measure()) return;
      lastP = -1;
      update();
    }

    // 视口跨过断点（桌面轨道 ↔ 窄屏静态）时整体装卸，不留半接管状态
    function onTrackChange() {
      if (trackMQ.matches && !reducedMotion()) {
        if (!armed) arm();
      } else {
        disarm();
      }
    }

    // ---- 降级红线：能力不齐就不接管可见性 ----
    if (!trackMQ || !trackMQ.