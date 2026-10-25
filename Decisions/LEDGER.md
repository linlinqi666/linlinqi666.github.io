# 决策台账

> 记录重大方案选型（数据、架构、接口、合规范围等难以回退的决策）。每条决策必须写明"决策 / 理由 / 影响范围 / 验证方式"；复杂或长期的决策另建 `DEC-YYYY-MM-DD-<slug>.md` 详细记录，并在此登记链接。

## 决策区

| ID | 标题 | 类型 | 工程 | 状态 | 详细记录 | 最近更新 |
|---|---|---|---|---|---|---|
| DEC-2026-10-04-001 | 全站搜索框架升级选型（FlexSearch + 浏览器端中文分词 + 构建期自动更新） | 技术选型 | 跨工程 | 已定稿 | `DEC-2026-10-04-search-framework.md` | 2026-10-04 |
| DEC-2026-10-11-001 | 不建 `experiments` / `alternative-platform` / `software` / `education` 四个标准页 | 合规范围 | flask | 已定稿 | 本条 | 2026-10-11 |
| DEC-2026-10-26-001 | Flask → 根站反向同步四项口径（图片回映射本地、三个官方 stub 不迁、全量覆盖、沿用根站路径） | 跨工程同步 | 跨工程 | 已定稿 | 本条 | 2026-10-26 |

---

## DEC-2026-10-11-001：不建四个标准页

- 日期：2026-10-11
- 提出：用户（明确表态"现在页面没有的页面，基本都确定不做了"）
- 议题：iGEM 2026 标准页覆盖范围——是否补齐 `experiments`、`alternative-platform`、`software`、`education`

### 决策

**不创建** `experiments`、`alternative-platform`、`software`、`education` 四个页面；相应地，
`check_migration.py` 的 `R3`（标准页存在）与 `R15`（冻结后标准 URL 可达）将**长期保持 FAIL**，
不再作为待办项跟踪。

### 理由

1. 本队只申报三个奖项（`inclusivity` 仅承载特殊奖，已单独处理），这四个页面并非本队申报所需的
   评分材料载体；评分按**指定 URL**取页，材料放在实际申报页上即可。
2. 四个页面的内容需要真实实验/软件/教育产出支撑，当前无对应素材；为凑页面而建空壳会违反
   "不得提交占位符 / 不得把未完成内容写成结果"的项目红线（见 `.codebuddy/rules/PAGER-yeast.mdc`）。
3. 官方仓库模板自带的同名文件属循环论证样本，不作为"必须保留"的依据。

### 影响范围

- `check_migration.py`：`R3` / `R15` 的 FAIL 属**已知接受项**，每次校验只需确认"无新增 FAIL"。
- 隔离区 CI 就绪度与 `flask freeze`：不受影响（官方模板残留的同名文件留在远程，本轮不动）。
- 导航（`wiki/menu.html`）与页脚：不新增这四个入口。

### 验证方式

- `flask freeze` 产物中不生成这四个路由（现状即如此）；
- `check_migration.py` 输出中 `R3` / `R15` 的 FAIL 条目与本决策一致，且无其它新增 FAIL。

---

## DEC-2026-10-26-001：Flask → 根站反向同步四项口径

- 日期：2026-10-26
- 提出：用户（本轮任务指定「Flask 站全部内容完整迁移并同步到外部站点」）
- 议题：与 `docs/workflow/root-to-flask-sync.md`（2026-09-13，根站为权威源）方向相反，需明确反向同步口径

### 决策

1. **图片回映射本地**：CDN `static.igem.wiki/...` → 根站 `static/image/...`；本地无原件时从 `igem2026-flask/static/image/wait/` 原格式回补；三级都不中才保留 CDN 绝对地址并登记清单。
2. **三个官方模板页不迁移**：`entrepreneurship` / `inclusivity` / `measurement` 保持根站没有（README「我方不参与、与线上逐字节一致」红线）。
3. **全量覆盖**根站 16 页正文；HP 页沿用 2026-09-13 合并口径。
4. **沿用根站现有路径/permalink**，`results→wet-lab/result.html`、`safety-and-security→wet-lab/safety.html`、`human-practices→integrated human-practices.html`、`team→team/members.html` 只维护映射表，不改名。

### 理由

1. 官方提交站的线上内容与评审可见版本一致，反向同步可让历史参考站不再落后；
2. iGEM 官方路由不得改名只约束 `igem2026-flask/`（提交工程），根站作为参考站保持既有 URL 更安全；
3. 三个 stub 页属不参与奖项的官方模板残留，迁进来会引入根站没有的路由且无内容价值。

### 影响范围

- 根站 `src/**/*.njk` 16 个页面正文被覆盖（原版备份在 `对话归档/backups/2026-10-flask-to-root-sync/`）；
- 新增 `static/css/flask-sync/*.css`、`static/image/**` 回补 110 个文件；
- `igem2026-flask/` 不被反向修改；
- `hardware`/`parts`/`safety`/`attributions`/`contribution` 由 `_data` 驱动退化为静态 HTML（后续数据改动需两处同步）。

### 验证方式

- `npm run build:all` 通过；`root-asset-check.py` 缺失引用 0；`root-smoke.py` 16 页 200 且资源 0 失败；
- `root-integrity-check.py` 模板残留 0、`MODEL_GAME_DATA` 非空；
- 详细记录：`对话归档/verification/2026-10-26-flask-to-root-sync-verification.md`；
- 同步口径与约束：`docs/workflow/flask-to-root-sync.md`。

---

## 记录规范

- ID：`DEC-YYYY-MM-DD-NNN`（按决策日期与当日序号）。
- 工程：`根站`（根目录 Eleventy 站点）／`flask`（`igem2026-flask`）／`跨工程`。
- 状态：`待确认` / `已定稿` / `已调整` / `已废弃`。
- 每条必须含：**决策 / 理由 / 影响范围 / 验证方式** 四段；被推翻的旧决策改为 `已调整` 并链到新条目，不删除历史。
