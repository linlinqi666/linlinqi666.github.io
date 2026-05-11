(function () {
  'use strict';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
  } else {
    initScrollAnimations();
  }

  function initScrollAnimations() {
    var animateElements = document.querySelectorAll('.animate-on-scroll');

    if (!animateElements.length) return;

    // 使用 Intersection Observer 来检测元素是否进入视口
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // 动画触发后可以停止观察
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1 // 元素10%进入视口时触发
    });

    // 观察所有需要动画的元素
    animateElements.forEach(function (element) {
      observer.observe(element);
    });

    // 对于第一个 section，立即检查是否在视口中
    var heroSection = document.querySelector('.section-1');
    if (heroSection) {
      var heroRect = heroSection.getBoundingClientRect();
      if (heroRect.top < window.innerHeight) {
        heroSection.querySelectorAll('.animate-on-scroll').forEach(function(el) {
          el.classList.add('visible');
        });
      }
    }
  }
})();
