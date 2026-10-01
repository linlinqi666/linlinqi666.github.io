/**
 * ============================================
 * iGEM SZPU-2026 - 首页 statistics（检测方法）屏揭示动画
 * ============================================
 *
 * @description
 *   用户首次滑动进入「结果 / 检测方法」屏（#statistics）时：
 *   - ELISA、qPCR 两个圆与虚线弧隐藏（缩放并叠到 CGIS 圆身后，不会露边）；
 *   - 屏顶英文小标题逐词「右先左后」下落；
 *   - CGIS 圆上方出现「Click here」箭头提示；
 *   - 点击（或键盘触发）CGIS 后：虚线弧先画出 → ELISA → qPCR，依次沿以 CGIS 为
 *     圆心的轨道展开到设计位置（最终态 = index.css 现有布局，不做任何改写）。
 *   - 每次页面加载只播一次：展开后滑走再滑回不重播，刷新才重置。
 *
 * @降级红线
 *   无 JS / prefers-reduced-motion / 无 IntersectionObserver / 无 Web Animations API
 *   时脚本不接管可见性，页面直接呈现完整静态布局（圆弧与两个圆默认可见）。
 *
 * @几何
 *   隐藏态与展开轨迹在运行时用 getBoundingClientRect 量测（桌面与 ≤768px 两套
 *   定位数值通用）。量测在选区进入视口后进行——mobile.css 的全局
 *   `img { content-visibility: auto }` 会让视口外的图片拿到 0 高度矩形。
 *
 * 依赖：window.iGEMUtils（core/utils.js，提供 prefersReducedMotion / debounce），
 *       未加载时自动回退到 window.matchMedia。
 */
