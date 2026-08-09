# 项目组织与设计系统总说明（SZPU-2026 iGEM Wiki）

> 本文档是 SZPU-2026 iGEM Wiki 的全局指导文档。它梳理了文件之间的层级与引用关系、当前已确立的美术风格与设计系统、已实现的页面框架与组件结构，并制定了未来开发必须遵循的约束规则。任何新增页面或修改，都应以本文件为唯一权威依据，确保不偏离现有风格体系与框架逻辑。
>
> 审查方式：基于全仓库静态文件分析，并使用 Playwright（Chromium）对 `index.html`、`project/description.html` 等页面进行实际渲染，提取了计算后的真实样式值（字体、背景、侧边栏尺寸、字号等）进行交叉验证。

## 〇、当前项目关系与状态（2026-08-09）
本仓库内存在两个 wiki 工程，分工如下：
- **igem2026-flask（生产提交工程）**：基于官方 `wiki-frozen-flask` 模板的 Frozen-Flask 站点，为 2026 赛季正式提交版本。静态资源仅含 CSS/JS（图片走 `static.igem.wiki`），通过 `.gitlab-ci.yml` 源码构建发布，符合 iGEM 官方三条硬性规则。合规细节见 `communication/gitlab/IGEM2026_WIKI_COMPLIANCE.md`。
- **根目录静态站点（本工程 / 历史参考版）**：早期手工静态站，图片保留在 `static/image/`，为 Frozen-Flask 迁移前的参考实现。现已按相同主题规范重新配色（米黄为主、棕为辅、蓝仅 footer），但**不作为**官方提交版本，仅作结构参考。
- **主题规范（两工程统一）**：主色=米黄/奶油、辅色=暖棕、强调=蓝（仅 footer）。详见第四节。

---

## 一、项目总览

本项目是一个标准 iGEM 竞赛 Wiki 站点，采用纯静态 HTML + CSS + 原生 JavaScript 实现，无构建工具、无框架。站点按内容板块划分为五大一级栏目：`Project`、`Team`、`Dry Lab`、`Wet Lab`、`Human Practices`，外加首页 `index.html`。

核心设计语言是**米黄/奶油（cream）主题**：以米黄 `#FFF8E7` / `rgba(252, 231, 203, 0.9)` 为主色（导航栏背景、页面背景、下拉菜单、卡片），暖棕 `#8B5A2B` 为辅色（导航栏文字、标题、按钮、边框），深棕 `#5D3A1A` 为强调；蓝色 `#4A90E2` 仅用于 footer，链接蓝 `#4285F4` 仅用于超链接，绿色 `#2E7D32` 仅用于成功/高亮状态。整体气质温暖、学术、克制。

---

## 二、文件层级与目录结构

```
SZPU-2026 wiki/
├── index.html                      # 首页（落地页，无侧边栏）
├── PROJECT_ORGANIZATION.md         # 本全局指导文档（唯一权威依据，!被 .gitignore 保留）
├── package.json / package-lock.json# 依赖声明（playwright-core）+ npm 脚本；支撑 npm run normalize
├── .gitignore                      # 忽略规则（含 communication/、.playwright-cli/ 等对话产物）
├── .github/                        # GitHub Pages 部署工作流（static.yml）
├── node_modules/                   # 依赖安装目录（.gitignore 忽略，不入库）
├── communication/                  # 对话/工具产物归集地（.gitignore 忽略，严禁散落他处）
│   ├── screenshots/                # 截图 / 验证渲染图（*.png）
│   ├── demos/                      # 演示 / 测试 HTML（demo-3d-timeline、demo_index、map、test-*）
│   ├── research-reports/           # 对话生成的研究 / 总结报告（*.md）
│   ├── tools-debug/                # 调试 / 抓取脚本与日志（*.js/*.cjs/*.py/*.log）
│   ├── stray-backup/               # 误生成文件夹 / 页面备份（AppData/、ORIGINAL_*）
│   └── .playwright-cli/            # Playwright 运行时快照（自动生成）
├── tools/                          # 正式工程化脚本（normalize-scripts.js、inject-search.js 等，非临时调试）
├── dry-lab/                        # 干实验板块
│   ├── hardware.html
│   ├── model.html
│   └── software.html
├── wet-lab/                        # 湿实验板块
│   ├── experiments.html
│   ├── parts.html
│   ├── result.html
│   └── safety.html
├── human-practices/                # 人类实践板块
│   ├── education.html
│   ├── integrated human-practices.html   # 综合 HP（含 3D 圆环轮播等特殊组件）
│   └── social-groups.html
├── project/                        # 项目正文板块
│   ├── description.html
│   ├── design.html
│   ├── engineering.html
│   ├── contribution.html
│   └── log.html
├── team/                           # 团队板块
│   ├── members.html
│   └── attributions.html
└── static/                         # 所有静态资源（关键！）
    ├── css/
    │   ├── index.css               # 全局基础与重置样式
    │   ├── description.css         # 内容页布局（侧边栏/卡片/装饰）
    │   ├── mobile.css              # 响应式，必须最后加载
    │   ├── navigation/
    │   │   └── navigation.css      # 全局导航栏 + 全部 :root 设计令牌
    │   ├── components/             # 组件级 CSS
    │   │   ├── page-progress-bar.css
    │   │   └── scroll-progress-bar.css
    │   └── ...（各页面专属 CSS，部分为占位空文件）
    ├── js/
    │   ├── core/                   # 核心脚本
    │   │   ├── utils.js            # 公共工具库（必须先加载，无依赖）
    │   │   ├── mobile-menu.js
    │   │   ├── page-progress-bar.js
    │   │   ├── scroll-progress-bar.js
    │   │   ├── nav-scroll-behavior.js
    │   │   ├── search.js           # 全站搜索模块（见 5.11）
    │   │   ├── search-index.js     # 由 search-index-generator.js 生成的搜索索引（defer 加载，约 189KB）
    │   │   └── search-index-generator.js  # Node 脚本，扫描全站页面生成 search-index.js
    │   ├── components/             # 页面组件脚本（位于 static/js/ 下，与 core/、pages/ 同级）
    │   │   ├── sidebar-progress.js # 侧边栏烧瓶进度 + TOC 高亮（内容页）
    │   │   ├── hp-carousel.js      # 3D 圆环轮播（见第十二节）
    │   │   ├── hp-reveal-box.js    # HP 下拉揭示盒
    │   │   └── executive-summary-animation.js  # 首页 Executive Summary 滚动驱动 + 酵母浮动 + 打字机
    │   ├── pages/                  # 页面专属脚本
    │   │   ├── members.js
    │   │   └── attributions.js
    │   └── hp-timeline-3d.js       # 3D 时间轴圆环引擎（当前未被任何页面引用，见 5.10/十四）
    └── image/                      # 所有图片资源
        ├── nav_bc.webp             # 导航栏背景图
        └── HP/                     # HP 板块图片（expert.jpg, school1~4.jpg 等）
```

