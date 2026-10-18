# JS 架构与子系统（搜索 / 首页分屏 / GIF 开场）

> 本文件由根目录 `README.md` 分册而来（2026-10-17）。内容未做改写，
> 仅按主题归位；与 `README.md` 冲突时以 `README.md` 的红线章节为准。

### 5.9 JavaScript 架构原则

- `core/utils.js` 是一个 IIFE 公共工具库（含 `debounce`、`getScrollPosition`、被动事件检测等），被所有脚本共享，**必须最先加载**。
- 所有脚本应以 IIFE 或命名空间封装，避免污染全局；除 `utils.js` 外不依赖具体加载顺序。
- 组件脚本（sidebar-progress、hp-*）仅在其对应页面加载；页面脚本（members、attributions）同理。

### 5.10 JS 组件实现原理速查

下表按文件说明各脚本的作用、关键实现技术与性能特征（截至 2026-08-07）。所有脚本均为 IIFE / 命名空间封装，依赖 `utils.js` 提供的 `rafThrottle` / `debounce` / `detectScrollContainer` / `supportsPassiveEvents`，并以 `defer` 在 `<head>` 加载。

| 文件 | 作用 | 关键实现 | 性能特征 |
|---|---|---|---|
| `core/utils.js` | 公共工具库 | `rafThrottle`、`debounce`、`detectScrollContainer`、`supportsPassiveEvents`、rAF 安全降级 | 基础设施，最先加载 |
| `core/nav-scroll-behavior.js` | 导航栏下滑隐藏/上滑显示 | rAF 节流 + passive 监听 + 自动检测滚动容器 + resize debounce | 良好；未在滚动中同步读布局 |
| `core/page-progress-bar.js` | 顶部加载进度条 | 单 rAF 批处理 width 写入 + trickle 定时器 + 自动隐藏 | 良好 |
| `core/scroll-progress-bar.js` | 侧边滚动进度条 | `utils.rafThrottle` + passive + resize debounce；**`init`/`resize`/`load` 时缓存 `scrollHeight`/`clientHeight`，热路径只读 scrollY** | 已优化（原每帧读 scrollHeight/clientHeight 为重排主因之一，见十四） |
| `core/mobile-menu.js` | 移动端汉堡菜单 | rAF 开关、body overflow 锁、debounced resize、ARIA | 良好 |
| `components/sidebar-progress.js` | 侧边栏烧瓶进度 + TOC 高亮 | rAF 节流；**init/resize/load 时缓存各 section 绝对偏移**，滚动期仅比对 scrollY（不再每帧 `getBoundingClientRect`） | 已优化（原每帧读布局为重排主因之一，见十四）；**可识别 section 由 `sectionIdPrefixes` 白名单控制**，新增页面或新层级（如 2026-09-26 拆分的 Design / Protocol 页）必须把对应 `id` 前缀追加进白名单，否则 TOC 只能高亮到模块级而无法下钻到具体模块。 |
| `components/hp-flat-carousel.js` | HP 顶部平面轮播导航 | 从 `#detailTrack` 注册四张 `.detail-slide[data-hp-article]`，动态生成可点击文章卡片并通过 `goTo` 切换详情 | 仅 HP 页加载；使用属性选择器兼容嵌套结构，避免因首项元数据缺失导致整组卡片不初始化 |
| `components/hp-carousel.js` | 历史 3D 圆环轮播 | 卡片径向排列 + `will-change` 提升合成层；交互透视计算合并进单个 rAF；过渡期临时提升 filter 层、结束释放 | 当前未被页面引用；恢复前须先补齐 DOM 与可访问性文本 |
| `components/hp-reveal-box.js` | HP 下拉揭示盒 | Pointer 事件、尊重 `prefers-reduced-motion`、高度动画、debounced resize | 良好 |
| `components/executive-summary-animation.js` | 首页 10 屏滚动驱动 + 酵母浮动 + 打字机 + 滚动渐入 | 用 IntersectionObserver 仅在接近视口时挂 scroll 监听；酵母浮动 SVG **离屏时 `animation-play-state:paused`**；`prefers-reduced-motion` 时跳过浮动/打字机/渐入，直接显示内容 | 已优化（见十四、见 5.12） |
| `components/index-intro-gif.js` | 首页 GIF 开场动画（第一屏全屏，播完才显示导航栏） | IIFE；时长写在 `data-duration` 上（GIF 无限循环，无播放结束事件）；下一帧用 `new Image()` 预取进 HTTP 缓存，切帧时才赋 `src` 以保证从第 1 帧起播；每帧 20s 下载超时兜底 | 仅首页加载；无 JS / reduced-motion / 脚本 404 时整段跳过（见 5.13） |
| `pages/members.js` | 成员页数据驱动渲染 + 双图背景交叉淡入 | DocumentFragment 渲染、ResizeObserver、rAF 节流 resize/scroll、rail 仅在可见时更新 | 良好 |
| `pages/attributions.js` | 卡片筛选 + 时间线双面板 + Tooltip + ScrollSpy | 筛选/面板切换、Tooltip 用 MutationObserver、`ScrollSpy` 用 rAF 节流 | 基本良好；MutationObserver 在全站 body 上略有开销 |
| `core/search.js` | 全站搜索 | 懒加载索引、debounced 输入、Esc/外部点击关闭 | 良好 |
| `core/search-index.json` | 搜索索引（生成物） | 全站页面分块文本 + 图片记录，**约 217KB** | 用户首次打开搜索时由 `search.js` 经 `fetch()` 按需加载 |
| `core/search-index-generator.js` | 索引生成器（Node） | 扫描 `PAGES` 生成 `search-index.json` | 构建期运行 |
| `hp-timeline-3d.js` | 3D 时间轴圆环引擎 | 3D 径向编排；**rAF 收敛即停、交互时 `kick()` 重启** | 已优化；当前未被任何页面引用（孤儿，见十四） |

