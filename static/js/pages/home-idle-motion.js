/**
 * ============================================
 * iGEM SZPU-2026 - 首页离屏动画停表
 * ============================================
 *
 * @description
 *   scroll-snap 满屏分屏下，相邻屏虽然看不到，其 infinite 合成动画
 *   （hero 浮动、burden 背景漂移/呼吸、药丸轮播等）仍在合成器里持续跑，
 *   多屏叠加放大 GPU/合成开销——用户实测「第二屏计数、轮播优点屏」滚动卡顿。
 *
 *   行为：IO 观察每个 .presentation-section，完全离开视口（含 12% 缓冲带）
 *   → 打 data-offscreen；回到缓冲带内 → 摘除。CSS 侧统一
 *   `animation-play-state: paused`（见 index.css「首页离屏动画停表」段），
 *   回到视口从暂停点继续，不跳帧。
 *
 * @2026-10-05 修复「滚回来轮播停了」
 *   初版用 `threshold: 0` + `intersectionRatio === 0` 判定。实测 Chrome 在
 *   「相邻屏边界相切」（ratio 恰为 0 且 isIntersecting 仍为 true）状态下，
 *   进/出该状态都可能不产生 IO 回调——导致快速滚到相邻屏后 attr 残留，
 *   滚回来收不到恢复回调，药丸轮播卡在 paused。
 *   修复双保险：
 *   ① rootMargin 12% 缓冲带 + 布尔 isIntersecting 判定：相切态视为可见，
 *      离/进缓冲带是真正的 intersecting 翻转，IO 100% 可靠触发；
 *   ② 滚动节流兜底自检：已打 attr 的 section 若矩形与视口相交，立即摘除——
 *      无论 IO 行为如何，可见的 section 绝不会被停在 paused。
 *
 * @降级红线
 *   无 IO / 无 JS 时不打标，所有动画照常播放——本脚本只做性能增强，不接管可见性。
 */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    if (!('IntersectionObserver' in window)) return;
    var sections = document.querySelectorAll('.presentation-section');
    if (!sections.length) return;

    /* 12% 缓冲带：相邻屏相切停稳时仍算「可见」（不停表），
       完全离开视口再往外 12% 才算离屏。 */
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        if (e.isIntersecting) {
          e.target.removeAttribute('data-offscreen');
        } else {
          e.target.setAttribute('data-offscreen', '');
        }
      }
    }, { rootMargin: '12% 0px 12% 0px', threshold: 0 });

    for (var i = 0; i < sections.length; i++) {
      io.observe(sections[i]);
    }

    /* 兜底自检（滚回卡 paused 的最后一道保险）：
       节流扫描已打 attr 的 section，矩形与视口有交集就立即摘除。 */
    var pending = false;
    function sweep() {
      pending = false;
      var marked = document.querySelectorAll('.presentation-section[data-offscreen]');
      for (var i = 0; i < marked.length; i++) {
        var r = marked[i].getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) {
          marked[i].removeAttribute('data-offscreen');
        }
      }
    }
    window.addEventListener('scroll', function () {
      if (!pending) {
        pending = true;
        window.requestAnimationFrame(sweep);
      }
    }, { passive: true });
  });
})();
