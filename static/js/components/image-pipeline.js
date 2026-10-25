/**
 * image-pipeline.js — 全站图片分级调度（唯一入口）
 *
 * 为什么需要它
 * ------------
 * 之前每屏各自用一套脚本量尺寸/等图片（statistics 的 measureWhenReady、pager 的
 * 自建轨道、media-reveal 的解码淡入、page-loader 的关键图闸门），彼此不知道对方在等
 * 什么，共同点是「先隐藏，条件满足再显示」——任何一环没解开就是永久空白或永久阻塞。
 *
 * 这里改成三条互不干扰的通道，图片「永远不靠 JS 隐藏」：
 *
 *   l0  进页必须可见的那一屏的图：由 page-loader 等 decode 完成才放行（有硬上限）。
 *   l1  当前屏之后两屏内的图：进页后按「离当前屏的距离」由近及远预取，
 *       换屏时重排队列；到屏时字节已在缓存里，decode 后即可见。
 *   l2  其余：交给原生 loading="lazy"，本脚本完全不介入。
 *
 * 分层写在模板上（data-tier="l0|l1|l2"），运行时不猜、不量、不逐屏打补丁。
 * 没有 data-tier 的图按 l2 处理，所以改造可以逐页推进，不会因为漏标而回归。
 *
 * 就绪判据用 decode() 而不是 load：load 只代表字节到齐，解码还没发生，用户看到的是
 * 空白；decode() 返回时才真的能画。跨域图片在无 CORS 时 decode() 可能 reject，
 * 一律 catch 后按「字节已到」放行，绝不等死。
 *
 * 对外接口（调试与验收用）：
 *   window.ImagePipeline.report()       诊断数据（进页耗时 / 各层统计 / 各屏到屏未就绪）
 *   window.ImagePipeline.ready(id)      某屏的图是否全部可绘制
 *   window.ImagePipeline.prefetchTier(t)手动触发某层预取
 */
