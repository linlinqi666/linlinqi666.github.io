/**
 * iGEM SZPU-2026 - Attributions Page Interactions
 *
 * 负责团队贡献页面的卡片筛选、时间线交互和滚动导航。
 */
(function () {
  'use strict';

  /** @type {Window & { iGEMUtils?: object }} */
  const win = window;
  const raf = win.iGEMUtils && win.iGEMUtils.safeRequestAnimationFrame
    ? win.iGEMUtils.safeRequestAnimationFrame
    : function (callback) { return setTimeout(callback, 16); };

  const CONFIG = {
    fadeInDuration: 400,
    fadeInClass: 'fade-in',
    activeClass: 'active',
    visibleClass: 'visible',
    displayBlock: 'block',
    displayNone: 'none',
    tooltipMargin: 16,
    tooltipMinWidth: 280,
    scrollSpyOffset: 120,
    slideAnimationDuration: 340
  };

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

  const PageUtils = {
    /**
     * 为元素添加淡入动画。
     * @param {HTMLElement} element
     */
    applyFadeIn: function (element) {
      if (!element) return;
      element.classList.add(CONFIG.fadeInClass);
      setTimeout(function () {
        element.classList.remove(CONFIG.fadeInClass);
      }, CONFIG.fadeInDuration);
    },

    /**
     * 安全获取元素文本内容。
     * @param {HTMLElement} element
     * @returns {string}
     */
    safeGetText: function (element) {
      return element && element.textContent ? element.textContent.trim() : '';
    }
  };

  /**
   * 卡片筛选系统。
   */
  const CardFilter = {
    /**
     * 初始化卡片筛选系统。
     * @param {string} buttonSelector - 筛选按钮选择器
     * @param {string} cardSelector - 卡片选择器
     * @param {string} dataAttr - 用于匹配的数据属性名
     */
    init: function (buttonSelector, cardSelector, dataAttr) {
      const filterButtons = Array.from(document.querySelectorAll(buttonSelector));
      const cards = Array.from(document.querySelectorAll(cardSelector));

      if (filterButtons.length === 0 || cards.length === 0) return;

      function setActiveButton(activeBtn) {
        filterButtons.forEach(function (btn) {
          btn.classList.toggle(CONFIG.activeClass, btn === activeBtn);
        });
      }

      function applyFilter(value) {
        cards.forEach(function (card) {
          const cardValue = card.getAttribute(dataAttr);
          const shouldShow = value === 'all' || cardValue === value;

          if (shouldShow) {
            card.style.display = CONFIG.displayBlock;
            PageUtils.applyFadeIn(card);
          } else {
            card.style.display = CONFIG.displayNone;
          }
        });
      }

      filterButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          const filterValue = this.getAttribute(dataAttr);
          setActiveButton(this);
          applyFilter(filterValue);
        });
      });
    }
  };

  /**
   * 获取时间线 bar 对应的任务标签。
   * @param {HTMLElement} bar
   * @returns {string}
   */
  function getTaskLabel(bar) {
    const row = bar.closest('.timeline-row');
    if (row) {
      const labelEl = row.querySelector('.timeline-task-name, .timeline-task-text');
      if (labelEl) return PageUtils.safeGetText(labelEl);
    }
    return 'Project Activity';
  }

  /**
   * 向指定面板写入 bar 的数据内容。
   * @param {object} panel
   * @param {HTMLElement} bar
   */
  function writePanelContent(panel, bar) {
    if (panel.start) panel.start.textContent = bar.getAttribute('data-start') || '\u2014';
    if (panel.end) panel.end.textContent = bar.getAttribute('data-end') || '\u2014';
    if (panel.duration) panel.duration.textContent = bar.getAttribute('data-duration') || '\u2014';
    if (panel.worked) panel.worked.textContent = bar.getAttribute('data-worked') || '\u2014';
    if (panel.description) {
      panel.description.textContent = bar.getAttribute('data-description') || 'No details available.';
    }
  }

  /**
   * 获取 bar 在集合中的索引。
   * @param {HTMLElement} bar
   * @param {NodeList} timelineBars
   * @returns {number}
   */
  function getBarIndex(bar, timelineBars) {
    return Array.from(timelineBars).indexOf(bar);
  }

  /**
   * 清除所有时间线活动状态。
   * @param {NodeList} timelineBars
   * @param {HTMLElement} tooltip
   * @param {HTMLElement} slider
   */
  function clearAllActive(timelineBars, tooltip, slider) {
    timelineBars.forEach(function (b) { b.classList.remove(CONFIG.activeClass); });
    if (tooltip) tooltip.classList.remove(CONFIG.visibleClass);
    if (slider) slider.style.removeProperty('height');
  }

  /**
   * 测量并设置 slider 高度。
   * @param {HTMLElement} panelRoot
   * @param {HTMLElement} slider
   */
  function setSliderHeight(panelRoot, slider) {
    if (!slider || !panelRoot) return;
    const height = panelRoot.getBoundingClientRect().height;
    if (height > 0) slider.style.height = height + 'px';
  }

  /**
   * 首次展开时间线详情面板（无滑动动画）。
   * @param {object} currentPanel
   * @param {object} incomingPanel
   * @param {HTMLElement} bar
   * @param {HTMLElement} tooltip
   * @param {HTMLElement} slider
   */
  function firstPanelReveal(currentPanel, incomingPanel, bar, tooltip, slider) {
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
    setSliderHeight(currentPanel.root, slider);
  }

  /**
   * 执行双面板横向滑动切换动画。
   * @param {object} currentPanel
   * @param {object} incomingPanel
   * @param {'forward'|'backward'} direction
   * @param {HTMLElement} slider
   */
  function animatePanelSwitch(currentPanel, incomingPanel, direction, slider) {
    state.timeline.isAnimating = true;

    currentPanel.root.classList.remove(
      'panel-slide-in-right', 'panel-slide-in-left',
      'panel-slide-out-left', 'panel-slide-out-right'
    );
    incomingPanel.root.classList.remove(
      'panel-incoming', 'panel-current',
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

    setTimeout(function () {
      currentPanel.root.style.visibility = 'hidden';
      currentPanel.root.style.transform = 'translateX(100%)';
      currentPanel.root.classList.add('panel-incoming');

      incomingPanel.root.classList.add('panel-current');

      currentPanel.root.style.removeProperty('transform');
      currentPanel.root.style.removeProperty('opacity');
      currentPanel.root.style.removeProperty('visibility');
      incomingPanel.root.style.removeProperty('transform');
      incomingPanel.root.style.removeProperty('opacity');
      incomingPanel.root.style.removeProperty('visibility');

      state.timeline.activePanelKey = (state.timeline.activePanelKey === 'panel1') ? 'panel2' : 'panel1';
      state.timeline.isAnimating = false;
    }, CONFIG.slideAnimationDuration);
  }

  /**
   * 切换时间线详情面板内容。
   * @param {HTMLElement} bar
   * @param {NodeList} timelineBars
   * @param {HTMLElement} tooltip
   * @param {HTMLElement} tooltipTitle
   * @param {object} panels
   * @param {HTMLElement} slider
   */
  function switchContent(bar, timelineBars, tooltip, tooltipTitle, panels, slider) {
    if (state.timeline.isAnimating) return;

    const currentIdx = getBarIndex(bar, timelineBars);
    const direction = (state.timeline.lastBarIndex === -1 || currentIdx > state.timeline.lastBarIndex)
      ? 'forward'
      : 'backward';
    state.timeline.lastBarIndex = currentIdx;

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
    const incomingKey = (currentKey === 'panel1') ? 'panel2' : 'panel1';
    const currentPanel = panels[currentKey];
    const incomingPanel = panels[incomingKey];

    writePanelContent(incomingPanel, bar);

    // 临时让 incoming 可见（但透明）以测量其实际高度
    incomingPanel.root.classList.remove('panel-incoming');
    incomingPanel.root.style.visibility = 'visible';
    incomingPanel.root.style.opacity = '0';
    incomingPanel.root.style.transform = direction === 'forward' ? 'translateX(100%)' : 'translateX(-100%)';

    setSliderHeight(incomingPanel.root, slider);

    if (!tooltip.classList.contains(CONFIG.visibleClass)) {
      firstPanelReveal(currentPanel, incomingPanel, bar, tooltip, slider);
      return;
    }

    animatePanelSwitch(currentPanel, incomingPanel, direction, slider);
  }

  /**
   * 时间线交互（双面板横向滑动）。
   */
  const TimelineInteraction = {
    /**
     * 初始化时间线交互系统。
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
      const panels = state.timeline.panels;
      const slider = state.timeline.slider;

      timelineBars.forEach(function (bar) {
        bar.addEventListener('click', function (e) {
          e.stopPropagation();

          if (this.classList.contains(CONFIG.activeClass)) {
            clearAllActive(timelineBars, tooltip, slider);
            state.timeline.lastBarIndex = -1;
            return;
          }

          timelineBars.forEach(function (b) { b.classList.remove(CONFIG.activeClass); });
          this.classList.add(CONFIG.activeClass);

          switchContent(this, timelineBars, tooltip, tooltipTitle, panels, slider);
        });
      });

      document.addEventListener('click', function () {
        clearAllActive(timelineBars, tooltip, slider);
        state.timeline.lastBarIndex = -1;
      });
    }
  };

  /**
   * Task Tag Tooltip（Hover 详情提示）。
   */
  const TaskTagTooltip = {
    tooltipEl: null,
    hideDelay: 120,
    showDelay: 80,
    hideTimer: null,
    showTimer: null,
    observer: null,

    /**
     * 初始化 task-tag tooltip 系统。
     */
    init: function () {
      const self = this;

      const tip = document.createElement('div');
      tip.className = 'task-tooltip';
      tip.setAttribute('role', 'tooltip');
      tip.setAttribute('id', 'task-tag-tooltip');
      tip.setAttribute('aria-hidden', 'true');
      document.body.appendChild(tip);
      self.tooltipEl = tip;

      function prepareTags() {
        const tags = document.querySelectorAll('.task-tag[data-detail]');
        tags.forEach(function (tag) {
          const detail = tag.getAttribute('data-detail');
          if (!detail || detail.trim() === '') return;
          if (!tag.hasAttribute('tabindex')) {
            tag.setAttribute('tabindex', '0');
          }
          tag.setAttribute('aria-describedby', 'task-tag-tooltip');
        });
      }

      prepareTags();

      if (typeof MutationObserver !== 'undefined') {
        self.observer = new MutationObserver(prepareTags);
        self.observer.observe(document.body, { childList: true, subtree: true });
      }

      document.addEventListener('mouseover', function (e) {
        const tag = e.target.closest('.task-tag');
        if (!tag) return;
        const detail = tag.getAttribute('data-detail');
        if (!detail || detail.trim() === '') return;

        if (self.hideTimer) { clearTimeout(self.hideTimer); self.hideTimer = null; }
        if (self.showTimer) { clearTimeout(self.showTimer); }

        self.showTimer = setTimeout(function () {
          self.show(tag, detail.trim());
        }, self.showDelay);
      });

      document.addEventListener('mouseout', function (e) {
        const tag = e.target.closest('.task-tag');
        if (!tag) return;
        if (self.showTimer) { clearTimeout(self.showTimer); self.showTimer = null; }
        self.hideTimer = setTimeout(function () { self.hide(); }, self.hideDelay);
      });

      document.addEventListener('focusin', function (e) {
        const tag = e.target.closest('.task-tag');
        if (!tag) return;
        const detail = tag.getAttribute('data-detail');
        if (!detail || detail.trim() === '') return;

        if (self.showTimer) { clearTimeout(self.showTimer); }
        if (self.hideTimer) { clearTimeout(self.hideTimer); self.hideTimer = null; }
        self.show(tag, detail.trim());
      });

      document.addEventListener('focusout', function (e) {
        const tag = e.target.closest('.task-tag');
        if (!tag) return;
        if (self.showTimer) { clearTimeout(self.showTimer); self.showTimer = null; }
        self.hide();
      });

      tip.addEventListener('mouseenter', function () {
        if (self.hideTimer) { clearTimeout(self.hideTimer); self.hideTimer = null; }
      });
      tip.addEventListener('mouseleave', function () {
        self.hideTimer = setTimeout(function () { self.hide(); }, self.hideDelay);
      });

      window.addEventListener('scroll', function () {
        if (tip.classList.contains('is-visible')) {
          self.hide(true);
        }
      }, { passive: true });

      window.addEventListener('resize', function () { self.hide(true); });
    },

    /**
     * 显示 tooltip，根据视口空间智能决定上下位置。
     * @param {HTMLElement} anchor
     * @param {string} text
     */
    show: function (anchor, text) {
      const tip = this.tooltipEl;
      if (!tip) return;

      tip.textContent = text;
      tip.style.left = '-9999px';
      tip.style.top = '-9999px';
      tip.setAttribute('data-placement', '');
      tip.setAttribute('data-edge', '');

      const tipRect = tip.getBoundingClientRect();
      const anchorRect = anchor.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const gap = 8;
      const margin = 10;

      const spaceAbove = anchorRect.top;
      const spaceBelow = vh - anchorRect.bottom;
      const placement = (spaceAbove >= tipRect.height + gap + margin) ? 'top' : 'bottom';

      let left = anchorRect.left + anchorRect.width / 2 - tipRect.width / 2;
      left = Math.max(margin, Math.min(left, vw - tipRect.width - margin));

      let top;
      if (placement === 'top') {
        top = anchorRect.top - tipRect.height - gap;
      } else {
        top = anchorRect.bottom + gap;
      }

      tip.setAttribute('data-placement', placement);

      const arrowCenter = anchorRect.left + anchorRect.width / 2;
      if (arrowCenter - left < 18) {
        tip.setAttribute('data-edge', 'left');
      } else if ((left + tipRect.width) - arrowCenter < 18) {
        tip.setAttribute('data-edge', 'right');
      }

      tip.style.left = Math.round(left) + 'px';
      tip.style.top = Math.round(top) + 'px';
      tip.setAttribute('aria-hidden', 'false');

      raf(function () {
        tip.classList.add('is-visible');
      });
    },

    /**
     * 隐藏 tooltip。
     * @param {boolean} immediate
     */
    hide: function (immediate) {
      const tip = this.tooltipEl;
      if (!tip) return;
      tip.setAttribute('aria-hidden', 'true');
      if (immediate) {
        tip.style.transition = 'none';
        tip.classList.remove('is-visible');
        raf(function () {
          tip.style.transition = '';
        });
      } else {
        tip.classList.remove('is-visible');
      }
    }
  };

  /**
   * 滚动导航高亮 (Scroll Spy)。
   */
  const ScrollSpy = {
    /**
     * 初始化滚动导航高亮。
     */
    init: function () {
      const navLinks = document.querySelectorAll('.jump-to-btn');
      if (navLinks.length === 0) return;

      const sectionIds = ['team-contributions', 'external-contributions', 'timeline'];
      /** @type {Array<{id: string, element: HTMLElement, top: number, bottom: number, links: HTMLElement[]}>} */
      const sections = [];

      const rafThrottle = win.iGEMUtils && typeof win.iGEMUtils.rafThrottle === 'function'
        ? win.iGEMUtils.rafThrottle
        : localRafThrottle;

      function buildSections() {
        sections.length = 0;
        sectionIds.forEach(function (id) {
          const element = document.getElementById(id);
          if (!element) return;
          sections.push({ id: id, element: element, top: 0, bottom: 0, links: [] });
        });

        navLinks.forEach(function (link) {
          const href = link.getAttribute('href') || '';
          sections.forEach(function (section) {
            if (href.indexOf(section.id) !== -1) {
              section.links.push(link);
            }
          });
        });
        updateOffsets();
      }

      function updateOffsets() {
        sections.forEach(function (section) {
          section.top = section.element.offsetTop;
          section.bottom = section.top + section.element.offsetHeight;
        });
      }

      function setActiveNav(activeId) {
        navLinks.forEach(function (link) {
          link.classList.remove(CONFIG.activeClass);
        });
        for (let i = 0; i < sections.length; i++) {
          if (sections[i].id === activeId) {
            sections[i].links.forEach(function (link) {
              link.classList.add(CONFIG.activeClass);
            });
            break;
          }
        }
      }

      function updateActiveSection() {
        const scrollY = window.scrollY + CONFIG.scrollSpyOffset;
        let currentActive = null;

        sections.forEach(function (section) {
          if (scrollY >= section.top && scrollY < section.bottom) {
            currentActive = section.id;
          }
        });

        if (currentActive) {
          setActiveNav(currentActive);
        }
      }

      const handleScroll = rafThrottle(updateActiveSection);
      const handleResize = win.iGEMUtils && typeof win.iGEMUtils.debounce === 'function'
        ? win.iGEMUtils.debounce(function () {
          updateOffsets();
          updateActiveSection();
        }, 100)
        : function () {
          updateOffsets();
          updateActiveSection();
        };

      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleResize);

      buildSections();
      updateActiveSection();
    }
  };

  /**
   * 本地 rAF 节流兜底实现。
   * 若浏览器不支持 requestAnimationFrame，则回退到 setTimeout(fn, 16)。
   * @param {Function} fn
   * @returns {Function}
   */
  function localRafThrottle(fn) {
    let ticking = false;
    let rafId = null;
    return function () {
      if (ticking) return;
      ticking = true;
      const context = this;
      const args = arguments;
      rafId = raf(function () {
        ticking = false;
        rafId = null;
        fn.apply(context, args);
      });
    };
  }

  /**
   * 公开 API。
   */
  window.AttributionsPage = {
    /**
     * 初始化所有交互模块。
     */
    init: function () {
      if (state.isInitialized) return;

      CardFilter.init('.role-tab', '#members-grid .member-card', 'data-role');
      CardFilter.init('.type-filter-btn', '#external-grid .external-card', 'data-type');
      TaskTagTooltip.init();
      TimelineInteraction.init();
      ScrollSpy.init();

      state.isInitialized = true;
    },

    /**
     * 获取当前状态（用于调试）。
     * @returns {object}
     */
    getState: function () {
      return {
        isInitialized: state.isInitialized,
        timelineActivePanel: state.timeline.activePanelKey,
        config: Object.assign({}, CONFIG)
      };
    },

    /**
     * 手动触发卡片筛选。
     * @param {string} selector - 按钮选择器
     * @param {string} filterValue - 筛选值
     */
    filterCards: function (selector, filterValue) {
      const btn = document.querySelector(selector + '[data-role="' + filterValue + '"]') ||
        document.querySelector(selector + '[data-type="' + filterValue + '"]');
      if (btn) btn.click();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      window.AttributionsPage.init();
    });
  } else {
    window.AttributionsPage.init();
  }
})();
