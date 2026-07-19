/**
 * ============================================
 * iGEM SZPU-2026 - Scroll Progress Bar
 * ============================================
 *
 * @description 极简滚动进度条（rAF 节流版）
 *
 * 本次优化要点：
 *  1. scroll 事件使用 requestAnimationFrame 节流，进度随滚动实时更新。
 *  2. 所有 addEventListener 均使用被动事件监听（能力检测后回退）。
 *  3. resize 使用 150ms debounce，并在尺寸变化后重新检测滚动容器。
 *  4. 缓存 DOM 引用与事件 handler，提供 destroy() 与 beforeunload 自动清理。
 *  5. 复用 window.iGEMUtils 中的通用工具函数，移除私有实现。
 */
(function () {
  'use strict';

  if (!window.iGEMUtils) {
    console.error('[ScrollProgress] 缺少依赖：请先加载 static/js/utils.js');
    return;
  }

  const Utils = window.iGEMUtils;

  /**
   * 模块配置。
   * @type {{ DEBUG_MODE: boolean, RESIZE_DEBOUNCE: number }}
   */
  const CONFIG = {
    DEBUG_MODE: false,
    RESIZE_DEBOUNCE: 150
  };

  /**
   * 模块状态。
   * @type {{
   *   scrollInfo: { element: Window|Element, isWindow: boolean }|null,
   *   isInitialized: boolean,
   *   fillElement: HTMLElement|null,
   *   scrollHandler: function|null,
   *   resizeHandler: function|null
   * }}
   */
  const state = {
    scrollInfo: null,
    isInitialized: false,
    fillElement: null,
    scrollHandler: null,
    resizeHandler: null
  };

  /**
   * 在调试模式下输出日志。
   * @param {string} message 日志消息
   * @param {any} [data] 附加数据
   */
  function log(message, data) {
    if (CONFIG.DEBUG_MODE) {
      console.log('[ScrollProgress]', message, data !== undefined ? data : '');
    }
  }

  /**
   * 获取被动事件监听选项。
   * @returns {boolean|{ passive: true }}
   */
  function getPassiveOption() {
    return Utils.supportsPassiveEvents() ? { passive: true } : false;
  }

  /**
   * 计算当前滚动进度百分比。
   * @returns {number} 0-100 之间的整数
   */
  function calculateProgress() {
    const scrollInfo = state.scrollInfo;
    const scrollElement = scrollInfo.element;
    const isWindowScroll = scrollInfo.isWindow;

    const scrollTop = Utils.getScrollPosition(scrollElement, isWindowScroll);
    const containerHeight = Utils.getClientHeight(scrollElement, isWindowScroll);
    const totalHeight = Utils.getScrollHeight(scrollElement, isWindowScroll);
    const maxScroll = Math.max(1, totalHeight - containerHeight);
    const scrollPercent = (scrollTop / maxScroll) * 100;

    return Math.round(Math.min(100, Math.max(0, scrollPercent)));
  }

  /**
   * 更新进度条填充高度。
   * @param {number} progressPercent 0-100 之间的百分比
   */
  function updateFill(progressPercent) {
    if (state.fillElement) {
      state.fillElement.style.height = progressPercent + '%';
    }
  }

  /**
   * 更新滚动进度条。
   */
  function updateScrollProgress() {
    updateFill(calculateProgress());
  }

  /**
   * resize 完成后重新检测滚动容器并刷新进度。
   */
  function onResize() {
    state.scrollInfo = Utils.detectScrollContainer();
    updateScrollProgress();
  }

  /**
   * 清理所有事件监听与引用。
   */
  function destroy() {
    const passiveOption = getPassiveOption();

    if (state.scrollHandler) {
      state.scrollHandler.cancel();
    }
    if (state.scrollHandler && state.scrollInfo && state.scrollInfo.element) {
      state.scrollInfo.element.removeEventListener('scroll', state.scrollHandler, passiveOption);
    }
    if (state.resizeHandler) {
      window.removeEventListener('resize', state.resizeHandler, passiveOption);
    }

    state.scrollInfo = null;
    state.fillElement = null;
    state.isInitialized = false;
    state.scrollHandler = null;
    state.resizeHandler = null;
  }

  /**
   * 初始化模块。
   */
  function init() {
    if (state.isInitialized) {
      return;
    }

    log('初始化中...');

    // 仅当页面已存在 #scroll-progress-bar 时才初始化，避免与新右侧面板冲突
    const barElement = document.getElementById('scroll-progress-bar');
    if (!barElement) {
      log('未找到 #scroll-progress-bar，跳过初始化');
      return;
    }

    state.fillElement = document.getElementById('scroll-progress-fill');
    state.scrollInfo = Utils.detectScrollContainer();
    state.isInitialized = true;

    state.scrollHandler = Utils.rafThrottle(updateScrollProgress);
    state.resizeHandler = Utils.debounce(onResize, CONFIG.RESIZE_DEBOUNCE);

    const passiveOption = getPassiveOption();
    state.scrollInfo.element.addEventListener('scroll', state.scrollHandler, passiveOption);
    window.addEventListener('resize', state.resizeHandler, passiveOption);

    updateScrollProgress();

    log('初始化完成');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 页面卸载时自动清理
  window.addEventListener('beforeunload', destroy);

  // 暴露公共 API
  window.ScrollProgressBar = {
    update: updateScrollProgress,
    destroy: destroy,
    setDebugMode: function (enabled) {
      CONFIG.DEBUG_MODE = !!enabled;
    },
    getState: function () {
      return {
        isInitialized: state.isInitialized,
        hasBar: !!document.getElementById('scroll-progress-bar'),
        hasFill: !!state.fillElement,
        scrollContainer: state.scrollInfo ? (state.scrollInfo.isWindow ? 'window' : state.scrollInfo.element.className || state.scrollInfo.element.tagName) : 'none'
      };
    }
  };
})();
