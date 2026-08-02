/**
 * iGEM SZPU-2026 - Page Progress Bar
 *
 * Top-loading progress indicator with automatic trickle progress and
 * page-load lifecycle integration. Built without external dependencies.
 */
(function () {
  'use strict';

  if (!window.iGEMUtils) {
    console.error('[PageProgress] 缺少依赖：请先加载 static/js/utils.js');
    return;
  }

  const Utils = window.iGEMUtils;
  const raf = Utils.safeRequestAnimationFrame;
  const caf = Utils.safeCancelAnimationFrame;

  /** @type {Object} Default runtime configuration. */
  const CONFIG = {
    AUTO_HIDE: true,
    AUTO_HIDE_DELAY: 600,
    TRICKLE_INTERVAL: 400,
    TRICKLE_RATE: 0.02,
    TRICKLE_MAX: 0.999,
    DEBUG_MODE: false
  };

  /**
   * @typedef {Object} ProgressState
   * @property {number} progress
   * @property {boolean} isLoading
   * @property {boolean} isCompleted
   * @property {number|null} trickleTimer
   * @property {number|null} autoHideTimer
   * @property {number|null} rafId
   * @property {boolean} rafPending
   * @property {string} targetWidth
   * @property {HTMLElement|null} containerElement
   * @property {HTMLElement|null} fillElement
   * @property {HTMLElement|null} glowElement
   * @property {Function|null} readyStateHandler
   * @property {Function|null} loadHandler
   */

  /** @type {ProgressState} Internal component state. */
  const state = {
    progress: 0,
    isLoading: false,
    isCompleted: false,
    trickleTimer: null,
    autoHideTimer: null,
    rafId: null,
    rafPending: false,
    targetWidth: '0%',
    containerElement: null,
    fillElement: null,
    glowElement: null,
    readyStateHandler: null,
    loadHandler: null
  };

  /**
   * Logs a debug message when debug mode is enabled.
   * @param {string} message
   * @param {*} [data]
   */
  function log(message, data) {
    if (CONFIG.DEBUG_MODE) {
      console.log('[PageProgress]', message, data || '');
    }
  }

  /** Cancels any pending animation frame and resets the scheduling flag. */
  function cancelRaf() {
    if (state.rafId) {
      caf(state.rafId);
      state.rafId = null;
    }
    state.rafPending = false;
  }

  /** Clears both the trickle interval and the auto-hide timeout. */
  function clearTimers() {
    if (state.trickleTimer) {
      clearInterval(state.trickleTimer);
      state.trickleTimer = null;
    }
    if (state.autoHideTimer) {
      clearTimeout(state.autoHideTimer);
      state.autoHideTimer = null;
    }
  }

  /** Removes document/window listeners registered by the component. */
  function removeEventListeners() {
    if (state.readyStateHandler) {
      document.removeEventListener('readystatechange', state.readyStateHandler);
      state.readyStateHandler = null;
    }
    if (state.loadHandler) {
      window.removeEventListener('load', state.loadHandler);
      state.loadHandler = null;
    }
  }

  /** Creates or reuses the progress bar DOM and caches element references. */
  const DOMManager = {
    create: function () {
      let bar = document.getElementById('page-progress-bar');
      if (bar) {
        log('Progress bar exists, reusing');
      } else {
        log('Creating progress bar');
        bar = document.createElement('div');
        bar.id = 'page-progress-bar';
        bar.innerHTML = '<div class="ppb-track"><div class="ppb-fill"><div class="ppb-glow"></div></div></div>';
        document.body.appendChild(bar);
      }

      state.containerElement = bar;
      state.fillElement = bar.querySelector('.ppb-fill');
      state.glowElement = bar.querySelector('.ppb-glow');
    },

    destroy: function () {
      log('Destroying DOM');
      if (state.containerElement && state.containerElement.parentNode) {
        state.containerElement.parentNode.removeChild(state.containerElement);
      }
      state.containerElement = null;
      state.fillElement = null;
      state.glowElement = null;
    }
  };

  /** Schedules and applies UI updates efficiently with a single RAF per frame. */
  const UIUpdater = {
    update: function () {
      if (!state.fillElement) return;

      const percent = Math.round(state.progress * 100);
      state.targetWidth = percent + '%';

      if (state.rafPending) return;

      state.rafPending = true;
      state.rafId = raf(function applyWidth() {
        state.rafPending = false;
        state.rafId = null;
        if (state.fillElement) {
          state.fillElement.style.width = state.targetWidth;
        }
      });
    },

    show: function () {
      if (!state.containerElement) return;
      state.containerElement.classList.add('is-visible', 'is-loading');
      state.containerElement.classList.remove('is-completed');
    },

    markComplete: function () {
      if (!state.containerElement || !state.fillElement) return;
      state.containerElement.classList.remove('is-loading');
      state.containerElement.classList.add('is-completed');
      state.fillElement.classList.add('ppb-fill--pulse');
    },

    hide: function () {
      if (!state.containerElement || !state.fillElement) return;
      state.containerElement.classList.remove('is-visible');
      state.fillElement.classList.remove('ppb-fill--pulse');
    }
  };

  /** Core progress bar behavior including trickle and lifecycle. */
  const ProgressBar = {
    start: function () {
      if (state.isLoading) return this;

      log('Starting progress bar');

      state.progress = 0.08;
      state.isLoading = true;
      state.isCompleted = false;

      UIUpdater.update();
      UIUpdater.show();
      ProgressBar.startTrickle();

      return this;
    },

    /**
     * Sets the progress to a specific percentage.
     * @param {number} value - Percentage in the range 0-100.
     * @returns {ProgressBar}
     */
    setProgress: function (value) {
      if (state.isCompleted) return this;

      state.progress = Math.min(Math.max(value / 100, 0), CONFIG.TRICKLE_MAX);
      UIUpdater.update();

      return this;
    },

    complete: function () {
      if (state.isCompleted) return this;

      log('Completing progress bar');

      state.progress = 1;
      state.isLoading = false;
      state.isCompleted = true;

      clearTimers();
      UIUpdater.update();
      UIUpdater.markComplete();

      if (state.readyStateHandler) {
        document.removeEventListener('readystatechange', state.readyStateHandler);
        state.readyStateHandler = null;
      }

      if (CONFIG.AUTO_HIDE) {
        state.autoHideTimer = setTimeout(function () {
          UIUpdater.hide();
        }, CONFIG.AUTO_HIDE_DELAY);
      }

      return this;
    },

    startTrickle: function () {
      log('Starting trickle');

      clearTimers();

      state.trickleTimer = setInterval(function () {
        if (state.isLoading && !state.isCompleted) {
          const remaining = 1 - state.progress;
          state.progress = Math.min(
            state.progress + remaining * (Math.random() * CONFIG.TRICKLE_RATE + 0.02),
            CONFIG.TRICKLE_MAX
          );
          UIUpdater.update();
        }
      }, CONFIG.TRICKLE_INTERVAL);
    },

    startAutoProgress: function () {
      log('Starting auto progress');

      if (document.readyState === 'complete') {
        ProgressBar.start();
        ProgressBar.setProgress(80);
        setTimeout(function () {
          ProgressBar.complete();
        }, 300);
        return this;
      }

      ProgressBar.start();

      state.readyStateHandler = function updateOnReadyState() {
        switch (document.readyState) {
          case 'loading':
            ProgressBar.setProgress(20);
            break;
          case 'interactive':
            ProgressBar.setProgress(60);
            break;
          case 'complete':
            ProgressBar.complete();
            break;
        }
      };

      state.readyStateHandler();
      document.addEventListener('readystatechange', state.readyStateHandler);

      state.loadHandler = function () {
        if (!state.isCompleted) {
          ProgressBar.complete();
        }
      };
      window.addEventListener('load', state.loadHandler, { once: true });

      return this;
    }
  };

  /**
   * Creates a new PageProgressBar instance.
   * @param {Object} [options]
   * @param {boolean} [options.autoHide]
   * @param {number} [options.autoHideDelay]
   * @returns {Object} Instance API.
   */
  function PageProgressBar(options) {
    if (options) {
      if (typeof options.autoHide !== 'undefined') {
        CONFIG.AUTO_HIDE = options.autoHide;
      }
      if (options.autoHideDelay) {
        CONFIG.AUTO_HIDE_DELAY = options.autoHideDelay;
      }
    }

    DOMManager.create();

    return {
      start: ProgressBar.start,
      setProgress: ProgressBar.setProgress,
      complete: ProgressBar.complete,
      startAutoProgress: ProgressBar.startAutoProgress,
      destroy: PageProgressBar.destroy
    };
  }

  /**
   * Enables or disables debug logging.
   * @param {boolean} enabled
   */
  PageProgressBar.setDebugMode = function (enabled) {
    CONFIG.DEBUG_MODE = enabled;
    log('Debug mode: ' + (enabled ? 'on' : 'off'));
  };

  /** @returns {Object} A snapshot of the current progress state. */
  PageProgressBar.getState = function () {
    return {
      progress: state.progress,
      isLoading: state.isLoading,
      isCompleted: state.isCompleted
    };
  };

  /** Destroys the component, clearing timers, RAF and event listeners. */
  PageProgressBar.destroy = function () {
    log('Destroying component');
    cancelRaf();
    clearTimers();
    removeEventListeners();
    DOMManager.destroy();
  };

  window.PageProgressBar = PageProgressBar;

  window.addEventListener('beforeunload', function () {
    if (window.PageProgressBar && window.PageProgressBar.destroy) {
      window.PageProgressBar.destroy();
    }
  });
})();
