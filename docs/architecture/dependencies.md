# 文件依赖关系

> 本文件由根目录 `README.md` 分册而来（2026-10-17）。内容未做改写，
> 仅按主题归位；与 `README.md` 冲突时以 `README.md` 的红线章节为准。

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
| dry-lab/hardware.html | hardware.css(实，2026-10-15) | 是 | 是 | sidebar-progress.js |
| dry-lab/model.html | model.css(空) | 是 | 是 | sidebar-progress.js |
| dry-lab/software.html | software.css(空) | 是 | 是 | sidebar-progress.js |
| wet-lab/protocol.html | experiments.css | 是 | 是 | sidebar-progress.js |
| wet-lab/result.html | result.css(空) | 是 | 是 | sidebar-progress.js |
| wet-lab/safety.html | safety.css(实，2026-10-15) | 是 | 是 | sidebar-progress.js |
| wet-lab/notebook.html | —（页内内联） | 是 | 是 | sidebar-progress.js |
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
