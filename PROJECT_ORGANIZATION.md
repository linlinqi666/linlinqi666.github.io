# 项目组织与设计系统总说明（SZPU-2026 iGEM Wiki）

> 本文档是 SZPU-2026 iGEM Wiki 的全局指导文档。它梳理了文件之间的层级与引用关系、当前已确立的美术风格与设计系统、已实现的页面框架与组件结构，并制定了未来开发必须遵循的约束规则。任何新增页面或修改，都应以本文件为唯一权威依据，确保不偏离现有风格体系与框架逻辑。
>
> 审查方式：基于全仓库静态文件分析，并使用 Playwright（Chromium）对 `index.html`、`project/description.html` 等页面进行实际渲染，提取了计算后的真实样式值（字体、背景、侧边栏尺寸、字号等）进行交叉验证。

---

## 一、项目总览

本项目是一个标准 iGEM 竞赛 Wiki 站点，采用纯静态 HTML + CSS + 原生 JavaScript 实现，无构建工具、无框架。站点按内容板块划分为五大一级栏目：`Project`、`Team`、`Dry Lab`、`Wet Lab`、`Human Practices`，外加首页 `index.html`。

核心设计语言是**棕色/咖啡（coffee-brown）主题**：以 `#8B5A2B` 为主色，深棕 `#5D3A1A` 为强调与页脚色，浅棕 `#D4A574` 为辅助；背景为暖奶油色 `rgba(252, 231, 203, 0.9)`；蓝色 `#4285F4` 仅用于链接，绿色 `#2E7D32` 仅用于成功/高亮状态。整体气质温暖、学术、克制。

---

## 二、文件层级与目录结构

```
SZPU-2026 wiki/
├── index.html                      # 首页（落地页，无侧边栏）
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
│   ├── integrated human-practices.html   # 综合 HP（含拖动轮播等特殊组件）
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
    │   │   ├── utils.js            # 公共工具库（必须先加载）
    │   │   ├── mobile-menu.js
    │   │   ├── page-progress-bar.js
    │   │   ├── scroll-progress-bar.js
    │   │   └── nav-scroll-behavior.js
    │   └── pages/                  # 页面专属脚本
    │       ├── members.js
    │       └── attributions.js
    ├── components/                 # 组件脚本（目录实为 static/components/，与 js/ 平级，非 js/components）
    │   ├── sidebar-progress.js
    │   ├── hp-reveal-box.js
    │   └── hp-carousel.js          # 3D 圆环轮播（见第十二节）
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
[可选组件] static/components/sidebar-progress.js   → 仅内容页
[可选组件] static/components/hp-reveal-box.js       → 仅 HP 页
[可选组件] static/components/hp-carousel.js         → 仅 HP 页（3D 圆环轮播，见第十二节）
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
| human-practices/integrated human-practices.html | integrated human-practices.css | 是 | 是 | sidebar-progress.js + hp-reveal-box.js + hp-carousel.js |
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
| 主色 Primary | `--color-primary` / `--color-brown` | `#8B5A2B` |
| 主色深 | `--color-primary-dark` / `--color-brown-dark` | `#5D3A1A` |
| 主色浅 | `--color-primary-light` / `--color-brown-light` | `#D4A574` |
| 主色极浅 | `--color-brown-lighter` | `rgba(139,90,43,0.05)` |
| 正文文字 | `--color-text` | `#333` |
| 次级文字 | `--color-text-light` | `#666` |
| 三级文字 | `--color-text-lighter` | `#999` |
| 卡片背景 | `--bg-card` | `#ffffff` |
| 页面背景 | `--bg-page` | `rgba(252, 231, 203, 0.9)`（暖奶油） |
| 侧边栏背景 | `--bg-sidebar` | `#FFF8E7` |
| 页脚背景 | `--bg-footer` | `#5D3A1A` |
| 浅灰背景 | `--color-bg-gray` | `#f4f4f4` |

**强调色（仅作点缀，不可泛滥使用）：**

| 用途 | 值 |
|---|---|
| 链接蓝 | `#4285F4`（hover `#1A73E8`） |
| 强调蓝 | `#4A90D9` / `#357ABD` |
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

`body` 采用 `display:flex; flex-direction:column; min-height:100vh`。所有页面统一包含：固定顶栏 `<nav>`（高 100px，背景 `nav_bc.webp` 毛玻璃模糊）、顶部阅读进度条（page-progress）、侧边滚动进度条（scroll-progress，部分页）、`<main>` 主内容区、底部 `<section id="footer" class="section-footer">`（背景 `#5D3A1A`）。

### 5.2 顶部导航栏（navigation.css + nav-scroll-behavior.js）

- `nav`：`position:fixed; top:0; z-index:9999; height:6.25rem`（滚动后 `.scrolled` 缩为 `5rem` 并加阴影）；背景 `url(../../image/nav_bc.webp)` 覆盖 + `backdrop-filter:blur`。
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

---

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
7. **根目录 stray 已清理（2026-08-04）：** 误生成的 `AppData/` 已移至 `communication/stray-backup/`；演示/调试文件 `demo-3d-timeline.html`、`map.html`、`static/iconfont/demo_index.html` 已移至 `communication/demos/`，保持部署目录干净。

---

## 八、未来开发约束规则（必须遵循）

以下是硬约束，**任何新增或修改都不得违反**：

