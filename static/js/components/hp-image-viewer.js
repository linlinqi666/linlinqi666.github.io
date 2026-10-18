(function () {
  'use strict';

  var GROUP_SELECTOR = '.hp-photo-grid, .hz-detail-card__gallery';
  var FOCUSABLE = 'button:not([disabled])';

  function captionOf(image) {
    var figure = image.closest ? image.closest('figure') : null;
    if (figure) {
      var caption = figure.querySelector('figcaption');
      if (caption && caption.textContent.trim()) return caption.textContent.trim();
    }
    return image.getAttribute('alt') || '';
  }

  function init() {
    var containers = document.querySelectorAll(GROUP_SELECTOR);
    var groups = [];
    Array.prototype.forEach.call(containers, function (container) {
      var images = Array.prototype.filter.call(container.querySelectorAll('img'), function (image) {
        return !!(image.getAttribute('src') || image.getAttribute('data-src'));
      });
      if (images.length) groups.push(images);
    });
    if (!groups.length) return;

    var viewer = document.createElement('div');
    viewer.className = 'hp-image-viewer';
    viewer.setAttribute('role', 'dialog');
    viewer.setAttribute('aria-modal', 'true');
    viewer.setAttribute('aria-label', 'Image viewer');
    viewer.hidden = true;
    viewer.innerHTML =
      '<div class="hp-image-viewer__backdrop" data-hp-viewer-dismiss></div>' +
      '<figure class="hp-image-viewer__frame">' +
      '<img class="hp-image-viewer__img" alt="" decoding="async">' +
      '<figcaption class="hp-image-viewer__caption"></figcaption>' +
      '</figure>' +
      '<p class="hp-image-viewer__count" aria-live="polite"></p>' +
      '<button type="button" class="hp-image-viewer__close" aria-label="Close image viewer">&#10005;</button>' +
      '<button type="button" class="hp-image-viewer__nav hp-image-viewer__nav--prev" aria-label="Previous image">&#8249;</button>' +
      '<button type="button" class="hp-image-viewer__nav hp-image-viewer__nav--next" aria-label="Next image">&#8250;</button>';
    document.body.appendChild(viewer);

    var backdrop = viewer.querySelector('.hp-image-viewer__backdrop');
    var frameImg = viewer.querySelector('.hp-image-viewer__img');
    var captionNode = viewer.querySelector('.hp-image-viewer__caption');
    var countNode = viewer.querySelector('.hp-image-viewer__count');
    var closeButton = viewer.querySelector('.hp-image-viewer__close');
    var prevButton = viewer.querySelector('.hp-image-viewer__nav--prev');
    var nextButton = viewer.querySelector('.hp-image-viewer__nav--next');

    var current = { group: 0, index: 0, trigger: null };

    function render() {
      var images = groups[current.group];
      var image = images[current.index];
      var caption = captionOf(image);
      frameImg.src = image.currentSrc || image.getAttribute('src');
      frameImg.alt = caption;
      captionNode.textContent = caption;
      countNode.textContent = images.length > 1 ? (current.index + 1) + ' / ' + images.length : '';
      var single = images.length < 2;
      prevButton.hidden = single;
      nextButton.hidden = single;
    }

    function open(groupIndex, imageIndex, trigger) {
      current.group = groupIndex;
      current.index = imageIndex;
      current.trigger = trigger || null;
      render();
      viewer.hidden = false;
      document.body.classList.add('hp-viewer-open');
      closeButton.focus();
    }

    function close() {
      if (viewer.hidden) return;
      viewer.hidden = true;
      document.body.classList.remove('hp-viewer-open');
      frameImg.removeAttribute('src');
      if (current.trigger && current.trigger.isConnected) current.trigger.focus();
      current.trigger = null;
    }

    function step(delta) {
      var images = groups[current.group];
      current.index = (current.index + delta + images.length) % images.length;
      render();
    }

    groups.forEach(function (images, groupIndex) {
      images.forEach(function (image, imageIndex) {
        if (image.dataset.hpViewerBound === 'true') return;
        image.dataset.hpViewerBound = 'true';
        if (!image.hasAttribute('tabindex')) image.setAttribute('tabindex', '0');
        if (!image.getAttribute('role')) image.setAttribute('role', 'button');
        var label = captionOf(image);
        if (label && !image.getAttribute('aria-label')) image.setAttribute('aria-label', 'Enlarge image: ' + label);
        image.addEventListener('click', function () {
          open(groupIndex, imageIndex, image);
        });
        image.addEventListener('keydown', function (event) {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          open(groupIndex, imageIndex, image);
        });
      });
    });

    closeButton.addEventListener('click', close);
    backdrop.addEventListener('click', close);
    prevButton.addEventListener('click', function () { step(-1); });
    nextButton.addEventListener('click', function () { step(1); });
    viewer.addEventListener('click', function (event) {
      if (event.target === viewer) close();
    });

    document.addEventListener('keydown', function (event) {
      if (viewer.hidden) return;
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key === 'ArrowLeft') {
        step(-1);
        return;
      }
      if (event.key === 'ArrowRight') {
        step(1);
        return;
      }
      if (event.key !== 'Tab') return;
      var items = Array.prototype.filter.call(viewer.querySelectorAll(FOCUSABLE), function (node) {
        return !node.hidden;
      });
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
