/**
 * ============================================
 * iGEM SZPU-2026 - Attributions Page Interactions
 * ============================================
 *
 * @version 1.0
 * @description Attributions 页面专属交互模块
 * 负责团队贡献页面的卡片筛选、时间线交互和滚动导航
 *
 * 关键功能：
 * - 团队成员角色筛选系统
 * - 外部贡献类型筛选系统
 * - 时间线交互式详情面板（双面板横向滑动动画）
 * - 滚动导航高亮（Scroll Spy）
 *
 * 使用方法：
 * - 在 HTML 中引用: <script src="../static/js/attributions.js"></script>
 * - 所有功能会在 DOMContentLoaded 时自动初始化
 * - 可通过 window.AttributionsPage 访问公共 API
 */
(function () {
  'use strict';

  // ============================================
  // 配置常量
  // ============================================
  const CONFIG = {
    fadeInDuration: 400,
    fadeInClass: 'fade-in',
    activeClass: 'active',
    visibleClass: 'visible',
    displayBlock: 'block',
    displayNone: 'none',
    tooltipMargin: 16,
    tooltipMinWidth: 280,
    debounceDelay: 150,
    scrollSpyOffset: 120,
    slideAnimationDuration: 340
  };

  // ============================================
  // 模块状态
  // ============================================
  const state = {
    isInitialized: false,
    timeline: {
      isAnimating: false,
      activePanelKey: 'panel1',
      lastBarIndex: -1,
      panels: null,
      slider: null
    }
  };

  // ============================================
  // 工具函数
  // ============================================
  const Utils = {
    /**
     * 防抖函数
     * @param {Function} fn - 需要防抖的函数
     * @param {Number} delay - 延迟时间（毫秒）
     */
    debounce: function (fn, delay) {
      let timeoutId = null;
      return function () {
        const args = arguments;
        const self = this;
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(function () {
          fn.apply(self, args);
        }, delay);
      };
    },

    /**
     * 为元素添加淡入动画
     * @param {HTMLElement} element - 目标元素
     */
    applyFadeIn: function (element) {
      if (!element) return;
      element.classList.add(CONFIG.fadeInClass);
      setTimeout(function () {
        element.classList.remove(CONFIG.fadeInClass);
      }, CONFIG.fadeInDuration);
    },

    /**
     * 安全获取元素文本内容
     * @param {HTMLElement} element - 目标元素
     * @returns {String} 修剪后的文本
     */
    safeGetText: function (element) {
      return element && element.textContent ? element.textContent.trim() : '';
    }
  };

  // ============================================
  // 模块 1: 卡片筛选系统
  // ============================================
  const CardFilter = {
    /**
     * 初始化卡片筛选系统
     * @param {String} buttonSelector - 筛选按钮选择器
     * @param {String} cardSelector - 卡片选择器
     * @param {String} dataAttr - 用于匹配的数据属性名
     */
    init: function (buttonSelector, cardSelector, dataAttr) {
      const filterButtons = document.querySelectorAll(buttonSelector);
      const cards = document.querySelectorAll(cardSelector);

      if (filterButtons.length === 0) return;

      function applyFilter(value) {
        cards.forEach(function (card) {
          const cardValue = card.getAttribute(dataAttr);
          const shouldShow = value === 'all' || cardValue === value;

          if (shouldShow) {
            card.style.display = CONFIG.displayBlock;
            Utils.applyFadeIn(card);
          } else {
            card.style.display = CONFIG.displayNone;
          }
        });
      }

      filterButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          const filterValue = this.getAttribute(dataAttr);

          filterButtons.forEach(function (b) {
            b.classList.remove(CONFIG.activeClass);
          });
          this.classList.add(CONFIG.activeClass);

          applyFilter(filterValue);
        });
      });
    }
  };

  // ============================================
  // 模块 2: 时间线交互（双面板横向滑动）
  // ============================================
  const TimelineInteraction = {
    /**
     * 初始化时间线交互系统
     */
    init: function () {
      const timelineBars = document.querySelectorAll('.timeline-bar');
      const tooltip = document.getElementById('timeline-tooltip');
      const timelineChart = document.getElementById('timeline-chart');

      if (timelineBars.length === 0 || !tooltip || !timelineChart) return;

      state.timeline.panels = {
        panel1: {
          root: document.getElementById('panel-current'),
          start: document.getElementById('tooltip-start'),
          end: document.getElementById('tooltip-end'),
          duration: document.getElementById('tooltip-duration'),
          worked: document.getElementById('tooltip-worked'),
          description: document.getElementById('tooltip-description')
        },
        panel2: {
          root: document.getElementById('panel-incoming'),
          start: document.getElementById('tooltip-start-2'),
          end: document.getElementById('tooltip-end-2'),
          duration: document.getElementById('tooltip-duration-2'),
          worked: document.getElementById('tooltip-worked-2'),
          description: document.getElementById('tooltip-description-2')
        }
      };

      state.timeline.slider = document.querySelector('.timeline-tooltip-slider');

      const tooltipTitle = document.getElementById('tooltip-title');
      const self = this;

      // 获取 bar 对应的任务标签
      function getTaskLabel(bar) {
        const row = bar.closest('.timeline-row');
        if (row) {
          const labelEl = row.querySelector('.timeline-task-name, .timeline-task-text');
          if (labelEl) return Utils.safeGetText(labelEl);
        }
        return 'Project Activity';
      }

      // 向指定面板写入内容
      function writePanelContent(panel, bar) {
        if (panel.start) panel.start.textContent = bar.getAttribute('data-start') || '\u2014';
        if (panel.end) panel.end.textContent = bar.getAttribute('data-end') || '\u2014';
        if (panel.duration) panel.duration.textContent = bar.getAttribute('data-duration') || '\u2014';
        if (panel.worked) panel.worked.textContent = bar.getAttribute('data-worked') || '\u2014';
        if (panel.description) panel.description.textContent = bar.getAttribute('data-description') || 'No details available.';
      }

      // 获取 bar 在 bars 数组中的索引
      function getBarIndex(bar) {
        const arr = Array.from(timelineBars);
        return arr.indexOf(bar);
      }

      // 清除所有活动状态
      function clearAllActive() {
        timelineBars.forEach(function (b) { b.classList.remove(CONFIG.activeClass); });
        if (tooltip) tooltip.classList.remove(CONFIG.visibleClass);
        if (state.timeline.slider) state.timeline.slider.style.removeProperty('height');
      }

      // 带横向滑动动画的内容切换
      function switchContent(bar) {
        if (state.timeline.isAnimating) return;

        const currentIdx = getBarIndex(bar);
        const direction = (state.timeline.lastBarIndex === -1 || currentIdx > state.timeline.lastBarIndex) ? 'forward' : 'backward';
        state.timeline.lastBarIndex = currentIdx;

        // 更新标题（加淡入淡出）
        if (tooltipTitle) {
          tooltipTitle.style.opacity = '0';
          setTimeout(function () {
            if (tooltipTitle) {
              tooltipTitle.textContent = getTaskLabel(bar);
              tooltipTitle.style.opacity = '1';
            }
          }, 140);
        }

        const currentKey = state.timeline.activePanelKey;
        const incomingKey = (state.timeline.activePanelKey === 'panel1') ? 'panel2' : 'panel1';
        const currentPanel = state.timeline.panels[currentKey];
        const incomingPanel = state.timeline.panels[incomingKey];

        // ==== 核心：先测量新内容高度，再设置容器高度 ====
        writePanelContent(incomingPanel, bar);

        // 临时让 incoming 可见（但透明）以测量其实际高度
        incomingPanel.root.classList.remove('panel-incoming');
        incomingPanel.root.style.visibility = 'visible';
        incomingPanel.root.style.opacity = '0';
        incomingPanel.root.style.transform = direction === 'forward' ? 'translateX(100%)' : 'translateX(-100%)';

        // 强制回流，获取准确高度，然后设置 slider 容器高度
        const newPanelHeight = incomingPanel.root.getBoundingClientRect().height;
        if (state.timeline.slider && newPanelHeight > 0) {
          state.timeline.slider.style.height = newPanelHeight + 'px';
        }

        // 第一次显示：不做滑动动画，直接展示内容
        if (!tooltip.classList.contains(CONFIG.visibleClass)) {
          writePanelContent(currentPanel, bar);
          currentPanel.root.classList.remove('panel-incoming');
          currentPanel.root.classList.add('panel-current');
          currentPanel.root.style.visibility = 'visible';
          currentPanel.root.style.opacity = '1';
          currentPanel.root.style.transform = 'translateX(0)';

          incomingPanel.root.classList.remove('panel-current');
          incomingPanel.root.classList.add('panel-incoming');
          incomingPanel.root.style.visibility = 'hidden';
          incomingPanel.root.style.transform = 'translateX(100%)';

          tooltip.classList.add(CONFIG.visibleClass);

          const firstPanelHeight = currentPanel.root.getBoundingClientRect().height;
          if (state.timeline.slider && firstPanelHeight > 0) {
            state.timeline.slider.style.height = firstPanelHeight + 'px';
          }
          return;
        }

        state.timeline.isAnimating = true;

        // ==== 纯 transition 实现滑动切换 ====
        incomingPanel.root.classList.remove(
          'panel-incoming', 'panel-current',
          'panel-slide-in-right', 'panel-slide-in-left',
          'panel-slide-out-left', 'panel-slide-out-right'
        );
        currentPanel.root.classList.remove(
          'panel-slide-in-right', 'panel-slide-in-left',
          'panel-slide-out-left', 'panel-slide-out-right'
        );

        const incomingStartX = direction === 'forward' ? '100%' : '-100%';
        const outgoingTargetX = direction === 'forward' ? '-100%' : '100%';

        incomingPanel.root.style.transform = 'translateX(' + incomingStartX + ')';
        incomingPanel.root.style.opacity = '0';
        incomingPanel.root.style.visibility = 'visible';

        // 强制回流，确保 transform 起始状态生效
        void incomingPanel.root.offsetWidth;

        currentPanel.root.classList.remove('panel-current');
        currentPanel.root.style.transform = 'translateX(' + outgoingTargetX + ')';
        currentPanel.root.style.opacity = '0';

        incomingPanel.root.style.transform = 'translateX(0)';
        incomingPanel.root.style.opacity = '1';

        // 动画结束后清理
        setTimeout(function () {
          currentPanel.root.style.visibility = 'hidden';
          currentPanel.root.style.transform = 'translateX(100%)';
          currentPanel.root.classList.add('panel-incoming');

          incomingPanel.root.classList.add('panel-current');

          // 清除内联样式（让 CSS 类接管）
          currentPanel.root.style.removeProperty('transform');
          currentPanel.root.style.removeProperty('opacity');
          currentPanel.root.style.removeProperty('visibility');
          incomingPanel.root.style.removeProperty('transform');
          incomingPanel.root.style.removeProperty('opacity');
          incomingPanel.root.style.removeProperty('visibility');

          state.timeline.activePanelKey = incomingKey;
          state.timeline.isAnimating = false;
        }, CONFIG.slideAnimationDuration);
      }

      // 给每个 timeline bar 绑定点击事件
      timelineBars.forEach(function (bar) {
        bar.addEventListener('click', function (e) {
          e.stopPropagation();

          if (this.classList.contains(CONFIG.activeClass)) {
            clearAllActive();
            state.timeline.lastBarIndex = -1;
            return;
          }

          timelineBars.forEach(function (b) { b.classList.remove(CONFIG.activeClass); });
          this.classList.add(CONFIG.activeClass);

          switchContent(this);
        });
      });

      // 点击外部区域关闭
      document.addEventListener('click', function () {
        clearAllActive();
        state.timeline.lastBarIndex = -1;
      });
    }
  };

  // ============================================
  // 模块 3: 滚动导航高亮 (Scroll Spy)
  // ============================================
  const ScrollSpy = {
    /**
     * 初始化滚动导航高亮
     */
    init: function () {
      const navLinks = document.querySelectorAll('.jump-to-btn');
      if (navLinks.length === 0) return;

      const sectionMap = {
        'team-contributions': { element: null, links: [] },
        'external-contributions': { element: null, links: [] },
        'timeline': { element: null, links: [] }
      };

      Object.keys(sectionMap).forEach(function (id) {
        sectionMap[id].element = document.getElementById(id);
      });

      navLinks.forEach(function (link) {
        const href = link.getAttribute('href') || '';
        Object.keys(sectionMap).forEach(function (id) {
          if (href.indexOf(id) !== -1) {
            sectionMap[id].links.push(link);
          }
        });
      });

      function setActiveNav(activeId) {
        navLinks.forEach(function (link) {
          link.classList.remove(CONFIG.activeClass);
        });
        if (sectionMap[activeId]) {
          sectionMap[activeId].links.forEach(function (link) {
            link.classList.add(CONFIG.activeClass);
          });
        }
      }

      function updateActiveSection() {
        const scrollY = window.scrollY + CONFIG.scrollSpyOffset;
        let currentActive = null;

        Object.keys(sectionMap).forEach(function (id) {
          const section = sectionMap[id].element;
          if (section) {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionBottom) {
              currentActive = id;
            }
          }
        });

        if (currentActive) {
          setActiveNav(currentActive);
        }
      }

      const handleScroll = Utils.debounce(updateActiveSection, CONFIG.debounceDelay);
      window.addEventListener('scroll', handleScroll, { passive: true });
      updateActiveSection();
    }
  };

  // ============================================
  // 公开 API
  // ============================================
  window.AttributionsPage = {
    /**
     * 初始化所有交互模块
     */
    init: function () {
      if (state.isInitialized) return;

      CardFilter.init('.role-tab', '#members-grid .member-card', 'data-role');
      CardFilter.init('.type-filter-btn', '#external-grid .external-card', 'data-type');
      TimelineInteraction.init();
      ScrollSpy.init();

      state.isInitialized = true;
      console.log('[Attributions] 页面交互已初始化');
    },

    /**
     * 获取当前状态（用于调试）
     */
    getState: function () {
      return {
        isInitialized: state.isInitialized,
        timelineActivePanel: state.timeline.activePanelKey,
        config: Object.assign({}, CONFIG)
      };
    },

    /**
     * 手动触发卡片筛选
     * @param {String} selector - 按钮选择器
     * @param {String} filterValue - 筛选值
     */
    filterCards: function (selector, filterValue) {
      const btn = document.querySelector(selector + '[data-role="' + filterValue + '"]') ||
                  document.querySelector(selector + '[data-type="' + filterValue + '"]');
      if (btn) btn.click();
    }
  };

  // ============================================
  // 自动初始化
  // ============================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      window.AttributionsPage.init();
    });
  } else {
    window.AttributionsPage.init();
  }
})();
