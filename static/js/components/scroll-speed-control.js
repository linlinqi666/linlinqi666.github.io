/**
 * ============================================
 * iGEM SZPU-2026 - Scroll Speed Control（2026-10-15 用户提案）
 * ============================================
 *
 * @description 右侧竖条阅读进度条上下两端的「快速滚动」隐形触区（2026-10-15 用户提案，同日按用户口径简化：去掉可见小三角）。
 *
 * 交互设计（用户口径）：
 *  1. 视觉：**无任何可见图形**——只有隐形触区贴在进度条上下两端，不抢视线。
 *  2. 判定区：每端约 100×100px 的**隐形**触区，右贴视口、不压正文；
 *     窄屏自动收窄，<900px 直接不启用（手机用原生惯性滚动即可）。
 *  3. 无任何可见图形与提示文字（用户 2026-10-15 二次简化：连提示也去掉，纯隐形触区）。
 *  4. 点击/按住即滚动，按住为有加速度的快滚：**加速慢、减速快**——
 *     加速时间常数 0.85s（慢慢提速，起步不突兀），减速时间常数 0.10s（松手立刻收住）。
 *  5. 松手/指针取消/失焦/切换标签页/滚轮或触摸介入 → 立即进入减速停机。
 *
 * 性能与规范：
 *  - 只在按住期间跑 requestAnimationFrame，速度归零即停机（README 约束 16）。
 *  - 滚动全部走 Utils.detectScrollContainer() 探测到的容器，与站点滚动体系一致。
 *  - 尊重 prefers-reduced-motion：上限速度减半，交互本身保留（属用户主动触发）。
 *  - 文案一律英文（README 24-b）。
 */