---

## 三、文件依赖关系（引用关系）

### 3.1 全局共享依赖（每个页面都加载）

**CSS（内容页标准加载顺序）：**
```
static/css/navigation/navigation.css   → 全局令牌 + 导航栏
static/css/index.css                   → 全局重置 + 基础排版
static/css/description.css             → 内容页布局（或页面专属 CSS）
static/css/mobile.css                  → 响应式覆盖（必须最后）
static/css/components/page-progress-bar.css
static/css/components/scroll-progress-bar.css
```

**JS（统一置于 `<head>` 并以 `defer` 加载；标准执行顺序，utils.js 必须最先）：**
```
static/js/core/utils.js                → 公共工具（最先，无依赖）
static/js/core/mobile-menu.js
static/js/core/page-progress-bar.js
static/js/core/scroll-progress-bar.js
static/js/core/nav-scroll-behavior.js
[可选组件] static/js/components/sidebar-progress.js   → 仅内容页
[可选组件] static/js/components/hp-reveal-box.js       → 仅 HP 页
[可选组件] static/js/components/hp-carousel.js         → 仅 HP 页（3D 圆环轮播，见第十二节）
[可选页面] static/js/pages/members.js / attributions.js → 仅对应页
```

> 工程化约定：上述全部外部脚本现已统一移动到每个页面的 `<head>` 并以 `defer` 加载（见第八节第 2 条与第十三节）。页尾依赖 `PageProgressBar` 的内联脚本 `new PageProgressBar().startAutoProgress();` 已由 `tools/normalize-scripts.js` 自动包裹进 `DOMContentLoaded` 监听，确保 defer 脚本先于其执行。

### 3.2 各页面依赖清单

页面按"内容页/自定义页"分类，加载差异集中在是否引入 `description.css` 与 `sidebar-progress.js`：

| 页面 | 专属 CSS | 是否 description.css | 是否侧边栏 | 额外 JS |
|---|---|---|---|---|
| index.html | — | 否 | 否 | executive-summary-animation.js |
| dry-lab/hardware.html | hardware.css(空) | 是 | 是 | sidebar-progress.js |
| dry-lab/model.html | model.css(空) | 是 | 是 | sidebar-progress.js |
| dry-lab/software.html | software.css(空) | 是 | 是 | sidebar-progress.js |
| wet-lab/experiments.html | experiments.css | 是 | 是 | sidebar-progress.js |
| wet-lab/result.html | result.css(空) | 是 | 是 | sidebar-progress.js |
| wet-lab/safety.html | — | 是 | 是 | sidebar-progress.js |
| wet-lab/parts.html | parts.css(空) | 否 | 否 | — |
| human-practices/education.html | education.css(空) | 是 | 是 | sidebar-progress.js |
| human-practices/integrated human-practices.html | integrated human-practices.css | 是 | 是 | （sidebar-progress / hp-reveal-box / hp-carousel 脚本当前已被作者注释禁用，见七.8 与十四；如需启用请先取消注释并确认路径为 static/js/components/） |
| human-practices/social-groups.html | social-groups.css(空) | 否 | 否 | — |
| project/description.html | — | 是 | 是 | sidebar-progress.js |
| project/design.html | design.css(实) | 否 | 是 | sidebar-progress.js |
| project/engineering.html | engineering.css(空) | 是 | 是 | sidebar-progress.js |
| project/contribution.html | contribution.css(空) | 是 | 是 | sidebar-progress.js |
| project/log.html | log.css(实) | 否 | 否 | — |
| team/members.html | members.css(实) | 否 | 否 | pages/members.js |
| team/attributions.html | attributions.css(实) | 否 | 否 | pages/attributions.js |

> 说明："空"表示该专属 CSS 文件目前为 0~44 字节的占位文件，页面实际样式完全由 `description.css` 提供；"实"表示该专属 CSS 含有真实自定义样式（此类页面通常**不**加载 description.css，属于自定义布局）。

---

## 四、设计系统核心视觉规范

以下数值均来自 `navigation.css` / `description.css` / `index.css` 的 `:root` 令牌，并已用浏览器计算样式交叉验证。

### 4.1 色彩系统

**基础色板（全局令牌，定义于 navigation.css）：**

| 角色 | 变量 | 值 |
|---|---|---|
| 主色 Primary（米黄/奶油） | `--color-beige` / `--bg-page` / `--bg-dropdown` / `--bg-sidebar` | `#FFF8E7` / `rgba(252, 231, 203, 0.9)` |
| 辅色 Secondary（暖棕） | `--color-primary` / `--color-brown` | `#8B5A2B` |
| 辅色深 | `--color-primary-dark` / `--color-brown-dark` | `#5D3A1A` |
| 辅色浅 | `--color-primary-light` / `--color-brown-light` | `#D4A574` |
| 主色极浅 | `--color-brown-lighter` | `rgba(139,90,43,0.05)` |
| 正文文字 | `--color-text` | `#333` |
| 次级文字 | `--color-text-light` | `#666` |
| 三级文字 | `--color-text-lighter` | `#999` |
| 卡片背景 | `--bg-card` | `#ffffff` |
| 页面背景 | `--bg-page` | `rgba(252, 231, 203, 0.9)`（暖奶油，米黄主色） |
| 侧边栏背景 | `--bg-sidebar` | `#FFF8E7`（米黄主色） |
| 页脚背景 | `--bg-footer` | `#4A90E2`（蓝，footer 专属） |
| 浅灰背景 | `--color-bg-gray` | `#f4f4f4` |

**强调色（仅作点缀，不可泛滥使用）：**

| 用途 | 值 |
|---|---|
| 链接蓝 | `#4285F4`（hover `#1A73E8`） |
| footer 蓝（强调 ACCENT，仅 footer） | `#4A90E2` / `#3570B5` |
| 成功/绿色 | `#2D5A3D` / `#2E7D32` |
| 绿色方案 | `#5A9A5A` / `#3D7A3D` |

**内容页专属色板（description.css，统一加 `--desc-` 前缀，刻意避免与全局令牌冲突）：**
`--desc-color-primary:#8B5A2B`、`--desc-color-primary-dark:#5D4E37`、`--desc-color-primary-light:#D4A574`、卡片悬停 `rgba(139,90,43,0.08)`、高亮 `rgba(245,238,225,0.7)`、边框 `rgba(212,165,116,0.2)` 等。

### 4.2 字体系统

