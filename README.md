# 项目组织与设计系统总说明（SZPU-2026 iGEM Wiki）

> 本文档是 SZPU-2026 iGEM Wiki 的全局指导文档。它梳理了文件之间的层级与引用关系、当前已确立的美术风格与设计系统、已实现的页面框架与组件结构，并制定了未来开发必须遵循的约束规则。任何新增页面或修改，都应以本文件为唯一权威依据，确保不偏离现有风格体系与框架逻辑。
>
> 审查方式：基于全仓库静态文件分析，并使用 Playwright（Chromium）对 `index.html`、`project/description.html` 等页面进行实际渲染，提取了计算后的真实样式值（字体、背景、侧边栏尺寸、字号等）进行交叉验证。

> ### 最要紧的四条（文件很长、轻重不一，这四条每次动手前都要确认）
>
> 本文件各节轻重不同，以下四条是**违反即造成污染或返工**的硬规矩，其余章节按需查阅：
>
> 1. **对话产物当次归位，不等堆积。** 任何对话/工具产生的文件，生成那一刻就移入 `对话归档/`，并按月份容器与主题分层；**不要等用户来提醒才整理**。移动后同步全仓引用路径。详见 **第十一节 11.5**。
> 2. **根目录 `*.html` 是构建产物，改源不改产物。** 改页面必须改 `src/**/*.njk` 后跑 `npm run build:all`；直接编辑根目录 HTML 不算修复。详见 **第二节 / 第十节**。
> 3. **图片引用前先核对文件存在。** 历史上多次因文件名写错导致全站破图。详见 **第六节**。
> 4. **提交前 `git status` 复查。** 只暂存本次文件，禁止 `git add .`；不提交构建产物、`node_modules`、密钥与 `对话归档/`。详见 **第十七节**。

## 〇、当前项目关系与状态（2026-08-09）
本仓库内存在两个 wiki 工程，分工如下：
- **igem2026-flask（生产提交工程）**：基于官方 `wiki-frozen-flask` 模板的 Frozen-Flask 站点，为 2026 赛季正式提交版本。静态资源仅含 CSS/JS（图片走 `static.igem.wiki`），通过 `.gitlab-ci.yml` 源码构建发布，符合 iGEM 官方三条硬性规则。合规细节见 `对话归档/research-reports/gitlab/IGEM2026_WIKI_COMPLIANCE.md`。
- **根目录静态站点（本工程 / 历史参考版）**：早期手工静态站，图片保留在 `static/image/`，为 Frozen-Flask 迁移前的参考实现。现已按相同主题规范重新配色（米黄为主、棕为辅、蓝仅 footer），但**不作为**官方提交版本，仅作结构参考。
- **主题规范（两工程统一）**：主色=米黄/奶油、辅色=暖棕、强调=蓝（仅 footer）。详见第四节。

### 〇-1、模板化重构与冻结边界（2026-08-09，重构分支 `refactor/root-templates`）

根站从"逐页手写完整 HTML"迁移到 **Eleventy 静态生成 + 模板化**（引擎 `@11ty/eleventy` 已在 `package.json` 声明并安装，配置见根目录 `.eleventy.js`）。完整方案与分阶段执行步骤见 `对话归档/research-reports/OPERATION_PLAN_root_static_refactor.md`。

**模板架构（单一事实源）**：源文件在 `src/`，构建产物回写根目录原路径（部署结构不变）。
- `src/_includes/layouts/base.njk`：页面骨架（`<head>` 槽 + 导航槽 + 进度条 + `<main>` + 页脚槽 + 核心脚本）。
- `src/_includes/partials/`：`head.njk`（meta + 标准 CSS 顺序，按 front matter 注入页级 CSS）、`nav.njk`（桌面导航 + 移动菜单 + 搜索框，唯一事实源）、`footer.njk`（全站页脚唯一事实源）、`progress.njk`（进度条组件）。
- 页面改为 `src/**/*.njk` 内容文件，front matter 声明 `title`/`description`/`lang`/`css`/`js`/`htmlClass`/`bodyClass`/`mainClass`/`footer`/`basePath`/`headExtraPartial`/`permalink`，正文放在 `{% block main %}`；子页面 `basePath: "../"`（根相对路径），`headExtraPartial` 指向 `src/_includes/head-extra/*.njk`（页级 `<head>` 额外内容如内联 `<style>`/`<noscript>`/preconnect）。构建命令 `npm run build`（仅 Eleventy，回写根目录）或 `npm run build:all`（Eleventy + 运行搜索索引生成器 `static/js/core/search-index-generator.js`，产出 `search-index.json` 并执行资源/性能门禁）；本地预览 `npm run serve`（`eleventy --serve`）。**根目录 `*.html` 现已由 `src/**/*.njk` 生成，手工 HTML 为旧产物，新增/修改页面请改 `.njk` 后构建。**
- 一次性迁移脚本 `tools/migrate-to-njk.js`：从 `对话归档/backups/backup-pre-refactor/` 读取原始手写 HTML，自动抽取 head 元数据/页级 CSS·JS/`<main>` 正文/内联脚本/head 额外内容，生成对应 `.njk`；仅在初始迁移或批量重建时使用，日常维护勿直接运行。

**冻结区（禁止修改）与可变更区（本次范围）边界 manifest**：
- 冻结：`igem2026-flask/`（独立提交工程）、`对话归档/`（调试 demo）、`static/css/navigation/navigation.css` 的 `:root` 设计令牌、iGEM 合规不变量（禁第三方 CDN / CC 许可 / 页脚 gitlab 链接）、页面正文与 `[待补充]` 内容占位符、渲染视觉一致性。
- 可变更：代码组织（`src/` 模板 + `.eleventy.js`）、`tools/*.js`、每页 CSS 整合与去重、死代码清除、孤儿资产裁剪（图片/JS/CSS，先审计后删）。
- 注：`.eleventy.js` 已设 `clean:false`，构建**不会删除**根目录任何既有文件，非破坏性。

**新增页面流程（替代旧第九节的手写 HTML）**：在对应板块目录新建 `xxx.njk`，填 front matter + `{% extends "layouts/base.njk" %}` + `{% block main %}…{% endblock %}`，运行 `npm run build` 即生成 `xxx.html`。勿再手动复制 `<head>`/导航/页脚。

**搜索功能**：`nav-search` 标记在 `nav.njk`，索引数据 `static/js/core/search-index.json` 已由 `search-index-generator.js` 真实生成（JSON 文件，约 217KB）。`search.js` 在 `base.njk` 以 `defer` 加载，用户首次打开搜索时通过同源 `fetch()` 异步请求该 JSON 索引，避免每页预载数据；索引结果以 `document.createElement` + `textContent` + 受控 `<mark>` 安全渲染（不使用 `innerHTML`，杜绝索引内容注入 HTML 解析器）。`build:all` 自动重生成索引（随内容刷新）。旧 `normalize-scripts.js`/`inject-search.js` 因与 Eleventy 模板冲突已停用（不再调用）。

**迁移进度（2026-08-09）**：阶段 0–7 已完成、阶段 8 功能验收通过、阶段 6 按用户要求暂缓。18 个根站手写 HTML 已全部迁移为 `src/**/*.njk` 内容文件并由 `npm run build` 回写根目录；正文与原始备份逐页一致（差异 ≤11 字符，<0.02%）。`src/_includes/`（base.njk + partials + head-extra）为唯一事实源。Playwright 冒烟测试 18 页全部 nav/main/search/footer 齐全、零控制台错误。`description.css` 经复核为 11 页真实共用（非误包含），保留。`normalize-scripts.js`/`inject-search.js` 停用（冲突）。

---

## 一、项目总览

本项目是一个标准 iGEM 竞赛 Wiki 站点，采用纯静态 HTML + CSS + 原生 JavaScript 实现（无前端框架、无第三方 CDN）；根站引入 Eleventy（`@11ty/eleventy`，已装）作静态生成/模板化，单一事实源见 `src/_includes/`，详见第十节。站点按内容板块划分为五大一级栏目：`Project`、`Team`、`Dry Lab`、`Wet Lab`、`Human Practices`，外加首页 `index.html`。

核心设计语言是**米黄/奶油（cream）主题**：以米黄 `#FFF8E7` / `rgba(252, 231, 203, 0.9)` 为主色（导航栏背景、页面背景、下拉菜单、卡片），暖棕 `#8B5A2B` 为辅色（导航栏文字、标题、按钮、边框），深棕 `#5D3A1A` 为强调；蓝色 `#4A90E2` 仅用于 footer，链接蓝 `#4285F4` 仅用于超链接，绿色 `#2E7D32` 仅用于成功/高亮状态。整体气质温暖、学术、克制。

---

## 二、文件层级与目录结构

```
SZPU-2026 wiki/
├── index.html                      # 首页（落地页，无侧边栏）
├── README.md         # 本全局指导文档（唯一权威依据，!被 .gitignore 保留）
├── package.json / package-lock.json# 依赖声明（playwright-core）+ npm 脚本；支撑 npm run normalize
├── .gitignore                      # 忽略规则（含 /对话归档/、.playwright-cli/ 等非提交产物）
├── .github/                        # GitHub Pages 部署工作流（static.yml）
├── node_modules/                   # 依赖安装目录（.gitignore 忽略，不入库）
├── 对话归档/                       # 对话非正式文件归集地（.gitignore 忽略）
│   ├── README.md                   # 分类边界、目录树与维护清单
│   ├── analysis/                   # 分析、抓取与 OCR 输出
│   ├── backups/                    # 原始页面与修改前快照
│   ├── plans/                      # 执行与迁移计划
│   ├── research-reports/           # 调研、审计与总结报告
│   ├── screenshots/                # 截图与视觉验证图
│   ├── temporary-tools/            # 临时调试与抓取脚本
│   └── tests/                      # 演示、测试页与回归材料
├── tools/                          # 正式工程化脚本（非临时调试）
├── dry-lab/                        # 干实验板块
│   ├── hardware.html
│   ├── model.html
│   └── software.html
├── wet-lab/                        # 湿实验板块
│   ├── design.html                 # 实验设计（2026-09-26 由原 experiments.html 拆出）
│   ├── protocol.html               # 实验方案：材料 / 配方 / 步骤 / 对照（同上拆出）
│   ├── parts.html
│   ├── result.html
│   ├── safety.html
│   └── notebook.html
├── human-practices/                # 人类实践板块
│   ├── education.html
│   ├── integrated human-practices.html   # 综合 HP（含 3D 圆环轮播等特殊组件）
│   └── sustainability.html
├── project/                        # 项目正文板块
│   ├── description.html
│   ├── design.html
│   ├── engineering.html
│   └── contribution.html
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
    │   │   ├── scroll-progress-bar.css
    │   │   └── index-intro-gif.css   # 首页 GIF 开场动画（见 5.13）
    │   └── ...（各页面专属 CSS，部分为占位空文件）
    ├── js/
    │   ├── core/                   # 核心脚本
    │   │   ├── utils.js            # 公共工具库（必须先加载，无依赖）
    │   │   ├── mobile-menu.js
    │   │   ├── page-progress-bar.js
    │   │   ├── scroll-progress-bar.js
    │   │   ├── nav-scroll-behavior.js
    │   │   ├── search.js           # 全站搜索模块（见 5.11）
    │   │   ├── search-index.json   # 由 search-index-generator.js 生成的搜索索引（首次打开搜索时 fetch 按需加载，约 217KB）
    │   │   └── search-index-generator.js  # Node 脚本，扫描全站页面生成 search-index.json
    │   ├── components/             # 页面组件脚本（位于 static/js/ 下，与 core/、pages/ 同级）
    │   │   ├── sidebar-progress.js # 侧边栏烧瓶进度 + TOC 高亮（内容页）
    │   │   ├── hp-carousel.js      # 3D 圆环轮播（见第十二节）
    │   │   ├── hp-reveal-box.js    # HP 下拉揭示盒
    │   │   ├── executive-summary-animation.js  # 首页 10 屏滚动驱动 + 酵母浮动 + 打字机（见 5.12 首页分屏）
    │   │   └── index-intro-gif.js              # 首页 GIF 开场动画控制器（见 5.13）
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
[历史组件] static/js/components/hp-carousel.js         → 当前未被页面引用；恢复前见第十二节
[可选页面] static/js/pages/members.js / attributions.js → 仅对应页
```

> 工程化约定：上述全部外部脚本现已统一移动到每个页面的 `<head>` 并以 `defer` 加载（见第八节第 2 条与第十三节）。页尾依赖 `PageProgressBar` 的内联脚本 `new PageProgressBar().startAutoProgress();` 已由 `tools/normalize-scripts.js` 自动包裹进 `DOMContentLoaded` 监听，确保 defer 脚本先于其执行。

### 3.2 各页面依赖清单

页面按"内容页/自定义页"分类，加载差异集中在是否引入 `description.css` 与 `sidebar-progress.js`：

| 页面 | 专属 CSS | 是否 description.css | 是否侧边栏 | 额外 JS |
|---|---|---|---|---|
| index.html | — | 否 | 否 | executive-summary-animation.js + index-intro-gif.js |
| dry-lab/hardware.html | hardware.css(空) | 是 | 是 | sidebar-progress.js |
| dry-lab/model.html | model.css(空) | 是 | 是 | sidebar-progress.js |
| dry-lab/software.html | software.css(空) | 是 | 是 | sidebar-progress.js |
| wet-lab/design.html | experiments.css | 是 | 是 | sidebar-progress.js |
| wet-lab/protocol.html | experiments.css | 是 | 是 | sidebar-progress.js |
| wet-lab/result.html | result.css(空) | 是 | 是 | sidebar-progress.js |
| wet-lab/safety.html | — | 是 | 是 | sidebar-progress.js |
| wet-lab/notebook.html | log.css(实) | 否 | 否 | — |
| wet-lab/parts.html | parts.css(空) | 否 | 否 | — |
| human-practices/education.html | education.css(空) | 是 | 是 | sidebar-progress.js |
| human-practices/integrated human-practices.html | integrated human-practices.css | 是 | 是 | hp-reveal-box.js |
| human-practices/sustainability.html | — | 否 | 否 | — |
| project/description.html | — | 是 | 是 | sidebar-progress.js |
| project/design.html | design.css(实) | 否 | 是 | sidebar-progress.js |
| project/engineering.html | engineering.css(空) | 是 | 是 | sidebar-progress.js |
| project/contribution.html | contribution.css(空) | 是 | 是 | sidebar-progress.js |

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

