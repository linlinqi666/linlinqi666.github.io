/*
 * hp-map.js — 中国专家地图（聚类版）
 *
 * 结构优化（对齐根目录 static/js/components/hp-map.js 的聚类逻辑）：
 *  - 同省份的专家合并为单个聚类图钉（.hz-cluster），显著减少 DOM 图钉数量，
 *    避免专家多时图钉密集渲染造成的重排/重绘开销。
 *  - 悬停/聚焦聚类图钉弹出该省专家列表（.hz-cluster-popover），点击专家打开详情。
 *  - 详情仍沿用本站既有弹窗（#hzModal）交互，避免改动页面结构。
 *  - 直接初始化：DOM 就绪后立即渲染图钉，规避 IntersectionObserver 与
 *    content-visibility 优化策略冲突导致的图钉不显示问题。
 * 数据源：window.HPMapExperts（static/data/hp-map-data.js）。
 */
(function () {
  "use strict";

  var root = document.getElementById("hzMap");
  if (!root || root.dataset.initialized === "true") return;
  root.dataset.initialized = "true";

  var categoryNames = {
    science: "Science and academia",
    policy: "Policy",
    industry: "Industry",
    public: "Public"
  };
  var categoryColors = {
    science: "#4A90E2",
    policy: "#E94B3C",
    industry: "#9013FE",
    public: "#F5A623"
  };
  var chinaExperts = window.HPMapExperts || [];

  // 省份聚合坐标（按 china.svg viewBox 百分比）
  var provinceCoordinates = {
    "CN-44": { top: 87.0, left: 66.0 },
    "CN-33": { top: 62.0, left: 75.5 },
    "CN-43": { top: 76.0, left: 62.5 }
  };

  var activeCluster = null;
  var closeClusterTimer = null;
  var closeGeneration = 0;

  function scheduleCloseCluster() {
    if (!activeCluster) return;
    window.clearTimeout(closeClusterTimer);
    var generation = closeGeneration;
    closeClusterTimer = window.setTimeout(function () {
      if (generation !== closeGeneration) return;
      closeCluster(false);
    }, 80);
  }

  function cancelCloseCluster() {
    window.clearTimeout(closeClusterTimer);
    closeClusterTimer = null;
  }

  function closeCluster(returnFocus) {
    if (!activeCluster) return;
    cancelCloseCluster();
    var cluster = activeCluster;
    cluster.button.setAttribute("aria-expanded", "false");
    cluster.popover.hidden = true;
    cluster.popover.remove();
    activeCluster = null;
    if (returnFocus && cluster.button.isConnected) cluster.button.focus();
  }

  function getVisibleClusters() {
    var active = new Set(Array.prototype.map.call(
      root.querySelectorAll('#hzFilter input[type="checkbox"]:checked'),
      function (cb) { return cb.value; }
    ));
    var clusters = new Map();
    chinaExperts.forEach(function (expert) {
      if (!expert.provinceId || !active.has(expert.category)) return;
      if (!clusters.has(expert.provinceId)) {
        clusters.set(expert.provinceId, {
          id: expert.provinceId,
          name: expert.provinceName,
          coord: provinceCoordinates[expert.provinceId] || expert.coord,
          experts: [],
          categories: new Map()
        });
      }
      var cluster = clusters.get(expert.provinceId);
      cluster.experts.push(expert);
      cluster.categories.set(expert.category, (cluster.categories.get(expert.category) || 0) + 1);
    });
    return Array.from(clusters.values());
  }

  function openCluster(cluster, button, mode) {
    closeGeneration += 1;
    if (activeCluster && activeCluster.button === button) {
      if (mode === "click") {
        closeCluster(false);
        return;
      }
      cancelCloseCluster();
      return;
    }
    if (activeCluster) closeCluster(false);
    cancelCloseCluster();

    var popover = document.createElement("div");
    popover.className = "hz-cluster-popover";
    popover.id = "hz-cluster-popover-" + cluster.id;
    popover.setAttribute("role", "dialog");
    popover.setAttribute("aria-label", cluster.name + "专家列表");
    popover.innerHTML =
      '<div class="hz-cluster-popover__header"><strong>' + cluster.name + '</strong><span>' +
      cluster.experts.length + ' 位专家</span></div><ul></ul>';
    var list = popover.querySelector("ul");

    cluster.experts.forEach(function (expert) {
      var item = document.createElement("li");
      var expertButton = document.createElement("button");
      expertButton.type = "button";
      expertButton.className = "hz-cluster-expert";
      expertButton.dataset.category = expert.category;
      expertButton.innerHTML =
        '<span class="hz-cluster-expert__name">' + expert.name + '</span>' +
        '<span class="hz-cluster-expert__meta">' + (categoryNames[expert.category] || '') + ' · ' + expert.region + '</span>';
      expertButton.addEventListener("click", function () {
        closeCluster(false);
        openModal(expert);
      });
      item.appendChild(expertButton);
      list.appendChild(item);
    });

    root.querySelector("#chinaPins").appendChild(popover);
    var mapWidth = root.querySelector("#chinaPins").clientWidth;
    var mapHeight = root.querySelector("#chinaPins").clientHeight;
    var popoverWidth = Math.min(280, Math.max(220, mapWidth - 24));
    var buttonLeft = (parseFloat(button.style.left) / 100) * mapWidth;
    var buttonTop = (parseFloat(button.style.top) / 100) * mapHeight;
    popover.style.width = Math.min(popoverWidth, mapWidth - 24) + "px";
    var popoverHeight = popover.offsetHeight;
    popover.style.left = Math.max(12, Math.min(mapWidth - popover.offsetWidth - 12, buttonLeft - popover.offsetWidth / 2)) + "px";
    popover.style.top = buttonTop > popoverHeight + 20
      ? (buttonTop - popoverHeight - 20) + "px"
      : Math.min(mapHeight - popoverHeight - 12, buttonTop + 38) + "px";

    popover.addEventListener("mouseenter", cancelCloseCluster);
    popover.addEventListener("mouseleave", scheduleCloseCluster);
    button.addEventListener("mouseenter", cancelCloseCluster);
    button.addEventListener("mouseleave", scheduleCloseCluster);
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-controls", popover.id);
    popover.hidden = false;
    activeCluster = { button: button, popover: popover };
  }

  function createCluster(cluster, container) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "hz-cluster";
    button.dataset.province = cluster.id;
    button.style.left = cluster.coord.left + "%";
    button.style.top = cluster.coord.top + "%";
    button.setAttribute("aria-expanded", "false");

    var onlyExpert = cluster.experts.length === 1 ? cluster.experts[0] : null;
    if (onlyExpert) {
      button.setAttribute("aria-label", onlyExpert.name + "，1 位专家");
    } else {
      button.setAttribute("aria-label", cluster.name + "，" + cluster.experts.length + " 位专家");
    }
    var categoryList = Array.from(cluster.categories.keys());
    var primaryColor = onlyExpert
      ? (categoryColors[onlyExpert.category] || "#8B7355")
      : (categoryColors[categoryList[0]] || "#8B7355");
    button.style.setProperty("--cluster-color", primaryColor);
    button.classList.remove("hz-cluster--mixed");
    if (onlyExpert) button.classList.add("hz-cluster--single");

    if (onlyExpert) {
      button.innerHTML = '<span class="hz-cluster__count">1</span><span class="hz-cluster__name">' + onlyExpert.name + '</span>';
    } else {
      button.innerHTML = '<span class="hz-cluster__count">' + cluster.experts.length + '</span><span class="hz-cluster__name">' + (cluster.name || '').replace("省", "") + '</span>';
    }

    button.addEventListener("mouseenter", function () { openCluster(cluster, button, "hover"); });
    button.addEventListener("mouseleave", scheduleCloseCluster);
    button.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeCluster(true);
    });
    button.addEventListener("focus", function () { openCluster(cluster, button, "focus"); });
    button.addEventListener("click", function () { openCluster(cluster, button, "click"); });
    container.appendChild(button);
    return button;
  }

  function renderPins() {
    var chinaPins = root.querySelector("#chinaPins");
    closeGeneration += 1;
    cancelCloseCluster();
    closeCluster(false);
    chinaPins.innerHTML = "";
    getVisibleClusters().forEach(function (cluster) { createCluster(cluster, chinaPins); });
    root.dispatchEvent(new CustomEvent("hz:pins-rendered", { bubbles: true }));
  }

  // ===== 详情弹窗（沿用既有交互） =====
  var modal = root.querySelector("#hzModal");
  function openModal(expert) {
    var photoBox = root.querySelector("#mPhoto");
    var photoImg = root.querySelector("#mPhotoImg");
    var photoPh = root.querySelector("#mPhotoPh");
    if (expert.photo) {
      photoImg.src = expert.photo;
      photoImg.alt = expert.name;
      photoPh.textContent = "";
      photoBox.classList.remove("hz-placeholder");
    } else {
      photoImg.removeAttribute("src");
      photoPh.textContent = "照片待补充";
      photoBox.classList.add("hz-placeholder");
    }
    root.querySelector("#mName").textContent = expert.name;
    root.querySelector("#mRole").textContent = expert.role || expert.region;
    root.querySelector("#mWhy").innerHTML = "<strong>Why we reached out:</strong> " + (expert.why || "");
    root.querySelector("#mWhat").innerHTML = "<strong>Main takeaways:</strong> " + (expert.what || "");
    root.querySelector("#mHow").innerHTML = "<strong>Reflection & integration:</strong> " + (expert.how || "");
    root.querySelector("#mPhotoName").textContent = expert.name;
    root.querySelector("#mPhotoOrg").textContent = expert.org || expert.region;
    root.querySelector("#mPhotoDesc").textContent = expert.desc || "";
    modal.classList.add("show");
    root.querySelector("#hzModalClose").focus();
  }
  function closeModal() { modal.classList.remove("show"); }
  root.querySelector("#hzModalClose").addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });

  // ===== 筛选与全局事件 =====
  root.querySelector("#hzFilter").addEventListener("change", renderPins);
  document.addEventListener("click", function (event) {
    if (activeCluster && !activeCluster.popover.contains(event.target) && !activeCluster.button.contains(event.target)) {
      closeCluster(false);
    }
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeCluster(true);
  });

  var filterEl = root.querySelector("#hzFilter");
  var filterToggle = root.querySelector("#hzFilterToggle");
  filterToggle.addEventListener("click", function () {
    var isCollapsed = filterEl.classList.toggle("collapsed");
    filterToggle.setAttribute("aria-expanded", String(!isCollapsed));
    filterToggle.textContent = isCollapsed ? "+" : "−";
    filterToggle.setAttribute("aria-label", isCollapsed ? "展开筛选面板" : "收起筛选面板");
  });

  renderPins();
})();
