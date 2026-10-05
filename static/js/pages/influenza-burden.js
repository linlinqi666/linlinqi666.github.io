/**
 * ============================================
 * iGEM SZPU-2026 - 首页 influenza-burden 屏「1 in 12」数据沉浸屏
 * ============================================
 *
 * @description
 *   v2（2026-10-03 重做，用户反馈 v1「只有开场那一下，之后什么都不动了」）：
 *   主体改为**实时感染计数器**——按 WHO 口径（每年约 10 亿例季节性流感 × 甲型占阳性 66%
 *   ≈ 6.6 亿/年）折合**每秒约 21 人感染甲流**；从页面打开那刻起数字持续跳动，
 *   读者停留的每一秒都在涨。另有一条「秒节拍」轨道：光点每秒扫一趟 = 约 21 人。
 *   这两者是本屏"持续抓住视觉"的核心，入场动画只负责第一次亮相。
 *
 *   播放顺序（进入该屏才播，每次加载只播一次）：
 *     eyebrow → 「1 in 12」弹出 → 句子右先左后逐词下落 → 12 席位错峰铺开（1 格亮蓝）
 *     → 计数器整块升起并开始实时跳动 → 秒节拍光点启动 → 三年占比表推进 → 注脚淡入。
 *
 * 工程质量约定（与 statistics-reveal.js / dbtl-pump.js 同一套）：
 *   - 降级红线：reduced-motion / 无 IO / 无 WAAPI → 完全不接管，标记里的静态年值
 *     （660,000,000 people catch influenza A / year）保持可见——无 JS 环境读到的
 *     必须是这句话，而不是一个停住的 0；
 *   - 隐藏态只由本脚本加类（.js-burden-armed）：默认 CSS 不做隐藏；
 *   - 逐段 WAAPI 一律 fill:'both'（用 backwards 会在动画结束到收尾之间回落到隐藏态，
 *     造成"到位后消失一下"的闪没——statistics 屏已踩过）；
 *   - 只动 transform / opacity，布局数值全在 CSS 百分比里；
 *   - 实时计数器：单一 rAF 循环 + 仅在整数变化时写 DOM；离屏 / 标签页隐藏时停表，
 *     恢复后按统一的起始时间戳补算（不累积漂移）；
 *   - 跳动的数字对读屏器 aria-hidden，旁边另有静态的无障碍句子说明速率。
 *
 * ⚠ 离屏判定（本屏特有坑，2026-10-03 实测）：
 *   本站首页是 scroll-snap 满屏分屏，相邻屏滚出后**顶边恰好贴住视口底边**。此时
 *   IntersectionObserver 的 isIntersecting 恒为 true（规范把边界相切也算相交），
 *   且 ratio 从 >0 变成 0 时 Chromium **不再派发回调**——纯 IO 无法感知离屏，
 *   计数器会在读者看不到的地方一直空转。因此：IO 只负责入场触发；
 *   计数循环内部每隔 ~400ms 用 getBoundingClientRect 自检一次真可见性，
 *   并用 passive scroll 监听负责"滚回来就复工"。
 *
 * 依赖：window.iGEMUtils（core/utils.js）；缺失时回退到 window.matchMedia。
 */
