/**
 * 通用正文小节收纳条（全站加载）
 * 2026-09-27 建立（由 pages/result-sections.js 泛化而来）；2026-10-07 增加展开/收起动画。
 *
 * 运行时把 `.content-card` 内带 id 的 h3 及其后续兄弟节点包成原生 `<details class="section-fold">`：
 * - 默认折叠，点击小节标题展开/收起，带「高度平滑 + 内容整体淡入」动画（展开与收起对称）；
 * - URL / 侧边栏锚点命中某小节时自动展开该收纳条（同样走动画，并在动画结束后校正滚动位置）；
 * - 展开/收起会调用 SidebarProgress.recalculate()（若页面加载了 sidebar-progress.js），
 *   否则侧边栏高亮依赖的章节偏移缓存会过时（强耦合，见 README §5.14.1）；
 * - 无 JS 时脚本不执行，内容保持原样全展开（渐进增强）；
 * - prefers-reduced-motion: reduce 时不做动画，行为与改造前逐帧一致。
 *
 * 约定（「规定的方式」，零配置接入）：
 * - 收纳单位是「带 id 的 h3」，id 命名遵循 `<页面前缀>-<语义>`（如 safety-kill-switch），
 *   与侧边栏 level3 链接 href 一一对应；
 * - 关闭整页折叠：<body data-section-fold="off">；
 * - 关闭整页动画：<body data-section-fold-anim="off">（单个收纳条用 data-fold-anim="off"）；
 * - 自定义折叠范围：给容器加 data-section-fold-root 属性（默认 .content-card）；
 * - 排除个别标题：给 h3 加 data-no-fold。
 *
 * 动画实现要点（改这里之前先读 README §5.14.1 的耦合说明）：
 * - 动画只作用在 `.section-fold__body` 一层：高度由 JS 写、内容整体淡入，只动 height/opacity；
 * - 点击 summary 时 preventDefault 拦下原生瞬开瞬收，由本脚本决定何时真正改 `details.open`，
 *   收起动画走完才把 open 置 false —— 因此原生语义、键盘与读屏行为不受影响；
 * - overflow:hidden 只在动画期间挂在 body 上，动画结束立即撤除，不影响内部 sticky/绝对定位；
 * - 快速连点、收起途中反悔都从「当前可见高度」接着走，不会跳回 0 或闪到全高。
 */
