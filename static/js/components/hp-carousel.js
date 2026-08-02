/* 3D 等轴测旋转木马图集 — 第一篇 HP 文章
 * 性能优化（视觉完全不变）：
 *  - “公转”整体交给 .hp-carousel-scene 的 rotateY(currentAngle)，由 CSS transition 驱动（GPU 合成）。
 *  - 每张卡片只固定在圆环上（rotateY(base) translateZ(r) rotateX(-TILT)），保持径向朝向（无 billboard；TILT=0 使轨道正对镜头）。
 *  - 卡片提升为独立合成层（will-change: transform, opacity），旋转时图片不再逐帧重绘 —— 消除卡顿主因。
 *  - 空气透视（opacity / blur / zIndex / 阴影）只在交互时计算“最终静止态”一次；写入合并进单个 rAF，
 *    避免与 scene.transform 交错触发强制同步布局；过渡期间临时提升 filter 合成层，结束即释放。
 * 交互：左右箭头 / 键盘方向键 / 点击卡片；右箭头展示右侧卡片，左箭头展示左侧卡片。
 */
(function () {
  "use strict";

  function initCarousel(root) {
    var scene = root.querySelector(".hp-carousel-scene");
    if (!scene) return;

    // 1) 6 组数据（图片路径与文案）——之后替换真实照片只改这里
    var dataList = [
      { img: "../static/image/HP/tsinghua/1.webp" },
      { img: "../static/image/HP/tsinghua/2.webp" },
      { img: "../static/image/HP/tsinghua/3.webp" },
      { img: "../static/image/HP/tsinghua/4.webp" },
      { img: "../static/image/HP/tsinghua/5.webp" },
      { img: "../static/image/HP/tsinghua/6.webp" }
    ];

    // 2) 清空旧卡片（保留虚线轨道 div），用 dataList 动态生成，避免手写遗漏
    Array.prototype.slice
      .call(scene.querySelectorAll(".hp-carousel-card"))
      .forEach(function (c) { c.parentNode.removeChild(c); });

    dataList.forEach(function (item) {
      var card = document.createElement("figure");
      card.className = "hp-carousel-card";
      var img = document.createElement("img");
      img.src = item.img;
      img.alt = item.title;
      var cap = document.createElement("figcaption");
      cap.textContent = item.title;
      card.appendChild(img);
      card.appendChild(cap);
      scene.appendChild(card);
    });

    // 3) 重新获取生成后的卡片
    var cards = Array.prototype.slice.call(root.querySelectorAll(".hp-carousel-card"));
    var arrowL = root.querySelector(".hp-carousel-arrow.left");
    var arrowR = root.querySelector(".hp-carousel-arrow.right");
    if (!cards.length) return;

    var n = cards.length;
    var step = 360 / n;     // 每张图均分 360°
    var TILT = 0;          // 等轴测倾斜角度：取 0 让轨道正面面对镜头，纵深以“前后”读出
    var DEG = Math.PI / 180;

    // 圆环半径取自 CSS 变量 --r，移动端会自动变小
    var r = parseFloat(getComputedStyle(root).getPropertyValue("--r")) || 270;

    var currentAngle = 0;
    var rafPending = false;

    // 记录每张卡片在圆环上的基准角度，并写入“静态方位” transform。
    // 旋转完全由 scene 的 rotateY 承担，卡片自身 transform 不会被逐帧改写。
    // 卡片提升为独立合成层（will-change），旋转时不再逐帧重绘图片内容——消除卡顿，视觉不变。
    cards.forEach(function (card, i) {
      card._base = i * step;                  // 预存数值基准角，省去每次 parseFloat
      card.dataset.base = i * step;
      card.style.transform =
        "rotateY(" + (i * step) + "deg) translateZ(" + r + "px) rotateX(" + (-TILT) + "deg)";
      card.style.willChange = "transform, opacity";
    });

    scene.style.transformStyle = "preserve-3d";
    // scene 承载“倾斜 + 公转”；其 transform 由 CSS transition 平滑插值（见 CSS）
    scene.style.transform =
      "translateY(0px) rotateX(" + TILT + "deg) rotateY(0deg)";

    // 仅依据“最终静止角度”计算一次空气透视。这些值通过 CSS transition 平滑过渡，
    // 整段交互不逐帧写样式，只在每次交互时计算一次“最终静止态”。
    function applyPerspective() {
      cards.forEach(function (card) {
        var base = card._base;
        var norm = (((base + currentAngle) % 360) + 360) % 360;  // 0..360
        var t = (1 - Math.cos(norm * DEG)) / 2;                   // 0 = 最前, 1 = 最后

        // 必须显式设置 zIndex：前方卡片 t≈0 → 高 zIndex 遮挡后方；
        // 浏览器 3D 在 preserve-3d 中不会自动按 translateZ 排序绘制顺序。
        card.style.zIndex = Math.round(100 - 100 * t);

        // opacity / blur 作为空气透视增强（后方更淡更模糊）
        card.style.opacity = (1 - 0.5 * t).toFixed(3);
        card.style.filter = (t > 0.05) ? "blur(" + (2 * t).toFixed(2) + "px)" : "none";

        // 前方卡片投影更重，制造悬空纵深感
        card.style.boxShadow =
          t < 0.5
            ? "0 26px 44px -14px rgba(74,59,42," + (0.55 * (1 - t)).toFixed(3) + ")"
            : "0 10px 24px -10px rgba(74,59,42,0.5)";
      });
    }

    // 把透视更新合并到下一帧：避免与 scene.transform 写入交错触发强制同步布局；
    // 同一帧内多次交互（连点 / 连按方向键）只执行一次，取最新 currentAngle。
    function schedulePerspective() {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(function () {
        rafPending = false;
        applyPerspective();
      });
    }

    // 过渡期间临时把 filter 纳入合成层提示（blur / 阴影在独立层合成，减少重绘），
    // 过渡结束或兜底超时后释放，避免长期占用显存。视觉完全不变。
    var releaseTimer = null;
    function promoteFilterLayer() {
      cards.forEach(function (c) { c.style.willChange = "transform, opacity, filter"; });
      clearTimeout(releaseTimer);
      releaseTimer = setTimeout(releaseFilterLayer, 800);
    }
    function releaseFilterLayer() {
      releaseTimer = null;
      cards.forEach(function (c) { c.style.willChange = "transform, opacity"; });
    }
    scene.addEventListener("transitionrun", promoteFilterLayer);
    scene.addEventListener("transitionend", releaseFilterLayer);

    applyPerspective();   // 初始静止态立即计算（不进 rAF，保证首屏正确）

    // 整体揭示场景：内联 opacity:0 防止 FOUC，此时 3D 布局完全就绪，淡入展示
    scene.style.opacity = "1";

    // 让指定基准角度的卡片转到正前方（点击卡片时调用）
    function goTo(base) {
      var t = -base;
      while (t < currentAngle - 180) t += 360;
      while (t > currentAngle + 180) t -= 360;
      currentAngle = t;
      scene.style.transform =
        "translateY(0px) rotateX(" + TILT + "deg) rotateY(" + currentAngle + "deg)";
      schedulePerspective();
    }

    // dir = -1：右侧卡片转到正前（右箭头）；dir = +1：左侧卡片转到正前（左箭头）
    function spin(dir) {
      currentAngle += dir * step;
      scene.style.transform =
        "translateY(0px) rotateX(" + TILT + "deg) rotateY(" + currentAngle + "deg)";
      schedulePerspective();
    }

    if (arrowR) arrowR.addEventListener("click", function () { spin(-1); });
    if (arrowL) arrowL.addEventListener("click", function () { spin(1); });

    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        goTo(card._base);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (root.matches(":hover")) {
        if (e.key === "ArrowRight") { e.preventDefault(); spin(-1); }
        else if (e.key === "ArrowLeft") { e.preventDefault(); spin(1); }
      }
    });
  }

  function boot() {
    var nodes = document.querySelectorAll(".hp-carousel");
    Array.prototype.forEach.call(nodes, initCarousel);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