1. **CSS 加载顺序：** 每个页面必须包含五大共享 CSS，且顺序为 `navigation.css → index.css → [页面/description].css → mobile.css → components/*.css`；**`mobile.css` 必须最后**，以保证响应式覆盖生效。
2. **JS 加载位置与顺序：** 所有外部脚本统一置于页面 `<head>` 并以 `defer` 加载（不阻塞渲染、DOM 解析后按文档顺序执行）；`core/utils.js` 必须最先。组件/页面脚本只在对应页面加载，不得全局强加；依赖已加载脚本的页尾内联脚本须包裹进 `DOMContentLoaded`（由 `tools/normalize-scripts.js` 自动处理）。
3. **统一内容页模板：** 新增内容页必须采用标准结构——加载 `description.css`、包含 `<aside class="description-sidebar">`、加载 `sidebar-progress.js`，并复用 `--desc-*` 令牌与现有组件类，**不要凭空发明新结构**。
4. **色彩只能来自令牌：** 所有颜色必须使用 `:root` 中的令牌（`--color-*` 或 `--desc-color-*`）。**禁止在业务样式中硬编码十六进制色值**；蓝色仅用于链接、绿色仅用于成功/高亮，不可作为主色扩散。
5. **保持棕色主题：** 主色固定 `#8B5A2B`，禁止引入新的主色或额外的字体族；字体栈保持 `system-ui` 体系。
6. **间距/圆角/阴影/动效复用令牌：** 必须使用 `--spacing-*`、`--radius-*`、`--shadow-*`、`--duration-*`、`--ease-smooth`，禁止随意写死像素数值或使用非标准缓动。
7. **图片必须可寻址：** 引用前确认文件存在于 `static/image/`（子页用 `../` 前缀），并为 `<img>` 保留 `onerror` 兜底。
8. **保留占位文件：** 不要删除任何专属 CSS 文件（即使是空占位），HTML 仍引用它们。
9. **全局组件不可删：** 顶栏、两条进度条、`nav-scroll-behavior.js` 是全局基础设施，删除会破坏全站一致性与阅读体验。
10. **尊重关键令牌注释：** `description.css` 中标注"不可改 / 由 navigation.css 接管"的令牌（侧边栏 sticky 定位、烧瓶进度因子、浮动装饰层级等）严禁改动。
11. **JS 模块化：** 新脚本以 IIFE/命名空间封装，避免全局污染，且不依赖 `utils.js` 之外的加载顺序。
12. **动效克制：** 新增动效须柔和、复用标准时长与 `--ease-smooth`，避免过长或突兀效果。
13. **对话产物隔离：** 对话/工具产生的任何额外文件（截图、导出、报告、工具日志等），必须在生成后立即移入 `communication/` 对应子目录，并确保 `.gitignore` 已覆盖；绝不允许留在仓库根目录或业务目录（详见第十一节）。

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
  <script src="../static/components/sidebar-progress.js" defer></script>
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

## 十一、对话产物与 .gitignore 管理约定（强制）

任何由对话/AI 过程产生的"额外文件"（截图、导出的中间文件、研究/总结报告、浏览器工具日志等）**严禁散落在仓库根目录或各业务目录**，必须统一归集到仓库根下的 `communication/` 文件夹。这是硬性约定，目的是避免污染版本库、干扰评审与部署。

### 11.1 归集规则

- **截图（*.png / *.jpg 等）**：例如用 Playwright 渲染验证时生成的 `description_page.png`、`index_home.png`，必须移入 `communication/`，不得留在根目录。
- **浏览器工具运行时文件夹 `.playwright-cli/`**（含 `console-*.log`、`page-*.yml` 快照）：由 Playwright 类工具自动生成，应整体移入 `communication/.playwright-cli/`。注意该工具下次运行仍可能在根目录重建 `.playwright-cli/`，故 `.gitignore` 同时忽略根目录的 `.playwright-cli/`。
- **研究/总结报告（*.md）**：对话生成的研究报告、页面总结等放入 `communication/research-reports/`，与正式文档（`PROJECT_ORGANIZATION.md`）区分开。
- **其它临时导出**：任何 `temp`、`export`、`_tmp` 类文件同理，先建子目录再放入，不要直接丢在根目录。

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

若仓库根目录出现非预期的文件夹（如 `node_modules/` 之外的 `.dbg/` 等），多半是某脚本把相对路径误写成仓库根导致的副产物，**不属于本项目内容**，应查清来源后清理，切勿随手提交。

> 注（2026-08-04）：历史上曾误生成 `AppData/` 文件夹，现已查明并移至 `communication/stray-backup/`（`communication/` 被 `.gitignore` 忽略），部署目录保持干净。同类 stray 仍按本警示处理。

### 11.4 流程约束（补充到第八节）

在第 8 节约束规则基础上追加：

> **第 13 条：** 对话/工具产生的任何额外文件，必须在生成后立即移入 `communication/` 对应子目录，并确保 `.gitignore` 已覆盖；绝不允许将其留在仓库根目录或业务目录。

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

- 第五节 5.8 与第八节提到的 `hp-perspective-carousel.js` 已不准确；当前实际文件为 `static/components/hp-carousel.js`（3D 圆环轮播，非拖动式）。后续以本节的 `hp-carousel.js` 为准。

---

## 十三、工程化脚本统一工具（tools/normalize-scripts.js）

为消除手工维护 18 个页面脚本顺序/路径的出错风险，项目引入零依赖 Node 脚本 `tools/normalize-scripts.js`，统一所有页面的外部脚本加载方式。

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
