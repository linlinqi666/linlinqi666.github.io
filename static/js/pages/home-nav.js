/**
 * home-nav.js
 * 首页（html.home-scroll-snap）专属导航与底部吸附行为。
 *
 * 背景：全站 nav-scroll-behavior.js 的"下滚收起 / 上滚弹出"在首页会与 scroll-snap
 *       吸附屏冲突——向上滚动浏览内容时会把固定顶栏弹出，遮挡画面。
 *       首页改为由 hover 呼出，并让底部 footer 脱离吸附以便自由浏览。
 *
 * 行为：
 * 1. 导航栏默认收起（由 nav-scroll-behavior.js 在 home-page 下 hideNav 初始化）。
 *    鼠标移入「距顶部 <150px 的触发带」或悬停于导航栏上时呼出；
 *    移出触发带且不在导航栏上即收起。这样上滚浏览内容时不会弹出遮挡。
 * 2. 底部 footer 进入视口后把 scroll-snap-type 切为 none（脱离吸附），
 *    允许自由滚动浏览 footer；离开 footer 区域恢复 y mandatory。
 *
 * 依赖：nav-scroll-behavior.js 已在 home-page 下停用方向性收起/弹出（见其 handleScroll），
 *       并将 isHomePage 存入 state，避免本脚本与滚动方向逻辑打架。
 */
(function () {
  'use strict';

  var root = document.documentElement;
  if (!root.classList.contains('home-scroll-snap')) return; // 仅作用于首页

  var isMobile = window.matchMedia('(max-width: 768px)').matches;
  var nav = document.querySelector('nav');
  if (!nav) return;

  var REVEAL_ZONE = 150; // 距顶部触发带高度（px）

  // ===== 1. hover 呼出 / 移出收起（桌面端） =====
  if (!isMobile) {
    var rafId = null;
    var lastY = null;

    var lastEvent = null;
    function applyHover() {
      rafId = null;
      if (lastY === null) return;
      // 鼠标悬停于导航子树（含展开的下拉菜单）时保持显示，避免菜单被收起
      var overNav = !!(lastEvent && lastEvent.target && lastEvent.target.closest &&
        lastEvent.target.closest('nav'));
      if (lastY < REVEAL_ZONE || overNav) {
        nav.classList.remove('nav-hidden');
        root.classList.remove('nav-collapsed');
      } else {
        nav.classList.add('nav-hidden');
        root.classList.add('nav-collapsed');
      }
    }

    document.addEventListener('mousemove', function (e) {
      lastY = e.clientY;
      lastEvent = e;
      if (!rafId) rafId = requestAnimationFrame(applyHover);
    });
    // 指针离开文档（如移到浏览器 chrome / 地址栏）时收起，避免悬停残影
    document.addEventListener('mouseleave', function () {
      nav.classList.add('nav-hidden');
      root.classList.add('nav-collapsed');
    });
  }

})();
