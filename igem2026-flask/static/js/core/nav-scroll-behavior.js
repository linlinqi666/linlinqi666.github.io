/**
 * nav-scroll-behavior.js
 * 智能导航栏滚动显示/隐藏功能
 *
 * 功能：
 * - 向下滚动时导航栏平滑收缩隐藏（translateY(-100%)）
 * - 向上滚动时导航栏平滑回弹显示
 * - 页面顶部强制显示导航栏
 * - 与 sidebar-progress.js 并行运行，互不干扰
 *
 * 性能优化：
 * - requestAnimationFrame 节流
 * - passive: true 事件监听
 * - GPU 加速的 transform 动画
 * - 自动检测实际滚动容器（window 或元素）
 * - 缓存 nav 元素引用
 * - resize 使用 150ms debounce
 * - 生产环境 DEBUG 默认关闭，可通过 ?debug=1 开启
 *
 * 依赖：
 * - static/js/utils.js 必须先于本脚本加载，提供 window.iGEMUtils
 */

(function () {
  'use strict';

  if (!window.iGEMUtils) {
    console.error('[NavScroll] 缺少依赖：请先加载 static/js/utils.js');
    return;
  }

  // ===== 共享工具引用 =====
  const {
    debounce,
    detectScrollContainer,
    getScrollPosition,
    supportsPassiveEvents,
    safeRequestAnimationFrame: raf,
    safeCancelAnimationFrame: caf
  } = window.iGEMUtils;

  // ===== DOM 常量 =====
  /** @type {string} 导航栏元素选择器 */
  const NAV_SELECTOR = 'nav';
  /** @type {string} 导航栏隐藏状态类名 */
  const NAV_HIDDEN_CLASS = 'nav-hidden';

  // ===== 配置常量 =====
  const CONFIG = {
    // 最小滚动阈值（px），小于此值不触发切换，防止微小滚动导致闪烁
    SCROLL_THRESHOLD: 80,

    // 页面顶部强制显示区域的阈值（px）
    TOP_THRESHOLD: 10,

    // resize 防抖延迟（ms）
    RESIZE_DEBOUNCE: 150,

    // 调试模式开关（生产环境默认关闭）
    DEBUG: false
  };

  // 可通过 URL 参数 ?debug=1 临时开启调试
  if (/[?&]debug=1/.test(window.location.search)) {
    CONFIG.DEBUG = true;
  }

  // ===== 状态管理 =====
  const state = {
    lastScrollY: 0,           // 上次滚动位置
    isNavVisible: true,       // 导航栏当前是否可见
    ticking: false,           // rAF 节流标志
    rafId: null,              // 当前 rAF ID，便于清理
    initialized: false,       // 是否已初始化
    navElement: null,         // 缓存的 nav 元素
    scrollElement: null,      // 实际滚动容器
    isWindowScroll: true,     // 是否为 window 滚动
    scrollHandler: null,      // scroll 事件 handler 引用
    resizeHandler: null       // resize 事件 handler 引用
  };

  // ===== 事件监听选项（根据浏览器 passive 支持能力构建一次） =====
  const EVENT_LISTENER_OPTIONS = supportsPassiveEvents() ? { passive: true } : false;

  // ===== 调试日志辅助 =====
  /**
   * 在 DEBUG 开启时输出日志。
   *
   * @param {'log'|'warn'} level 日志级别
   * @param {string} message 日志消息
   * @param {...*} details 额外详情
   */
  function log(level, message, ...details) {
    if (!CONFIG.DEBUG) return;
    const prefix = '[NavScroll]';
    if (level === 'warn') {
      console.warn(prefix, message, ...details);
    } else {
      console.log(prefix, message, ...details);
    }
  }

  // ===== 核心功能 =====

  /**
   * 获取当前滚动位置。
   * 兼容 window 和 element 滚动。
   *
   * @returns {number} 当前滚动位置（px）
   */
  function getScrollY() {
    return getScrollPosition(state.scrollElement, state.isWindowScroll);
  }

  /**
   * 处理滚动事件。
   * 计算滚动方向和距离，判断是否切换导航栏状态。
   */
  function handleScroll() {
    if (state.ticking) return;

    state.ticking = true;

    state.rafId = raf(function () {
      try {
        const currentScrollY = getScrollY();
        const scrollDelta = currentScrollY - state.lastScrollY;

        if (Math.abs(scrollDelta) > 10) {
          log('log', 'scrollY:', Math.round(currentScrollY), 'delta:', Math.round(scrollDelta), 'visible:', state.isNavVisible);
        }

        // 页面顶部强制显示
        if (currentScrollY <= CONFIG.TOP_THRESHOLD) {
          if (!state.isNavVisible) {
            showNav();
          }
          state.lastScrollY = currentScrollY;
          return;
        }

        // 滚动距离超过阈值才触发切换
        if (Math.abs(scrollDelta) >= CONFIG.SCROLL_THRESHOLD) {
          if (scrollDelta > 0 && state.isNavVisible) {
            // 向下滚动且导航栏可见 → 隐藏
            hideNav();
          } else if (scrollDelta < 0 && !state.isNavVisible) {
            // 向上滚动且导航栏隐藏 → 显示
            showNav();
          }
          state.lastScrollY = currentScrollY;
        }
      } finally {
        state.ticking = false;
      }
    });
  }

  /**
   * 隐藏导航栏。
   * 添加 nav-hidden 类，触发 CSS transform 动画。
   */
  function hideNav() {
    const nav = state.navElement;
    if (!nav) {
      log('warn', 'nav 元素未找到');
      return;
    }

    nav.classList.add(NAV_HIDDEN_CLASS);
    state.isNavVisible = false;

    log('log', '导航栏已隐藏 (scrollY:', Math.round(getScrollY()), ')');
  }

  /**
   * 显示导航栏。
   * 移除 nav-hidden 类，触发 CSS transform 回弹动画。
   */
  function showNav() {
    const nav = state.navElement;
    if (!nav) return;

    nav.classList.remove(NAV_HIDDEN_CLASS);
    state.isNavVisible = true;

    log('log', '导航栏已显示 (scrollY:', Math.round(getScrollY()), ')');
  }

  /**
   * 窗口大小变化时重置导航栏状态。
   * 确保响应式行为正确。
   */
  function handleResize() {
    showNav();
    state.lastScrollY = getScrollY();
  }

  const debouncedResize = debounce(handleResize, CONFIG.RESIZE_DEBOUNCE);

  // ===== 公开 API =====

  /**
   * 初始化导航栏滚动行为。
   * 应在 DOMContentLoaded 后调用。
   */
  function init() {
    if (state.initialized) {
      log('log', '已初始化，跳过');
      return;
    }

    // 缓存 nav 元素，避免每次 show/hide 重复查询
    state.navElement = document.querySelector(NAV_SELECTOR);

    // 检测实际滚动容器
    const scrollInfo = detectScrollContainer();
    state.scrollElement = scrollInfo.element;
    state.isWindowScroll = scrollInfo.isWindow;
    state.lastScrollY = getScrollY();
    state.initialized = true;

    // 绑定滚动事件到实际滚动容器
    state.scrollHandler = handleScroll;
    state.resizeHandler = debouncedResize;

    state.scrollElement.addEventListener('scroll', state.scrollHandler, EVENT_LISTENER_OPTIONS);

    // 绑定窗口大小变化事件
    window.addEventListener('resize', state.resizeHandler, EVENT_LISTENER_OPTIONS);

    log('log', '初始化完成', {
      threshold: CONFIG.SCROLL_THRESHOLD,
      topThreshold: CONFIG.TOP_THRESHOLD,
      initialScrollY: state.lastScrollY,
      navElement: !!state.navElement,
      scrollContainer: state.isWindowScroll ? 'window' : state.scrollElement.className || state.scrollElement.tagName
    });
  }

  /**
   * 获取当前状态（用于调试）。
   *
   * @returns {Object} 当前模块状态快照
   */
  function getState() {
    const nav = state.navElement;
    return {
      lastScrollY: state.lastScrollY,
      isNavVisible: state.isNavVisible,
      ticking: state.ticking,
      initialized: state.initialized,
      isWindowScroll: state.isWindowScroll,
      currentScrollY: getScrollY(),
      navElement: !!nav,
      navHiddenClass: nav ? nav.classList.contains(NAV_HIDDEN_CLASS) : false,
      navTransform: nav ? getComputedStyle(nav).transform : 'N/A'
    };
  }

  /**
   * 设置调试模式。
   *
   * @param {boolean} enabled 是否开启调试
   */
  function setDebugMode(enabled) {
    CONFIG.DEBUG = enabled;
    console.log('[NavScroll] 调试模式', enabled ? '已开启' : '已关闭');
  }

  /**
   * 清理所有监听器与状态，释放引用。
   */
  function destroy() {
    if (state.rafId) {
      caf(state.rafId);
      state.rafId = null;
    }

    if (state.scrollHandler && state.scrollElement) {
      state.scrollElement.removeEventListener('scroll', state.scrollHandler, EVENT_LISTENER_OPTIONS);
    }
    if (state.resizeHandler) {
      window.removeEventListener('resize', state.resizeHandler, EVENT_LISTENER_OPTIONS);
    }

    state.scrollHandler = null;
    state.resizeHandler = null;
    state.scrollElement = null;
    state.navElement = null;
    state.ticking = false;
    state.initialized = false;
  }

  // ===== 导出全局 API =====
  window.NavScrollBehavior = {
    init: init,
    show: showNav,
    hide: hideNav,
    getState: getState,
    setDebugMode: setDebugMode,
    destroy: destroy
  };

  // ===== 自动初始化 =====
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 页面卸载时清理
  window.addEventListener('beforeunload', destroy);

})();
