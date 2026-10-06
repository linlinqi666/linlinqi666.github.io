/**
 * index-intro-gif.js
 * 首页 GIF 开场动画控制器
 *
 * 行为：
 * - 首屏占满视口播放 boot animation.GIF（播完整一轮）。
 * - 播放期间 <html> 带 intro-gif-armed：滚动被锁定，导航栏 / 汉堡菜单 /
 *   进度条保持隐藏；GIF 播完（或用户跳过）后移除锁定并让导航栏淡入。
 * - 无 JS、组件脚本加载失败或 prefers-reduced-motion 时都不播放，
 *   导航栏按原逻辑正常显示（降级安全）。
 *
 * 实现要点：
 * - 时长写在 data-duration 上（GIF 为无限循环，无法监听播放结束事件），
 *   提前 SWITCH_LEAD 毫秒切帧，避开 GIF 循环回跳的跳帧。
 * - 下一张用 new Image() 提前预取进 HTTP 缓存；切帧时才把 src 赋给
 *   <img>，保证动画从第 1 帧开始播放，且切换瞬间不空档。
 * - 每帧有下载超时兜底，绝不让导航栏被永久锁住。
 * - 末帧加载/解码失败时不再提前结束整段动画：交由“总时长”兜底，
 *   继续展示上一帧直到收尾，避免“播一半就消失”（常见于超大 GIF 在
 *   浏览器/部署环境下加载失败）。
 *
 * @since 2026-09-04
 */
