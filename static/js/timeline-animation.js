document.addEventListener('DOMContentLoaded', function() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        // 使用 requestAnimationFrame 确保动画在下一帧触发，比 setTimeout 更流畅
        requestAnimationFrame(function() {
          entry.target.classList.add('visible');
        });
        // 动画触发后取消观察，减少内存占用
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-item').forEach(function(item) {
    observer.observe(item);
  });
});
