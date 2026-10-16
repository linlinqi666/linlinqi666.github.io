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
 *
 * 2026-10-15 修复（用户反馈：收纳条展开后进度"中途就满了"）：
 *  6. 进度按**整页高度**判定：缓存的 scrollHeight/clientHeight 一旦因布局变化
 *     （折叠/收纳条展开收起、懒加载图片落地、字体回流）失真，进度就会提前触顶。
 *     为此新增 ResizeObserver + MutationObserver 监听布局变化，变化即刷新缓存尺寸，
 *     滚动热路径仍只读 scrollTop，不违反 README 约束 15。
 *  7. 只有**真正触底**（距底部 ≤ BOTTOM_EPSILON px）才给 100%，其余情况最多 99%，
 *     杜绝"还没到底就拉满"。
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
   * @type {{ DEBUG_MODE: boolean, RESIZE_DEBOUNCE: number, LAYOUT_DEBOUNCE: number, BOTTOM_EPSILON: number }}
   */
  const CONFIG = {
    DEBUG_MODE: false,
    RESIZE_DEBOUNCE: 150,
    /** 布局变化（收纳条/折叠展开）后的重算节流，避免连续回流 */
    LAYOUT_DEBOUNCE: 120,
    /** 距底部该像素数以内视为"已触底"，才允许显示 100% */
    BOTTOM_EPSILON: 2
  };

  /**
   * 模块状态。
   * @type {{
   *   scrollInfo: { element: Window|Element, isWindow: boolean }|null,
   *   isInitialized: boolean,
   *   fillElement: HTMLElement|null,
   *   barElement: HTMLElement|null,
   *   scrollHandler: function|null,
   *   resizeHandler: function|null,
   *   layoutHandler: function|null,
   *   resizeObserver: ResizeObserver|null,
   *   mutationObserver: MutationObserver|null
   * }}
   */
  const state = {
    scrollInfo: null,
    isInitialized: false,
    fillElement: null,
    barElement: null,
    scrollHandler: null,
    resizeHandler: null,
    layoutHandler: null,
    resizeObserver: null,
    mutationObserver: null,
    // 缓存滚动尺寸，避免在每次滚动帧重复读取 scrollHeight/clientHeight（强制同步布局）。
    // 关键：任何布局变化都必须刷新这两个值，否则进度会提前触顶。
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
   * 在初始化、resize、图片/字体加载、以及任何布局变化（收纳条展开）后调用，
   * 避免把这两个会触发强制同步布局的读取放进每帧滚动热路径。
   */
  function refreshMetrics() {
    const scrollInfo = state.scrollInfo;
    if (!scrollInfo) return;
    state.metrics.clientHeight = Utils.getClientHeight(scrollInfo.element, scrollInfo.isWindow);
    state.metrics.totalHeight = Utils.getScrollHeight(scrollInfo.element, scrollInfo.isWindow);
    log('尺寸已刷新', state.metrics);
  }

  /**
   * 计算当前滚动进度百分比。
   * 热路径只读取 scrollTop（不触发强制同步布局），尺寸使用缓存。
   * 只有真正触底才返回 100；未到底时最多 99，避免"中途就满了"。
   * @returns {number} 0-100 之间的整数
   */
  function calculateProgress() {
    const scrollInfo = state.scrollInfo;
    if (!scrollInfo) return 0;

    const scrollTop = Math.max(0, Utils.getScrollPosition(scrollInfo.element, scrollInfo.isWindow));
    const maxScroll = Math.max(1, state.metrics.totalHeight - state.metrics.clientHeight);

    // 触底判定：以真实文档高度为准，留极小像素容差
    if (maxScroll <= 1 || scrollTop >= maxScroll - CONFIG.BOTTOM_EPSILON) {
      return 100;
    }

    const scrollPercent = (scrollTop / maxScroll) * 100;
    return Math.min(99, Math.round(scrollPercent));
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
   * 布局变化后的统一处理：刷新缓存尺寸 → 重算进度。
   */
  function onLayoutChange() {
    refreshMetrics();
    updateScrollProgress();
  }

  /**
   * 监听任何会改变文档高度的布局变化（折叠/收纳条展开收起、懒加载图片落地等）。
   * 只负责"标记尺寸失效"，热路径依旧零布局读取。
   */
  function startLayoutObservers() {
    const canObserve = typeof ResizeObserver === 'function';
    const bodyTarget = document.body || document.documentElement;

    if (canObserve && bodyTarget) {
      state.resizeObserver = new ResizeObserver(state.layoutHandler);
      state.resizeObserver.observe(document.documentElement);
      if (document.body) {
        state.resizeObserver.observe(document.body);
      }
      // 内部滚动容器（非 window 滚动）时，观察容器及其内容子树高度
      const scrollEl = state.scrollInfo && !state.scrollInfo.isWindow ? state.scrollInfo.element : null;
      if (scrollEl) {
        state.resizeObserver.observe(scrollEl);
        if (scrollEl.firstElementChild) {
          state.resizeObserver.observe(scrollEl.firstElementChild);
        }
      }
    }

    if (typeof MutationObserver === 'function' && bodyTarget) {
      state.mutationObserver = new MutationObserver(function (records) {
        // 进度条自身的高度写入会触发 body 子树变动，必须忽略，避免自激与无谓回流
        if (state.barElement) {
          let external = false;
          for (let i = 0; i < records.length; i++) {
            if (!state.barElement.contains(records[i].target)) {
              external = true;
              break;
            }
          }
          if (!external) return;
        }
        state.layoutHandler();
      });
      state.mutationObserver.observe(bodyTarget, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style', 'open', 'hidden']
      });
    }
  }

  /**
   * 停止布局监听。
   */
  function stopLayoutObservers() {
    if (state.resizeObserver) {
      state.resizeObserver.disconnect();
      state.resizeObserver = null;
    }
    if (state.mutationObserver) {
      state.mutationObserver.disconnect();
      state.mutationObserver = null;
    }
  }

  /**
   * resize 完成后重新检测滚动容器并刷新进度。
   */
  function onResize() {
    state.scrollInfo = Utils.detectScrollContainer();
    stopLayoutObservers();
    startLayoutObservers();
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

    stopLayoutObservers();

    state.scrollInfo = null;
    state.fillElement = null;
    state.barElement = null;
    state.isInitialized = false;
    state.scrollHandler = null;
    state.resizeHandler = null;
    state.layoutHandler = null;
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

    state.barElement = barElement;
    state.fillElement = document.getElementById('scroll-progress-fill');
    state.scrollInfo = Utils.detectScrollContainer();
    state.isInitialized = true;
    refreshMetrics();

    state.scrollHandler = Utils.rafThrottle(updateScrollProgress);
    state.resizeHandler = Utils.debounce(onResize, CONFIG.RESIZE_DEBOUNCE);
    state.layoutHandler = Utils.debounce ? Utils.debounce(onLayoutChange, CONFIG.LAYOUT_DEBOUNCE) : onLayoutChange;

    const passiveOption = getPassiveOption();
    state.scrollInfo.element.addEventListener('scroll', state.scrollHandler, passiveOption);
    window.addEventListener('resize', state.resizeHandler, passiveOption);
    // 图片/字体加载完成后布局可能变化，刷新缓存尺寸再补一次进度
    window.addEventListener('load', function () {
      refreshMetrics();
      updateScrollProgress();
    }, passiveOption);

    startLayoutObservers();
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
    /** 供外部（折叠组件等）在改变布局后主动刷新尺寸与进度 */
    refresh: onLayoutChange,
    destroy: destroy,
    setDebugMode: function (enabled) {
      CONFIG.DEBUG_MODE = !!enabled;
    },
    getState: function () {
      return {
        isInitialized: state.isInitialized,
        hasBar: !!document.getElementById('scroll-progress-bar'),
        hasFill: !!state.fillElement,
        metrics: { clientHeight: state.metrics.clientHeight, totalHeight: state.metrics.totalHeight },
        scrollContainer: state.scrollInfo ? (state.scrollInfo.isWindow ? 'window' : state.scrollInfo.element.className || state.scrollInfo.element.tagName) : 'none'
      };
    }
  };
})();
