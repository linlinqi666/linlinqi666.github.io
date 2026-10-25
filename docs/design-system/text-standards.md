# 全站文本规范（基因斜体 / 蛋白 Gpa1 · 拉丁名斜体 · 文献引用角标）

> 本文件是 `README.md` 红线章节的分册细则（2026-10-21 立）。
> 冲突时以 `README.md` 红线章节为准；本文件只负责给规则的具体口径、模板与校验方法。
> 适用范围：根目录静态站点 `src/**` 全部页面与 `src/_data/*.js`；官方提交站
> `igem2026-flask/wiki/pages/*.html` 在迁移时适用同一套规则。

## 1. 基因符号斜体大写，蛋白产物正体 Gpa1

### 1.1 口径（按语境判别）

| 语境 | 写法 | 示例 |
|---|---|---|
| 基因座 / DNA 序列 / 敲除或改造靶点 / 向导 / 同源臂 / 修复模板 / 启动子 / 编码序列 | **斜体 + 全大写** | `<i>FAR1</i>`、`<i>SST2</i>`、`<i>GPA1</i>`、`<i>STE2</i>`、`<i>FUS1</i>`、`<i>URA3</i>` |
| 报告基因 / 报告匣中的基因符号 | **斜体，保留原大小写** | `<i>yEGFP</i>`、`<i>lacZ</i>`、`<i>lacZα</i>`、`<i>MEL1</i>` |
| 蛋白产物 / 结构域 / 蛋白间界面 / 嵌合蛋白 | **正体 + 首字母大写** | `Gpa1`、`Ste2`、`Sst2`、`Far1`、`Gpa1-Gαq chimeric G protein`、`the engineered Gpa1/Gαq interface` |

- **判定关键词**：`locus` / `knockout` / `guide` / `spacer` / `homology arm` /
  `repair template` / `promoter` / `cassette` / `encodes` / `gene` → 基因语境，斜体大写。
- **蛋白不加 `P` 后缀、不全大写**：写 `Gpa1`，不写 `GPA1`、`Gpa1p`、`GPA1P`；
  写 `Ste2`，不写 `STE2P`。Gα 亚基写 `Gαq` / `Gα`，不写 `GPAα`。
- **条目名同样适用**：`<i>GPA1</i> upstream homology arm`、`<i>FAR1</i> sgRNA
  expression cassette`、`<i>FAR1</i>-targeting guide sequence`。
- **外源报告基因沿用国际标准写法，不做大写化，但必须斜体**：`<i>yEGFP</i>`、
  `<i>lacZ</i>`、`<i>lacZα</i>`、`<i>MEL1</i>`。不写 YEGFP / LacZ / GFP。
- **`FAR1` / `SST2` 基因语境禁止写成 `Far1` / `Sst2`**：基因语境一律 `<i>FAR1</i>`、
  `<i>SST2</i>`；只有蛋白产物写正体 `Far1`、`Sst2`。
- **主语型基因符号（2026-10-21 用户口径补充）**：在解释"为什么敲除 / 改造这个基因"的
  句子里，主语即便谓语说的是产物功能，也按基因写斜体大写——
  `<i>FAR1</i> mediates cell-cycle G1 arrest`、
  `<i>SST2</i> acts as a negative regulator of G-protein signaling`、
  `<i>FAR1</i>-mediated G1 arrest`。已按此改写的段落：
  `engineering` 页 Chassis 段、`design` 页 Module 1 段、`description` 页 Module 4
  （"`<i>FAR1</i>` connects pheromone signaling with cell-cycle regulation"、
  "`<i>SST2</i>` is a major negative regulator of Gpa1-mediated pheromone signaling"）。
  正文中 `FAR1` / `SST2` 不再保留正体小写形态；正体只给真正的蛋白身份：
  `Gpa1`、`Ste2`、`Gpa1-mediated signaling`、`Gpa1–Gαq chimera`。
- **非酵母基因的受体/组件沿用原名**：`hM1Dq`（人源 DREADD 受体）、`MT1`、
  `TEVcs`、ALFA tag。
- **菌株号保持正体、不斜体**：`BY4741`、`S288C`。
- **强制范围**：用户 2026-10-21 点名 `FAR1`、`SST2`、`GPA1` 三个基因；其余酵母基因
  符号按同一口径，在后续批量迁移时同步。

> 依据：SGD 的写法就是「基因斜体大写、蛋白正体首字母大写」（`GPA1` / `Gpa1`）。
> 2026-10-21 之前站内统一大写正体的旧口径已废弃。

