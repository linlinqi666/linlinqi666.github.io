/**
 * media-reveal.js — 已停用隐藏逻辑（保留最小 shim）
 *
 * 历史：本脚本曾把「还没解码完」的正文图片瞬时置为 `opacity: 0`，解码完成后淡入。
 * 它的问题在于：**图片的可见性变成了一个需要被解开的条件**。只要请求被取消、
 * 挂住或者事件没派发到，那张图就永久透明——探索屏四只吉祥物「每次都两个透明」
 * 就是这条路径。
 *
 * 现在的约定：默认状态不隐藏任何图片，图片到货即显示；空间预留交给
 * `<img width height>`。本文件只做一件事：清掉历史 HTML / 旧缓存里可能残留的
 * `.media-reveal--pending` 类，避免它们被旧样式继续当作「未出现」。
 *
 * 与根站（Eleventy）static/js/components/media-reveal.js 保持同一份语义；
 * 根站的图片调度已由 image-pipeline.js 接管，flask 侧暂未迁移该组件。
 */
(function () {
  'use strict';

  function clearStale() {
    var stale = document.querySelectorAll('.media-reveal--pending');
    for (var i = 0; i < stale.length; i++) {
      stale[i].classList.remove('media-reveal--pending');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', clearStale, { once: true });
  } else {
    clearStale();
  }
})();
