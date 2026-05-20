/**
 * ============================================
 * iGEM SZPU-2026 - Sidebar Progress System
 * ============================================
 *
 * @version 2.1
 * @description 通用模块化进度计算、导航高亮、布局验证系统
 * 适用于所有带侧边导航栏的页面
 *
 * 关键功能：
 * - 智能滚动容器检测
 * - 精确的进度百分比计算
 * - 实时导航高亮
 * - 布局完整性验证与自动恢复
 * - 内置测试工具
 */
(function () {
  'use strict';

  // ============================================
  // 配置常量
  // ============================================
  const CONFIG = {
    scrollBottomThreshold: 50,
    navVisibleThreshold: 0.1,
    navHighlightOffset: 150, // 导航高亮偏移量(px)，标题离视口顶部该距离时开始高亮
    debugMode: false,
    enableValidation: true,
    validateOnLoad: true
  };

  // ============================================
  // 模块状态
  // ============================================
  const state = {
    cachedElements: null,
    scrollInfo: null,
    isInitialized: false,
    rafId: null
  };

  // ============================================
  // 工具函数
  // ============================================
  const Utils = {
    log: function (message, data) {
      if (CONFIG.debugMode) {
        console.log('[Progress System] ' + message, data || '');
      }
    },
    getScrollPosition: function (element, isWindow) {
      if (isWindow) {
        return window.scrollY || window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop || 0;
      }
      return element.scrollTop;
    },
    getScrollHeight: function (element, isWindow) {
      if (isWindow) {
        return Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight,
          document.documentElement.offsetHeight,
          document.body.offsetHeight
        );
      }
      return element.scrollHeight;
    },
    getClientHeight: function (element, isWindow) {
      if (isWindow) {
        return window.innerHeight ||
          document.documentElement.clientHeight ||
          document.body.clientHeight;
      }
      return element.clientHeight;
    },
    debounce: function (func, wait) {
      let timeout;
      return function executedFunction() {
        const later = function () {
          clearTimeout(timeout);
          func.apply(void 0, arguments);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
  };

  // ============================================
  // DOM 元素缓存与获取
  // ============================================
  const Elements = {
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
    clearCache: function () {
      state.cachedElements = null;
    }
  };

  // ============================================
  // 滚动容器检测
  // ============================================
  const ScrollDetector = {
    detectScrollContainer: function () {
      const descContent = document.querySelector('.description-content, .content-area');
      if (descContent) {
        const style = window.getComputedStyle(descContent);
        if ((style.height !== 'auto' || style.maxHeight !== 'none') &&
          (style.overflowY === 'scroll' || style.overflowY === 'auto')) {
          Utils.log('检测到滚动容器: .description-content/.content-area');
          return { element: descContent, isWindow: false };
        }
      }

      const bodyStyle = window.getComputedStyle(document.body);
      if ((bodyStyle.height !== 'auto' || bodyStyle.maxHeight !== 'none') &&
        (bodyStyle.overflowY === 'scroll' || bodyStyle.overflowY === 'auto')) {
        Utils.log('检测到滚动容器: document.body');
        return { element: document.body, isWindow: false };
      }

      Utils.log('检测到滚动容器: window');
      return { element: window, isWindow: true };
    }
  };

  // ============================================
  // 布局完整性验证与恢复
  // ============================================
  const LayoutValidator = {
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
        Utils.log('布局完整性检查失败，尝试自动恢复...', checks);
        this.autoRecover(checks, el);
      } else {
        Utils.log('布局完整性检查通过');
      }

      return allValid;
    },

    autoRecover: function (checks, el) {
      if (!checks.sidebarPosition && el.descriptionSidebar) {
        el.descriptionSidebar.style.position = 'sticky';
        Utils.log('已恢复: 侧边栏 sticky 定位');
      }
      if (!checks.sidebarTop && el.descriptionSidebar) {
        el.descriptionSidebar.style.top = '120px';
        Utils.log('已恢复: 侧边栏 top 偏移');
      }
      if (!checks.containerOverflow && el.descriptionContainer) {
        el.descriptionContainer.style.overflow = 'visible';
        Utils.log('已恢复: 容器 overflow');
      }
      if (!checks.containerDisplay && el.descriptionContainer) {
        el.descriptionContainer.style.display = 'flex';
        Utils.log('已恢复: 容器 display');
      }
    }
  };

  // ============================================
  // 进度计算核心
  // ============================================
  const ProgressCalculator = {
    calculateProgress: function () {
      const el = Elements.getCachedElements();
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

      Utils.log('进度计算', {
        scrollTop: scrollTop,
        containerHeight: containerHeight,
        totalHeight: totalHeight,
        maxScroll: maxScroll,
        progressPercent: progressPercent
      });

      return { scrollTop: scrollTop, scrollPercent: scrollPercent, progressPercent: progressPercent };
    },

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

  // ============================================
  // 导航高亮系统
  // ============================================
  const NavigationHighlighter = {
    findCurrentSection: function (scrollTop) {
      const allSections = document.querySelectorAll('[id^="section-"], [id^="module-"], [id^="the-"], [id^="chassis-"], [id^="chassis"], [id^="gene-"], [id^="nanobody-"], [id^="fusion-"], [id^="fusion-gpa"], [id^="fusion-pager"], [id^="pager-"], [id^="gpcr-"], [id^="g-protein-"], [id^="dual-"], [id^="sensing-"], [id^="display-"], [id^="virus-"], [id^="overview"], [id^="sensing-system"], [id^="signal-transduction"], [id^="reporter-system"], [id^="reporter"], [id^="surface-display"], [id^="proof-of-concept"]');
      let currentSection = '';
      const offset = CONFIG.navHighlightOffset;

      // 找到最后一个顶部位置 <= offset的section（即标题已经到达或超过视口顶部150px位置的section）
      for (let i = allSections.length - 1; i >= 0; i--) {
        const section = allSections[i];
        const rect = section.getBoundingClientRect();

        if (rect.top <= offset) {
          currentSection = section.id;
          break;
        }
      }

      // 如果没有找到，默认使用第一个section
      if (!currentSection && allSections.length > 0) {
        currentSection = allSections[0].id;
      }

      return currentSection;
    },

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
            l1.classList.add('expanded'); // 自动展开对应目录
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
            const parentLink = document.querySelector('.description-nav a[href="#' + parentCard.id + '"], .sidebar-nav a[href="#' + parentCard.id + '"]');
            if (parentLink) {
              parentLink.classList.add('active');
              const l1 = parentLink.closest('.level1');
              if (l1) {
                l1.classList.add('active');
                l1.classList.add('expanded'); // 自动展开对应目录
              }
            }
          }
        }
      }
    }
  };

  // ============================================
  // 主更新循环
  // ============================================
  const MainLoop = {
    updateScrollProgress: function () {
      const ref = ProgressCalculator.calculateProgress();
      const scrollTop = ref.scrollTop;
      const progressPercent = ref.progressPercent;
      ProgressCalculator.updateProgressUI(progressPercent);

      const currentSection = NavigationHighlighter.findCurrentSection(scrollTop);
      NavigationHighlighter.highlightNavigation(currentSection);
    }
  };

  // ============================================
  // 目录交互系统
  // ============================================
  const NavigationInteractions = {
    setupDirectoryToggle: function () {
      const el = Elements.getCachedElements();

      el.level1Items.forEach(function (item) {
        const toggleIcon = item.querySelector('.toggle-icon');
        const navLink = item.querySelector('.nav-main-link');
        const level2 = item.querySelector('.level2');

        if (level2) {
          if (toggleIcon) {
            toggleIcon.addEventListener('click', function (e) {
              e.preventDefault();
              item.classList.toggle('expanded');
            });
          }

          if (navLink) {
            navLink.addEventListener('click', function (e) {
              item.classList.toggle('expanded');
            });
          }
        }
      });
    }
  };

  // ============================================
  // 测试工具
  // ============================================
  const Tester = {
    runQuickTest: function () {
      const self = this;
      return Promise.resolve().then(function () {
        console.group('🔍 iGEM Sidebar Progress System - Quick Test');

        const el = Elements.getCachedElements();

        const checks = {
          stickyPosition: el.descriptionSidebar ? window.getComputedStyle(el.descriptionSidebar).position === 'sticky' &&
            window.getComputedStyle(el.descriptionSidebar).top === '120px' : false,
          elementsExist: !!(el.progressPercentage && el.flaskLiquid && el.bubbling),
          scrollContainer: !!state.scrollInfo
        };

        console.log('📍 Sticky Position:', checks.stickyPosition ? '✅ PASS' : '❌ FAIL');
        console.log('📊 Elements Exist:', checks.elementsExist ? '✅ PASS' : '❌ FAIL');
        console.log('🔄 Scroll Container:', checks.scrollContainer ? '✅ PASS' : '❌ FAIL');

        window.scrollTo(0, 0);
        return self.wait(100).then(function () {
          const topPercent = el.progressPercentage ? parseInt(el.progressPercentage.textContent) : 0;
          console.log('⬆️ Scroll to Top:', topPercent <= 5 ? '✅ PASS' : '❌ FAIL', '(' + topPercent + '%)');

          window.scrollTo(0, document.documentElement.scrollHeight);
          return self.wait(150).then(function () {
            const bottomPercent = el.progressPercentage ? parseInt(el.progressPercentage.textContent) : 0;
            console.log('⬇️ Scroll to Bottom:', bottomPercent >= 95 ? '✅ PASS' : '❌ FAIL', '(' + bottomPercent + '%)');

            window.scrollTo(0, 0);

            const allPass = Object.values(checks).every(Boolean) && topPercent <= 5 && bottomPercent >= 95;
            console.log('📋 Overall:', allPass ? '✅ ALL TESTS PASSED' : '⚠️ SOME TESTS FAILED');

            console.groupEnd();
            return allPass;
          });
        });
      });
    },

    wait: function (ms) {
      return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    },

    validateLayout: function () {
      return LayoutValidator.validateLayoutIntegrity();
    }
  };

  // ============================================
  // 公开 API
  // ============================================
  window.SidebarProgress = {
    recalculate: function () {
      Elements.clearCache();
      MainLoop.updateScrollProgress();
      Utils.log('已强制重新计算进度');
    },

    validate: function () {
      return LayoutValidator.validateLayoutIntegrity();
    },

    runTest: function () {
      return Tester.runQuickTest();
    },

    setDebugMode: function (enabled) {
      CONFIG.debugMode = enabled;
      console.log('调试模式:', enabled ? '已启用' : '已禁用');
    },

    getState: function () {
      return {
        isInitialized: state.isInitialized,
        scrollInfo: state.scrollInfo,
        config: Object.assign({}, CONFIG)
      };
    }
  };

  // 保持向后兼容的别名
  window.DescriptionProgress = window.SidebarProgress;

  // ============================================
  // 初始化
  // ============================================
  function init() {
    if (state.isInitialized) return;

    Utils.log('系统初始化中...');

    state.scrollInfo = ScrollDetector.detectScrollContainer();
    state.isInitialized = true;

    if (CONFIG.validateOnLoad) {
      LayoutValidator.validateLayoutIntegrity();
    }

    const updateWithRaf = Utils.debounce(function () {
      MainLoop.updateScrollProgress();
    }, 16);

    state.scrollInfo.element.addEventListener('scroll', updateWithRaf, { passive: true });
    window.addEventListener('resize', updateWithRaf, { passive: true });

    NavigationInteractions.setupDirectoryToggle();

    MainLoop.updateScrollProgress();

    Utils.log('系统初始化完成');
    console.log('💡 提示: 在控制台运行 SidebarProgress.runTest() 进行完整测试');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
