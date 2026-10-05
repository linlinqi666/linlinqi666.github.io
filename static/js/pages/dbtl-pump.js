/**
 * ============================================
 * iGEM SZPU-2026 - 首页 dbtl-cycle 屏「想法泵出」入场动画
 * ============================================
 *
 * @description
 *   用户创意：右侧「工作流程与原理示意图」看起来是从左边酵母吉祥物头部
 *   "泵出的想法"——以头部中心为图片的最小值点（scale ≈ 0.05），
 *   沿一条先向上弓起、再飞向右上的弧线移动到现有设计位置，过程中逐渐放大。
 *
 *   - 触发：首次滑入本屏（IntersectionObserver），每次页面加载只播一次；
 *     滑走再滑回不重播，刷新才重置。
 *   - 结束态：与 index.css 现有布局逐像素一致（收尾清内联样式交回 CSS）。
 *   - 降级红线：无 JS / prefers-reduced-motion / 无 IO / 无 WAAPI 时不接管
 *     任何可见性，页面直接呈现完整静态布局（隐藏类只由本脚本添加）。
 *   - 几何运行时量测（桌面与 ≤768px 两套定位数值通用）；量测放在进入视口的
 *     回调里并校验尺寸——mobile.css 的全局 `img { content-visibility: auto }`
 *     会让视口外图片拿到 0 高度矩形。
 *
 * 依赖：window.iGEMUtils（core/utils.js）；缺失时回退到 window.matchMedia。
 */
