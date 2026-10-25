# 页面框架与组件结构（骨架 / 导航 / 侧边栏 / 卡片 / 移动端）

> 本文件由根目录 `README.md` 分册而来（2026-10-17）。内容未做改写，
> 仅按主题归位；与 `README.md` 冲突时以 `README.md` 的红线章节为准。

## 五、页面框架与组件结构

### 5.1 整体布局骨架

`body` 采用 `display:flex; flex-direction:column; min-height:100vh`。所有页面统一包含：固定顶栏 `<nav>`（高 100px，背景米黄 `var(--bg-dropdown)`，已移除背景模糊）、顶部阅读进度条（page-progress）、侧边滚动进度条（scroll-progress，部分页）、`<main>` 主内容区、底部 `<section id="footer" class="section-footer">`（背景 `#4A90E2` 蓝，footer 专属）。

### 5.2 顶部导航栏（navigation.css + nav-scroll-behavior.js）

- `nav`：`position:fixed; top:0; z-index:9999; height:6.25rem`（滚动后 `.scrolled` 缩为 `5rem` 并加阴影）；背景 `var(--bg-dropdown)`（米黄主色），不使用 `filter` / `backdrop-filter`。
- 采用"图标字体 + 下拉"的 mega-menu 结构：主栏目（Home/Project/Team/Dry Lab/Wet Lab/Human Practices）用 iconfont 字形，每个主栏目下挂子页面图标/链接。
- 行为脚本 `nav-scroll-behavior.js` 实现：下滑隐藏（`.nav-hidden`）、上滑显示、滚动到一定位置加 `.scrolled`。**该脚本为全局必需，禁止移除。**

### 5.3 内容页侧边栏 + 烧瓶进度（description.css + sidebar-progress.js）

- 标记：`<aside class="description-sidebar">`，实测背景 `rgba(255,252,247,0.95)`，宽度 `--desc-sidebar-min-width`～`--desc-sidebar-max-width`（17.5–20rem）。
- 内嵌基于烧瓶液体的阅读进度可视化（`--desc-flask-*` 系列令牌，由 `sidebar-progress.js` 驱动随滚动上升）。
- `description.css` 中明确标注：`--desc-sidebar-position: sticky`、`--desc-sidebar-top-offset:120px` 等为"绝对不能改（navigation.css 会接管）"的关键配置。
- **装载范围（2026-10-21 校准）**：除首页、Members、Attributions 外，其余内容页都走这套侧栏——`description` / `design` / `engineering` / `contribution` / `model` / `hardware` / `protocol` / `results` / `parts` / `safety-and-security` / `notebook` / `integration human-practices` / `sustainability`，两站各 13 页。
- **每个侧栏都必须带酵母装饰层**：`<div class="yeast-decoration">` 内含 3 个 `.yeast-cell` + 3 个 `.bubble`，`position:absolute; inset:0` 铺满卡片、`overflow:hidden` 裁在圆角内、`pointer-events:none` 只作背景，目录内容 `.description-nav-wrapper` 抬到 `z-index:1`。
- **高度限制**：`.description-sidebar` 上 `display:flex` + `flex-direction:column` + `max-height: calc(100vh - 12rem)` + `overflow:hidden`；目录区 `flex:1 1 auto` + `min-height:0` + `overflow-y:auto` 自己滚，底部进度块常驻。这四个声明写在 `navigation.css`，两个工程必须一致。

### 5.4 进度条组件

- **顶部页面进度条**（page-progress-bar）：横贯顶部，蓝色 `#4a90e2`，由 `page-progress-bar.js` 驱动。
- **侧边滚动进度条**（scroll-progress-bar）：竖条，棕色系，由 `scroll-progress-bar.js` 驱动。两者均为全局组件，CSS 位于 `static/css/components/`。

**2026-10-15 侧边进度条两项改动（用户反馈）**：

1. **修复「收纳条展开后进度提前拉满」**：旧实现把 `scrollHeight/clientHeight` 缓存在 `metrics` 里，
   只在 init/resize/load 刷新；收纳条（`details.section-fold`）展开会改变整页高度，缓存失真后
   `scrollTop / (缓存高度 - 视口)` 就会在中途算出 100%。现改为：
   - 新增 `ResizeObserver`（观察 `documentElement` / `body` / 内部滚动容器及其内容子树）+
     `MutationObserver`（`class`/`style`/`open`/`hidden` 变化兜底，进度条自身的 style 写入会被过滤）
     → 布局一变即刷新缓存尺寸并重算；滚动热路径仍只读 `scrollTop`，不违反约束 15。
   - **只有真正触底（距底部 ≤2px）才给 100%**，其余情况最高 99%，杜绝中途满格。
   - 暴露 `ScrollProgressBar.refresh()`，供折叠类组件在改布局后主动刷新。
   - 实测（1440×900，`dry-lab/hardware`）：展开 6 个收纳条后 `totalHeight` 13619→16060 自动同步；
     `max-400`→97%、`max-60`→99%、`max-1`/触底→100%、半程→50%。