- **字体栈（全局唯一）：** `system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif`。**禁止引入其他字体族**（iconfont 图标字体除外）。
- **全局字号令牌：** `--font-size-xs:.7rem` `--font-size-sm:.8rem` `--font-size-md:.9rem` `--font-size-lg:1.1rem` `--font-size-xl:1.3rem` `--font-size-2xl:3rem`。
- **正文排版：** `body` 行高 `1.7`；标准内容段落 `font-size:1rem`、行高 `1.8`。
- **标题层级（`.content-section` 全局规范）：** `h1` `2.2rem`/700、`h2` `1.6rem`/600、`h3` `1.25rem`/600，字色 `#5D3A1A`，行高 `1.3`，字距 `-0.01em`。
- **内容页实测计算值（description.css 覆盖后）：** `h2 ≈ 24.8px`、`h3 ≈ 17.6px`、正文 `p ≈ 15.04px`。说明标题尺寸在内容页由 `--desc-font-size-*` 系列重新定义（`--desc-font-size-3xl:1.55rem` 等）。

### 4.3 间距系统

全局令牌：`--spacing-xs:.25rem` `--spacing-sm:.5rem` `--spacing-md:.75rem` `--spacing-lg:1rem` `--spacing-xl:1.25rem` `--spacing-2xl:1.5rem` `--spacing-3xl:2rem` `--spacing-4xl:2.5rem` `--spacing-5xl:4rem`。内容页另有一套 `--desc-spacing-*` 同值体系。**所有间距必须用令牌，禁止随意写死数值。**

### 4.4 圆角系统

`--radius-xs:.5rem` `--radius-sm:.625rem` `--radius-md:.75rem` `--radius-lg:1rem` `--radius-full:50%` `--radius-pill:624.9375rem`。卡片/容器默认 `md`(0.75rem)，胶囊按钮用 `pill`。

### 4.5 阴影系统

- 卡片：`--shadow-card: 0 0.125rem 0.5rem rgba(139,90,43,0.3)`（偏暖棕调）。
- 导航：`--shadow-nav: 0 0.375rem 1.5625rem rgba(139,90,43,0.4)`。
- 侧边栏：`--shadow-sidebar: 0 0.5rem 2rem rgba(139,90,43,0.1)`。
- 内容卡片（description.css）：`--desc-shadow-card: 0 4px 12px rgba(139,90,43,0.06)`（更轻）。

### 4.6 动效风格

- **缓动函数：** `--ease-smooth: cubic-bezier(0.16, 1, 0.3, 1)`（主），`--ease-default: ease`。
- **时长：** `--duration-fast:.2s` `--duration-normal:.3s` `--duration-slow:.4s` `--duration-scroll:25s`（长滚动装饰用）。
- **风格基调：** 柔和、克制、以位移与透明度为主。导航栏滚动收缩+阴影、智能隐藏（`.nav-hidden` translateY(-100%)）、侧边栏烧瓶进度随滚动上升、两侧浮动装饰（`df-art`）随滚动淡入淡出。
- **约束：** 禁止突兀/过长的动画；新增动效必须复用令牌时长与 `--ease-smooth`。

---

## 五、页面框架与组件结构

### 5.1 整体布局骨架

`body` 采用 `display:flex; flex-direction:column; min-height:100vh`。所有页面统一包含：固定顶栏 `<nav>`（高 100px，背景米黄 `var(--bg-dropdown)` 毛玻璃模糊）、顶部阅读进度条（page-progress）、侧边滚动进度条（scroll-progress，部分页）、`<main>` 主内容区、底部 `<section id="footer" class="section-footer">`（背景 `#4A90E2` 蓝，footer 专属）。

### 5.2 顶部导航栏（navigation.css + nav-scroll-behavior.js）

- `nav`：`position:fixed; top:0; z-index:9999; height:6.25rem`（滚动后 `.scrolled` 缩为 `5rem` 并加阴影）；背景 `var(--bg-dropdown)`（米黄主色）+ `backdrop-filter:blur`。
- 采用"图标字体 + 下拉"的 mega-menu 结构：主栏目（Home/Project/Team/Dry Lab/Wet Lab/Human Practices）用 iconfont 字形，每个主栏目下挂子页面图标/链接。
- 行为脚本 `nav-scroll-behavior.js` 实现：下滑隐藏（`.nav-hidden`）、上滑显示、滚动到一定位置加 `.scrolled`。**该脚本为全局必需，禁止移除。**

### 5.3 内容页侧边栏 + 烧瓶进度（description.css + sidebar-progress.js）

- 标记：`<aside class="description-sidebar">`，实测背景 `rgba(255,252,247,0.95)`、宽度约 `260px`（令牌范围 `min 280px / max 320px`）。
- 内嵌基于烧瓶液体的阅读进度可视化（`--desc-flask-*` 系列令牌，由 `sidebar-progress.js` 驱动随滚动上升）。
- `description.css` 中明确标注：`--desc-sidebar-position: sticky`、`--desc-sidebar-top-offset:120px` 等为"绝对不能改（navigation.css 会接管）"的关键配置。
- 仅"标准内容页"加载此组件；自定义布局页（design/log/members/attributions/social-groups/parts）无侧边栏，也不加载 `sidebar-progress.js`。

### 5.4 进度条组件

- **顶部页面进度条**（page-progress-bar）：横贯顶部，蓝色 `#4a90e2`，由 `page-progress-bar.js` 驱动。
- **侧边滚动进度条**（scroll-progress-bar）：竖条，棕色系，由 `scroll-progress-bar.js` 驱动。两者均为全局组件，CSS 位于 `static/css/components/`。

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
- `hp-carousel.js`：3D 圆环轮播（integrated human-practices.html 的"拖动显示"结构，实为环形径向排列，非拖动式；详见第十二节）。轮播 HTML 结构（`hp-carousel`）与 CSS 已就绪，**图片缺失时由 `onerror` 显示"待补"占位**，放入对应图片即自动显示，无需改代码。

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
| `components/sidebar-progress.js` | 侧边栏烧瓶进度 + TOC 高亮 | rAF 节流；**init/resize/load 时缓存各 section 绝对偏移**，滚动期仅比对 scrollY（不再每帧 `getBoundingClientRect`） | 已优化（原每帧读布局为重排主因之一，见十四） |
| `components/hp-carousel.js` | 3D 圆环轮播 | 卡片径向排列 + `will-change` 提升合成层；交互透视计算合并进单个 rAF；过渡期临时提升 filter 层、结束释放 | 良好；视觉效果冻结见十二 |
| `components/hp-reveal-box.js` | HP 下拉揭示盒 | Pointer 事件、尊重 `prefers-reduced-motion`、高度动画、debounced resize | 良好 |
| `components/executive-summary-animation.js` | 首页 Executive Summary 滚动驱动 + 酵母浮动 + 打字机 + 滚动渐入 | 用 IntersectionObserver 仅在接近视口时挂 scroll 监听；酵母浮动 SVG **离屏时 `animation-play-state:paused`** | 已优化（见十四） |
| `pages/members.js` | 成员页数据驱动渲染 + 双图背景交叉淡入 | DocumentFragment 渲染、ResizeObserver、rAF 节流 resize/scroll、rail 仅在可见时更新 | 良好 |
| `pages/attributions.js` | 卡片筛选 + 时间线双面板 + Tooltip + ScrollSpy | 筛选/面板切换、Tooltip 用 MutationObserver、`ScrollSpy` 用 rAF 节流 | 基本良好；MutationObserver 在全站 body 上略有开销 |
| `core/search.js` | 全站搜索 | 懒加载索引、debounced 输入、Esc/外部点击关闭 | 良好 |
| `core/search-index.js` | 搜索索引（生成物） | 全站页面分块文本 + 图片记录，**约 189KB** | 已改为 `defer` 加载（见十四） |
| `core/search-index-generator.js` | 索引生成器（Node） | 扫描 `PAGES` 生成 `search-index.js` | 构建期运行 |
| `hp-timeline-3d.js` | 3D 时间轴圆环引擎 | 3D 径向编排；**rAF 收敛即停、交互时 `kick()` 重启** | 已优化；当前未被任何页面引用（孤儿，见十四） |

