# Git 提交与入库规范

> 本文件由根目录 `README.md` 分册而来（2026-10-17）。内容未做改写，
> 仅按主题归位；与 `README.md` 冲突时以 `README.md` 的红线章节为准。

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
3. **构建与验证**：根站按 §10.1 分步执行 `npx eleventy` + 搜索索引 + `tools/check-static-assets.js` + `tools/check-performance-budget.js`；flask 执行 `python -m compileall app.py` + `flask freeze`；受影响页面**必须经本地 HTTP 服务**打开确认（`file://` 不算验证）。

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

- 单张图片默认目标 **≤ 300 KB**；**> 1 MB 必须在提交信息里写明原因**；单文件 **≥ 10 MB 一律先压缩**再入库——压缩方式为**降质量 / 降尺寸并保持原格式**，**不得擅自转码**（PNG→WebP、PNG/JPEG→AVIF 等）或改名（见第 24 条）。
- **成员页既有照片**为 `.webp`（长边 ≤ 1920px、质量 82–88、`method=6`、按 EXIF 纠正方向）——属**历史产物，沿用即可**；本行**不构成"新素材也要转 webp"的依据**（见第 24 条：新增素材一律保持原格式）。源图放 `static/image/**/源图片/`（已在 `.gitignore` 排除）。
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