`body` 采用 `display:flex; flex-direction:column; min-height:100vh`。所有页面统一包含：固定顶栏 `<nav>`（高 100px，背景米黄 `var(--bg-dropdown)`，已移除背景模糊）、顶部阅读进度条（page-progress）、侧边滚动进度条（scroll-progress，部分页）、`<main>` 主内容区、底部 `<section id="footer" class="section-footer">`（背景 `#4A90E2` 蓝，footer 专属）。

### 5.2 顶部导航栏（navigation.css + nav-scroll-behavior.js）

- `nav`：`position:fixed; top:0; z-index:9999; height:6.25rem`（滚动后 `.scrolled` 缩为 `5rem` 并加阴影）；背景 `var(--bg-dropdown)`（米黄主色），不使用 `filter` / `backdrop-filter`。
- 采用"图标字体 + 下拉"的 mega-menu 结构：主栏目（Home/Project/Team/Dry Lab/Wet Lab/Human Practices）用 iconfont 字形，每个主栏目下挂子页面图标/链接。
- 行为脚本 `nav-scroll-behavior.js` 实现：下滑隐藏（`.nav-hidden`）、上滑显示、滚动到一定位置加 `.scrolled`。**该脚本为全局必需，禁止移除。**

### 5.3 内容页侧边栏 + 烧瓶进度（description.css + sidebar-progress.js）

- 标记：`<aside class="description-sidebar">`，实测背景 `rgba(255,252,247,0.95)`、宽度约 `260px`（令牌范围 `min 280px / max 320px`）。
- 内嵌基于烧瓶液体的阅读进度可视化（`--desc-flask-*` 系列令牌，由 `sidebar-progress.js` 驱动随滚动上升）。
- `description.css` 中明确标注：`--desc-sidebar-position: sticky`、`--desc-sidebar-top-offset:120px` 等为"绝对不能改（navigation.css 会接管）"的关键配置。
- 仅"标准内容页"加载此组件；自定义布局页（design/notebook/members/attributions/sustainability/parts）无侧边栏，也不加载 `sidebar-progress.js`。

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
- `hp-flat-carousel.js`：根目录历史静态站点 HP 页顶部平面轮播导航；读取 `#detailTrack` 下四个带 `data-hp-article` 的详情 slide，动态生成可点击跳转卡片。官方 Flask HP 页使用 `hp-timeline.js` 与 `hp3d-root` / `dual-stage` / `cardsGroup` 容器，二者不可混用。
- `hp-carousel.js`：历史 3D 圆环轮播组件。当前 `integrated human-practices.html` 未输出 `.hp-carousel` DOM，因此该页不加载此脚本；如需恢复，须同时补齐有效标题、`alt` 与键盘交互的轮播结构，并复核图片路径。

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

首页 `index.njk` 为**全屏滚动叙事页**，由 10 个 `presentation-section`（`.yeast-screen`）分屏组成，每屏 `min-height:100vh` 且 flex 垂直水平居中：

| 屏 ID | 内容 | 背景（`--section-bg-img`） |
|---|---|---|
| `#hero` | 标题 + 副标题 + Start Journey | `画板+1.webp` |
| `#public-health` | 背景/痛点 | `画板+2.webp` |
| `#project-intro` | 项目简介 | `画板+3.webp` |
| `#dbtl-cycle` | 设计-构建-测试-学习 | `画板+4.webp` |
| `#statistics` | 实验结果 | `画板+5.webp` |
| `#safety` | 生物安全 | `画板+6.webp` |
| `#human-practices` | 人类实践 | `画板+7.webp` |
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
| `static/image/Animation/index/boot animation.GIF` | 1920×1080 | 9.2s | 第 1 段 |

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
- 覆盖层 `position:fixed` + `object-fit:cover` 占满视口；素材仅 712×400，全屏会放大，如需更清晰须重新导出高分辨率素材（或转 WebP/视频）。
- 下一帧用 `new Image()` 预取进 HTTP 缓存，切帧时才把 `src` 赋给 `<img>`，保证从第 1 帧起播，同时不与当前帧争抢带宽。
- **降级红线（不可回退）**：JS 禁用、`prefers-reduced-motion: reduce`、组件脚本 404、单帧下载超 20s，任一情况都必须让导航栏正常显示；`<head>` 内另设 6s 看门狗兜底。末帧若加载/解码失败，不再提前结束整段动画，而是由"各帧时长之和"的总时长兜底收尾，继续展示上一帧直到导航栏淡入，避免"播一半就消失"（超大 GIF 在浏览器/部署环境下较易加载失败）。
- 用户可随时点击「跳过动画」或按 `Esc` 立即收尾；该按钮为无边框、无背景的纯文字按钮，直接压在 GIF 画面上。
- 组件 CSS 经 `head-extra/index.njk` 在 `mobile.css` 之后加载，保证响应式覆盖顺序（第八.1）。

### 5.14 Design / Protocol / Results / Contribution 四页结构（2026-09-22 重建，2026-09-26 拆分）

四页按 `static/expriments/The extreme/` 下三套页面资料包（`exepriment/experiments/`、`result/`、`contribution/` 的 `output/15-*内容大纲.md`）重建，内容来源为 `static/expriments/` 四个模块的一手分析。原 `wet-lab/experiments.html` 于 2026-09-26 按用户指令拆分为 `wet-lab/design.html`（实验设计）与 `wet-lab/protocol.html`（实验方案）两页：原页删除，导航（`nav.njk` 移动 + 桌面两处）、页脚（`footer.njk`）、首页页脚与 `src/_data/contribution.js` 引用同步改到新页，搜索索引 `PAGES` 同步（需求 `REQ-20260926-002`）；他队样本分析与拆分方案见 `对话归档/2026-09/2026-09-26-experiments-split/`。

**Design 页**（`src/wet-lab/design.njk`）五节，承接设计层内容：

| 小节 | 锚点 | 内容 |
|---|---|---|
| 项目背景与检测目标 | `#design-overview` | 检测目标、主链四环、本页与 Protocol / Results 页的分工 |
| 实验总体设计 | `#design-framework` | 模块依赖与技术栈、跨模块 α-factor 体系提醒 |
| 各模块实验设计 | `#design-chassis` / `#design-pager` / `#design-gpa1` / `#design-reporter` | 底盘 / 受体 / 接口 / 报告，每模块固定三小节：设计目标 → 技术路线 → 判定与对照设计 |
| 设计迭代与失败 | `#design-iteration` | 卡点按「现象 → 判断 → 改动 → 结果」 |
| 结果与讨论 | `#design-discussion` | 四段合看的结论与未完成处；完整数值指向 Results 页 |

**Protocol 页**（`src/wet-lab/protocol.njk`，2026-09-27 起改为按实验组原始方案文档生成）：四个模块（`#protocol-chassis` / `#protocol-pager` / `#protocol-gpa1` / `#protocol-reporter`），页内不放导语、使用说明或页间分工说明，直接进入文档内容。每个模块只收录「目的 / 实验材料 / 实验步骤」三类章节，文字照实验组逐字稿录入、不做二次改写；报告体系模块按六份原始实验方案分列。原文档的「实验结果」「数据整理 / 结果判定 / 实验预期结果」章不收录（实测结果归 Results 页）。页面配图 8 张（设计类图谱，PNG 原件复制到 `static/image/protocol/<模块>/docx-media/`）；生成脚本与逐行文本覆盖校验、图片哈希校验记录见 `对话归档/2026-09/2026-09-27-protocol-from-source/`。2026-09-27 用户确认删除 6 段与 3.3.1 逐字重复的纯化步骤（生成脚本 `SKIP_RANGES` 清单，行号 + 首尾文本校验，源文档未改、可回滚）。两页共用 `experiments.css`。

- 分流规则：材料 / 配方 / 步骤 / 对照与结果判定归 Protocol（直接收录实验组源文档）；设计目的与方案演进的分析归 Design；实测结果归 Results——三页不互相复制数据。新增模块须在 Design 页与 Protocol 页同时补齐对应内容。
- 侧边栏 TOC 与页内 id 同步更新（Design 页两级：节 + 模块；Protocol 页四个模块一级项）；改锚点须同步 TOC。`sidebar-progress.js` 的 `sectionIdPrefixes` 已加入 `design-` / `protocol-` 前缀，TOC 可下钻到模块级。
- 内部待核项（KQ- / SQ- / RC- / GC- / RS-）记录在 `static/expriments/` 语料层与各模块分析文档；Protocol 页为源文档直录，不携带此类注释。

**Results 页**（`src/wet-lab/result.njk`，2026-09-26 按四份 result 源重写）六节：`#results-overview` 概览 → `#results-chassis` 底盘改造 → `#results-pager` 受体构建 → `#results-gpa1` 接口改造 → `#results-reporter` 报告体系（FUS1-yEGFP）→ `#results-discussion` 综合讨论。失败与在途不单列成页，穿插在对应模块内。2026-09-27：侧边栏 TOC 升级为两级（四个模块 level1 下各挂小节 `level3`，正文小节标题加锚点 `results-<模块>-<序号>`）；`sidebar-progress.js` 的 `sectionIdPrefixes` 已补 `results-` 前缀（否则高亮失效）；源 docx 的「目录」「在途与下一步」「原始数据清单」等元结构不进正文——目录转侧边导航，其余转模板 HTML 注释。侧边栏二级导航默认折叠，点击模块（level1）才展开其下小节（level3）；已移除 `:hover` 自动展开以避免布局抖动。正文小节由全站组件 `static/js/components/section-fold.js` 收纳条化（见 §5.14.1 / §5.14.2）：脚本运行时把 `.content-card` 内带 id 的 h3 小节包成原生 `<details class="section-fold">`（默认折叠、点击小节标题展开、侧边栏锚点命中自动展开；无 JS 时保持全展开降级），样式在全站 `static/css/components/section-fold.css`。

### 5.14.1 内容页耦合组件与集合测试约束（2026-09-27）

「侧边栏级联导航 + 正文收纳条」的页面存在一组**强耦合**前端组件，任一改动后必须联合验证，禁止「改 A 测 A 过、B 又瘫」式的分开测试：

- 各内容页 `.njk`：小节标题锚点 `<页面前缀>-<语义>` + 侧边栏 `level2/level3` 导航；
- `static/js/components/section-fold.js`（`base.njk` 全站加载）：把 `.content-card` 内带 id 的 h3 包成 `<details class="section-fold">` 默认折叠（点击展开、锚点命中自动展开）；
- `static/js/components/sidebar-progress.js`：滚动高亮（视口中线判定）+ 自动展开当前模块，依赖 `sectionIdPrefixes` 含对应页面前缀；
- `static/css/components/section-fold.css`（`head.njk` 全站加载）：收纳条样式 + 锚点 `scroll-margin-top`；
- `static/css/navigation/navigation.css`：侧边栏 `level2` 折叠态（默认折叠、点击 level1 展开）。

**耦合点（改动必触发）**：`section-fold.js` 折叠/展开会改变小节高度分布，直接破坏 `sidebar-progress.js` 的高亮区间判定；点击展开收纳条后若不复建章节偏移缓存（见 `recalculate()`），高亮会全错。二者通过 `details` 的 `toggle` 事件 → `SidebarProgress.recalculate()` 联动；加载顺序上 `section-fold.js` 先于页面级 `sidebar-progress.js`，使初始偏移即按折叠后布局计算。

**任一文件改动后，必须一起验证**：① 每个小节默认折叠、内容不丢；② 侧边栏 `level3` 链接的 href 在页面存在且位于收纳条内（点击能定位并展开联动）；③ 滚动时侧边栏高亮跟随正确、点击 `level3` 跳转后自动展开并高亮对应项；④ 页面无 `<p>目录</p>` 残留、无渲染态「在途与下一步」、无重复 id。

**验证命令**（不入库，位于 `对话归档/temporary-tools/`）：
- 结构/逻辑层（jsdom，无需浏览器）：`npm i jsdom playwright --no-save && node 对话归档/temporary-tools/check-content-pages.js`
- 几何/交互层（真实浏览器，用系统 Chrome）：`$env:CHROME_PATH='C:\Program Files\Google\Chrome\Application\chrome.exe'; node 对话归档/temporary-tools/e2e-content-pages.js`

### 5.14.2 内容页统一设计规范：小节锚点 + 收纳条 + 二级导航（2026-09-27 起）

凡正文分多个 `<div class="content-card">`、且侧边栏带 `level2/level3` 的页面，统一按 result 页模式设计；**新增页面零配置接入**（`section-fold.js` / `section-fold.css` 已由 `base.njk` / `head.njk` 全站加载）：

