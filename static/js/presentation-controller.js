/**
 * 首页沉浸式展示控制器
 * - 管理 presentation-section 进入/离开视口状态
 * - 触发动画元素 (.anim-*) 的 .is-visible
 * - 更新右侧圆点指示器
 * - 键盘方向键/Page/Home/End 导航
 * - 控制基因敲除动画播放/暂停
 * - 与现有 page-progress-bar.js、scroll-progress-bar.js、nav-scroll-behavior.js 共存
 */
(function () {
  'use strict';

  const CONFIG = {
    sectionSelector: '.presentation-section',
    animateSelector: '[data-animate]',
    indicatorSelector: '.section-indicator',
    currentClass: 'is-current',
    visibleClass: 'is-visible',
    rootMargin: '-45% 0px -45% 0px',
    threshold: 0.1
  };

  const state = {
    sections: [],
    indicators: [],
    observer: null,
    currentIndex: 0
  };

  const utils = {
    getSections() {
      return Array.from(document.querySelectorAll(CONFIG.sectionSelector));
    },
    isInputFocused() {
      const tagName = document.activeElement?.tagName;
      return ['INPUT', 'TEXTAREA', 'SELECT'].includes(tagName);
    }
  };

  function init() {
    state.sections = utils.getSections();
    if (state.sections.length === 0) {
      console.warn('[PresentationController] 未找到 .presentation-section');
      return;
    }

    initObserver();
    initIndicators();
    initKeyboard();
    initHashSync();
    initKnockoutAnimation();
  }

  function initObserver() {
    state.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const section = entry.target;
        const animateEls = section.querySelectorAll(CONFIG.animateSelector);

        if (entry.isIntersecting) {
          section.classList.add(CONFIG.currentClass);
          animateEls.forEach(el => el.classList.add(CONFIG.visibleClass));
          section.dispatchEvent(new CustomEvent('section:enter', { detail: { section } }));
        } else {
          section.classList.remove(CONFIG.currentClass);
          section.dispatchEvent(new CustomEvent('section:leave', { detail: { section } }));
        }
      });

      updateCurrentSection();
    }, {
      rootMargin: CONFIG.rootMargin,
      threshold: CONFIG.threshold
    });

    state.sections.forEach(section => state.observer.observe(section));
  }

  function updateCurrentSection() {
    const visible = state.sections.filter(s => s.classList.contains(CONFIG.currentClass));
    if (visible.length === 0) return;

    const center = window.innerHeight / 2;
    let closest = visible[0];
    let minDistance = Infinity;

    visible.forEach(section => {
      const rect = section.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;
      const distance = Math.abs(sectionCenter - center);
      if (distance < minDistance) {
        minDistance = distance;
        closest = section;
      }
    });

    const index = state.sections.indexOf(closest);
    if (index !== state.currentIndex) {
      state.currentIndex = index;
      updateIndicators();
    }
  }

  function initIndicators() {
    const existing = document.querySelector(CONFIG.indicatorSelector);
    if (existing) existing.remove();

    const nav = document.createElement('nav');
    nav.className = 'section-indicator';
    nav.setAttribute('aria-label', '页面章节导航');

    state.sections.forEach((section, index) => {
      const btn = document.createElement('button');
      btn.className = 'section-indicator__dot';
      const title = section.dataset.title || section.id || `第 ${index + 1} 节`;
      btn.setAttribute('aria-label', `跳转到 ${title}`);
      btn.addEventListener('click', () => scrollToSection(index));
      nav.appendChild(btn);
    });

    document.body.appendChild(nav);
    state.indicators = Array.from(nav.querySelectorAll('.section-indicator__dot'));
  }

  function updateIndicators() {
    state.indicators.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === state.currentIndex);
    });
  }

  function scrollToSection(index) {
    if (index < 0 || index >= state.sections.length) return;
    const section = state.sections[index];
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    state.currentIndex = index;
    updateIndicators();
  }

  function initKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (utils.isInputFocused()) return;

      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault();
          scrollToSection(state.currentIndex + 1);
          break;
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          scrollToSection(state.currentIndex - 1);
          break;
        case 'Home':
          e.preventDefault();
          scrollToSection(0);
          break;
        case 'End':
          e.preventDefault();
          scrollToSection(state.sections.length - 1);
          break;
      }
    });
  }

  function initHashSync() {
    let timeout;
    window.addEventListener('scroll', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const section = state.sections[state.currentIndex];
        if (section && section.id && window.location.hash !== `#${section.id}`) {
          if (history.replaceState) {
            history.replaceState(null, null, `#${section.id}`);
          }
        }
      }, 150);
    }, { passive: true });
  }

  function initKnockoutAnimation() {
    const knockoutSection = document.getElementById('project-intro');
    if (!knockoutSection) return;

    const animation = knockoutSection.querySelector('.knockout-animation');
    if (!animation) return;

    knockoutSection.addEventListener('section:enter', () => {
      animation.classList.add('is-playing');
    });

    knockoutSection.addEventListener('section:leave', () => {
      animation.classList.remove('is-playing');
    });
  }

  window.PresentationController = {
    init,
    scrollToSection,
    getState: () => ({ ...state })
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