(function () {
  'use strict';

  var STAGE = '.art-stage--influenza-burden';
  var ARMED = 'js-burden-armed';
  var DONE = 'burden-done';
  var LIVE = 'burden-counter--live';

  /** ==== 数据口径（改这里就能改速率；必须与 index.njk 的注脚口径一致）==== */
  var YEARLY_INFECTIONS = 660000000;                 // 每年甲型流感感染人数（估算）
  var SECONDS_PER_YEAR = 365.25 * 24 * 60 * 60;
  var RATE_PER_SECOND = YEARLY_INFECTIONS / SECONDS_PER_YEAR;   // ≈ 20.91 人/秒

  /** ==== 入场时间轴参数（调参入口，单位 ms）==== */
  var T = {
    eyebrowAt: 0,
    eyebrowDur: 420,
    numAt: 120,
    numDur: 560,
    copyAt: 300,
    copyStagger: 58,
    copyDur: 640,
    seatAt: 620,
    seatStagger: 36,
    seatDur: 420,
    counterAt: 900,
    counterDur: 620,
    trackAt: 1300,
    trackDur: 520,
    yearsAt: 1150,
    yearStagger: 130,
    yearDur: 560,
    noteAt: 1700,
    noteDur: 460
  };
  var TOTAL = T.noteAt + T.noteDur;

  var SEAT_POP = 1.16;          // 亮蓝席位格的轻微过冲
  var RECT_CHECK_MS = 400;      // 计数循环内可见性自检间隔

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function reducedMotion() {
    if (window.iGEMUtils && typeof window.iGEMUtils.prefersReducedMotion === 'function') {
      return window.iGEMUtils.prefersReducedMotion();
    }
    return typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function splitWords(el) {
    var words = (el.textContent || '').trim().split(/\s+/);
    var spans = [];
    el.textContent = '';
    words.forEach(function (w, i) {
      if (i) el.appendChild(document.createTextNode(' '));
      var s = document.createElement('span');
      s.className = 'burden-lead__word';
      s.textContent = w;
      el.appendChild(s);
      spans.push(s);
    });
    el.classList.add('burden-lead--armed');
    return spans;
  }

  ready(function () {
    var stage = document.querySelector(STAGE);
    if (!stage) return;

    var section = stage.closest('section') || stage;
    var eyebrow = stage.querySelector('.burden-eyebrow');
    var num = stage.querySelector('.burden-lead__num');
    var copy = stage.querySelector('.burden-lead__copy');
    var seats = [].slice.call(stage.querySelectorAll('.burden-grid__dot'));
    var litSeat = stage.querySelector('.burden-grid__dot.is-lit');
    var counter = stage.querySelector('.burden-counter');
    var cLabel = stage.querySelector('[data-burden-label]');
    var cValue = stage.querySelector('[data-burden-value]');
    var cUnit = stage.querySelector('[data-burden-unit]');
    var cTrack = stage.querySelector('.burden-counter__track');
    var cTick = stage.querySelector('.burden-counter__tick');
    var cRate = stage.querySelector('.burden-counter__rate');
    var years = [].slice.call(stage.querySelectorAll('.burden-year'));
    var yearsCaption = stage.querySelector('.burden-years-caption');
    var note = stage.querySelector('.burden-note');

    if (!num || !copy || !seats.length || !years.length || !note || !cValue) return;

    // ---- 降级红线：能力不齐就不接管可见性（静态年值原样保留）----
    var canAnimate = !reducedMotion()
      && ('IntersectionObserver' in window)
      && typeof Element.prototype.animate === 'function';
    if (!canAnimate) return;

    var words = splitWords(copy);
    var running = [];
    var entered = false;
    var startedAt = Date.now();   // 「打开页面」的时刻：实时计数从这里起算

    stage.classList.add(ARMED);

    function play(el, frames, opts) {
      var a = el.animate(frames, {
        duration: opts.duration,
        delay: opts.delay || 0,
        easing: opts.easing || 'cubic-bezier(0.22, 0.9, 0.3, 1)',
        fill: 'both'          // 铁律：延迟期保首帧 + 结束后保末帧
      });
      running.push(a);
      return a;
    }

    // ===== 实时计数器：单 rAF 循环，可见性自检见文件头「离屏判定」 =====
    var rafId = null;
    var lastShown = -1;
    var lastRectCheck = 0;

    function inViewport() {
      var r = stage.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var vw = window.innerWidth || document.documentElement.clientWidth;
      // 严格要求有实际交叠（bottom/top 都跨过视口边），边界相切不算
      return r.bottom > 1 && r.top < vh - 1 && r.right > 0 && r.left < vw;
    }

    function tickCounter() {
      rafId = null;
      if (document.hidden) return;                 // 标签页隐藏：停表，回前台再唤醒
      var now = performance.now();
      if (now - lastRectCheck >= RECT_CHECK_MS) {
        lastRectCheck = now;
        if (!inViewport()) {
          // 离屏：停表 + 光点一并暂停（滚回来由 scroll 监听唤醒）
          if (tickAnim && tickAnim.playState === 'running') tickAnim.pause();
          return;
        }
      }
      var v = Math.floor(((Date.now() - startedAt) / 1000) * RATE_PER_SECOND);
      if (v !== lastShown) {
        lastShown = v;
        cValue.textContent = v.toLocaleString('en-US');
      }
      rafId = requestAnimationFrame(tickCounter);
    }

    function resumeCounter() {
      if (rafId === null && !document.hidden) {
        lastRectCheck = 0;                         // 复工时强制先做一次矩形自检
        rafId = requestAnimationFrame(tickCounter);
      }
      if (tickAnim && tickAnim.playState === 'paused') {
        tickAnim.play();                           // 秒节拍光点随复工一起恢复
      }
    }

    function pauseCounter() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      if (tickAnim && tickAnim.playState === 'running') {
        tickAnim.pause();                          // 光点是 infinite WAAPI，rAF 停了它也照跑，须一并暂停
      }
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { pauseCounter(); } else { resumeCounter(); }
    });

    // 滚动即尝试复工（真正可不可见由 tick 内的矩形自检把关；rafId 去重，开销可忽略）
    window.addEventListener('scroll', resumeCounter, { passive: true });

    /** 切到实时模式：改写文案 + 显示秒节拍（无 JS 时读的是静态年值，见文件头） */
    function goLive() {
      if (!counter || counter.classList.contains(LIVE)) return;
      cLabel.textContent = 'Since you opened this page';
      cUnit.textContent = 'people have caught influenza A';
      cValue.setAttribute('aria-hidden', 'true');   // 读屏器读不到每秒变化的数字
      counter.classList.add(LIVE);
      lastShown = -1;
      resumeCounter();
    }

    /** 秒节拍光点：每 1s 扫一趟轨道（= 约 21 人），宽度运行时量测 */
    var tickAnim = null;
    function startTick() {
      if (!cTrack || !cTick) return;
      var w = cTrack.getBoundingClientRect().width;
      if (!w) return;                                // 量不到就不跑，不留下永久隐藏的轨道
      if (tickAnim) { try { tickAnim.cancel(); } catch (e) { /* noop */ } }
      tickAnim = cTick.animate([
        { transform: 'translateX(0px)' },
        { transform: 'translateX(' + w.toFixed(1) + 'px)' }
      ], { duration: 1000, iterations: Infinity, easing: 'linear' });
    }

    function entrance() {
      if (eyebrow) {
        play(eyebrow, [
          { opacity: 0, transform: 'translateY(-6px)', offset: 0 },
          { opacity: 1, transform: 'translateY(0)', offset: 1 }
        ], { duration: T.eyebrowDur, delay: T.eyebrowAt });
      }

      play(num, [
        { transform: 'scale(0.86)', opacity: 0, offset: 0 },
        { transform: 'scale(1.04)', opacity: 1, offset: 0.62 },
        { transform: 'scale(1)', opacity: 1, offset: 1 }
      ], { duration: T.numDur, delay: T.numAt, easing: 'cubic-bezier(0.3, 0.7, 0.3, 1)' });

      words.forEach(function (w, i) {
        var idx = words.length - 1 - i;   // 最右侧的词先落
        play(w, [
          { transform: 'translateY(-0.8em)', opacity: 0, offset: 0 },
          { transform: 'translateY(0.08em)', opacity: 1, offset: 0.72 },
          { transform: 'translateY(0)', opacity: 1, offset: 1 }
        ], { duration: T.copyDur, delay: T.copyAt + idx * T.copyStagger, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
      });

      seats.forEach(function (s, i) {
        play(s, [
          { transform: 'scale(0.5)', opacity: 0, offset: 0 },
          { transform: 'scale(1)', opacity: 1, offset: 1 }
        ], { duration: T.seatDur, delay: T.seatAt + i * T.seatStagger });
      });

      if (litSeat) {
        play(litSeat, [
          { transform: 'scale(1)', opacity: 1, offset: 0 },
          { transform: 'scale(' + SEAT_POP + ')', opacity: 1, offset: 0.45 },
          { transform: 'scale(1)', opacity: 1, offset: 1 }
        ], { duration: 520, delay: T.seatAt + seats.length * T.seatStagger, easing: 'cubic-bezier(0.3, 0.7, 0.3, 1)' });
      }

      // 计数器整块升起（之后由 goLive 接手持续增长）
      [[cLabel, 0], [cValue, 60], [cUnit, 110], [cRate, 160]].forEach(function (pair) {
        if (!pair[0]) return;
        play(pair[0], [
          { transform: 'translateY(14px)', opacity: 0, offset: 0 },
          { transform: 'translateY(0)', opacity: 1, offset: 1 }
        ], { duration: T.counterDur, delay: T.counterAt + pair[1] });
      });

      if (cTrack) {
        play(cTrack, [
          { opacity: 0, transform: 'scaleX(0.2)', offset: 0 },
          { opacity: 1, transform: 'scaleX(1)', offset: 1 }
        ], { duration: T.trackDur, delay: T.trackAt });
      }

      if (yearsCaption) {
        play(yearsCaption, [
          { opacity: 0, offset: 0 },
          { opacity: 1, offset: 1 }
        ], { duration: T.yearDur, delay: T.yearsAt });
      }

      years.forEach(function (y, i) {
        play(y, [
          { transform: 'translateY(12px)', opacity: 0, offset: 0 },
          { transform: 'translateY(0)', opacity: 1, offset: 1 }
        ], { duration: T.yearDur, delay: T.yearsAt + (i + 1) * T.yearStagger });
      });

      play(note, [
        { opacity: 0, offset: 0 },
        { opacity: 1, offset: 1 }
      ], { duration: T.noteDur, delay: T.noteAt });
    }

    function finish() {
      stage.classList.remove(ARMED);
      stage.classList.add(DONE);
      copy.classList.remove('burden-lead--armed');
      running.forEach(function (a) {
        try { a.cancel(); } catch (e) { /* noop */ }
      });
      running = [];
    }

    // ---- IO 只负责入场触发（离屏判定见文件头，不交给 IO）----
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        if (e.isIntersecting && e.intersectionRatio >= 0.45 && !entered) {
          entered = true;
          io.disconnect();
          entrance();
          window.setTimeout(finish, TOTAL + 120);
          return;
        }
      }
    }, { threshold: [0.45] });
    io.observe(section);

    // 进入该屏（≥45%）后才切实时模式并启动秒节拍，避免读者还没进屏就开始计数
    var bootIO = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting && entries[i].intersectionRatio >= 0.45) {
          bootIO.disconnect();
          goLive();
          startTick();
          return;
        }
      }
    }, { threshold: [0.45] });
    bootIO.observe(section);

    // 轨道宽度随视口变化：重新量测并重启动画（节流）
    var resizeTimer = null;
    window.addEventListener('resize', function () {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(startTick, 200);
    });
  });
})();
