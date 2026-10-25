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
 *     0.10–0.32  MT1 抑制肽全程横置在中央正构位点上，只是由完全透明渐渐变实
 *                 （开场一帧都不出现，受体落定之后才读到「口袋被压住」）；
 *     0.24–0.60  五个 HA 抗原分别从页面各处、不同方向、远近不同地接近 Nb 受体
 *                 （环境中抗原很多），其中体积最大的那一个在 0.60 落到 Nb 方块头顶，
 *                 之后一直停在那里（抗原保持结合，不再解离飞走）；
 *     0.60–0.79  抗原结合后 MT1 被解除：向上飘离并淡出；
 *     0.88–0.99  口袋空出来之后，两颗 DCZ 配体自膜外飞来，分别落进中央螺旋两侧的
 *                 凹槽并稳住，落定瞬间各放一次极轻的扩散光环，受体随之收一次激活呼吸。
 *
 *   - 触发与进度：滚动驱动，进度 = (scrollY - 轨道顶) / (轨道高 - 视口高)。
 *     本屏在桌面端被拉高为 360vh 轨道（<html class="pager-story-track">，由本脚本
 *     确认视口与动效偏好后才加）、舞台 sticky 钉住，所以「滚动时锁页面位置」；
 *     钉住期间整页 scroll-snap 被关掉（否则 mandatory 吸附会在两屏之间的空档里
 *     反复把滚动位置拉回吸附点），退出轨道时恢复。
 *   - 几何全部运行时量测：图层方框与舞台都是 CSS 百分比定位，禁止把某个断点的
 *     像素坐标写死；四张素材同出一张 1600×1600 画布，图层方框与 transform-origin
 *     即该画布坐标，位移量按舞台尺寸换算成 px。
 *   - 只写 transform / opacity / clip-path，不碰布局属性。
 *   - 降级红线：无 JS、prefers-reduced-motion、窄屏（≤768px）、矮视口（≤560px 高）
 *     一律不接管：页面直接是静态终态（受体 + 两颗 DCZ 嵌在凹槽里，结合那颗 HA 仍停在
 *     Nb 头顶，环境抗原与 MT1 不可见），
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
    idle: [0.10, 0.60],      // 受体已落位、HA 未动之前的极缓呼吸区间
    idleAmp: 0.012,          // 呼吸缩放幅度
    activateAmp: 0.008,      // 两颗 DCZ 都落进之后受体那一下激活呼吸的幅度
    mt1In: [0.10, 0.32],     // MT1 渐显窗口：开场完全透明，受体落定后才随动画变实
    mt1FadeFrom: 0.45,       // MT1 飘走过程中的淡出起点（占解除进度）
    dczIn: [0.88, 0.99],     // 两颗 DCZ 出现 → 飞向各自的凹槽 → 落定（外框区间）
    haOut: [0.94, 1.00]      // 环境抗原淡出区间（结合那颗一直停在 Nb 头顶）
  };

  /** 所有素材共用的一张 1600×1600 画布；坐标换算一律按这个边长归一 */
  var CANVAS = 1600;

  /**
   * 唯一的 MT1 抑制肽：横置于中央正构位点，把口袋压住。
   *
   * center 是药丸素材里的可见中心（也就是 .pager__mt1 的 transform-origin），
   * 落点 / 飘走点都写画布坐标，换算时一律减去 center，所以 rotate / scale 之后
   * 药丸的可见中心仍然精确落在落点上。
   * 正构位点取画布 (834,438)——中央螺旋 x[772,887] 顶部、两个凹槽之间的口袋开口。
   * 用户 2026-10-21 明确：MT1 不要竖插进口袋，而是**横放**压在口袋上沿（两颗 TM 球
   * 上方的横梁处），读起来才是「一块东西盖住了结合位」；素材原生主轴约 -8°（近水平），
   * 所以横置姿态直接用原生角，不再额外旋转。
   * 可见度不随受体擦入：开场（p < T.mt1In[0]）完全透明，待受体落定后由 T.mt1In 窗口
   * 随动画渐变实，被解除（MT1.outWin）时再上飘并淡出。
   */
  var MT1 = {
    center: [998.5, 446.5],
    dock: [834, 452],                        // 落点（口袋开口，横置：坐在两颗 TM 上方的横梁上）
    leave: [886, 58],                        // 飘走终点：向上、略偏右
    rotHold: -8, rotOut: -8,
    holdScale: 0.88, scaleOut: 0.7,
    outWin: [0.60, 0.79]
  };

  /**
   * 结合那颗抗原的落点偏移（占图层尺寸的比例，相对 HA 图层天然位置画布 694.5,426）。
   * 落点画布 (681,56)：Nb 方块填充区在画布 x[564,795]、y[46,360]，顶边 y≈48–67，
   * 抗原停在顶边上，下半身压住方块上沿、不遮住方块里的 Nb 标注（标注从 y≈148 起）。
   */
  var BIND = { x: -0.0084375, y: -0.23125 };

  /**
   * 两颗 DCZ 配体：MT1 被解除之后的第二个事件。
   *
   * 素材里小球的球心就在画布正中 (800,800)，所以这个图层的天然位置＝画布中心；
   * 两颗分别落进中央螺旋两侧的凹槽（画布 x 736 / 928，通道宽约 72 / 80），
   * 视觉上「小分子钻进了 MT1 让出来的口袋」。0.62 时球径约 76，正好卡在通道里。
   * from 是起飞点的舞台百分比（膜外上方），两颗错开一点时间，像先后被吸进凹槽。
   * 用户 2026-10-21 要求球径整体放大 1.3 倍、落点不变：dockScale 0.62 → 0.806，
   * 起飞景深 scaleFrom 同比例放大（0.34 → 0.442）以保持「由远及近」的纵深比。
   */
  var DCZ_DOCKS = [
    {
      key: 'left',
      from: [78, -14],
      dock: [736, 477],
      inWin: [0.895, 0.988]
    },
    {
      key: 'right',
      from: [99, -3],
      dock: [928, 477],
      inWin: [0.880, 0.968]
    }
  ];

  /** DCZ 飞行的公共参数 */
  var DCZ = {
    scaleFrom: 0.442,        // 起飞时的景深（远小近大）
    dockScale: 0.806,        // 落在凹槽里的球径（用户 2026-10-21：在 0.62 基础上 ×1.3）
    flyEnd: 0.58,            // 局部进度：到这里位置已经落定
    pop: 0.09,               // 落定那一下的鼓包幅度（占自身尺寸）
    wobble: 0.006,           // 飞行途中的轻微上抛（占舞台尺寸）
    haloFrom: 0.5,           // 光环起始直径（相对光环自身）
    haloTo: 1.75
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
   * - 结合那颗（bind）：from 起飞 → win 末帧落到 bind 偏移位（Nb 方块头顶）→ 一直接在那里，
   *   不随 MT1 撤走而解离（结合后一直停在 Nb 头顶）。
   * - 环境抗原：inWin 区间内从画面外飞到 park 停住，随后原地浮动到 haOut 才淡出。
   *   scale = 远近（越大越近），wob = 浮动幅度（舞台 %），ph = 相位（错开节奏）。
   */
  var SCENES = [
    { key: 'bind', win: [0.240, 0.600], from: [104, 6], scale: 1.10, bind: BIND },
    { key: '1', inWin: [0.150, 0.330], from: [-10, 88], park: [44, 30], scale: 0.82, wob: [1.5, 1.1], ph: 0.0 },
    { key: '2', inWin: [0.170, 0.360], from: [8, 116], park: [38, 72], scale: 0.66, wob: [1.2, 1.4], ph: 2.1 },
    { key: '3', inWin: [0.160, 0.350], from: [38, -14], park: [50, 17], scale: 1.00, wob: [1.6, 1.2], ph: 4.2 },
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
    var mtNode = stage.querySelector('.pager__mt1[data-mt1="dock"]');
    if (!receptor || !mtNode) return;

    // 两颗 DCZ 与各自的光环按 data-dcz / data-halo 对位（left / right）
    var dczs = [];
    for (var k = 0; k < DCZ_DOCKS.length; k++) {
      var orb = stage.querySelector('.pager__dcz[data-dcz="' + DCZ_DOCKS[k].key + '"]');
      var ring = stage.querySelector('.pager__halo[data-halo="' + DCZ_DOCKS[k].key + '"]');
      if (!orb || !ring) return;
      dczs.push({ cfg: DCZ_DOCKS[k], el: orb, halo: ring, dx: 0, dy: 0, fx: 0, fy: 0 });
    }

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

    // 轨道几何：一次量测、滚动期间不再读布局（滚动热路径不调 getBoundingClientRect）
    var trackTop = 0;
    var span = 1;
    var size = 1;
    var stageW = 1;
    var stageH = 1;
    var naturalX = 0;
    var naturalY = 0;
    var mtDockX = 0;
    var mtDockY = 0;
    var mtLeaveX = 0;
    var mtLeaveY = 0;

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

      // HA 图层天然位置（抗原本体中心在画布 695,426 上）
      naturalX = boxRect.left - stageRect.left + size * 0.4341;
      naturalY = boxRect.top - stageRect.top + size * 0.2663;

      // MT1 图层的位移＝画布坐标差（transform-origin 就在药丸可见中心上）
      mtDockX = (MT1.dock[0] - MT1.center[0]) / CANVAS * size;
      mtDockY = (MT1.dock[1] - MT1.center[1]) / CANVAS * size;
      mtLeaveX = (MT1.leave[0] - MT1.center[0]) / CANVAS * size;
      mtLeaveY = (MT1.leave[1] - MT1.center[1]) / CANVAS * size;

      // DCZ 图层天然位置＝方框中心（球心在画布 800,800 上）：
      // 起飞点按舞台百分比换算，落点按画布坐标换算
      var boxCx = boxRect.left - stageRect.left + size * 0.5;
      var boxCy = boxRect.top - stageRect.top + size * 0.5;
      for (var d = 0; d < dczs.length; d++) {
        var o = dczs[d];
        o.fx = stageW * o.cfg.from[0] / 100 - boxCx;
        o.fy = stageH * o.cfg.from[1] / 100 - boxCy;
        o.dx = (o.cfg.dock[0] - CANVAS / 2) / CANVAS * size;
        o.dy = (o.cfg.dock[1] - CANVAS / 2) / CANVAS * size;
      }

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
        // 结合那颗：落点偏移（bind）；环境抗原为 0
        a.dx = a.cfg.bind ? a.cfg.bind.x * size : 0;
        a.dy = a.cfg.bind ? a.cfg.bind.y * size : 0;
      }
      return true;
    }

    /** 未夹位的进度：<0 本屏尚未钉住，>1 本屏已滚完 */
    function rawProgress() {
      return (window.scrollY - trackTop) / span;
    }

    /**
     * 放开 / 恢复整页 mandatory 吸附 —— 两段式：
     *
     *   轨道顶还在下方（raw ≤ 0）：吸附保持开启。轨道本身是吸附点（scroll-snap-align:
     *     start + snap-stop: always），所以从上一屏滚过来会有正常的「翻页吸附」，
     *     一次甩动也只会停在轨道顶，不会冲掉整段叙事。
     *   轨道内部（0 < raw < exitRaw）：关掉吸附。这段没有别的吸附点，mandatory 会把
     *     停在中途的用户拽回最近那一屏，叙事就永远停不住。
     *   轨道完全滚完（raw ≥ exitRaw）：轨道底已到视口顶、下一屏正好贴住视口顶，
     *     此时恢复吸附不产生任何位移跳变。
     *
     * 判据一律用 rawProgress 而不是「提前若干屏就放开」：提前放开等于把进入时的
     * 吸附抹掉，用户感受不到「锁定」这一下。滚动事件在滚动过程中就派发，
     * 因此落在边界那一帧就会切换，不会出现「先被拽回去再解锁」。
     */
    function setFreeScroll(on) {
      if (freeScroll === on) return;
      freeScroll = on;
      root.classList.toggle(PINNED, on);
    }

    /**
     * 出口吸附的恢复点：叙事走完后，舞台还会被下一屏推着上移整整一屏。若等到轨道
     * 完全滚出（raw = 1 + vh/span）才恢复吸附，用户早已停进下一屏，出口就完全没有
     * 「吸附」可言。改在「下一屏盖住视口一半」时恢复：此时最近的吸附点就是下一屏顶，
     * 浏览器会把剩下不到半屏的距离吸过去，出口也就有了那一下。
     * 回滚时同一判据反向成立：一旦退回轨道内（raw 低于该值）立刻放开，不会把人拽住。
     */
    function exitRaw() {
      return 1 + 0.5 * window.innerHeight / span;
    }

    function render(p) {
      // ---- 受体：自右向左擦入并落定 ----
      var e = seg(p, T.enter[0], T.enter[1]);
      var ee = easeOutCubic(e);
      var breath = 1
        + T.idleAmp * Math.sin(Math.PI * seg(p, T.idle[0], T.idle[1]))
        // DCZ 落进之后受体收一下：两次极轻的激活呼吸，首尾都归零
        + T.activateAmp * Math.sin(Math.PI * 2 * seg(p, T.dczIn[1] - 0.02, 1));
      receptor.style.transform = 'translateX(' + ((1 - ee) * T.enterFromX).toFixed(2)
        + '%) scale(' + (breath * (0.965 + 0.035 * ee)).toFixed(4) + ')';
      // 必须始终写显式值：清空内联会回落到 armed 类的 inset(0 0 0 100%) 隐藏态
      receptor.style.clipPath = 'inset(0 0 0 ' + ((1 - ee) * 100).toFixed(2) + '%)';
      receptor.style.opacity = clamp01(e / 0.4).toFixed(3);

      // ---- MT1：开场完全透明 → 受体落定后随动画渐变实 → 被解除时飘离淡出 ----
      var mo = easeInOutCubic(seg(p, MT1.outWin[0], MT1.outWin[1]));
      var mx = lerp(mtDockX, mtLeaveX, mo);
      var my = lerp(mtDockY, mtLeaveY, mo);
      mtNode.style.transform = 'translate(' + mx.toFixed(1) + 'px,' + my.toFixed(1)
        + 'px) rotate(' + lerp(MT1.rotHold, MT1.rotOut, mo).toFixed(2) + 'deg) scale('
        + lerp(MT1.holdScale, MT1.scaleOut, mo).toFixed(3) + ')';
      // 开场（p < mt1In[0]）完全透明；mt1In 窗口内随动画逐渐变实；解除阶段再淡出
      var mtIn = smoothstep(T.mt1In[0], T.mt1In[1], p);
      mtNode.style.opacity = (mtIn * (1 - smoothstep(T.mt1FadeFrom, 1, mo))).toFixed(3);

      // ---- HA 抗原 ----
      for (var i = 0; i < actors.length; i++) {
        var a = actors[i];
        if (a.cfg.park) {
          renderIdleHa(a, p);
        } else {
          renderBinder(a, p);
        }
      }

      // ---- DCZ：MT1 被解除之后，两颗分别落进两侧凹槽 ----
      for (var j = 0; j < dczs.length; j++) {
        renderDcz(dczs[j], p);
      }
    }

    /**
     * DCZ：膜外飞进来 → 落进凹槽 → 落定鼓一下 → 停住。
     *
     * 位置插值用 easeOutCubic（精准停住，不越过口袋），尺寸在落定段单独加一个
     * sin 鼓包（0 → 峰 → 0），读起来是「压进去了」而不是「飞过头又弹回来」。
     * 落定瞬间放一次扩散光环，把「结合」这一个事件从连续飞行里单独拎出来。
     */
    function renderDcz(o, p) {
      var t = seg(p, o.cfg.inWin[0], o.cfg.inWin[1]);
      var ef = easeOutCubic(seg(t, 0, DCZ.flyEnd));
      var hx = lerp(o.fx, o.dx, ef);
      var hy = lerp(o.fy, o.dy, ef)
        - Math.sin(Math.PI * seg(t, 0, DCZ.flyEnd)) * DCZ.wobble * size;
      var pop = Math.sin(Math.PI * seg(t, DCZ.flyEnd - 0.03, 1)) * DCZ.pop;
      var ds = lerp(DCZ.scaleFrom, DCZ.dockScale, ef) + pop;

      o.el.style.transform = 'translate(' + hx.toFixed(1) + 'px,' + hy.toFixed(1) + 'px) scale('
        + ds.toFixed(3) + ')';
      o.el.style.opacity = clamp01(t / 0.12).toFixed(3);

      var ht = seg(t, DCZ.flyEnd, 1);
      o.halo.style.transform = 'translate(' + o.dx.toFixed(1) + 'px,' + o.dy.toFixed(1)
        + 'px) scale(' + lerp(DCZ.haloFrom, DCZ.haloTo, easeOutCubic(ht)).toFixed(3) + ')';
      o.halo.style.opacity = (Math.sin(Math.PI * Math.pow(ht, 0.7)) * 0.9).toFixed(3);
    }

    /** 结合那颗：飞到 Nb 方块头顶后常驻，不再解离飞走 */
    function renderBinder(a, p) {
      var t = seg(p, a.cfg.win[0], a.cfg.win[1]);
      var te = easeOutBack(t);
      var hx = lerp(a.fx, a.dx, te) + Math.sin(Math.PI * t) * 0.008 * size;   // 两端归零的微摆
      var hy = lerp(a.fy, a.dy, te) - Math.sin(Math.PI * t) * 0.006 * size;

      // 越接近越大：0.82 → 1，制造「由远及近」的纵深；结合后维持不缩放、不旋转脱落
      var hs = a.cfg.scale * lerp(0.82, 1, clamp01(te));
      a.el.style.transform = 'translate(' + hx.toFixed(1) + 'px,' + hy.toFixed(1)
        + 'px) scale(' + hs.toFixed(3) + ')';
      // 飞入时淡入，结合后保持不淡出（停留 Nb 头顶）
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
      var raw = rawProgress();
      setFreeScroll(raw > 0 && raw < exitRaw());
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
      if (trackMQ) trackMQ.addEventListener('change', onTrackChange);
      return true;
    }

    function disarm() {
      if (!armed) return;
      armed = false;
      stage.classList.remove(ARMED);
      root.classList.remove(TRACK);
      setFreeScroll(false);
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
    if (!trackMQ || !trackMQ.matches || reducedMotion()) return;
    if (typeof requestAnimationFrame !== 'function') return;
    arm();
  });
})();
