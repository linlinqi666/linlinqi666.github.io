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
    resizeHandler: null,
    // 缓存滚动尺寸，避免在每次滚动帧重复读取 scrollHeight/clientHeight（强制同步布局）
    metrics: { clientHeight: 0, totalHeight: 0 }
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
   * 刷新缓存的滚动尺寸（scrollHeight / clientHeight）。
   * 仅在初始化、resize、以及资源加载导致布局变化时调用，
   * 避免把这两个会触发强制同步布局的读取放进每帧滚动热路径。
   */
  function refreshMetrics() {
    const scrollInfo = state.scrollInfo;
    if (!scrollInfo) return;
    state.metrics.clientHeight = Utils.getClientHeight(scrollInfo.element, scrollInfo.isWindow);
    state.metrics.totalHeight = Utils.getScrollHeight(scrollInfo.element, scrollInfo.isWindow);
  }

  /**
   * 计算当前滚动进度百分比。
   * 热路径只读取 scrollTop（不触发强制同步布局），尺寸使用缓存。
   * @returns {number} 0-100 之间的整数
   */
  function calculateProgress() {
    const scrollInfo = state.scrollInfo;
    if (!scrollInfo) return 0;

    const scrollTop = Utils.getScrollPosition(scrollInfo.element, scrollInfo.isWindow);
    const maxScroll = Math.max(1, state.metrics.totalHeight - state.metrics.clientHeight);
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
    refreshMetrics();
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
    refreshMetrics();

    state.scrollHandler = Utils.rafThrottle(updateScrollProgress);
    state.resizeHandler = Utils.debounce(onResize, CONFIG.RESIZE_DEBOUNCE);

    const passiveOption = getPassiveOption();
    state.scrollInfo.element.addEventListener('scroll', state.scrollHandler, passiveOption);
    window.addEventListener('resize', state.resizeHandler, passiveOption);
    // 图片/字体加载完成后布局可能变化，刷新缓存尺寸再补一次进度
    window.addEventListener('load', function () {
      refreshMetrics();
      updateScrollProgress();
    }, passiveOption);

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
