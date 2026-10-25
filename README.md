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

## 全站文本规范（写任何页面正文前必读）

本节是**红线**，细则、模板、替换表与校验脚本见 `docs/design-system/text-standards.md`；
同一套规则已注入 `.codebuddy/rules/text-standards.mdc` 供 Agent 自动遵守。
适用范围：根站 `src/**` 全部页面与 `src/_data/*.js`；迁移到 `igem2026-flask/` 时适用同一口径。

1. **基因符号斜体，蛋白产物正体。** 基因语境（基因座、敲除/改造靶点、向导、同源臂、修复模板、启动子、编码序列、报告基因）写斜体：`<i>FAR1</i>`、`<i>SST2</i>`、`<i>GPA1</i>`、`<i>STE2</i>`、`<i>FUS1</i>`、`<i>URA3</i>`、`<i>SNR52</i>`、`<i>SUP4</i>`、`<i>yEGFP</i>`、`<i>lacZ</i>`、`<i>lacZα</i>`、`<i>MEL1</i>`；蛋白语境（蛋白产物、结构域、蛋白界面、嵌合蛋白）写正体首字母大写：`Gpa1`、`Ste2`、`Sst2`、`Far1`、`Fus1`，例如 `Gpa1-Gαq chimeric G protein`、`the engineered Gpa1/Gαq interface`，**不写** `GPA1`、`GPA1P`、`STE2P`、`GPAα`。**`FAR1`/`SST2` 额外强制：** 基因语境一律斜体全大写 `<i>FAR1</i>`、`<i>SST2</i>`，**不得写成 `Far1`、`Sst2`**；只有蛋白产物才写 `Far1`、`Sst2`。报告基因写法固定为小写起首 `yEGFP`、`lacZ`、`lacZα`、`MEL1`（不写 YEGFP/LacZ/GFP）；`hM1Dq`、`MT1`、`TEVcs` 沿用原名；菌株号 `BY4741`/`S288C` 保持正体。**标识符与路径不改**：`id`/`key`/`anchor`/`class`/`data-*` 的值、`src`/`href` 资源与锚点、所有文件名目录名、质粒名（如 `pML104-FAR1`、`pESC-HIS-FUS1-yEGFP`）、缺失株名（如 `ΔFAR1`）、序列名（如 `crRNA_FAR1_KO_up`）。
2. **拉丁学名一律斜体，`E. coli` 无例外。** `<i>Saccharomyces cerevisiae</i>`、`<i>S. cerevisiae</i>`、`<i>Escherichia coli</i>`、`<i>E. coli</i>`、`<i>Homo sapiens</i>`；菌株号不斜体，中文译名不斜体。**正体 `E. coli` 与正体 `Saccharomyces cerevisiae` 同属红线**，术语表、图注、表格、卡片摘要一并覆盖。数据字段写 `<i>` 时模板必须 `| safe`；`alt`/`title`/`aria-label` 属性内写纯文本，不加标签。
3. **限制酶名称一律斜体。** 写作 `<i>NdeI</i>`、`<i>BamHI</i>`、`<i>EcoRI</i>`、`<i>HindIII</i>`、`<i>XbaI</i>`、`<i>SalI</i>`、`<i>NotI</i>`、`<i>SacI</i>`、`<i>KpnI</i>`、`<i>PstI</i>`；酶切位点/克隆位点表述同样斜体（`flanked with <i>NdeI</i> and <i>BamHI</i> sites`），不含酶名的 "restriction site" 保持正体。属性值、文件名、序列名内保持纯文本。
4. **文献引用统一为可跳转的描边框角标。** 正文一律 `<a class="cite-ref" href="#<页前缀>-reference-<n>">[n]</a>`，类名只有 `.cite-ref`，由 `static/css/navigation/navigation.css` 渲染成 1px 描边小方框；锚点 `<页前缀>-reference-<n>` 页内连续唯一，**角标显示号必须等于目标号**。文末 `<ol class="ref-list">` + `<li id="<页前缀>-reference-<n>">`，条目只渲染文字、不输出外链（iGEM 要求），DOI/网址保留纯文本；数据源统一 `references: [{ num, text, link }]`。**不凭空新增文献**，正文未点名该文献时不硬挂角标。
5. **术语大小写：`Pheromone` 作独立分句开头时首字母大写。** 冒号标签后接完整分句、或句首起句时写 `Pheromone`：`<strong>Cell-cycle arrest:</strong> Pheromone stimulation triggers…`；句中作普通名词仍小写：`the mating pheromone pathway`、`pheromone-responsive promoters`。同理适用于 `Receptor`、`Pathway` 等被当作分句主语的术语，但不得把句中名词无理由大写。

