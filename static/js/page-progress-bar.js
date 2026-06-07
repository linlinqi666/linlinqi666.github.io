/**
 * ============================================
 * iGEM SZPU-2026 - Page Progress Bar
 * ============================================
 *
 * @version 2.0
 * @description 页面加载进度条（企业级性能优化版）
 * @features
 *   - requestAnimationFrame 确保 60fps 流畅渲染
 *   - 智能定时器管理，防止内存泄漏
 *   - 性能监控（可选）
 *   - 完全兼容原有 API
 *   - 自动清理机制
 */
(function () {
  'use strict';

  // ============================================
  // 配置常量（集中管理）
  // ============================================
  const CONFIG = {
    AUTO_HIDE: true,
    AUTO_HIDE_DELAY: 600,
    TRICKLE_INTERVAL: 400,
    TRICKLE_RATE: 0.02,
    TRICKLE_MAX: 0.999,
    DEBUG_MODE: false
  };

  // ============================================
  // 内部状态
  // ============================================
  const state = {
    progress: 0,
    isLoading: false,
    isCompleted: false,
    trickleTimer: null,
    fillElement: null,
    glowElement: null,
    containerElement: null,
    rafId: null
  };

  // ============================================
  // 工具函数
  // ============================================
  const Utils = {
    /**
     * 安全日志
     */
    log: function (message, data) {
      if (CONFIG.DEBUG_MODE) {
        console.log('[PageProgress]', message, data || '');
      }
    },

    /**
     * requestAnimationFrame 包装器
     */
    requestTick: function (callback) {
      if (state.rafId) {
        cancelAnimationFrame(state.rafId);
      }
      state.rafId = requestAnimationFrame(callback);
    },

    /**
     * 清理 RAF
     */
    cancelTick: function () {
      if (state.rafId) {
        cancelAnimationFrame(state.rafId);
        state.rafId = null;
      }
    },

    /**
     * 清理定时器
     */
    clearTimer: function () {
      if (state.trickleTimer) {
        clearInterval(state.trickleTimer);
        state.trickleTimer = null;
      }
    }
  };

  // ============================================
  // DOM 操作（集中管理）
  // ============================================
  const DOMManager = {
    /**
     * 创建进度条 DOM 结构
     */
    create: function () {
      // 避免重复创建
      if (document.getElementById('page-progress-bar')) {
        Utils.log('进度条已存在，复用现有元素');
        state.containerElement = document.getElementById('page-progress-bar');
        state.fillElement = state.containerElement.querySelector('.ppb-fill');
        state.glowElement = state.containerElement.querySelector('.ppb-glow');
        return;
      }

      Utils.log('创建新进度条');

      // 创建容器
      const bar = document.createElement('div');
      bar.id = 'page-progress-bar';
      bar.innerHTML = '<div class="ppb-track"><div class="ppb-fill"><div class="ppb-glow"></div></div></div>';

      document.body.appendChild(bar);

      // 缓存元素引用
      state.containerElement = bar;
      state.fillElement = bar.querySelector('.ppb-fill');
      state.glowElement = bar.querySelector('.ppb-glow');
    },

    /**
     * 销毁进度条
     */
    destroy: function () {
      Utils.log('销毁进度条');
      if (state.containerElement && state.containerElement.parentNode) {
        state.containerElement.parentNode.removeChild(state.containerElement);
      }
      state.containerElement = null;
      state.fillElement = null;
      state.glowElement = null;
    }
  };

  // ============================================
  // UI 更新（requestAnimationFrame 优化）
  // ============================================
  const UIUpdater = {
    /**
     * 更新进度条 UI
     */
    update: function () {
      if (!state.fillElement) return;

      const percent = Math.round(state.progress * 100);
      const newWidth = percent + '%';

      // 只有当值真的变化时才更新 DOM
      if (state.fillElement.style.width !== newWidth) {
        Utils.requestTick(function () {
          state.fillElement.style.width = newWidth;
        });
      }
    },

    /**
     * 显示进度条
     */
    show: function () {
      if (!state.containerElement) return;
      state.containerElement.classList.add('is-visible');
      state.containerElement.classList.add('is-loading');
      state.containerElement.classList.remove('is-completed');
    },

    /**
     * 标记完成
     */
    markComplete: function () {
      if (!state.containerElement || !state.fillElement) return;
      state.containerElement.classList.remove('is-loading');
      state.containerElement.classList.add('is-completed');
      state.fillElement.classList.add('ppb-fill--pulse');
    },

    /**
     * 隐藏进度条
     */
    hide: function () {
      if (!state.containerElement || !state.fillElement) return;
      state.containerElement.classList.remove('is-visible');
      state.fillElement.classList.remove('ppb-fill--pulse');
    }
  };

  // ============================================
  // 进度条逻辑
  // ============================================
  const ProgressBar = {
    /**
     * 开始进度条
     */
    start: function () {
      if (state.isLoading) return this;

      Utils.log('开始进度条');

      state.progress = 0.08;
      state.isLoading = true;
      state.isCompleted = false;

      UIUpdater.update();
      UIUpdater.show();
      ProgressBar.startTrickle();

      return this;
    },

    /**
     * 设置进度
     */
    setProgress: function (value) {
      if (state.isCompleted) return this;

      state.progress = Math.min(Math.max(value / 100, 0), CONFIG.TRICKLE_MAX);
      UIUpdater.update();

      return this;
    },

    /**
     * 完成进度条
     */
    complete: function () {
      if (state.isCompleted) return this;

      Utils.log('完成进度条');

      state.progress = 1;
      state.isLoading = false;
      state.isCompleted = true;

      ProgressBar.stopTrickle();
      UIUpdater.update();
      UIUpdater.markComplete();

      if (CONFIG.AUTO_HIDE) {
        setTimeout(function () {
          UIUpdater.hide();
        }, CONFIG.AUTO_HIDE_DELAY);
      }

      return this;
    },

    /**
     * 启动自动进度（trickle）
     */
    startTrickle: function () {
      Utils.log('启动 trickle');

      ProgressBar.stopTrickle(); // 先停止已有的

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

    /**
     * 停止 trickle
     */
    stopTrickle: function () {
      Utils.clearTimer();
    },

    /**
     * 自动启动进度（监听 DOM 加载状态）
     */
    startAutoProgress: function () {
      Utils.log('启动自动进度');

      // 如果页面已加载完成，快速显示并隐藏
      if (document.readyState === 'complete') {
        ProgressBar.start();
        ProgressBar.setProgress(80);
        setTimeout(function () {
          ProgressBar.complete();
        }, 300);
        return this;
      }

      // 否则监听加载状态
      ProgressBar.start();

      function updateOnReadyState() {
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
      }

      updateOnReadyState();
      document.addEventListener('readystatechange', updateOnReadyState, { once: false });

      window.addEventListener('load', function () {
        if (!state.isCompleted) {
          ProgressBar.complete();
        }
      }, { once: true });

      return this;
    }
  };

  // ============================================
  // 公共 API
  // ============================================
  function PageProgressBar(options) {
    // 合并配置
    if (options) {
      if (typeof options.autoHide !== 'undefined') {
        CONFIG.AUTO_HIDE = options.autoHide;
      }
      if (options.autoHideDelay) {
        CONFIG.AUTO_HIDE_DELAY = options.autoHideDelay;
      }
    }

    // 创建 DOM
    DOMManager.create();

    // 返回链式调用接口
    return {
      start: ProgressBar.start,
      setProgress: ProgressBar.setProgress,
      complete: ProgressBar.complete,
      startAutoProgress: ProgressBar.startAutoProgress
    };
  }

  // ============================================
  // 静态方法（便于调试）
  // ============================================
  PageProgressBar.setDebugMode = function (enabled) {
    CONFIG.DEBUG_MODE = enabled;
    Utils.log('调试模式: ' + (enabled ? '开启' : '关闭'));
  };

  PageProgressBar.getState = function () {
    return {
      progress: state.progress,
      isLoading: state.isLoading,
      isCompleted: state.isCompleted
    };
  };

  PageProgressBar.destroy = function () {
    Utils.log('销毁组件');
    Utils.cancelTick();
    Utils.clearTimer();
    DOMManager.destroy();
  };

  // ============================================
  // 暴露到全局
  // ============================================
  window.PageProgressBar = PageProgressBar;

  // ============================================
  // 页面卸载时清理（防止内存泄漏）
  // ============================================
  window.addEventListener('beforeunload', function () {
    if (window.PageProgressBar && window.PageProgressBar.destroy) {
      window.PageProgressBar.destroy();
    }
  });

})();