### 5.11 搜索子系统（search.js + search-index.js）

`search.js` 在导航栏提供搜索入口，首次打开时通过动态注入 `<script>` 异步加载 `static/js/core/search-index.js`（也可由页面 `<head>` 中的 `defer` 标签预置）。索引由 `static/js/core/search-index-generator.js` 在构建期扫描全站页面正文与图片生成：

```powershell
cd "f:\IGEM\SZPU-2026 wiki"
node static/js/core/search-index-generator.js
```

搜索逻辑为本地线性匹配（含图片文件名/alt），结果按页面分组、支持高亮，点击跳转对应页面。该索引体积较大（约 189KB），务必以 `defer` 加载或保持按需懒加载，禁止同步阻塞 `<head>`（见十四）。

## 六、图片与资源约定

- 所有图片归入 `static/image/`（导航背景 `nav_bc.webp`、HP 图片在 `static/image/HP/`）。
- **路径前缀规则：** 根目录页面用 `static/image/...`；子目录页面（如 `project/description.html`）必须用 `../static/image/...`。
- 引用图片前**必须确认文件真实存在于磁盘**，否则图片不显示。当前 HP 目录仅有 `expert.jpg`、`school1~4.jpg` 等少数真实文件；其余活动照片（如 `tsinghua-1~4.jpg`、`southchina-1~4.jpg`、`lecture-*.jpg`、`WWJ.png`）并不存在。
- 建议为 `<img>` 保留 `onerror` 兜底（显示"待补"或默认图），避免破图破坏版式。

---

## 七、已发现的问题与不一致（需警惕）

1. **占位空 CSS 文件：** `contribution.css`、`engineering.css`、`education.css`、`hardware.css`、`model.css`、`parts.css`、`result.css`、`software.css`、`social-groups.css` 均为 0~44 字节占位文件，其页面样式实际来自 `description.css`。新增样式可写入对应文件，但**切勿删除这些占位文件**（HTML 仍引用它们）。
2. **页面样式模式不一致：** 部分页（design/log/members/attributions/social-groups/parts）未加载 `description.css` 也无侧边栏，与"标准内容页"模式偏离。新增内容页应优先采用标准模式，除非确有自定义布局需求。
3. **图片路径风险（历史教训）：** 曾出现将 `expert.jpg` 误写为 `WWJ.png`、将 `school1~4.jpg` 误写为 `lecture-1~4.jpg` 导致全站破图。任何图片改动都需先核对文件存在性。
4. **`file://` 协议受限：** 本地直接双击打开 HTML 会被浏览器以 `file:` 协议拦截脚本/资源；测试须通过本地 HTTP 服务（如 `python -m http.server`）访问。
5. **description.css 关键令牌标注：** 其中多处写明"绝对不能改 / navigation.css 会接管"，修改前务必阅读注释。
6. **脚本加载策略已统一（工程化重构，2026-08-04）：** 原先混用"底部同步脚本 / head 内 defer / head 同步"三种写法，已全部统一为"外部脚本置于 `<head>` + `defer`"，并由 `tools/normalize-scripts.js` 自动维护；页尾依赖 `PageProgressBar` 的内联脚本已包裹 `DOMContentLoaded`。请勿再恢复手写底部脚本堆（详见第十三节）。
7. **根目录 stray 二次清理（2026-08-04）：** 此前误生成的 `AppData/` 已移至 `communication/stray-backup/`；演示/调试文件 `demo-3d-timeline.html`（根目录为与 `communication/demos/` 同名的重复副本，已删除）、`map.html`、`static/iconfont/demo_index.html` 已移至 `communication/demos/`。本批又将所有散落在根目录的验证截图（`verify-*.png`、`hero-final.png` 等共 14 张）、调试脚本（`screenshot.js`/`shot.js`/`verify.js`/`restructure.js`）与运行日志（`*.log`）、测试页（`test-css.html`/`test-timeline.html`）分别归集至 `communication/screenshots/`、`communication/tools-debug/`、`communication/demos/`，并删除了空垃圾文件夹 `.dbg/`。根目录现仅保留 `index.html`、`PROJECT_ORGANIZATION.md`、`.gitignore`、`package.json`/`package-lock.json` 及正式栏目目录，部署目录保持干净（详见第十一节）。

