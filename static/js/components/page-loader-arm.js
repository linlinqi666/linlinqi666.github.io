/* page-loader-arm.js — 必须在 <head> 内以同步（非 defer）方式执行，先于 <body> 渲染。
 *
 * 作用：给 <html> 打上 .page-loader-armed —— 首屏即显示加载遮罩并锁定滚动，
 *       避免原生内容/半成品布局闪现（FOUC）。
 *
 * 看门狗：仅在「控制器缺失」时兜底放行——defer 脚本已执行完
 *         （readyState 离开 'loading'）但 window.PageLoader 不存在
 *          （page-loader.js 404 / 抛错），或硬上限 HARD_CAP（20s）到点。
 *         2026-10-16：原实现固定 8s 无条件摘遮罩，有两个后果：
 *         (a) 弱网下脚本还在下载就把页面放出来，用户翻页看到的是
 *             「静态年值 + 无动画三方法」的脚本降级态；
 *         (b) 与 page-loader.js 自己的门控（等 GIF / 最短展示）打架，
 *             遮罩被提前摘掉，开场动画还没开始首页就先闪一下。
 *         现在控制器在场时完全由它决定收尾时机（其自身 MAX_WAIT=12s 兜底）。
 * 降级：JS 禁用时本脚本不执行、不产生 armed 类，页面按原生方式正常显示。
 */
(function () {
  var root = document.documentElement;
  var POLL = 250;
  var HARD_CAP = 30000;
  try {
    root.classList.add('page-loader-armed');
    var startedAt = Date.now();
    /* 所有 <script src> 请求是否已结清（加载成功或失败都算结清）。
       用 Resource Timing 判定，不能只看 readyState：解析器被 head 同步脚本
       挡住时，文档「解析完成」会把 readyState 推到 interactive，但 body 末尾
       的 defer 脚本可能还在网络队列里排队（弱网实测 50KB/s 下排队 44s）。
       此时若放行，用户翻页看到的就是无脚本的静态降级页。 */
    function allScriptsSettled() {
      var loaded = {};
      var entries = performance.getEntriesByType('resource');
      for (var i = 0; i < entries.length; i++) loaded[entries[i].name] = true;
      var scripts = document.querySelectorAll('script[src]');
      for (var j = 0; j < scripts.length; j++) {
        if (!loaded[scripts[j].src]) return false;
      }
      return true;
    }
    (function watchdog() {
      var expired = (Date.now() - startedAt) >= HARD_CAP;
      // parserDone：解析器已走完文档（body 末尾的 script 标签已进 DOM）。
      // 只有它 + 全部脚本请求结清，才认为「脚本世界已定」——缺 parserDone 时
      // script 标签还没出现，allScriptsSettled 会误判为 true 而立刻放行。
      var parserDone = document.readyState !== 'loading';
      // 控制器（page-loader.js）在场时完全由它决定收尾（其自身 MAX_WAIT=12s 兜底）；
      // 控制器缺失时，等到全部脚本请求结清再放行——结清后页面脚本要么已跑起来，
      // 要么确实加载失败（404 很快结清，不会干等）。
      if (expired || (!window.PageLoader && parserDone && allScriptsSettled())) {
        root.classList.remove('page-loader-armed');
        root.classList.add('page-loader-done');
        setTimeout(function () { root.classList.remove('page-loader-done'); }, 420);
        return;
      }
      setTimeout(watchdog, POLL);
    }());

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
