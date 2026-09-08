/**
 * search.js
 * 全站页面搜索模块。
 *
 * 功能：
 * - 在导航栏最右侧提供搜索按钮，悬停/点击展开搜索面板
 * - 加载 static/js/core/search-index.json 构建的索引
 * - 支持文字内容与图片（文件名/alt）检索
 * - 结果展示匹配上下文与所属页面，点击跳转至对应页面
 * - 暂不支持跳转到页面内具体锚点
 *
 * 公共 API：window.iGEMSearch { open, close, isOpen }
 */
(function () {
  'use strict';

  const SEARCH_CONTAINER_SELECTOR = '#nav-search';
  const SEARCH_INDEX_FILE = 'search-index.json';
  const MAX_QUERY_LENGTH = 80;

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

  let indexPromise = null;

  function getIndexUrl() {
    const scriptUrl = getScriptUrl();
    if (!scriptUrl) return SEARCH_INDEX_FILE;
    const lastSlash = scriptUrl.lastIndexOf('/');
    return lastSlash === -1
      ? SEARCH_INDEX_FILE
      : scriptUrl.slice(0, lastSlash + 1) + SEARCH_INDEX_FILE;
  }

  function loadIndex() {
    if (state.index.length) return Promise.resolve(state.index);
    if (indexPromise) return indexPromise;

    const url = getIndexUrl();
    indexPromise = fetch(url, {
      credentials: 'same-origin',
      headers: { Accept: 'application/json' }
    })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(index => {
        state.index = Array.isArray(index) ? index : [];
        return state.index;
      })
      .catch(error => {
        console.warn('[Search] 加载索引失败：', url, error);
        state.index = [];
        return state.index;
      });

    return indexPromise;
  }

  function appendHighlightedText(container, text, query) {
    const source = String(text || '');
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      container.textContent = source;
      return;
    }

    const regex = new RegExp(normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    let cursor = 0;
    source.replace(regex, (match, offset) => {
      container.append(document.createTextNode(source.slice(cursor, offset)));
      const mark = document.createElement('mark');
      mark.textContent = match;
      container.append(mark);
      cursor = offset + match.length;
      return match;
    });
    container.append(document.createTextNode(source.slice(cursor)));
  }

  /**
   * 执行本地搜索，返回按页面分组的结果。
   */
  function performSearch(query) {
    const q = query.trim().slice(0, MAX_QUERY_LENGTH).toLowerCase();
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
    resultsEl.replaceChildren();

    if (!query.trim()) {
      const empty = document.createElement('div');
      empty.className = 'nav-search__empty';
      empty.textContent = 'Start typing to search pages...';
      resultsEl.append(empty);
      return;
    }

    if (!results.length) {
      const empty = document.createElement('div');
      empty.className = 'nav-search__empty';
      empty.textContent = 'No results found.';
      resultsEl.append(empty);
      return;
    }

    results.forEach(group => {
      const pageUrl = resolveUrl(group.pageUrl);
      const pageTitle = group.items[0].pageTitle || group.pageUrl;
      const groupEl = document.createElement('div');
      groupEl.className = 'nav-search__group';

      const titleEl = document.createElement('div');
      titleEl.className = 'nav-search__group-title';
      titleEl.textContent = pageTitle;
      groupEl.append(titleEl);

      group.items.forEach(item => {
        const resultLink = document.createElement('a');
        resultLink.href = pageUrl;
        resultLink.className = 'nav-search__result';
        const contextEl = document.createElement('span');
        contextEl.className = 'nav-search__result-context';
        appendHighlightedText(contextEl, item.content, query);

        if (item.type === 'image' && item.src) {
          resultLink.classList.add('nav-search__result--image');
          const image = document.createElement('img');
          image.src = resolveUrl(item.src);
          image.alt = '';
          image.loading = 'lazy';
          resultLink.append(image);
        }
        resultLink.append(contextEl);
        groupEl.append(resultLink);
      });
      resultsEl.append(groupEl);
    });
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
      const query = input.value.slice(0, MAX_QUERY_LENGTH);
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
