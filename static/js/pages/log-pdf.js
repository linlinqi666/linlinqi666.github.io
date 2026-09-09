/**
 * 日志页 PDF 在线阅读器控制器。
 *
 * 设计要点：
 *   - PDF.js 按需懒加载（约 2.5MB），首次点击文档才注入，不拖慢首屏。
 *   - 三级降级：PDF.js canvas → iframe 原生预览 → 下载链接。
 *     PDF 托管在 CDN 时可能缺少 CORS 头，此时自动走 iframe（不受 CORS 限制）。
 *   - 全部 DOM 用 createElement + textContent 构建，不使用 innerHTML。
 *   - 渲染前取消上一个 RenderTask，避免快速翻页时任务堆叠。
 */
(function () {
  'use strict';

  var CONFIG = {
    minScale: 0.5,
    maxScale: 3,
    scaleStep: 0.2,
    defaultScale: 1.2
  };

  var state = {
    root: null,
    docs: [],
    current: null,
    pdfDoc: null,
    pageNum: 1,
    pageCount: 0,
    scale: CONFIG.defaultScale,
    renderTask: null,
    pdfjsLoading: null,
    pdfjsBase: null, // 实际成功加载 PDF.js 的 base（CDN 或本地回退）
    mode: 'empty', // empty | pdfjs | iframe
    matchPages: [],
    matchIndex: -1
  };

  var el = {};

  /* -------------------- 工具函数 -------------------- */

  function byId(id) {
    return document.getElementById(id);
  }

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function setStatus(message, level) {
    if (!el.status) return;
    el.status.textContent = message || '';
    if (level) el.status.setAttribute('data-level', level);
    else el.status.removeAttribute('data-level');
  }

  function setToolbarEnabled(enabled) {
    ['prev', 'next', 'zoomIn', 'zoomOut', 'fit', 'download'].forEach(function (key) {
      if (el[key]) el[key].disabled = !enabled;
    });
    if (el.pageInput) el.pageInput.disabled = !enabled;
    if (el.searchInput) el.searchInput.disabled = !enabled;
  }

  /** 动态注入脚本，返回 Promise。用于懒加载 PDF.js。 */
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[data-pdfjs-loader="' + src + '"]');
      if (existing) {
        // 已注入过：等待其就绪或复用
        if (window.pdfjsLib) resolve();
        else existing.addEventListener('load', resolve, { once: true });
        return;
      }
      var script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.setAttribute('data-pdfjs-loader', src);
      script.onload = function () { resolve(); };
      script.onerror = function () { reject(new Error('脚本加载失败: ' + src)); };
      document.head.appendChild(script);
    });
  }

  /* -------------------- 视图构建 -------------------- */

  function clearStage() {
    if (!el.stage) return;
    while (el.stage.firstChild) el.stage.removeChild(el.stage.firstChild);
  }

  /** 空态：文档未上传，或全部加载方式不可用。 */
  function mountEmpty(title, desc, linkHref, linkText) {
    state.mode = 'empty';
    clearStage();
    var box = make('div', 'pdf-empty');
    box.appendChild(make('div', 'pdf-empty__title', title));
    if (desc) box.appendChild(make('p', 'pdf-empty__desc', desc));
    if (linkHref) {
      var link = make('a', 'pdf-empty__link', linkText || '下载 PDF');
      link.href = linkHref;
      link.setAttribute('download', '');
      box.appendChild(link);
    }
    el.stage.appendChild(box);
    setToolbarEnabled(false);
  }

  function mountSkeleton(message) {
    var box = make('div', 'pdf-skeleton');
    box.appendChild(make('div', 'pdf-skeleton__bar'));
    box.appendChild(make('span', null, message || '正在加载文档…'));
    clearStage();
    el.stage.appendChild(box);
  }

  /** 二级降级：iframe 原生预览，不受 CORS 限制。 */
  function mountIframe(doc) {
    state.mode = 'iframe';
    clearStage();
    var frame = make('iframe', 'pdf-frame');
    frame.src = doc.src + '#view=FitH&toolbar=1&navpanes=0';
    frame.title = doc.title || doc.label;
    frame.setAttribute('loading', 'lazy');
    el.stage.appendChild(frame);
    // iframe 模式下页码/缩放由浏览器内置阅读器接管，但下载仍可用
    setToolbarEnabled(false);
    if (el.download) el.download.disabled = !doc.src;
    setStatus('已切换为浏览器内置阅读器（文档服务未开放跨域，功能由内置阅读器提供）。', 'warn');
  }

  /* -------------------- PDF.js 加载与渲染 -------------------- */

  /** 候选 base 列表：优先 CDN，失败回退本地（开发用）。 */
  function candidateBases() {
    var base = (state.root && state.root.getAttribute('data-pdfjs-base')) || '';
    var local = (state.root && state.root.getAttribute('data-pdfjs-local')) || '';
    var list = [];
    if (base) list.push(base);
    if (local && local !== base) list.push(local);
    return list;
  }

  /**
   * 懒加载 PDF.js（UMD 版暴露 window.pdfjsLib）。
   * 依次尝试候选 base（CDN → 本地），任一成功即可，使本地副本可不入库、
   * 线上走 iGEM 官方 CDN，开发时又能用本地回退。
   */
  function ensurePdfjs() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    if (state.pdfjsLoading) return state.pdfjsLoading;

    var bases = candidateBases();
    if (!bases.length) {
      return Promise.reject(new Error('未配置 PDF.js 地址（data-pdfjs-base / data-pdfjs-local）'));
    }

    state.pdfjsLoading = bases.reduce(function (chain, base) {
      return chain.then(function (used) {
        if (used) return used;
        return loadScript(base + 'pdf.min.js').then(function () {
          if (!window.pdfjsLib) throw new Error('PDF.js 未正确初始化: ' + base);
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = base + 'pdf.worker.min.js';
          return base;
        }).catch(function () { return null; });
      });
    }, Promise.resolve(null)).then(function (usedBase) {
      if (!usedBase) throw new Error('PDF.js 加载失败（CDN 与本地回退均不可用）');
      state.pdfjsBase = usedBase;
      return window.pdfjsLib;
    }).catch(function (err) {
      state.pdfjsLoading = null;
      throw err;
    });

    return state.pdfjsLoading;
  }

  function getRenderOptions() {
    var base = state.pdfjsBase || (state.root && state.root.getAttribute('data-pdfjs-base')) || '';
    return {
      cMapUrl: base + 'cmaps/',
      cMapPacked: true
    };
  }

  /** 渲染指定页。渲染前取消上一任务，避免快速翻页堆叠。 */
  function renderPage(num) {
    if (!state.pdfDoc) return Promise.resolve();
    var target = Math.min(Math.max(num, 1), state.pageCount);
    state.pageNum = target;

    if (state.renderTask) {
      state.renderTask.cancel();
      state.renderTask = null;
    }

    return state.pdfDoc.getPage(target).then(function (page) {
      var viewport = page.getViewport({ scale: state.scale });
      var canvas = el.canvas;
      if (!canvas) return;
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.classList.add('is-loading');

      var context = canvas.getContext('2d');
      var task = page.render({ canvasContext: context, viewport: viewport });
      state.renderTask = task;
      return task.promise;
    }).then(function () {
      state.renderTask = null;
      if (el.canvas) el.canvas.classList.remove('is-loading');
      syncPageControls();
    }).catch(function (err) {
      if (err && err.name === 'RenderingCancelledException') return;
      throw err;
    });
  }

  function syncPageControls() {
    if (el.pageInput) el.pageInput.value = String(state.pageNum);
    if (el.pageTotal) el.pageTotal.textContent = '/ ' + (state.pageCount || 1);
    if (el.prev) el.prev.disabled = state.pageNum <= 1;
    if (el.next) el.next.disabled = state.pageNum >= state.pageCount;
  }

  function mountCanvas() {
    state.mode = 'pdfjs';
    clearStage();
    var canvas = make('canvas', 'pdf-canvas');
    canvas.id = 'pdf-canvas';
    el.canvas = canvas;
    el.stage.appendChild(canvas);
  }

  /** 打开指定文档。 */
  function openDoc(id) {
    var doc = null;
    for (var i = 0; i < state.docs.length; i++) {
      if (state.docs[i].id === id) { doc = state.docs[i]; break; }
    }
    if (!doc) return Promise.resolve();

    state.current = doc;
    state.pdfDoc = null;
    state.pageNum = 1;
    state.pageCount = 0;
    state.scale = CONFIG.defaultScale;
    state.matchPages = [];
    state.matchIndex = -1;

    setActiveNav(id);
    if (el.title) el.title.textContent = doc.title || doc.label;
    if (el.download) el.download.disabled = !doc.src;

    if (!doc.src) {
      mountEmpty('文档待上传', '该分类的实验记录尚未上传。上传后把地址填入 log-pdf-data.js 即可显示，无需改动页面结构。');
      setStatus('');
      return Promise.resolve();
    }

    mountSkeleton('正在准备阅读器…');
    setStatus('');

    return ensurePdfjs().then(function (pdfjsLib) {
      mountCanvas();
      setStatus('正在加载文档…');
      var params = getRenderOptions();
      params.url = doc.src;
      return pdfjsLib.getDocument(params).promise;
    }).then(function (pdfDoc) {
      state.pdfDoc = pdfDoc;
      state.pageCount = pdfDoc.numPages;
      setToolbarEnabled(true);
      setStatus('');
      return renderPage(1);
    }).catch(function (err) {
      // 一级失败（含 CORS 拒绝）→ 二级 iframe
      mountIframe(doc);
      return null;
    });
  }

  /* -------------------- 缩放 -------------------- */

  function applyScale(nextScale) {
    if (state.mode !== 'pdfjs' || !state.pdfDoc) return;
    var clamped = Math.min(Math.max(nextScale, CONFIG.minScale), CONFIG.maxScale);
    if (Math.abs(clamped - state.scale) < 0.001) return;
    state.scale = clamped;
    renderPage(state.pageNum).catch(function () { /* 取消的渲染忽略 */ });
  }

  function fitWidth() {
    if (state.mode !== 'pdfjs' || !state.pdfDoc) return;
    state.pdfDoc.getPage(state.pageNum).then(function (page) {
      var base = page.getViewport({ scale: 1 });
      var available = el.stage ? el.stage.clientWidth - 32 : 800;
      applyScale(Math.max(CONFIG.minScale, available / base.width));
    });
  }

  /* -------------------- 关键词搜索 -------------------- */

  /**
   * 从 startPage 起按 dir 方向逐页查找关键词，返回命中的页码（未找到为 null）。
   * 用 Promise 链而非同步递归，避免长文档栈溢出。
   */
  function findFrom(startPage, dir, keyword) {
    var cursor = startPage;

    function step() {
      if (cursor < 1 || cursor > state.pageCount) return Promise.resolve(null);
      var current = cursor;
      cursor += dir;
      return state.pdfDoc.getPage(current).then(function (page) {
        return page.getTextContent();
      }).then(function (textContent) {
        var text = textContent.items.map(function (item) {
          return item.str;
        }).join('');
        return text.toLowerCase().indexOf(keyword) >= 0 ? current : null;
      }).then(function (found) {
        return found !== null ? found : step();
      });
    }

    return step();
  }

  function runSearch(dir) {
    if (!el.searchInput || state.mode !== 'pdfjs' || !state.pdfDoc) return;
    var keyword = el.searchInput.value.trim().toLowerCase();
    if (!keyword) return;

    var start = dir > 0 ? state.pageNum + 1 : state.pageNum - 1;
    setStatus('正在搜索…');

    findFrom(start, dir, keyword).then(function (found) {
      if (found) {
        renderPage(found);
        setStatus('已定位到第 ' + found + ' 页');
      } else {
        setStatus('未找到「' + el.searchInput.value.trim() + '」', 'warn');
      }
    }).catch(function () {
      setStatus('搜索失败，请稍后重试', 'warn');
    });
  }

  /* -------------------- 侧边栏与事件 -------------------- */

  function setActiveNav(id) {
    var links = document.querySelectorAll('.description-nav a.nav-main-link');
    for (var i = 0; i < links.length; i++) {
      var href = (links[i].getAttribute('href') || '').replace('#', '');
      if (href === id) {
        links[i].classList.add('active');
        links[i].setAttribute('aria-current', 'page');
      } else {
        links[i].classList.remove('active');
        links[i].removeAttribute('aria-current');
      }
    }
  }

  function bindSidebar() {
    var links = document.querySelectorAll('.description-nav a.nav-main-link');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function (event) {
        var id = (this.getAttribute('href') || '').replace('#', '');
        if (!id) return;
        event.preventDefault();
        if (history && history.replaceState) {
          history.replaceState(null, '', '#' + id);
        }
        openDoc(id);
      });
    }
  }

  function bindToolbar() {
    if (!state.root) return;

    state.root.addEventListener('click', function (event) {
      var btn = event.target.closest ? event.target.closest('[data-action]') : null;
      if (!btn) return;
      var action = btn.getAttribute('data-action');
      event.preventDefault();

      if (action === 'prev') renderPage(state.pageNum - 1);
      else if (action === 'next') renderPage(state.pageNum + 1);
      else if (action === 'zoom-in') applyScale(state.scale + CONFIG.scaleStep);
      else if (action === 'zoom-out') applyScale(state.scale - CONFIG.scaleStep);
      else if (action === 'fit') fitWidth();
      else if (action === 'search-next') runSearch(1);
      else if (action === 'search-prev') runSearch(-1);
      else if (action === 'download' && state.current && state.current.src) {
        window.open(state.current.src, '_blank', 'noopener');
      }
    });

    if (el.pageInput) {
      el.pageInput.addEventListener('change', function () {
        var value = parseInt(el.pageInput.value, 10);
        if (isNaN(value)) { syncPageControls(); return; }
        renderPage(value);
      });
    }

    if (el.searchInput) {
      el.searchInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          runSearch(event.shiftKey ? -1 : 1);
        }
      });
    }
  }

  /* -------------------- 初始化 -------------------- */

  function init(options) {
    options = options || {};
    state.root = typeof options.root === 'string'
      ? document.querySelector(options.root)
      : options.root;
    if (!state.root) return;

    var data = window.LogPdfDocs || {};
    state.docs = data.docs || [];

    el.stage = byId('pdf-stage');
    el.status = byId('pdf-status');
    el.title = byId('pdf-doc-title');
    el.pageInput = byId('pdf-page-input');
    el.pageTotal = byId('pdf-page-total');
    el.searchInput = byId('pdf-search-input');
    el.prev = state.root.querySelector('[data-action="prev"]');
    el.next = state.root.querySelector('[data-action="next"]');
    el.zoomIn = state.root.querySelector('[data-action="zoom-in"]');
    el.zoomOut = state.root.querySelector('[data-action="zoom-out"]');
    el.fit = state.root.querySelector('[data-action="fit"]');
    el.download = state.root.querySelector('[data-action="download"]');

    bindSidebar();
    bindToolbar();

    // 支持 #hash 深链：刷新后仍停留在同一文档
    var initialId = (location.hash || '').replace('#', '') || data.defaultId || '';
    openDoc(initialId);
  }

  window.LogPdfViewer = {
    init: init,
    openDoc: openDoc
  };
})();
