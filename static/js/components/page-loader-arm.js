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
  } catch (e) { /* 忽略：无论如何都不能阻塞页面 */ }
})();
