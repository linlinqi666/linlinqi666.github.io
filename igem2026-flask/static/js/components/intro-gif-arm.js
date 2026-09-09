/**
 * intro-gif-arm.js
 * 首页 GIF 开场动画的「预绘制 arm」脚本（与根站 src/_includes/head-extra/index.njk 同款）。
 *
 * 为什么需要它：GIF 开场要占满首屏并锁滚动、隐藏导航，必须在 <body> 渲染（首帧绘制）之前
 * 就给 <html> 打上 intro-gif-armed，否则导航栏会先闪现再被隐藏。组件本身的
 * index-intro-gif.js 以 defer 加载（DOM 解析后才执行），来不及在首帧前上锁，故这里用
 * 一个无 defer 的极小 vendored 脚本在 <head> 内同步执行（不引第三方 CDN，符合 flask 规则）。
 *
 * 触发条件：仅首页(/) + 站外/直接访问（referrer 非同源）+ 非 prefers-reduced-motion 时播放；
 * 站内跳转不重复播放；6s 看门狗兜底：若组件脚本未启动，强制解除锁定恢复导航。
 */
(function () {
  try {
    var p = location.pathname;
    if (p !== '/' && p !== '' && p !== '/index.html') return;

    var root = document.documentElement;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // 仅从站外（或空 referrer 的直接访问）进入时才播放开场动画；
    // 站内跳转（referrer 与本站同源）不重复触发，导航栏与滚动保持原样。
    var isExternal = true;
    var ref = document.referrer;
    if (ref) {
      try {
        isExternal = new URL(ref).origin !== location.origin;
      } catch (e) {
        isExternal = true;
      }
    }
    if (!isExternal) return;

    root.classList.add('intro-gif-armed');
    setTimeout(function () {
      if (!root.classList.contains('intro-gif-running')) {
        root.classList.add('intro-gif-finished');
      }
    }, 6000);
  } catch (e) { /* 降级：保持导航栏可见 */ }
})();