1. **小节标题必须有 id**：`<h3 id="<页面前缀>-<语义>">`，前缀取页面名（`results-` / `protocol-` / `design-` / `safety-` …），且该前缀必须登记在 `sidebar-progress.js` 的 `sectionIdPrefixes`，否则滚动高亮失效；
2. **侧边栏两级**：`li.level1`（模块，指向卡片 div 的 id）下挂 `ul.level2 > li.level3`（小节，指向 h3 的 id），默认折叠、点击 level1 展开；
3. **收纳条自动生效**：脚本运行时把每个 `.content-card` 内带 id 的 h3 及其后内容（至下一个 h2/h3）包成 `<details>`；数据渲染、正文无 h3 的页面可改用**整卡折叠**——给卡片 div 加 `data-fold-card`，脚本把 `.content-body` 收起、卡片标题 h2 留在收纳条上，锚点仍保留在卡片 div 上供侧边栏链接使用（该形态组件已具备，当前暂无页面启用）。两种情况页面都无需再写任何 JS；
4. **卡片级 id 与 h3 id 都保留**：滚动高亮按视口中线判定，落在卡片区间高亮 level1，落在小节区间高亮 level3；
5. 整页关闭折叠用 `<body data-section-fold="off">`；排除个别标题用 `<h3 data-no-fold>`。

**已按本规范改造**（wet-lab，2026-09-27）：`result`（22 小节）/ `safety`（7）/ `protocol`（15）/ `design`（15）。

**protocol 页特别说明（2026-09-27 第三轮）**：`src/wet-lab/protocol.njk` 由生成脚本 `对话归档/2026-09/2026-09-27-protocol-from-source/temporary-tools/build_protocol_njk.py` 从实验组源文档逐字生成，**锚点与两级导航已写进生成脚本**——正文 h3 为 `protocol-<模块>-purpose|materials|steps`（报告体系 6 份方案为 `protocol-reporter-plan-1..6`），侧边栏四个模块各挂对应 `level3`。维护该页须改脚本并重跑：`python build_protocol_njk.py` → 将 `generated/protocol.njk` 复制到 `src/wet-lab/protocol.njk` → `npx @11ty/eleventy` → 跑 §5.14.1 两套验证。**直接编辑 `src/wet-lab/protocol.njk` 会在下次重跑脚本时被覆盖。**

**已回退（2026-09-27，用户确认改造范围仅湿实验）**：dry-lab `software` / `hardware`、project `description` / `design` / `engineering` / `contribution`、human-practices `education` 共 7 页的锚点与折叠改造已用 git 精确还原（`src/` 下对应 `.njk` 回到改造前状态），为它们新增的 `sectionIdPrefixes` 前缀（`software-` / `hardware-` / `project-` / `engineering-` / `build-` / `test-` / `learn-` / `education-` / `description-` / `biological-` / `modular-` / `innovation-` / `references` 等）已一并撤除。这 7 页恢复原状：侧边栏 `level3` 指向页面中不存在的 id（点击无反应）、滚动高亮不生效。如未来要重启这些页的改造，按本节三步 + §5.14.1 两套验证执行。

**dry-lab `model` 页重新纳入（2026-09-27 重写，`REQ-20260927-001`）**：Model 页正文按干实验建模文档整体重写，同时按本规范重建锚点与两级导航，共 10 个小节（id 前缀 `model-`，已登记到 `sectionIdPrefixes`）；两套验证脚本的页面清单已加入 `dry-lab/model.html`（e2e target 由 `model-dose-response` 改为 `model-screening`）。

> 该页的素材、运行资源、打分数据与待核项**不在这里展开**，统一见 **`static/expriments/drylab/model/00-文件归属.md`**（该文件同时取代了同目录 `plan.md`）。

**例外与边界（2026-09-27 确认）**：

- `wet-lab/notebook` 是**例外页**：正文仅 PDF 阅读器、无小节，**不做收纳条**；其侧边栏 5 项（`#wet-lab` / `#dry-lab` / `#human-practices` / `#wiki` / `#team-management`）是 **PDF 文档切换器**（清单见 `static/js/pages/log-pdf-data.js` 的 `docs`，`defaultId: 'wet-lab'`，脚本注释明确 `href="#id"` 与文档 id 一一对应、不要随意更改）。点击不跳转（`log-pdf.js` 的 `bindSidebar` 内 `preventDefault`），由 `setActiveNav()` 给当前文档链接加 `.active` + `aria-current="page"` 实现高亮。**不纳入本规范的锚点/收纳条体系，但高亮必须保持工作**（验证脚本 `对话归档/temporary-tools/check-notebook-highlight.js`）。
- `team/attributions`（自带 `.jump-to-nav` + 独立 scrollspy）与 `human-practices/integrated human-practices`（209 KB 自定义地图结构）结构特殊，用户已确认**不在改造范围，不要改动**。
- `index`（幻灯式全屏）、`wet-lab/parts`（模板循环 + 原生 `<details>`）、`team/members`（数据驱动）无 `description-nav`，不适用本规范。

新增页面接入照旧三步：① 正文小节 h3 加 `<页面前缀>-<语义>` id（或整卡折叠时给卡片加 `data-fold-card`）② 前缀登记 `sectionIdPrefixes` ③ 侧边栏 level2/level3 指向这些 id；改完必须跑 §5.14.1 的两套验证（两套脚本的页面清单需同步加入新页）。

- 数据来源为四个模块各自的 result 源 docx（语料层见各模块 `md/result-正文逐字对照/`、`md/result-图片提取/`，逐字对账与图片核验记录见 `99-result-逐字校验记录.md`；跨源冲突编号 `RS-` 见 `static/expriments/00-跨模块索引与接口.md` §六）。
- **页面只呈现已得结果**（2026-09-26 口径）：`在途与下一步`、`原始数据` 两节不进页面；进度、待办、自我审核与跨源冲突一律写入**模板源码的 HTML 注释**（`src/wet-lab/result.njk` 页首的 `RS-` 清单，构建后保留在页面源码中、不对读者渲染），审核与结论交由实验组。
- 页面配图 18 张，放 `static/image/result/<模块>/`，由内嵌图转 webp（≤150 KB，宽 ≤1400 px）；源图与站点图的映射表在各模块 `md/result-图片提取/02-页面用图映射.md`。新增图沿用「`<figure>` + 句首编号图注」写法，示意图须在图注注明「示意图，非实验结果」。

**Contribution 页**（`src/project/contribution.njk` + `src/_data/contribution.js` 数据源）分章：概览 → 1 部件（`#contribution-parts`，4 条）→ 2 协议与方法（`#contribution-protocols`，4 条）→ 3 其他贡献（`#contribution-others`，3 条）→ 获取与许可（`#contribution-access`）→ 归属与致谢（`#contribution-attribution`）。每条贡献按三件套写：是什么、为什么对后续队伍有用、怎么拿到；卡片 id 规则为 `parts-*` / `protocol-*` / `other-*`。软件、硬件、教育三章无产出，整章不设。

**各页共同约定：**
- 表格沿用页面既有的内联写法（同一套 `border/padding`），新增表格保持一致。
- 进度/状态与官方对照内容一律不渲染（第八.20）：资料缺口直接留空，内部待核项（KQ- / SQ- / RC- / GC-）以 HTML 注释留在源码中。
- 设计 / 计划不写成结果：未完成的写「计划验证 / 尚未」，数据不足写清卡在哪一步。

> 注意：`.gitignore` 的 `*.md` 规则会连带忽略 `static/expriments/` 下的方案文档与页面模板；如需入库，须追加 `!static/expriments/**/*.md` 例外（同 11.2 的既有做法）。

### 5.15 Team 成员页分类与顺序（2026-09-15 重组）

`team/members.html` 的条带分组、成员卡与详情面板全部由 `static/js/pages/members.js` 的数据驱动渲染，分类顺序的唯一事实源是其中的 `ROLE_ORDER` 数组：

| 顺序 | 分类（`ROLE_ORDER`） | 含义 | 指示点颜色 |
|---|---|---|---|
| 1 | `PI` | 项目负责人（Primary / Secondary PI 作为展示标签另行传入 `roles`） | `--role-pi-text #991B1B` |
| 2 | `Adviser` | 指导教师 | `#92400E`（历史硬编码） |
| 3 | `Wet Lab` | 湿实验 | `--role-wet-text #1E40AF` |
| 4 | `Dry Lab` | 干实验 | `--role-dry-text #065F46` |
| 5 | `WIKI` | 网页与 wiki 建设 | `#2563EB`（历史硬编码） |
| 6 | `HP` | Human Practices | `--role-hp-text #9A3412` |
| 7 | `Art` | 视觉与美术 | `--role-art-text #0E7490` |
| 8 | `Designer` | 设计（当前无成员，空组自动不渲染） | `--role-designer-text #7E22CE` |

**成员数据字段（每人固定顺序）：** `id → name → roles → directions → bio → photoPosition → photoSize`，需要强制指定图片时在**末尾**追加可选的 `images`。

| 字段 | 作用 | 留空的后果 |
|---|---|---|
| `id` | 成员 id，同时决定图片文件名（`webp/<id>.webp`、`webp/<id>_kt.webp`） | 无 |
| `name` | 展示姓名（条带、详情面板、信息条） | 条带显示空白 |
| `roles` | 首项为展示标签，末项放分类角色（必须命中 `ROLE_ORDER`） | 不进入任何分组 |
| `directions` | 方向标签 | 不渲染标签行 |
| `bio` | 详情面板与右侧信息条的简介 | 不渲染简介，无占位文案 |
| `photoPosition` | 背景大图取景位置（CSS `background-position`） | 回退默认 `center top` |
| `photoSize` | 背景大图缩放（CSS `background-size`） | 回退默认 `cover` |
| `images`（可选） | 覆盖 `photo` / `avatar` 的候选路径 | 走下面的默认候选链 |

**照片微调（`photoPosition` / `photoSize`）速查表**（2026-09-30 现状，直接改 `members.js` 对应数值即可，无需动 CSS）：

| 成员 | id | 分组 | photoPosition | photoSize |
|---|---|---|---|---|
| Lijun Zhang | `zlj` | PI | `70% 0%` | `36% auto` |
| Yongjun Tang | `tyj` | PI | `100% 10%` | `78% auto` |
| Lizhen Zhu | `zlz` | Adviser | `100% 25%` | `68% auto` |
| Jianhua Zhou | `zjh` | Adviser | `100% 15%` | `84% auto` |
| Jie Xia | `xj` | Wet Lab | `center 30%` | `100% auto` |
| Yifan Gao | `gyf` | Wet Lab | `center 10%` | `60% auto` |
| Chengxi Luo | `lcx` | Wet Lab | `70% 10%` | `70% auto` |
| Xiaozhen Su | `sxz` | Wet Lab | `55% 10%` | `50% auto` |
| Aishi Zeng | `zas` | Wet Lab | `55% 10%` | `60% auto` |
| Yuelin Zheng | `zyl` | Wet Lab | `55% 10%` | `80% auto` |
| Rui Luo | `lr` | Dry Lab | `60% 30%` | `60% auto` |
| Qi Xu | `xq` | WIKI | `45% 30%` | `60% auto` |
| Ruoxi Li | `lrx` | WIKI | `60% 20%` | `60% auto` |
| Rouqing Chen | `crq` | WIKI | `center 34%` | `70% auto` |
| Yuquan Luo | `lyq` | HP | `60% 30%` | `60% auto` |
| Siqi Peng | `psq` | Art | `60% 30%` | `90% auto` |

- `photoSize` 用 `xx% auto` 表示"宽度按容器百分比、高度自适应"，人像不会被裁切；改用 `cover` 则铺满并裁切。
- 微调后需重新构建（`npx eleventy`；本环境 `npm run` 不可用，见第十.1 节），并在 HTTP 下刷新页面查看实际取景效果。

**图片候选链（`ImageResolver`）：**
- 背景大图：`webp/<id>.webp` → `源图片/<id>.jpg` → `源图片/<id>.png`。
- 条带头像：`webp/<id>_kt.webp` → `源图片/<id>_kt.jpg` → `源图片/<id>_kt.png` → `webp/<id>.webp` → `源图片/<id>.jpg` → `源图片/<id>.png`（后三项是「没有卡通头像」的兜底，避免 `onerror` 链耗尽出现破图）。
- **没有 `_kt` 卡通头像的成员**必须显式写 `images: { avatar: { candidates: [...] } }`，把本人照片放在首位：否则浏览器会先探测不存在的 `_kt` 路径，产生必然 404 的请求（已实测：不写会新增 12 条 404 控制台报错）。写成一行即可，与其余字段保持同一视觉格式；**补上 `_kt` 素材后应把该字段删掉**，回到默认候选链（否则会继续用本人照片当头像，`lrx` / `crq` 于 2026-09-16、`zlj` / `tyj` 于 2026-09-30 已按此处理）。
- **路径基准是页面，不是 JS 文件（2026-09-30 修坑）**：`images` 里的候选路径由浏览器按**当前页 URL**解析，成员页是 `/team/members.html`（一级目录），因此必须写 `../static/image/...`。写成 `../../image/...` 会被解析成 `/image/...` 而 404——`zlj` / `tyj` 的头像与大图曾因此整组裂图，且 `onerror` 兜底链同样指向错误路径，连回退都没有。默认候选链（`IMAGE_PATH_TEMPLATES`）本身就是 `../static/...`，**能走默认链就不要写覆盖**。
- **取景调参方法（2026-09-30）**：改完不要只凭肉眼，按「检测 → 求解 → 实测复核」三步走，脚本都在 `对话归档/temporary-tools/2026-09/`：
  1. `2026-09-30-face-detect-members.py`（YuNet）输出每张照片的人脸中心相对坐标与宽高比；
  2. `2026-09-30-members-photo-solve.py` 按桌面（1440×800）与移动端（334×219）两套容器尺寸网格搜索，求一组两端都能把人脸放进可视区的 `(size, px, py)`；
  3. `2026-09-30-members-photo-measure.js` 起真实浏览器截图并回读 `background-position/size`，再用第 1 步的脚本对截图做人脸检测复核（截图前必须先点掉全屏引导封面 `.members-intro`，否则每张截图都一样）。
  桌面理想落点：人脸中心 x≈0.60–0.62（避开左侧正文蒙版、又不压到右侧信息条）、y≈0.40–0.44；移动端卡片只有 219px 高且底部 62% 起淡出，人脸 y 需落在 0.35–0.40 才看得见。
