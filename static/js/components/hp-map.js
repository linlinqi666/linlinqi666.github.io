(function () {
  "use strict";
  window.HPMapLoaded = true;

  function initMap() {
    var pinLayer = document.getElementById('chinaPins');
    if (!pinLayer) return;
    pinLayer.setAttribute('aria-live', 'polite');
  const root = document.getElementById("hzMap");
  if (!root || root.dataset.initialized === "true") return;
  root.dataset.initialized = "true";

  const categoryNames = {
    science: "Science and academia",
    policy: "Policy",
    industry: "Industry",
    public: "Public"
  };
  const categoryColors = {
    science: "#4A90E2",
    policy: "#E94B3C",
    industry: "#9013FE",
    public: "#F5A623"
  };
  const provinceCoordinates = {
    "CN-44": { top: 83.5, left: 66.0 },
    "CN-33": { top: 70.0, left: 78.0 }
  };
  const chinaExperts = [
    {
      slug: "wang-wenjie",
      name: "王文杰",
      provinceId: "CN-44",
      provinceName: "广东省",
      region: "Shenzhen, Guangdong",
      category: "industry",
      coord: { top: 79.5, left: 69.0 },
      photo: "../static/image/HP/expert_img/wangwenjie.jpg",
      org: "深圳市妇幼保健院 · 南方科技大学医学院",
      role: "检验科主任 · 教学督导",
      desc: "长期从事新型生物学诊断标志物、肿瘤与自噬等方向研究；担任多个医学检验相关专业委员会职务，在临床检验与体外诊断领域具有丰富经验。",
      why: `为了弄清甲型流感病毒检测在真实医疗环境里到底需要满足哪些需求，也为了进一步确认我们"基于工程化酵母的甲型流感病毒生物传感器"项目究竟有什么用，我们访谈了一位临床检验专家。访谈里，我们聊了甲型流感病毒的变异特点、现有检测技术的局限、抗病毒治疗策略，以及检测设备往后的发展方向。`,
      what: `甲型流感病毒主要通过血凝素（HA）和神经氨酸酶（NA）蛋白发生变异，而当前医院检测的重点主要在于判断病毒感染情况，而非区分具体亚型。现有核酸检测和快速抗原检测通常需要在患者出现症状并达到一定病毒载量后才能发挥作用，检测技术的发展仍存在一定滞后性。未来检测技术的重点不只是认出病毒种类，而是在更早就发现病毒的存在；如果在学校、幼儿园、地铁这类人员密集场所做环境监测、提前捕捉传播迹象，公共卫生管理就有机会从"被动治疗"转向"主动预防"。专家也提醒我们充分考虑实际应用中的限制因素，例如检测范围、环境变量以及病毒浓度变化等问题，并建议在后续实验设计中进一步控制变量、明确应用场景。`,
      how: "这次交流把实验室里的工程设计和真实的临床需求连了起来。专家的话让我们重新打量传感器的检测目标：与其死磕病毒亚型识别，不如去做更广谱、更快、更省事的病毒监测方案。和一线临床专家聊过之后我们也更清楚了，一个真正用得上的生物技术产品，光在实验室里把性能磨好还不够，得先接住现实里的医疗需求和公共健康挑战。"
    },
    {
      slug: "gu-kai",
      name: "顾凯",
      provinceId: "CN-44",
      provinceName: "广东省",
      region: "Guangzhou, Guangdong",
      category: "science",
      coord: { top: 73.0, left: 63.5 },
      photo: "../static/image/HP/expert_img/fukai.jpg",
      org: "中山大学",
      role: "临床医学博士",
      desc: "研究方向涉及肺部疾病、呼吸道感染与临床诊断，就本项目的技术可行性与临床应用场景提出了系统性建议。",
      why: `为验证我们"基于工程化酵母的甲型流感病毒生物传感器"项目的技术可行性与临床适配性，团队向一位中山大学临床医学博士介绍了项目的三大模块（信号识别、信号传导、信号报告）与两种装置形态（环境被动吸入 / 单人主动呼气），并就技术方案、临床应用场景及未来拓展方向展开深入交流。`,
      what: `专家围绕核心技术提出了荧光是否实时上传、能否裸眼观察、荧光（1-2 小时）与蓝白斑表达时间差异、酵母存活周期（复苏后 2-3 天活性高峰、可维持 1-2 周）与培养基更换、装置整体成本（主动呼气模式预计约 10 元）等关键问题，并比较了项目相对 PCR / 试纸条"操作便捷、灵敏度高、假阳性率低"的差异化优势。在团队请教部分，专家解答：呼吸道感染者呼出气体含病毒气溶胶，本装置对该人群检测效果更好；呼吸道黏膜受损后病毒更易侵入但会被免疫清除，呈动态变化；甲流不诱发肺癌但会加重已患肺癌者病情；肺癌标志物特异性不足、低剂量螺旋 CT 仍是金标准，呼气检测肺癌尚处实验阶段；基层推广的关键在于成本可控。专家综合评价该技术"用有机生物检测另一有机生物"构思新颖，并给出四点建议：提升检测时效性、坚定单人呼气模式、成本决定基层可行性、与呼吸科及生物医学工程等多领域专家交叉访谈。`,
      how: `这次交流形成了明确的项目反馈闭环：检测响应 1-2 小时偏长 → 优化信号通路缩短响应时间；呼气样本病毒更富集 → 主推单人呼气模式并辅以富集装置；肿瘤标志物特异性不足 → 暂缓肺癌检测、聚焦呼吸道病毒；成本是基层推广的决定因素 → 聚焦主动呼气低成本方案。专家认可了项目技术方向，并使"单人呼气模式在临床可行性上优于环境采样"成为后续设计的核心依据，后续将着力压缩检测响应时间、控制硬件成本，并审慎评估应用场景的临床适配性。`
    },
    {
      slug: "zhejiang-expert",
      name: "Zhejiang Expert",
      provinceId: "CN-33",
      provinceName: "浙江省",
      region: "Zhejiang",
      category: "science",
      coord: { top: 54.0, left: 81.0 },
      photo: "",
      org: "Zhejiang",
      role: "Placeholder: expert title will be added here.",
      desc: "Placeholder: expert bio will be added here.",
      why: "Placeholder: why we reached out will be added here.",
      what: "Placeholder: what the expert said will be added here.",
      how: "Placeholder: how the expert influenced us will be added here."
    }
  ];

  function getInitial(name) {
    return name.replace(/^(Dr\.|Prof\.)\s*/, "").charAt(0).toUpperCase();
  }

  // 专家详情卡与地图是同一篇文章中的相邻区块，不能限制在 #hzMap 内查询。
  const articleSlide = root.closest(".detail-slide");
  const detailCard = articleSlide && articleSlide.querySelector(".hz-details-card.hz-details");
  const detailPanel = detailCard && detailCard.querySelector("#hzDetailPanel");
  const detailViewport = detailCard && detailCard.querySelector("#hzDetailViewport");
  const detailTrack = detailCard && detailCard.querySelector("#hzDetailTrack");
  const detailsIntro = detailCard && detailCard.querySelector("#hzDetailsIntro");
  if (!detailCard || !detailPanel || !detailViewport || !detailTrack || !detailsIntro) {
    console.warn("[HP map] 未找到专家详情容器，地图图钉交互未初始化。");
    return;
  }
  const detailSlides = Array.from(detailTrack.querySelectorAll(":scope > .hz-detail-slide"));
  const detailSlidesByExpert = new Map();
  detailSlides.forEach(slide => {
    const slug = slide.dataset.hzExpert;
    if (!slug || detailSlidesByExpert.has(slug)) {
      console.warn("[HP map] 忽略缺失或重复 data-hz-expert 的专家详情。", slide);
      return;
    }
    detailSlidesByExpert.set(slug, slide);
  });

  function syncOuterArticleHeight() {
    window.dispatchEvent(new CustomEvent("hp:content-resize"));
  }

  let activeCluster = null;
  let closeClusterTimer = null;

  function scheduleCloseCluster() {
    window.clearTimeout(closeClusterTimer);
    closeClusterTimer = window.setTimeout(() => closeCluster(false), 80);
  }

  function closeCluster(returnFocus) {
    if (!activeCluster) return;
    const { button, popover } = activeCluster;
    button.setAttribute("aria-expanded", "false");
    popover.hidden = true;
    popover.remove();
    activeCluster = null;
    if (returnFocus && button.isConnected) button.focus();
    syncOuterArticleHeight();
  }

  function selectExpert(expert, pin) {
    const slide = detailSlidesByExpert.get(expert.slug);
    if (!slide) {
      console.warn("[HP map] 未找到专家“" + expert.slug + "”的详情，无法切换。");
      return;
    }
    const slideIndex = detailSlides.indexOf(slide);
    detailPanel.hidden = false;
    detailsIntro.hidden = true;
    detailTrack.style.transform = "translate3d(" + (-slideIndex * detailViewport.clientWidth) + "px, 0, 0)";
    detailViewport.style.height = slide.offsetHeight + "px";
    detailSlides.forEach((item, index) => {
      const active = index === slideIndex;
      item.setAttribute("aria-hidden", active ? "false" : "true");
      item.inert = !active;
    });
    root.querySelectorAll(".hz-cluster").forEach(item => item.classList.toggle("is-active", item === pin));
    detailPanel.setAttribute("aria-label", expert.name + "的访谈记录");
    syncOuterArticleHeight();
  }

  function getVisibleClusters() {
    const active = new Set(Array.from(root.querySelectorAll('#hzFilter input[type="checkbox"]:checked')).map(cb => cb.value));
    const clusters = new Map();
    chinaExperts.forEach(expert => {
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
      const cluster = clusters.get(expert.provinceId);
      cluster.experts.push(expert);
      cluster.categories.set(expert.category, (cluster.categories.get(expert.category) || 0) + 1);
    });
    return Array.from(clusters.values());
  }

  function openCluster(cluster, button, mode) {
    window.clearTimeout(closeClusterTimer);
    if (activeCluster && activeCluster.button !== button) closeCluster(false);
    if (activeCluster && activeCluster.button === button && mode === "click") {
      closeCluster(false);
      return;
    }
    const popover = document.createElement("div");
    popover.className = "hz-cluster-popover";
    popover.id = "hz-cluster-popover-" + cluster.id;
    popover.setAttribute("role", "dialog");
    popover.setAttribute("aria-label", cluster.name + "专家列表");
    popover.innerHTML = '<div class="hz-cluster-popover__header"><strong>' + cluster.name + '</strong><span>' + cluster.experts.length + ' 位专家</span></div><ul></ul>';
    const list = popover.querySelector("ul");
    cluster.experts.forEach(expert => {
      const item = document.createElement("li");
      const expertButton = document.createElement("button");
      expertButton.type = "button";
      expertButton.className = "hz-cluster-expert";
      expertButton.innerHTML = '<span class="hz-cluster-expert__name">' + expert.name + '</span><span class="hz-cluster-expert__meta">' + categoryNames[expert.category] + ' · ' + expert.region + '</span>';
      expertButton.addEventListener("click", () => {
        closeCluster(false);
        selectExpert(expert, button);
      });
      item.appendChild(expertButton);
      list.appendChild(item);
    });
    root.querySelector("#chinaPins").appendChild(popover);
    const mapWidth = root.querySelector("#chinaPins").clientWidth;
    const mapHeight = root.querySelector("#chinaPins").clientHeight;
    const popoverWidth = Math.min(280, Math.max(220, mapWidth - 24));
    const buttonLeft = (parseFloat(button.style.left) / 100) * mapWidth;
    const buttonTop = (parseFloat(button.style.top) / 100) * mapHeight;
    popover.style.width = Math.min(popoverWidth, mapWidth - 24) + "px";
    const popoverHeight = popover.offsetHeight;
    popover.style.left = Math.max(12, Math.min(mapWidth - popover.offsetWidth - 12, buttonLeft - popover.offsetWidth / 2)) + "px";
    popover.style.top = buttonTop > popoverHeight + 20 ? buttonTop - popoverHeight - 20 + "px" : Math.min(mapHeight - popoverHeight - 12, buttonTop + 38) + "px";
    popover.addEventListener("mouseenter", () => window.clearTimeout(closeClusterTimer));
    popover.addEventListener("mouseleave", scheduleCloseCluster);
    button.addEventListener("mouseleave", scheduleCloseCluster);
    root.querySelector("#chinaPins").addEventListener("mouseleave", scheduleCloseCluster);
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-controls", popover.id);
    popover.hidden = false;
    activeCluster = { button, popover };
    syncOuterArticleHeight();
  }

  function createCluster(cluster, container) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "hz-cluster";
    button.dataset.province = cluster.id;
    button.style.left = cluster.coord.left + "%";
    button.style.top = cluster.coord.top + "%";
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", cluster.name + "，" + cluster.experts.length + " 位专家");
    const categoryList = Array.from(cluster.categories.keys());
    button.style.setProperty("--cluster-color", categoryColors[categoryList[0]] || "#8B7355");
    button.classList.remove("hz-cluster--mixed");
    button.innerHTML = '<span class="hz-cluster__count">' + cluster.experts.length + '</span><span class="hz-cluster__name">' + cluster.name.replace("省", "") + '</span>';
    button.addEventListener("mouseenter", () => openCluster(cluster, button, "hover"));
    button.addEventListener("mouseleave", scheduleCloseCluster);
    button.addEventListener("keydown", event => {
      if (event.key === "Escape") closeCluster(true);
    });
    button.addEventListener("focus", () => openCluster(cluster, button, "focus"));
    button.addEventListener("click", () => openCluster(cluster, button, "click"));
    container.appendChild(button);
    return button;
  }

  function renderPins() {
    const chinaPins = root.querySelector("#chinaPins");
    closeCluster(false);
    chinaPins.innerHTML = "";
    getVisibleClusters().forEach(cluster => createCluster(cluster, chinaPins));
    root.dispatchEvent(new CustomEvent("hz:pins-rendered", { bubbles: true }));
  }

  if (typeof ResizeObserver === "function") {
    new ResizeObserver(() => {
      const activeSlide = detailSlides.find(slide => slide.getAttribute("aria-hidden") === "false");
      if (activeSlide && !detailPanel.hidden) {
        detailViewport.style.height = activeSlide.offsetHeight + "px";
        syncOuterArticleHeight();
      }
    }).observe(detailTrack);
  }

  root.querySelector("#hzFilter").addEventListener("change", renderPins);
  document.addEventListener("click", event => {
    if (activeCluster && !activeCluster.popover.contains(event.target) && !activeCluster.button.contains(event.target)) closeCluster(false);
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeCluster(true);
  });

  const filterEl = root.querySelector("#hzFilter");
  const filterToggle = root.querySelector("#hzFilterToggle");
  filterToggle.addEventListener("click", () => {
    const isCollapsed = filterEl.classList.toggle("collapsed");
    filterToggle.setAttribute("aria-expanded", String(!isCollapsed));
    filterToggle.textContent = isCollapsed ? "+" : "−";
    filterToggle.setAttribute("aria-label", isCollapsed ? "展开筛选面板" : "收起筛选面板");
  });

  renderPins();
  }

  // 直接初始化：DOM 就绪后立即渲染图钉，避免 IntersectionObserver 与 content-visibility 等优化策略冲突导致图钉不显示。
  initMap();
})();

