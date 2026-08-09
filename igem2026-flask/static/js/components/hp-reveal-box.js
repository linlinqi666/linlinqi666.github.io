/**
 * HPRevealBox - Pull-to-reveal content box for iGEM Human Practices pages.
 *
 * Supports mouse/touch drag, click/tap toggle, keyboard activation,
 * reduced-motion preference, and multiple independent instances.
 */
(function () {
  'use strict';

  function parseCssPx(element, variable, fallback) {
    var value = getComputedStyle(element).getPropertyValue(variable);
    var parsed = parseFloat((value || '').toString().trim());
    return isNaN(parsed) ? fallback : parsed;
  }

  function debounce(fn, wait) {
    var timer = null;
    return function () {
      var context = this;
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, wait);
    };
  }

  function HPRevealBox(element) {
    this.box = element;
    this.content = this.box.querySelector('.hp-reveal-content');
    this.handle = this.box.querySelector('.hp-reveal-handle');

    if (!this.content || !this.handle) {
      console.warn('HPRevealBox: missing .hp-reveal-content or .hp-reveal-handle', element);
      return;
    }

    this.isExpanded = false;
    this.isDragging = false;
    this.dragStartY = 0;
    this.dragStartHeight = 0;
    this.dragDistance = 0;
    this._suppressClick = false;
    this._prefersReduced = false;
    this._mediaQuery = null;

    this._init();
  }

  HPRevealBox.prototype._init = function () {
    this._updateDimensions();
    this._initA11y();
    this._bindEvents();
    this.collapse(false);
  };

  HPRevealBox.prototype._updateDimensions = function () {
    this.previewHeight = parseCssPx(this.box, '--hp-reveal-preview-height', 140);
    this.handleHeight = parseCssPx(this.box, '--hp-reveal-handle-height', 48);
    this.maxHeight = this.content.scrollHeight;
  };

  HPRevealBox.prototype._initA11y = function () {
    this.handle.setAttribute('tabindex', '0');
    this.handle.setAttribute('role', 'button');
    this.handle.setAttribute('aria-expanded', 'false');
    if (this.content.id) {
      this.handle.setAttribute('aria-controls', this.content.id);
    }
  };

  HPRevealBox.prototype._bindEvents = function () {
    var self = this;

    // Pointer events cover mouse and touch with a single code path.
    this.handle.addEventListener('pointerdown', function (e) {
      self._onPointerDown(e);
    });
    this.handle.addEventListener('pointermove', function (e) {
      self._onPointerMove(e);
    });
    this.handle.addEventListener('pointerup', function (e) {
      self._onPointerUp(e);
    });
    this.handle.addEventListener('pointercancel', function (e) {
      self._onPointerUp(e);
    });

    // Click toggles when the gesture was not a drag.
    this.handle.addEventListener('click', function () {
      if (self._suppressClick) {
        self._suppressClick = false;
        return;
      }
      self.toggle(true);
    });

    // Keyboard toggle.
    this.handle.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        self.toggle(true);
      }
    });

    // Reduced motion preference.
    this._mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this._prefersReduced = this._mediaQuery.matches;
    if (this._mediaQuery.addEventListener) {
      this._mediaQuery.addEventListener('change', function (e) {
        self._prefersReduced = e.matches;
      });
    } else if (this._mediaQuery.addListener) {
      // Older Safari fallback.
      this._mediaQuery.addListener(function (e) {
        self._prefersReduced = e.matches;
      });
    }

    // Recompute natural height on resize.
    window.addEventListener('resize', debounce(function () {
      self._onResize();
    }, 150));
  };

  HPRevealBox.prototype._onPointerDown = function (e) {
    // Only accept primary pointer (left mouse, single touch, pen).
    if (e.button !== 0) return;

    this.isDragging = true;
    this.dragDistance = 0;
    this.dragStartY = e.clientY;
    this.dragStartHeight = this.box.offsetHeight;

    this.box.classList.remove('is-animating');
    this.box.classList.add('is-dragging');

    try {
      this.handle.setPointerCapture(e.pointerId);
    } catch (err) {
      // ignore
    }

    e.preventDefault();
  };

  HPRevealBox.prototype._onPointerMove = function (e) {
    if (!this.isDragging) return;

    var delta = e.clientY - this.dragStartY;
    this.dragDistance = Math.abs(delta);
    var newHeight = this.dragStartHeight + delta;

    this._setHeight(newHeight, false);
    e.preventDefault();
  };

  HPRevealBox.prototype._onPointerUp = function (e) {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.box.classList.remove('is-dragging');

    try {
      if (e.pointerId !== undefined) {
        this.handle.releasePointerCapture(e.pointerId);
      }
    } catch (err) {
      // ignore
    }

    // If the user dragged more than a few pixels, do not treat it as a click.
    if (this.dragDistance > 5) {
      this._suppressClick = true;
    }

    var currentHeight = this.box.offsetHeight;
    var threshold = Math.max(this.previewHeight, this.maxHeight * 0.5);

    if (currentHeight >= threshold) {
      this.expand(true);
    } else {
      this.collapse(true);
    }

    e.preventDefault();
  };

  HPRevealBox.prototype._onResize = function () {
    this._updateDimensions();
    if (this.isExpanded) {
      this._setHeight(this.maxHeight, false);
    } else {
      this._setHeight(this.previewHeight, false);
    }
  };

  HPRevealBox.prototype._setHeight = function (value, animate) {
    var target = Math.max(this.previewHeight, Math.min(this.maxHeight, value));
    this.box.style.height = target + 'px';

    if (animate && !this._prefersReduced) {
      this.box.classList.add('is-animating');
      this._clearAnimationClass();
    } else {
      this.box.classList.remove('is-animating');
    }
  };

  HPRevealBox.prototype._clearAnimationClass = function () {
    var self = this;
    if (this._animationTimer) {
      clearTimeout(this._animationTimer);
    }
    this._animationTimer = setTimeout(function () {
      self.box.classList.remove('is-animating');
    }, 500);
  };

  HPRevealBox.prototype.expand = function (animate) {
    this.isExpanded = true;
    this.box.classList.add('is-expanded');
    this.handle.setAttribute('aria-expanded', 'true');
    this._setHeight(this.maxHeight, animate);
  };

  HPRevealBox.prototype.collapse = function (animate) {
    this.isExpanded = false;
    this.box.classList.remove('is-expanded');
    this.handle.setAttribute('aria-expanded', 'false');
    this._setHeight(this.previewHeight, animate);
  };

  HPRevealBox.prototype.toggle = function (animate) {
    if (this.isExpanded) {
      this.collapse(animate);
    } else {
      this.expand(animate);
    }
  };

  // Auto-initialize all reveal boxes on the page.
  function initAll() {
    var boxes = document.querySelectorAll('[data-hp-reveal]');
    for (var i = 0; i < boxes.length; i++) {
      new HPRevealBox(boxes[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