- **照片晕影与取景参数的关系（2026-10-01）**：背景照片四周的米黄羽化由 `members.js` 的 `setPhotoBox()` 按**实际渲染框**算出并写入 CSS 变量（`--photo-left/right/top/bottom`、`--photo-fade-x/y`，挂在 `.members-bg-layer` 上），`members.css` 的 `.bg-mask` 四条渐变据此绘制。**不要让"照片边缘好不好看"成为改 `photoSize` / `photoPosition` 的理由**——取景参数只决定人脸构图，羽化跟随渲染框自动适配（窄幅照片的左右硬边同样会被羽化）。变量缺省时退化为"照片满铺、不羽化"，无 JS 或图片信息缺失时页面与旧版一致，不会出现整块不透明色。

**约定：**
- 成员的归属分类取自 `roles` 数组里**在 `ROLE_ORDER` 中排名最靠前**的一项（`getPrimaryRole`）；`roles` 中其余非分类项会作为标签显示在详情面板与右侧信息条，`ROLE_ORDER` 内的分类项则被 `CLASSIFICATION_ROLES` 过滤掉，不重复显示为标签。因此「Primary PI / Secondary PI」这类展示标签与分类角色 `PI` 必须同时写进 `roles`（如 `['Primary PI', 'PI']`）。
- 同组内成员顺序 = `members` 数组顺序；空分类组由渲染器跳过，不会出现空标题。
- 新增分类必须三处同步：`ROLE_ORDER`、`ROLE_COLORS`（`members.js`）与 `static/css/members.css` 的 `.group-indicator[data-role="…"]`，否则指示点无颜色。
- 新增成员只需补 `roles` / `directions` / `bio` / `photoPosition` / `photoSize`；`directions` 与 `bio` 暂缺时留空数组与空字符串，不写占位文案（遵守 flask 侧「占位符不得进入冻结版本」的同一口径）。
- **当前填写状态（2026-09-16）**：`zlj` / `tyj` / `lrx` / `crq` 的 `bio` 已填入本人句子（文案由团队成员提供，仅把中文全角逗号规范为英文逗号，其余未改）；四人的 `directions` 仍留空，待团队给出方向标签。`lrx` / `crq` 的源照片于同日替换为 3:4 竖构图，`lrx.webp` 1440×1920 / 263.1 KB、`crq.webp` 1440×1920 / 244.8 KB，取景仍为 `center 20%` / `60% auto`，如需更完整身位可下调到 `50% auto`。同日两人补入 `_kt` 卡通头像：`lrx_kt.webp` 1280×1280 / 62.3 KB、`crq_kt.webp` 1280×1280 / 44.8 KB（源 `lrx_kt.jpg` 108 KB、`crq_kt.jpg` 86.5 KB），条带头像改走默认候选链。
- `static/js/pages/members.js` 的性能预算已由 42 KB 上调至 46 KB（`tools/check-performance-budget.js`）：该文件同时承载成员数据与渲染逻辑，名册从 13 人增至 16 人并新增取景字段后，42 KB 只剩 71 字节余量，补文案即会触发构建失败；逻辑部分未增长。
- 生产提交工程 `igem2026-flask` 的同名文件为镜像（根站为权威源），仅图片前缀改为 `https://static.igem.wiki/2026/szpu-china/image/...`，改动须同步两侧；新增 WebP 需由团队上传至 iGEM Uploads CDN 后才在正式站点生效。
- 结构自检脚本（可重跑）：`node 对话归档/temporary-tools/2026-09/2026-09-15-check-members-format.js` —— 校验两工程字段顺序、分类命中、取景字段存在、`images` 首个候选文件真实存在，并打印上表。

### 5.16 成员页响应式布局与全屏引导封面（2026-09-16）

成员页此前的问题（多断点实测，见 `对话归档/logs/2026-09/2026-09-16-members-responsive-before*.txt`）：

| 问题 | 表现 | 根因 |
|---|---|---|
| 首屏双倍留白 | 桌面/移动条带顶部均在 200–228px 处才开始 | 全站 `main` 已有 `padding-top: 6.25rem`，`.members-strip` 又加了 `margin: 100px` |
| 移动端首屏"空白页" | ≤1024px 无任何成员内容、无照片 | 初始化只在 `width > 1024` 时选中首位成员；≤768 又直接 `display:none` 隐藏了背景图层 |
| 展开列表被裁 | 375px / 1024px 展开后末尾成员点不到 | `.members-strip.is-expanded .strip-groups { max-height: 1200px; overflow: hidden }` 固定上限 |
| 中段桌面照片被挤成缝 | 1180px 时照片可视带宽仅 410px | 条带固定 390px + 信息条固定 380px，均为固定值 |
| 嵌套滚动 | 移动端条带内部又出现独立滚动条 | 条带 `max-height: calc(100vh - 100px) + overflow-y: auto` 在堆叠布局下未取消 |

**改造后的布局矩阵（断点与 `members.js` 的 `DESKTOP_BREAKPOINT = 1100` 必须一致）：**

| 视口 | 布局 |
|---|---|
| ≥1100px | 桌面分栏：左条带（`clamp(300px,30vw,390px)`）+ 全幅人像背景 + 右侧信息条（`clamp(272px,24vw,380px)`），宽度随视口收缩 |
| ≤1099px | 堆叠：人像改为**顶部 hero 条**（`clamp(200px,30vh,340px)`，底部渐隐），条带折叠为切换器，信息条收起、简介进入详情卡 |
| ≤640px | 同上，hero 收窄至 `clamp(172px,26vh,260px)`，正文与标题降一档 |

关键实现点：

- **默认选中首位成员**（所有断点）：桌面展示其背景与信息条，堆叠展示 hero 与详情卡；堆叠布局下选中后自动收起列表，并在详情卡移出视口时平滑带入。
- **展开高度实测**：`setStripGroupsExpanded()` 把 `scrollHeight` 写进 `--strip-groups-max`，CSS 仅保留 `2400px` 兜底；组内折叠后由事件委托触发 `resyncStripGroupsHeight()` 重测，视口切换时清理。
- **无缓存验证环境**：`python -m http.server` 不发 `Cache-Control`，Chromium 会按启发式新鲜度直接复用缓存（本项目实测出现过 `members.css` 一小时未重新校验，导致"改了没生效"的假象）。验证请用 `对话归档/temporary-tools/2026-09/2026-09-16-dev-server-nostore.py`（强制 no-store），并注意重启浏览器会话以清掉旧缓存条目。
- **预算条目**：`members.js` 46 → 48 KB（新增响应式逻辑），并新增 `members.css` 26 KB、`components/members-intro.js` 6 KB、`components/members-intro.css` 7 KB 三条守护（见 `tools/check-performance-budget.js`）。
- **右侧简介条带排版规范（2026-10-01）**：`.rail-scroll` **不带卡片背景框**（用户 2026-10-01 明确反馈去掉背景/边框/阴影——原半透明卡片 + 阴影在视觉上"越过内容左缘"，且让右侧照片硬边看起来更突兀）。文字直接落在 `.bio-rail-inner` 的右侧不透明渐变上，字号/字色统一走全站令牌：姓名 22px/700/`--primary-blue`，角色 14px/600/`--color-text-light`，方向标签 13px/600/`--tag-fill-blue` 底，简介 15px/`--color-text`、行高 1.8，并以 `border-top: 1px solid rgba(43,108,176,.16)` 与标签区分层。`.bio-rail-inner` 两侧等宽内边距 `clamp(20px, 4vw, 36px)`，姓名/标签/简介共享同一测量宽度，长短简介都不破版。实测（16 位成员，1600×900）简介文字左端最深到 x=1286，该处 rail 渐变不透明度约 0.59，文字区背景亮度中位数 ≈241，深色正文对比充足。
- **展开动画右缘贴合不变量（2026-10-01，禁止回退）**：
  1. `.bio-rail.is-visible .bio-rail-inner` 的缓动**不得使用 y 分量 > 1 的过冲曲线**——原 `cubic-bezier(0.34, 1.56, 0.64, 1)` 会把 `translateX(100%) → translateX(0)` 推过终点，面板右缘因此短暂离开视口右缘；现用不过冲的 `cubic-bezier(0.22, 1, 0.36, 1)`。
  2. `.rail-edge-filler` 纵向几何为纯 CSS `top:0; bottom:0`（`position: fixed; right:0`，宽度取 `--scrollbar-width`），展开态 `transition: none`，**不再由 JS 逐帧回写 `top`/`height`**（时点依赖的同步滞后正是右缘空当的来源之一）。
  3. JS 侧只保留 `measureScrollbarWidth()` 写 `--scrollbar-width`。
  4. 验收方式：展开全过程逐帧断言 `railInner.getBoundingClientRect().right >= window.innerWidth - 0.5`（含起手与过冲瞬间）。
- **照片边缘羽化的方向陷阱（2026-10-01）**：`.bg-mask` 的四条羽化层中，**右缘与下缘的渐变必须落在照片渲染框之"内"**（`transparent` → 在照片右/下缘处变为 `opaque`），因为渲染框外本来就是米黄底色，渐变写在外侧等于完全无效；左缘/上缘相反（框内由 `opaque` 渐隐到 `transparent`）。曾因右缘写成"框外渐显"导致只有左侧有羽化、右侧全是硬边，排查脚本见 `对话归档/temporary-tools/2026-10/`。
- **预算门禁的实际位置（2026-10-01 核查）**：`tools/check-performance-budget.js` 在根站与 `igem2026-flask/tools/` 中**均不存在**，且 `package.json` 的 `build:all` 只含 `eleventy && search-index-generator`，**构建不会执行预算校验**（§10.1 的第 4 条与 §14.5 的引用均为过期描述，与 §17.3.1 的说明冲突）。可用的脚本位于 `对话归档/temporary-tools/check-performance-budget.js`，需手动运行。本次改动结果：根站 `members.css` 25.3 KB（上限 26 KB）、`members.js` 47.5 KB（上限 48 KB），均在预算内；脚本中的 `members.js` 上限已从过期的 46 KB 对齐为 README §5.16 记录的 48 KB。**不要把未运行的预算检查写成"通过"。**

**全屏引导封面（`#members-intro`）** —— 用户要求"进入成员页先看整队照片，点击再进入"：

| 项 | 说明 |
|---|---|
| 素材 | `static/image/character/源图片/total.jpg`（1919×1279 / 578 KB）→ `webp/total.webp`（1919×1279 / 163.5 KB）+ `webp/total-960.webp`（960×640 / 72.2 KB，供 `srcset`） |
| 状态机 | `<html>` 上的类驱动：`members-intro-armed`（显示封面、锁滚动、页面 `inert`）→ `members-intro-ready`（控制器就位，看门狗不再强收）→ `members-intro-finished`（收尾） |
| arm | 根站写在各页 head 片段 `src/_includes/head-extra/team-members.njk`（同步内联）；flask 为 `static/js/components/members-intro-arm.js`，由成员页 `head_extra` 块按页引入 |
| 进入方式 | 点击任意处 / Enter / Space / Esc / 「Enter the team」按钮；淡出后解锁滚动、恢复 `inert`、焦点交给条带容器（`tabindex="-1"`，不产生默认焦点环） |
| 降级 | 无 JS 时不 arm，`.members-intro` 默认 `display:none`，页面照常可用；控制器脚本 404/被拦截时 arm 内 8s 看门狗强制 `members-intro-finished` |
| 展示频率 | 默认**每次进入成员页都显示**；如需"每会话一次"，把 arm 脚本里的 `ONCE_PER_SESSION` 改为 `true`（控制器收尾时写 `sessionStorage`） |
| 无障碍 | 封面为 `role="dialog" aria-modal="true"`；页面内容置 `inert` + `aria-hidden`，避免 Tab 进入被遮挡区域；`prefers-reduced-motion` 下不做淡入淡出，页面唯一 `h1`（`.members-sr-only`）常驻 |
| 移动端取景 | 竖屏改用 `object-fit: contain`（整队完整可见，不裁人头）+ 同图模糊衬底；桌面用 `cover` + `object-position: center 28%` 保证头部完整 |

### 5.17 首页分屏组件拼装与「手动微调区」（2026-09-22）

首页 10 个 `.yeast-screen` 板块里的插画与装饰，由 `static/image/Animation/index/webp/` 的**设计切片**在 `static/css/index.css` 的 `.art-stage--sN` 舞台上拼装而成。成品对照图（7 张，1080×608）、实测数据与全部脚本归档在 `对话归档/2026-09/2026-09-22-homepage-assembly/`。

#### 装配工作流（顺序不可颠倒）

1. **先核对骨架**：改动落在 `index.html`（产物）与 `static/css/index.css`。调样式前先确认 `index.html` 里对应节点的类名与层级是否符合预期。
2. **再反向回写源**：`index.html` 由 `src/index.njk` 经 Eleventy 生成，**`src/index.njk` 才是源**。骨架结构调整必须同步回 `.njk`，否则下次 `npx eleventy` 会把改动覆盖掉。
3. **重建**：`npx eleventy`（见 §10.1）。
4. 只改 CSS 不需要重建，但**必须免缓存预览**（见下）。

#### 本地调试必须用免缓存服务（否则「改了没变化」）

`python -m http.server` 不发送 `Cache-Control`，Chromium 会按启发式新鲜度直接复用缓存（本项目实测出现过 `members.css` 一小时未重新校验）。改完样式看不到变化时，第一嫌疑是缓存而不是选择器。

```powershell
python "对话归档/temporary-tools/2026-09/2026-09-16-dev-server-nostore.py" 8124
# → http://127.0.0.1:8124/
```

#### project-intro 文字条（内容条，2026-09-22 定稿；2026-10-01 类名词义化 s3→project-intro）

