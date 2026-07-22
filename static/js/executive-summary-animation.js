/**
 * executive-summary-animation.js
 * 首页 Executive Summary 滚动驱动动画
 *
 * 功能：
 * - 监听页面滚动，根据 #executive-summary 在视口中的位置计算动画进度。
 * - section 高度为 300vh，主体 sticky 在 100vh~200vh 区间固定。
 * - 将进度写入 CSS 自定义属性 --es-progress，由 CSS 驱动：
 *     · 0.0 ~ 0.5：Gpa1 标签从徽章中心向左移动至最终位置。
 *     · 0.5 ~ 1.0：人源基因及其黑色背景块从完全透明渐显。
 *
 * @version 2.0
 * @since 2026-07-22
 */
(function () {
  'use strict';

  const SECTION_SELECTOR = '#executive-summary';

  const state = {
    section: null,
    initialized: false,
    scrollHandler: null,
    resizeHandler: null
  };

  function updateProgress() {
    if (!state.section) return;

    const rect = state.section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const sectionHeight = state.section.offsetHeight;

    // section 为 300vh，固定主体在 50vh~250vh 区间显隐（200vh 动画窗口），
    // 动画进度：section 顶部离开视口 50vh 时开始，离开 250vh 时结束。
    const pinStart = viewportHeight / 2;
    const pinEnd = 2.5 * viewportHeight;
    const scrollWithinSection = -rect.top;

    let progress = 0;
    if (pinEnd > pinStart) {
      progress = (scrollWithinSection - pinStart) / (pinEnd - pinStart);
    }

    progress = Math.max(0, Math.min(1, progress));
    state.section.style.setProperty('--es-progress', progress.toFixed(4));

    const inner = state.section.querySelector('.executive-summary__inner');
    if (inner) {
      const isVisible = scrollWithinSection >= pinStart && scrollWithinSection <= pinEnd;
      inner.classList.toggle('executive-summary__inner--visible', isVisible);
    }
  }

  function handleScroll() {
    updateProgress();
  }

  function init() {
    if (state.initialized) return;

    state.section = document.querySelector(SECTION_SELECTOR);
    if (!state.section) return;

    state.scrollHandler = handleScroll;
    state.resizeHandler = updateProgress;
    state.initialized = true;

    window.addEventListener('scroll', state.scrollHandler, { passive: true });
    window.addEventListener('resize', state.resizeHandler, { passive: true });

    // 初始检查（页面可能在加载时已滚动到该位置）
    updateProgress();
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
    if (state.resizeHandler) {
      window.removeEventListener('resize', state.resizeHandler);
    }
  });

  // 暴露公共 API
  window.ExecutiveSummaryAnimation = {
    init: init,
    trigger: function () {
      if (state.section) state.section.style.setProperty('--es-progress', '1');
    },
    reset: function () {
      if (state.section) state.section.style.setProperty('--es-progress', '0');
    },
    getState: function () {
      return {
        initialized: state.initialized,
        hasSection: !!state.section,
        progress: state.section
          ? parseFloat(state.section.style.getPropertyValue('--es-progress') || '0')
          : 0
      };
    }
  };
})();