> **官方提交站 2026-10-21 已全站改造完成**：`igem2026-flask/wiki/pages/*.html`
> 按本口径逐句改写，斜体基因符号 371 处、正体蛋白名 197 处、斜体拉丁名 86 处；
> 构建体 / 报告匣名（`P_FUS1–yEGFP`、`FUS1–yEGFP`、`FUS1–lacZ`、`FUS1–MEL1`）、
> 登记部件名与 `alt` / `title` / `aria-label` 属性值保持正体。
> 校验脚本 `对话归档/temporary-tools/2026-10-21-flask-verify.py`（当前 0 残留），
> 明细见 `对话归档/2026-10/2026-10-21-text-standards/verification/2026-10-21-flask-gene-italic-verification.md`。

> **第二轮（2026-10-21 用户复查后）**：`engineering` 页 Chassis 段的 `Far1` / `Sst2`、
> `design` 页 Module 1 的两条 "为什么敲除" 分句、`engineering` 页的 `Ura3` / `His3`
> 选择标记、`contribution` 侧栏条目 `FAR1/SST2 editing components`、
> `parts` 页 `(MFα1)` 全部改为斜体大写；改动逐条列在
> `对话归档/temporary-tools/2026-10-21-flask-gene-context-audit.md`（复查后 267 处命中
> 均为蛋白、基因型、质粒/构建体名或文献标题，属预期保留）。

### 1.2 替换表（旧写法 → 新口径）

| 旧写法 | 新写法 | 备注 |
|---|---|---|
| `GPA1`（指基因座 / 同源臂 / 启动子 / 敲除） | `<i>GPA1</i>` | 基因语境 |
| `GPA1` / `GPA1P` / `Gpa1p`（指蛋白） | `Gpa1` | 蛋白语境 |
| `STE2P`（指蛋白） | `Ste2` | 蛋白语境 |
| `SST2`（指基因座 / 敲除 / 向导） | `<i>SST2</i>` | 基因语境 |
| `FAR1`（指基因座 / 敲除 / 向导 / 修复模板） | `<i>FAR1</i>` | 基因语境 |
| `GPAα` / `Gpaα` | `Gα` | Gα 亚基 |
| `LacZ` | `lacZ` | 与全站 `lacZ` 写法一致 |

### 1.3 不改动的位置

以下位置属于**标识符或路径**，改写会破坏锚点、样式或资源引用，禁止替换：

- `id="..."`、`id: '...'`、`key: '...'`、`anchor: '...'`、`data-*="..."` 的值；
- `class="..."`、`style="..."` 的值；
- `src="..."` / `href="..."` 指向的资源路径与站内锚点；
- 任何文件名（如 `static/reports/model/Ste2p/`、`model-fig-a-2-mt1.png`、
  `notebook-chassis-far1-sst2-knockout.pdf`）；
- 代码注释中的路径与字段名。
- **原始素材存档**：`static/data/sustainability/sources/**`（源文档文本转录与原始
  HTML）保持原样——它们是溯源依据，不随页面排版规则改写；这些文件不直接渲染进页面。

### 1.4 执行方式

- **不做机械批量替换**：同一符号是基因还是蛋白只能按句子判断，脚本看不出语境。
- **旧的 `对话归档/temporary-tools/2026-10-21-text-standards-uppercase.py` 已失效**，
  禁止再跑——它会把 `Gpa1` 全量改成 `GPA1`，与本规则相反。
- 只读审计仍可用 `2026-10-21-text-standards-audit.py`（列词形计数与未斜体拉丁名），
  "小写基因名"一栏的命中先按 1.1 判语境，再决定是否改写。

## 2. 拉丁学名一律斜体

### 2.1 口径

- 物种拉丁学名在**可见文本**中一律斜体：`<i>Saccharomyces cerevisiae</i>`、
  `<i>S. cerevisiae</i>`、`<i>Escherichia coli</i>`、`<i>E. coli</i>`、`<i>Homo sapiens</i>`。
- **`E. coli` 与 `Saccharomyces cerevisiae` 同等强制**：正体 `E. coli` 属红线，
  菌株名（`Top10`/`DH5α`/`BL21`）紧随其后不斜体。
- **菌株号不斜体**：`BY4741`、`S288C`。
- 中文译名（"酿酒酵母"）不斜体。

### 2.2 渲染前提

- 数据字段里写 `<i>…</i>` 时，模板必须 `| safe` 才不会转义成字面文本。
  已确认带 `| safe` 的位置：`src/wet-lab/parts.njk`（`pair()` 宏）、
  `src/wet-lab/safety.njk`（references 列表）、`src/_data/parts.js`
  的 `fn`/`source`/`en` 字段（经 `pair()` 渲染）。