6 条文字条按 **3 排 × 每排 2 条**摆在成品图红框内，带椭圆描边、左右边缘渐隐与无缝流动。参数集中在 `static/css/index.css` 末尾「project-intro 文字条」段（`--intro-*` 变量），**定位只有这一处**（旧的逐条 `.art--project-intro-pN` 绝对定位已移除）。首页屏序已于 2026-10-01 重排为 1→7→5→6→2→3→4，类名已随语义化脱离位置编号（见 REQ-20260928-002 §16/§17）。

| 参数 | 定稿值 | 作用 |
|---|---|---|
| `.intro-pills` inset | `left 1% / top 16.5% / width 98% / height 64%` | 红框范围 |
| `--intro-pill-h` | `clamp(15px, 3.3vh, 34px)` | 文字条统一高度（图片按比例缩放） |
| `--intro-pill-line` | `#4c9dd3` | 描边色，与文字同色 |
| `--intro-pill-lw` | `2px` | 描边粗细 |
| `--intro-pill-radius` | `999px` | 扁椭圆；写 `50%` 是数学椭圆，但两端会切到文字 |
| `--intro-fade` | `12%` | 边缘淡化起点，到边缘正好 100% 透明 |
| `--intro-flow-dur` | `28s` | 流动周期，改 `0s` 即静止 |

结构约定：每排 `.intro-pills__track` 内含**两段完全相同**的 `.intro-pills__group`（第二段 `aria-hidden`），位移 50% 恰好等于一整段宽度；删掉第二段会跳帧。

#### 组件切片的坐标系偏差（板块 4–7 与原图偏差大的根因）

实测差异（`section-verify.json`，数值越小越接近原图）：板块1 = 8.1、板块2 = 9.2、板块3 = 13.1、**板块4 = 15.6**、**板块5 = 14.0**、板块6 = 9.8、板块7 = 8.9 —— 板块 4/5 最差。已确认五条根因：

1. **坐标系错配**：切片导出画布是 **2720×1600（1.700）**，原图是 **1080×608（1.776）**。切片按宽等比缩到 1080 时总高变成 635，比原图高 27px（4.4%）。按原图量出的百分比套到切片上，纵向越往下误差越大；板块 4–7 的内容都在画面下半部，所以偏差最集中。
2. **画布留白未裁**：`s7-mascot-peek` 的内容只占画布 x 0.14–0.87、y 0.26–0.75。不裁留白就按 `width%` 放置，会整体缩小并错位。放置任何切片前都要先裁到 alpha 边界。
3. **整幅画布被当单件使用**：`s5-cloud`（2720×1600）、`s5-hill`、`shared-cloud-1`、`shared-wave-2/3` 是未裁剪的整幅画布，却被按「云／山本身」的小宽度（50.4%、60%）摆放，尺寸与位置双错。
4. **素材被误删**：`s7-mascot-peek.webp` 在抠底时因判定「近乎全挖」被丢弃（`alpha-report.json` 记 minAlpha=0），导致板块 7 缺右下角吉祥物。已从 `backups/webp-original/` 取回并裁到 alpha 边界（1169×795）。
5. **白色圆角卡片缺失**：原图中板块 4 的流程图与板块 7 的图表都坐在白色圆角卡片上；而 `s4-workflow-diagram.webp` 是 **RGB 无 alpha** 的矩形裁切（白底、直角、无描边），直接平铺会失去卡片观感。

> 动板块 4–7 之前先解决第 1 条。坐标系没定标就调百分比，等于在上一次错误的基准上再调一次。

#### human-practices 定稿（FluNet 图表，2026-09-24；2026-10-01 类名词义化 s7→human-practices）

定位只有 `static/css/index.css` 搜「human-practices：FluNet 图表」这一处。

| 元件 | 定稿值 | 说明 |
|---|---|---|
| `s7-wave` | `left 0 / bottom 0 / width 100%`（不写 height） | 满宽横条，贴底 |
| `s7-title` | `left 18.1% / top 5.9% / width 63.3%` | 图表标题（两行） |
| `s7-chart` | `left 5% / top 20% / width 90%` + `padding 3% 1.2%` + `background #fff` | 原图卡片比例约 2.97，切片本身 3.98，用 padding 撑高 |
| `s7-axis` | `left 40.9% / top 76% / width 20.4%` | Week start date |
| `s7-legend-*` | `top 91.4%`（三条） | 图例压在底部蓝波上 |
| `s7-mascot` | `left 77.6% / top 70.4% / width 15.9%` | 素材曾误删，已从 `backups/webp-original/` 取回并裁留白 |

卡片圆角 / 描边 / 阴影由 CSS 补（切片是直角白底矩形，见根因 5）。

#### 本轮已清掉的死引用（2026-09-24）

- `executive-summary` 吸顶条 section：徽标块删除后只剩空容器，仍是 `100vh + sticky`，会以空白奶油底盖住视口 → 整段已删。
- `s2-dashed-arrow.webp`（板块2 虚线箭头）与徽标块 5 张图（`Animation/line.svg`、`DNA-transparent.webp`、`Gpa1.webp`、`human-derived genes.webp`）引用已从 `src/index.njk` 移除。
- `shared-cloud-1.webp` 已把不透明纯白底键成透明（消除奶油底上的补丁块），原图在 `backups/webp-original/`。
- `static/image/bc/画板+1.webp`（hero 背景）原 404 已修复：源位于 `src/_includes/head-extra/index.njk` 的 `<link rel="preload">`（URL 编码 `%E7%94%BB%E6%9D%BF+1.webp`），图从未存在，已删除该预加载引用（2026-09-27，经 `对话归档/temporary-tools/check-static-assets.js` 复核 0 死链）。

---

## 六、图片与资源约定

- 所有图片归入 `static/image/`（导航背景 `nav_bc.webp`、HP 图片在 `static/image/HP/`）。
- **路径前缀规则：** 根目录页面用 `static/image/...`；子目录页面（如 `project/description.html`）必须用 `../static/image/...`。
- 引用图片前**必须确认文件真实存在于磁盘**，否则图片不显示。当前 HP 目录仅有 `expert.jpg`、`school1~4.jpg` 等少数真实文件；其余活动照片（如 `tsinghua-1~4.jpg`、`southchina-1~4.jpg`、`lecture-*.jpg`、`WWJ.png`）并不存在。
- 建议为 `<img>` 保留 `onerror` 兜底（显示"待补"或默认图），避免破图破坏版式。

---

## 七、已发现的问题与不一致（需警惕）

1. **占位空 CSS 文件：** `contribution.css`、`engineering.css`、`education.css`、`hardware.css`、`model.css`、`parts.css`、`result.css`、`software.css` 均为 0~44 字节占位文件，其页面样式实际来自 `description.css`。新增样式可写入对应文件，但**切勿删除这些占位文件**（HTML 仍引用它们）。
2. **页面样式模式不一致：** 部分页（design/notebook/members/attributions/sustainability/parts）未加载 `description.css` 也无侧边栏，与"标准内容页"模式偏离。新增内容页应优先采用标准模式，除非确有自定义布局需求。
3. **图片路径风险（历史教训）：** 曾出现将 `expert.jpg` 误写为 `WWJ.png`、将 `school1~4.jpg` 误写为 `lecture-1~4.jpg` 导致全站破图。任何图片改动都需先核对文件存在性。
4. **`file://` 协议受限：** 本地直接双击打开 HTML 会被浏览器以 `file:` 协议拦截脚本/资源；测试须通过本地 HTTP 服务（如 `python -m http.server`）访问。
5. **description.css 关键令牌标注：** 其中多处写明"绝对不能改 / navigation.css 会接管"，修改前务必阅读注释。
6. **脚本加载策略已统一（工程化重构，2026-08-04）：** 原先混用"底部同步脚本 / head 内 defer / head 同步"三种写法，已全部统一为"外部脚本置于 `<head>` + `defer`"，并由 `tools/normalize-scripts.js` 自动维护；页尾依赖 `PageProgressBar` 的内联脚本已包裹 `DOMContentLoaded`。请勿再恢复手写底部脚本堆（详见第十三节）。
7. **根目录 stray 二次清理（2026-08-04）：** 此前误生成的 `AppData/` 已移至 `对话归档/backups/`；演示/调试文件 `demo-3d-timeline.html`（根目录为与 `对话归档/tests/` 同名的重复副本，已删除）、`map.html`、`static/iconfont/demo_index.html` 已移至 `对话归档/tests/`。本批又将所有散落在根目录的验证截图（`verify-*.png`、`hero-final.png` 等共 14 张）、调试脚本（`screenshot.js`/`shot.js`/`verify.js`/`restructure.js`）与运行日志（`*.log`）、测试页（`test-css.html`/`test-timeline.html`）分别归集至 `对话归档/screenshots/`、`对话归档/temporary-tools/`、`对话归档/tests/`，并删除了空垃圾文件夹 `.dbg/`。根目录现仅保留 `index.html`、`README.md`、`.gitignore`、`package.json`/`package-lock.json` 及正式栏目目录，部署目录保持干净（详见第十一节）。

8. **脚本路径 404 已修复（2026-08-07）：** 文档与 `normalize-scripts.js` 曾把组件脚本写成 `static/components/*`、把 `executive-summary-animation.js` 写成 `static/js/core/*`，而真实目录为 `static/js/components/`，导致 `sidebar-progress.js`、`hp-reveal-box.js`、`executive-summary-animation.js` 在相关页面 404（交互静默失效）。现已统一修正：18 个页面的引用与 `normalize-scripts.js` 生成器路径均已改为 `static/js/components/*`；如新增页面请用第九节模板（路径已正确），不要手写错误路径。
9. **搜索索引重构（2026-08-26）：** 原 `search-index.js`（约 189KB，`window.iGEMSearchIndex`）在每个页面 `<head>` 内同步/defer 加载，既阻塞首屏又携带 XSS 风险（索引内容经 `innerHTML` 注入）。已彻底重构为 `search-index.json`（约 217KB）经同源 `fetch()` 按需加载（仅首次打开搜索时请求），搜索结果以 `document.createElement` + `textContent` + 受控 `<mark>` 安全渲染，**不使用 `innerHTML`**；重复搜索复用同一加载 Promise，JSON 失败回退空索引。公开页面结构、搜索 CSS 类、页面链接均保持不变。
10. **性能问题清单（2026-08-07，详见十四）：** 全站卡顿的根因包括：(a) 多页面并存多个独立 `scroll` 监听各自触发 rAF；(b) `sidebar-progress.js` 原每帧对全部 section 调用 `getBoundingClientRect()` 造成强制同步布局（已改为缓存偏移）；(c) `hp-timeline-3d.js` 原永久 rAF 循环（已改为收敛即停）；(d) CSS 的 `backdrop-filter` 滚动重绘、首页酵母 SVG 常驻 `will-change` + 无限动画、懒加载图 `filter:blur` 占位、多处大 `box-shadow`。上述 (b)(c) 已修复；2026-08-28 已移除全站 `filter` / `backdrop-filter`，并删除自定义光标动画；酵母动画保留离屏暂停。
11. **根目录散落脚本已收纳（2026-08-07）：** `inject-search.js` 原散落在仓库根目录，已移入 `tools/`（与 `normalize-scripts.js` 同为正式工程化 Node 脚本，不属于浏览器运行时资源，故不入 `static/js/`）。搬运时一并修正：①`ROOT` 由 `path.resolve(__dirname)` 改为 `path.resolve(__dirname, '..')`（`__dirname` 现指向 `tools/`，须回退一级到仓库根，否则页面路径拼接错位导致全部跳过）；②其注入的 `search-index.js` 原不带 `defer`，重跑会回退第七.9 的首屏优化，已改为 `defer`。`package.json` 新增 `npm run inject-search`（并补齐缺失的 `npm run normalize`）；运行请用 `node tools/inject-search.js` 或 `npm run inject-search`，不要再在根目录直接 `node inject-search.js`。注：2026-08-26 搜索索引已重构为 `search-index.json` + `fetch`，`inject-search.js` 注入 `search-index.js` 的职责已不再使用，该脚本保留仅为历史兼容，**不应再执行**。
12. **图片路径重构（2026-08-07）：** `static/image` 目录重组后，全站共 20 个页面/CSS 的图片引用失效。已按磁盘真实位置重构：①`SZPU(notext).png`、`shiyao(notext).jpg` 由 `static/image/` 根移至 `static/image/any-icon/`；②`nav_bc.webp`（CSS 内 `../image/nav_bc.webp`、`../../image/nav_bc.webp`）移至 `static/image/wikiStructure/`；③页脚背景图 `bc/index_bc7.jpg`/`.webp`（15 页 `<picture>` 页脚背景）重命名为同目录 `bc/画板+7.jpg`/`.webp`。共 38+30 处替换；`index.css` 第 2151 行 `xx.jpg` 仅为注释示例、非真实引用，`project/description.html` 与 `wet-lab/experiments.html` 中 `%E7%94%BB%E6%9D%BF+7.webp` 为 `画板+7.webp` 的 URL 编码写法（文件真实存在，浏览器解码后正常），二者均无需改动。最终解码感知复扫：**全站 0 个真实失效图片引用**。

