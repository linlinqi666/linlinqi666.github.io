/**
 * home-nav.js
 * 首页（html.home-scroll-snap）专属导航行为。
 *
 * 背景：全站 nav-scroll-behavior.js 的"下滚收起 / 上滚弹出"在首页会与 scroll-snap
 *       吸附屏冲突——向上滚动浏览内容时会把固定顶栏弹出，遮挡画面。
 *       首页改为由 hover 呼出，并让底部 footer 脱离吸附以便自由浏览。
 *
 * 行为：
 * 1. 导航栏默认收起（由 nav-scroll-behavior.js 在 home-page 下 hideNav 初始化）。
 *    鼠标移入「距顶部 <150px 的触发带」或悬停于导航栏上时呼出；
 *    移出触发带且不在导航栏上即收起。这样上滚浏览内容时不会弹出遮挡。
 * 2. 一次性保底（2026-10-21 用户要求）：首屏（GIF 开场结束）后 3 秒内无滚动，
 *    自动弹出顶部导航栏且保持显示（不收回），避免评委不知道导航栏存在。
 *    保底已触发时导航栏改由滚动方向控制：下滚收回、上滑弹出。
 *    3 秒内发生过滚动则保底取消，维持 hover 呼出逻辑；保底只触发一次。
 *
 * 依赖：nav-scroll-behavior.js 已在 home-page 下停用方向性收起/弹出（见其 handleScroll），
 *       并将 isHomePage 存入 state，避免本脚本与滚动方向逻辑打架。
 */