(function () {
  'use strict';

  var STAGE_CLASS = 'art-stage--statistics';
  var ARMED = 'js-reveal-armed';
  var IN_VIEW = 'in-view';
  var REVEALED = 'revealed';
  var HIDDEN_OPACITY = 0;

  /** 时间轴（ms） */
  var T = {
    arcDraw: 460,      // 虚线弧画出
    elisaDelay: 280,   // ELISA 出发
    qpcrDelay: 560,    // qPCR 出发
    fly: 950,          // 单个圆飞行时长
    hintDelay: 780,    // 提示出现（等标题落定）
    wordStagger: 62,   // 标题逐词间隔（右 → 左）
    wordDrop: 620,     // 单个词下落时长
    hintFade: 190
  };

  var BOW_DEG = 22;            // 轨道中段的切向偏角（绕 CGIS 同一旋向，形成"绕轨道"弧线）
  var HIDDEN_SCALE_FACTOR = 0.86; // 隐藏态相对 CGIS 直径的额外收窄系数（防露边）
  var HINT_GAP = 10;           // 提示箭头到 CGIS 圆盒顶部的间距（px）

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

  function debounce(fn, wait) {
    if (window.iGEMUtils && typeof window.iGEMUtils.debounce === 'function') {
      return window.iGEMUtils.debounce(fn, wait);
    }
    var timer = null;
    return function () {
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(null, args); }, wait);
    };
  }

  function centerOf(rect) {
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }

  function translateScale(dx, dy, scale) {
    return 'translate(' + dx.toFixed(2) + 'px, ' + dy.toFixed(2) + 'px) scale(' + scale.toFixed(4) + ')';
  }

  ready(function () {
    var stage = document.querySelector('.' + STAGE_CLASS);
    if (!stage) return;

    var section = stage.closest('section') || stage;
    var cgis = stage.querySelector('.art--statistics-cgis');
    var elisa = stage.querySelector('.art--statistics-elisa');
    var qpcr = stage.querySelector('.art--statistics-qpcr');
    var arc = stage.querySelector('.art--statistics-arc');
    var hint = stage.querySelector('.statistics-hint');
    var caption = stage.querySelector('.statistics-caption');

    if (!cgis || !elisa || !qpcr || !arc) return;

    // ---- 降级红线：任何一项能力缺失就不接管可见性 ----
    if (reducedMotion()
      || !('IntersectionObserver' in window)
      || typeof Element.prototype.animate !== 'function') {
      return;
    }

    var geo = null;          // { elisa: {...}, qpcr: {...} }
    var revealed = false;
    var inView = false;
    var runningAnims = [];
    var hintTimer = null;
    var finishTimer = null;

    // ==================================================
    // 初始：隐藏态 + 无障碍标记 + 标题拆词
    // ==================================================
    stage.classList.add(ARMED);
    cgis.setAttribute('role', 'button');
    cgis.setAttribute('tabindex', '0');
    cgis.setAttribute('aria-label', 'CGIS：点击展开 qPCR 与 ELISA 检测方法');
    cgis.addEventListener('click', onCgisActivate);
    cgis.addEventListener('keydown', onCgisKeydown);

    // 图片异常（404 等）时放弃隐藏态，避免圆永久不可见
    [elisa, qpcr].forEach(function (img) {
      img.addEventListener('error', disarm);
    });

    var captionWords = splitCaption(caption);

    function onCgisKeydown(event) {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault();
        onCgisActivate();
      }
    }

    function onCgisActivate() {
      if (revealed) return;
      revealed = true;
      reveal();
    }

    function disarm() {
      stage.classList.remove(ARMED);
      if (cgis) {
        cgis.removeAttribute('role');
        cgis.removeAttribute('tabindex');
        cgis.removeAttribute('aria-label');
      }
      window.removeEventListener('resize', onResizeDebounced);
    }

    function splitCaption(el) {
      if (!el) return [];
      var text = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (!text) return [];
      var words = text.split(' ');
      var spans = [];
      el.textContent = '';
      words.forEach(function (word, i) {
        if (i) el.appendChild(document.createTextNode(' '));
        var span = document.createElement('span');
        span.className = 'statistics-caption__word';
        span.textContent = word;
        el.appendChild(span);
        spans.push(span);
      });
      // 拆词后先压住（脚本在此之前已把该屏判为未进入视口，不会出现闪烁）
      el.classList.add('statistics-caption--armed');
      return spans;
    }

    // ==================================================
    // 量测：把每个圆的"最终中心/尺寸"换算成隐藏态位移与缩放
    // ==================================================
    function measure() {
      var cgisRect = cgis.getBoundingClientRect();
      var elisaRect = elisa.getBoundingClientRect();
      var qpcrRect = qpcr.getBoundingClientRect();
      // 宽或高为 0：图片未解码 / content-visibility 跳过布局 → 视为无效
      if (!cgisRect.width || !cgisRect.height
        || !elisaRect.width || !elisaRect.height
        || !qpcrRect.width || !qpcrRect.height) {
        return false;
      }

      var c = centerOf(cgisRect);
      var next = {};
      [['elisa', elisaRect], ['qpcr', qpcrRect]].forEach(function (pair) {
        var key = pair[0];
        var rect = pair[1];
        var target = centerOf(rect);
        var dx = c.x - target.x;
        var dy = c.y - target.y;
        // 隐藏态缩放：保证两个方向都不超过 CGIS 圆盒，再乘收窄系数（防"大圆露边"）
        var ratio = Math.min(cgisRect.width / rect.width, cgisRect.height / rect.height);
        var scale = Math.min(ratio * HIDDEN_SCALE_FACTOR, 0.98);

        // 轨道中段控制点：以 CGIS 为圆心、同旋向偏 BOW_DEG，形成绕轨弧线
        var theta = (target.x < c.x ? -BOW_DEG : BOW_DEG) * Math.PI / 180;
        var cos = Math.cos(theta);
        var sin = Math.sin(theta);
        var midFactor = 0.46;
        var mx = (dx * cos - dy * sin) * midFactor;
        var my = (dx * sin + dy * cos) * midFactor;

        next[key] = {
          dx: dx,
          dy: dy,
          mx: mx,
          my: my,
          scale: scale,
          midScale: scale + (1 - scale) * 0.58
        };
      });

      geo = next;
      return true;
    }

    function applyHiddenState() {
      if (!measure()) return false;
      elisa.style.transform = translateScale(geo.elisa.dx, geo.elisa.dy, geo.elisa.scale);
      qpcr.style.transform = translateScale(geo.qpcr.dx, geo.qpcr.dy, geo.qpcr.scale);
      positionHint();
      return true;
    }

    function positionHint() {
      if (!hint) return;
      var stageRect = stage.getBoundingClientRect();
      var cgisRect = cgis.getBoundingClientRect();
      hint.style.left = (cgisRect.left - stageRect.left + cgisRect.width / 2).toFixed(1) + 'px';
      hint.style.top = (cgisRect.top - stageRect.top - HINT_GAP).toFixed(1) + 'px';
    }

    /**
     * 等图片完成布局（content-visibility: auto 的图片在视口外没有真实尺寸）。
     * 视口内逐帧重试，超时则放弃隐藏态。
     */
    function measureWhenReady(callback) {
      var attempts = 0;
      (function tick() {
        if (measure()) {
          callback(true);
          return;
        }
        attempts += 1;
        if (attempts > 30) {
          callback(false);
          return;
        }
        requestAnimationFrame(tick);
      })();
    }

    // ==================================================
    // 进入视口：标题下落 + 提示出现
    // ==================================================
    var observer = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          observer.disconnect();
          onEnterView();
          return;
        }
      }
    }, { threshold: 0.45 });
    observer.observe(section);

    function onEnterView() {
      inView = true;
      measureWhenReady(function (ok) {
        if (ok) {
          applyHiddenState();
        } else {
          // 量测失败：放弃隐藏态与提示，恢复完整静态布局（标题照常下落）
          disarm();
        }
        stage.classList.add(IN_VIEW);
        dropCaption();
        if (ok) {
          hintTimer = window.setTimeout(showHint, T.hintDelay);
        }
      });
    }

    function dropCaption() {
      if (!captionWords.length) return;
      if (caption) caption.classList.remove('statistics-caption--armed');
      var last = captionWords.length - 1;
      var anims = captionWords.map(function (word, i) {
        // 右 → 左：右侧词先落，左侧词后落
        var delay = (last - i) * T.wordStagger;
        return word.animate([
          { transform: 'translateY(-1.15em)', opacity: 0, offset: 0 },
          { transform: 'translateY(0.14em)', opacity: 1, offset: 0.72 },
          { transform: 'translateY(0)', opacity: 1, offset: 1 }
        ], {
          duration: T.wordDrop,
          delay: delay,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'backwards'
        });
      });
      Promise.all(anims.map(function (a) {
        return a.finished.catch(function () {});
      })).then(function () {
        anims.forEach(function (a) { a.cancel(); });
      });
    }

    function showHint() {
      if (!hint || revealed) return;
      positionHint();
      hint.style.display = 'flex';
      var inner = hint.querySelector('.statistics-hint__inner');
      if (!inner) return;
      var pop = inner.animate([
        { opacity: 0, transform: 'translateY(8px) scale(0.86)', offset: 0 },
        { opacity: 1, transform: 'translateY(0) scale(1)', offset: 1 }
      ], {
        duration: 460,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'forwards'
      });
      runningAnims.push(pop);
    }

    // ==================================================
    // 点击展开：虚线弧 → ELISA → qPCR
    // ==================================================
    function reveal() {
      if (!geo) {
        // 极端情况（进入视口后立刻点击且量测尚未就绪）：直接静态揭晓
        disarm();
        return;
      }
      stage.classList.add(REVEALED);
      hideHint();
      drawArc();
      flyCircle(elisa, geo.elisa, T.elisaDelay);
      flyCircle(qpcr, geo.qpcr, T.qpcrDelay);
      finishTimer = window.setTimeout(finish, T.qpcrDelay + T.fly + 90);
    }

    function hideHint() {
      if (hintTimer) {
        clearTimeout(hintTimer);
        hintTimer = null;
      }
      if (!hint) return;
      var inner = hint.querySelector('.statistics-hint__inner');
      if (!inner || hint.style.display === 'none' || !hint.style.display) {
        if (hint.parentNode) hint.parentNode.removeChild(hint);
        return;
      }
      var fade = inner.animate([
        { opacity: 1, offset: 0 },
        { opacity: 0, offset: 1 }
      ], { duration: T.hintFade, easing: 'ease-in', fill: 'forwards' });
      runningAnims.push(fade);
      window.setTimeout(function () {
        if (hint.parentNode) hint.parentNode.removeChild(hint);
      }, T.hintFade + 40);
    }

    function drawArc() {
      // 从 CGIS 一侧（左下角）向 ELISA 一侧（右上）扇形擦除，呈"画出虚线弧"
      var anim = arc.animate([
        { clipPath: 'polygon(0% 100%, 0% 100%, 0% 100%)', offset: 0 },
        { clipPath: 'polygon(0% 100%, 0% -140%, 240% 100%)', offset: 1 }
      ], {
        duration: T.arcDraw,
        easing: 'cubic-bezier(0.3, 0.9, 0.4, 1)',
        fill: 'forwards'
      });
      runningAnims.push(anim);
    }

    function flyCircle(el, g, delay) {
      if (!el || !g) return;
      var anim = el.animate([
        { transform: translateScale(g.dx, g.dy, g.scale), opacity: HIDDEN_OPACITY, offset: 0 },
        { transform: translateScale(g.mx, g.my, g.midScale), opacity: 1, offset: 0.55 },
        { transform: translateScale(0, 0, 1), opacity: 1, offset: 1 }
      ], {
        duration: T.fly,
        delay: delay,
        // 起步稍缓、末端减速：让"绕轨道"的弧线轨迹看得清，而不是瞬间弹出
        easing: 'cubic-bezier(0.45, 0.12, 0.28, 1)',
        // 必须用 both：只用 backwards 时动画结束后效果即失效，元素会回落到
        // 内联隐藏 transform + .js-reveal-armed 的 opacity:0（收尾前）→ 出现
        // "到位后又消失一下再弹回"的闪动。both 让末帧保持到 finish() 同帧清理。
        fill: 'both'
      });
      runningAnims.push(anim);
    }

    /**
     * 收尾：交回 CSS 布局 —— 去掉隐藏类与内联 transform、取消 WAAPI 动画。
     * 上述操作在同一帧内完成，最终态与动画末帧一致，不会闪烁。
     */
    function finish() {
      stage.classList.remove(ARMED);
      stage.classList.add(REVEALED + '-done');
      elisa.style.transform = '';
      qpcr.style.transform = '';
      runningAnims.forEach(function (a) {
        try { a.cancel(); } catch (e) { /* 已取消则忽略 */ }
      });
      runningAnims = [];
      cgis.removeAttribute('role');
      cgis.removeAttribute('tabindex');
      cgis.removeAttribute('aria-label');
      window.removeEventListener('resize', onResize);
      if (hint && hint.parentNode) hint.parentNode.removeChild(hint);
    }

    // ==================================================
    // 窗口尺寸变化：展开前重新量测（两套断点定位数值不同）
    // ==================================================
    function onResize() {
      if (revealed || !inView) return;
      if (window.innerHeight === 0) return;
      applyHiddenState();
    }
    var onResizeDebounced = debounce(onResize, 180);
    window.addEventListener('resize', onResizeDebounced);
  });
})();