(function () {
  'use strict';

  var TIER_ATTR = 'data-tier';
  var CORE_SEL = '.presentation-section';
  var MAX_CONCURRENT = 4;      // 预取并发上限：避免把带宽全占掉，反过来拖慢 l0
  var HORIZON = 2;             // 预取视野：当前屏之后 2 屏
  var IDLE_TIMEOUT = 300;      // requestIdleCallback 兜底超时

  var state = {
    started: false,
    l0Settled: false,
    entryMs: null,
    sections: [],              // [{ el, id, index, imgs: [] }]
    queue: [],                 // 待预取 URL（按距离排序）
    inflight: 0,
    seen: {},                  // url -> true，避免重复入队
    readyByUrl: {},            // url -> true（已 decode 或字节已到）
    pendingSince: {},          // url -> performance.now()
    arrival: {},               // sectionId -> { at, notReady: [] }
    tiers: { prefetchMs: [] }, // 预取耗时样本（诊断用）
    lastIndex: -1
  };

  /* ---------------- 基础工具 ---------------- */

  function now() {
    return (window.performance && performance.now) ? performance.now() : Date.now();
  }

  function idle(fn) {
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(fn, { timeout: IDLE_TIMEOUT });
    } else {
      setTimeout(fn, 60);
    }
  }

  function saveData() {
    var c = navigator.connection;
    return !!(c && (c.saveData || /2g/.test(c.effectiveType || '')));
  }

  function urlOf(img) {
    return img.currentSrc || img.getAttribute('src') || '';
  }

  function tierOf(img) {
    var t = img.getAttribute(TIER_ATTR);
    return (t === 'l0' || t === 'l1' || t === 'l2') ? t : 'l2';
  }

  /**
   * 图片可绘制即 resolve。decode() 是「真的能画」，load 只是「字节到了」；
   * 失败/不支持一律 resolve(true) —— 宁可让它以破图形态出现，也不能把流程吊死。
   */
  function whenDecoded(img) {
    return new Promise(function (resolve) {
      var settled = false;
      function done() {
        if (settled) return;
        settled = true;
        resolve(true);
      }
      function decodeNow() {
        if (typeof img.decode === 'function') {
          img.decode().then(done, done);
        } else {
          done();
        }
      }
      if (img.complete && img.naturalWidth > 0) {
        decodeNow();
        return;
      }
      img.addEventListener('load', decodeNow, { once: true });
      img.addEventListener('error', done, { once: true });
    });
  }

  /* ---------------- 预取队列 ---------------- */

  function prefetch(url) {
    if (!url || state.seen[url] || state.readyByUrl[url]) return;
    state.seen[url] = true;
    state.pendingSince[url] = now();
    state.queue.push(url);
    tick();
  }

  function tick() {
    while (state.inflight < MAX_CONCURRENT && state.queue.length) {
      run(state.queue.shift());
    }
  }

  function run(url) {
    state.inflight += 1;
    var img = new Image();
    img.decoding = 'async';
    var finish = function () {
      state.inflight -= 1;
      state.readyByUrl[url] = true;
      var started = state.pendingSince[url];
      if (started) state.tiers.prefetchMs.push(Math.round(now() - started));
      tick();
    };
    img.onload = function () {
      // 预取的元素已解码过一次，真实 <img> 仍会各自 decode，但字节一定在缓存里
      if (typeof img.decode === 'function') img.decode().then(finish, finish);
      else finish();
    };
    img.onerror = finish;
    img.src = url;
  }

  /* ---------------- 分屏索引 ---------------- */

  function buildIndex() {
    var seenSection = [];
    var sections = [];
    var imgs = document.querySelectorAll('main img, .presentation-section img');

    Array.prototype.forEach.call(imgs, function (img) {
      var sec = img.closest(CORE_SEL);
      var entry = null;
      if (sec) {
        for (var i = 0; i < sections.length; i++) {
          if (sections[i].el === sec) { entry = sections[i]; break; }
        }
        if (!entry) {
          entry = { el: sec, id: sec.id || ('sec-' + sections.length), index: sections.length, imgs: [] };
          sections.push(entry);
          seenSection.push(sec);
        }
      } else {
        // 长文页没有分屏：整个文档当一屏，预取交给原生 lazy
        if (!sections.length) {
          entry = { el: document.body, id: 'document', index: 0, imgs: [] };
          sections.push(entry);
        }
        entry = sections[0];
      }
      entry.imgs.push({ el: img, url: urlOf(img), tier: tierOf(img) });
    });

    state.sections = sections;
  }

  function currentIndex() {
    var best = 0;
    var bestRatio = -1;
    var vh = window.innerHeight || 1;
    for (var i = 0; i < state.sections.length; i++) {
      var r = state.sections[i].el.getBoundingClientRect();
      var visible = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      var ratio = visible / Math.max(Math.min(r.height, vh), 1);
      if (ratio > bestRatio) { bestRatio = ratio; best = i; }
    }
    return best;
  }

  /* ---------------- 调度 ---------------- */

  function prefetchAround(index) {
    if (!state.l0Settled) return;   // l0 没结清前不抢带宽
    if (saveData()) return;

    var jobs = [];
    for (var d = 0; d <= HORIZON; d++) {
      [index + d, index - d].forEach(function (i) {
        if (i < 0 || i >= state.sections.length || (d > 0 && i === index)) return;
        var sec = state.sections[i];
        sec.imgs.forEach(function (item) {
          if (item.tier === 'l0' || item.tier === 'l2') return;
          if (d === 0 && inViewport(item.el)) return;  // 当前屏的图浏览器已在加载
          jobs.push({ url: item.url, d: d });
        });
      });
    }

    jobs.sort(function (a, b) { return a.d - b.d; });

    // 换屏时丢弃队列里超出视野的旧任务，避免越积越多
    state.queue.length = 0;
    jobs.forEach(function (job) { prefetch(job.url); });
  }

  function inViewport(el) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || 1;
    return r.bottom > -vh * 0.25 && r.top < vh * 1.25;
  }

  function markArrival(index) {
    var sec = state.sections[index];
    if (!sec) return;
    if (state.arrival[sec.id]) return;
    var notReady = [];
    sec.imgs.forEach(function (item) {
      if (!(item.el.complete && item.el.naturalWidth > 0) && !state.readyByUrl[item.url]) {
        notReady.push(item.url);
      }
    });
    state.arrival[sec.id] = { at: Math.round(now()), notReady: notReady };
  }

  function refresh() {
    var idx = currentIndex();
    markArrival(idx);
    prefetchAround(idx);
  }

  /* ---------------- 进页交接 ---------------- */

  function releaseL0() {
    if (state.l0Settled) return;
    state.l0Settled = true;
    state.entryMs = Math.round(now());
    idle(refresh);
  }

  function start() {
    if (state.started) return;
    state.started = true;
    state.tiers = { prefetchMs: [] };
    buildIndex();

    // page-loader 收尾（或根本没有 l0）后，才开始预取，避免抢首屏带宽
    if (window.PageLoader && typeof window.PageLoader.done === 'function') {
      window.PageLoader.done(releaseL0);
    } else {
      document.addEventListener('pageloader:done', releaseL0, { once: true });
      setTimeout(releaseL0, 6000);   // 加载器缺失/事件丢失的兜底
    }

    var onScroll = throttle(function () {
      if (!state.l0Settled) return;
      var idx = currentIndex();
      if (idx !== state.lastIndex) {
        state.lastIndex = idx;
        markArrival(idx);
        prefetchAround(idx);
      }
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', throttle(refresh, 250));
    setTimeout(refresh, 400);
  }

  function throttle(fn, wait) {
    var last = 0;
    var timer = 0;
    return function () {
      var t = now();
      if (t - last >= (wait || 120)) {
        last = t;
        fn();
      } else {
        clearTimeout(timer);
        timer = setTimeout(function () { last = now(); fn(); }, (wait || 120));
      }
    };
  }

  /* ---------------- 对外接口 ---------------- */

  window.ImagePipeline = {
    report: function () {
      var screens = state.sections.map(function (sec) {
        var a = state.arrival[sec.id];
        return {
          id: sec.id,
          images: sec.imgs.length,
          arrivedAt: a ? a.at : null,
          notReady: a ? a.notReady.length : null,
          notReadyUrls: a ? a.notReady.slice(0, 6) : []
        };
      });
      var pref = state.tiers ? state.tiers.prefetchMs : [];
      var sum = pref.reduce(function (a, b) { return a + b; }, 0);
      return {
        entryMs: state.entryMs,
        l0Settled: state.l0Settled,
        prefetched: pref.length,
        prefetchAvgMs: pref.length ? Math.round(sum / pref.length) : null,
        screens: screens,
        /* 统计口径只算真正的分屏：长文页/页脚那批图归在 id='document' 的伪分屏里，
           它们由原生 lazy 负责，计进来只会制造噪声。 */
        notReadyTotal: screens.reduce(function (n, s) {
          return s.id === 'document' ? n : n + (s.notReady || 0);
        }, 0)
      };
    },
    ready: function (sectionId) {
      var sec = null;
      for (var i = 0; i < state.sections.length; i++) {
        if (state.sections[i].id === sectionId) { sec = state.sections[i]; break; }
      }
      if (!sec) return null;
      return sec.imgs.every(function (item) {
        return (item.el.complete && item.el.naturalWidth > 0) || state.readyByUrl[item.url];
      });
    },
    prefetchTier: function (tier) {
      state.sections.forEach(function (sec) {
        sec.imgs.forEach(function (item) { if (item.tier === tier) prefetch(item.url); });
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
