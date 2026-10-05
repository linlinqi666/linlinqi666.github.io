/* page-loader.js — 全站页级加载遮罩控制器（根站）
 *
 * 与 <head> 内同步执行的 page-loader-arm.js 配套：
 *   arm   —— 首帧即显示遮罩并锁滚动（防原生内容闪烁）
 *   本文件 —— 收集首屏关键插画 → 预加载 → 判定收尾 → 收起遮罩并派发 pageloader:done
 *
 * 收尾条件（详见 README 第十五/十六节）：
 *   DOM 就绪 AND 所有已登记关键图结清 AND 已过最小展示时长
 *   任一超时（MAX_WAIT / 单图 IMG_TIMEOUT）都强制收尾，绝不永久阻塞。
 *
 * 对外接口（IIFE，挂 window.PageLoader）：
 *   window.PageLoader.register(urls)  // 登记首屏关键图；字符串 | [url] | [[候选1,候选2]]
 *   window.PageLoader.done(cb)        // 收尾回调（首页 GIF 交接用）
 *   window.PageLoader.isDone()
 */
(function () {
  'use strict';

  var MIN_SHOW = 600;     // 最小展示时长（防闪烁），ms
  var MAX_WAIT = 8000;    // 全局强制收尾兜底，ms
  var IMG_TIMEOUT = 3000; // 单张关键图超时，ms
  var EXIT_BUFFER = 420;  // 淡出后清理 done 类的延迟，ms

  var root = document.documentElement;
  var overlay = null;
  var state = {
    start: now(),
    pending: 0,
    done: false,
    timer: 0
  };

  function now() {
    return (window.performance && window.performance.now)
      ? window.performance.now()
      : Date.now();
  }

  function prefersReducedMotion() {
    try {
      if (window.iGEMUtils && window.iGEMUtils.prefersReducedMotion) {
        return window.iGEMUtils.prefersReducedMotion();
      }
      return !!(window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (e) {
      return false;
    }
  }

  function warn(msg, extra) {
    if (window.console && console.warn) {
      console.warn('[PageLoader] ' + msg, extra || '');
    }
  }

  /* ---- 2026-10-05：原 probeFrames（探测两帧就绪后隐藏兜底三点）随
     fallback 三点一并移除——两帧循环即默认，帧图仍由 arm.js 预取。 ---- */

  /* ---- 声明式关键资源：<img data-critical> / [data-critical-bg] ---- */
  function collectFromDom() {
    var groups = [];
    var i;
    var imgs = document.querySelectorAll('img[data-critical]');
    for (i = 0; i < imgs.length; i++) {
      var u = imgs[i].currentSrc || imgs[i].getAttribute('src');
      if (u) groups.push([u]);
    }
    var bgs = document.querySelectorAll('[data-critical-bg]');
    for (i = 0; i < bgs.length; i++) {
      var raw = bgs[i].getAttribute('data-critical-bg') || '';
      if (!raw) continue;
      var m = raw.match(/url\(["']?([^"')]+)["']?\)/);
      groups.push([m ? m[1] : raw]);
    }
    return groups;
  }

  /* ---- 预加载：候选回退（首个成功者结清）+ 单图超时 ---- */
  function loadGroup(candidates) {
    if (!candidates || !candidates.length) return;
    state.pending++;

    var idx = 0;
    var settled = false;
    var timer = setTimeout(function () {
      if (settled) return;
      settled = true;
      state.pending--;
      warn('critical image timeout', candidates[0]);
      evaluate();
    }, IMG_TIMEOUT);

    function settle() {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      state.pending--;
      evaluate();
    }

    function next() {
      if (settled) return;
      if (idx >= candidates.length) {
        warn('critical image failed', candidates.join(' | '));
        settle();
        return;
      }
      var img = new Image();
      img.onload = settle;
      img.onerror = function () { idx++; next(); };
      img.src = candidates[idx];
    }

    next();
  }

  /* ---- 收尾判定（幂等） ---- */
  function evaluate() {
    if (state.done) return;

    var elapsed = now() - state.start;
    if (elapsed >= MAX_WAIT) return finish('timeout');

    var domReady = document.readyState !== 'loading';
    var minShow = prefersReducedMotion() ? 0 : MIN_SHOW;

    if (domReady && state.pending === 0 && elapsed >= minShow) {
      return finish('ready');
    }

    var wait = Math.min(
      Math.max(minShow - elapsed, 40),
      Math.max(MAX_WAIT - elapsed, 40)
    );
    clearTimeout(state.timer);
    state.timer = setTimeout(evaluate, wait);
  }

  function finish(reason) {
    if (state.done) return;
    state.done = true;
    clearTimeout(state.timer);

    root.classList.remove('page-loader-armed');
    root.classList.add('page-loader-done');
    if (overlay) overlay.setAttribute('aria-hidden', 'true');

    setTimeout(function () {
      root.classList.remove('page-loader-done');
    }, EXIT_BUFFER);

    var detail = { reason: reason };
    try {
      document.dispatchEvent(new CustomEvent('pageloader:done', { detail: detail }));
    } catch (e) {
      try {
        var ev = document.createEvent('CustomEvent');
        ev.initCustomEvent('pageloader:done', false, false, detail);
        document.dispatchEvent(ev);
      } catch (e2) { /* 极端环境忽略 */ }
    }
  }

  window.PageLoader = {
    /** 登记首屏关键图。字符串 | [url] | [[候选1, 候选2]] */
    register: function (urls) {
      if (!urls) return;
      var groups = [];
      if (typeof urls === 'string') {
        groups = [[urls]];
      } else if (Object.prototype.toString.call(urls) === '[object Array]') {
        if (urls.length && Object.prototype.toString.call(urls[0]) === '[object Array]') {
          groups = urls;
        } else {
          for (var i = 0; i < urls.length; i++) groups.push([urls[i]]);
        }
      }
      for (var g = 0; g < groups.length; g++) loadGroup(groups[g]);
      evaluate();
    },
    /** 收尾回调（已收尾则同步执行） */
    done: function (cb) {
      if (typeof cb !== 'function') return;
      if (state.done) { try { cb(); } catch (e) {} return; }
      document.addEventListener('pageloader:done', function () {
        try { cb(); } catch (e) {}
      }, { once: true });
    },
    isDone: function () { return state.done; },
    MIN_SHOW: MIN_SHOW,
    MAX_WAIT: MAX_WAIT
  };

  function init() {
    overlay = document.getElementById('page-loader');
    var groups = collectFromDom();
    for (var i = 0; i < groups.length; i++) loadGroup(groups[i]);
    evaluate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
