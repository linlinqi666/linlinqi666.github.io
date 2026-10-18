# Human Practices 轮播组件

> 本文件由根目录 `README.md` 分册而来（2026-10-17）。内容未做改写，
> 仅按主题归位；与 `README.md` 冲突时以 `README.md` 的红线章节为准。

## 十二、清华大学 HP 轮播组件：当前结构与冻结 / 应改约定

> 本节为**当前磁盘真实状态**的快照（2026-08-02 核对），并明确"视觉效果冻结、仅功能缺陷可改"的边界。任何后续改动前先读本节。
> 核心原则：**针对视觉/外观/风格的改动一律冻结，不再动；只有"本该显示/响应却不显示/不响应"的功能性缺陷，才做最小修复且不改外观。**

### 12.1 当前文件与结构

**JS — `static/js/components/hp-carousel.js`（IIFE，绑定 `.hp-carousel`）：**
- `dataList`：6 条，图片用 `../static/image/HP/tsinghua/1.webp` … `6.webp`（2026-08-02 经 `tools/replace-tsinghua-images.js` 由 .jpg 替换，画面视觉效果不变），标题 `01 · 开幕现场`…`06 · 观众互动`。
- 启动时会**清空 scene 内已有 `.hp-carousel-card`**，再按 `dataList` 动态重建 `<figure><img>+<figcaption></figure>`。
- 常量：`n=6`、`step=60`、`TILT=0`、`r` 取自 `--r`（容器行内 `260px`，移动端 `175px`）。
- 卡片 transform 公式（**环形径向排列，无 billboard**）：`rotateY(i*step) translateZ(r) rotateX(-TILT)`；并为卡片设 `will-change:transform,opacity`（及过渡期间临时 `filter`）做合成层提升以消除旋转卡顿——纯性能优化，不影响任何视觉。
- 场景：`transform-style:preserve-3d`，`scene.style.transform = rotateX(TILT) rotateY(currentAngle)`，过渡 `0.65s`。
- `applyPerspective()`：按 `t`（0 最前 / 1 最后）设 `zIndex=round(100-100t)`、`opacity=1-0.5t`、当 `t>0.05` 时 `filter=blur(2t)`、前方 `t<0.5` 用棕色投影 `rgba(74,59,42,…)`，否则棕色 `rgba(74,59,42,0.5)`（原绿色投影 `rgba(31,107,83,…)` 已于 2026-08-02 去除）。
- 交互：`arrowR→spin(-1)`、`arrowL→spin(1)`、`card.click→goTo(base)`、悬停时方向键；`spin/goTo` 只改 `scene` 的 `rotateY`。

**HTML — `human-practices/integrated human-practices.html`（约 377–409 行）：**
- `.hp-carousel style="--r:260px"` → `.hp-carousel-stage` → `.hp-carousel-scene`（含 `.hp-carousel-ring` 虚线椭圆 + 6 个手写 `<figure class="hp-carousel-card">`，其 `<img>` 用 `.svg`：`tsinghua_carousel_1.svg`…`6.svg`）→ 左右箭头 `.hp-carousel-arrow` → `.hp-carousel-caption`。
- 下方为 `.hp-reveal-box` 详情区。
- **重要不一致**：手写 `<figure>` 用 `.svg`，但 JS 启动后用 `dataList` 的 `.jpg` 重建并覆盖它们，故**实际显示的是 `.jpg`**；手写 `.svg` 仅作占位/被覆盖。