### 斜体/文本规范检查流程（每次改完正文必跑）

脚本在 `对话归档/temporary-tools/2026-10/`，默认只读或 dry-run，写回前自动备份到 `对话归档/backups/2026-10-gene-italics/`：

| 步骤 | 命令 | 判据 |
|---|---|---|
| 1 盘点 | `python 对话归档/temporary-tools/2026-10/2026-10-21-gene-italic-audit.py` | 输出 `italic / tag / ident / prose / ref` 五类计数与每文件分布 |
| 2 看明细 | 同上加 `--list prose`（或 `--list all`） | 逐条打印 `文件:行号 [符号] 上下文` |
| 3 批量补 | `python …/2026-10-21-gene-italic-transform.py --apply [--only pages\|data\|all]` | 只动正文，自动跳过属性/标识符/ref/注释/code；先不加 `--apply` 空跑看 diff |
| 4 查误伤 | `python …/2026-10-21-italic-sanity-check.py`、`python …/2026-10-21-italic-plasmid-fix.py`、`python …/2026-10-21-plasmid-integrity-check.py` | 属性内标签、双重 `<i>`、质粒名被拆（`p[HIS]-<i>yEGFP</i>`）、空标签必须为 0；质粒名被吞成 `pML104-`、与 HEAD 相比同一 token 次数下降（`LOST`）必须无 |
| 5 重建 | `npx eleventy` + `node static/js/core/search-index-generator.js` | `npm run build:all` 偶发不落盘，构建后核对产物 mtime |
| 6 产物验证 | 扫构建产物里的 `&lt;i&gt;`、属性内 `<i>`、`pML104- ` 截断 | 两站必须为 0；数据字段带 `<i>` 进模板必须 `| safe`；误删后用 `python …/2026-10-21-italic-plasmid-restore.py` 按上下文还原 |

**四类命中默认豁免，不要机械包 `<i>`：**

| 类别 | 例子 | 原因 |
|---|---|---|
| `tag` HTML 属性 | `alt=`、`title=`、`aria-label=` | 属性内不解析标签，写了会原样显示 |
| `ident` 标识符 | `id="wetlab-far1-sst2"`、`pESC-HIS-FUS1-yEGFP`、`ΔFAR1`、`crRNA_FAR1_KO_up` | 质粒名/缺失株名/序列名保持正体 |
| `ref` 文献条目 | `ref-list` 内的文献标题 | 条目只渲染纯文本，不出链不套标签 |
| JS 数据文本 | `contribution.js` 的图注 `alt`、HP 卡片 `what/why`、notebook 标题 | 经 `textContent` 渲染，标签会变成字面文字；要斜体须改用 `| safe` 通道 |

`prose` 命中必须逐条判语境：**基因语境补斜体；蛋白产物语境（`Far1`、`Sst2`、`Gpa1`）保留正体**——后者是规范要求，不是遗漏。`lacZ` 在 `<i>lacZα</i>` 上的命中属 α 边界误报，同样不是遗漏。

旧的文本规范审计脚本仍可用于大小写/写法复查：`对话归档/temporary-tools/2026-10-21-text-standards-audit.py`；
批量大写脚本 `2026-10-21-text-standards-uppercase.py` 属旧口径，**禁止再执行**。

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
| `text-standards.md` | 全站文本规范：基因名大写、拉丁名斜体、文献引用角标（替换表 + 模板 + 校验脚本） |
| `team-and-home.md` | Team 成员页分类与顺序、响应式布局、首页分屏拼装与手动微调区 |

### 流程 `docs/workflow/`
| 文件 | 内容 |
|---|---|
| `development-constraints.md` | 未来开发必须遵循的约束规则 |
| `new-page-template.md` | 新内容页快速模板（推荐复制起点） |
| `build-and-preview.md` | 本地预览命令、构建命令与 npm 退出码陷阱 |
| `root-to-flask-sync.md` | 根站 → Flask 内容同步决策 |
| `flask-to-root-sync.md` | Flask → 根站反向同步：脚本化注入口径、路由/资源/框架映射表、约束与验证清单 |
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