- **HTML 属性里不能放斜体标签**：`alt="…"`、`title="…"`、`aria-label="…"`
  中的拉丁名写**纯文本**（不加 `<i>`）。已知此类位置：
  `src/project/engineering.njk` 的图 alt、`src/wet-lab/protocol.njk` 的 chip
  title、`src/wet-lab/notebook.njk` 的 `pdfLabel`（`aria-label`）。

### 2.3 审计

`对话归档/temporary-tools/2026-10-21-text-standards-audit.py` 输出的
"§3 未斜体的拉丁名"表即为待修清单；属性内与注释行的命中属预期例外。

### 2.4 限制酶名称同样斜体

- 限制性内切酶名整词斜体：`<i>NdeI</i>`、`<i>BamHI</i>`、`<i>EcoRI</i>`、
  `<i>HindIII</i>`、`<i>XbaI</i>`、`<i>SalI</i>`、`<i>NotI</i>`、`<i>SacI</i>`、
  `<i>KpnI</i>`、`<i>PstI</i>`、`<i>XhoI</i>`、`<i>SmaI</i>`、`<i>SphI</i>`。
- 酶切位点 / 克隆位点表述同样斜体：
  `flanked with <i>NdeI</i> and <i>BamHI</i> sites`、
  `<i>BamHI</i>/<i>XhoI</i> double digestion`。
- 不含酶名的通用表述保持正体：`restriction sites`、`multiple cloning site`、
  `double digestion`、`sticky ends`。
- 属性值（`alt`/`title`）、文件名、序列名（如 `pGADT7-NdeI-BamHI`）内写纯文本。

## 3. 文献引用：统一为可跳转角标

### 3.1 正文角标模板

```html
<a class="cite-ref" href="#<页前缀>-reference-<n>">[n]</a>
```

- **类名唯一**：`.cite-ref`（定义在 `static/css/navigation/navigation.css`，全站加载）。
  旧的 `.safety-cite` / `.hardware-cite` 已于 2026-10-21 并入 `.cite-ref`。
- **外观为描边小方框**：1px `rgba(139,90,43,.45)` 边框 + 3px 圆角 + `0 .3em` 内边距，
  轻微上标（`vertical-align: .35em`），hover 加深边框并加淡色底。方框由 CSS 生成，
  正文仍需自己写 `[n]`，**不得**用图片或伪元素替代方括号。两站 CSS 必须保持一致。
- **锚点 id 规则**：`<页前缀>-reference-<n>`，页前缀取页面名
  （`description-` / `design-` / `model-` / `parts-` / `safety-` / `hardware-` /
  `hp-`），`n` 从 1 起、**页内连续且唯一**。
- **显示号必须等于目标号**：角标显示 `[n]` 就必须指向 `#…-reference-n`。
  同一条文献被引用多次时重复该角标即可。

### 3.2 文末参考文献列表

```html
<ol class="ref-list">                     <!-- 或 ol.description-refs -->
  <li id="<页前缀>-reference-1">条目文字</li>
</ol>
```

**条目编号必须是方括号 `[n]`（2026-10-21 用户红线）。** 渲染由
`static/css/navigation/navigation.css` 统一定义：对
`ol.ref-list` / `ol.description-refs` / `ol.safety-references` /
`ol.hardware-references` / `ol.result-references` 设 `list-style: none` +
`counter-reset: ref-num` + `li::before { content: "[" counter(ref-num) "]" }`，
编号与正文角标同形同号。

- 新增板块沿用上述任一类名即可自动获得方括号编号，不需要写页面级序号样式。
- **禁止**回退成 `list-style: decimal`、手写 `1.` 前缀或把序号写进 `<li>` 正文
  （会与 `[n]` 重复，且删除/插入条目后号会错位）。
- 两个工程的 `navigation.css` 中该段必须一致；改一侧必须同步另一侧。

- 列表条目**只渲染文字，不输出 `<a>` 外链**（iGEM 要求；DOI/URL 保留为纯文本）。
- 数据源统一放 `src/_data/<page>.js` 的
  `references: [{ num, text, link }]`；`link` 仅存档 DOI/网址（溯源用），
  页面不渲染。`src/_data/parts.js` 已于 2026-10-21 从 `{ key, text }`
  改为 `{ num, text, link }`。
- 渲染时需要 `| safe`（条目文字可能含 `<i>` 物种名）。
- 样式：`.cite-ref`、`:target` 高亮与 `scroll-margin-top` 由公共 CSS 承担，
  跳转不被顶栏遮挡。

