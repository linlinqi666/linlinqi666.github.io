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
 *   window.PageLoader.register(urls[, opts])  // 登记首屏关键图；字符串 | [url] | [[候选1,候选2]]
 *   window.PageLoader.done(cb)        // 收尾回调（首页 GIF 交接用）
 *   window.PageLoader.isDone()
 *   window.PageLoader.whenIdle(cb)    // 页面全部资源就绪（window load）回调；已就绪则同步执行
 *   window.PageLoader.gate([opts])    // 二次门控：重新显示遮罩直到页面就绪或超时
 *                                    //（首页开场动画放完、页面资源仍未就绪时回显加载动画用）
 */
(function () {
  'use strict';

  var MIN_SHOW = 600;     // 最小展示时长（防闪烁），ms
  var MAX_WAIT = 12000;   // 全局强制收尾兜底，ms
  var IMG_TIMEOUT = 3000; // 单张关键图默认超时，ms
  var EXIT_BUFFER = 420;  // 淡出后清理 done 类的延迟，ms

  var root = document.documentElement;
  var overlay = null;
  var gateTimer = null;   // 二次门控计时器（开场动画收尾时的页面就绪等待）
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
  function loadGroup(candidates, timeout) {
    if (!candidates || !candidates.length) return;
    state.pending++;

    var idx = 0;
    var settled = false;
    var limit = (typeof timeout === 'number' && timeout > 0) ? timeout : IMG_TIMEOUT;
    var timer = setTimeout(function () {
      if (settled) return;
      settled = true;
      state.pending--;
      warn('critical image timeout', candidates[0]);
      evaluate();
    }, limit);

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

  /* ---- 2026-10-16：页面脚本请求是否全部结清（Resource Timing 判定）----
     readyState 推到 'interactive' 只代表解析器走完文档；defer 脚本可能还在
     网络队列里排队（弱网实测排队 44s，期间用户翻页看到无动画静态降级页）。
     正常网络下脚本毫秒级结清，本检查不增加任何等待。 */
  function allScriptsSettled() {
    var loaded = {};
    var entries = performance.getEntriesByType('resource');
    for (var i = 0; i < entries.length; i++) loaded[entries[i].name] = true;
    var scripts = document.querySelectorAll('script[src]');
    for (var j = 0; j < scripts.length; j++) {
      if (!loaded[scripts[j].src]) return false;
    }
    return true;
  }

  /* ---- 收尾判定（幂等） ---- */
  function evaluate() {
    if (state.done) return;

    var elapsed = now() - state.start;
    if (elapsed >= MAX_WAIT) return finish('timeout');

    var domReady = document.readyState !== 'loading';
    var scriptsSettled = allScriptsSettled();
    var minShow = prefersReducedMotion() ? 0 : MIN_SHOW;

    if (domReady && scriptsSettled && state.pending === 0 && elapsed >= minShow) {
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
    if (gateTimer) {
      clearTimeout(gateTimer);
      gateTimer = null;
    }

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
    register: function (urls, opts) {
      if (!urls) return;
      var groups = [];
      var timeout = opts && typeof opts.timeout === 'number' ? opts.timeout : 0;
      if (typeof urls === 'string') {
        groups = [[urls]];
      } else if (Object.prototype.toString.call(urls) === '[object Array]') {
        if (urls.length && Object.prototype.toString.call(urls[0]) === '[object Array]') {
          groups = urls;
        } else {
          for (var i = 0; i < urls.length; i++) groups.push([urls[i]]);
        }
      }
      for (var g = 0; g < groups.length; g++) loadGroup(groups[g], timeout);
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
    /** 页面全部资源就绪（window load）回调；已就绪则同步执行 */
    whenIdle: function (cb) {
      if (typeof cb !== 'function') return;
      if (document.readyState === 'complete') { try { cb(); } catch (e) {} return; }
      window.addEventListener('load', function () {
        try { cb(); } catch (e) {}
      }, { once: true });
    },
    /**
     * 二次门控（2026-10-16）：开场动画已结束、但页面资源仍未就绪时，
     * 重新显示加载遮罩（加载动画），直到 window load 或超时后再收尾。
     * 幂等：已有门控在进行中则直接复用，不会叠加多个遮罩周期。
     */
    gate: function (opts) {
      var timeout = opts && typeof opts.timeout === 'number' ? opts.timeout : MAX_WAIT;
      if (gateTimer) return;
      root.classList.remove('page-loader-done');
      root.classList.add('page-loader-armed');
      if (overlay) overlay.removeAttribute('aria-hidden');
      state.done = false;
      clearTimeout(state.timer);
      whenIdle(function () {
        if (!state.done) finish('gate-idle');
      });
      gateTimer = setTimeout(function () {
        gateTimer = null;
        if (!state.done) finish('gate-timeout');
      }, timeout);
    },
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