(function () {
  'use strict';

  var FOLD_CLASS = 'section-fold';
  var BODY_CLASS = FOLD_CLASS + '__body';
  var INNER_CLASS = FOLD_CLASS + '__inner';
  var ROOT_ATTR = 'data-section-fold-root';

  /* 动画参数只在 CSS 里改（--fold-dur-open / --fold-dur-close / --fold-ease），
     这里只是读不到变量时的兜底值。 */
  var FALLBACK_DUR = 300;
  var FALLBACK_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

  /* ---------- 参数与环境 ---------- */

  function parseMs(value, fallback) {
    var v = (value || '').trim();
    if (!v) return fallback;
    var n = parseFloat(v);
    if (isNaN(n)) return fallback;
    return /ms$/.test(v) ? n : Math.round(n * 1000);
  }

  function readCfg(el) {
    var cs = window.getComputedStyle(el);
    var open = parseMs(cs.getPropertyValue('--fold-dur-open'), FALLBACK_DUR);
    return {
      open: open,
      close: parseMs(cs.getPropertyValue('--fold-dur-close'), open),
      ease: (cs.getPropertyValue('--fold-ease') || '').trim() || FALLBACK_EASE
    };
  }

  function prefersReducedMotion() {
    var u = window.utils;
    if (u && typeof u.prefersReducedMotion === 'function') return u.prefersReducedMotion();
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function animEnabled(details) {
    if (details.getAttribute('data-fold-anim') === 'off') return false;
    if (document.body && document.body.getAttribute('data-section-fold-anim') === 'off') return false;
    return !prefersReducedMotion();
  }

  /** 展开/收起改变了小节高度分布，必须让侧边栏重建章节偏移缓存（README §5.14.1） */
  function recalc() {
    var sp = window.SidebarProgress;
    if (sp && typeof sp.recalculate === 'function') sp.recalculate();
  }

  function stateOf(details) {
    if (!details.__foldState) details.__foldState = { anim: null, closing: false, onDone: null };
    return details.__foldState;
  }

  function bodyOf(details) {
    var direct = details.querySelector(':scope > .' + BODY_CLASS)
      || details.querySelector(':scope > .content-body');
    if (direct) return direct;
    var kids = details.children;
    for (var i = 0; i < kids.length; i++) {
      if (kids[i].tagName !== 'SUMMARY') return kids[i];
    }
    return null;
  }

  function cancelAnim(st) {
    if (st.anim) {
      try { st.anim.cancel(); } catch (e) { /* 已结束，忽略 */ }
      st.anim = null;
    }
  }

  function clearInline(body) {
    body.style.height = '';
    body.style.overflow = '';
    body.style.opacity = '';
  }

  /* ---------- 展开 / 收起 ---------- */

  /**
   * 展开：高度 从当前可见高 → 自然高，内容 opacity 0 → 1。
   * @param {HTMLDetailsElement} details
   * @param {?Function} onDone 动画播完后回调（用于锚点定位校正）
   */
  function openFold(details, onDone) {
    var st = stateOf(details);
    var body = bodyOf(details);
    var cfg = readCfg(details);
    var fromH = 0;
    var fromO = 0;

    if (st.anim) { // 收起途中反悔：从当前可见高度接着开
      if (body) {
        fromH = Math.max(0, body.getBoundingClientRect().height);
        fromO = parseFloat(window.getComputedStyle(body).opacity);
        if (isNaN(fromO)) fromO = 1;
      }
      cancelAnim(st);
    }

    details.open = true;
    st.closing = false;
    st.onDone = typeof onDone === 'function' ? onDone : null;
    if (!body) { recalc(); return; }

    clearInline(body);
    var toH = Math.max(0, body.getBoundingClientRect().height); // 自然高（内层 padding 计入内层高度）
    var from = Math.max(0, Math.min(fromH, toH));
    body.style.overflow = 'hidden';

    var anim = body.animate(
      [
        { height: from + 'px', opacity: from <= 0 ? 0 : fromO },
        { height: toH + 'px', opacity: 1 }
      ],
      { duration: cfg.open, easing: cfg.ease, fill: 'both' }
    );
    st.anim = anim;
    anim.finished.then(function () {
      if (st.anim !== anim) return; // 已被新一轮动画接管
      anim.cancel();
      st.anim = null;
      clearInline(body);
      var cb = st.onDone;
      st.onDone = null;
      recalc();
      if (cb) cb();
    }).catch(function () { /* 被 cancel：交给新一轮动画收尾 */ });
  }

  /** 收起：高度 自然高 → 0，内容 opacity 1 → 0；播完才真正 open=false */
  function closeFold(details) {
    var st = stateOf(details);
    var body = bodyOf(details);
    var cfg = readCfg(details);
    st.onDone = null;

    if (!body) {
      cancelAnim(st);
      details.open = false;
      recalc();
      return;
    }

    var fromH = Math.max(0, body.getBoundingClientRect().height);
    var fromO = parseFloat(window.getComputedStyle(body).opacity);
    if (isNaN(fromO)) fromO = 1;
    cancelAnim(st);
    clearInline(body);
    // 先钉住起点高，撤销上一轮 fill 时不会闪到自然高
    body.style.height = fromH + 'px';
    body.style.overflow = 'hidden';
    st.closing = true;

    var anim = body.animate(
      [
        { height: fromH + 'px', opacity: fromO },
        { height: '0px', opacity: 0 }
      ],
      { duration: cfg.close, easing: cfg.ease, fill: 'both' }
    );
    st.anim = anim;
    anim.finished.then(function () {
      if (st.anim !== anim) return;
      anim.cancel();
      st.anim = null;
      clearInline(body);
      st.closing = false;
      details.open = false;
      recalc();
    }).catch(function () { /* 被 cancel：新一轮动画接管 */ });
  }

  /* ---------- 结构生成 ---------- */

  function buildShell() {
    var details = document.createElement('details');
    details.className = FOLD_CLASS;
    var summary = document.createElement('summary');
    var body = document.createElement('div');
    body.className = BODY_CLASS;
    var inner = document.createElement('div');
    inner.className = INNER_CLASS;
    body.appendChild(inner);
    details.appendChild(summary);
    details.appendChild(body);
    return { details: details, summary: summary, inner: inner };
  }

  function bind(details) {
    var summary = details.querySelector(':scope > summary') || details.querySelector('summary');
    if (!summary) return;

    summary.addEventListener('click', function (ev) {
      if (ev.defaultPrevented) return;
      // summary 内含链接/表单控件时交回浏览器，不当折叠开关用
      if (ev.target && ev.target.closest
        && ev.target.closest('a, button, input, select, textarea, label')) return;
      if (!animEnabled(details)) return; // 关动画：走原生瞬开瞬收

      ev.preventDefault(); // 拦下原生切换，改由动画决定 details.open 的时机
      var st = stateOf(details);
      var isOpen = details.open && !st.closing;
      if (isOpen) closeFold(details); else openFold(details);
    });

    details.addEventListener('toggle', function () {
      stateOf(details).closing = false;
      recalc();
    });
  }

  /**
   * 把卡内某个带 id 的 h3 与其后续内容包成收纳条。
   * @param {HTMLElement} h3 - 小节标题（含锚点 id）
   */
  function foldSection(h3) {
    // 幂等：已在收纳条内则跳过
    if (h3.closest && h3.closest('details.' + FOLD_CLASS)) return;

    var shell = buildShell();

    // 收集 h3 之后的兄弟节点，直到下一个 h2/h3 或卡尾
    var node = h3.nextSibling;
    while (node) {
      var next = node.nextSibling;
      if (node.nodeType === 1) {
        if (node.tagName === 'H2' || node.tagName === 'H3') break;
        if (node.hasAttribute && node.hasAttribute('data-fold-stop')) break;
      }
      shell.inner.appendChild(node);
      node = next;
    }

    h3.parentNode.insertBefore(shell.details, h3);
    shell.summary.appendChild(h3); // h3 连同 id 一并移入 summary，锚点不受影响
    bind(shell.details);
  }

  /**
   * 整卡折叠：把带 data-fold-card 的卡片内的 .content-body 包成收纳条，卡片标题 h2 留在 summary 内。
   * 用于 contribution 这类「一条内容一张卡、正文由数据渲染、锚点在卡片 div 上」的页面。
   * @param {HTMLElement} card - 带 data-fold-card 的 .content-card
   */
  function foldCardBody(card) {
    if (card.querySelector('details.' + FOLD_CLASS)) return;
    var h2 = card.querySelector('h2');
    var content = card.querySelector('.content-body');
    if (!h2 || !content) return;

    var shell = buildShell();
    shell.summary.appendChild(h2);
    shell.inner.appendChild(content);
    card.appendChild(shell.details);
    bind(shell.details);
  }

  /**
   * 锚点命中某小节（或某张折叠卡）时展开对应收纳条。
   */
  function expandForHash() {
    var hash = window.location.hash.slice(1);
    if (!hash) return;
    var el = document.getElementById(hash);
    if (!el) return;
    // 小节锚点：目标在收纳条内部；整卡锚点：收纳条在目标（卡片 div）内部
    var fold = el.closest ? el.closest('details.' + FOLD_CLASS) : null;
    if (!fold && el.querySelector) fold = el.querySelector('details.' + FOLD_CLASS);
    if (!fold || fold.open) return;

    if (!animEnabled(fold)) {
      fold.open = true;
      window.requestAnimationFrame(function () { el.scrollIntoView(); });
      return;
    }

    window.requestAnimationFrame(function () { el.scrollIntoView(); });
    // 展开会顶动上方内容，动画结束后再校正一次落点
    openFold(fold, function () { el.scrollIntoView(); });
  }

  function init() {
    if (document.body && document.body.getAttribute('data-section-fold') === 'off') return;

    var roots = document.querySelectorAll('[' + ROOT_ATTR + '], .content-card');
    Array.prototype.forEach.call(roots, function (card) {
      var titles = Array.prototype.slice.call(card.querySelectorAll('h3[id]:not([data-no-fold])'));
      titles.forEach(foldSection);
    });

    // 整卡折叠（data-fold-card）：摘要 + 正文的卡片整体收起，锚点保留在卡片 div 上
    Array.prototype.forEach.call(document.querySelectorAll('[data-fold-card]'), foldCardBody);

    window.addEventListener('hashchange', expandForHash);
    expandForHash();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