(function () {
  'use strict';

  if (!window.iGEMUtils) {
    console.error('[ScrollSpeed] 缺少依赖：请先加载 static/js/utils.js');
    return;
  }

  const Utils = window.iGEMUtils;

  /**
   * 模块配置。
   * @type {{ MAX_SPEED: number, ACCEL_TAU: number, DECEL_TAU: number, STOP_EPSILON: number,
   *         STALL_MS: number, DEBUG_MODE: boolean }}
   */
  const CONFIG = {
    /** 快滚最高速度（px/s） */
    MAX_SPEED: 3000,
    /** 加速时间常数（秒）——越大越"慢热" */
    ACCEL_TAU: 0.85,
    /** 减速时间常数（秒）——越小收得越利落 */
    DECEL_TAU: 0.1,
    /** 速度低于该值（px/s）直接归零停机 */
    STOP_EPSILON: 14,
    /** 连续滚不动超过该时长（ms）视为已到边界，自动停机 */
    STALL_MS: 260,
    DEBUG_MODE: false
  };

  /**
   * 模块状态。
   * @type {Object}
   */
  const state = {
    root: null,
    upButton: null,
    downButton: null,
    scrollInfo: null,
    isInitialized: false,
    direction: 0,
    velocity: 0,
    holding: false,
    rafId: null,
    lastTs: 0,
    lastScrollTop: -1,
    stalledSince: 0,
    activeButton: null,
    handlers: [],
    /** 站点全局 html{scroll-behavior:smooth} 会拖慢连续 scrollBy，按住期间临时改为 auto */
    savedScrollBehavior: null,
    /** 进度条所在高度带右侧的可用留白（px），触区宽度上限 */
    gutter: 0
  };

  /**
   * 量出进度条所在高度带右侧的可用留白，写成 CSS 变量 --ssc-gutter。
   * 目的：判定区再大也不许压住正文——正文右边界到视口右缘有多少空间，就只给多少；
   * 留白过窄时挂 .is-tight 整套不启用。只在 init / resize / 滚动停下后调用（不进滚动热路径）。
   */
  function updateGutter() {
    if (!state.root) return;

    const bandTop = window.innerHeight * 0.2;
    const bandBottom = window.innerHeight * 0.8;
    const SELECTOR = '.content-card, .description-content, .content-area, article, .main-container > *';
    let maxRight = 0;

    const collect = function (nodes) {
      for (let i = 0; i < nodes.length; i++) {
        const rect = nodes[i].getBoundingClientRect();
        if (rect.width < 240) continue;                                  // 小卡片/图标不算正文列
        if (rect.bottom < bandTop || rect.top > bandBottom) continue;    // 只看与进度条同高的区域
        if (rect.right > maxRight) maxRight = rect.right;
      }
    };

    collect(document.querySelectorAll(SELECTOR));
    if (!maxRight) {
      collect(document.querySelectorAll('p'));                           // 兜底：按段落右边界
    }

    state.gutter = Math.round(Math.max(0, window.innerWidth - maxRight));
    state.root.style.setProperty('--ssc-gutter', state.gutter + 'px');
    state.root.classList.toggle('is-tight', state.gutter < 44);
    log('右侧留白已测量', state.gutter);
  }

  /**
   * 按住期间把根滚动器的 scroll-behavior 临时切到 auto。
   * 否则每帧的 scrollBy 都会被浏览器当成新的平滑动画（帧帧重启，几乎滚不动）。
   * 松手减速结束后自动还原，不影响页面其它平滑滚动。
   * @param {boolean} on
   */
  function setInstantScrollMode(on) {
    const root = document.documentElement;
    if (!root) return;

    if (on) {
      if (state.savedScrollBehavior === null) {
        state.savedScrollBehavior = root.style.scrollBehavior || '';
        root.style.scrollBehavior = 'auto';
      }
      return;
    }

    if (state.savedScrollBehavior !== null) {
      root.style.scrollBehavior = state.savedScrollBehavior;
      state.savedScrollBehavior = null;
    }
  }

  /**
   * 调试日志。
   * @param {string} message
   * @param {*} [data]
   */
  function log(message, data) {
    if (CONFIG.DEBUG_MODE) {
      console.log('[ScrollSpeed]', message, data !== undefined ? data : '');
    }
  }

  /**
   * 读取当前滚动位置。
   * @returns {number}
   */
  function getScrollTop() {
    const info = state.scrollInfo;
    if (!info) return 0;
    return Math.max(0, Utils.getScrollPosition(info.element, info.isWindow));
  }

  /**
   * 相对当前位置滚动若干像素（自动适配 window / 内部滚动容器）。
   * 一律要求即时位移（behavior: instant），避免全局 smooth 把逐帧滚动吃掉。
   * @param {number} delta 正数向下、负数向上
   */
  function scrollByPixels(delta) {
    const info = state.scrollInfo;
    if (!info || !delta) return;

    if (info.isWindow) {
      const before = window.scrollY || window.pageYOffset || 0;
      try {
        window.scrollBy({ top: delta, left: 0, behavior: 'instant' });
      } catch (err) {
        window.scrollBy(0, delta);
      }
      if (before === (window.scrollY || window.pageYOffset || 0)) {
        // 极端浏览器差异兜底（scrollBy 选项不被支持时）
        window.scrollTo(0, before + delta);
      }
      return;
    }

    const el = info.element;
    try {
      el.scrollBy({ top: delta, left: 0, behavior: 'instant' });
    } catch (err) {
      if (typeof el.scrollBy === 'function') {
        el.scrollBy(0, delta);
      } else {
        el.scrollTop += delta;
      }
    }
  }

  /**
   * 取消进行中的动画帧。
   */
  function cancelFrame() {
    if (state.rafId !== null) {
      Utils.safeCancelAnimationFrame
        ? Utils.safeCancelAnimationFrame(state.rafId)
        : window.cancelAnimationFrame(state.rafId);
      state.rafId = null;
    }
  }

  /**
   * 请求下一帧。
   */
  function scheduleFrame() {
    if (state.rafId !== null) return;
    const raf = Utils.safeRequestAnimationFrame || window.requestAnimationFrame;
    state.rafId = raf(function (ts) {
      state.rafId = null;
      frame(ts);
    });
  }

  /**
   * 主循环：加速 → 滚动 → 减速 → 停机。
   * @param {number} ts 帧时间戳
   */
  function frame(ts) {
    if (!state.lastTs) state.lastTs = ts;
    const dt = Math.min(0.05, Math.max(0.001, (ts - state.lastTs) / 1000));
    state.lastTs = ts;

    if (state.holding) {
      // 指数逼近上限：起步温和，越按越快（慢加速）
      state.velocity += (CONFIG.MAX_SPEED - state.velocity) * (1 - Math.exp(-dt / CONFIG.ACCEL_TAU));
    } else {
      // 指数衰减：松手立刻收住（快减速）
      state.velocity *= Math.exp(-dt / CONFIG.DECEL_TAU);
      if (state.velocity < CONFIG.STOP_EPSILON) {
        state.velocity = 0;
      }
    }

    if (state.velocity > 0) {
      const before = getScrollTop();
      scrollByPixels(state.direction * state.velocity * dt);
      const after = getScrollTop();

      if (Math.abs(after - before) < 0.5) {
        // 边界：连续滚不动则停机，避免空转 rAF
        if (!state.stalledSince) state.stalledSince = ts;
        if (ts - state.stalledSince > CONFIG.STALL_MS) {
          log('已到滚动边界，停机');
          stopAll();
          return;
        }
      } else {
        state.stalledSince = 0;
      }
    }

    if (state.holding || state.velocity > 0) {
      scheduleFrame();
    } else {
      resetMotion();
    }
  }

  /**
   * 复位运动状态（保留 holding 标志由调用方决定）。
   */
  function resetMotion() {
    cancelFrame();
    state.velocity = 0;
    state.lastTs = 0;
    state.stalledSince = 0;
    // 完全停下才还原页面的平滑滚动设置
    setInstantScrollMode(false);
  }

  /**
   * 彻底停止并清理按压态。
   */
  function stopAll() {
    state.holding = false;
    state.direction = 0;
    resetMotion();
    if (state.activeButton) {
      state.activeButton.classList.remove('is-holding');
      state.activeButton = null;
    }
  }

  /**
   * 开始按住（或在已有速度上改变方向）。
   * @param {number} direction -1 向上 / 1 向下
   * @param {HTMLElement} button 触发的按钮
   */
  function startHold(direction, button) {
    if (state.holding && state.direction === direction && state.activeButton === button) return;

    if (state.activeButton && state.activeButton !== button) {
      state.activeButton.classList.remove('is-holding');
    }

    state.holding = true;
    state.direction = direction;
    state.activeButton = button;
    state.stalledSince = 0;
    if (button) button.classList.add('is-holding');
    setInstantScrollMode(true);

    if (state.velocity === 0) {
      // 起步给一点点初速，避免"按了没反应"
      state.velocity = CONFIG.STOP_EPSILON;
    }
    state.lastTs = 0;
    scheduleFrame();
    log('开始快滚', { direction: direction });
  }

  /**
   * 松手：进入快减速（不清方向，让惯性把剩余速度走完）。
   */
  function releaseHold() {
    if (!state.holding) return;
    state.holding = false;
    if (state.activeButton) {
      state.activeButton.classList.remove('is-holding');
      state.activeButton = null;
    }
    scheduleFrame();
    log('松手，进入减速');
  }

  /**
   * 按方向解析按钮。
   * @param {HTMLElement} el
   * @returns {{direction: number, button: HTMLElement}|null}
   */
  function resolveButton(el) {
    if (!el) return null;
    if (el === state.upButton) return { direction: -1, button: state.upButton };
    if (el === state.downButton) return { direction: 1, button: state.downButton };
    return null;
  }

  /**
   * 创建 DOM 结构：两个纯隐形大触区（无任何可见图形与提示文字）。
   */
  function buildDom() {
    const root = document.createElement('div');
    root.className = 'scroll-speed-control';
    root.setAttribute('data-scroll-speed', '');

    const makeButton = function (modifier, label) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ssc-target ssc-target--' + modifier;
      btn.setAttribute('aria-label', label);

      root.appendChild(btn);
      return btn;
    };

    state.upButton = makeButton('up', 'Scroll to top');
    state.downButton = makeButton('down', 'Scroll to bottom');
    document.body.appendChild(root);
    state.root = root;
  }

  /**
   * 绑定事件（全部登记在 state.handlers 里，destroy 时统一摘除）。
   * @param {EventTarget} target
   * @param {string} type
   * @param {Function} handler
   * @param {Object|boolean} [options]
   */
  function bind(target, type, handler, options) {
    target.addEventListener(type, handler, options);
    state.handlers.push({ target: target, type: type, handler: handler, options: options });
  }

  /**
   * 绑定按钮交互。
   * @param {HTMLElement} btn
   */
  function bindButton(btn) {
    bind(btn, 'pointerdown', function (e) {
      const resolved = resolveButton(btn);
      if (!resolved) return;
      e.preventDefault();
      if (btn.setPointerCapture && e.pointerId !== undefined) {
        try { btn.setPointerCapture(e.pointerId); } catch (err) { /* 忽略 */ }
      }
      startHold(resolved.direction, resolved.button);
    });

    ['pointerup', 'pointercancel', 'lostpointercapture', 'pointerleave'].forEach(function (type) {
      bind(btn, type, function () { releaseHold(); });
    });

    bind(btn, 'keydown', function (e) {
      if (e.key !== ' ' && e.key !== 'Enter' && e.key !== 'Spacebar') return;
      e.preventDefault();          // 阻止 Space 触发页面滚动与按钮默认 click
      if (e.repeat) return;
      const resolved = resolveButton(btn);
      if (resolved) startHold(resolved.direction, resolved.button);
    });

    bind(btn, 'keyup', function (e) {
      if (e.key !== ' ' && e.key !== 'Enter' && e.key !== 'Spacebar') return;
      releaseHold();
    });

    bind(btn, 'blur', function () { releaseHold(); });
    bind(btn, 'click', function (e) { e.preventDefault(); });  // 行为全在按住/松开上
  }

  /**
   * 全局中断源：用户自己滚、切标签页、按 Esc、窗口失焦。
   */
  function bindInterrupts() {
    ['wheel', 'touchmove'].forEach(function (type) {
      bind(window, type, function () { stopAll(); }, Utils.supportsPassiveEvents() ? { passive: true } : false);
    });
    bind(window, 'blur', function () { stopAll(); });
    bind(document, 'visibilitychange', function () {
      if (document.hidden) stopAll();
    });
    bind(window, 'keydown', function (e) {
      if (e.key === 'Escape') stopAll();
    });
    bind(window, 'resize', function () { stopAll(); }, Utils.supportsPassiveEvents() ? { passive: true } : false);
  }

  /**
   * 初始化。
   */
  function init() {
    if (state.isInitialized) return;

    // 没有右侧进度条就不挂这套控件（与进度条组件同一前提）
    if (!document.getElementById('scroll-progress-bar')) {
      log('未找到 #scroll-progress-bar，跳过初始化');
      return;
    }

    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      CONFIG.MAX_SPEED = Math.round(CONFIG.MAX_SPEED / 2);
      CONFIG.ACCEL_TAU = 1.1;
    }

    state.scrollInfo = Utils.detectScrollContainer();
    state.isInitialized = true;

    buildDom();
    bindButton(state.upButton);
    bindButton(state.downButton);
    bindInterrupts();
    bind(window, 'beforeunload', destroy);

    // 触区宽度跟着「正文右边界到视口右缘」的留白走：滚动停下、窗口尺寸变化后重测
    const remeasure = Utils.debounce ? Utils.debounce(updateGutter, 180) : updateGutter;
    const passiveOption = Utils.supportsPassiveEvents() ? { passive: true } : false;
    if (state.scrollInfo && state.scrollInfo.element) {
      bind(state.scrollInfo.element, 'scroll', remeasure, passiveOption);
    }
    bind(window, 'resize', remeasure, passiveOption);
    bind(window, 'load', updateGutter, passiveOption);
    updateGutter();

    log('初始化完成');
  }

  /**
   * 清理。
   */
  function destroy() {
    stopAll();
    state.handlers.forEach(function (item) {
      item.target.removeEventListener(item.type, item.handler, item.options);
    });
    state.handlers = [];
    if (state.root && state.root.parentNode) {
      state.root.parentNode.removeChild(state.root);
    }
    state.root = null;
    state.upButton = null;
    state.downButton = null;
    state.isInitialized = false;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 暴露公共 API（调试与外部停止用）
  window.ScrollSpeedControl = {
    stop: stopAll,
    destroy: destroy,
    setDebugMode: function (enabled) {
      CONFIG.DEBUG_MODE = !!enabled;
    },
    getState: function () {
      return {
        isInitialized: state.isInitialized,
        holding: state.holding,
        direction: state.direction,
        velocity: Math.round(state.velocity),
        maxSpeed: CONFIG.MAX_SPEED
      };
    }
  };
})();
