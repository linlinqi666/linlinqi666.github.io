/**
 * footer-bubbles.js — 页脚「气泡网」交互（2026-10-20 第二版）
 *
 * 设计口径（用户）：
 *  - 五个母气泡是一个整体，一个展开会挤开另外四个（牵一发而动全身）；
 *  - 子气泡分裂时对母气泡产生反作用力，母气泡再把这个力传给其他气泡；
 *  - 子气泡不按固定角度排，每次分裂的位置都随机；
 *  - 子气泡紧贴母气泡（没有间距），整体偏圆形。
 *
 * 实现：
 *  - 母气泡用绝对定位 + transform；基础位 3+2，运行时按容器尺寸算。
 *  - 展开时给每个子气泡生成「随机起始角 + 均匀分布 + 随机抖动」的方向，
 *    半径 = 母半径 + 子半径 × 0.82（两圆相切略重叠，看起来是贴在一起）。
 *  - 反作用力：把所有子气泡向量求和取反，作为母气泡的位移方向。
 *  - 挤开其余四个：以「母气泡 → 对方」为方向，力随距离衰减（上限 44px）。
 *  - 再做 8 轮圆-圆松弛，保证五个 96px 圆之间至少留 14px，不会叠在一起。
 *  - 位移交给 CSS transition（0.5s），不跑 rAF 循环，静止即零开销。
 *
 * 降级：
 *  - ≤768px 不做物理布局，退回 CSS 手风琴（只切 is-active 类）；
 *  - prefers-reduced-motion 由 CSS 关掉过渡，位置仍然正确。
 */
