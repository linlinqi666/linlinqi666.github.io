document.addEventListener('DOMContentLoaded', function() {
  const animateItems = document.querySelectorAll('.animate-item');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry, index) {
      if (entry.isIntersecting) {
        setTimeout(function() {
          entry.target.classList.add('visible');
        }, index * 300);
      }
    });
  }, observerOptions);
  
  animateItems.forEach(function(item) {
    observer.observe(item);
  });
});
