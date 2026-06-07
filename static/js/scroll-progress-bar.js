/**
 * ============================================
 * iGEM SZPU-2026 - Scroll Progress Bar
 * ============================================
 *
 * @version 1.1
 * @description 极简滚动进度条（稳定版 + 基础性能优化）
 * 参考：sidebar-progress.js 架构
 */
(function () {
  'use strict';

  // 模块状态
  const state = {
    scrollInfo: null,
    isInitialized: false,
    barElement: null,
    fillElement: null
  };

  // 工具函数
  const Utils = {
    log: function (message, data) {
      console.log('[ScrollProgress]', message, data || '');
    },
    getScrollPosition: function (element, isWindow) {
      if (isWindow) {
        return window.scrollY || window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop || 0;
      }
      return element.scrollTop;
    },
    getScrollHeight: function (element, isWindow) {
      if (isWindow) {
        return Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight,
          document.documentElement.offsetHeight,
          document.body.offsetHeight
        );
      }
      return element.scrollHeight;
    },
    getClientHeight: function (element, isWindow) {
      if (isWindow) {
        return window.innerHeight ||
          document.documentElement.clientHeight ||
          document.body.clientHeight;
      }
      return element.clientHeight;
    },
    debounce: function (func, wait) {
      let timeout;
      return function executedFunction() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          func.apply(context, args);
        }, wait);
      };
    }
  };

  // 滚动容器检测（完全参考 sidebar-progress.js）
  const ScrollDetector = {
    detectScrollContainer: function () {
      const descContent = document.querySelector('.description-content, .content-area');
      if (descContent) {
        const style = window.getComputedStyle(descContent);
        if ((style.height !== 'auto' || style.maxHeight !== 'none') &&
          (style.overflowY === 'scroll' || style.overflowY === 'auto')) {
          Utils.log('检测到滚动容器: .description-content/.content-area');
          return { element: descContent, isWindow: false };
        }
      }

      const bodyStyle = window.getComputedStyle(document.body);
      if ((bodyStyle.height !== 'auto' || bodyStyle.maxHeight !== 'none') &&
        (bodyStyle.overflowY === 'scroll' || bodyStyle.overflowY === 'auto')) {
        Utils.log('检测到滚动容器: document.body');
        return { element: document.body, isWindow: false };
      }

      Utils.log('检测到滚动容器: window');
      return { element: window, isWindow: true };
    }
  };

  // 进度条创建
  const ProgressBar = {
    create: function () {
      if (document.getElementById('scroll-progress-bar')) {
        state.barElement = document.getElementById('scroll-progress-bar');
        state.fillElement = document.getElementById('scroll-progress-fill');
        return;
      }

      const bar = document.createElement('div');
      bar.id = 'scroll-progress-bar';
      bar.style.position = 'fixed';
      bar.style.top = '0';
      bar.style.right = '0';
      bar.style.bottom = '0';
      bar.style.width = '4px';
      bar.style.zIndex = '999999';
      bar.style.pointerEvents = 'none';
      bar.style.background = 'rgba(0, 0, 0, 0.15)';

      const fill = document.createElement('div');
      fill.id = 'scroll-progress-fill';
      fill.style.position = 'fixed';
      fill.style.top = '0';
      fill.style.right = '0';
      fill.style.width = '4px';
      fill.style.background = 'linear-gradient(to bottom, #1565C0, #42A5F5)';
      fill.style.boxShadow = '-3px 0 12px rgba(21, 101, 192, 0.6)';
      fill.style.height = '0%';

      bar.appendChild(fill);
      document.documentElement.appendChild(bar);

      state.barElement = bar;
      state.fillElement = fill;
      Utils.log('进度条创建成功');
    }
  };

  // 进度计算与更新
  const ProgressCalculator = {
    calculateProgress: function () {
      const scrollInfo = state.scrollInfo;
      const scrollElement = scrollInfo.element;
      const isWindowScroll = scrollInfo.isWindow;

      const scrollTop = Utils.getScrollPosition(scrollElement, isWindowScroll);
      const containerHeight = Utils.getClientHeight(scrollElement, isWindowScroll);
      const totalHeight = Utils.getScrollHeight(scrollElement, isWindowScroll);
      const maxScroll = Math.max(1, totalHeight - containerHeight);
      const scrollPercent = (scrollTop / maxScroll) * 100;
      const progressPercent = Math.round(Math.min(100, Math.max(0, scrollPercent)));

      return progressPercent;
    },

    updateProgressUI: function (progressPercent) {
      if (state.fillElement) {
        state.fillElement.style.height = progressPercent + '%';
      }
    }
  };

  // 主更新循环
  const MainLoop = {
    updateScrollProgress: function () {
      const progressPercent = ProgressCalculator.calculateProgress();
      ProgressCalculator.updateProgressUI(progressPercent);
    }
  };

  // 初始化
  function init() {
    if (state.isInitialized) {
      return;
    }

    Utils.log('初始化中...');

    // 创建进度条
    ProgressBar.create();

    // 检测滚动容器
    state.scrollInfo = ScrollDetector.detectScrollContainer();
    state.isInitialized = true;

    // 事件绑定（完全参考 sidebar-progress.js）
    const updateWithRaf = Utils.debounce(function () {
      MainLoop.updateScrollProgress();
    }, 16);

    state.scrollInfo.element.addEventListener('scroll', updateWithRaf, { passive: true });
    window.addEventListener('resize', updateWithRaf, { passive: true });

    // 初始更新
    MainLoop.updateScrollProgress();

    Utils.log('初始化完成');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
