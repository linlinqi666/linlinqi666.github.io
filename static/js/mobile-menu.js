/**
 * mobile-menu.js
 * 移动端导航菜单控制器。
 *
 * 功能：
 * - 汉堡按钮切换菜单打开/关闭
 * - 键盘支持（Enter/Space 打开，ESC 关闭，Tab 焦点循环）
 * - ARIA 属性管理
 * - body 滚动锁定并恢复原始 overflow
 * - 点击遮罩层关闭，点击菜单内容不关闭
 * - 移动端菜单内下拉切换
 * - 导航链接点击关闭菜单
 * - 跨越 1024px 断点时关闭菜单
 *
 * 公共 API：window.mobileMenu { open, close, isOpen }
 */
(function () {
  'use strict';

  const Utils = window.iGEMUtils || {};
  const raf = Utils.safeRequestAnimationFrame || function (callback) { return setTimeout(callback, 16); };

  const MENU_BREAKPOINT = 1024;

  /** @type {{ isOpen: boolean, isAnimating: boolean, lastWindowWidth: number, originalBodyOverflow: string }} */
  const state = {
    isOpen: false,
    isAnimating: false,
    lastWindowWidth: window.innerWidth,
    originalBodyOverflow: ''
  };

  /**
   * 优先使用共享工具 utils.js 的 debounce；未加载时提供最小本地实现。
   * @type {<T extends (...args: any[]) => void>(fn: T, wait: number) => (...args: any[]) => void}
   */
  const debounce =
    window.iGEMUtils && typeof window.iGEMUtils.debounce === 'function'
      ? window.iGEMUtils.debounce
      : function (fn, wait) {
        let timeout;
        return function (...args) {
          const context = this;
          clearTimeout(timeout);
          timeout = setTimeout(() => fn.apply(context, args), wait);
        };
      };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
  } else {
    initMobileMenu();
  }

  /** 在 DOM 就绪后初始化移动菜单。 */
  function initMobileMenu() {
    const hamburgerBtn = document.getElementById('hamburger-menu');
    const overlay = document.getElementById('mobile-menu-overlay');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeBtn = document.getElementById('mobile-menu-close');

    if (!hamburgerBtn || !overlay || !mobileMenu) {
      console.warn('Mobile menu elements not found, skipping initialization');
      return;
    }

    /** @type {HTMLElement[]} */
    let focusableElements = [];
    let firstFocusable = hamburgerBtn;
    let lastFocusable = hamburgerBtn;

    initAria();
    bindEvents();

    /** 初始化可访问性 ARIA 属性。 */
    function initAria() {
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      hamburgerBtn.setAttribute('aria-controls', 'mobile-menu-overlay');
      hamburgerBtn.setAttribute('aria-label', '打开导航菜单');
      hamburgerBtn.setAttribute('role', 'button');
      hamburgerBtn.setAttribute('tabindex', '0');

      mobileMenu.setAttribute('role', 'navigation');
      mobileMenu.setAttribute('aria-label', '移动端导航');
    }

    /**
     * 更新汉堡按钮的 ARIA 状态。
     * @param {boolean} open
     */
    function updateAria(open) {
      hamburgerBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      hamburgerBtn.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
    }

    /**
     * 安全地设置焦点，忽略浏览器抛出的错误。
     * @param {HTMLElement|null} element
     */
    function safeFocus(element) {
      if (!element || typeof element.focus !== 'function') return;
      try {
        element.focus();
      } catch (e) {
        // 忽略焦点设置错误
      }
    }

    /** 刷新菜单内可聚焦元素缓存。 */
    function refreshFocusableElements() {
      focusableElements = Array.from(
        mobileMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')
      );
      firstFocusable = focusableElements[0] || hamburgerBtn;
      lastFocusable = focusableElements[focusableElements.length - 1] || hamburgerBtn;
    }

    /** 关闭所有已打开的下拉菜单。 */
    function closeAllDropdowns() {
      document.querySelectorAll('.dropdown-open').forEach(el => el.classList.remove('dropdown-open'));
    }

    /** 打开移动菜单。 */
    function openMenu() {
      if (state.isOpen || state.isAnimating) return;

      state.isAnimating = true;

      raf(() => {
        state.originalBodyOverflow = document.body.style.overflow || getComputedStyle(document.body).overflow;

        hamburgerBtn.classList.add('active');
        overlay.classList.add('active');
        mobileMenu.classList.add('active');

        // 清除内联样式，让 CSS 类控制显示
        overlay.style.display = '';
        overlay.style.opacity = '';
        overlay.style.visibility = '';
        mobileMenu.style.opacity = '';

        document.body.style.overflow = 'hidden';
        updateAria(true);

        raf(() => {
          refreshFocusableElements();
          safeFocus(firstFocusable);
          state.isOpen = true;
          state.isAnimating = false;
        });
      });
    }

    /** 关闭移动菜单。 */
    function closeMenu() {
      if (!state.isOpen || state.isAnimating) return;

      state.isAnimating = true;

      raf(() => {
        hamburgerBtn.classList.remove('active');
        overlay.classList.remove('active');
        mobileMenu.classList.remove('active');

        // 恢复页面原始 overflow 样式
        if (state.originalBodyOverflow !== '') {
          document.body.style.overflow = state.originalBodyOverflow;
        } else {
          document.body.style.overflow = '';
        }

        updateAria(false);
        closeAllDropdowns();
        safeFocus(hamburgerBtn);

        // 桌面端重新应用内联隐藏样式
        if (window.innerWidth > MENU_BREAKPOINT) {
          overlay.style.display = 'none';
          overlay.style.opacity = '0';
          overlay.style.visibility = 'hidden';
          mobileMenu.style.opacity = '0';
        }

        state.isOpen = false;
        state.isAnimating = false;
      });
    }

    /** 切换菜单状态。 */
    function toggleMenu() {
      if (state.isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    /** 处理 Tab/Shift+Tab 焦点循环。 */
    function handleTabKey(event) {
      if (event.key !== 'Tab' || !state.isOpen) return;

      if (event.shiftKey) {
        if (document.activeElement !== firstFocusable) return;
        event.preventDefault();
        safeFocus(lastFocusable);
        return;
      }

      if (document.activeElement !== lastFocusable) return;
      event.preventDefault();
      safeFocus(firstFocusable);
    }

    /** 绑定所有事件监听器。 */
    function bindEvents() {
      hamburgerBtn.addEventListener('click', event => {
        event.stopPropagation();
        toggleMenu();
      });

      hamburgerBtn.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ' && event.keyCode !== 13 && event.keyCode !== 32) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        toggleMenu();
      });

      if (closeBtn) {
        closeBtn.addEventListener('click', event => {
          event.stopPropagation();
          closeMenu();
        });
      }

      overlay.addEventListener('click', event => {
        if (event.target !== overlay) return;
        closeMenu();
      }, { passive: true });

      Array.from(mobileMenu.querySelectorAll('.dropdown-toggle')).forEach(toggle => {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-haspopup', 'true');

        toggle.addEventListener('click', event => {
          event.preventDefault();
          event.stopPropagation();
          const parent = toggle.parentElement;
          const isDropdownOpen = parent.classList.toggle('dropdown-open');
          toggle.setAttribute('aria-expanded', isDropdownOpen ? 'true' : 'false');
          refreshFocusableElements();
        });
      });

      Array.from(mobileMenu.querySelectorAll('a:not(.dropdown-toggle)')).forEach(link => {
        link.addEventListener('click', () => closeMenu());
      });

      document.addEventListener('keydown', event => {
        if ((event.key === 'Escape' || event.keyCode === 27) && state.isOpen) {
          closeMenu();
          return;
        }
        handleTabKey(event);
      });

      const handleResize = debounce(() => {
        const currentWidth = window.innerWidth;
        const crossedBreakpoint =
          (state.lastWindowWidth <= MENU_BREAKPOINT && currentWidth > MENU_BREAKPOINT) ||
          (state.lastWindowWidth > MENU_BREAKPOINT && currentWidth <= MENU_BREAKPOINT);

        if (crossedBreakpoint && state.isOpen) {
          closeMenu();
        }
        state.lastWindowWidth = currentWidth;
      }, 100);

      window.addEventListener('resize', handleResize, { passive: true });
    }

    window.mobileMenu = {
      open: openMenu,
      close: closeMenu,
      isOpen: () => state.isOpen
    };
  }
})();
