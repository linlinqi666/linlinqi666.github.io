/**
 * 图片到达动画（全站加载，2026-10-07）
 *
 * 解决两件事：
 * 1) 「加载时页面跳」—— 交给 HTML：图片写 width/height，浏览器在加载前就按比例预留空间
 *    （本脚本不碰布局，尺寸完全由属性 + 既有 CSS 决定）；
 * 2) 「图片啪地出现」—— 交给本脚本：尚未解码完成的正文图片先瞬时置为 opacity 0，
 *    解码完成（load）后淡入；已在缓存/已解码的图片不参与，避免"闪一下"。
 *
 * 边界（改之前先读 README §5.14.2 与第八节约束）：
 * - 只处理 <main> 内的 <img>：导航、页脚、加载遮罩（page-loader）、返回顶部等
 *   已有自己动画体系的组件一律不掺和；
 * - data-no-reveal（加在 img 自身或任意祖先上）可让该区域退出；
 * - prefers-reduced-motion: reduce 时整个脚本不生效，图片直接显示；
 * - 脚本 404 / 被拦截时页面照常（CSS 默认不隐藏任何图片）；
 * - 数据驱动页（members 等）中途插入的图片由 MutationObserver 兜住，
 *   window.load 后 + 3s 宽限即停止观察，不在滚动期常驻。
 */
(function () {
  'use strict';

  var CLS = 'media-reveal';
  var PENDING = CLS + '--pending';
  var GRACE_MS = 3000;

  function prefersReducedMotion() {
    var u = window.utils;
    if (u && typeof u.prefersReducedMotion === 'function') return u.prefersReducedMotion();
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function eligible(img) {
    if (!img || img.tagName !== 'IMG') return false;
    if (img.hasAttribute('data-no-reveal')) return false;
    if (img.closest && img.closest('[data-no-reveal]')) return false;
    if (!img.closest || !img.closest('main')) return false;
    return true;
  }

  /** 把一张「还没解码完」的图片置为待出现，解码完成后淡入 */
  function arm(img) {
    if (!eligible(img)) return;
    if (img.classList.contains(PENDING)) return;
    // 已解码完成（含缓存命中）的图片直接跳过：闪一下比直接显示更糟
    if (img.complete && img.naturalWidth > 0) return;

    img.classList.add(CLS, PENDING);

    function done() {
      img.removeEventListener('load', done);
      img.removeEventListener('error', done);
      img.classList.remove(PENDING);
    }
    img.addEventListener('load', done);
    // 破图（CDN 未上传 / 403 / 路径错）也要显示，不能因为等不到 load 而永久隐身
    img.addEventListener('error', done);
  }

  function armAll(root) {
    var scope = root || document;
    var imgs = scope.querySelectorAll ? scope.querySelectorAll('main img') : [];
    Array.prototype.forEach.call(imgs, arm);
  }

  function init() {
    if (prefersReducedMotion()) return; // 降级：什么都不做，图片全部直接可见
    armAll(document);

    // 数据驱动页会在 DOMContentLoaded 之后插入图片；只在加载窗口内观察，随后断开
    if (window.MutationObserver) {
      var observer = new MutationObserver(function (records) {
        for (var i = 0; i < records.length; i++) {
          var added = records[i].addedNodes;
          for (var j = 0; j < added.length; j++) {
            var node = added[j];
            if (node.nodeType !== 1) continue;
            if (node.tagName === 'IMG') arm(node);
            else if (node.querySelectorAll) armAll(node);
          }
        }
      });
      observer.observe(document.body || document.documentElement, { childList: true, subtree: true });

      var stop = function () { window.setTimeout(function () { observer.disconnect(); }, GRACE_MS); };
      if (document.readyState === 'complete') stop();
      else window.addEventListener('load', stop, { once: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
