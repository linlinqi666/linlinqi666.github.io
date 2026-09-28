/**
 * iGEM SZPU-2026 - Sidebar Progress System
 *
 * 通用模块化进度计算、导航高亮、布局验证系统。
 * 依赖全局 `window.iGEMUtils`，请在页面中先于本脚本加载 `utils.js`。
 */
(function () {
  'use strict';

  const Utils = window.iGEMUtils;
  if (!Utils) {
    console.error('[Progress System] 缺少依赖：请先加载 static/js/utils.js');
    return;
  }

  /**
   * 模块配置。
   * @type {Object}
   */
  const CONFIG = {
    scrollBottomThreshold: 50,
    navVisibleThreshold: 0.1,
    navHighlightOffset: 150,
    /**
     * 点击导航项后锁定高亮的时长（毫秒）。期间点击引起的滚动不会改写高亮；
     * 用户主动滚动（滚轮/触摸/翻页键）会立即解锁。
     * @type {number}
     */
    clickLockMs: 1200,
    debugMode: false,
    enableValidation: true,
    validateOnLoad: true,
    /**
     * 可导航内容的 ID 前缀列表。
     * 添加新页面章节时，在此数组中追加对应前缀即可。
     * @type {string[]}
     */
    sectionIdPrefixes: [
      'design-', 'protocol-', 'results-',
      'section-', 'module-', 'the-', 'chassis-', 'chassis',
      'gene-', 'nanobody-', 'fusion-', 'fusion-gpa', 'fusion-pager',
      'pager-', 'gpcr-', 'g-protein-', 'dual-', 'sensing-',
      'display-', 'virus-', 'overview', 'sensing-system',
      'signal-transduction', 'reporter-system', 'reporter',
      'surface-display', 'proof-of-concept',
      // 实验页公共区块（材料 / 安全 / 排错）与安全页
      'reagents-', 'safety-', 'progress-', 'troubleshooting',
      // dry-lab Model 页正文小节（2026-09-27：卡片 model-award / model-overview / model-game /
      // model-assumptions / model-data-parameters / model-results / model-validation，
      // 小节 model-<语义>；未登记则滚动高亮失效，见 README §5.14.2）
      'model-',
      // Contribution 页结构（概览 / 部件 / 协议 / 其他贡献 / 获取与许可 / 归属与致谢）
      'contribution-', 'parts-', 'protocols-', 'other-', 'access-', 'attribution'
    ]
  };

  /**
   * 模块内部状态。
   * @type {Object}
   */
  const state = {
    cachedElements: null,
    cachedSections: null,
    cachedSectionOffsets: null,
    scrollInfo: null,
    isInitialized: false,
    scrollHandler: null,
    resizeHandler: null,
    clickLockHash: null,
    clickLockAt: 0
  };

  /**
   * 在调试模式下输出日志。
   * @param {string} message - 日志消息
   * @param {*} [data] - 附加数据
   */
  function log(message, data) {
    if (CONFIG.debugMode) {
      console.log('[Progress System] ' + message, data !== undefined ? data : '');
    }
  }

  /**
   * DOM 元素缓存管理。
   */
  const Elements = {
    /**
     * 获取并缓存常用 DOM 元素。
     * @returns {Object} 缓存的元素集合
     */
    getCachedElements: function () {
      if (!state.cachedElements) {
        state.cachedElements = {
          level1Items: document.querySelectorAll('.level1'),
          navLinks: document.querySelectorAll('.description-nav a, .sidebar-nav a'),
          progressPercentage: document.getElementById('progress-percentage'),
          flaskLiquid: document.querySelector('.flask-liquid'),
          bubbling: document.querySelector('.bubbling'),
          descriptionSidebar: document.querySelector('.description-sidebar, .sidebar'),
          descriptionContainer: document.querySelector('.description-container, .main-container'),
          descriptionContent: document.querySelector('.description-content, .content-area')
        };
      }
      return state.cachedElements;
    },

    /**
     * 清除 DOM 元素缓存。
     */
    clearCache: function () {
      state.cachedElements = null;
    }
  };

  /**
   * 生成章节选择器字符串。
   * @returns {string} CSS 选择器
   */
  function getSectionSelector() {
    return CONFIG.sectionIdPrefixes.map(function (prefix) {
      return '[id^="' + prefix + '"]';
    }).join(', ');
  }

  /**
   * 缓存可导航章节元素，仅在 resize 或初始化时调用以减少滚动时的 DOM 查询。
   */
  function buildSectionCache() {
    // 侧栏自身的 id（如进度百分比 #progress-percentage）不应被当成正文章节
    state.cachedSections = Array.prototype.filter.call(
      document.querySelectorAll(getSectionSelector()),
      function (el) {
        return !el.closest('.description-sidebar, .sidebar');
      }
    );
    // 在初始化/resize（低频）时一次性计算各章节的绝对顶部偏移，滚动期直接比对 scrollY，
    // 避免在 rAF 中反复调用 getBoundingClientRect 造成强制同步布局（卡顿主因之一）。
    var scrollY = window.scrollY || window.pageYOffset || 0;
    state.cachedSectionOffsets = Array.prototype.map.call(state.cachedSections, function (el) {
      return { id: el.id, top: el.getBoundingClientRect().top + scrollY };
    });
    log('章节缓存已重建，数量：' + state.cachedSections.length);
  }

  /**
   * 布局完整性验证与自动恢复。
   */
  const LayoutValidator = {
    /**
     * 验证关键布局属性。
     * @returns {boolean} 布局是否有效
     */
    validateLayoutIntegrity: function () {
      if (!CONFIG.enableValidation) return true;

      const el = Elements.getCachedElements();
      const checks = {
        sidebarPosition: el.descriptionSidebar ?
          window.getComputedStyle(el.descriptionSidebar).position === 'sticky' : false,
        sidebarTop: el.descriptionSidebar ?
          window.getComputedStyle(el.descriptionSidebar).top === '120px' : false,
        containerOverflow: el.descriptionContainer ?
          window.getComputedStyle(el.descriptionContainer).overflow === 'visible' : false,
        containerDisplay: el.descriptionContainer ?
          window.getComputedStyle(el.descriptionContainer).display === 'flex' : false,
        criticalElementsExist: !!(el.progressPercentage && el.flaskLiquid && el.bubbling)
      };

      const allValid = Object.values(checks).every(Boolean);

      if (!allValid) {
        log('布局完整性检查失败，尝试自动恢复...', checks);
        this.autoRecover(checks, el);
      } else {
        log('布局完整性检查通过');
      }

      return allValid;
    },

    /**
     * 自动恢复关键布局样式。
     * @param {Object} checks - 各检查项结果
     * @param {Object} el - 缓存的 DOM 元素
     */
    autoRecover: function (checks, el) {
      if (!checks.sidebarPosition && el.descriptionSidebar) {
        el.descriptionSidebar.style.position = 'sticky';
        log('已恢复: 侧边栏 sticky 定位');
      }
      if (!checks.sidebarTop && el.descriptionSidebar) {
        el.descriptionSidebar.style.top = '120px';
        log('已恢复: 侧边栏 top 偏移');
      }
      if (!checks.containerOverflow && el.descriptionContainer) {
        el.descriptionContainer.style.overflow = 'visible';
        log('已恢复: 容器 overflow');
      }
      if (!checks.containerDisplay && el.descriptionContainer) {
        el.descriptionContainer.style.display = 'flex';
        log('已恢复: 容器 display');
      }
    }
  };

  /**
   * 进度计算与 UI 更新。
   */
  const ProgressCalculator = {
    /**
     * 根据当前滚动位置计算进度百分比。
     * @returns {{scrollTop: number, scrollPercent: number, progressPercent: number}}
     */
    calculateProgress: function () {
      const scrollInfo = state.scrollInfo;
      const scrollElement = scrollInfo.element;
      const isWindowScroll = scrollInfo.isWindow;

      const scrollTop = Utils.getScrollPosition(scrollElement, isWindowScroll);
      const containerHeight = Utils.getClientHeight(scrollElement, isWindowScroll);
      const totalHeight = Utils.getScrollHeight(scrollElement, isWindowScroll);
      const maxScroll = Math.max(1, totalHeight - containerHeight);
      const scrollPercent = (scrollTop / maxScroll) * 100;
      let progressPercent = Math.round(Math.min(100, Math.max(0, scrollPercent)));

      if (maxScroll - scrollTop < CONFIG.scrollBottomThreshold) {
        progressPercent = 100;
      }

      log('进度计算', {
        scrollTop: scrollTop,
        containerHeight: containerHeight,
        totalHeight: totalHeight,
        maxScroll: maxScroll,
        progressPercent: progressPercent
      });

      return { scrollTop: scrollTop, scrollPercent: scrollPercent, progressPercent: progressPercent };
    },

    /**
     * 更新进度相关 UI。
     * @param {number} progressPercent - 0-100 的进度值
     */
    updateProgressUI: function (progressPercent) {
      const el = Elements.getCachedElements();

      if (el.progressPercentage) {
        el.progressPercentage.textContent = progressPercent + '%';
      }
      if (el.flaskLiquid) {
        el.flaskLiquid.style.setProperty('--progress', progressPercent);
      }
      if (el.bubbling) {
        el.bubbling.style.setProperty('--bubble-height', progressPercent);
      }
    }
  };

  /**
   * 导航高亮逻辑。
   */
  const NavigationHighlighter = {
    /**
     * 根据滚动位置查找当前所在章节 ID。
     * @param {number} scrollTop - 当前滚动位置
     * @returns {string} 当前章节 ID
     */
    findCurrentSection: function (scrollTop) {
      // 以视口中线为判定线：原文用「顶部 + navHighlightOffset」，在小节被 result-sections.js
      // 折叠成 <details> 后，各小节间距坍塌为一行标题，区间判定会高亮跳太远。改用中线判定，
      // 折叠态（间距小）与展开态（间距大）下都能稳定高亮当前阅读的小节。
      const viewportHeight = (state.scrollInfo && Utils.getClientHeight(state.scrollInfo.element, state.scrollInfo.isWindow)) || window.innerHeight || 800;
      const line = scrollTop + viewportHeight / 2;

      // 优先使用缓存的绝对偏移（无强制重排）
      if (state.cachedSectionOffsets && state.cachedSectionOffsets.length) {
        let currentSection = '';
        for (let i = state.cachedSectionOffsets.length - 1; i >= 0; i--) {
          if (state.cachedSectionOffsets[i].top <= line) {
            currentSection = state.cachedSectionOffsets[i].id;
            break;
          }
        }
        if (!currentSection && state.cachedSectionOffsets.length > 0) {
          currentSection = state.cachedSectionOffsets[0].id;
        }
        return currentSection;
      }

      // 兜底：缓存缺失时回退到 getBoundingClientRect 逻辑（极少触发）
      const sections = state.cachedSections || document.querySelectorAll(getSectionSelector());
      const sy = window.scrollY || window.pageYOffset || 0;
      let currentSection = '';
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].getBoundingClientRect().top + sy <= line) {
          currentSection = sections[i].id;
          break;
        }
      }
      if (!currentSection && sections.length > 0) {
        currentSection = sections[0].id;
      }
      return currentSection;
    },

    /**
     * 高亮当前章节对应的导航项。
     * @param {string} currentSection - 当前章节 ID
     */
    highlightNavigation: function (currentSection) {
      const el = Elements.getCachedElements();

      el.navLinks.forEach(function (link) { return link.classList.remove('active'); });
      el.level1Items.forEach(function (item) {
        item.classList.remove('active');
        item.classList.remove('expanded');
      });

      let matched = false;
      for (let i = 0; i < el.navLinks.length; i++) {
        if (el.navLinks[i].getAttribute('href') === '#' + currentSection) {
          el.navLinks[i].classList.add('active');
          const l1 = el.navLinks[i].closest('.level1');
          if (l1) {
            l1.classList.add('active');
            l1.classList.add('expanded');
          }
          matched = true;
          break;
        }
      }

      if (!matched && currentSection) {
        const currentElement = document.getElementById(currentSection);
        if (currentElement) {
          const parentCard = currentElement.closest('.content-card');
          if (parentCard && parentCard.id) {
            const parentLink = document.querySelector(
              '.description-nav a[href="#' + parentCard.id + '"], .sidebar-nav a[href="#' + parentCard.id + '"]');
            if (parentLink) {
              parentLink.classList.add('active');
              const l1 = parentLink.closest('.level1');
              if (l1) {
                l1.classList.add('active');
                l1.classList.add('expanded');
              }
            }
          }
        }
      }
    }
  };

  /**
   * 主更新循环。
   */
  const MainLoop = {
    /**
     * 执行一次进度计算、UI 更新与导航高亮。
     */
    updateScrollProgress: function () {
      const result = ProgressCalculator.calculateProgress();
      ProgressCalculator.updateProgressUI(result.progressPercent);

      // 点击导航后短时间内把高亮锁定在被点击项：点击引起的滚动会让目标停在视口顶部，
      // 若立即按「视口中线」重算，高亮会跳到下一个锚点，与用户点击意图不符。
      if (state.clickLockHash && Date.now() - state.clickLockAt < CONFIG.clickLockMs) {
        NavigationHighlighter.highlightNavigation(state.clickLockHash);
        return;
      }
      state.clickLockHash = null;

      const currentSection = NavigationHighlighter.findCurrentSection(result.scrollTop);
      NavigationHighlighter.highlightNavigation(currentSection);
    }
  };

  /**
   * 目录展开/收起交互。
   */
  const NavigationInteractions = {
    /**
     * 为一级导航绑定展开/收起事件。
     */
    setupDirectoryToggle: function () {
      const el = Elements.getCachedElements();

      el.level1Items.forEach(function (item) {
        const toggleIcon = item.querySelector('.toggle-icon');
        const navLink = item.querySelector('.nav-main-link');
        const level2 = item.querySelector('.level2');

        if (!level2) return;

        if (toggleIcon) {
          toggleIcon.addEventListener('click', function (e) {
            e.preventDefault();
            item.classList.toggle('expanded');
          });
        }

        if (navLink) {
          navLink.addEventListener('click', function () {
            item.classList.toggle('expanded');
          });
        }
      });
    },

    /**
     * 点击导航项后短暂锁定高亮到被点击项，避免点击引起的滚动把高亮带到相邻锚点；
     * 用户主动滚动（滚轮/触摸/翻页键）时立即解锁，恢复常规滚动高亮。
     */
    setupClickHighlight: function () {
      const el = Elements.getCachedElements();

      el.navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          const href = link.getAttribute('href') || '';
          if (href.charAt(0) !== '#') return;
          state.clickLockHash = href.slice(1);
          state.clickLockAt = Date.now();
        });
      });

      const unlock = function () { state.clickLockHash = null; };
      window.addEventListener('wheel', unlock, { passive: true });
      window.addEventListener('touchmove', unlock, { passive: true });
      window.addEventListener('keydown', function (e) {
        if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].indexOf(e.key) >= 0) {
          unlock();
        }
      });
    }
  };

  /**
   * 内置测试工具。
   */
  /**
   * 公开 API。
   */
  window.SidebarProgress = {
    /**
     * 强制重新计算进度并更新 UI。
     * 同时重建章节偏移缓存——供 result-sections.js 在收纳条展开/收起（改变布局）后调用，
     * 否则 cachedSectionOffsets 停留在旧布局，高亮会错乱。
     */
    recalculate: function () {
      Elements.clearCache();
      buildSectionCache();
      MainLoop.updateScrollProgress();
      log('已强制重新计算进度');
    },

    /**
     * 验证布局完整性。
     * @returns {boolean}
     */
    validate: function () {
      return LayoutValidator.validateLayoutIntegrity();
    },

    /**
     * 获取当前模块状态。
     * @returns {Object}
     */
    getState: function () {
      return {
        isInitialized: state.isInitialized,
        scrollInfo: state.scrollInfo,
        config: Object.assign({}, CONFIG)
      };
    },

    /**
     * 清理所有事件监听与缓存引用。
     */
    destroy: destroy
  };

  // 保持向后兼容的别名
  window.DescriptionProgress = window.SidebarProgress;

  /**
   * 清理所有事件监听与缓存引用。
   */
  function destroy() {
    if (state.scrollHandler) {
      state.scrollHandler.cancel && state.scrollHandler.cancel();
    }
    if (state.scrollHandler && state.scrollInfo && state.scrollInfo.element) {
      const passiveOption = Utils.supportsPassiveEvents() ? { passive: true } : false;
      state.scrollInfo.element.removeEventListener('scroll', state.scrollHandler, passiveOption);
    }
    if (state.resizeHandler) {
      window.removeEventListener('resize', state.resizeHandler);
      state.resizeHandler.cancel && state.resizeHandler.cancel();
    }

    state.scrollHandler = null;
    state.resizeHandler = null;
    state.scrollInfo = null;
    state.cachedElements = null;
    state.cachedSections = null;
    state.isInitialized = false;
  }

  /**
   * 初始化模块。
   */
  function init() {
    if (state.isInitialized) return;

    log('系统初始化中...');

    state.scrollInfo = Utils.detectScrollContainer();
    state.isInitialized = true;
    buildSectionCache();

    // 图片/字体加载完成可能导致垂直位置变化，刷新偏移缓存（仅发生一次，不影响滚动期性能）
    window.addEventListener('load', function () {
      buildSectionCache();
      MainLoop.updateScrollProgress();
    });

    if (CONFIG.validateOnLoad) {
      LayoutValidator.validateLayoutIntegrity();
    }

    const throttledUpdate = Utils.rafThrottle(MainLoop.updateScrollProgress);
    state.resizeHandler = Utils.debounce(function () {
      buildSectionCache();
      MainLoop.updateScrollProgress();
    }, 100);
    state.scrollHandler = throttledUpdate;

    const passiveOption = Utils.supportsPassiveEvents() ? { passive: true } : false;

    state.scrollInfo.element.addEventListener('scroll', throttledUpdate, passiveOption);
    window.addEventListener('resize', state.resizeHandler, passiveOption);

    NavigationInteractions.setupDirectoryToggle();
    NavigationInteractions.setupClickHighlight();

    MainLoop.updateScrollProgress();

    log('系统初始化完成');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('beforeunload', destroy);
})();