8. **脚本路径 404 已修复（2026-08-07）：** 文档与 `normalize-scripts.js` 曾把组件脚本写成 `static/components/*`、把 `executive-summary-animation.js` 写成 `static/js/core/*`，而真实目录为 `static/js/components/`，导致 `sidebar-progress.js`、`hp-reveal-box.js`、`executive-summary-animation.js` 在相关页面 404（交互静默失效）。现已统一修正：18 个页面的引用与 `normalize-scripts.js` 生成器路径均已改为 `static/js/components/*`；如新增页面请用第九节模板（路径已正确），不要手写错误路径。
9. **首屏渲染阻塞已修复（2026-08-07）：** `search-index.js`（约 189KB）原在每个页面 `<head>` 内**同步**加载，阻塞 HTML 解析与首屏渲染（LCP）。已改为 `defer`，停止阻塞；其懒加载由 `search.js` 兜底。
10. **性能问题清单（2026-08-07，详见十四）：** 全站卡顿的根因包括：(a) 多页面并存多个独立 `scroll` 监听各自触发 rAF；(b) `sidebar-progress.js` 原每帧对全部 section 调用 `getBoundingClientRect()` 造成强制同步布局（已改为缓存偏移）；(c) `hp-timeline-3d.js` 原永久 rAF 循环（已改为收敛即停）；(d) CSS 的 `backdrop-filter` 滚动重绘、首页酵母 SVG 常驻 `will-change` + 无限动画、懒加载图 `filter:blur` 占位、多处大 `box-shadow`。上述 (b)(c) 已修复，(d) 中酵母动画已加离屏暂停，`backdrop-filter` 等既定视觉效果予以保留。
11. **根目录散落脚本已收纳（2026-08-07）：** `inject-search.js` 原散落在仓库根目录，已移入 `tools/`（与 `normalize-scripts.js` 同为正式工程化 Node 脚本，不属于浏览器运行时资源，故不入 `static/js/`）。搬运时一并修正：①`ROOT` 由 `path.resolve(__dirname)` 改为 `path.resolve(__dirname, '..')`（`__dirname` 现指向 `tools/`，须回退一级到仓库根，否则页面路径拼接错位导致全部跳过）；②其注入的 `search-index.js` 原不带 `defer`，重跑会回退第七.9 的首屏优化，已改为 `defer`。`package.json` 新增 `npm run inject-search`（并补齐缺失的 `npm run normalize`）；运行请用 `node tools/inject-search.js` 或 `npm run inject-search`，不要再在根目录直接 `node inject-search.js`。
12. **图片路径重构（2026-08-07）：** `static/image` 目录重组后，全站共 20 个页面/CSS 的图片引用失效。已按磁盘真实位置重构：①`SZPU(notext).png`、`shiyao(notext).jpg` 由 `static/image/` 根移至 `static/image/any-icon/`；②`nav_bc.webp`（CSS 内 `../image/nav_bc.webp`、`../../image/nav_bc.webp`）移至 `static/image/wikiStructure/`；③页脚背景图 `bc/index_bc7.jpg`/`.webp`（15 页 `<picture>` 页脚背景）重命名为同目录 `bc/画板+7.jpg`/`.webp`。共 38+30 处替换；`index.css` 第 2151 行 `xx.jpg` 仅为注释示例、非真实引用，`project/description.html` 与 `wet-lab/experiments.html` 中 `%E7%94%BB%E6%9D%BF+7.webp` 为 `画板+7.webp` 的 URL 编码写法（文件真实存在，浏览器解码后正常），二者均无需改动。最终解码感知复扫：**全站 0 个真实失效图片引用**。

13. **底部页脚图标统一为 .webp（2026-08-07）：** 依 index.html 底部示例（`static/image/any-icon/SZPU(notext).webp` / `shiyao(notext).webp`），将全站 18 个页面底部页脚 SZPU/shiyao 图标引用由 `.png`/`.jpg` 改为 `.webp`（共 36 处），位置仍保留 `any-icon/`，文件均存在。integrated human-practices.html 第 1297 行时间轴数据 `img: '../static/image/any-icon/home.webp'`（15.77KB）经核对已正确，无需改动，一并记录备查。
14. **integrated HP 内联 3D 时间轴 rAF 收敛即停（2026-08-07）：** 该页 3D 时间轴由**内联脚本**（非外置 `hp-timeline-3d.js`，该页未加载外置文件）驱动，原 `startLoop→loop` 在 1551 行**无条件 `requestAnimationFrame(loop)` 永久循环**，即使圆环静止也每帧重写全部卡片/节点的 transform、opacity、zIndex，并逐帧改写每个时间节点 label 的 `fontSize`/`color` → 持续占用主线程，为 integrated HP 页卡顿**头号原因**。已改为收敛即停（kick/rafId 模式：仅 `snapActive` 吸附动画进行中持续循环，静止即 `rafId=null` 停；滑块/点击/键盘/窗口缩放经 `kick()` 重启），视觉不变。另发现时间轴封面引用 `static/image/HP/southchina/SZU.jpg`（**13.5MB**）、`static/image/HP/school1.jpg`（3.6MB）等巨型图片，且 `assignCard` 用 `loading='eager'` + `preloadOne` 主动预解码全部 4 张，建议转 webp 并缩图（数 MB 的 JPG 作小封面会瞬间占满主线程解码）。详见第十四节。
15. **`scroll-progress-bar.js` 缓存布局尺寸（2026-08-07）：** 原 `calculateProgress()` 每帧滚动都调用 `getClientHeight()` + `getScrollHeight()`（读取 `documentElement.scrollHeight/offsetHeight/clientHeight`），与每帧 `style.height` 写入交错形成**强制同步布局**；`scrollHeight/clientHeight` 仅在 resize 或资源加载时才变化，滚动期恒定。已改为在 `init`/`onResize`/`load` 时缓存 `clientHeight`、`totalHeight`（新增 `state.metrics` + `refreshMetrics()`），热路径只读取 `getScrollPosition()`（scrollY，不触发重排）并写高度——消除进度条的每帧重排。视觉/进度数值完全不变。
16. **`project/log.html` 滚动高亮缓存偏移（2026-08-07）：** 该页内联 `updateNavHighlight` 原每 100ms（本地 `throttle`）对全部 `section` 调用 `getBoundingClientRect()` 计算可见比例，与 sidebar-progress 旧 bug 同类——**每帧强制同步布局**，为 log 页滚动卡顿的主因。已改为在 `init`（`buildSectionOffsets`）+ `resize`（防抖）+ `load` 时一次性缓存各 section 绝对偏移（`rect.top + scrollY`），滚动期仅用 `window.scrollY + innerHeight*0.3` 探针与缓存偏移做数值比较后切换 `.active` 类，彻底消除每帧 `getBoundingClientRect`。视觉/高亮行为不变。`sections`/`navItems` 与本地 `throttle` 均保留。

---

## 八、未来开发约束规则（必须遵循）

以下是硬约束，**任何新增或修改都不得违反**：

1. **CSS 加载顺序：** 每个页面必须包含五大共享 CSS，且顺序为 `navigation.css → index.css → [页面/description].css → mobile.css → components/*.css`；**`mobile.css` 必须最后**，以保证响应式覆盖生效。
2. **JS 加载位置与顺序：** 所有外部脚本统一置于页面 `<head>` 并以 `defer` 加载（不阻塞渲染、DOM 解析后按文档顺序执行）；`core/utils.js` 必须最先。组件/页面脚本只在对应页面加载，不得全局强加；依赖已加载脚本的页尾内联脚本须包裹进 `DOMContentLoaded`（由 `tools/normalize-scripts.js` 自动处理）。
3. **统一内容页模板：** 新增内容页必须采用标准结构——加载 `description.css`、包含 `<aside class="description-sidebar">`、加载 `sidebar-progress.js`，并复用 `--desc-*` 令牌与现有组件类，**不要凭空发明新结构**。
4. **色彩只能来自令牌：** 所有颜色必须使用 `:root` 中的令牌（`--color-*` 或 `--desc-color-*`）。**禁止在业务样式中硬编码十六进制色值**；蓝色仅用于链接、绿色仅用于成功/高亮，不可作为主色扩散。
5. **保持米黄/棕主题：** 主色固定米黄/奶油（`#FFF8E7` / `rgba(252,231,203,0.9)`），辅色固定暖棕 `#8B5A2B`，蓝色仅用于 footer；禁止引入新的主色/辅色或额外的字体族；字体栈保持 `system-ui` 体系。
6. **间距/圆角/阴影/动效复用令牌：** 必须使用 `--spacing-*`、`--radius-*`、`--shadow-*`、`--duration-*`、`--ease-smooth`，禁止随意写死像素数值或使用非标准缓动。
7. **图片必须可寻址：** 引用前确认文件存在于 `static/image/`（子页用 `../` 前缀），并为 `<img>` 保留 `onerror` 兜底。
8. **保留占位文件：** 不要删除任何专属 CSS 文件（即使是空占位），HTML 仍引用它们。
9. **全局组件不可删：** 顶栏、两条进度条、`nav-scroll-behavior.js` 是全局基础设施，删除会破坏全站一致性与阅读体验。
10. **尊重关键令牌注释：** `description.css` 中标注"不可改 / 由 navigation.css 接管"的令牌（侧边栏 sticky 定位、烧瓶进度因子、浮动装饰层级等）严禁改动。
11. **JS 模块化：** 新脚本以 IIFE/命名空间封装，避免全局污染，且不依赖 `utils.js` 之外的加载顺序。
12. **动效克制：** 新增动效须柔和、复用标准时长与 `--ease-smooth`，避免过长或突兀效果。
13. **对话产物隔离（最高优先级红线）：** 对话/工具产生的任何额外文件（截图、导出、报告、工具日志、临时调试脚本、测试页、误生成文件夹等），必须在生成当次立即移入 `communication/` 对应子目录，并确保 `.gitignore` 已覆盖；绝不允许留在仓库根目录或业务目录。提交前务必 `git status` 复查（详见第十一节）。