(function () {
  'use strict';

  var root = document.documentElement;
  if (!root.classList.contains('home-scroll-snap')) return; // 仅作用于首页

  var nav = document.querySelector('nav');
  if (!nav) return;

  var isMobile = window.matchMedia('(max-width: 768px)').matches;
  var REVEAL_ZONE = 150; // 距顶部触发带高度（px）
  var PIN_DELAY = 3000; // 首屏无滚动保底时长（ms）
  var SCROLL_THRESHOLD = 80; // 与全站 nav-scroll-behavior.js 一致的滚动方向阈值（px）
  var GIF_MAX_WAIT = 12000; // 开场动画最长时长 + 收尾余量（ms）

  var pinned = false; // 保底已触发：导航栏不再随鼠标移出收起，改由滚动方向控制
  var fallbackDone = false; // 保底只触发一次的标记
  var armTimer = null; // 保底计时器
  var fallbackClockStarted = false;
  var lastPinY = 0; // 保底后方向性控制的滚动基准

  function navHide() {
    nav.classList.add('nav-hidden');
    root.classList.add('nav-collapsed');
  }

  function navShow() {
    nav.classList.remove('nav-hidden');
    root.classList.remove('nav-collapsed');
  }

  // ===== 1. hover 呼出 / 移出收起（桌面端） =====
  if (!isMobile) {
    var rafId = null;
    var lastY = null;

    var lastEvent = null;
    function applyHover() {
      rafId = null;
      if (lastY === null) return;
      if (pinned) return; // 保底已触发：导航栏不随鼠标移出收起
      // 鼠标悬停于导航子树（含展开的下拉菜单）时保持显示，避免菜单被收起
      var overNav = !!(lastEvent && lastEvent.target && lastEvent.target.closest &&
        lastEvent.target.closest('nav'));
      if (lastY < REVEAL_ZONE || overNav) {
        navShow();
      } else {
        navHide();
      }
    }

    document.addEventListener('mousemove', function (e) {
      lastY = e.clientY;
      lastEvent = e;
      if (!rafId) rafId = requestAnimationFrame(applyHover);
    });
    // 指针离开文档（如移到浏览器 chrome / 地址栏）时收起，避免悬停残影
    document.addEventListener('mouseleave', function () {
      if (pinned) return;
      navHide();
    });
  }

  // ===== 2. 一次性保底：首屏 3 秒无滚动 → 弹出导航栏且保持显示 =====
  function getScrollY() {
    return window.pageYOffset || document.documentElement.scrollTop;
  }

  function cancelUserScrollWatch() {
    document.removeEventListener('wheel', onUserScroll);
    document.removeEventListener('touchstart', onUserScroll);
    document.removeEventListener('touchmove', onUserScroll);
    document.removeEventListener('keydown', onNavKey);
  }

  function cancelFallback() {
    if (armTimer) clearTimeout(armTimer);
    armTimer = null;
    fallbackDone = true; // 用户已滚动：保底不再触发
    cancelUserScrollWatch();
  }

  // 键盘翻页/滚动键视为用户滚动（scroll-snap 页面键盘也可滚动）
  function onNavKey(e) {
    if (e.key === ' ' || e.key === 'PageUp' || e.key === 'PageDown' ||
      e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Home' || e.key === 'End') {
      onUserScroll();
    }
  }

  // 只认「用户主动滚动」：滚轮 / 触摸 / 滚动键。
  // 不用 scroll 事件判定——scroll-snap 吸附、程序性 scrollTo 等非用户滚动
  // 也会触发 scroll 事件，会把保底误判为"用户已滚动"而取消。
  function onUserScroll() {
    // 开场动画播放期间（finished 之前）页面锁定滚动，不计入"用户滚动"。
    // finished 后即使 armed 类残留 450ms（收尾延时移除），也要开始计。
    if (!root.classList.contains('intro-gif-finished') &&
      (root.classList.contains('intro-gif-armed') ||
        root.classList.contains('intro-gif-running'))) return;
    cancelFallback();
  }

  function armFallbackClock() {
    if (fallbackClockStarted || isMobile || fallbackDone) return;
    fallbackClockStarted = true;
    armTimer = setTimeout(function () {
      armTimer = null;
      if (fallbackDone || pinned) return;
      triggerFallback();
    }, PIN_DELAY);
    document.addEventListener('wheel', onUserScroll, { passive: true });
    document.addEventListener('touchstart', onUserScroll, { passive: true });
    document.addEventListener('touchmove', onUserScroll, { passive: true });
    document.addEventListener('keydown', onNavKey);
  }

  function triggerFallback() {
    if (fallbackDone || pinned) return;
    pinned = true;
    fallbackDone = true;
    lastPinY = getScrollY();
    navShow();
    cancelUserScrollWatch();
  }

  // 开场动画播放中：等 intro-gif-finished 再起保底时钟；未播放则立即起表。
  // 站内跳转 / 无 JS / prefers-reduced-motion 时不加 intro-gif-armed，
  // 直接按"首屏已就绪"处理。
  function startFallbackClock() {
    if (fallbackClockStarted || isMobile) return;
    if (!root.classList.contains('intro-gif-armed') ||
      root.classList.contains('intro-gif-finished')) {
      armFallbackClock();
      return;
    }
    var mo = new MutationObserver(function () {
      if (root.classList.contains('intro-gif-finished')) {
        mo.disconnect();
        armFallbackClock();
      }
    });
    mo.observe(root, { attributes: true, attributeFilter: ['class'] });
    // 兜底：观察器失效时按 GIF 最长总时长（9.2s + 收尾）后照常起表
    window.setTimeout(function () { mo.disconnect(); }, GIF_MAX_WAIT);
    window.setTimeout(function () {
      if (!fallbackClockStarted) armFallbackClock();
    }, GIF_MAX_WAIT);
  }

  // ===== 3. 保底触发后的方向性滚动控制：下滚收回、上滑弹出 =====
  function onPinScroll() {
    if (!pinned) return;
    var y = getScrollY();
    var delta = y - lastPinY;
    if (Math.abs(delta) >= SCROLL_THRESHOLD) {
      if (delta > 0) {
        navHide();
      } else {
        navShow();
      }
      lastPinY = y;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      startFallbackClock();
      document.addEventListener('scroll', onPinScroll, { passive: true });
    });
  } else {
    startFallbackClock();
    document.addEventListener('scroll', onPinScroll, { passive: true });
  }
})();