2. **进度条上下两端新增「快速滚动」隐形触区**（用户提案，同日按用户口径简化——**可见小三角方案已废弃**）：
   `js/components/scroll-speed-control.js` + `navigation.css` 内 `.scroll-speed-control` 段。
   - 视觉：**无任何可见图形**（2026-10-15 用户拍板"不要小三角"），只保留隐形触区。
   - 判定区：**隐形**约 100×100px，右贴视口；宽度由 JS 实测「正文右边界到视口右缘的留白」决定
     （`--ssc-gutter`），**保证永不压住正文**；留白 <44px 挂 `.is-tight` 不启用；≤900px 由媒体查询关闭。
     实测 1920 宽 = 100×100、1440 宽 = 52×52（正文右边界 1388 → 触区 1388–1440，`overlap:false`）。
   - 提示：2026-10-15 二次简化——**连提示文字也去掉**，控件为纯隐形触区（无任何可见图形与文字），
     `z-index:100000` 已无提示覆盖之忧；点击/按住即滚动。
   - 点击/按住 = 滚动，按住为有加速度快滚，**加速慢、减速快**：加速时间常数 0.85s、减速 0.10s。实测时间线
     （velocity px/s）：152ms→484、453→1234、755→1761、1055→2130；滚到边界 260ms 无位移自动停机
     （protocol 页实测触底 y=1367=max 正确停机），速度归零即停 rAF（约束 16）。
   - **关键坑（已修）**：站点全局 `html{scroll-behavior:smooth}` 会把逐帧 `scrollBy` 变成一次次平滑动画
     （帧帧重启，3 秒只挪 44px）。组件在按住期间临时把根滚动器 `scroll-behavior` 置 `auto`
     （`setInstantScrollMode`），并统一用 `scrollBy({behavior:'instant'})`，完全停下后还原。
   - 中断源：松手 / 指针取消或离开 / 失焦 / 切标签页 / Esc / 滚轮触摸介入 / resize → 立刻减速停机。
   - flask 站同步：该站的滚动进度条逻辑此前**内联在 `wiki/layout.html`**（同一缓存缺陷），已迁出为
     `igem2026-flask/static/js/core/scroll-progress-bar.js` 并在脚本区挂载；同时补上了该站
     **一直缺失的进度条 markup**（此前只有 CSS/JS，元素从未渲染），并挂上快滚组件。

### 5.5 内容卡片与区块

- `.content-section` 容器：`max-width:1200px`、居中、内嵌 `section` 卡片（背景 `--color-bg-gray`、圆角 `md`、轻棕阴影）。
- description.css 提供 `--desc-*` 卡片、高亮块、边框体系，供内容页复用。

### 5.6 浮层装饰（description.css）

`.description-float-art` 为 `fixed` 全屏装饰层（`pointer-events:none`，`z-index:11`），承载两侧随滚动进入视口的 SVG/DOM 装饰（`.df-art`），打破长文节奏。**其 `overflow-x:clip` 与 `z-index` 是经过测算的，不能随意改。**

### 5.7 移动端（mobile.css + mobile-menu.js）

- `mobile.css` **完全接管**移动端菜单与响应式，必须最后加载以覆盖前述样式。`index.css` 中刻意不写移动端样式以避免冲突。
- `mobile-menu.js` 负责汉堡菜单开合。

### 5.8 HP 特殊交互组件

- `hp-reveal-box.js`：滚动揭示盒子（淡入/位移）。
- `hp-flat-carousel.js`：根目录历史静态站点 HP 页顶部平面轮播导航；读取 `#detailTrack` 下四个带 `data-hp-article` 的详情 slide，动态生成可点击跳转卡片。官方 Flask HP 页使用 `hp-timeline.js` 与 `hp3d-root` / `dual-stage` / `cardsGroup` 容器，二者不可混用。
- `hp-carousel.js`：历史 3D 圆环轮播组件。当前 `integrated human-practices.html` 未输出 `.hp-carousel` DOM，因此该页不加载此脚本；如需恢复，须同时补齐有效标题、`alt` 与键盘交互的轮播结构，并复核图片路径。
