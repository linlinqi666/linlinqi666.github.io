/* back-to-top.js — 全站「返回顶部」按钮行为
 *
 * 与 markup（partials/back-to-top.njk）/ 样式（css/components/back-to-top.css）配套：
 *   1) 滚过一屏（scrollY > 阈值）后给按钮打 .back-to-top--visible，滚回顶部自动隐藏；
 *   2) 点击平滑滚回顶部；prefers-reduced-motion 下直接跳（不做长动画）；
 *   3) 键盘可达（<button> + aria-label），隐藏时用 visibility 移出可聚焦序列；
 *   4) 只用被动滚动监听 + rAF 节流，不阻塞滚动；离开页面时解绑；
 *   5) 带 data-sticker-clear 的区块占住视口时让位（.back-to-top--yield）：这些区块
 *      把内容铺到右下角，按钮常驻会压住正文末行。
 */
(function () {
  'use strict';

  var SHOW_AFTER = 240;   // 滚过多少 px 后出现（≈一屏内的起手距离）

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

  function init() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;

    var ticking = false;

    function sync() {
      ticking = false;
      btn.classList.toggle('back-to-top--visible', window.scrollY > SHOW_AFTER);
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(sync);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    sync();   // 首屏若已带锚点跳转（#xxx）也能正确判定

    // 内容贴满右下角的区块：进入视口即让按钮隐去，离开后恢复
    var clearZones = document.querySelectorAll('[data-sticker-clear]');
    if (clearZones.length && 'IntersectionObserver' in window) {
      var inView = new Set();
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) inView.add(en.target);
          else inView.delete(en.target);
        });
        btn.classList.toggle('back-to-top--yield', inView.size > 0);
      }, { threshold: 0.55 });
      for (var z = 0; z < clearZones.length; z++) io.observe(clearZones[z]);
    }

    btn.addEventListener('click', function () {
      if (prefersReducedMotion() || typeof window.scrollTo !== 'function') {
        window.scrollTo(0, 0);
        return;
      }
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } catch (e) {
        window.scrollTo(0, 0);   // 极老浏览器：直接跳
      }
      // 收尾把焦点还给文档开头，键盘用户不会停在屏幕外的按钮上
      var main = document.querySelector('main');
      if (main) {
        main.setAttribute('tabindex', '-1');
        main.focus({ preventScroll: true });
      }
    });

    window.addEventListener('pagehide', function () {
      window.removeEventListener('scroll', onScroll);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
