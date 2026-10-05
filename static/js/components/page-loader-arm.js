/* page-loader-arm.js — 必须在 <head> 内以同步（非 defer）方式执行，先于 <body> 渲染。
 *
 * 作用：给 <html> 打上 .page-loader-armed —— 首屏即显示加载遮罩并锁定滚动，
 *       避免原生内容/半成品布局闪现（FOUC）。
 *
 * 看门狗：即便控制器 page-loader.js 缺失、404 或抛错，也会在 MAX_WAIT 后
 *         强制放开页面，保证遮罩绝不永久阻塞。
 * 降级：JS 禁用时本脚本不执行、不产生 armed 类，页面按原生方式正常显示。
 */
(function () {
  var root = document.documentElement;
  var MAX_WAIT = 8000;
  try {
    root.classList.add('page-loader-armed');
    setTimeout(function () {
      root.classList.remove('page-loader-armed');
      root.classList.add('page-loader-done');
      setTimeout(function () { root.classList.remove('page-loader-done'); }, 420);
    }, MAX_WAIT);

    /* 2026-10-04：head 阶段同步预取两帧加载图 —— 原先等 DOMContentLoaded 才预载，
       弱网下遮罩全程只剩 Loading 文字；现借助 currentScript 反推站点根路径，
       预载的 Image 挂到 window.__pageLoaderFrames 供 page-loader.js 复用。 */
    var script = document.currentScript;
    if (script && script.src) {
      var base = script.src.replace(/static\/js\/components\/page-loader-arm\.js.*$/, '');
      window.__pageLoaderFrames = [1, 2].map(function (n) {
        var img = new Image();
        img.src = base + 'static/image/any-icon/loader/transparent/loader-frame-' + n + '.png';
        return img;
      });
    }
  } catch (e) { /* 忽略：无论如何都不能阻塞页面 */ }
})();