### 5.11 搜索子系统（search.js + search-index.json）

`search.js` 在导航栏提供搜索入口，首次打开时通过同源 `fetch()` 异步加载 `static/js/core/search-index.json`（约 217KB）：索引不再由页面 `<head>` 预置，也不再以 `<script>` 注入全局变量，以避免每个页面预载数据且消除 XSS 风险；索引由 `static/js/core/search-index-generator.js` 在构建期扫描全站页面正文与图片生成：

```powershell
cd "f:\IGEM\SZPU-2026 wiki"
node static/js/core/search-index-generator.js
```

搜索逻辑为本地线性匹配（含图片文件名/alt），结果按页面分组、以 `document.createElement` + `textContent` + 受控 `<mark>` 安全渲染（**不使用 `innerHTML`**），支持高亮，点击跳转对应页面。重复搜索复用同一加载 Promise，JSON 失败回退空索引。索引体积较大，保持按需懒加载，禁止同步阻塞 `<head>`（见十四）。

### 5.12 首页分屏结构（index.njk + index.css）

首页 `index.njk` 为**全屏滚动叙事页**，由 11 个 `presentation-section`（`.yeast-screen`）分屏组成，每屏 `min-height:100vh` 且 flex 垂直水平居中（**屏序已于 2026-10-01/03 重排，2026-10-13 在 human-practices 与 statistics 之间新增 `#passive-to-active`**，见下方表格实际顺序）：

| 屏 ID | 内容 | 背景（`--section-bg-img`） |
|---|---|---|
| `#hero` | 标题 + 副标题 + Start Journey | `画板+1.webp` |
| `#influenza-burden` | 甲流负担（数据沉浸屏：实时感染计数器 ≈21 人/秒持续跳动 + 12 席位网格 + 三年占比表 + 来源注脚；数据与算法见 `Requirements/REQ-20261003-001.md`） | `--color-echo-bg` |
| `#public-health` | 背景/痛点 | `画板+2.webp` |
| `#project-intro` | 项目简介 | `画板+3.webp` |
| `#dbtl-cycle` | 设计-构建-测试-学习 | `画板+4.webp` |
| `#statistics` | 实验结果 | `画板+5.webp` |
| `#safety` | 生物安全 | `画板+6.webp` |
| `#human-practices` | 人类实践 | `画板+7.webp` |
| `#passive-to-active` | 被动→主动过渡屏（2026-10-13 新增：左 EchoYeast 采样插画 + 中缝竖向虚线长线 + 右文案自下而上渐入，引出下一屏三个现有检测方法；详见 §5.17 同日条目） | `--color-echo-bg`（与其他屏一致） |
| `#future-vision` | 未来愿景 | 复用 `画板+7.webp` |
| `#team-highlight` | 团队亮点 | 暖棕渐变（无画板） |
| `#final-cta` | 8 个 Wiki 门户导航（`.portal-grid`/`.portal-card` 毛玻璃卡片） | 暖棕渐变（无画板） |