14. **脚本路径必须真实存在：** 所有 `<script src>` 指向的文件必须位于磁盘（组件在 `static/js/components/`、核心在 `static/js/core/`、页面在 `static/js/pages/`）。改动路径后须用 `npm run normalize` 重新生成并本地起服务验证无 404（历史教训见七.8）。
15. **滚动监听必须节流：** 任何 `scroll` 监听须用 `utils.rafThrottle` 或单 rAF 合并 + `passive:true`；**禁止在滚动回调中同步读取布局**（`getBoundingClientRect`/`offsetTop`/`clientHeight` 等），应在 init/resize 时缓存偏移，滚动期只做样式写入（见十四.3）。
16. **禁止永久 rAF 循环：** 动画/轮询类逻辑（如 3D 圆环）必须在达到目标态后停止 `requestAnimationFrame`，仅在交互时重启；不得每帧无条件重写 transform（见十四.3）。
17. **大体积数据脚本不得阻塞首屏：** 索引/数据类脚本（如 `search-index.js`）一律 `defer` 或按需懒加载，禁止在 `<head>` 内同步加载（见十四.3）。
18. **谨慎使用高成本 CSS：** `backdrop-filter`、`filter:blur`、`position:fixed` 全屏层、过多/过大 `box-shadow` 会显著增加绘制与合成开销；`will-change` 仅作临时提升并尽快释放，不要永久堆在大量元素上；无限 `@keyframes` 动画须离屏暂停（`IntersectionObserver` 设 `animation-play-state:paused`）或尊重 `prefers-reduced-motion`。
19. **性能预算：** 单页并存独立 `scroll` 监听不超过必要数量；新增持续动画前先评估其合成/绘制成本，长页面尤甚。

---

## 九、新内容页快速模板（推荐复制起点）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>页面标题 - SZPU-2026</title>
  <!-- 共享 CSS：顺序不可变，mobile.css 必须最后 -->
  <link rel="stylesheet" href="../static/css/navigation/navigation.css">
  <link rel="stylesheet" href="../static/css/index.css">
  <link rel="stylesheet" href="../static/css/description.css">
  <link rel="stylesheet" href="../static/css/[页面专属].css">
  <link rel="stylesheet" href="../static/css/mobile.css">
  <link rel="stylesheet" href="../static/css/components/page-progress-bar.css">
  <link rel="stylesheet" href="../static/css/components/scroll-progress-bar.css">
  <!-- JS：统一置于 head + defer，utils 最先（根目录页面前缀改为 static/） -->
  <script src="../static/js/core/utils.js" defer></script>
  <script src="../static/js/components/sidebar-progress.js" defer></script>
  <script src="../static/js/core/mobile-menu.js" defer></script>
  <script src="../static/js/core/page-progress-bar.js" defer></script>
  <script src="../static/js/core/scroll-progress-bar.js" defer></script>
  <script src="../static/js/core/nav-scroll-behavior.js" defer></script>
</head>
<body>
  <!-- 顶栏 nav（由 navigation.css + nav-scroll-behavior.js 驱动） -->
  <!-- 进度条（page/scroll-progress 组件） -->
  <main>
    <div class="description-container">   <!-- flex: 侧边栏 + 内容 -->
      <aside class="description-sidebar"><!-- TOC + 烧瓶进度 --></aside>
      <div class="description-content">
        <section class="content-section">
          <h1>标题</h1>
          <section><h2>小节</h2><p>正文…</p></section>
        </section>
      </div>
    </div>
  </main>
  <section id="footer" class="fullscreen-section section-footer"></section>
