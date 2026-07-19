/**
 * executive-summary-animation.js
 * 首页 Executive Summary 一次性滚动触发动画
 *
 * 功能：
 * - 监听页面滚动，当用户滚动到适当位置时触发一次性动画。
 * - 为 .badge-gpa1-label 添加 .animate-gpa1 类（标签左移）。
 * - 为 .badge-human 添加 .animate-human 类（human genes 图示淡入）。
 * - 动画仅触发一次，不随滚动反复执行。
 *
 * 动画流程：
 *   用户滚动到一定位置
 *     ↓
 *   检查是否已触发
 *     ↓
 *   添加 .animate-gpa1 → Gpa1 标签向左平移
 *   添加 .animate-human → human genes 淡入
 *
 * @version 1.0
 * @since 2026-06-15
 */
(function () {
  'use strict';

  const SECTION_SELECTOR = '#executive-summary';
  const TRIGGER_OFFSET = 0.3; // 进入视口 30% 时触发

  const state = {
    section: null,
    triggered: false,
    initialized: false,
    scrollHandler: null
  };

  function triggerAnimations() {
    if (state.triggered) return;
    state.triggered = true;

    const gpa1Label = document.querySelector('.badge-gpa1-label');
    const human = document.querySelector('.badge-human');

    if (gpa1Label) {
      gpa1Label.classList.add('animate-gpa1');
    }
    if (human) {
      human.classList.add('animate-human');
    }
  }

  function handleScroll() {
    if (!state.section || state.triggered) return;

    const rect = state.section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const triggerPoint = viewportHeight * (1 - TRIGGER_OFFSET);

    if (rect.top < triggerPoint) {
      triggerAnimations();
    }
  }

  function init() {
    if (state.initialized) return;

    state.section = document.querySelector(SECTION_SELECTOR);
    if (!state.section) return;

    state.scrollHandler = handleScroll;
    state.initialized = true;

    window.addEventListener('scroll', state.scrollHandler, { passive: true });

    // 初始检查（页面可能在加载时已滚动到该位置）
    handleScroll();
  }

  // 自动初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 页面卸载时清理
  window.addEventListener('beforeunload', function () {
    if (state.scrollHandler) {
      window.removeEventListener('scroll', state.scrollHandler);
    }
  });

  // 暴露公共 API
  window.ExecutiveSummaryAnimation = {
    init: init,
    trigger: triggerAnimations,
    reset: function () {
      state.triggered = false;
      const gpa1Label = document.querySelector('.badge-gpa1-label');
      const human = document.querySelector('.badge-human');
      if (gpa1Label) gpa1Label.classList.remove('animate-gpa1');
      if (human) human.classList.remove('animate-human');
    },
    getState: function () {
      return {
        initialized: state.initialized,
        triggered: state.triggered,
        hasSection: !!state.section
      };
    }
  };
})();