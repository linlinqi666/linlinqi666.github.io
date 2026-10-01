/**
 * 通用正文小节收纳条（全站加载）
 *
 * 运行时把 `.content-card` 内带 id 的 h3 及其后续兄弟节点包成原生 `<details class="section-fold">`：
 * - 默认折叠，点击小节标题展开；
 * - URL / 侧边栏锚点命中某小节时自动展开该收纳条；
 * - 展开/收起会调用 SidebarProgress.recalculate()（若页面加载了 sidebar-progress.js），
 *   否则侧边栏高亮依赖的章节偏移缓存会过时（强耦合，见 README §5.14.1）；
 * - 无 JS 时脚本不执行，内容保持原样全展开（渐进增强）。
 *
 * 约定：
 * - 收纳单位是「带 id 的 h3」，id 命名遵循 `<页面前缀>-<语义>`（如 safety-kill-switch），
 *   与侧边栏 level3 链接 href 一一对应；
 * - 关闭整页折叠：<body data-section-fold="off">；
 * - 自定义折叠范围：给容器加 data-section-fold-root 属性（默认 .content-card）；
 * - 排除个别标题：给 h3 加 data-no-fold。
 */
(function () {
  'use strict';

  var FOLD_CLASS = 'section-fold';
  var ROOT_ATTR = 'data-section-fold-root';

  /**
   * 把卡内某个带 id 的 h3 与其后续内容包成收纳条。
   * @param {HTMLElement} h3 - 小节标题（含锚点 id）
   */
  function foldSection(h3) {
    // 幂等：已在收纳条内则跳过
    if (h3.closest && h3.closest('details.' + FOLD_CLASS)) return;

    var details = document.createElement('details');
    details.className = FOLD_CLASS;
    var summary = document.createElement('summary');
    var body = document.createElement('div');
    body.className = FOLD_CLASS + '__body';

    // 收集 h3 之后的兄弟节点，直到下一个 h2/h3 或卡尾
    var node = h3.nextSibling;
    while (node) {
      var next = node.nextSibling;
      if (node.nodeType === 1) {
        if (node.tagName === 'H2' || node.tagName === 'H3') break;
        if (node.hasAttribute && node.hasAttribute('data-fold-stop')) break;
      }
      body.appendChild(node);
      node = next;
    }

    h3.parentNode.insertBefore(details, h3);
    summary.appendChild(h3); // h3 连同 id 一并移入 summary，锚点不受影响
    details.appendChild(summary);
    details.appendChild(body);

    // 展开/收起会改变页面布局，必须让侧边栏重建章节偏移缓存，否则高亮错乱
    details.addEventListener('toggle', function () {
      var sp = window.SidebarProgress;
      if (sp && typeof sp.recalculate === 'function') sp.recalculate();
    });
  }

  /**
   * 整卡折叠：把带 data-fold-card 的卡片内的 .content-body 包成收纳条，卡片标题 h2 留在 summary 内。
   * 用于 contribution 这类「一条内容一张卡、正文由数据渲染、锚点在卡片 div 上」的页面。
   * @param {HTMLElement} card - 带 data-fold-card 的 .content-card
   */
  function foldCardBody(card) {
    if (card.querySelector('details.' + FOLD_CLASS)) return;
    var h2 = card.querySelector('h2');
    var body = card.querySelector('.content-body');
    if (!h2 || !body) return;

    var details = document.createElement('details');
    details.className = FOLD_CLASS;
    var summary = document.createElement('summary');
    summary.appendChild(h2);
    details.appendChild(summary);
    details.appendChild(body);
    card.appendChild(details);

    details.addEventListener('toggle', function () {
      var sp = window.SidebarProgress;
      if (sp && typeof sp.recalculate === 'function') sp.recalculate();
    });
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
    if (fold && !fold.open) {
      fold.open = true;
      window.requestAnimationFrame(function () { el.scrollIntoView(); });
    }
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