(function () {
  'use strict';

  var root = document.querySelector('.footer-bubbles');
  if (!root) return;

  var stage = root.querySelector('.bubble-stage');
  var groups = Array.prototype.slice.call(root.querySelectorAll('.bubble-group'));
  if (!stage || !groups.length) return;

  var D = 108;          // 母气泡直径，必须与 CSS 的 .bubble--parent 一致
  var GAP_X = 60;
  var GAP_Y = 46;
  var MIN_GAP = 10;    // 五个母气泡之间保留的缝隙

  var canHover = !!(window.matchMedia && window.matchMedia('(hover: hover)').matches);
  var mqMobile = window.matchMedia ? window.matchMedia('(max-width: 768px)') : null;
  var active = -1;
  var closeTimer = 0;
  var childVectors = groups.map(function () { return []; });

  function isMobile() {
    return !!(mqMobile && mqMobile.matches);
  }

  /**
   * 3+2 的基础位（左上角坐标），第二行相对第一行错半列（蜂窝式），
   * 视觉上更饱满；整体仍在舞台里居中。
   */
  function basePositions() {
    var W = stage.clientWidth;
    var H = stage.clientHeight;
    var clusterW = D * 3 + GAP_X * 2;
    var clusterH = D * 2 + GAP_Y;
    var x0 = Math.max(0, (W - clusterW) / 2);
    var y0 = Math.max(0, (H - clusterH) / 2);
    var col = D + GAP_X;
    var half = col / 2;
    return [
      { x: x0, y: y0 },
      { x: x0 + col, y: y0 },
      { x: x0 + col * 2, y: y0 },
      { x: x0 + half, y: y0 + D + GAP_Y },
      { x: x0 + half + col, y: y0 + D + GAP_Y }
    ];
  }

  /** 展开态：反作用力 + 推开其他四个 + 松弛去重叠 + 边界夹取 */
  function solve() {
    var pos = basePositions();

    if (active >= 0) {
      var vec = childVectors[active] || [];
      var sx = 0;
      var sy = 0;
      for (var k = 0; k < vec.length; k++) {
        sx += vec[k].x;
        sy += vec[k].y;
      }
      var len = Math.sqrt(sx * sx + sy * sy);
      var rx;
      var ry;
      if (len < 0.001) {
        // 子气泡几乎均匀环绕时，合力为 0：给一个随机方向，避免母气泡不动
        var a = Math.random() * Math.PI * 2;
        rx = Math.cos(a);
        ry = Math.sin(a);
      } else {
        rx = -sx / len;
        ry = -sy / len;
      }
      pos[active].x += rx * 34;
      pos[active].y += ry * 34;

      for (var j = 0; j < pos.length; j++) {
        if (j === active) continue;
        var dx = pos[j].x - pos[active].x;
        var dy = pos[j].y - pos[active].y;
        var dist = Math.sqrt(dx * dx + dy * dy) || 1;
        var force = Math.min(70, 7000 / (dist + 20));
        pos[j].x += (dx / dist) * force;
        pos[j].y += (dy / dist) * force;
      }
    }

    // 圆-圆松弛：五次圆互不重叠，且离展开母气泡至少一圈
    for (var it = 0; it < 8; it++) {
      for (var a1 = 0; a1 < pos.length; a1++) {
        for (var b1 = a1 + 1; b1 < pos.length; b1++) {
          var ddx = pos[b1].x - pos[a1].x;
          var ddy = pos[b1].y - pos[a1].y;
          var d = Math.sqrt(ddx * ddx + ddy * ddy) || 0.01;
          var min = D + MIN_GAP;
          if (d < min) {
            var push = (min - d) / 2;
            pos[a1].x -= (ddx / d) * push;
            pos[a1].y -= (ddy / d) * push;
            pos[b1].x += (ddx / d) * push;
            pos[b1].y += (ddy / d) * push;
          }
        }
      }
    }

    var W = stage.clientWidth;
    var H = stage.clientHeight;
    for (var m = 0; m < pos.length; m++) {
      pos[m].x = Math.max(-8, Math.min(W - D + 8, pos[m].x));
      pos[m].y = Math.max(-8, Math.min(H - D + 8, pos[m].y));
    }
    return pos;
  }

  function apply() {
    if (isMobile()) {
      // 移动端交给 CSS 手风琴，必须清掉桌面留下的 inline transform
      for (var i = 0; i < groups.length; i++) {
        groups[i].style.transform = '';
        var kids = groups[i].querySelectorAll('.bubble--child');
        for (var k = 0; k < kids.length; k++) {
          kids[k].style.transform = '';
          kids[k].style.opacity = '';
          kids[k].style.transitionDelay = '';
        }
      }
      return;
    }
    var pos = solve();
    for (var g = 0; g < groups.length; g++) {
      groups[g].style.transform = 'translate(' + pos[g].x.toFixed(1) + 'px,' + pos[g].y.toFixed(1) + 'px)';
    }
  }

  /**
   * 子气泡松弛：两两之间至少隔 MIN_CHILD_GAP（不允许出现 50% 叠压），
   * 同时把每个子气泡拉回「贴着母气泡」的半径带内。
   * 只做位置松弛，不改角度随机性——每次分裂的方位仍然是随机的。
   */
  function relaxChildren(pts) {
    var min = D;                     // 2 × childR(40) + 10
    var rMin = D / 2 + 40 * 0.62;    // 贴住母气泡的下限
    var rMax = D / 2 + 40 * 1.15;    // 上限：别飞太远
    for (var it = 0; it < 24; it++) {
      var moved = false;
      for (var i = 0; i < pts.length; i++) {
        for (var j = i + 1; j < pts.length; j++) {
          var dx = pts[j].x - pts[i].x;
          var dy = pts[j].y - pts[i].y;
          var d = Math.sqrt(dx * dx + dy * dy) || 0.01;
          if (d < min) {
            var push = (min - d) / 2 + 0.1;
            pts[i].x -= (dx / d) * push;
            pts[i].y -= (dy / d) * push;
            pts[j].x += (dx / d) * push;
            pts[j].y += (dy / d) * push;
            moved = true;
          }
        }
      }
      for (var k = 0; k < pts.length; k++) {
        var r = Math.sqrt(pts[k].x * pts[k].x + pts[k].y * pts[k].y) || 0.01;
        if (r < rMin) { pts[k].x = pts[k].x / r * rMin; pts[k].y = pts[k].y / r * rMin; moved = true; }
        else if (r > rMax) { pts[k].x = pts[k].x / r * rMax; pts[k].y = pts[k].y / r * rMax; moved = true; }
      }
      if (!moved) break;
    }
    return pts;
  }

  /** 子气泡：随机方向甩出，紧贴母气泡，互不叠压，并避开其余四个母气泡 */
  function spawn(i) {
    var kids = Array.prototype.slice.call(groups[i].querySelectorAll('.bubble--child'));
    var n = kids.length;
    var childR = 40;                 // 子气泡半径（CSS 80px）
    var baseAngle = Math.random() * Math.PI * 2;
    var base = basePositions();

    // 其余四个母气泡的圆心（用基础位；展开时它们只会被推得更远）
    var avoid = [];
    for (var j = 0; j < base.length; j++) {
      if (j === i) continue;
      avoid.push({ x: base[j].x + D / 2, y: base[j].y + D / 2 });
    }
    var pcx = base[i].x + D / 2;
    var pcy = base[i].y + D / 2;

    var pts = [];
    for (var k = 0; k < n; k++) {
      var angle = baseAngle + (k * Math.PI * 2) / n + (Math.random() - 0.5) * 0.8;
      var r = D / 2 + childR * 0.82 + (Math.random() - 0.5) * 10;
      pts.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
    }

    // 松弛掉「两个子气泡叠 50%」；再检查是否盖住别的母气泡，
    // 盖住就整体换个起始角重来（最多 6 次），否则接受。
    var ok = false;
    for (var attempt = 0; attempt < 6 && !ok; attempt++) {
      relaxChildren(pts);
      ok = true;
      for (var m = 0; m < pts.length; m++) {
        for (var a2 = 0; a2 < avoid.length; a2++) {
          var ddx = pcx + pts[m].x - avoid[a2].x;
          var ddy = pcy + pts[m].y - avoid[a2].y;
          if (Math.sqrt(ddx * ddx + ddy * ddy) < childR + D / 2 + 8) { ok = false; break; }
        }
        if (!ok) break;
      }
      if (!ok) {
        // 整体旋转一点再试，保持随机性又不破坏两两间距
        var rot = 0.5 + Math.random() * 0.4;
        for (var q = 0; q < pts.length; q++) {
          var px = pts[q].x * Math.cos(rot) - pts[q].y * Math.sin(rot);
          var py = pts[q].x * Math.sin(rot) + pts[q].y * Math.cos(rot);
          pts[q].x = px;
          pts[q].y = py;
        }
      }
    }

    var vecs = [];
    for (var t = 0; t < pts.length; t++) {
      vecs.push({ x: pts[t].x, y: pts[t].y });
      kids[t].style.transitionDelay = (t * 32) + 'ms';
      kids[t].style.transform =
        'translate(calc(-50% + ' + pts[t].x.toFixed(1) + 'px), calc(-50% + ' + pts[t].y.toFixed(1) + 'px)) scale(1)';
      kids[t].style.opacity = '1';
    }
    childVectors[i] = vecs;
  }

  function collapse(i) {
    var kids = groups[i].querySelectorAll('.bubble--child');
    for (var k = 0; k < kids.length; k++) {
      kids[k].style.transitionDelay = (k * 18) + 'ms';
      kids[k].style.transform = 'translate(-50%,-50%) scale(0.35)';
      kids[k].style.opacity = '0';
    }
  }

  function setActive(group) {
    var idx = groups.indexOf(group);
    if (idx === active) return;

    if (active >= 0) collapse(active);
    active = idx;

    for (var i = 0; i < groups.length; i++) {
      var on = i === idx;
      groups[i].classList.toggle('is-active', on);
      var btn = groups[i].querySelector('.bubble--parent');
      if (btn) btn.setAttribute('aria-expanded', on ? 'true' : 'false');
    }

    if (idx >= 0) {
      root.setAttribute('data-active', '');
      if (!isMobile()) spawn(idx);
    } else {
      root.removeAttribute('data-active');
    }
    apply();
  }

  function clearTimer() {
    if (closeTimer) {
      window.clearTimeout(closeTimer);
      closeTimer = 0;
    }
  }

  for (var i = 0; i < groups.length; i++) {
    (function (group) {
      var btn = group.querySelector('.bubble--parent');
      if (!btn) return;

      if (canHover) {
        group.addEventListener('pointerenter', function (e) {
          if (e.pointerType && e.pointerType !== 'mouse') return;
          clearTimer();
          setActive(group);
        });
        group.addEventListener('pointerleave', function (e) {
          if (e.pointerType && e.pointerType !== 'mouse') return;
          clearTimer();
          closeTimer = window.setTimeout(function () { setActive(null); }, 180);
        });
      }

      btn.addEventListener('click', function () {
        clearTimer();
        if (canHover) setActive(group);
        else setActive(group.classList.contains('is-active') ? null : group);
      });

      btn.addEventListener('focus', function () {
        clearTimer();
        setActive(group);
      });

      group.addEventListener('focusout', function (e) {
        if (!group.contains(e.relatedTarget)) {
          clearTimer();
          setActive(null);
        }
      });
    })(groups[i]);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
      clearTimer();
      setActive(null);
    }
  });

  // 首帧落位 + 尺寸变化重排（切到移动端时清掉 inline transform）
  var resizeTimer = 0;
  window.addEventListener('resize', function () {
    if (resizeTimer) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(apply, 120);
  });

  apply();
})();
