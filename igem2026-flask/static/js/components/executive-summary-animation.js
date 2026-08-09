/**
 * executive-summary-animation.js
 * 首页 Executive Summary 滚动驱动动画 + 酵母屏动效 + 交互增强
 *
 * 功能：
 * - 监听页面滚动，根据 #executive-summary 在视口中的位置计算动画进度。
 * - section 高度为 300vh，主体 sticky 在 100vh~200vh 区间固定。
 * - 将进度写入 CSS 自定义属性 --es-progress，由 CSS 驱动：
 *     · 0.0 ~ 0.5：Gpa1 标签从徽章中心向左移动至最终位置。
 *     · 0.5 ~ 1.0：人源基因及其黑色背景块从完全透明渐显。
 * - 为 8 屏酵母插画应用现有 floatYeast 关键帧动画。
 * - Hero 打字机效果、滚动渐入（IntersectionObserver）与 Start Journey 平滑滚动。
 *
 * @version 3.0
 * @since 2026-07-22
 */
(function () {
  'use strict';

  const SECTION_SELECTOR = '#executive-summary';

  const state = {
    section: null,
    initialized: false,
    scrollHandler: null,
    resizeHandler: null,
    observer: null,
    rafId: null,
    rafPending: false
  };

  function updateProgress() {
    if (!state.section) return;

    const rect = state.section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

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

  // iGEM Layout Strategy: 用 requestAnimationFrame 合并滚动事件，避免每帧都读 DOM。
  function scheduleUpdate() {
    if (state.rafPending) return;
    state.rafPending = true;
    state.rafId = requestAnimationFrame(function () {
      state.rafPending = false;
      state.rafId = null;
      updateProgress();
    });
  }

  function attachListeners() {
    if (!state.scrollHandler) {
      state.scrollHandler = scheduleUpdate;
      state.resizeHandler = updateProgress;
    }
    window.addEventListener('scroll', state.scrollHandler, { passive: true });
    window.addEventListener('resize', state.resizeHandler, { passive: true });
    scheduleUpdate();
  }

  function detachListeners() {
    if (state.scrollHandler) {
      window.removeEventListener('scroll', state.scrollHandler, { passive: true });
      window.removeEventListener('resize', state.resizeHandler, { passive: true });
    }
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
      state.rafId = null;
      state.rafPending = false;
    }
  }

  function init() {
    if (state.initialized) return;

    state.section = document.querySelector(SECTION_SELECTOR);
    if (!state.section) return;

    state.initialized = true;

    // iGEM Layout Strategy: IntersectionObserver 只在 Executive Summary 接近视口时注册滚动监听，
    // 离开视口后立即移除，显著降低长页面其他区域滚动时的主线程占用。
    if ('IntersectionObserver' in window) {
      state.observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            attachListeners();
          } else {
            detachListeners();
          }
        });
      }, {
        rootMargin: '100px 0px 100px 0px',
        threshold: 0
      });
      state.observer.observe(state.section);
    } else {
      attachListeners();
    }

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
    detachListeners();
    if (state.observer && state.section) {
      state.observer.unobserve(state.section);
      state.observer = null;
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

/**
 * 8 屏酵母插画浮动动画
 *
 * 功能：
 * - 不再随机插入 SVG，而是为 index.html 中已有的 8 张酵母屏幕插画
 *   应用现有 floatYeast1~4 关键帧，保持画面呼吸感。
 * - 复用 index.css 中已定义的 floatYeast 关键帧。
 */
(function () {
  'use strict';

  function initScreenFloats() {
    const svgs = document.querySelectorAll('.yeast-screen__svg');
    svgs.forEach(function (svg, index) {
      const floatIndex = (index % 4) + 1;
      svg.style.animationName = 'floatYeast' + floatIndex;
      svg.style.animationDuration = (5 + Math.random() * 3).toFixed(2) + 's';
      svg.style.animationTimingFunction = 'ease-in-out';
      svg.style.animationIterationCount = 'infinite';
    });

    // 性能优化：酵母屏插画为无限浮动动画，离屏时暂停播放可显著减少
    // 后台标签页 / 长页面滚动时的 GPU 与合成开销，入屏立即恢复，视觉无差异。
    if ('IntersectionObserver' in window) {
      const floatObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          entry.target.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
        });
      }, { rootMargin: '120px 0px' });
      svgs.forEach(function (svg) { floatObserver.observe(svg); });
    }
  }

  function init() {
    initScreenFloats();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.YeastScreenFloat = {
    init: init
  };
})();

/**
 * Hero 打字机、滚动渐入与 Start Journey 平滑滚动
 */
(function () {
  'use strict';

  function initTypewriter() {
    const el = document.querySelector('.typewriter');
    if (!el) return;

    const text = el.getAttribute('data-text') || '';
    el.textContent = '';

    let i = 0;
    const speed = 55;
    function typeChar() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i += 1;
        setTimeout(typeChar, speed);
      }
    }
    typeChar();
  }

  function initReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initSmoothCTA() {
    const cta = document.querySelector('.yeast-screen__cta');
    if (!cta) return;

    cta.addEventListener('click', function (event) {
      const targetSelector = cta.getAttribute('href');
      if (!targetSelector || targetSelector.charAt(0) !== '#') return;

      const target = document.querySelector(targetSelector);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  function init() {
    initTypewriter();
    initReveal();
    initSmoothCTA();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* iGEM Check: [x] Executive summary animation preserved [x] floatYeast keyframes reused [x] Typewriter + reveal + smooth scroll [x] Reduced motion handled in CSS */