13. **底部页脚图标统一为 .webp（2026-08-07）：** 依 index.html 底部示例（`static/image/any-icon/SZPU(notext).webp` / `shiyao(notext).webp`），将全站 18 个页面底部页脚 SZPU/shiyao 图标引用由 `.png`/`.jpg` 改为 `.webp`（共 36 处），位置仍保留 `any-icon/`，文件均存在。integrated human-practices.html 第 1297 行时间轴数据 `img: '../static/image/any-icon/home.webp'`（15.77KB）经核对已正确，无需改动，一并记录备查。
14. **integrated HP 内联 3D 时间轴 rAF 收敛即停（2026-08-07）：** 该页 3D 时间轴由**内联脚本**（非外置 `hp-timeline-3d.js`，该页未加载外置文件）驱动，原 `startLoop→loop` 在 1551 行**无条件 `requestAnimationFrame(loop)` 永久循环**，即使圆环静止也每帧重写全部卡片/节点的 transform、opacity、zIndex，并逐帧改写每个时间节点 label 的 `fontSize`/`color` → 持续占用主线程，为 integrated HP 页卡顿**头号原因**。已改为收敛即停（kick/rafId 模式：仅 `snapActive` 吸附动画进行中持续循环，静止即 `rafId=null` 停；滑块/点击/键盘/窗口缩放经 `kick()` 重启），视觉不变。另发现时间轴封面引用 `static/image/HP/southchina/SZU.jpg`（**13.5MB**）、`static/image/HP/school1.jpg`（3.6MB）等巨型图片，且 `assignCard` 用 `loading='eager'` + `preloadOne` 主动预解码全部 4 张，建议转 webp 并缩图（数 MB 的 JPG 作小封面会瞬间占满主线程解码）。详见第十四节。
15. **`scroll-progress-bar.js` 缓存布局尺寸（2026-08-07）：** 原 `calculateProgress()` 每帧滚动都调用 `getClientHeight()` + `getScrollHeight()`（读取 `documentElement.scrollHeight/offsetHeight/clientHeight`），与每帧 `style.height` 写入交错形成**强制同步布局**；`scrollHeight/clientHeight` 仅在 resize 或资源加载时才变化，滚动期恒定。已改为在 `init`/`onResize`/`load` 时缓存 `clientHeight`、`totalHeight`（新增 `state.metrics` + `refreshMetrics()`），热路径只读取 `getScrollPosition()`（scrollY，不触发重排）并写高度——消除进度条的每帧重排。视觉/进度数值完全不变。
16. **`wet-lab/notebook.html` 滚动高亮缓存偏移（2026-08-07）：** 该页内联 `updateNavHighlight` 原每 100ms（本地 `throttle`）对全部 `section` 调用 `getBoundingClientRect()` 计算可见比例，与 sidebar-progress 旧 bug 同类——**每帧强制同步布局**，为 log 页滚动卡顿的主因。已改为在 `init`（`buildSectionOffsets`）+ `resize`（防抖）+ `load` 时一次性缓存各 section 绝对偏移（`rect.top + scrollY`），滚动期仅用 `window.scrollY + innerHeight*0.3` 探针与缓存偏移做数值比较后切换 `.active` 类，彻底消除每帧 `getBoundingClientRect`。视觉/高亮行为不变。`sections`/`navItems` 与本地 `throttle` 均保留。
17. **igem2026-flask 工程 JS 性能优化已同步（2026-09-02）：** 根站 JS 性能优化已同步至 `igem2026-flask/`，两工程 JS 实现保持对齐——搜索索引 `search-index.json` + 同源 `fetch()` 按需加载与 DOM API 安全渲染、`utils.prefersReducedMotion()` 及 executive-summary 动效降载、`sidebar-progress.js` / `attributions.js` 精简测试死代码、HP 地图同省专家聚类图钉（`.hz-cluster`）减少 DOM 图钉数量。flask 侧搜索索引由 `flask freeze` 后运行 `static/js/core/search-index-generator.js` 扫描 `public/*.html` 平铺结构生成，与根站扫描根目录页面同构不同源；联动说明见 `igem2026-flask/README.md` 的 "Performance & JS optimization" 一节。

⚠️ **18. 进度与状态内容渲染警告（2026-09-16，最高优先级警示）：** 实验两页（`design` / `protocol`，2026-09-26 由 `experiments` 拆出）与贡献页（`contribution`）中所有**进度状态显示**（Progress Status 小节、"实验进度汇总"卡片及侧边栏入口、✅/🔄/⏳ 状态标记、`status-badge` 徽章、"每条都带状态标记"说明段、进度/factStatus/核验 字段）与所有**"官方要求项 → 本实验的落实方式"对照表**，一律**不得渲染在页面上**——它们只能存在于源码注释、`对话归档/` 计划文档，或本 README 警告区。当前这些内容已全部以注释形式保留在 `src/wet-lab/design.njk`、`src/wet-lab/protocol.njk`、`src/_data/contribution.js` 中；**任何后续修改不得把它们重新改为渲染内容**。没有资料的条目直接留空（空表格单元格 / 空字段），不要再补"待补充"类占位徽章。页面侧边栏的"发酵进度"烧瓶是全站通用阅读进度组件，不属于本条约束范围。

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
13. **对话产物隔离（最高优先级红线）：** 对话/工具产生的任何额外文件（截图、导出、报告、工具日志、临时调试脚本、测试页、误生成文件夹等），必须在生成当次立即移入 `对话归档/` 对应子目录，并确保 `.gitignore` 已覆盖；绝不允许留在仓库根目录或业务目录。提交前务必 `git status` 复查（详见第十一节）。

14. **脚本路径必须真实存在：** 所有 `<script src>` 指向的文件必须位于磁盘（组件在 `static/js/components/`、核心在 `static/js/core/`、页面在 `static/js/pages/`）。改动路径后须用 `npm run normalize` 重新生成并本地起服务验证无 404（历史教训见七.8）。
15. **滚动监听必须节流：** 任何 `scroll` 监听须用 `utils.rafThrottle` 或单 rAF 合并 + `passive:true`；**禁止在滚动回调中同步读取布局**（`getBoundingClientRect`/`offsetTop`/`clientHeight` 等），应在 init/resize 时缓存偏移，滚动期只做样式写入（见十四.3）。
16. **禁止永久 rAF 循环：** 动画/轮询类逻辑（如 3D 圆环）必须在达到目标态后停止 `requestAnimationFrame`，仅在交互时重启；不得每帧无条件重写 transform（见十四.3）。
17. **大体积数据脚本不得阻塞首屏：** 索引/数据类脚本（如 `search-index.json`）一律按需懒加载（同源 `fetch()`），禁止在 `<head>` 内同步加载（见十四.3）。
18. **谨慎使用高成本 CSS：** `backdrop-filter`、`filter:blur`、`position:fixed` 全屏层、过多/过大 `box-shadow` 会显著增加绘制与合成开销；`will-change` 仅作临时提升并尽快释放，不要永久堆在大量元素上；无限 `@keyframes` 动画须离屏暂停（`IntersectionObserver` 设 `animation-play-state:paused`）或尊重 `prefers-reduced-motion`。
19. **性能预算：** 单页并存独立 `scroll` 监听不超过必要数量；新增持续动画前先评估其合成/绘制成本，长页面尤甚。
20. **页面只呈现已得结果，冲突与审核事项写进代码注释（2026-09-26）：** 内容页正文只写已得结果与对应数据，不写进度、待办、自我审核或"还需核对"类陈述；跨源冲突、单位口径、归一化缺口等一律写入**模板源码的 HTML 注释**（构建后保留在页面源码中，读者不可见）。`在途与下一步`、`原始数据` 这类收尾节不进页面。一切审核与结论交由实验组，页面不作自我判定。当前实例：`src/wet-lab/result.njk` 页首的 `RS-1…RS-8` 注释块。
21. **进度/状态与官方对照内容一律不渲染（2026-09-16，最高优先级）：** 页面上不得出现任何实验进度状态（Progress Status、进度汇总表、✅/🔄/⏳、status-badge 徽章、"已完成/进行中/待进行"类字样）与"官方要求项 → 落实方式"对照表（iGEM Check 自检内容）。此类信息只允许三种去处：① 源码 HTML/JS 注释；② `对话归档/` 计划文档；③ 本 README 第七.18 警告区。实验页与贡献页已按此清理，后续新增内容必须遵守；对外页面没有资料的条目直接留空。

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

### 10.1 构建命令与 npm 退出码陷阱（2026-09-16 实测）

`package.json` 定义的 `build:all` = `eleventy && node static/js/core/search-index-generator.js && node tools/check-static-assets.js && node tools/check-performance-budget.js`。

**注意：在本项目当前的 Windows 沙箱 shell 中，`npm run <script>` 无法执行脚本** —— `npm run build`、`npm run test:smoke` 均静默 `exit 1`、子进程无任何输出，`eleventy` 也未真正运行（产物时间戳不刷新）。此时 `npm run build:all` 的退出码**不能**作为构建结论，请改为逐条执行等价命令并各自核对退出码：

```powershell
cd "f:\IGEM\SZPU-2026 wiki"
npx eleventy                                    # 生成各栏目 HTML（当前 18 页）
node static/js/core/search-index-generator.js   # 生成 static/js/core/search-index.json
node tools/check-static-assets.js               # 静态资源引用检查
node tools/check-performance-budget.js          # 性能预算（见 14.5；members.js 现为 46 KB）
```

在能正常运行 npm 的环境（CI / 正常终端）中，仍以 `npm run build:all` 为准；若它失败，按上面四条逐条定位。

---

## 十一、对话产物与 .gitignore 管理约定（强制，最高优先级红线）

> **核心红线（务必牢记）：** 任何由对话/AI 过程产生的"额外文件"（截图、导出的中间文件、研究/总结报告、浏览器工具日志、临时调试脚本、测试页、误生成的文件夹等）**严禁散落在仓库根目录或任何业务目录（`dry-lab/`、`wet-lab/`、`human-practices/`、`project/`、`team/`、`static/` 等）**。它们必须统一归集到仓库根下的 `对话归档/` 对应子目录。这是硬性约定，优先级高于"先放着、以后整理"的随意习惯——**一经生成就立即归位**，绝不能留到部署/评审前才发现满盘狼藉。

**为什么这条规定如此重要（真实教训）：**
- **污染版本库与部署产物**：这些文件会被误提交进 git，或随静态站一起被部署到 iGEM 服务器，导致对外页面出现无关的 `verify-*.png`、`test-*.html`、`.log` 等垃圾。
- **干扰评审、损害专业度**：评委或协作者打开仓库时，根目录成堆的散落文件会严重损害项目观感，且难以分辨哪些才是真正的内容文件。
- **破坏目录约定、引发路径风险**：脚本误把相对路径写成仓库根，会生成 `.dbg/` 之类的 stray 文件夹（见 11.3）；随手新增图片/脚本还可能踩中第六节"图片路径风险"的历史坑。
- **2026-08-04 已两次发生根目录散落**：先有 `AppData/`，后又出现 14 张验证截图、`screenshot.js`/`shot.js`/`verify.js`/`restructure.js` 等调试脚本与 `*.log`、测试页 `test-*.html`，以及空垃圾文件夹 `.dbg/`，已全部二次清理归集（见第七.7 条）。这正说明"随手留根目录"极易复发，必须靠纪律而非事后补救。

### 11.1 归集规则（按类型入座）

- **截图 / 验证渲染图（`*.png` / `*.jpg` 等）**：Playwright 渲染验证生成的 `description_page.png`、`index_home.png`、`verify-*.png`、`hero-final.png` 等，一律移入 `对话归档/screenshots/`，不得留在根目录或业务目录。
- **演示 / 测试 HTML**：`demo-3d-timeline.html`、`map.html`、`demo_index.html`、`test-css.html`、`test-timeline.html` 等归入 `对话归档/tests/`（注意：正式页面引用的是 `对话归档/tests/demo-3d-timeline.html`，根目录同名副本为重复，应直接删除而非再存一份）。
- **研究 / 总结报告（`*.md`）**：对话生成的研究报告、页面总结放入 `对话归档/research-reports/`，与正式指导文档 `README.md` 严格区分。
- **调试 / 抓取脚本与日志（`*.js` / `*.cjs` / `*.py` / `*.log` 等）**：验证、截图、微信抓取、轮播调试、`restructure` 等工具脚本与运行日志归入 `对话归档/temporary-tools/`；`tools/` 目录仅存放正式工程化脚本（如 `normalize-scripts.js`），不要把临时调试脚本混进去。
- **误生成文件夹 / 页面备份**：`AppData/`、`ORIGINAL_integrated.html` 之类归入 `对话归档/backups/`。
- **浏览器工具运行时文件夹 `.playwright-cli/`**（含 `console-*.log`、`page-*.yml` 快照）：由 Playwright 类工具自动生成，整体移入 `对话归档/logs/playwright/`。该工具下次运行仍可能在根目录重建，`.gitignore` 同时忽略根目录的 `.playwright-cli/`。
- **其它临时导出**：任何 `temp`、`export`、`_tmp` 类文件同理，先建子目录再放入 `对话归档/`，不要直接丢在根目录。

### 11.2 .gitignore 对应条目

`对话归档/` 与工具运行时目录已在 `.gitignore` 中忽略，相关内容不会进入版本库：

```
# === 对话产物 / 工具生成文件（不入库） ===
对话归档/
.playwright-cli/

# 保留项目指导文档（否则会被上方的 *.md 规则忽略）
!README.md
```

> 重要：`README.md` 本身是 `.md`，会被仓库中既有的 `*.md` 规则一并忽略。已通过 `!README.md` 例外保留，使其可被正常提交与版本管理。若后续新增其它需长期保留的 Markdown 指导文件，请同样追加 `!文件名.md` 例外。

### 11.3 根目录 stray 文件夹警示

若仓库根目录出现非预期的文件夹（如 `node_modules/` 之外的 `.dbg/` 等），多半是某脚本把相对路径误写成仓库根导致的副产物，**不属于本项目内容**，应查清来源后清理（空的 `.dbg/` 直接删除），切勿随手提交。

> 注（2026-08-04，二次清理）：历史上曾误生成 `AppData/` 文件夹，已查明并移至 `对话归档/backups/`；本轮又出现空 `.dbg/` 文件夹，已删除；同类 stray 仍按本警示处理。

### 11.4 流程约束（补充到第八节）

在第 8 节约束规则基础上追加：

