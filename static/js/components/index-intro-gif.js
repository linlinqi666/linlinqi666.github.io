/**
 * index-intro-gif.js
 * 首页 GIF 开场动画控制器
 *
 * 行为：
 * - 首屏占满视口依次播放 up.GIF → overlook.GIF（各播完整一轮）。
 * - 播放期间 <html> 带 intro-gif-armed：滚动被锁定，导航栏 / 汉堡菜单 /
 *   进度条保持隐藏；两张 GIF 播完（或用户跳过）后移除锁定并让导航栏淡入。
 * - 无 JS、组件脚本加载失败或 prefers-reduced-motion 时都不播放，
 *   导航栏按原逻辑正常显示（降级安全）。
 *
 * 实现要点：
 * - 时长写在 data-duration 上（GIF 为无限循环，无法监听播放结束事件），
 *   提前 SWITCH_LEAD 毫秒切帧，避开 GIF 循环回跳的跳帧。
 * - 下一张用 new Image() 提前预取进 HTTP 缓存；切帧时才把 src 赋给
 *   <img>，保证动画从第 1 帧开始播放，且切换瞬间不空档。
 * - 每帧有下载超时兜底，任何一帧失败都直接跳过，绝不让导航栏被永久锁住。
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
      stepTimer = setTimeout(function () {
        play(index + 1);
      }, Math.max(0, frame.duration - SWITCH_LEAD));
    }

    function onSkip() {
      if (settled || finished) return;
      settled = true;
      clearTimeout(loadTimer);
      release();
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

    clearTimeout(stepTimer);
    clearTimeout(loadTimer);

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

  function init() {
    if (prefersReducedMotion()) return;

    overlay = document.getElementById('intro-gif');
    if (!overlay) return;

    // head 内同步脚本未 armed，或看门狗已判定降级：不播放
    if (!root.classList.contains(ARMED) || root.classList.contains(FINISHED)) return;

    collectFrames();
    if (!frames.length) return;

    root.classList.add(RUNNING);

    var skip = document.getElementById('intro-gif-skip');
    if (skip) {
      skip.addEventListener('click', finish);
    }
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' || event.key === 'Esc') finish();
    });

    play(0);
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
