(function () {
  'use strict';

  // 保存页面原始的 body overflow 样式
  var originalBodyOverflow = '';

  // 性能优化：缓存状态标志
  var isMenuOpen = false;
  var isAnimating = false;
  var lastWindowWidth = window.innerWidth;

  // 性能优化：防抖函数
  function debounce(func, wait) {
    var timeoutId;
    return function () {
      var context = this;
      var args = arguments;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
  } else {
    initMobileMenu();
  }

  function initMobileMenu() {
    // 缓存所有 DOM 元素
    var hamburgerBtn = document.getElementById('hamburger-menu');
    var overlay = document.getElementById('mobile-menu-overlay');
    var mobileMenu = document.getElementById('mobile-menu');
    var closeBtn = document.getElementById('mobile-menu-close');

    // 检查关键元素是否存在
    if (!hamburgerBtn || !overlay || !mobileMenu) {
      console.warn('Mobile menu elements not found, skipping initialization');
      return;
    }

    // 缓存可聚焦元素
    var focusableElements = mobileMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    var firstFocusable = focusableElements[0] || hamburgerBtn;
    var lastFocusable = focusableElements[focusableElements.length - 1] || hamburgerBtn;

    // ===== ARIA属性初始化 =====
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    hamburgerBtn.setAttribute('aria-controls', 'mobile-menu-overlay');
    hamburgerBtn.setAttribute('aria-label', '打开导航菜单');
    hamburgerBtn.setAttribute('role', 'button');
    hamburgerBtn.setAttribute('tabindex', '0');

    mobileMenu.setAttribute('role', 'navigation');
    mobileMenu.setAttribute('aria-label', '移动端导航');

    // ===== 更新ARIA状态的辅助函数 =====
    function updateAria(open) {
      hamburgerBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      hamburgerBtn.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
    }

    // ===== 关闭菜单的辅助函数（使用requestAnimationFrame优化） =====
    function closeMenu() {
      if (!isMenuOpen || isAnimating) return;
      
      isAnimating = true;
      
      requestAnimationFrame(function () {
        hamburgerBtn.classList.remove('active');
        overlay.classList.remove('active');
        mobileMenu.classList.remove('active');

        // 恢复页面原始的 overflow 样式
        if (originalBodyOverflow !== '') {
          document.body.style.overflow = originalBodyOverflow;
        } else {
          document.body.style.overflow = '';
        }

        updateAria(false);

        // 关闭所有下拉菜单
        var dropdownOpenElements = document.querySelectorAll('.dropdown-open');
        for (var i = 0; i < dropdownOpenElements.length; i++) {
          dropdownOpenElements[i].classList.remove('dropdown-open');
        }

        // 恢复焦点到汉堡按钮
        try {
          hamburgerBtn.focus();
        } catch (e) {
          // 忽略焦点设置错误
        }

        // 在桌面端重新应用内联隐藏样式
        if (window.innerWidth > 1024) {
          overlay.style.display = 'none';
          overlay.style.opacity = '0';
          overlay.style.visibility = 'hidden';
          mobileMenu.style.opacity = '0';
        }

        isMenuOpen = false;
        isAnimating = false;
      });
    }

    // ===== 打开菜单的辅助函数 =====
    function openMenu() {
      if (isMenuOpen || isAnimating) return;
      
      isAnimating = true;

      requestAnimationFrame(function () {
        // 保存页面原始的 overflow 样式
        originalBodyOverflow = document.body.style.overflow || getComputedStyle(document.body).overflow;

        hamburgerBtn.classList.add('active');
        overlay.classList.add('active');
        mobileMenu.classList.add('active');

        // 清除内联样式，让CSS类控制显示
        overlay.style.display = '';
        overlay.style.opacity = '';
        overlay.style.visibility = '';
        mobileMenu.style.opacity = '';

        document.body.style.overflow = 'hidden';
        updateAria(true);

        // 聚焦到第一个菜单项（使用requestAnimationFrame替代setTimeout）
        requestAnimationFrame(function () {
          try {
            if (firstFocusable && typeof firstFocusable.focus === 'function') {
              firstFocusable.focus();
            }
          } catch (e) {
            // 忽略焦点设置错误
          }
          
          isMenuOpen = true;
          isAnimating = false;
        });
      });
    }

    // ===== 汉堡按钮点击 =====
    hamburgerBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (isMenuOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    }, { passive: true });

    // ===== 汉堡按钮键盘支持 =====
    hamburgerBtn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.keyCode === 13 || e.keyCode === 32) {
        e.preventDefault();
        e.stopPropagation();
        if (isMenuOpen) {
          closeMenu();
        } else {
          openMenu();
        }
      }
    });

    // ===== 关闭按钮点击 =====
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeMenu();
      }, { passive: true });
    }

    // ===== 遮罩层点击 =====
    overlay.addEventListener('click', function (e) {
      // 只在点击遮罩层本身时关闭菜单，点击菜单内容区域不关闭
      if (e.target === overlay) {
        closeMenu();
      }
    }, { passive: true });

    // ===== 下拉菜单切换 =====
    var dropdownToggles = mobileMenu.querySelectorAll('.dropdown-toggle');
    for (var j = 0; j < dropdownToggles.length; j++) {
      var toggle = dropdownToggles[j];
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-haspopup', 'true');

      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var parent = this.parentElement;
        var isOpen = parent.classList.toggle('dropdown-open');
        this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }, { passive: true });
    }

    // ===== 导航链接点击 =====
    var navLinks = mobileMenu.querySelectorAll('a:not(.dropdown-toggle)');
    for (var k = 0; k < navLinks.length; k++) {
      navLinks[k].addEventListener('click', function () {
        closeMenu();
      }, { passive: true });
    }

    // ===== 键盘导航支持 =====
    document.addEventListener('keydown', function (e) {
      // ESC键关闭菜单
      if ((e.key === 'Escape' || e.keyCode === 27) && isMenuOpen) {
        closeMenu();
        return;
      }

      // Tab键焦点循环（仅在菜单打开时）
      if (e.key === 'Tab' && isMenuOpen) {
        if (e.shiftKey) {
          // Shift + Tab: 向前聚焦
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            try {
              if (lastFocusable && typeof lastFocusable.focus === 'function') {
                lastFocusable.focus();
              }
            } catch (e) {
              // 忽略焦点设置错误
            }
          }
        } else {
          // Tab: 向后聚焦
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            try {
              if (firstFocusable && typeof firstFocusable.focus === 'function') {
                firstFocusable.focus();
              }
            } catch (e) {
              // 忽略焦点设置错误
            }
          }
        }
      }
    });

    // ===== 窗口大小变化时关闭菜单（使用防抖优化） =====
    var handleResize = debounce(function () {
      var currentWidth = window.innerWidth;
      // 只有在跨越1024px断点时才执行操作，避免频繁触发
      if ((lastWindowWidth <= 1024 && currentWidth > 1024) || 
          (lastWindowWidth > 1024 && currentWidth <= 1024)) {
        if (isMenuOpen) {
          closeMenu();
        }
      }
      lastWindowWidth = currentWidth;
    }, 100);

    window.addEventListener('resize', handleResize, { passive: true });

    // 暴露公共方法（供外部调用）
    window.mobileMenu = {
      open: openMenu,
      close: closeMenu,
      isOpen: function () {
        return isMenuOpen;
      }
    };
  }
})();