(function () {
  'use strict';

  var ARMED = 'intro-gif-armed';
  var RUNNING = 'intro-gif-running';
  var FINISHED = 'intro-gif-finished';

  var SWITCH_LEAD = 200; // 提前切帧，避开 GIF 循环回跳
  var LOAD_TIMEOUT = 20000; // 单帧下载/解码最长等待，超时跳过该帧
  var FADE_DURATION = 450; // 与 CSS --duration-slow(0.4s) 对齐的收尾时间

  var root = document.documentElement;
  var overlay = null;
  var frames = [];
  var stepTimer = null;
  var loadTimer = null;
  var masterFinishTimer = null; // 总时长兜底：即使末帧失败也不会提前收尾
  var finished = false;

  function prefersReducedMotion() {
    return window.iGEMUtils && window.iGEMUtils.prefersReducedMotion
      ? window.iGEMUtils.prefersReducedMotion()
      : false;
  }

  function collectFrames() {
    var nodes = overlay ? overlay.querySelectorAll('.intro-gif__frame') : [];
    frames = Array.prototype.slice.call(nodes)
      .map(function (el) {
        return {
          el: el,
          src: el.getAttribute('data-gif-src') || '',
          duration: parseInt(el.getAttribute('data-duration'), 10) || 5000,
          preloaded: false
        };
      })
      .filter(function (frame) {
        return !!frame.src;
      });
  }

  // 预取到 HTTP 缓存：切帧时再赋给 <img>，使 GIF 从头开始播放
  function preload(frame) {
    if (!frame || frame.preloaded) return;
    frame.preloaded = true;
    var img = new Image();
    img.decoding = 'async';
    img.src = frame.src;
  }

  function activate(frame) {
    var previous = overlay.querySelector('.intro-gif__frame.is-active');
    if (previous && previous !== frame.el) {
      previous.classList.remove('is-active');
    }
    frame.el.classList.add('is-active');
    overlay.classList.add('is-playing');
  }

  function play(index) {
    if (finished) return;
    if (index >= frames.length) {
      finish();
      return;
    }

    var frame = frames[index];
    var settled = false;

    clearTimeout(stepTimer);
    clearTimeout(loadTimer);

    function release() {
      frame.el.removeEventListener('load', onReady);
      frame.el.removeEventListener('error', onSkip);
    }

    function onReady() {
      if (settled || finished) return;
      settled = true;
      clearTimeout(loadTimer);
      release();
      activate(frame);
      // 当前帧已开播，再预取下一帧，避免与本帧争抢带宽
      preload(frames[index + 1]);
      // 2026-10-06 弱网修复：总时长兜底改为「首帧真正开播后」才起算。
      // 原实现 start() 即启动 masterFinishTimer，弱网下 GIF 尚未下载完，
      // 9.2s 一到就会把还没播的 GIF 直接掐掉（用户实测「GIF 被挤掉」）。
      if (!masterFinishTimer) {
        var total = frames.reduce(function (sum, f) {
          return sum + f.duration;
        }, 0);
        masterFinishTimer = setTimeout(finish, total);
      }
      stepTimer = setTimeout(function () {
        play(index + 1);
      }, Math.max(0, frame.duration - SWITCH_LEAD));
    }

    function onSkip() {
      if (settled || finished) return;
      settled = true;
      clearTimeout(loadTimer);
      release();
      // 2026-10-06：唯一帧（首帧）加载失败时直接收尾进页面，绝不永久锁屏；
      // 多帧场景的末帧失败仍交由总时长兜底继续展示上一帧。
      if (index + 1 >= frames.length) {
        if (!masterFinishTimer) finish();
        return;
      }
      play(index + 1);
    }

    loadTimer = setTimeout(onSkip, LOAD_TIMEOUT);

    frame.el.addEventListener('load', onReady);
    frame.el.addEventListener('error', onSkip);
    frame.el.src = frame.src;
  }

  function finish() {
    if (finished) return;
    finished = true;

    // 2026-10-06：收尾时撤下等待标志，head 看门狗按正常路径处理
    window.__introGifWaiting = false;

    clearTimeout(stepTimer);
    clearTimeout(loadTimer);
    clearTimeout(masterFinishTimer);

    overlay.classList.add('intro-gif--hiding');
    root.classList.add(FINISHED);

    setTimeout(function () {
      // 释放解码帧，避免大体积 GIF 长期占用内存
      frames.forEach(function (frame) {
        frame.el.classList.remove('is-active');
        frame.el.removeAttribute('src');
      });
      overlay.hidden = true;
      root.classList.remove(RUNNING);
      root.classList.remove(ARMED);
    }, FADE_DURATION);
  }

  /**
   * 与全站加载遮罩（page-loader.js）交接：先播页面加载动画，收尾后再播 GIF 开场。
   * 遮罩未启用时立即开始；另设硬兜底（HANDOFF_MAX），
   * 即使 pageloader:done 事件丢失（脚本缺失/异常）也不会永久卡住。
   */
  function whenLoaderReady(cb) {
    var started = false;
    var HANDOFF_MAX = 10000;
    function go() {
      if (started) return;
      started = true;
      cb();
    }

    if (root.classList.contains('page-loader-armed')) {
      document.addEventListener('pageloader:done', go);
      setTimeout(go, HANDOFF_MAX);
      return;
    }
    go();
  }

  function start() {
    if (finished) return;

    // 2026-10-06：已进入播放流程，撤下「组件在等 GIF」标志（head 看门狗据此放行）
    window.__introGifWaiting = false;

    root.classList.add(RUNNING);

    var skip = document.getElementById('intro-gif-skip');
    if (skip) {
      skip.addEventListener('click', finish);
    }
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' || event.key === 'Esc') finish();
    });

    // 总时长兜底已移至 onReady（首帧真正开播后起算），见 play() 内 2026-10-06 注释。
    play(0);
  }

  function init() {
    if (prefersReducedMotion()) return;

    overlay = document.getElementById('intro-gif');
    if (!overlay) return;

    // head 内同步脚本未 armed，或看门狗已判定降级：不播放
    if (!root.classList.contains(ARMED) || root.classList.contains(FINISHED)) return;

    collectFrames();
    if (!frames.length) return;

    // 2026-10-06 弱网修复：挂出「组件在等 GIF」标志——head 看门狗看到它
    // 就不再按 6s 强判 finished（原实现弱网下 GIF 还没下完就被挤掉）。
    // 撤除时机：start() / finish()。组件自身仍有 20s 单帧超时兜底。
    window.__introGifWaiting = true;

    // 2026-10-06 弱网修复：首帧 GIF 立即预取，与 page-loader 的关键图下载并行。
    // 原实现要等 loader 收尾后才在 play(0) 里发起 GIF 请求，弱网下 GIF
    // 下载被整体后移，入场动画必然被压缩甚至跳过。
    preload(frames[0]);

    whenLoaderReady(start);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.IndexIntroGif = {
    skip: finish,
    isFinished: function () {
      return finished;
    }
  };
})();