(function () {
  'use strict';

  var STAGE = '.art-stage--dbtl-cycle';
  var DIAGRAM = '.art--dbtl-cycle-diagram';
  var MASCOT = '.art--dbtl-cycle-mascot';
  var ARMED = 'js-pump-armed';
  var DONE = 'pump-done';

  /** 参数集中区（交付微调入口） */
  var T = {
    fly: 1150        // 单次飞行总时长（ms）
  };
  var HEAD = { x: 0.49, y: 0.36 };  // 头部中心在吉祥物图内的比例位置（对照素材量取）
  var START_SCALE = 0.05;           // 起始最小缩放（头部中心的最小值点）
  var EMERGE_SCALE = 0.08;          // 在头部浮现完成时的缩放
  var EMERGE_AT = 0.14;             // 浮现完成的时间点（占全程比例）
  var MID_AT = 0.45;                // 轨迹中段控制点的时间点
  var MID_PROGRESS = 0.42;          // 中段控制点沿主轨迹的位置（0=头部，1=终点）
  var MID_SCALE = 0.32;             // 中段缩放（“逐渐变大”的中间值）
  var BOW_UP = 0.06;                // 轨迹向上弓起量（占舞台高度比例，泵出感）

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

  function translateScale(dx, dy, scale) {
    return 'translate(' + dx.toFixed(2) + 'px, ' + dy.toFixed(2) + 'px) scale(' + scale.toFixed(4) + ')';
  }

  ready(function () {
    var stage = document.querySelector(STAGE);
    if (!stage) return;

    var section = stage.closest('section') || stage;
    var diagram = stage.querySelector(DIAGRAM);
    var mascot = stage.querySelector(MASCOT);
    if (!diagram || !mascot) return;

    // ---- 降级红线：能力不齐就不接管可见性 ----
    if (reducedMotion()
      || !('IntersectionObserver' in window)
      || typeof Element.prototype.animate !== 'function') {
      return;
    }

    var geo = null;          // { dx, dy, midX, midY }
    var done = false;
    var runningAnims = [];

    // ---- armed：只加类（CSS 负责 opacity:0 / z-index / will-change）----
    stage.classList.add(ARMED);

    // 吉祥物素材异常时放弃隐藏态，避免示意图永久不可见
    diagram.addEventListener('error', disarm);

    // ==================================================
    // 量测：头部中心（起点）与示意图中心（终点）都从实时 rect 取
    // ==================================================
    function measure() {
      var d = diagram.getBoundingClientRect();
      var m = mascot.getBoundingClientRect();
      // 宽或高为 0：图片未解码 / content-visibility 跳过布局 → 视为无效
      if (!d.width || !d.height || !m.width || !m.height) return false;

      var headX = m.left + m.width * HEAD.x;
      var headY = m.top + m.height * HEAD.y;
      var endX = d.left + d.width / 2;
      var endY = d.top + d.height / 2;
      var dx = headX - endX;                    // 隐藏态位移：中心叠到头部
      var dy = headY - endY;
      var stageH = stage.getBoundingClientRect().height || 1;

      // 中段控制点：沿主轨迹走到 MID_PROGRESS，再向上弓起 → “先冒头、再飞向右上”
      var rest = 1 - MID_PROGRESS;
      geo = {
        dx: dx,
        dy: dy,
        midX: dx * rest,
        midY: dy * rest - BOW_UP * stageH
      };
      return true;
    }

    function applyHiddenState() {
      if (!measure()) return false;
      diagram.style.transform = translateScale(geo.dx, geo.dy, START_SCALE);
      return true;
    }

    /** 等图片完成布局（content-visibility: auto 的图片在视口外没有真实尺寸） */
    function measureWhenReady(callback) {
      var attempts = 0;
      (function tick() {
        if (measure()) {
          callback(true);
          return;
        }
        attempts += 1;
        if (attempts > 30) {
          callback(false);
          return;
        }
        requestAnimationFrame(tick);
      })();
    }

    // ==================================================
    // 进入视口：量测 → 泵出
    // ==================================================
    var observer = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          observer.disconnect();
          onEnterView();
          return;
        }
      }
    }, { threshold: 0.45 });
    observer.observe(section);

    function onEnterView() {
      measureWhenReady(function (ok) {
        if (!ok) {
          // 量测失败（素材异常）：放弃隐藏态，恢复完整静态布局
          disarm();
          return;
        }
        applyHiddenState();
        pump();
        window.setTimeout(finish, T.fly + 90);
      });
    }

    function pump() {
      var anim = diagram.animate([
        { transform: translateScale(geo.dx, geo.dy, START_SCALE), opacity: 0, offset: 0 },
        // 在头部快速浮现（想法点亮），并微微放大
        { transform: translateScale(geo.dx, geo.dy, EMERGE_SCALE), opacity: 1, offset: EMERGE_AT },
        // 中段：沿弧线已离开头部，尺寸明显变大
        { transform: translateScale(geo.midX, geo.midY, MID_SCALE), opacity: 1, offset: MID_AT },
        // 终点：现有设计位置
        { transform: translateScale(0, 0, 1), opacity: 1, offset: 1 }
      ], {
        duration: T.fly,
        // 起步稍缓、末端减速：泵出的“喷发感” + 平稳落位
        easing: 'cubic-bezier(0.3, 0.7, 0.3, 1)',
        // 必须用 both：只用 backwards 时动画结束后效果失效，
        // 元素会回落到内联隐藏 transform + armed 的 opacity:0 → 到位后闪没（见 pitfalls A1）
        fill: 'both'
      });
      runningAnims.push(anim);
    }

    /**
     * 收尾：交回 CSS 布局——去隐藏类、清内联 transform、取消 WAAPI 动画。
     * 全部在同一帧内完成；末帧 == CSS 默认态，取消不产生跳变。
     */
    function finish() {
      done = true;
      stage.classList.remove(ARMED);
      stage.classList.add(DONE);
      diagram.style.transform = '';
      runningAnims.forEach(function (a) {
        try { a.cancel(); } catch (e) { /* 已取消则忽略 */ }
      });
      runningAnims = [];
      window.removeEventListener('resize', onResizeDebounced);
    }

    function disarm() {
      stage.classList.remove(ARMED);
      window.removeEventListener('resize', onResizeDebounced);
    }

    // ==================================================
    // 窗口尺寸变化：播放前重新量测（桌面 / ≤768px 两套定位数值）
    // ==================================================
    function onResize() {
      if (done) return;
      if (window.innerHeight === 0) return;
      applyHiddenState();
    }
    var onResizeDebounced = debounce(onResize, 180);
    window.addEventListener('resize', onResizeDebounced);
  });
})();