### 3.3 编号与条目必须双向对应

- 正文出现的每个 `[n]` 都必须在文末列表里有第 n 条；
- 文末每条都应在正文至少被引用一次（或明确标注为"暂无对应正文陈述"）。
- **不允许凭空新增文献**：本页没有的文献不补条目；确需补齐时先取得出处。

### 3.4 各页现状（2026-10-21，根站与 flask 站已一致）

| 页 | 角标类 | 锚点前缀 | 列表 | 角标数 / 条目数 |
|---|---|---|---|---|
| description | `.cite-ref` | `description-reference-N` | `ol.description-refs` | 42 / 20 |
| design | `.cite-ref` | `design-reference-N` | `ol.ref-list` ×2（背景 1–5、方案 6–12） | 22 / 12 |
| model | `.cite-ref` | `model-reference-N` | `ol.ref-list` | 18 / 23（5 条无正文对应） |
| parts | — | — | 无（2026-10-21 移除） | 0 / 0（`references` 数据保留存档） |
| human-practices | `.cite-ref` | `hp-reference-N` | `ol.ref-list` | 3 / 8（5 条无正文对应） |
| safety | `.cite-ref` | `safety-reference-N` | `ol.safety-references` | 20 / 17 |
| hardware | `.cite-ref` | `hardware-reference-N` | `ol.hardware-references` | 12 / 12 |

> **官方提交站（`igem2026-flask/`）2026-10-21 已同步**：flask 站没有数据层，
> 文献全部硬编码在 `wiki/pages/*.html`；角标、锚点前缀、`ol.ref-list` 形态与
> 根站完全一致（description 42/20、design 23/12、model 18/23、
> human-practices 3/8、safety-and-security 23/17、hardware 14/12）。
> parts 页的参考文献板块已在根站与 flask 站同步移除（2026-10-21，两站均为 0/0，
> 正文 4 个 `[n]` 角标一并删除，无死锚点）。
> 差异：flask 的 safety / hardware 用 `em` 表示物种名，已统一改回 `i`。
>
> **model 页的文献口径以根站为准（23 条）**：根站曾在迁移期间被更新，删除了
> `Schrödinger (PyMOL)` 与 `Case (Amber 2020)` 两条并把角标重排为 23 体系；
> flask 站原先按 25 条补过，已回退为 23 条、角标同步为
> `[13]`=PDB、`[14]`=Amber99SB-ILDN、`[15]`=CHARMM36m、`[16]`=CHARMM36 lipid、
> `[17]`=TIP3P、`[21]`=Ejsing、`[22]`=Zinser。

> model / human-practices 中"无正文对应"的条目：宁可只留列表条目，也不把
> 角标硬挂在没有点名该文献的句子上。清单见
> `对话归档/temporary-tools/2026-10-21-model-cite-refs.md` 与
> `2026-10-21-hp-cite-refs.md`。

## 4. 术语大小写：`Pheromone` 起分句时大写

- 术语作**分句开头**时首字母大写，典型形态是"冒号标签 + 完整分句"：
  `<strong>Cell-cycle arrest:</strong> Pheromone stimulation triggers
  <i>FAR1</i>-mediated G1 arrest…`
- 句中作普通名词仍小写：`the mating pheromone pathway`、
  `pheromone-responsive promoters`、`α-factor pheromone`。
- 同一逻辑适用于被当作分句主语的 `Receptor`、`Pathway`、`Module` 等标签词；
  但**不得**把句中名词无理由大写，也不得为统一大小写而改写句子结构。
- 表格表头、图表标签、`alt`/`title` 属性内按句首规则处理，但属性内不加大写以外的东西。

## 5. 提交前自检

1. `python 对话归档/temporary-tools/2026-10-21-text-standards-audit.py`
   → 未斜体拉丁名清单应只剩属性/注释/标识符例外；基因名命中逐条按语境判断
   （蛋白语境写成 `Gpa1` 是合规的，不再算残留）。
2. 全站角标抽查：任取一个 `[n]`，其 `href` 目标必须在同页存在且编号一致，
   且渲染为描边小方框（`border` 生效、非纯文字）。
3. 改过 `src/**` 后跑 `npm run build:all`，并用 HTTP 服务（不能 `file://`）
   验证页面无 console 错误、跳转命中 `:target` 高亮。
4. 根站改完并视觉通过后再迁移 `igem2026-flask/`，对同一批文件执行相同改动；
   parts 页与 `static/css/parts.css` 两批改动已于 2026-10-21 双向同步完成。
