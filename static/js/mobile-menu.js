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

    hamburgerBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      this.classList.toggle('active');
      overlay.classList.toggle('active');

      if (overlay.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
        document.querySelectorAll('.dropdown-open').forEach(function (item) {
          item.classList.remove('dropdown-open');
        });
      }
    });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        hamburgerBtn.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        document.querySelectorAll('.dropdown-open').forEach(function (item) {
          item.classList.remove('dropdown-open');
        });
      }
    });

    var dropdownToggles = mobileMenu.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(function (toggle) {
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.parentElement.classList.toggle('dropdown-open');
      });
    });

    var navLinks = mobileMenu.querySelectorAll('a:not(.dropdown-toggle)');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        hamburgerBtn.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        hamburgerBtn.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        document.querySelectorAll('.dropdown-open').forEach(function (item) {
          item.classList.remove('dropdown-open');
        });
      }
    });
  }
})();