</body>
</html>
```

---

## 十、本地预览命令

由于 `file:` 协议会拦截资源，测试请使用本地 HTTP 服务：

```powershell
cd "f:\IGEM\SZPU-2026 wiki"
python -m http.server 8080 --bind 127.0.0.1
# 浏览器访问 http://127.0.0.1:8080/index.html
```

---

## 十一、对话产物与 .gitignore 管理约定（强制，最高优先级红线）

> **核心红线（务必牢记）：** 任何由对话/AI 过程产生的"额外文件"（截图、导出的中间文件、研究/总结报告、浏览器工具日志、临时调试脚本、测试页、误生成的文件夹等）**严禁散落在仓库根目录或任何业务目录（`dry-lab/`、`wet-lab/`、`human-practices/`、`project/`、`team/`、`static/` 等）**。它们必须统一归集到仓库根下的 `communication/` 对应子目录。这是硬性约定，优先级高于"先放着、以后整理"的随意习惯——**一经生成就立即归位**，绝不能留到部署/评审前才发现满盘狼藉。

**为什么这条规定如此重要（真实教训）：**
- **污染版本库与部署产物**：这些文件会被误提交进 git，或随静态站一起被部署到 iGEM 服务器，导致对外页面出现无关的 `verify-*.png`、`test-*.html`、`.log` 等垃圾。
- **干扰评审、损害专业度**：评委或协作者打开仓库时，根目录成堆的散落文件会严重损害项目观感，且难以分辨哪些才是真正的内容文件。
- **破坏目录约定、引发路径风险**：脚本误把相对路径写成仓库根，会生成 `.dbg/` 之类的 stray 文件夹（见 11.3）；随手新增图片/脚本还可能踩中第六节"图片路径风险"的历史坑。
- **2026-08-04 已两次发生根目录散落**：先有 `AppData/`，后又出现 14 张验证截图、`screenshot.js`/`shot.js`/`verify.js`/`restructure.js` 等调试脚本与 `*.log`、测试页 `test-*.html`，以及空垃圾文件夹 `.dbg/`，已全部二次清理归集（见第七.7 条）。这正说明"随手留根目录"极易复发，必须靠纪律而非事后补救。

### 11.1 归集规则（按类型入座）

- **截图 / 验证渲染图（`*.png` / `*.jpg` 等）**：Playwright 渲染验证生成的 `description_page.png`、`index_home.png`、`verify-*.png`、`hero-final.png` 等，一律移入 `communication/screenshots/`，不得留在根目录或业务目录。
- **演示 / 测试 HTML**：`demo-3d-timeline.html`、`map.html`、`demo_index.html`、`test-css.html`、`test-timeline.html` 等归入 `communication/demos/`（注意：正式页面引用的是 `communication/demos/demo-3d-timeline.html`，根目录同名副本为重复，应直接删除而非再存一份）。
- **研究 / 总结报告（`*.md`）**：对话生成的研究报告、页面总结放入 `communication/research-reports/`，与正式指导文档 `PROJECT_ORGANIZATION.md` 严格区分。
- **调试 / 抓取脚本与日志（`*.js` / `*.cjs` / `*.py` / `*.log` 等）**：验证、截图、微信抓取、轮播调试、`restructure` 等工具脚本与运行日志归入 `communication/tools-debug/`；`tools/` 目录仅存放正式工程化脚本（如 `normalize-scripts.js`），不要把临时调试脚本混进去。
- **误生成文件夹 / 页面备份**：`AppData/`、`ORIGINAL_integrated.html` 之类归入 `communication/stray-backup/`。
- **浏览器工具运行时文件夹 `.playwright-cli/`**（含 `console-*.log`、`page-*.yml` 快照）：由 Playwright 类工具自动生成，整体移入 `communication/.playwright-cli/`。该工具下次运行仍可能在根目录重建，`.gitignore` 同时忽略根目录的 `.playwright-cli/`。
- **其它临时导出**：任何 `temp`、`export`、`_tmp` 类文件同理，先建子目录再放入 `communication/`，不要直接丢在根目录。

### 11.2 .gitignore 对应条目

`communication/` 与工具运行时目录已在 `.gitignore` 中忽略，相关内容不会进入版本库：

```
# === 对话产物 / 工具生成文件（不入库） ===
communication/
.playwright-cli/