**关键布局约定：**
- `.yeast-screen` 基础规则：`min-height:100vh; display:flex; align-items:center; justify-content:center`（**务必保留，否则内容贴顶**——2026-08-26 曾因该选择器缺失导致全屏内容贴顶）。
- 背景统一由 `#hero,...,#final-cta` 组选择器施加：`linear-gradient(rgba(255,255,255,0.55),rgba(255,255,255,0.55))` 浅遮罩 + `var(--section-bg-img)`，`background-size:cover` 居中、`background-attachment:scroll`（移动端避免 fixed 渲染问题）。
- `.yeast-screen__content` 单栏居中（最大宽 760px），移动端改为左对齐满宽。
- 动画由 `executive-summary-animation.js` 驱动（酵母浮动、打字机、滚动渐入），`prefers-reduced-motion` 时跳过浮动/打字机/渐入，直接显示内容并即时定位锚点。
- 背景图缺失 `}` 或嵌套语法错误会导致浏览器丢弃后续规则（见第七.9 关联修复）；任何 CSS 改动须保持括号配对。

### 5.13 首页 GIF 开场动画（index.njk 模块 0 + index-intro-gif.css / index-intro-gif.js）

首页进入时先播放一段占满第一屏的 GIF 开场动画，**单张 GIF 播完后导航栏才出现**。

| 素材 | 尺寸 | 单轮时长 | 顺序 |
|---|---|---|---|
| `static/image/Animation/index/gif/boot-animation.webp`（动画 WebP，2026-10-09 由 29.1MB 的 `boot animation.GIF` 转码降载：960×540 / 1.26MB，帧时长原样保留，浏览器解码成本降一个量级） | 960×540 | 9.2s | 第 1 段 |

**状态机（全部由 `<html>` 上的类驱动）：**

| 类 | 添加者 | 作用 |
|---|---|---|
| 无类 | — | 不播放，导航栏按原逻辑显示（无 JS / 降级场景） |
| `intro-gif-armed` | `<head>` 内同步脚本 | 锁定滚动，隐藏 `nav`、汉堡菜单、两条进度条、移动端菜单 |
| `intro-gif-running` | `index-intro-gif.js` | 显示 GIF 覆盖层（`.intro-gif`，`z-index:100002`） |
| `intro-gif-finished` | `index-intro-gif.js`（播完 / 跳过） | 解锁滚动、导航栏淡入、移除覆盖层并释放 `img` 的 `src` |

**关键约定：**

- **同步 arm 脚本必须留在 `<head>`**：它需要在 `<body>` 渲染前完成导航栏隐藏，否则导航栏会先闪现再消失。
- **触发条件（2026-09-09 调整）**：arm 脚本仅在 `document.referrer` 为**站外**或**空（直接访问 / 书签 / 新标签）**时才给 `<html>` 打 `intro-gif-armed`；**站内跳转**（从本站其它页面点回首页，referrer 与本站同源）不重复播放开场动画，导航栏与滚动保持原样。这样避免了每进入一次首页都重播的问题。
- 该 GIF 为**无限循环**，没有"播放结束"事件可监听，因此时长由 `data-duration` 显式声明；更换素材时必须同步改这个值。
- 覆盖层 `position:fixed` + `object-fit:cover` 占满视口；素材 960×540（2026-10-09 起为动画 WebP），全屏会有轻度放大；`<img>` 对动画 WebP 的播放与 GIF 同接口（`src` + `data-duration`），控制器无需感知格式。
- 下一帧用 `new Image()` 预取进 HTTP 缓存，切帧时才把 `src` 赋给 `<img>`，保证从第 1 帧起播，同时不与当前帧争抢带宽。
- **降级红线（不可回退）**：JS 禁用、`prefers-reduced-motion: reduce`、组件脚本 404、单帧下载超 20s，任一情况都必须让导航栏正常显示；`<head>` 内另设 6s 看门狗兜底。末帧若加载/解码失败，不再提前结束整段动画，而是由"各帧时长之和"的总时长兜底收尾，继续展示上一帧直到导航栏淡入，避免"播一半就消失"（超大 GIF 在浏览器/部署环境下较易加载失败）。
- 用户可随时点击「跳过动画」或按 `Esc` 立即收尾；该按钮为无边框、无背景的纯文字按钮，直接压在 GIF 画面上。
- 组件 CSS 经 `head-extra/index.njk` 在 `mobile.css` 之后加载，保证响应式覆盖顺序（第八.1）。
