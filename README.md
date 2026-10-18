# SZPU-2026 iGEM Wiki 项目索引

> 本文件是**索引与红线**，不是正文。2026-10-17 起，1359 行的长篇内容已分册到 `docs/`：
> 每个主题一个文件，按需查阅，避免"一次读不完、读完了抓不住重点"。
> 若本文件与 `docs/` 冲突，以**本文件的红线章节**为准。

## 最要紧的五条（动手前必读）

1. **对话产物当次归位，不等堆积。** 任何对话/工具产生的文件，生成那一刻就移入 `对话归档/`，按月份容器与主题分层；移动后同步全仓引用路径。分类字典见 `docs/governance/archive-and-gitignore.md`。
2. **根目录 `*.html` 是构建产物，改源不改产物。** 改页面必须改 `src/**/*.njk` 后跑 `npm run build:all`；直接编辑根目录 HTML 不算修复。
3. **图片引用前先核对文件存在。** 历史上多次因文件名写错导致全站破图。素材约定见 `docs/governance/assets-and-budget.md`。
4. **提交前 `git status` 复查。** 只暂存本次文件，禁止 `git add .`；不提交构建产物、`node_modules`、密钥与 `对话归档/`。见 `docs/workflow/git-conventions.md`。
5. **中文路径只能用文件工具以字面量创建。** 禁止用 shell 命令/命令替换/`python -c` 拼接中文路径——PowerShell 5.1 按 GBK 解码 UTF-8 字节会生成乱码目录（历史上反复发生）。见 `docs/governance/archive-and-gitignore.md`。

## 两个工程（技术栈不同，命令不可混用）

| 工程 | 路径 | 技术栈 | 定位 |
|---|---|---|---|
| 根目录静态站点 | 仓库根 `/`（`src/` + `static/` + 各栏目目录 + 根 `*.html`） | Node.js + Eleventy 3.x + Nunjucks | 历史参考版，**非**官方提交 |
| igem2026-flask | `igem2026-flask/` | Python 3.12 + Flask + Frozen-Flask | 2026 赛季**官方提交**（GitLab Pages） |

- 根站：`npm run build:all`（Eleventy + 搜索索引）；预览 `npm run serve`。
- Flask：`flask freeze` 生成 `public/`；预览 `flask run`。
- 两站共用米黄/奶油主题设计系统，但实现与构建完全独立，**不得**互相复制构建产物或套用对方命令。
- 主题：主色米黄/奶油、辅色暖棕、强调蓝（仅 footer）。完整令牌见 `docs/design-system/visual-spec.md`。

## docs/ 分册索引

### 架构 `docs/architecture/`
| 文件 | 内容 |
|---|---|
| `overview.md` | 项目总览：栏目划分与设计语言 |
| `directory-structure.md` | 文件层级与目录结构 |
| `dependencies.md` | 文件依赖关系（全局共享依赖 + 各页面依赖清单） |
| `js-and-subsystems.md` | JS 架构原则、组件速查、搜索子系统、首页分屏、GIF 开场 |
| `page-loader.md` | 全站加载动画（page-loader）与媒体外链合规策略 |

### 设计系统 `docs/design-system/`
| 文件 | 内容 |
|---|---|
| `visual-spec.md` | 色彩 / 字体 / 间距 / 圆角 / 阴影 / 动效 |
| `page-framework.md` | 页面骨架、导航、侧边栏 + 烧瓶进度、进度条、卡片、浮层、移动端 |
| `content-page-standard.md` | 内容页统一规范：小节锚点 + 收纳条 + 二级导航、长页收纳标准、Safety/Hardware 改版 |
| `team-and-home.md` | Team 成员页分类与顺序、响应式布局、首页分屏拼装与手动微调区 |

### 流程 `docs/workflow/`
| 文件 | 内容 |
|---|---|
| `development-constraints.md` | 未来开发必须遵循的约束规则 |
| `new-page-template.md` | 新内容页快速模板（推荐复制起点） |
| `build-and-preview.md` | 本地预览命令、构建命令与 npm 退出码陷阱 |
| `root-to-flask-sync.md` | 根站 → Flask 内容同步决策 |
| `git-conventions.md` | Git 提交与入库规范、体积预算、提交信息格式 |
| `tooling.md` | 工程化脚本统一工具 |

### 治理 `docs/governance/`
| 文件 | 内容 |
|---|---|
| `archive-and-gitignore.md` | 对话产物归档分类字典、`.gitignore` 约定、编码红线 |
| `assets-and-budget.md` | 图片与资源约定 |

### 案例 `docs/cases/`
| 文件 | 内容 |
|---|---|
| `known-issues.md` | 已发现的问题与不一致（需警惕） |
| `hp-carousel.md` | Human Practices 轮播组件：结构、冻结清单、应改清单 |
| `performance.md` | 性能分析与优化记录 |

## 关键路径速查

| 用途 | 路径 |
|---|---|
| 页面源（根站） | `src/**/*.njk` |
| 共享布局/导航/页脚/head | `src/_includes/` |
| 构建配置 | `.eleventy.js` |
| 公共 CSS/JS/图片/字体 | `static/` |
| 搜索索引生成器（唯一） | `static/js/core/search-index-generator.js` |
| 官方提交工程 | `igem2026-flask/` |
| 对话产物归档 | `对话归档/`（不入库） |
| 治理契约与文档地图 | `AGENTS.md` |
| 工程规则 | `.codebuddy/rules/` |
| 巡检脚本 | `对话归档/temporary-tools/` |

## 文档维护约定

- 单个 Markdown 超过 **300 行**即视为长阅读文件，必须分册到 `docs/` 对应子目录。
- Skill 主文件 `SKILL.md` 超过 **8 KB** 必须把 playbook 与案例迁到同技能 `references/`。
- 新增分册或移动目录后，同步更新本索引、`AGENTS.md` 的文档地图，并用 `对话归档/temporary-tools/archive-refs-scan.py` 复验引用归零。
