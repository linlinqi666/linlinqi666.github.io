(function () {
  'use strict';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
  } else {
    initMobileMenu();
  }

  function initMobileMenu() {
    var hamburgerBtn = document.getElementById('hamburger-menu');
    var overlay = document.getElementById('mobile-menu-overlay');
    var mobileMenu = document.getElementById('mobile-menu');

    if (!hamburgerBtn || !overlay || !mobileMenu) return;

    // ===== ARIA属性初始化 =====
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    hamburgerBtn.setAttribute('aria-controls', 'mobile-menu-overlay');
    hamburgerBtn.setAttribute('aria-label', '打开导航菜单');
    hamburgerBtn.setAttribute('role', 'button');
    hamburgerBtn.setAttribute('tabindex', '0');

    mobileMenu.setAttribute('role', 'navigation');
    mobileMenu.setAttribute('aria-label', '移动端导航');

    // ===== 焦点管理 - 存储第一个和最后一个可聚焦元素 =====
    var focusableElements = mobileMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    var firstFocusable = focusableElements[0];
    var lastFocusable = focusableElements[focusableElements.length - 1];

    // ===== 更新ARIA状态的辅助函数 =====
    function updateAria(isOpen) {
      hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      hamburgerBtn.setAttribute('aria-label', isOpen ? '关闭导航菜单' : '打开导航菜单');
    }

    // ===== 关闭菜单的辅助函数 =====
    function closeMenu() {
      hamburgerBtn.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      updateAria(false);
      
      // 关闭所有下拉菜单
      document.querySelectorAll('.dropdown-open').forEach(function (item) {
        item.classList.remove('dropdown-open');
      });
      
      // 恢复焦点到汉堡按钮
      hamburgerBtn.focus();
    }

    // ===== 打开菜单的辅助函数 =====
    function openMenu() {
      hamburgerBtn.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      updateAria(true);
      
      // 聚焦到第一个菜单项
      if (firstFocusable) {
        setTimeout(function() {
          firstFocusable.focus();
        }, 100);
      }
    }

    // ===== 汉堡按钮点击 =====
    hamburgerBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      
      if (overlay.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // ===== 汉堡按钮键盘支持 =====
    hamburgerBtn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        if (overlay.classList.contains('active')) {
          closeMenu();
        } else {
          openMenu();
        }
      }
    });

    // ===== 遮罩层点击 =====
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        closeMenu();
      }
    });

    // ===== 下拉菜单切换 =====
    var dropdownToggles = mobileMenu.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(function (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-haspopup', 'true');
      
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var parent = this.parentElement;
        var isOpen = parent.classList.toggle('dropdown-open');
        this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    });

    // ===== 导航链接点击 =====
    var navLinks = mobileMenu.querySelectorAll('a:not(.dropdown-toggle)');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu();
      });
    });

    // ===== 键盘导航支持 =====
    document.addEventListener('keydown', function (e) {
      // ESC键关闭菜单
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        closeMenu();
        return;
      }
      
      // Tab键焦点循环（仅在菜单打开时）
      if (e.key === 'Tab' && overlay.classList.contains('active')) {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            if (lastFocusable) lastFocusable.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            if (firstFocusable) firstFocusable.focus();
          }
        }
      }
    });
  }
})();
