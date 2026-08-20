/**
 * search.js
 * 全站页面搜索模块。
 *
 * 功能：
 * - 在导航栏最右侧提供搜索按钮，悬停/点击展开搜索面板
 * - 按需加载 static/js/core/search-index.js 中预构建的索引
 * - 支持文字内容与图片（文件名/alt）检索
 * - 结果展示匹配上下文与所属页面，点击跳转至对应页面
 * - 暂不支持跳转到页面内具体锚点
 *
 * 公共 API：window.iGEMSearch { open, close, isOpen }
 */
(function () {
  'use strict';

  const SEARCH_CONTAINER_SELECTOR = '#nav-search';
  const SEARCH_INDEX_FILE = 'search-index.js';

  let basePath = '.';

  const state = {
    index: [],
    isOpen: false,
    initialized: false
  };

  /**
   * 从 data-base-path 读取当前页面相对站点根目录的路径前缀。
   */
  function readBasePath() {
    const container = document.querySelector(SEARCH_CONTAINER_SELECTOR);
    return (container && container.dataset.basePath) || '.';
  }

  /**
   * 将站点根相对路径解析为当前页面可访问的相对路径。
   */
  function resolveUrl(rootRelativeUrl) {
    if (!rootRelativeUrl) return '';
    if (/^[a-z][a-z0-9+.-]*:/i.test(rootRelativeUrl)) return rootRelativeUrl;
    if (basePath === '.') return rootRelativeUrl;
    return basePath + '/' + rootRelativeUrl;
  }

  /**
   * 异步加载搜索索引 JSON。
   */
  function getScriptUrl() {
    const scripts = document.querySelectorAll('script[src*="static/js/core/search.js"]');
    if (scripts.length) {
      return scripts[scripts.length - 1].src;
    }
    return '';
  }

  function loadIndexScript() {
    return new Promise((resolve) => {
      if (window.iGEMSearchIndex) {
        state.index = window.iGEMSearchIndex;
        resolve(state.index);
        return;
      }

      const scriptUrl = getScriptUrl();
      let url = SEARCH_INDEX_FILE;
      if (scriptUrl) {
        const lastSlash = scriptUrl.lastIndexOf('/');
        if (lastSlash !== -1) {
          url = scriptUrl.slice(0, lastSlash + 1) + SEARCH_INDEX_FILE;
        }
      }

      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.onload = () => {
        state.index = window.iGEMSearchIndex || [];
        resolve(state.index);
      };
      script.onerror = () => {
        console.warn('[Search] 加载索引脚本失败：', url);
        state.index = [];
        resolve(state.index);
      };
      document.head.appendChild(script);
    });
  }

  async function loadIndex() {
    if (state.index.length) return state.index;
    return loadIndexScript();
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function highlight(text, query) {
    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp('(' + safeQuery + ')', 'gi');
    return escapeHtml(text).replace(regex, '<mark>$1</mark>');
  }

  /**
   * 执行本地搜索，返回按页面分组的结果。
   */
  function performSearch(query) {
    const q = query.trim().toLowerCase();
    if (!q || !state.index.length) return [];

    const pageMap = new Map();

    state.index.forEach(record => {
      const content = (record.content || '').toLowerCase();
      const title = (record.pageTitle || '').toLowerCase();
      if (!content.includes(q) && !title.includes(q)) return;

      if (!pageMap.has(record.pageUrl)) {
        pageMap.set(record.pageUrl, []);
      }
      const items = pageMap.get(record.pageUrl);
      if (items.length < 3) items.push(record);
    });

    const groups = [];
    pageMap.forEach((items, pageUrl) => {
      groups.push({ pageUrl, items });
    });
    return groups.slice(0, 8);
  }

  /**
   * 渲染搜索结果。
   */
  function renderResults(results, query) {
    const resultsEl = document.getElementById('nav-search-results');
    if (!resultsEl) return;

    if (!query.trim()) {
      resultsEl.innerHTML = '<div class="nav-search__empty">Start typing to search pages...</div>';
      return;
    }

    if (!results.length) {
      resultsEl.innerHTML = '<div class="nav-search__empty">No results found.</div>';
      return;
    }

    const html = results.map(group => {
      const pageUrl = resolveUrl(group.pageUrl);
      const pageTitle = group.items[0].pageTitle || group.pageUrl;

      const itemsHtml = group.items.map(item => {
        const contentHtml = highlight(item.content, query);
        const isImage = item.type === 'image' && item.src;
        if (isImage) {
          return `<a href="${escapeHtml(pageUrl)}" class="nav-search__result nav-search__result--image">
            <img src="${escapeHtml(resolveUrl(item.src))}" alt="" loading="lazy">
            <span class="nav-search__result-context">${contentHtml}</span>
          </a>`;
        }
        return `<a href="${escapeHtml(pageUrl)}" class="nav-search__result">
          <span class="nav-search__result-context">${contentHtml}</span>
        </a>`;
      }).join('');

      return `<div class="nav-search__group">
        <div class="nav-search__group-title">${escapeHtml(pageTitle)}</div>
        ${itemsHtml}
      </div>`;
    }).join('');

    resultsEl.innerHTML = html;
  }

  function openSearch(focusInput = true) {
    state.isOpen = true;
    const container = document.querySelector(SEARCH_CONTAINER_SELECTOR);
    const panel = document.getElementById('nav-search-panel');
    const toggle = document.getElementById('nav-search-toggle');
    const input = document.getElementById('nav-search-input');

    if (container) container.classList.add('nav-search--open');
    if (panel) panel.classList.add('nav-search__panel--open');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');

    loadIndex().then(() => {
      if (input && focusInput) input.focus();
    });
  }

  function closeSearch() {
    state.isOpen = false;
    const container = document.querySelector(SEARCH_CONTAINER_SELECTOR);
    const panel = document.getElementById('nav-search-panel');
    const toggle = document.getElementById('nav-search-toggle');

    if (container) container.classList.remove('nav-search--open');
    if (panel) panel.classList.remove('nav-search__panel--open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  function debounce(fn, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  /**
   * 悬停展开 / 延迟收起。
   * 仅在搜索按钮上悬停时展开，鼠标离开搜索区域后延迟 350ms 收起；
   * 如果输入框或其内部任意元素聚焦，则不自动收起。
   */
  function bindHoverKeepOpen(container, toggle, input) {
    const HOVER_LEAVE_DELAY = 350;
    let leaveTimer = null;

    function clearLeaveTimer() {
      if (leaveTimer) {
        clearTimeout(leaveTimer);
        leaveTimer = null;
      }
    }

    // 仅按钮悬停触发自动展开，避免大区域误触；悬停展开时不自动聚焦输入框
    toggle.addEventListener('mouseenter', () => {
      clearLeaveTimer();
      if (!state.isOpen) {
        openSearch(false);
      }
    });

    // 在搜索区域内悬停时保持打开
    container.addEventListener('mouseenter', () => {
      clearLeaveTimer();
    });

    container.addEventListener('mouseleave', event => {
      if (container.contains(event.relatedTarget)) return;
      if (document.activeElement === input || container.contains(document.activeElement)) return;

      leaveTimer = setTimeout(() => {
        if (state.isOpen) {
          closeSearch();
        }
      }, HOVER_LEAVE_DELAY);
    });

    input.addEventListener('focus', () => {
      clearLeaveTimer();
      if (!state.isOpen) {
        openSearch(true);
      }
    });
  }

  function init() {
    if (state.initialized) return;
    basePath = readBasePath();

    const container = document.querySelector(SEARCH_CONTAINER_SELECTOR);
    const toggle = document.getElementById('nav-search-toggle');
    const closeBtn = document.getElementById('nav-search-close');
    const input = document.getElementById('nav-search-input');
    const panel = document.getElementById('nav-search-panel');

    if (!container || !toggle || !input) {
      console.warn('[Search] 未找到必要的搜索 DOM 元素');
      return;
    }

    toggle.addEventListener('click', event => {
      event.stopPropagation();
      state.isOpen ? closeSearch() : openSearch();
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', event => {
        event.stopPropagation();
        closeSearch();
      });
    }

    const runSearch = debounce(() => {
      const query = input.value;
      loadIndex().then(() => {
        renderResults(performSearch(query), query);
      });
    }, 150);

    input.addEventListener('input', runSearch);

    input.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeSearch();
      }
    });

    bindHoverKeepOpen(container, toggle, input);

    panel.addEventListener('click', event => {
      event.stopPropagation();
    });

    document.addEventListener('click', event => {
      if (state.isOpen && !container.contains(event.target)) {
        closeSearch();
      }
    });

    state.initialized = true;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.iGEMSearch = {
    open: openSearch,
    close: closeSearch,
    isOpen: () => state.isOpen
  };
})();
