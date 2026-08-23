# 项目协作契约（SZPU-2026 iGEM Wiki）
# 文档地图（SZPU-2026 iGEM Wiki）

> 本表是文档职责到仓库实际路径的唯一索引。每项职责只有一个当前事实来源；本表只用于导航，不记录产品或技术事实，也不覆盖既有文档优先级。

## 两个工程（不同技术栈）

| 工程 | 路径 | 技术栈 | 工程规则 |
|---|---|---|---|
| 根目录静态站点（历史参考，非官方提交） | 仓库根 `/`（`src/` + `static/` + 各栏目目录 + 根 `*.html`） | Node.js + Eleventy 3.x + Nunjucks | `.codebuddy/rules/root-static-site.mdc` |
| igem2026-flask（官方提交工程） | `igem2026-flask/` | Python 3.12 + Flask + Jinja2 + Frozen-Flask | `.codebuddy/rules/igem2026-flask.mdc` |

## 职责 → 实际路径

| 职责 | 实际路径 | 更新触发条件 |
|---|---|---|
| 项目协作契约 | `AGENTS.md` | 工程边界、归档规则、构建/文档流程变化 |
| 文档地图 | `DOCUMENT_MAP.md`（本文件） | 创建/替换/移动文档或目录 |
| 全局产品/技术/UI/设计系统指导 | `README.md` | 设计令牌、目录结构、约束规则、进度变化 |
| 根站工程规则 | `.codebuddy/rules/root-static-site.mdc` | 根站技术栈/构建/资源约束变化 |
| Flask 工程规则 | `.codebuddy/rules/igem2026-flask.mdc` | Flask 工程路由/模板/合规/构建变化 |
| 生物内容规则 | `.codebuddy/rules/PAGER-yeast.mdc` | 实验内容/科学表述边界变化 |
| 需求台账 | `Requirements/LEDGER.md` | 每个非 Bug 需求 |
| 详细需求记录 | `Requirements/REQ-*.md` | 复杂/长期/跨模块需求 |
| Bug 台账 | `Requirements/LEDGER.md`（Bug 区） | 发现/修复/验证 Bug |
| 决策台账 | `Decisions/LEDGER.md` | 重大方案（数据/架构/接口/难回退） |
| 决策记录 | `Decisions/DEC-*.md` | 方案提出/确认/调整/归档 |
| 功能进度台账 | `Progress/LEDGER.md` | 大任务创建/阶段状态/归档 |
| 功能进度记录 | `Progress/PROG-<REQ-ID>-<slug>.md` | 大任务阶段计划/进度/DoD/证据/阻塞 |
| 对话产物归档（不入库） | `对话归档/` | 每次生成非正式产物时归位 |

> 本文件是 Agent 在本仓库中的协作行为约定：规定两个工程的边界、文档优先级、对话产物归档红线与任务确认流程。产品、技术、数据与实现细节以 `DOCUMENT_MAP.md` 映射的事实文档为准，本文件不重复抄写。

## 0. 仓库构成：两个独立工程（不同技术栈）

本仓库同时包含两个使用**不同技术栈、不同部署目标**的 wiki 工程。处理任何任务前，必须先判断目标属于哪个工程，再套用对应规则与构建命令，严禁混用。

| 工程 | 路径 | 技术栈 | 定位 | 工程规则 |
|---|---|---|---|---|
| 根目录静态站点 | 仓库根 `/`（`src/` + `static/` + 各栏目目录 + 根 `*.html`） | Node.js + Eleventy 3.x + Nunjucks（`.njk` 模板），静态 HTML/CSS/原生 JS | 历史参考 / 静态站点，**非**官方提交版 | `.codebuddy/rules/root-static-site.mdc` |
| igem2026-flask | `igem2026-flask/` | Python 3.12 + Flask + Jinja2 + Frozen-Flask | 2026 赛季**官方提交**工程（GitLab Pages 发布） | `.codebuddy/rules/igem2026-flask.mdc` |

### 0.1 边界红线（不得跨越）

- 根目录站点只受 `root-static-site.mdc` 约束：页面源是 `src/**/*.njk`，根目录 `*.html` 是 Eleventy 构建产物；改页面须改 `.njk` 后 `npm run build:all`，**不得**直接编辑根目录 HTML 作为长期修复。
- `igem2026-flask/` 是独立提交工程，只受 `igem2026-flask.mdc` 约束：页面源是 `wiki/pages/*.html`，`public/` 是 `flask freeze` 构建产物；不得被根站规则或根站构建流程改动，不得直接改 `public/` 作为长期修复。
- 两工程**共用**米黄/奶油主题设计系统（见 `README.md` 第四节），但实现与构建完全独立，不得在二者间直接复用构建产物、复制运行时资源或套用对方命令。
- 撰写实验/生物内容时额外遵守 `.codebuddy/rules/PAGER-yeast.mdc` 的科学表述边界。