> **第 13 条（最高优先级）：** 对话/工具产生的任何额外文件，**必须在生成当次立即**移入 `对话归档/` 对应子目录，并确保 `.gitignore` 已覆盖；绝不允许将其留在仓库根目录或业务目录。提交前请务必 `git status` 复查根目录与业务目录，确认无 stray 文件混入。

### 11.5 对话归档内部自整理（会话目录按月归组；生成当次就归位，不要攒着）

> ### ⚠ 最要紧的三条（本节其余可以后看，这三条每次会话都要做）
>
> 1. **带日期的会话目录一律放进月份容器**：`对话归档/2026-09/<2026-09-DD-主题>/`。根目录只保留分类目录与月份容器，不再出现一长排 `2026-09-xx-…`。
> 2. **生成当次就归位，不要攒到堆不下再处理。** 这一条的优先级高于「先把活干完」——新增会话目录、截图、脚本的那一刻就按本条放好。**不要等用户来提醒才整理。**
> 3. **移动完必须同步引用。** 全仓搜 `对话归档/<日期>`、`temporary-tools/<日期>`，把注释与文档里的旧路径一并改掉；否则下次按注释找文件会扑空。改完再搜一次确认 0 残留。

**目录分层（会话级 vs 分类级）**

```
对话归档/
├─ 2026-09/                      会话级归档：一个月一个容器
│   ├─ 2026-09-15-team-members-refactor/
│   └─ 2026-09-27-engineering-page-analysis/
├─ screenshots/                  分类级：长期
│   ├─ 2026-08/  2026-09/         带日期前缀的截图，按年月归组
│   └─ homepage/  contribution/   无日期的，按主题归组
├─ temporary-tools/              只放脚本
│   ├─ 2026-09/                   带日期的一次性脚本
│   └─ check-*.js …               长期复用的工具，留在根
└─ logs/  misc/  plans/  research/ …（同为分类级，规则同上）
```

**四条规则**

1. **会话级目录**（目录名以 `YYYY-MM-DD-` 开头）移入 `YYYY-MM/`。根目录因此只剩十来个分类目录加月份容器，新增月份会自动开新容器。
2. **分类目录内**的带日期文件，归入该目录下的 `YYYY-MM/` 子目录；无日期的文件按主题归组（`homepage/`、`contribution/`）或留在根。
3. **`temporary-tools/` 只放脚本。** 素材包（如整站抓取的图集）、`.log`、`.txt`、`.docx`、`.html` 一律移出：素材 → `misc/`，日志 → `logs/`。混放会让一个目录从几十个文件膨胀到几千个。
4. **分类目录内文件数超过 100 且仍在增长**时，再按用途细分（检查类 / 改写类 / 提取类），并同步更新所有引用；未到规模不要为分类而分类。

**移动后的收尾（必做）**

- 路径替换范式：`对话归档/2026-09-14-x` → `对话归档/2026-09/2026-09-14-x`；`temporary-tools/2026-09-14-x` → `temporary-tools/2026-09/2026-09-14-x`。
- 同步脚本：`对话归档/2026-09/2026-09-28-archive-reorg/temporary-tools/fix_archive_refs.py`（传仓库根路径即可，只改文本类文件、跳过 `node_modules` 与二进制目录）。
- **源码里的这类路径多是注释，不是运行时加载路径**（对照成品图位置、方案出处、生成脚本位置），所以移动不会破图；但注释指向失效会误导后续维护，必须改。
- 改完跑一次全仓搜索 `(对话归档|temporary-tools|screenshots|logs)/20\d\d-\d\d-\d\d-`，结果应为 0。

> 本轮整理（2026-09-28）：18 个带日期目录归入 `2026-09/`；`screenshots/` 218 个文件按 2026-08 / 2026-09 / homepage / contribution / misc 分组；`temporary-tools/` 3947 个文件降到 102（3822 文件的 `kollektiva-members` 图集移入 `misc/`，日志与文本文档移入 `logs/`，带日期脚本归入 `2026-09/`）；`logs/` 内 48 个带日期文件按年月归组。全仓 91 个文件的路径引用已同步。

---

---

## 十五、根站→Flask 内容同步决策（2026-09-13）

为让生产提交工程 `igem2026-flask` 的内容与根站保持一致，经逐页对比后确定如下同步策略（工作台账见 `Progress/PROG-20260913-001-root-to-flask-resync.md`）：

- **已整体同步的页面**（根站为权威源，整体覆盖 flask 同名页）：contribution、description、design、engineering、hardware、model、software、experiments、results、safety-and-security、attributions、members。其中 attributions 含成员照（jpg+webp，已处理 `srcset`）并复制 `attributions.css`+`mainClass`+`js/pages/attributions.js`；members 复制 `members.css`+`members.js`。
- **Human Practices 采用「合并」而非覆盖**（用户拍板，2026-09-13，避免毁掉 flask 专家地图）：保留 flask 已有的交互专家地图（hzMap、`data/hp-map-data.js`、`js/components/hp-map.js`）与「活动照片」子节，**不**整体覆盖；仅把根站 `integrated human-practices.html` 的「访谈对象与项目反馈」可读专家档案段（7 位专家 + 4 个说明子节）以独立 `content-card` 合并进 flask 主 HP 页 `page_content` 末尾，补齐 flask 原"仅有地图、无可读正文"的缺口。education 页两站章节结构已逐一完全一致，无需改动。
- **新增页面**：`social-groups.html`（根站独有，flask 原缺，新增最小页以修复潜在导航 404）。
- **跳过 / 待办**：`parts.html` 与 `social-groups.html` 根站本身亦仅为占位（无真实内容），同步无意义，标记待撰写；flask 独有 5 页（alternative-platform / entrepreneurship / inclusivity / measurement / sustainability）无根站源，需另开需求撰写。
- **约束遵守**：全程复用 flask 现有 `layout.html` 块体系（`{% block page_content %}`/`styles`/`scripts`），不引入第三方 CDN、不写内联 `<script>`（仅 `defer` 外链），正文图片经 `../static/`→`/static/` 改写并 vendored 本地；全站冻结无 `../` 残留、无 404。

---

## 十六、全站页面加载动画（page-loader）与媒体外链策略（2026-09-13）

### 16.1 机制总览（两站同源）

每个页面在加载期间显示统一的加载遮罩，遮罩内是 6 帧雪碧图构成的逐帧伪动画；仅当该页「首屏可见的基础插画」全部就绪后遮罩才收起，其余资源继续懒加载。

| 组件 | 根站 | flask | 作用 |
|---|---|---|---|
| arm（同步，置于 head） | `static/js/components/page-loader-arm.js` | 同 | 首屏即给 `<html>` 打 `page-loader-armed`（显示遮罩 + 锁滚动 + 隐藏原生内容），8s 看门狗兜底 |
| 控制器（defer） | `static/js/components/page-loader.js` | 同 | 收集关键图 → 预加载 → 判定收尾 → 派发 `pageloader:done` |
| 样式 | `static/css/components/page-loader.css`（本地雪碧图） | 同（雪碧图走 CDN） | 米黄/暖棕遮罩 + `steps(6)` 伪动画 + 纯 CSS 兜底 |
| 插画 | `static/image/loader/loader-sprite[@2x].webp` | `image/loader/...`（iGEM CDN） | 6 帧雪碧图（240px/帧，@2x 480px）+ 独立帧 |

**对外接口**：`window.PageLoader.register(urls)`（登记首屏关键图，支持候选回退 `[[c1,c2]]`）、`.done(cb)`、`.isDone()`。

### 16.2 判定「加载完成」的条件

- 就绪集合 S = 该页登记的首屏关键图；单图「结清」= `load` / `error` / 单图 3s 超时（error 不阻塞）。
- **收尾当且仅当**：`DOM 就绪（readyState ≥ interactive）` AND S 全部结清 AND `elapsed ≥ MIN_SHOW(600ms)`。
- **强制收尾**：`elapsed ≥ MAX_WAIT(8000ms)` 无条件收起；`prefers-reduced-motion` 时跳过 MIN_SHOW。
- 收尾动作幂等：移除 `armed` → 加 `done`（淡出）→ 解锁滚动 → 派发一次 `pageloader:done`。
- 无关键图的页面收敛为 `DOM 就绪 + MIN_SHOW`。

### 16.3 首屏关键资源登记

- 声明式：`<img data-critical>` / `[data-critical-bg]`。
- 命令式：JS 驱动、以 `background-image` 呈现的资源调用 `PageLoader.register()`。
- **members 页（首批落地）**：桌面端登记默认成员（队长 Jie Xia）的大幅背景形象候选；另登记左侧条带首屏可见的前 6 位成员头像。移动端无大图，故只登记头像。见 `static/js/pages/members.js` 的 `init()`。

### 16.4 首页 GIF 开场交接（修复「卡没」）

- 顺序固定为：**加载动画播完 → GIF 开场**。`index-intro-gif.js` 的 `whenLoaderReady()` 监听 `pageloader:done`（含 10s 硬兜底）后才启动播放。
- GIF arm 的看门狗改为**感知加载器**：遮罩期间不计时，等 `pageloader:done`（或 12s 硬上限）后再开始 6s 计时 —— 根除「GIF 尚未启动就被看门狗判为 finished」导致的开场丢失。
- 两站一致：根站见 `src/_includes/head-extra/index.njk`，flask 见 `static/js/components/intro-gif-arm.js`。

### 16.5 媒体外链策略（合规）

- **flask（生产站）**：`static/` 只允许 JS/CSS；**所有图片必须走 iGEM 自有 CDN** `https://static.igem.wiki/2026/szpu-china/image/...`，**禁止任何第三方 CDN**。取址入口：模板用 `wiki/macros.html` 的 `media(rel)` / `igem_img(name,alt,cls)`；JS 用 `window.MEDIA_BASE`（由 `static/js/core/utils.js` 暴露）。本轮已删除 flask 本地 `static/image/`，46 条本地引用全部改为 CDN。
- **根站（历史参考站）**：按用户确认保留本地 `static/image/`，仅共享同一套加载器逻辑（雪碧图用本地路径）。
- **根站插画入库边界（2026-09-16）**：`static/image/loader/` 中**只有 CSS 实际加载的 `loader-sprite@2x.webp` 入库**；`loader-frame-1~6.webp`（逐帧导出）与 `loader-sprite.webp`（1x 副本）为同源冗余、全仓库 0 引用，已在 `.gitignore` 排除，本地物理保留供开发预览。
- **待上传清单**：flask 的加载器插画需上传到 CDN 的 `image/loader/`（`loader-sprite.webp`、`loader-sprite@2x.webp`；源文件在根站 `static/image/loader/`）。未上传前遮罩自动使用纯 CSS 兜底动画，不会破版。

### 16.6 回归验证

`对话归档/temporary-tools/verify_sites.py` 可复跑：真实起本地 HTTP 服务校验关键页与资源状态码、全量审计构建产物的本地资源引用、并断言加载器契约（14 项）。当前结果：根站 1367 条引用 **0 缺失**；flask 1690 条引用仅 1 条为已文档化的注释示例（`index.css` 的 `xx.jpg`）；两站加载器资源全部 200。

---

## 十七、Git 提交与入库规范（2026-09-16）

> 本节是**提交纪律的唯一事实源**，与第十一节互补：第十一节管"对话产物放哪"，本节管"什么能进版本库、怎么提交、提交信息怎么写"。**两个工程（根站 + `igem2026-flask`）同时适用。**

### 17.1 提交前三步自检（强制）

```powershell
cd "f:\IGEM\SZPU-2026 wiki"
git status --porcelain --untracked-files=all   # ① 逐条过目，确认没有非本次任务的文件
git check-ignore -v <路径>                      # ② 新增素材先确认忽略/入库状态符合预期
git diff --cached --stat                       # ③ 暂存区只含本次任务文件
```

1. **逐条过目 `git status`**：出现不认识的 `??` / ` M`，先判定归属——对话/工具产物（截图、临时脚本、日志、测试页）→ 当场移入 `对话归档/`（第十一节）；本次任务文件 → 明确纳入或明确忽略，不留"以后再说"。
2. **只暂存本次文件**：一律 `git add <具体路径>`；**禁止 `git add .` / `git add -A`**（会把截图、逐帧导出、大图一起扫进提交）。
3. **构建与验证**：根站按 §10.1 分步执行 `npx eleventy` + 搜索索引 + `tools/check-static-assets.js` + `tools/check-performance-budget.js`；flask 执行 `python -m compileall app.py site_nav.py` + `flask freeze`；受影响页面**必须经本地 HTTP 服务**打开确认（`file://` 不算验证）。

### 17.2 入库边界

| 类别 | 必须入库 | 禁止入库 |
|---|---|---|
| 源码与规则 | `src/**`、`wiki/pages/**`、`wiki/layout.html`、`static/css/**`、`static/js/**`、`tools/**`、`package.json` / `package-lock.json`、`.gitignore` | — |
| 运行资源 | 页面/CSS/JS **实际引用**的图片、字体、加载器雪碧图（只存被引用的那一份） | 逐帧导出、雪碧图以外的中间产物、同素材 1x/2x 多份副本、**零引用目录**、**源图工作区 `static/image/**/源图片/`** |
| 文档治理 | `README.md`、`AGENTS.md`、`DOCUMENT_MAP.md`、`Requirements/**`、`Decisions/**` | 对话报告、审计记录、截图说明（→ `对话归档/`） |
| 构建产物 | — | `igem2026-flask/public/`、`dist/`、`build/`、`node_modules/`、`static/js/pdfjs/` |
| 敏感信息 | `.env.example` | `.env*`、密钥、证书、token |
| 对话产物 | — | `对话归档/`（整目录）、`.playwright-cli/` |

