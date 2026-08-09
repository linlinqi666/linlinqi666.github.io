(function () {
  "use strict";
  // 所有元素都在 .hz-map 根容器内查找，迁移到其它页面不与宿主 DOM 冲突
  const root = document.getElementById("hzMap");

  /* 中国专家（坐标按 china.svg viewBox 百分比，由各市省会经纬度换算）
     category 用于筛选面板与头像边框着色 */
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
  const chinaExperts = window.HPMapExperts || [];

  /* 姓名首字母（去掉 Dr./Prof. 前缀） */
  function getInitial(name) {
    return name.replace(/^(Dr\.|Prof\.)\s*/, "").charAt(0).toUpperCase();
  }



  /* 图钉用 <button>，自带键盘可聚焦；悬停/聚焦显示姓名提示，中心落在坐标点 */
  function createPin(expert, container) {
    const pin = document.createElement("button");
    pin.type = "button";
    pin.className = "hz-pin";
    pin.dataset.category = expert.category;
    pin.style.left = expert.coord.left + "%";
    pin.style.top = expert.coord.top + "%";
    pin.style.setProperty("--pin-color", categoryColors[expert.category]);
    pin.setAttribute("aria-label", expert.name + " · " + expert.region + " · " + categoryNames[expert.category]);
    const initial = getInitial(expert.name);
    pin.innerHTML =
      '<span class="avatar">' + initial + '</span>' +
      '<span class="tip">' + expert.name + '</span>';
    pin.addEventListener("click", () => openModal(expert));
    container.appendChild(pin);
  }

  function renderPins() {
    const chinaPins = root.querySelector("#chinaPins");
    chinaPins.innerHTML = "";
    const active = Array.from(root.querySelectorAll('#hzFilter input[type="checkbox"]:checked')).map(cb => cb.value);
    chinaExperts.forEach(e => {
      if (active.includes(e.category)) createPin(e, chinaPins);
    });
  }

  root.querySelector("#hzFilter").addEventListener("change", renderPins);

  /* 筛选面板收起/展开 */
  const filterEl = root.querySelector("#hzFilter");
  const filterToggle = root.querySelector("#hzFilterToggle");
  filterToggle.addEventListener("click", () => {
    const isCollapsed = filterEl.classList.toggle("collapsed");
    filterToggle.setAttribute("aria-expanded", String(!isCollapsed));
    filterToggle.textContent = isCollapsed ? "+" : "−";
    filterToggle.setAttribute("aria-label", isCollapsed ? "展开筛选面板" : "收起筛选面板");
  });

  const modal = root.querySelector("#hzModal");
  function openModal(expert) {
    const photoBox = root.querySelector("#mPhoto");
    const photoImg = root.querySelector("#mPhotoImg");
    const photoPh = root.querySelector("#mPhotoPh");
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
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });



  renderPins();
})();