**CSS — `static/css/integrated human-practices.css`（约 1415–1539 行）：**
- `.hp-carousel`：`perspective:850px`、`perspective-origin:50% 50%`。
- `.hp-carousel-scene`：绝对定位、`preserve-3d`、静态 `transform:rotateX(18deg)`（**但 JS 运行时被 `TILT=0` 覆盖为 `rotateX(0)`**）、`will-change:transform`、过渡 `0.65s cubic-bezier(.22,1,.36,1)`。
- `.hp-carousel-ring`：虚线椭圆（`rotateX(90deg)` 躺平），`border:2px dashed rgba(74,59,42,0.45)`（**棕色**，原绿色 `rgba(58,161,126,0.45)` 已于 2026-08-02 去除）。
- `.hp-carousel-card`：`270×200`、居中、`radius:12px`、`overflow:hidden`、`background:#e9e2d2`、边框 `3px rgba(246,241,231,.9)`、棕色 `box-shadow`；过渡含 `opacity / filter / box-shadow` 各 `0.65s`。
- `.hp-carousel-card img`：`100%×100%`、`object-fit:cover`。
- `.hp-carousel-card figcaption`：底部绝对定位，渐变 `rgba(31,38,26,0.8)→0`（**偏绿**），serif、奶油色字。
- 箭头 `48px` 圆，`hover` 背景 `var(--color-primary,#4a3b2a)`（**棕色**，原绿色 `var(--color-green,#3aa17e)` 已于 2026-08-02 去除）。
- 移动端 `--r:175px`、卡片 `140×95`；`prefers-reduced-motion` 关闭过渡。

### 12.2 冻结清单（视觉效果 — 禁止改动）

以下一律**冻结**，不得"顺手美化/统一/现代化"：
- **配色与主题**：轮播内绿光效果已于 2026-08-02 去除（JS 投影、虚线轨道环、箭头 hover 均由绿改为棕）。此后**禁止再引入绿色**到轮播；其余视觉（卡片外观、figcaption 渐变、模糊景深、动画）保持现状，不要改成其他风格。
- **模糊景深**：`card.style.filter=blur(...)` 空气透视保持。
- **环形 3D 结构**：卡片 transform 公式、`TILT=0`、`--r`(260/175)、`n=6`、`step=60` 全部冻结；**不要**加 billboard / 给 img 反向旋转去"让所有图正对镜头"。
- **动画与合成**：`transition .65s cubic-bezier`、box-shadow/filter 过渡、`scene` 上的 `will-change:transform` 保持。
- **卡片外观**：尺寸 `270×200`、圆角 `12`、边框、`#e9e2d2` 底、figcaption 样式、箭头样式、ring 虚线样式 冻结。
- **图片来源格式**：`dataList` 与 HTML 占位均用 `.webp`（`tsinghua/1.webp`…`6.webp`，2026-08-02 由 `tools/replace-tsinghua-images.js` 替换）；如需换图改 `dataList` 或重跑该脚本，保持 `.webp` 同图格式、勿改视觉尺寸/object-fit。

### 12.3 应改清单（功能 / 行为缺陷 — 仅最小修复，不动外观）

只有"本该显示/响应却不显示/不响应"的缺陷可改，且须最小、不改外观：
- **破图/不显示**：图片 src 拼写错、路径前缀错、文件真不存在导致破图（修路径/补文件，非改样式）。
- **交互失效**：箭头/点击/键盘无响应、事件未绑定。
- **数据错误**：文案错字、图片张数不符。
- **严重性能导致完全不可用**（如页面卡死无法滚动）：仅做最小、不改视觉的修复（例如只挪走某处 `will-change`，不动配色/模糊/结构）。

### 12.4 判断意识（改之前先问自己）

1. "让它更好看 / 更统一 / 更现代 / 更符合全局棕色主题" → **视觉改动 → 冻结，不做。**
2. "它本该显示/响应，现在不显示/不响应" → **功能 bug → 可改，且最小。**
3. 凡是涉及配色、模糊、环形结构、动画参数的调整，一律视为视觉改动，冻结。
4. **拿不准：先问用户，不要擅自改视觉。** 修功能 bug 也不要顺手"优化"外观。

### 12.5 已知未决问题（须用户拍板，非自由改动）

- **侧/后方卡片显示空白**：卡片转至侧/背面时看到的是元素背面，HTML 背面不渲染 `<img>`，只留米色底+文字（即用户反馈的"左右两边卡片不显示"）。任何修复（billboard / 给 img 反向旋转）都会改变视觉呈现，属 12.2 冻结范畴，**须用户明确同意后才可动**；当前按现状冻结。

### 12.6 文档纠正

- 第五节 5.8 与第八节提到的 `hp-perspective-carousel.js` 已不准确；当前实际文件为 `static/js/components/hp-carousel.js`（3D 圆环轮播，非拖动式）。后续以本节的 `hp-carousel.js` 为准。

---
