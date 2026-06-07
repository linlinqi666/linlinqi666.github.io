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
 * 
 * @version 1.0.2
 * @since 2026-06-06
 */

(function () {
  'use strict';

  // ===== 配置常量 =====
  const CONFIG = {
    // 最小滚动阈值（px），小于此值不触发切换，防止微小滚动导致闪烁
    SCROLL_THRESHOLD: 80,

    // 页面顶部强制显示区域的阈值（px）
    TOP_THRESHOLD: 10,

    // 调试模式开关
    DEBUG: true
  };

  // ===== 状态管理 =====
  const state = {
    lastScrollY: 0,           // 上次滚动位置
    isNavVisible: true,       // 导航栏当前是否可见
    ticking: false,           // rAF 节流标志
    initialized: false,       // 是否已初始化
    scrollElement: null,      // 实际滚动容器
    isWindowScroll: true      // 是否为 window 滚动
  };

  // ===== 滚动容器检测 =====

  /**
   * 检测实际的滚动容器
   * 兼容 window 滚动和元素内部滚动
   */
  function detectScrollContainer() {
    // 检查 .description-content / .content-area 是否有滚动
    const contentEl = document.querySelector('.description-content, .content-area');
    if (contentEl) {
      const style = window.getComputedStyle(contentEl);
      if (CONFIG.DEBUG) {
        console.log('[NavScroll] .description-content 样式:', {
          height: style.height,
          maxHeight: style.maxHeight,
          overflowY: style.overflowY
        });
      }
      if ((style.height !== 'auto' || style.maxHeight !== 'none') &&
        (style.overflowY === 'scroll' || style.overflowY === 'auto')) {
        if (CONFIG.DEBUG) console.log('[NavScroll] 检测到滚动容器: .description-content');
        return { element: contentEl, isWindow: false };
      }
    }

    // 检查 main 元素
    const mainEl = document.querySelector('main');
    if (mainEl) {
      const style = window.getComputedStyle(mainEl);
      if (CONFIG.DEBUG) {
        console.log('[NavScroll] main 样式:', {
          height: style.height,
          maxHeight: style.maxHeight,
          overflowY: style.overflowY
        });
      }
      if ((style.height !== 'auto' || style.maxHeight !== 'none') &&
        (style.overflowY === 'scroll' || style.overflowY === 'auto')) {
        if (CONFIG.DEBUG) console.log('[NavScroll] 检测到滚动容器: main');
        return { element: mainEl, isWindow: false };
      }
    }

    // 检查 body
    const bodyStyle = window.getComputedStyle(document.body);
    if (CONFIG.DEBUG) {
      console.log('[NavScroll] body 样式:', {
        height: bodyStyle.height,
        maxHeight: bodyStyle.maxHeight,
        overflowY: bodyStyle.overflowY
      });
    }
    if ((bodyStyle.height !== 'auto' || bodyStyle.maxHeight !== 'none') &&
      (bodyStyle.overflowY === 'scroll' || bodyStyle.overflowY === 'auto')) {
      if (CONFIG.DEBUG) console.log('[NavScroll] 检测到滚动容器: body');
      return { element: document.body, isWindow: false };
    }

    // 默认使用 window
    if (CONFIG.DEBUG) console.log('[NavScroll] 使用 window 作为滚动容器');
    return { element: window, isWindow: true };
  }

  // ===== 核心功能 =====

  /**
   * 获取当前滚动位置
   * 兼容 window 和 element 滚动
   */
  function getScrollY() {
    if (state.isWindowScroll) {
      return window.scrollY || window.pageYOffset ||
        (document.documentElement || document.body).scrollTop || 0;
    }
    return state.scrollElement.scrollTop || 0;
  }

  /**
   * 处理滚动事件
   * 计算滚动方向和距离，判断是否切换导航栏状态
   */
  function handleScroll() {
    if (state.ticking) return;

    state.ticking = true;

    requestAnimationFrame(function () {
      const currentScrollY = getScrollY();
      const scrollDelta = currentScrollY - state.lastScrollY;

      if (CONFIG.DEBUG && Math.abs(scrollDelta) > 10) {
        console.log('[NavScroll] scrollY:', Math.round(currentScrollY), 'delta:', Math.round(scrollDelta), 'visible:', state.isNavVisible);
      }

      // 页面顶部强制显示
      if (currentScrollY <= CONFIG.TOP_THRESHOLD) {
        if (!state.isNavVisible) {
          showNav();
        }
        state.lastScrollY = currentScrollY;
        state.ticking = false;
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

      state.ticking = false;
    });
  }

  /**
   * 隐藏导航栏
   * 添加 nav-hidden 类，触发 CSS transform 动画
   */
  function hideNav() {
    const nav = document.querySelector('nav');
    if (!nav) {
      if (CONFIG.DEBUG) console.warn('[NavScroll] nav 元素未找到');
      return;
    }

    nav.classList.add('nav-hidden');
    state.isNavVisible = false;

    if (CONFIG.DEBUG) {
      console.log('[NavScroll] 导航栏已隐藏 (scrollY:', Math.round(getScrollY()), ')');
    }
  }

  /**
   * 显示导航栏
   * 移除 nav-hidden 类，触发 CSS transform 回弹动画
   */
  function showNav() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    nav.classList.remove('nav-hidden');
    state.isNavVisible = true;

    if (CONFIG.DEBUG) {
      console.log('[NavScroll] 导航栏已显示 (scrollY:', Math.round(getScrollY()), ')');
    }
  }

  /**
   * 窗口大小变化时重置导航栏状态
   * 确保响应式行为正确
   */
  function handleResize() {
    showNav();
    state.lastScrollY = getScrollY();
  }

  // ===== 公开 API =====

  /**
   * 初始化导航栏滚动行为
   * 应在 DOMContentLoaded 后调用
   */
  function init() {
    if (state.initialized) {
      if (CONFIG.DEBUG) console.log('[NavScroll] 已初始化，跳过');
      return;
    }

    // 检测实际滚动容器
    const scrollInfo = detectScrollContainer();
    state.scrollElement = scrollInfo.element;
    state.isWindowScroll = scrollInfo.isWindow;
    state.lastScrollY = getScrollY();
    state.initialized = true;

    // 绑定滚动事件到实际滚动容器（passive: true 提升性能）
    state.scrollElement.addEventListener('scroll', handleScroll, { passive: true });

    // 绑定窗口大小变化事件
    window.addEventListener('resize', handleResize, { passive: true });

    if (CONFIG.DEBUG) {
      console.log('[NavScroll] 初始化完成', {
        threshold: CONFIG.SCROLL_THRESHOLD,
        topThreshold: CONFIG.TOP_THRESHOLD,
        initialScrollY: state.lastScrollY,
        navElement: !!document.querySelector('nav'),
        scrollContainer: state.isWindowScroll ? 'window' : state.scrollElement.className || state.scrollElement.tagName
      });
    }
  }

  /**
   * 获取当前状态（用于调试）
   */
  function getState() {
    const nav = document.querySelector('nav');
    return {
      ...state,
      currentScrollY: getScrollY(),
      navElement: !!nav,
      navHiddenClass: nav ? nav.classList.contains('nav-hidden') : false,
      navTransform: nav ? getComputedStyle(nav).transform : 'N/A'
    };
  }

  /**
   * 设置调试模式
   */
  function setDebugMode(enabled) {
    CONFIG.DEBUG = enabled;
    console.log('[NavScroll] 调试模式', enabled ? '已开启' : '已关闭');
  }

  // ===== 导出全局 API =====
  window.NavScrollBehavior = {
    init: init,
    show: showNav,
    hide: hideNav,
    getState: getState,
    setDebugMode: setDebugMode
  };

  // ===== 自动初始化 =====
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