> 判定"某个资源该不该入库"的两条硬标准：① **被引用** —— `git grep -c "<路径或文件名>"` 必须 > 0，0 引用即视为垃圾（现实例：`static/image/team-photo/`，106 MB / 346 张，全仓库 0 引用）；② **唯一** —— 同一素材只保留运行真正加载的那一份，其余作为冗余副本排除（现实例：加载器只保留 `loader-sprite@2x.webp`）。

### 17.3 二进制体积预算

- 单张图片默认目标 **≤ 300 KB**；**> 1 MB 必须在提交信息里写明原因**；单文件 **≥ 10 MB 一律先压缩**（转 WebP / 降采样 / 改视频格式）再入库。
- 照片统一 `.webp`（长边 ≤ 1920px、质量 82–88、`method=6`、按 EXIF 纠正方向）；源图只放 `static/image/**/源图片/` 且**必须同时提供 webp**，页面只引用 webp。
- **源图工作区不入库（2026-09-16）**：`static/image/**/源图片/` 存放的是转换产物的**上游素材**，不是运行资源，已在 `.gitignore` 排除，本地物理保留。**页面、页面脚本、数据源一律只引用 `webp/`**；任何指向 `源图片/` 的 `src` / `candidates` 都视为待修缺陷（它会让仓库必须携带原图才能正常显示）。
  - 现实例：`static/image/character/源图片/` 38 个文件 / 48.5 MB → 不入库；同目录 `character/webp/` 32 个文件入库，是唯一运行副本（每个成员 id 的 `.webp` 与 `_kt.webp` 齐备）。
  - 落地时的连带动作（缺一不可）：① 改页面引用指向 webp → ② 重建根站产物 → ③ 重建搜索索引 → ④ `.gitignore` 加规则 → ⑤ `git rm -r --cached <路径>`（**只加规则不会停止跟踪**，已跟踪文件必须显式从索引移除）。
- 超大素材是**已知存量债务**（见 §17.6），清理须单独立项；不得"下次再说"地继续新增。

### 17.3.1 本地辅助检查脚本（不入库，发布前门禁）

以下两项检查脚本位于 `对话归档/temporary-tools/`（已被 `.gitignore` 排除，**不入库、不被推送**），用于提交 / 发布前手动跑一遍质量门禁，**不纳入 `npm run build:all`**（原 `package.json` 中 `build:all` 曾引用 `tools/check-*.js`，脚本随对话产物清理被删、且按本规则不入库，故已从 `build:all` 摘除，避免缺失误报）：

- `node 对话归档/temporary-tools/check-performance-budget.js`：扫描 `static/` 下图片 / JS / CSS 体积，对照本预算（图片 >300 KB 警告、≥1 MB 严重、≥10 MB 阻塞；`members.js` 等已知 JS/CSS 守护项超阈值告警；已跳过 `源图片/`），打印超预算清单，阻塞或严重时以非 0 退出。
- `node 对话归档/temporary-tools/check-static-assets.js`：扫描页面（生成的 `*.html` + `src/**/*.njk`）对 `static/` 资源的引用，核对文件确实存在（缺失即死链）；并标记任何指向 `static/image/**/源图片/` 的 `src`/`candidates`（按本预算视为待修缺陷）。

> 这类工具脚本一律放 `对话归档/temporary-tools/`（先例见 §5.15 的 `2026-09-15-check-members-format.js`、§5.16 的 `2026-09-16-dev-server-nostore.py`），**不得放入仓库根 `tools/` 或散落业务目录**，否则按对话产物归档红线清理后会丢失并令 `build:all` 误报失败。

### 17.4 提交信息格式

采用 Conventional Commits，**说明部分用中文**：

```
<type>(<scope>): <中文说明>
```

| type | 用途 | type | 用途 |
|---|---|---|---|
| `feat` | 新功能 / 新页面 / 新组件 | `docs` | 文档（README、规则、台账） |
| `fix` | Bug 修复 | `build` | 构建脚本、依赖、预算阈值 |
| `perf` | 性能优化 | `ci` | CI / 部署工作流 |
| `refactor` | 重构（行为不变） | `test` | 测试与校验脚本 |
| `style` | 格式/样式微调（无逻辑变更） | `chore` | 杂项（重建索引、清理） |

- `scope` 取模块或板块，例：`search` / `members` / `hp` / `loader` / `content` / `i18n` / `ci` / `docs`。
- 真实历史示例：`feat(i18n): Contribution 页双语化，中英逐段对照且文案抽到 _data`、`fix(ci): 上调 search-index.json 性能预算至 350KB 恢复 Pages 构建`、`perf(search): 压缩搜索索引体积并修正本地资源检查误报`。
- **一次提交只做一件事**：格式化/重命名不与功能变更混提；正文可补"为什么改 + 影响面 + 验证方式"。
- **跨工程同步必须同一次提交**：根站改动若需镜像到 flask，两个工程的文件一起提，scope 写 `(root+flask)`。
- 关联台账时在末尾引用 ID：`refs REQ-20260916-001` / `fixes BUG-20260823-001`。

### 17.5 红线

- 未经明确授权：**不推送、不发布/部署、不创建 PR**。
- **禁止对 `main` 执行 `git push --force` / `--force-with-lease`**；禁止跳过钩子（`--no-verify`、`--no-gpg-sign`）。
- **历史重写**（`filter-repo` / BFG、amend 已推送提交）必须先获授权并通知协作者——会让全队需要重新 clone。
- `.gitignore` 改动影响两个工程，须与 §17.2 表格在同一提交内更新，避免"规则与文档各说各话"。

### 17.6 存量清理（两步走）

| 步骤 | 做法 | 效果 | 可逆性 |
|---|---|---|---|
| ① 停止跟踪 | `git rm -r --cached <路径>` + `.gitignore` 加规则 + 提交 | 后续提交与部署产物不再包含该目录 | **可逆**：`git restore --staged <路径>`；文件仍保留在本机磁盘 |
| ② 历史瘦身 | `git filter-repo --path <路径> --invert-paths`（或 BFG）后 force push | `.git` 真正缩小 | **不可逆**，需授权并通知全队重新 clone |

**当前存量实测（2026-09-16）**：`.git` 约 **954 MB**；`static/image/team-photo/` 106 MB / 346 张（**0 引用**，`.gitignore` 已加入排除规则；因该目录仍在 `HEAD` 中，**必须补跑步骤①命令**才会真正停止跟踪）；`static/image/HP/southchina/spark*.jpg` 单张 9.4–16.0 MB、`SZU.jpg` 13.5 MB、`school1~3.jpg` 2.1–4.4 MB；`static/image/Animation/index/*.GIF` 9.3 / 9.7 MB —— **后两类被页面真实引用，属压缩改造对象，不可一删了之。**

---

*文档生成方式：全仓库静态分析 + Playwright(Chromium) 实渲染交叉验证。如后续设计令牌变更，应同步更新本文档第二节至第四节及第八节约束规则；如新增对话产物类型，应同步更新第十一节与 `.gitignore`；如入库边界或提交纪律变更，应同步更新第十七节。*

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

为消除手工维护 18 个页面脚本顺序/路径的出错风险，项目引入零依赖 Node 脚本 `tools/normalize-scripts.js`，统一所有页面的外部脚本加载方式。另有一同属工程化的 `tools/inject-search.js`（历史脚本，负责批量注入导航搜索按钮与 `search.js`/`search-index.js` 引用，2026-08-26 索引重构为 `search-index.json` 后已弃用，见第七.11）；两者均须从 `tools/` 目录运行，不得放回仓库根。

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
- 原 `search-index.js`（约 189KB）在每个页面 `<head>` 内同步加载，阻塞 HTML 解析与首屏渲染（LCP 明显变慢）；现已重构为 `search-index.json`（约 217KB）经 `fetch()` 按需加载（见第七.9），不再阻塞首屏。

**2) JS 渲染线程 / 事件监听维度**
- 内容页并存 3~4 个独立 `window` `scroll` 监听（nav / page-progress / scroll-progress / sidebar），各触发自身 rAF；attributions 页更多（再加 Tooltip、ScrollSpy）。每帧最多数个 rAF 回调。
- `sidebar-progress.js` 原实现每帧对全部 section 调用 `getBoundingClientRect()` 并与样式写入交错，造成**强制同步布局（layout thrash）**，长内容页尤为明显——这是内容页卡顿的主因之一。
- `scroll-progress-bar.js` 原 `calculateProgress()` 每帧调用 `getClientHeight()` + `getScrollHeight()`（读 `documentElement.scrollHeight/offsetHeight/clientHeight`），与每帧 `style.height` 写入交错形成**强制同步布局**；这些尺寸在滚动期恒定，本应缓存。`wet-lab/notebook.html` 内联 `updateNavHighlight` 同理每 100ms 对全部 `section` 调 `getBoundingClientRect()`，是 log 页滚动卡顿主因。
- `hp-timeline-3d.js` 原 `render` 以 `requestAnimationFrame` **永久循环**，即使圆环已静止也每帧重写所有卡片 `transform`，持续占用主线程（该脚本当前未被任何页面引用，属隐患）。
- `wet-lab/notebook.html` 的内联滚动高亮、各页 `scroll-progress-bar` 等"加了很多 JS"后，多个独立 `scroll` 监听叠加，任一在回调中同步读布局即放大为持续重排——这是"加了很多 js 开始卡"的直接机制。

**3) CSS 合成与绘制维度**
- `nav` 的 `backdrop-filter: blur` 在滚动时强制对背景内容做模糊重绘（fixed 全宽条带，开销持续）。
- 首页 8 个酵母 SVG 常驻 `will-change: transform` + 无限 `floatYeast` 动画（此前因脚本 404 实际未播放；路径修复后恢复，并已加离屏暂停）。
- 懒加载图 `filter:blur` 占位、多处大 `box-shadow`（首页 hero/card、HP orbit 卡片）、`position:fixed` 全屏浮动装饰层（`float-art`）持续绘制。

### 14.3 已实施的优化（均维持原有效果）

- **路径修正（恢复被 404 静默失效的交互）：** `static/components/*` → `static/js/components/*`（18 个页面 + `normalize-scripts.js`）；`executive-summary-animation.js` 路径修正（首页 + `normalize`）。侧边栏烧瓶/TOC 高亮、HP reveal、首页酵母浮动/打字机/滚动渐入现已正常。
- **搜索索引重构（停止首屏阻塞 + 安全渲染）：** 原 `search-index.js`（约 189KB）内联 `window.iGEMSearchIndex` 并同步/defer 加载，已重构为 `search-index.json`（约 217KB）经同源 `fetch()` 按需加载（仅首次打开搜索时请求）；搜索结果以 `createElement` + `textContent` + 受控 `<mark>` 渲染，**移除 `innerHTML`**，杜绝索引内容（标题/正文/图片路径）进入 HTML 解析器；重复搜索复用同一 Promise，JSON 失败回退空索引（详见第七.9）。
- **`sidebar-progress.js` 去重排：** 在 init / resize / `load` 时一次性缓存各 section 的绝对偏移（`getBoundingClientRect().top + scrollY`），滚动期仅用 `scrollY` 与缓存偏移比对，彻底消除每帧 `getBoundingClientRect` 强制重排。
- **`hp-timeline-3d.js` 收敛即停：** `render` 在 `currentAngle` 收敛到 `targetAngle`（误差 < 0.01°）时停止 rAF 循环，仅在交互（滑块 `input`/`change`、‹ › 按钮、点击节点/卡片）时 `kick()` 重启，视觉完全不变。
- **`executive-summary-animation.js` 酵母离屏暂停：** 8 个酵母浮动 SVG 用 `IntersectionObserver` 在离屏时设 `animation-play-state:paused`、入屏恢复，视觉无差异，后台/长页滚动时大幅减少合成开销。
- **`scroll-progress-bar.js` 去重排：** 在 `init`/`onResize`/`load` 时缓存 `clientHeight`、`totalHeight`（`state.metrics` + `refreshMetrics()`），热路径每帧只读取 `getScrollPosition()`（scrollY，不触发重排）并写高度，彻底消除进度条的每帧 `scrollHeight/clientHeight` 强制重排。
- **`wet-lab/notebook.html` 滚动高亮去重排：** 一次性缓存各 `section` 绝对偏移（`buildSectionOffsets` 于 init/resize/load），滚动期仅以 `scrollY + innerHeight*0.3` 探针与缓存偏移比对切换 `.active` 类，彻底消除每帧 `getBoundingClientRect` 强制重排（与 sidebar-progress 同一手法）。

### 14.4 权衡与保留项（视觉效果不变）

- `nav` 的 `backdrop-filter` 属既定的毛玻璃导航视觉效果，**未移除**；其滚动重绘成本已知。若后续需进一步压榨滚动帧率，可改为不透明实色背景，或仅在滚动静止后启用模糊——属视觉改动，须走评审。
- `hp-carousel` 的卡片 `will-change` / `blur` 空气透视属第十二节冻结的视觉效果，保持不变；其交互已用 rAF 合并、滤镜层在过渡结束后释放（见 5.10）。
- 首页酵母 SVG 的 `will-change: transform` 保持（动画期间需要），离屏已由 `animation-play-state` 暂停。

### 14.5 性能预算与回归防护

- 新增/修改脚本后，本地起 `python -m http.server` 打开内容页与首页，确认：侧边栏烧瓶进度与 TOC 高亮随滚动更新、HP reveal/轮播（若启用）正常、首页酵母浮动/打字机/滚动渐入正常、搜索面板可开；并用 DevTools Performance 录制滚动，确认无长任务与持续 rAF。
- 严禁 reintroduce 第十四节所列反模式（永久 rAF、滚动中同步读布局、同步阻塞的大脚本、永久 `will-change` 堆、无守卫的无限动画）。对应硬约束见第八节第 14–19 条。
- 任何推崇"看起来更顺"的视觉微调，若涉及 `backdrop-filter`、模糊、环形结构、动画参数，按第十二.4 判断：视觉改动须用户拍板。
