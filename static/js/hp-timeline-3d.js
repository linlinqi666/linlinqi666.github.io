/* =================================================================
   hp-timeline-3d.js
   移植自 communication/demos/demo-3d-timeline.html 的 3D 圆环引擎。
   行为严格遵循 demo 逻辑：
     - 拖动滑块 / 点按 ‹ › ：只旋转 3D 圆环（orbit + timeline），
       不切换、不滚动任何文章正文；
     - 只有主动点击时间节点或轨道卡片，才平滑滚动到对应原文章节。
   正文内容完全保留在原页面中（按 id 对应），本脚本不改动任何文本。
   ================================================================= */
(function () {
  'use strict';

  // 文章索引：id 对应原页面中的真实章节。img 为轨道卡片封面（可空）。
  var articles = [
    { id: 'section-overview',   time: '00', title: '概述',            img: '' },
    { id: 'section-carousel',   time: '01', title: '清华参赛交流',    img: '../static/image/HP/tsinghua/1.webp' },
    { id: 'section-southchina', time: '02', title: '华南交流会',      img: '../static/image/HP/southchina/cover.jpg' },
    { id: 'section-dialogues',  time: '03', title: '临床检验专家交流', img: '../static/image/HP/expert.jpg' },
    { id: 'section-education',  time: '04', title: '中学生科学传播',   img: '../static/image/HP/school1.jpg' }
  ];

  var hero = document.getElementById('hp-timeline-hero');
  if (!hero) return;

  var timelineScene = hero.querySelector('.timeline-scene');
  var orbitScene = hero.querySelector('.orbit-scene');
  var slider = hero.querySelector('.timeline-slider');
  var prevBtn = hero.querySelector('.timeline-btn.prev');
  var nextBtn = hero.querySelector('.timeline-btn.next');

  var TILT = 18;
  var N = articles.length;
  var stepT = 360 / N;
  var rOrbit = 270;
  var rTimeline = 350;

  var timelineNodes = [];
  var orbitCards = [];
  var currentAngle = -18;
  var targetAngle = -18;
  var lastFrontIdx = -1;
  var lastT = 0;

  function valueToAngle(v) { return -18 + (v / 100) * 360; }
  function angleToValue(a) { return ((a + 18) / 360) * 100; }

  // 构建时间节点与轨道卡片（DOM 由 JS 生成，正文仍来自原页面）
  articles.forEach(function (art, i) {
    var node = document.createElement('button');
    node.type = 'button';
    node.className = 'timeline-node';
    node.setAttribute('aria-label', art.title);
    node.innerHTML = '<span class="timeline-node-dot">' + art.time + '</span>' +
                     '<span class="timeline-node-label">' + art.title + '</span>';
    node.addEventListener('click', function () { navigateTo(i); });
    timelineScene.appendChild(node);
    timelineNodes.push(node);

    var card = document.createElement('figure');
    card.className = 'orbit-card' + (art.img ? '' : ' no-image');
    if (art.img) {
      card.style.backgroundImage = "url('" + art.img + "')";
      card.innerHTML = '<img class="orbit-card-img" src="' + art.img + '" alt="' + art.title + '">' +
                       '<figcaption>' + art.title + '</figcaption>';
    } else {
      card.setAttribute('data-title', art.title);
    }
    card.addEventListener('click', function () { navigateTo(i); });
    orbitScene.appendChild(card);
    orbitCards.push(card);
  });

  function layoutCards(a) {
    orbitCards.forEach(function (c, i) {
      var st = a + i * stepT;
      c.style.transform = 'rotateY(' + st + 'deg) translateZ(' + rOrbit + 'px) rotateY(' + (-st) + 'deg)';
      var d = Math.abs(((st % 360) + 360) % 360);
      var front = d < stepT / 2 || d > 360 - stepT / 2;
      c.style.opacity = front ? '1' : '0.35';
      c.style.filter = front ? 'none' : 'blur(2px)';
      c.style.zIndex = String(1000 - Math.round(d));
      c.style.pointerEvents = front ? 'auto' : 'none';
    });
  }

  function layoutNodes(a) {
    timelineNodes.forEach(function (n, i) {
      var st = a + i * stepT;
      n.style.transform = 'rotateY(' + st + 'deg) translateZ(' + rTimeline + 'px) rotateX(' + (-TILT) + 'deg)';
    });
  }

  function updatePerspective() {
    var rotateY = (currentAngle % 360 + 360) % 360;
    orbitScene.style.transform = 'translateY(-10px) rotateX(6deg) rotateY(' + rotateY + 'deg)';
    timelineScene.style.transform = 'translateY(-10px) rotateX(' + TILT + 'deg) rotateY(' + rotateY + 'deg)';
  }

  function updateTimelinePerspective() {
    var fi = -1, best = 1e9;
    timelineNodes.forEach(function (n, i) {
      var st = ((currentAngle + i * stepT) % 360 + 360) % 360;
      var dd = Math.min(st, 360 - st);
      if (dd < best) { best = dd; fi = i; }
    });
    if (fi !== lastFrontIdx) {
      lastFrontIdx = fi;
      timelineNodes.forEach(function (n, i) { n.classList.toggle('active', i === fi); });
      // 详情面板不随拖动联动：只有用户主动点击才跳转（见 navigateTo）
    }
  }

  function render(now) {
    if (!lastT) lastT = now;
    var dt = Math.min((now - lastT) / 1000, 0.05);
    lastT = now;
    currentAngle += (targetAngle - currentAngle) * (1 - Math.pow(0.001, dt));
    layoutCards(currentAngle);
    layoutNodes(currentAngle);
    updatePerspective();
    updateTimelinePerspective();
    requestAnimationFrame(render);
  }

  function navigateTo(i) {
    // 旋转圆环使第 i 个节点转到正前方（currentAngle ≡ -i*stepT）
    var t = -i * stepT;
    while (t - currentAngle > 180) t -= 360;
    while (t - currentAngle < -180) t += 360;
    targetAngle = t;
    slider.value = angleToValue(targetAngle);
    timelineNodes.forEach(function (n, k) { n.classList.toggle('active', k === i); });
    lastFrontIdx = i;
    // 点击才跳转正文
    var el = document.getElementById(articles[i].id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function rotateStep(dir) {
    var t = targetAngle - dir * stepT;
    while (t - currentAngle > 180) t -= 360;
    while (t - currentAngle < -180) t += 360;
    targetAngle = t;
    slider.value = angleToValue(targetAngle);
  }

  // 拖动滑块：只旋转圆环，不切换文章
  slider.addEventListener('input', function () {
    targetAngle = valueToAngle(parseFloat(slider.value));
  });
  // 释放后吸附到最近的节点
  slider.addEventListener('change', function () {
    var i = Math.round(-targetAngle / stepT);
    var t = -i * stepT;
    while (t - currentAngle > 180) t -= 360;
    while (t - currentAngle < -180) t += 360;
    targetAngle = t;
    slider.value = angleToValue(targetAngle);
  });

  prevBtn.addEventListener('click', function () { rotateStep(-1); });
  nextBtn.addEventListener('click', function () { rotateStep(1); });

  requestAnimationFrame(render);
})();
