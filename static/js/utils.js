/**
 * ============================================
 * iGEM SZPU-2026 - Shared JavaScript Utilities
 * ============================================
 *
 * @description 通用、无依赖的工具函数集合，供所有页面脚本共享。
 * 所有函数的行为均与原有各模块中的私有实现保持一致。
 */
(function () {
  'use strict';

  /**
   * 被动事件监听支持缓存。
   * @type {boolean|null}
   */
  let passiveEventSupport = null;

  /**
   * 防抖函数。
   *
   * @template T
   * @param {T} fn 需要防抖的函数
   * @param {number} wait 等待时间（毫秒）
   * @returns {(...args: any[]) => void} 防抖后的函数
   */
  function debounce(fn, wait) {
    let timeout;
    function debounced(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        fn.apply(context, args);
      }, wait);
    }
    debounced.cancel = function () {
      clearTimeout(timeout);
      timeout = null;
    };
    return debounced;
  }

  /**
   * 获取当前滚动位置。
   * 兼容 window 滚动与元素内部滚动，并保留原有回退逻辑。
   *
   * @param {Window|Element} element 滚动容器
   * @param {boolean} isWindow 是否为 window 滚动
   * @returns {number} 当前滚动位置（px）
   */
  function getScrollPosition(element, isWindow) {
    if (isWindow) {
      return (
        window.scrollY ||
        window.pageYOffset ||
        (document.documentElement && document.documentElement.scrollTop) ||
        document.body.scrollTop ||
        0
      );
    }
    return element.scrollTop || 0;
  }

  /**
   * 获取滚动总高度。
   *
   * @param {Window|Element} element 滚动容器
   * @param {boolean} isWindow 是否为 window 滚动
   * @returns {number} 滚动总高度（px）
   */
  function getScrollHeight(element, isWindow) {
    if (isWindow) {
      return Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        document.documentElement.offsetHeight,
        document.body.offsetHeight
      );
    }
    return element.scrollHeight;
  }

  /**
   * 获取可视区域高度。
   *
   * @param {Window|Element} element 滚动容器
   * @param {boolean} isWindow 是否为 window 滚动
   * @returns {number} 可视区域高度（px）
   */
  function getClientHeight(element, isWindow) {
    if (isWindow) {
      return (
        window.innerHeight ||
        (document.documentElement && document.documentElement.clientHeight) ||
        document.body.clientHeight
      );
    }
    return element.clientHeight;
  }

  /**
   * 判断元素是否为实际可滚动的容器。
   * 仅当元素具备滚动样式且存在真实可滚动溢出时才返回 true，
   * 避免将随内容自然撑高的 body/html 误判为滚动容器。
   *
   * @param {Element} element 待检测元素
   * @returns {boolean} 是否为实际可滚动容器
   */
  function isActuallyScrollable(element) {
    if (!element || !element.getBoundingClientRect) return false;
    const style = window.getComputedStyle(element);
    const overflowY = style.overflowY;
    const hasScrollableStyle = overflowY === 'scroll' || overflowY === 'auto';
    const hasConstrainedHeight = style.height !== 'auto' || style.maxHeight !== 'none';
    const hasOverflow = element.scrollHeight > element.clientHeight + 1;
    return hasScrollableStyle && hasConstrainedHeight && hasOverflow;
  }

  /**
   * 检测实际滚动容器。
   * 优先级：.description-content/.content-area → body → window。
   * 要求候选元素确实存在可滚动溢出，否则回退到 window。
   * document.documentElement 的滚动等价于 window 滚动，统一视为 window，
   * 避免将绑定在 html 上的 scroll 事件遗漏。
   *
   * @returns {{ element: Window|Element, isWindow: boolean }} 滚动容器信息
   */
  function detectScrollContainer() {
    const contentEl = document.querySelector('.description-content, .content-area');
    if (contentEl && isActuallyScrollable(contentEl)) {
      return { element: contentEl, isWindow: false };
    }

    if (isActuallyScrollable(document.body)) {
      return { element: document.body, isWindow: false };
    }

    return { element: window, isWindow: true };
  }

  /**
   * 检测当前浏览器是否支持 passive 事件监听器选项，结果会被缓存。
   *
   * @returns {boolean} 是否支持 passive 事件监听
   */
  function supportsPassiveEvents() {
    if (passiveEventSupport !== null) {
      return passiveEventSupport;
    }

    let supported = false;
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get() {
          supported = true;
          return true;
        }
      });
      window.addEventListener('test', null, opts);
      window.removeEventListener('test', null, opts);
    } catch (e) {
      supported = false;
    }

    passiveEventSupport = supported;
    return passiveEventSupport;
  }

  /**
   * requestAnimationFrame 的安全包装，在旧浏览器中回退到 setTimeout(fn, 16)。
   *
   * @param {Function} callback 回调函数
   * @returns {number} 定时器/动画帧 ID
   */
  function safeRequestAnimationFrame(callback) {
    if (typeof window.requestAnimationFrame === 'function') {
      return window.requestAnimationFrame(callback);
    }
    return setTimeout(callback, 16);
  }

  /**
   * cancelAnimationFrame 的安全包装，与 safeRequestAnimationFrame 配套使用。
   *
   * @param {number} id 动画帧或定时器 ID
   */
  function safeCancelAnimationFrame(id) {
    if (typeof window.cancelAnimationFrame === 'function') {
      window.cancelAnimationFrame(id);
    } else {
      clearTimeout(id);
    }
  }

  /**
   * 使用 requestAnimationFrame 进行节流的函数包装器。
   * 若浏览器不支持 requestAnimationFrame，则使用 setTimeout(fn, 16) 降级。
   *
   * @template T
   * @param {T} fn 需要节流的函数
   * @returns {(...args: any[]) => void} 节流后的函数
   */
  function rafThrottle(fn) {
    let ticking = false;
    let lastArgs = null;
    let rafId = null;

    const throttled = function (...args) {
      lastArgs = args;
      if (ticking) {
        return;
      }
      ticking = true;
      rafId = safeRequestAnimationFrame(() => {
        ticking = false;
        rafId = null;
        const callArgs = lastArgs;
        lastArgs = null;
        fn.apply(this, callArgs);
      });
    };

    throttled.cancel = function () {
      if (rafId) {
        safeCancelAnimationFrame(rafId);
        rafId = null;
        ticking = false;
        lastArgs = null;
      }
    };

    return throttled;
  }

  // 暴露到全局命名空间
  window.iGEMUtils = {
    debounce,
    getScrollPosition,
    getScrollHeight,
    getClientHeight,
    detectScrollContainer,
    supportsPassiveEvents,
    safeRequestAnimationFrame,
    safeCancelAnimationFrame,
    rafThrottle
  };
})();