### 0.2 工程构建命令（不可混用）

- 根目录站点：`npm run build:all`（Eleventy + 搜索索引）；预览 `npm run serve`。
- igem2026-flask：`python -m compileall app.py site_nav.py` → `flask freeze`（生成 `public/`）；预览 `flask run`。

## 1. 文档索引与优先级

- 文档地图：[`DOCUMENT_MAP.md`](DOCUMENT_MAP.md)。开始任务前先读取它，按实际路径定位需求、决策、进度与设计文档。它只负责导航，不记录事实。
- 优先级：本文件 → 用户本次明确确认的需求/方案 → `.codebuddy/rules/` 下对应工程的规则 → `DOCUMENT_MAP.md` 指向的需求/决策/进度/设计文档 → 进度文档 → 相关代码、测试、配置与脚本。
- 冲突时采用更高优先级；代码与文档不一致或存在影响范围的未知事项时，记录差异并向用户确认，不得静默猜测。

## 2. 对话产物归档红线（最高优先级）

> 本仓库硬性约定，优先级高于"先放着、以后整理"。

- 任何由对话/AI 过程产生的**非正式文件**（截图、导出中间文件、研究报告、工具日志、临时调试脚本、测试页、误生成文件夹、验证图等），必须在生成当次**立即**归入仓库根目录的 **`对话归档/`** 对应子目录，严禁散落在仓库根目录或任何业务目录（`dry-lab/`、`wet-lab/`、`human-practices/`、`project/`、`team/`、`static/`、`src/`、`igem2026-flask/` 等）。
- 归档分类以 `README.md` 第十一节为准；当前 `对话归档/` 实际子目录：`analysis/`、`backups/`、`generated-assets/`、`logs/`、`misc/`、`plans/`、`research-reports/`、`screenshots/`、`temporary-tools/`、`tests/`、`tools-debug/`。新增产物类型时先建子目录再放入，不要直接丢在 `对话归档/` 根。
- `对话归档/` 已在 `.gitignore` 排除，**不入库**，仅本地保留。
- 正式工程化脚本只放 `tools/`（根站）或 `igem2026-flask/tools/`；不要把临时调试脚本混入正式脚本目录。
- 提交前务必 `git status` 复查，确认无 stray 文件混入正式目录。

> 注：`.codebuddy/rules/` 中两处提到的 `communication/` 归档目录已不存在（历史遗留引用），本仓库归档根目录一律以 `对话归档/` 为准。

## 3. 每次任务的确认流程

1. 先读 `DOCUMENT_MAP.md` 与相关规则/文档，判断目标工程与受影响范围。
2. 分类请求：Bug 写入 Bug 台账；功能、功能优化、体验优化写入需求台账；仅重新构建或打包默认不建需求记录。混合请求拆开记录。
3. 跨模块变更（同一资源多写入入口、状态跨页面/脚本传播、涉及检索/索引/图片/文件/Skill、涉及部署/权限/密钥）必须建详细需求记录；单文件、无持久化状态、无跨端影响的小改动可简版记录。
4. 向用户确认目标、范围、不做项、验收标准与未知事项；描述完整且风险低时可写入记录后继续，会改变范围/数据语义/权限/兼容性的未知事项须先获明确答复。
5. 在确认口径内提出最小完整方案并实施。

## 4. 大任务与进度

跨模块、多阶段、多轮会话或无法在单个可验证闭环内完成的任务，创建功能进度文档，路径写入 `Progress/` 台账与需求台账，阶段开始/完成/阻塞时同步更新。

## 5. 数据与数据库变更

本项目为纯静态内容站点，通常无数据库。若涉及新增持久化数据、schema 或迁移，必须先出数据设计方案并与用户确认；未经确认不得改 DDL/ORM/migration 或依赖它们的代码。

## 6. 实现、验证与 Git

- 只改当前任务范围，不顺手重构，不为未确认需求预建能力。
- 文档、决策、进度与实现同步更新；相关文档无需更新时在记录中写明理由。
- 按风险运行最小充分检查（构建、静态检查、受影响页面在 HTTP 下验证），如实报告结果；不得把未运行的检查描述为通过。
- `file://` 协议会拦截资源，验证须通过本地 HTTP 服务（如 `python -m http.server`）。
- 提交前检查工作区/分支/忽略规则，只暂存本次文件；未经用户明确授权，不推送/发布/部署/创建 PR。
- 不提交密钥、`.env*`、`node_modules`、构建产物（`igem2026-flask/public/`）、`对话归档/` 内容。
