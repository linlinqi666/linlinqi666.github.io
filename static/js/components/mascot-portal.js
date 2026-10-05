/* mascot-portal.js — 吉祥物门户「触发即播完」逻辑（2026-10-04）
 *
 * 设计意图：hover / 键盘聚焦触发一次整圈旋转（CSS keyframes）；
 *   动画一旦开始，即便指针移出或失焦，也继续播完 —— 不在移出瞬间回退/停住。
 *
 * 实现要点（与 :hover 彻底解耦）：
 *   - mouseenter / focusin → 加 .is-spinning（跑 static/css/index.css 的 mascot-portal-spin）
 *   - mouseleave / blur → 一律不撤类
 *   - animationend → 才清除 .is-spinning，以便下次可重播
 *   - 幂等：动画进行中不重复触发（先移除再 reflow 再添加，确保可重播）
 *
 * 降级：无 JS / prefers-reduced-motion 下卡片仍是可用链接，只是没有旋转增强。
 */
(function () {
  'use strict';

  function play(img) {
    if (!img || img.classList.contains('is-spinning')) return;
    img.classList.remove('is-spinning');
    /* 强制 reflow，使"动画进行中再次进入"也能重新从头播放 */
    void img.offsetWidth;
    img.classList.add('is-spinning');
  }

  function bind(card) {
    var img = card.querySelector('.mascot-portal__img');
    if (!img) return;
    card.addEventListener('mouseenter', function () { play(img); });
    card.addEventListener('focusin', function () { play(img); });
    img.addEventListener('animationend', function () {
      img.classList.remove('is-spinning');
    });
  }

  function init() {
    var cards = document.querySelectorAll('.mascot-portal');
    for (var i = 0; i < cards.length; i++) bind(cards[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