# 保留项目指导文档（否则会被上方的 *.md 规则忽略）
!PROJECT_ORGANIZATION.md
```

> 重要：`PROJECT_ORGANIZATION.md` 本身是 `.md`，会被仓库中既有的 `*.md` 规则一并忽略。已通过 `!PROJECT_ORGANIZATION.md` 例外保留，使其可被正常提交与版本管理。若后续新增其它需长期保留的 Markdown 指导文件，请同样追加 `!文件名.md` 例外。

### 11.3 根目录 stray 文件夹警示

若仓库根目录出现非预期的文件夹（如 `node_modules/` 之外的 `.dbg/` 等），多半是某脚本把相对路径误写成仓库根导致的副产物，**不属于本项目内容**，应查清来源后清理（空的 `.dbg/` 直接删除），切勿随手提交。

> 注（2026-08-04，二次清理）：历史上曾误生成 `AppData/` 文件夹，已查明并移至 `communication/stray-backup/`；本轮又出现空 `.dbg/` 文件夹，已删除；同类 stray 仍按本警示处理。

### 11.4 流程约束（补充到第八节）

在第 8 节约束规则基础上追加：

> **第 13 条（最高优先级）：** 对话/工具产生的任何额外文件，**必须在生成当次立即**移入 `communication/` 对应子目录，并确保 `.gitignore` 已覆盖；绝不允许将其留在仓库根目录或业务目录。提交前请务必 `git status` 复查根目录与业务目录，确认无 stray 文件混入。

---

*文档生成方式：全仓库静态分析 + Playwright(Chromium) 实渲染交叉验证。如后续设计令牌变更，应同步更新本文档第二节至第四节及第八节约束规则；如新增对话产物类型，应同步更新第十一节与 `.gitignore`。*

---

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

## 十三、工程化脚本统一工具（tools/normalize-scripts.js）

为消除手工维护 18 个页面脚本顺序/路径的出错风险，项目引入零依赖 Node 脚本 `tools/normalize-scripts.js`，统一所有页面的外部脚本加载方式。另有一同属工程化的 `tools/inject-search.js`，负责批量注入导航搜索按钮与 `search.js`/`search-index.js` 引用（见第七.11）；两者均须从 `tools/` 目录运行，不得放回仓库根。

**它做什么：**
- 移除每个页面里散落的外部 `<script src>`（无论位于 `<head>` 还是 `</body>` 前），重新按固定顺序写入 `<head>` 并加 `defer`：`utils.js` 最先，其次 `sidebar-progress.js`（仅内容页），随后四个核心行为脚本，最后按文件名追加页面/组件脚本（`hp-carousel.js` / `hp-reveal-box.js` / `members.js` / `attributions.js` / `executive-summary-animation.js`）。
- 将原先位于外部脚本块之后、依赖 `PageProgressBar` 的页尾内联脚本 `new PageProgressBar().startAutoProgress();` 自动包裹进 `DOMContentLoaded` 监听，确保 defer 脚本先于其执行（否则 defer 延后会导致 `PageProgressBar is not defined`）。
- 幂等：可重复运行；路径与顺序由文件名规则生成，不依赖现有（可能被手改坏的）`src` 字符串。

**用法：**
```powershell
cd "f:\IGEM\SZPU-2026 wiki"
npm run normalize        # 等价于 node tools/normalize-scripts.js
```

**约束：** 新增页面请从第九节模板复制（脚本已在 `<head>` 内），不要再把 `<script>` 堆到 `</body>` 前；若需增删某页脚本集合，改 `tools/normalize-scripts.js` 内的 `scriptsFor()` 规则后重跑即可，不要在页面里手动改。

> **2026-08-07 路径修正：** `scriptsFor()` 中的组件路径已从错误的 `static/components/*` 改为 `static/js/components/*`，`executive-summary-animation.js` 改由 `comp('executive-summary-animation.js')` 生成（原为 `core('core/...')` 的 404）。重新运行 `npm run normalize` 现在会产出正确路径；请勿再改回。

---

## 十四、性能分析与优化（2026-08-07）

> 本节记录全站卡顿的多维度定位、已实施的优化（均维持原有视觉效果）与未来性能预算。相关代码改动见第七.8–10、第五.10 与 `tools/normalize-scripts.js`、`static/js/components/sidebar-progress.js`、`static/js/hp-timeline-3d.js`、`static/js/components/executive-summary-animation.js`。

### 14.1 现象与定位

站点普遍反馈滚动/交互卡顿。定位手段：逐文件审查全部 JS 组件的实现原理，并对 `static/css/` 全量 CSS 做渲染性能审计（关注 `backdrop-filter`、`filter:blur`、`will-change`、无限动画、大 `box-shadow`、`position:fixed` 全屏层）。同时核对了每个页面实际加载的脚本路径，发现多处 404 与一处首屏阻塞。

### 14.2 多维度分析

**1) 关键渲染路径 / 资源加载维度**
- 多处脚本路径错误导致 404：`static/components/*`（应为 `static/js/components/*`）、`executive-summary-animation.js` 写成 `static/js/core/*`。后果是 `sidebar-progress.js`、`hp-reveal-box.js`、`executive-summary-animation.js` 在相关页面静默失效——侧边栏烧瓶进度与 TOC 高亮不工作、HP 揭示盒无响应、首页酵母浮动/打字机/滚动渐入不运行。
- `search-index.js`（约 189KB）在每个页面 `<head>` 内**同步**加载，阻塞 HTML 解析与首屏渲染（LCP 明显变慢）。

**2) JS 渲染线程 / 事件监听维度**
- 内容页并存 3~4 个独立 `window` `scroll` 监听（nav / page-progress / scroll-progress / sidebar），各触发自身 rAF；attributions 页更多（再加 Tooltip、ScrollSpy）。每帧最多数个 rAF 回调。
- `sidebar-progress.js` 原实现每帧对全部 section 调用 `getBoundingClientRect()` 并与样式写入交错，造成**强制同步布局（layout thrash）**，长内容页尤为明显——这是内容页卡顿的主因之一。
- `scroll-progress-bar.js` 原 `calculateProgress()` 每帧调用 `getClientHeight()` + `getScrollHeight()`（读 `documentElement.scrollHeight/offsetHeight/clientHeight`），与每帧 `style.height` 写入交错形成**强制同步布局**；这些尺寸在滚动期恒定，本应缓存。`project/log.html` 内联 `updateNavHighlight` 同理每 100ms 对全部 `section` 调 `getBoundingClientRect()`，是 log 页滚动卡顿主因。
- `hp-timeline-3d.js` 原 `render` 以 `requestAnimationFrame` **永久循环**，即使圆环已静止也每帧重写所有卡片 `transform`，持续占用主线程（该脚本当前未被任何页面引用，属隐患）。
- `project/log.html` 的内联滚动高亮、各页 `scroll-progress-bar` 等"加了很多 JS"后，多个独立 `scroll` 监听叠加，任一在回调中同步读布局即放大为持续重排——这是"加了很多 js 开始卡"的直接机制。

**3) CSS 合成与绘制维度**
- `nav` 的 `backdrop-filter: blur` 在滚动时强制对背景内容做模糊重绘（fixed 全宽条带，开销持续）。
- 首页 8 个酵母 SVG 常驻 `will-change: transform` + 无限 `floatYeast` 动画（此前因脚本 404 实际未播放；路径修复后恢复，并已加离屏暂停）。
- 懒加载图 `filter:blur` 占位、多处大 `box-shadow`（首页 hero/card、HP orbit 卡片）、`position:fixed` 全屏浮动装饰层（`float-art`）持续绘制。

### 14.3 已实施的优化（均维持原有效果）

- **路径修正（恢复被 404 静默失效的交互）：** `static/components/*` → `static/js/components/*`（18 个页面 + `normalize-scripts.js`）；`executive-summary-animation.js` 路径修正（首页 + `normalize`）。侧边栏烧瓶/TOC 高亮、HP reveal、首页酵母浮动/打字机/滚动渐入现已正常。
- **停止首屏阻塞：** `search-index.js` 改为 `defer`（停止阻塞解析，保留 `search.js` 懒加载兜底）。
- **`sidebar-progress.js` 去重排：** 在 init / resize / `load` 时一次性缓存各 section 的绝对偏移（`getBoundingClientRect().top + scrollY`），滚动期仅用 `scrollY` 与缓存偏移比对，彻底消除每帧 `getBoundingClientRect` 强制重排。
- **`hp-timeline-3d.js` 收敛即停：** `render` 在 `currentAngle` 收敛到 `targetAngle`（误差 < 0.01°）时停止 rAF 循环，仅在交互（滑块 `input`/`change`、‹ › 按钮、点击节点/卡片）时 `kick()` 重启，视觉完全不变。
- **`executive-summary-animation.js` 酵母离屏暂停：** 8 个酵母浮动 SVG 用 `IntersectionObserver` 在离屏时设 `animation-play-state:paused`、入屏恢复，视觉无差异，后台/长页滚动时大幅减少合成开销。
- **`scroll-progress-bar.js` 去重排：** 在 `init`/`onResize`/`load` 时缓存 `clientHeight`、`totalHeight`（`state.metrics` + `refreshMetrics()`），热路径每帧只读取 `getScrollPosition()`（scrollY，不触发重排）并写高度，彻底消除进度条的每帧 `scrollHeight/clientHeight` 强制重排。
- **`project/log.html` 滚动高亮去重排：** 一次性缓存各 `section` 绝对偏移（`buildSectionOffsets` 于 init/resize/load），滚动期仅以 `scrollY + innerHeight*0.3` 探针与缓存偏移比对切换 `.active` 类，彻底消除每帧 `getBoundingClientRect` 强制重排（与 sidebar-progress 同一手法）。

### 14.4 权衡与保留项（视觉效果不变）

- `nav` 的 `backdrop-filter` 属既定的毛玻璃导航视觉效果，**未移除**；其滚动重绘成本已知。若后续需进一步压榨滚动帧率，可改为不透明实色背景，或仅在滚动静止后启用模糊——属视觉改动，须走评审。
- `hp-carousel` 的卡片 `will-change` / `blur` 空气透视属第十二节冻结的视觉效果，保持不变；其交互已用 rAF 合并、滤镜层在过渡结束后释放（见 5.10）。
- 首页酵母 SVG 的 `will-change: transform` 保持（动画期间需要），离屏已由 `animation-play-state` 暂停。

### 14.5 性能预算与回归防护

- 新增/修改脚本后，本地起 `python -m http.server` 打开内容页与首页，确认：侧边栏烧瓶进度与 TOC 高亮随滚动更新、HP reveal/轮播（若启用）正常、首页酵母浮动/打字机/滚动渐入正常、搜索面板可开；并用 DevTools Performance 录制滚动，确认无长任务与持续 rAF。
- 严禁 reintroduce 第十四节所列反模式（永久 rAF、滚动中同步读布局、同步阻塞的大脚本、永久 `will-change` 堆、无守卫的无限动画）。对应硬约束见第八节第 14–19 条。
- 任何推崇"看起来更顺"的视觉微调，若涉及 `backdrop-filter`、模糊、环形结构、动画参数，按第十二.4 判断：视觉改动须用户拍板。
