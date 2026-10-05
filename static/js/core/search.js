/**
 * search.js
 * 全站页面搜索模块（FlexSearch 关键词智能检索）。
 *
 * 功能：
 * - 在导航栏最右侧提供搜索按钮，悬停/点击展开搜索面板
 * - 加载 static/js/core/search-index.json 构建的索引
 * - 使用 FlexSearch（Document 模式）做 BM25 评分 + 字段权重（title 优先）
 *   + 前缀/模糊匹配；中文按字、英文按词并支持前缀
 * - 支持文字内容与图片（文件名/alt）检索
 * - 结果展示匹配上下文与所属页面，点击跳转至对应页面
 * - 暂不支持跳转到页面内具体锚点
 *
 * 依赖：static/js/vendor/flexsearch.bundle.min.js（须在本文件之前加载，
 *       提供全局 FlexSearch；未加载时自动降级为朴素 includes 匹配）。
 *
 * 公共 API：window.iGEMSearch { open, close, isOpen }
 */
(function () {
  'use strict';

  const SEARCH_CONTAINER_SELECTOR = '#nav-search';
  const SEARCH_INDEX_FILE = 'search-index.json';
  const MAX_QUERY_LENGTH = 80;

  let basePath = '.';
  const FlexSearchNS = (typeof window !== 'undefined' && window.FlexSearch) ? window.FlexSearch : null;

  const state = {
    index: [],
    searchIndex: null, // FlexSearch.Document 实例
    isOpen: false,
    initialized: false
  };

  /**
   * 自定义编码：英文/数字按整词（配合 tokenize:'forward' 支持前缀），
   * 中文逐字（中文无空格，逐字索引可保证子串命中）。返回小写 token 数组。
   */
  function encodeTokens(str) {
    const s = String(str || '').toLowerCase();
    const tokens = [];
    const latin = s.match(/[a-z0-9]+/g);
    if (latin) tokens.push.apply(tokens, latin);
    for (const ch of s) {
      const code = ch.codePointAt(0);
      if (code >= 0x4e00 && code <= 0x9fff) tokens.push(ch);
    }
    return tokens;
  }

  function buildSearchIndex(records) {
    if (!FlexSearchNS || !FlexSearchNS.Document) return null;
    const index = new FlexSearchNS.Document({
      tokenize: 'forward',
      cache: true,
      document: {
        id: 'id',
        index: [
          { field: 'title', tokenize: 'forward' },
          { field: 'content', tokenize: 'forward' }
        ],
        store: ['pageUrl', 'pageTitle', 'content', 'type', 'src']
      },
      encode: encodeTokens
    });
    for (let i = 0; i < records.length; i++) index.add(records[i]);
    return index;
  }

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
        state.searchIndex = buildSearchIndex(state.index);
        return state.index;
      })
      .catch(error => {
        console.warn('[Search] 加载索引失败：', url, error);
        state.index = [];
        state.searchIndex = null;
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
   * 优先走 FlexSearch；若索引未构建（vendor 未加载）则降级为朴素 includes 匹配。
   */
  function performSearch(query) {
    const raw = query.trim().slice(0, MAX_QUERY_LENGTH);
    if (!raw || !state.index.length) return [];

    const pageMap = new Map();

    if (state.searchIndex) {
      const results = state.searchIndex.search(raw, { limit: 60, enrich: true });
      results.forEach(group => {
        (group.result || []).forEach(item => {
          const doc = item.doc;
          if (!doc) return;
          if (!pageMap.has(doc.pageUrl)) pageMap.set(doc.pageUrl, []);
          const items = pageMap.get(doc.pageUrl);
          if (items.length < 3) items.push(doc);
        });
      });
    } else {
      // 降级：朴素子串匹配
      const q = raw.toLowerCase();
      state.index.forEach(record => {
        const content = (record.content || '').toLowerCase();
        const title = (record.pageTitle || '').toLowerCase();
        if (!content.includes(q) && !title.includes(q)) return;
        if (!pageMap.has(record.pageUrl)) pageMap.set(record.pageUrl, []);
        const items = pageMap.get(record.pageUrl);
        if (items.length < 3) items.push(record);
      });
    }

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
   * 已打开搜索面板的悬停保持与延迟收起。
   */
  function bindHoverKeepOpen(container, toggle, input) {
    const HOVER_LEAVE_DELAY = 350;
    let leaveTimer = null;

    function clearLeaveTimer() {
      if (leaveTimer) {
        clearLeaveTimer();
        leaveTimer = null;
      }
    }

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
