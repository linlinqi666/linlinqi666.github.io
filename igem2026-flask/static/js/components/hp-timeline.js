(function () {
  'use strict';

  // 轨道元数据：仅用于生成 3D 卡片与时间轴节点
  // time 字段显示在时间轴节点下方，建议格式：YY/MM/DD
  var articles = window.HPTimelineArticles || [];
  var defaultImg = window.HPTimelineDefaultImg || '';

  var dualScene = document.getElementById('dualScene');
  var dualStage = document.getElementById('dualStage');
  var cardsGroup = document.getElementById('cardsGroup');
  var timelineGroup = document.getElementById('timelineGroup');
  var sliderInput = document.getElementById('sliderInput');
  var sliderFill = document.getElementById('sliderFill');
  var detailPanel = document.getElementById('detailPanel');
  var detailTrack = document.getElementById('detailTrack');
  var detailCounter = document.getElementById('detailCounter');

  var n = articles.length;
  var slideCount = (detailTrack && detailTrack.children.length) || n;
  var step = 360 / n;          // 图片轴为真正闭合圆环：每张 360/n，首尾相接
  var DEG = Math.PI / 180;
  var TILT_ORBIT = 0;          // 图片轴：完全水平（统一水平面，无倾斜）
  var TILT_TL = 18;            // 时间轴：保留 3D 椭圆纵深
  var rOrbit = 280;
  var rTimeline = 300;
  var cardW = 250, cardH = 175;
  var VISIBLE = Math.min(5, n);

  var targetAngle = 0, currentAngle = 0, LERP = 0.11;
  var cards = [], tlnodes = [];
  var currentFrontIdx = -1;
  var snapActive = false;
  var rafId = null;
  var imageCache = new Map();

  function mod(a, m) { return ((a % m) + m) % m; }

  /* ---- 卡片尺寸：集中在此调整，环半径会按文章数自动缩放以避免重叠 ---- */
  var CARD_W = 350;            // 桌面端卡片宽度（想变大就改这里一个数）
  var CARD_H_RATIO = 0.7;     // 卡片高度 = 宽度 × 此比例
  var CARD_GAP = 26;          // 环上相邻卡片的最小间距
  var CARD_MOBILE_SCALE = 0.6;// 移动端缩放系数
  var R_MAX_DESKTOP = 420;    // 桌面端环半径上限
  // —— 日期环与卡片环的对齐只由下面两个值决定，纯几何、确定性的，无任何运行时测量 ——
  var DATE_GAP = -60;          // 正对卡片的日期底部，与卡片顶部的间距（px）
  var DATE_LABEL_H = 20;      // 日期文字高度（与 CSS .timeline-node 高度一致，用于几何定位）
  var timelineLift = 0;       // 日期环整体上抬量（由卡片高度几何推导，applyLayout 中计算）

  function computeLayout(count) {
    var isMobile = window.innerWidth <= 768;
    var mobileFactor = isMobile ? CARD_MOBILE_SCALE : 1;
    var s = 360 / count;
    // 由目标卡宽反推所需环半径：单卡弧长 = 卡宽 + 间距，保证任意文章数都不重叠
    var arc = CARD_W * mobileFactor + CARD_GAP;
    var r = arc * count / (2 * Math.PI);
    var rMax = isMobile ? Math.max(150, (window.innerWidth - 50) * 0.95) : R_MAX_DESKTOP;
    r = Math.max(170, Math.min(r, rMax));
    var w = (2 * Math.PI * r / count) - CARD_GAP;
    w = Math.max(82, w);
    var h = w * CARD_H_RATIO;
    return { step: s, r: r, cardW: w, cardH: h, isMobile: isMobile };
  }

  function applyLayout() {
    var L = computeLayout(n);
    step = L.step;
    rOrbit = L.r;
    rTimeline = rOrbit * (L.isMobile ? 1.04 : 1.06);
    cardW = L.cardW; cardH = L.cardH;

    dualScene.style.setProperty('--r', rOrbit + 'px');
    dualScene.style.setProperty('--tr', rTimeline + 'px');

    // 日期环相对卡片环的整体上抬量（纯几何、确定性，无运行时测量）：
    // 正对的那张日期贴在"卡片顶部上方 DATE_GAP"，其余日期随 3D 椭圆自然排布
    timelineLift = cardH / 2 + DATE_GAP + DATE_LABEL_H / 2;
    timelineGroup.style.transform =
      'translateY(' + (-timelineLift) + 'px) rotateX(' + TILT_TL + 'deg) rotateY(' + currentAngle + 'deg)';

    // 舞台高度只需足够容纳上抬的日期环 + 卡片环；overflow 为 visible，绝不会被裁切
    var tV = rTimeline * Math.sin(TILT_TL * DEG);
    dualStage.style.height = (timelineLift + tV + cardH / 2 + 120) + 'px';

    layoutCards();
    if (tlnodes.length) layoutNodes();
  }

  function layoutCards() {
    cards.forEach(function (c) {
      c.style.width = cardW + 'px';
      c.style.height = cardH + 'px';
      c.style.marginLeft = (-cardW / 2) + 'px';
      c.style.marginTop = (-cardH / 2) + 'px';
      c._baseAngle = (c._slotOffset || 0) * step;
      c.style.transform = 'rotateY(' + c._baseAngle + 'deg) translateZ(' + rOrbit + 'px)';
    });
  }

  function layoutNodes() {
    tlnodes.forEach(function (node, i) {
      node._baseAngle = i * step;
      node._baseTransform =
        'rotateY(' + (i * step) + 'deg) translateZ(' + rTimeline + 'px) rotateX(' + (-TILT_TL) + 'deg)';
      node.style.transform = node._baseTransform;
    });
  }

  function valueToAngle(v) {
    var f = parseFloat(v) / parseFloat(sliderInput.max);
    return -f * (n - 1) * step;
  }

  function angleToValue(a) {
    return (-a / ((n - 1) * step)) * parseFloat(sliderInput.max);
  }

  function preloadOne(src) {
    if (imageCache.has(src)) return;
    var img = new Image();
    img.decoding = 'async';
    img.src = src;
    function mark(ok) { imageCache.set(src, ok); }
    if (img.decode) {
      img.onload = function () { img.decode().then(function () { mark(true); }).catch(function () { mark(true); }); };
      img.onerror = function () { mark(false); };
    } else {
      img.onload = function () { mark(true); };
      img.onerror = function () { mark(false); };
    }
  }

  function assignCard(card, idx) {
    if (card._articleIdx === idx) return;
    card._articleIdx = idx;
    card.dataset.index = idx;
    var a = articles[idx];
    var imgSrc = a.img || defaultImg;
    card.style.backgroundImage = 'url("' + imgSrc + '")';
    var im = card.querySelector('img');
    if (!im) {
      im = document.createElement('img');
      im.loading = 'eager';
      im.decoding = 'async';
      card.appendChild(im);
    }
    im.alt = a.title;
    im.onload = null;
    im.onerror = null;
    if (imageCache.get(imgSrc)) {
      im.style.opacity = '1';
    } else {
      im.style.opacity = '0';
      im.style.transition = 'opacity 0.35s ease';
      im.onload = function () { im.style.opacity = '1'; };
      im.onerror = function () { im.style.opacity = '1'; };
    }
    im.src = imgSrc;
    preloadOne(imgSrc);
  }

  function updateVirtualCards(activeFloat) {
    var activeInt = Math.round(activeFloat);
    if (n <= VISIBLE) {
      if (cards.length && cards[0]._articleIdx === undefined) {
        cards.forEach(function (c) { assignCard(c, mod(activeInt + c._slotOffset, n)); });
      }
      return;
    }
    cards.forEach(function (c) { assignCard(c, mod(activeInt + c._slotOffset, n)); });
  }

  function init() {
    if (!dualScene || !dualStage || !timelineGroup || !detailTrack) return;
    slideCount = detailTrack.children.length || n;
    applyLayout();
    renderCards();
    renderTimelineNodes();
    renderDetailSlides();

    bindEvents();
    startLoop();

    window.addEventListener('resize', function () { applyLayout(); kick(); });

    requestAnimationFrame(function () {
      dualScene.style.opacity = '1';
      detailPanel.classList.add('show');
    });
  }

  function renderCards() {
    var half = Math.floor(VISIBLE / 2);
    for (var slot = 0; slot < VISIBLE; slot++) {
      var card = document.createElement('figure');
      card.className = 'orbit-card';
      card._slotOffset = slot - half;
      cardsGroup.appendChild(card);
      cards.push(card);
    }
    updateVirtualCards(0);
    layoutCards();
  }

  function renderTimelineNodes() {
    articles.forEach(function (a, i) {
      var node = document.createElement('div');
      node.className = 'timeline-node' + (i === 0 ? ' active' : '');
      node.dataset.index = i;
      var label = document.createElement('span');
      label.className = 'timeline-node-label';
      label.textContent = a.time;
      node.appendChild(label);
      timelineGroup.appendChild(node);
      tlnodes.push(node);
    });
    layoutNodes();
  }

  // detailTrack 已经预渲染了真实文章结构，不要清空重建；只同步计数器
  function renderDetailSlides() {
    slideCount = detailTrack.children.length || n;
    detailCounter.textContent = '1 / ' + slideCount;
  }

  function kick() {
    if (rafId === null) rafId = requestAnimationFrame(loop);
  }

  function loop() {
    var d = targetAngle - currentAngle;

    if (snapActive) {
      // 代码驱动跳转（点击卡片、节点、键盘、释放后吸附）：轨道与拖动条一起做 LERP 平滑动画
      if (Math.abs(d) > 0.05) {
        currentAngle += d * LERP;
      } else {
        currentAngle = targetAngle;
        snapActive = false;
      }
      var sv = angleToValue(currentAngle);
      sv = Math.max(0, Math.min(parseFloat(sliderInput.max), sv));
      sliderInput.value = sv.toFixed(0);
      syncSliderFill();
    } else {
      // 用户直接拖动拖动条：轨道实时同步，无延迟
      currentAngle = targetAngle;
    }

    var activeFloat = -currentAngle / step;
    updateVirtualCards(activeFloat);
    layoutCards();
    // 两个环同步旋转：卡片环只绕 Y 转；日期环在"上抬 + 世界稳定倾角"基础上同步绕 Y 转
    cardsGroup.style.transform = 'rotateY(' + currentAngle + 'deg)';
    timelineGroup.style.transform =
      'translateY(' + (-timelineLift) + 'px) rotateX(' + TILT_TL + 'deg) rotateY(' + currentAngle + 'deg)';

    updateAllPerspective();

    // 性能优化：仅在吸附动画进行中（snapActive）持续循环；圆环静止后停止 rAF，
    // 避免每帧重写全部卡片/节点 transform、opacity、zIndex 及逐帧改写 label fontSize/color 造成的持续卡顿
    if (snapActive) {
      rafId = requestAnimationFrame(loop);
    } else {
      rafId = null;
    }
  }

  function startLoop() {
    kick();
  }

  function getFrontIndex() {
    return Math.max(0, Math.min(n - 1, Math.round(-currentAngle / step)));
  }

  function updateAllPerspective() {
    var fi = getFrontIndex();
    var changed = fi !== currentFrontIdx;
    currentFrontIdx = fi;

    cards.forEach(function (c) {
      var norm = (((c._baseAngle + currentAngle) % 360) + 360) % 360;
      var t = (1 - Math.cos(norm * DEG)) / 2;
      var op = 1 - t * t;
      if (norm > 120 && norm < 240) op = 0;
      else if (norm > 90) op *= 0.4;
      else if (norm > 60) op *= 0.85;
      op = Math.max(0, op);
      c.style.opacity = op.toFixed(3);
      c.style.zIndex = Math.round(100 - 100 * t);
      c.classList.toggle('front', c._articleIdx === fi && norm < 30);
      c.style.pointerEvents = op > 0.15 ? '' : 'none';
    });

    if (changed) {
      tlnodes.forEach(function (node, i) { node.classList.toggle('active', i === fi); });
      updateDetailPanel(fi);
    }

    tlnodes.forEach(function (node, i) {
      var norm = (((node._baseAngle + currentAngle) % 360) + 360) % 360;
      var t = (1 - Math.cos(norm * DEG)) / 2;
      var prox = Math.cos(norm * DEG); // 1 = 正对页面, -1 = 背面
      node.style.opacity = Math.max(0.12, 1 - t * 0.7).toFixed(3);
      node.style.zIndex = Math.round(50 - 50 * t);
      var label = node.querySelector('.timeline-node-label');
      label.style.fontSize = (0.75 + 0.07 * Math.max(0, prox)).toFixed(3) + 'rem';
      label.style.color = prox > 0.2 ? 'var(--color-primary)' : 'var(--color-accent)';
    });
  }

  function updateDetailPanel(idx) {
    idx = Math.max(0, Math.min(slideCount - 1, idx));
    detailTrack.style.transform = 'translateX(' + (-idx * 100) + '%)';
    detailCounter.textContent = (idx + 1) + ' / ' + slideCount;
  }

  function syncSliderFill() {
    sliderFill.style.width = (parseFloat(sliderInput.value) / parseFloat(sliderInput.max) * 100) + '%';
  }

  function bindEvents() {
    sliderInput.addEventListener('input', function () {
      snapActive = false;
      targetAngle = valueToAngle(sliderInput.value);
      currentAngle = targetAngle; // 拖动时实时同步，避免拖动条先到、轨道后到的"闪现"感
      syncSliderFill();
      kick();
    });
    sliderInput.addEventListener('change', snapToNearest);
    sliderInput.addEventListener('keyup', function (e) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') snapToNearest();
    });

    tlnodes.forEach(function (nd, i) {
      nd.addEventListener('click', function () { goTo(i); updateDetailPanel(i); });
    });
    cards.forEach(function (c) {
      c.addEventListener('click', function () { var idx = parseInt(c.dataset.index, 10); goTo(idx); updateDetailPanel(idx); });
    });

    /* 轨道舞台全局点击：即使鼠标落在 3D 压缩后的卡片视觉区域但未命中元素本身，
       也根据最近卡片的屏幕中心进行跳转，解决两侧卡片难点击的问题 */
    dualStage.addEventListener('click', function (e) {
      if (e.target.closest('.orbit-card') || e.target.closest('.timeline-node') || e.target.closest('.slider-control')) return;
      var stageRect = dualStage.getBoundingClientRect();
      var clickX = e.clientX - stageRect.left;
      var clickY = e.clientY - stageRect.top;
      var nearest = -1, minDist = Infinity;
      cards.forEach(function (card) {
        var rect = card.getBoundingClientRect();
        var cx = rect.left + rect.width / 2 - stageRect.left;
        var cy = rect.top + rect.height / 2 - stageRect.top;
        var d = Math.sqrt(Math.pow(clickX - cx, 2) + Math.pow(clickY - cy, 2));
        if (d < minDist) { minDist = d; nearest = parseInt(card.dataset.index, 10); }
      });
      if (nearest >= 0 && minDist < 260) {
        goTo(nearest);
        updateDetailPanel(nearest);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (!dualStage.matches(':hover')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });
  }

  function goTo(idx) {
    targetAngle = -idx * step;
    snapActive = true;
    kick();
  }

  function snapToNearest() {
    var f = parseFloat(sliderInput.value) / parseFloat(sliderInput.max);
    var idx = Math.max(0, Math.min(n - 1, Math.round(f * (n - 1))));
    targetAngle = -idx * step;
    snapActive = true;
    kick();
    updateDetailPanel(idx);
  }

  function go(dir) {
    // 滚动轴只能到末篇为止：到两端即停，不再首尾环绕
    var idx = currentFrontIdx + dir;
    if (idx < 0) idx = 0;
    if (idx > n - 1) idx = n - 1;
    goTo(idx);
    updateDetailPanel(idx);
  }

  // 侧边导航链接直接驱动 3D 轮播（即使 sidebar-progress.js 未加载也能工作）
  document.querySelectorAll('a[data-hp-slide]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var idx = parseInt(a.getAttribute('data-hp-slide'), 10);
      if (!isNaN(idx) && window.HP3D) window.HP3D.goTo(idx);
    });
  });

  window.HP3D = {
    goTo: function (idx) {
      idx = Math.max(0, Math.min(slideCount - 1, idx));
      goTo(idx);
      updateDetailPanel(idx);
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
