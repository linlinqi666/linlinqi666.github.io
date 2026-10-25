# 内容页统一设计规范（小节锚点 · 收纳条 · 二级导航 · 长页收纳）

> 本文件由根目录 `README.md` 分册而来（2026-10-17）。内容未做改写，
> 仅按主题归位；与 `README.md` 冲突时以 `README.md` 的红线章节为准。

### 5.14 Design / Protocol / Results / Contribution 四页结构（2026-09-22 重建，2026-09-26 拆分）

四页按 `static/expriments/The extreme/` 下三套页面资料包（`exepriment/experiments/`、`result/`、`contribution/` 的 `output/15-*内容大纲.md`）重建，内容来源为 `static/expriments/` 四个模块的一手分析。原 `wet-lab/experiments.html` 于 2026-09-26 按用户指令拆分为 `wet-lab/design.html`（实验设计）与 `wet-lab/protocol.html`（实验方案）两页：原页删除，导航（`nav.njk` 移动 + 桌面两处）、页脚（`footer.njk`）、首页页脚与 `src/_data/contribution.js` 引用同步改到新页，搜索索引 `PAGES` 同步（需求 `REQ-20260926-002`）；他队样本分析与拆分方案见 `对话归档/2026-09/2026-09-26-experiments-split/`。

**Design 页**（`src/project/design.njk`，2026-10-11 由 `wet-lab/design.njk` 合并而来，全站仅此一设计页）五节，承接设计层内容：

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

**Results 页**（`src/wet-lab/result.njk`，源文档 `static/expriments/Result(2).doc`，按酵母内部通路四节组织）五节：`#results-overview` 概览 → `#results-chassis` 底盘改造 → `#results-pager` 受体构建 → `#results-gpa1` 接口改造 → `#results-reporter` 报告体系（FUS1-yEGFP）。源文档不含"综合讨论"节——旧版记的 `#results-discussion` 已撤销（该节不在源文档内、属 AI 合成，结论分散在各模块正文），页面不单列讨论。失败与在途不单列成页，穿插在对应模块内。2026-09-27：侧边栏 TOC 升级为两级（四个模块 level1 下各挂小节 `level3`，正文小节标题加锚点 `results-<模块>-<序号>`）；`sidebar-progress.js` 的 `sectionIdPrefixes` 已补 `results-` 前缀（否则高亮失效）；源 docx 的「目录」「在途与下一步」「原始数据清单」等元结构不进正文——目录转侧边导航，其余转模板 HTML 注释。侧边栏二级导航默认折叠，点击模块（level1）才展开其下小节（level3）；已移除 `:hover` 自动展开以避免布局抖动。正文小节由全站组件 `static/js/components/section-fold.js` 收纳条化（见 §5.14.1 / §5.14.2）：脚本运行时把 `.content-card` 内带 id 的 h3 小节包成原生 `<details class="section-fold">`（默认折叠、点击小节标题展开、侧边栏锚点命中自动展开；无 JS 时保持全展开降级），样式在全站 `static/css/components/section-fold.css`。

### 5.14.1 内容页耦合组件与集合测试约束（2026-09-27）

「侧边栏级联导航 + 正文收纳条」的页面存在一组**强耦合**前端组件，任一改动后必须联合验证，禁止「改 A 测 A 过、B 又瘫」式的分开测试：

- 各内容页 `.njk`：小节标题锚点 `<页面前缀>-<语义>` + 侧边栏 `level2/level3` 导航；
- `static/js/components/section-fold.js`（`base.njk` 全站加载）：把 `.content-card` 内带 id 的 h3 包成 `<details class="section-fold">` 默认折叠（点击展开、锚点命中自动展开；2026-10-07 起展开/收起带「高度 + 内容淡入」动画，写法不变，参数与约定见 §5.14.3）；
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
3. **收纳条自动生效**：脚本运行时把每个 `.content-card` 内带 id 的 h3 及其后内容（至下一个 h2/h3）包成 `<details>`（2026-10-07 起自带展开/收起动画，写法不变，见 §5.14.3）；数据渲染、正文无 h3 的页面可改用**整卡折叠**——给卡片 div 加 `data-fold-card`，脚本把 `.content-body` 收起、卡片标题 h2 留在收纳条上，锚点仍保留在卡片 div 上供侧边栏链接使用（该形态组件已具备，当前暂无页面启用）。两种情况页面都无需再写任何 JS；
4. **卡片级 id 与 h3 id 都保留**：滚动高亮按视口中线判定，落在卡片区间高亮 level1，落在小节区间高亮 level3；
5. 整页关闭折叠用 `<body data-section-fold="off">`；排除个别标题用 `<h3 data-no-fold>`。

**已按本规范改造**（wet-lab，2026-09-27）：`result`（22 小节）/ `safety`（7）/ `protocol`（15）/ `design`（15）。

**protocol 页特别说明（2026-09-27 第三轮）**：`src/wet-lab/protocol.njk` 由生成脚本 `对话归档/2026-09/2026-09-27-protocol-from-source/temporary-tools/build_protocol_njk.py` 从实验组源文档逐字生成，**锚点与两级导航已写进生成脚本**——正文 h3 为 `protocol-<模块>-purpose|materials|steps`（报告体系 6 份方案为 `protocol-reporter-plan-1..6`），侧边栏四个模块各挂对应 `level3`。维护该页须改脚本并重跑：`python build_protocol_njk.py` → 将 `generated/protocol.njk` 复制到 `src/wet-lab/protocol.njk` → `npx @11ty/eleventy` → 跑 §5.14.1 两套验证。**直接编辑 `src/wet-lab/protocol.njk` 会在下次重跑脚本时被覆盖。**

> 更新（2026-10-15）：该页自 2026-09-30 起已回退为**整份 PDF 单卡页**（无侧栏、无 h3 锚点；正文为介绍卡 + `<object>` 内嵌 CDN `lab/wetlab/protocol/protocol-2026-10-12.pdf`，47 页）。上文的生成脚本与「直接编辑会被覆盖」仅适用于已弃用的拆分版；现行维护方式为直接编辑 `src/wet-lab/protocol.njk`（与 flask `wiki/pages/protocol.html` 同步）。
>
> 更新（2026-10-16）：protocol 源 PDF 更换为 `static/expriments/protocol(3).pdf`（仍 47 页），CDN 引用文件名按日期惯例改为 `lab/wetlab/protocol/protocol-2026-10-16.pdf`（根站 `src/wet-lab/protocol.njk` 与 flask `wiki/pages/protocol.html` 同步修改）；待上传副本在 `igem2026-flask/static/image/wait/lab/wetlab/protocol/`，本地源副本在 `static/pdf/protocol/protocol-2026-10-16.pdf`，旧 `protocol-2026-10-12.pdf` 已从暂存区移除（CDN 上未上传过，无需替换）。
>
> 更新（2026-10-17）：protocol 页由「整份 PDF 单卡」改为「卡片索引 + 文本收纳条」，不再内嵌 PDF（overview 末尾留 CDN 下载链接）。overview 卡内按原始编号列 26 张协议卡片，四行 6/7/7/6；侧边栏为 Overview + General Protocols + 四个模块，5 个 level1 各挂对应 protocol 的 level3（共 26 条）。正文末尾单张 `#protocol-library` 卡内 26 个 `<h3 id="protocol-pNN">` 由 `section-fold.js` 折成收纳条（默认全折叠，`protocol-` 前缀已在 `sectionIdPrefixes`）；点击卡片、侧栏或模块清单的锚点即展开对应收纳条并定位，每条收纳条末尾有「Back to overview」返回链接。正文逐字取自 `static/expriments/protocol(3).pdf`（PyMuPDF 提取，逐协议字符覆盖 0.97–0.996）；表格因 PDF 展平无法自动还原，在生成脚本 `TABLES` 中逐张手写。生成脚本 `对话归档/2026-10/2026-10-17-protocol-page-rebuild/temporary-tools/build_protocol_page.py`，**手改 `src/wet-lab/protocol.njk` 会被下次重跑覆盖**；新增样式 `static/css/protocol.css`。注意：侧栏链接被 `sidebar-progress.js` 以 `preventDefault + replaceState` 接管，不再触发 `hashchange`，故页内内联脚本补一次收纳条展开。1440 宽下折叠态页面高 6 824 px。flask 侧待同步。

**已回退（2026-09-27，用户确认改造范围仅湿实验）**：dry-lab `software`、project `description` / `design` / `engineering` / `contribution`、human-practices `education` 等页的锚点与折叠改造已用 git 精确还原（`src/` 下对应 `.njk` 回到改造前状态），为它们新增的 `sectionIdPrefixes` 前缀（`software-` / `project-` / `engineering-` / `build-` / `test-` / `learn-` / `education-` / `description-` / `biological-` / `modular-` / `innovation-` / `references` 等）已一并撤除。这些页恢复原状：侧边栏 `level3` 指向页面中不存在的 id（点击无反应）、滚动高亮不生效。如未来要重启这些页的改造，按本节三步 + §5.14.1 两套验证执行。

**dry-lab `model` 页重新纳入（2026-09-27 重写，`REQ-20260927-001`）**：Model 页正文按干实验建模文档整体重写，同时按本规范重建锚点与两级导航，共 10 个小节（id 前缀 `model-`，已登记到 `sectionIdPrefixes`）；两套验证脚本的页面清单已加入 `dry-lab/model.html`（e2e target 由 `model-dose-response` 改为 `model-screening`）。

> 2026-10-15 补充：上面「已回退」的 `project/contribution`、`project/description`、`project/engineering`、`project/design` 四页曾按 §5.14.4 试过整卡折叠，第二轮（同日）按用户口径改为「阈值 20 000 px + 仅 h3 小分类折叠」后，这四页展开高度均 < 20 000 px，已全部**回退为不折叠**（侧栏 level1/level3 跳转与高亮沿用既有体系，无需改动）。

**project `description` 页重新纳入（2026-10-20 按队伍提供的《EchoYeast Description.docx》整体重写）**：正文由原中文占位稿（项目背景 / PAGER 策略 / 生物元件库 / 实验设计 / 创新点 / 4 条占位参考文献）整体换成源稿英文全文——Abstract + 15 个编号章节 + Conclusion + 20 条参考文献 + 15.1 的 7×3 证据表，并按本规范重建锚点与两级导航：

- **18 张内容卡**（`description-abstract` / `description-why-influenza` / … / `description-references`），**31 个 h3 小节**（id 前缀 `description-`，已重新登记 `sectionIdPrefixes`，撤销 2026-09-27 的撤除）；侧栏 level1 = 18、level3 = 31。
- **折叠**：31 个 h3 全部由 `section-fold.js` 折成收纳条、默认全折叠；概览卡 Abstract 无 h3 保持常显。实测 1440 宽全展开 19 938 px、全折叠 9 881 px（源稿 20 条文献与 18 张卡使展开高度贴近 20 000 px 阈值，收纳后大幅缩短）。源稿第 10 与第 15.2 节的编号子项（Stage 1/2、四项下一步）用 `h4` 承载，不进收纳条。
- **三类排版处理**（不改内容）：① 拉丁学名 `Saccharomyces cerevisiae` / `S. cerevisiae` 斜体（9 处），菌株号 `BY4741`、`S288C` 保持正体；② 源稿行内角标 1–20 改为可跳转的 `.cite-ref`，共 42 个，参考文献条目只渲染文字、不输出外链（同 Safety / Hardware 2026-10-16 口径）；③ iGEM 归属标记 `Team Design / Results / Model / Hardware / Human Practices / Safety and Security` 渲染为 `.team-ref` 徽标并指向站内对应页面（共 54 处），非页面来源（`FUS1–yEGFP Experimental Report`、`NCBI NC_001135.5`）用 `.team-ref--source` 变体。源稿两段纯文本箭头块（第 4 节架构链、第 6.1 节受体架构）改为 `.signal-chain` 纵向链与既有 `.map-diagram` 横向结构域。
- **新增样式**（`static/css/navigation/navigation.css` description 组件段内）：`.description-subtitle` / `.description-list` / `.cite-ref` / `.description-refs` / `.team-ref` / `.signal-chain` / `.chain-inline`。
- **两处源稿截断**已在 `src/project/description.njk` 以 HTML 注释标注待队伍补全（`signal amplification` 句末无标点；`infecte` → 页面按最小笔误修正作 `infected`）。
- **验证**：`check-content-pages.js` 全绿（折叠 31 = h3[id] 31、level3 无死链、id 唯一）；`e2e-content-pages.js` 已加入本页用例（target `description-r1a-b6`）并通过；单页验证脚本见 `对话归档/2026-10/2026-10-20-description-rebuild/`（结构/引用/表格逐条比对、1440 与 480 零横向溢出、console 与请求零错误、6 张截图）。**flask 官方站尚未同步**（按工作流先根站、视觉通过后再迁）。

> 该页的素材、运行资源、打分数据与待核项**不在这里展开**，统一见 **`static/expriments/drylab/model/00-文件归属.md`**（该文件同时取代了同目录 `plan.md`）。

**dry-lab `hardware` 页重建（2026-10-15，`REQ-20261015-001`）**：硬件页按 `static/expriments/drylab/hardware/` 下四份源文件（正文 docx、模块技术需求 docx、整机技术需求 docx、采购清单 xlsx）整体重写，14 张内容卡、8 张表、27 张插图（`static/image/hardware/image1~27.jpg`，docx 内嵌图原字节导出，不转码），三份附件以 `<object>` 内嵌在源稿留位处（第七节末 = 模块需求、第八节末 = 采购清单、第九节末 = 整机需求）。表格与图数据抽到 `src/_data/hardware.js`，插图统一走 `src/_includes/partials/hardware-figure.njk`；`sectionIdPrefixes` 已重新登记 `hardware-`。**收纳形态**：概览卡常显，其余 6 张含小节的卡走 h3 收纳条（共 28 个小节：Problem / Origin / Iterations / Log 各若干、Architecture 3、BOM 1），无 h3 的 7 张卡（Worth / Goals / Specifications / Instrument / Test plan / Challenges / Future）按用户口径保持展开——页面由 44 165 px 压到 13 619 px；`e2e-content-pages.js` 以 `hardware-cup` 为目标纳入本页。源稿里的中文文件名（收集杯/收集杯2/激发端/检测端）已英化为 `Collection_Cup.SLDPRT`、`Collection_Cup_2.SLDPRT`、`Emitter_End 10.3.SLDPRT`、`Receiver_End 10.4.SLDPRT`。PDF 与图片当前指向根站本地 `static/pdf/hardware/`、`static/image/hardware/`，同步 flask 站时改为 `static.igem.wiki/teams/6373/wiki/lab/drylab/hardware/`。

**例外与边界（2026-09-27 确认）**：

- `wet-lab/notebook`（**2026-10-11 改为标准内容页**）：正文为「内容卡 + `<object>` 内嵌 CDN PDF」，与 `wet-lab/protocol` 同源（`.pdf-embed` / `.pdf-embed__object` / `.pdf-embed__fallback`，样式页内内联、两页改动需同步）；**已停用 pdf.js 阅读器与 `log-pdf.js`**（iGEM flask 版不再加载）。侧边栏改为普通章节导航，四个模块各占一张内容卡，id 前缀 `notebook-`（已登记 `sectionIdPrefixes`），已纳入本规范的锚点/收纳条体系。`sidebar-progress.js` 与本页说明均按标准内容页处理。
  - **模块入口**：`#notebook-overview`（Notebook Overview）／`#notebook-chassis`（Chassis Engineering）／`#notebook-gpa1`（Humanized G-Protein Chimera）／`#notebook-pager`（PAGER Fusion Receptor）／`#notebook-reporter`（Reporter Module）；未收录 PDF 的模块在卡内注明"记录整理中"。**PDF 一律托管于 CDN** `https://static.igem.wiki/teams/6373/wiki/lab/wetlab/notebook/`（两站引用同一套地址，本地不保留副本）：`notebook-chassis-far1-sst2-knockout.pdf`、`notebook-gpa1-humanization.pdf`、`notebook-pager-antigen-gated.pdf`（均实测 `200`）。上传文件名统一用**干净名**——原文件名含空格与括号，URL 编码易出错。文档来源为各模块 `.doc`，经 Word COM 转 PDF（脚本 `对话归档/temporary-tools/2026-10-10-doc2pdf-notebook.ps1`）。PDF.js 阅读器（`log-pdf.js` / `log-pdf-data.js`）已弃用，两站改用 `<object>` 直连 CDN PDF。
  - **旧实现（PDF 文档切换器 + `log-pdf.js` / pdfjs）仍保留在根站** `src/wet-lab/notebook.njk`；旧高亮验证脚本 `对话归档/temporary-tools/check-notebook-highlight.js` 只对旧实现有效，两站如需一致需另行同步改造。
- `team/attributions`（自带 `.jump-to-nav` + 独立 scrollspy，2026-10-18 起重构，见 §5.14.7）与 `human-practices/integrated human-practices`（209 KB 自定义地图结构）结构特殊，**不套用本节的 `.content-card` + 侧边栏 + 收纳条体系**。
- `index`（幻灯式全屏）、`wet-lab/parts`（模板循环 + 原生 `<details>`）、`team/members`（数据驱动）无 `description-nav`，不适用本规范。

新增页面接入照旧三步：① 正文小节 h3 加 `<页面前缀>-<语义>` id（或整卡折叠时给卡片加 `data-fold-card`）② 前缀登记 `sectionIdPrefixes` ③ 侧边栏 level2/level3 指向这些 id；改完必须跑 §5.14.1 的两套验证（两套脚本的页面清单需同步加入新页）。

- 数据来源为四个模块各自的 result 源 docx（语料层见各模块 `md/result-正文逐字对照/`、`md/result-图片提取/`，逐字对账与图片核验记录见 `99-result-逐字校验记录.md`；跨源冲突编号 `RS-` 见 `static/expriments/00-跨模块索引与接口.md` §六）。
- **页面只呈现已得结果**（2026-09-26 口径）：`在途与下一步`、`原始数据` 两节不进页面；进度、待办、自我审核与跨源冲突一律写入**模板源码的 HTML 注释**（`src/wet-lab/result.njk` 页首的 `RS-` 清单，构建后保留在页面源码中、不对读者渲染），审核与结论交由实验组。
- 页面配图放 `static/image/result/<模块>/`，**源 docx 解包后按原始格式原样使用（不转码、不缩放）**。~~由内嵌图转 webp（≤150 KB，宽 ≤1400 px）~~ —— **该做法 2026-10-11 废止**：既有损压缩又降采样，违反第 24 条「禁止擅自转码」。源图与站点图的映射表在各模块 `md/result-图片提取/02-页面用图映射.md`。新增图沿用「`<figure>` + 句首编号图注」写法，示意图须在图注注明「示意图，非实验结果」。

**Contribution 页**（`src/project/contribution.njk` + `src/_data/contribution.js` 数据源）分章：概览 → 1 部件（`#contribution-parts`，4 条）→ 2 协议与方法（`#contribution-protocols`，4 条）→ 3 其他贡献（`#contribution-others`，3 条）→ 获取与许可（`#contribution-access`）→ 归属与致谢（`#contribution-attribution`）。每条贡献按三件套写：是什么、为什么对后续队伍有用、怎么拿到；卡片 id 规则为 `parts-*` / `protocol-*` / `other-*`。软件、硬件、教育三章无产出，整章不设。

**各页共同约定：**
- 表格沿用页面既有的内联写法（同一套 `border/padding`），新增表格保持一致。
- 进度/状态与官方对照内容一律不渲染（第八.20）：资料缺口直接留空，内部待核项（KQ- / SQ- / RC- / GC-）以 HTML 注释留在源码中。
- 设计 / 计划不写成结果：未完成的写「计划验证 / 尚未」，数据不足写清卡在哪一步。

> 注意：`.gitignore` 的 `*.md` 规则会连带忽略 `static/expriments/` 下的方案文档与页面模板；如需入库，须追加 `!static/expriments/**/*.md` 例外（同 11.2 的既有做法）。

### 5.14.3 收纳条展开动画 + 图片到达动画（2026-10-07）

两个全站组件，**零配置接入**：HTML 写对就自动生效，页面不需要写任何 JS/CSS；根站与 flask 镜像同源。

| 组件 | 文件（根站 ↔ flask 镜像） | 全站加载位置 |
|---|---|---|
| 收纳条（含展开/收起动画） | `static/js/components/section-fold.js` + `static/css/components/section-fold.css` | 根站 `base.njk` / `head.njk`、flask `wiki/layout.html` |
| 图片到达动画 | `static/js/components/media-reveal.js` + `static/css/components/media-reveal.css` | 同上 |

#### A. 收纳条：怎么写就有动画

1. **写法与 §5.14.2 完全一致，无需任何改动**——正文小节标题写成 `<h3 id="<页面前缀>-<语义>">` 且位于 `.content-card` 内（或给容器加 `data-section-fold-root`）即可。新增页面/新模块不需要做任何事。
2. 点击标题的行为：高度平滑展开 **0.3s**（`--duration-normal` + `--ease-smooth`）+ 内容整体淡入；再点一次对称收起，**动画播完才真正把 `details.open` 置为 false**；侧边栏 level3 锚点 / URL hash 命中时自动展开，并在动画结束后校正滚动落点。
3. **动画参数唯一入口**：`static/css/components/section-fold.css` 里 `.section-fold` 的变量块——`--fold-dur-open` / `--fold-dur-close` / `--fold-ease`（默认取全站令牌，符合 §4.6）。
4. **关闭开关**：整页 `<body data-section-fold-anim="off">`；单个收纳条 `data-fold-anim="off"`。
5. **降级红线（不得回退）**：无 JS → 不生成收纳条、正文全展开（渐进增强）；`prefers-reduced-motion: reduce` → 瞬开瞬收、不写任何内联样式；动画期间只在 `.section-fold__body` 上临时挂 `overflow:hidden`，播完立即撤除，内部 sticky/绝对定位不受影响；快速连点、收起途中反悔都从**当前可见高度**接着走。
6. 与 `SidebarProgress` 的强耦合不变（§5.14.1）：动画起手与收尾各调用一次 `recalculate()`。
7. ⚠️ `.section-fold__body` 的 padding 是 HP 页手写收纳条（`.hz-expert-fold-all` + `hpFoldReveal`）的既有依赖，**不能删也不能搬**；组件自己生成的收纳条把内边距放在内层 `.section-fold__inner`，使动画层高度能真正归零（padding 会抵住 `height:0`）。

#### B. 图片：怎么写就有「不跳动 + 到达淡入」

```html
<img src="…" alt="…" width="1200" height="800" loading="lazy" decoding="async">
```

- `width` / `height` 写**图片真实像素**：浏览器据此在加载前按比例预留位置，页面不再因图片到达而跳动；
- `loading="lazy"` / `decoding="async"` 交给浏览器，不要自行加 class；
- 到达淡入由 `media-reveal.js` 自动接管：**只处理 `<main>` 内**、尚未解码完成的图片先瞬时 `opacity: 0`，解码完成后淡入（0.3s）；已缓存/已解码的图片**不参与**（避免闪一下）；加载失败（error）也照常显示，不会永久隐身；
- 退出方式：`data-no-reveal`（加在 `img` 或任意祖先上）；`prefers-reduced-motion: reduce` 时整个组件不生效；
- 同批撤掉了 `mobile.css` 里无差别的 `img { content-visibility: auto }`：它未配 `contain-intrinsic-size`，会把视口外的图片按 0×0 计算，滚动到附近再突然撑开，反而放大布局偏移（图片密集页实测整页高度差数千像素）；
- 现状：flask `wiki/pages/results.html` 的 17 张配图已按此写法（宽高取自 CDN 实测像素）；其余页面按需补齐——**新写图片请直接照此格式**。

**本轮验证（可复跑）**：`对话归档/temporary-tools/2026-10/2026-10-07_verify_animations.py`（逐帧采样 + 双重降级 + 图片预留共 31 项，全绿；报告 `…/verify-production/anim-verify.txt`）；§5.14.1 的两套耦合回归（结构层 jsdom + 真实 Chrome 几何层）均通过，报告 `…/verify-production/coupling-tests.txt`。

### 5.14.4 长页收纳标准（2026-10-15，`REQ-20261015-002`）

**判据**：1440 宽视口、图片全部加载后量得的 `document.body.scrollHeight` 超过 **20 000 px**（体感「一直滚鼠标要 10 秒以上」）即视为长页，必须做收纳处理。测量工具：`对话归档/temporary-tools/audit-page-lengths.cjs`（`CHROME_PATH=<chrome 路径> node …`，逐页输出 height / folds / cards / h3id / sidebar）。

**收纳口径**：**只折叠「小分类」小节（`<h3 id="…">`），绝不整卡折叠。** 与 `result` / `safety` / `model` 既有页面一致——卡片本身保持展开，卡片内的小节标题折叠。具体规则：

- 概览卡（页面最前面那张介绍卡，如 Engineering Success / Overview / Background）保持常显，读者先看到「这页讲什么」；
- 其余卡片内凡是有 `<h3 id="<页面前缀>-<语义>">` 的小节，一律交给 `section-fold.js` 折成收纳条（§5.14.2 原规范，前缀登记 `sectionIdPrefixes`）；
- **不使用整卡折叠（`data-fold-card` + `.content-body`）作为全站收纳手段**——那是 `contribution` 这类「一条内容一张卡、正文由数据渲染」页面的专用能力，`section-fold.js` 仍支持，但不在长页收纳标准里（2026-10-15 第二轮用户明确纠正：折叠应落在小分类上，而不是一整个大容器）。

`section-fold.js` 零配置接管：默认全折叠、点击标题展开/收起、URL hash 或侧边栏锚点命中自动展开（`expandForHash` 同时支持「锚点在收纳条内」与「收纳条在锚点元素内」），`SidebarProgress.recalculate()` 联动高亮。

**2026-10-15 全站实测**（1440 宽，图片加载后；仅越过 20 000 px 的页做收纳，且只折 h3 小节）：

| 页面 | 展开高度 | 折叠后高度 | 折叠数 | 形态 |
|---|---|---|---|---|
| `dry-lab/hardware.html` | 44 165 | 13 619 | 28（h3 小节条） | 概览常显 + 6 张卡内 28 小节折叠 |
| `project/engineering.html` | 20 613 | 6 394 | 24（h3 小节条） | 概览常显 + 6 个 Cycle 卡内 Design/Build/Test/Learn 折叠 |
| `wet-lab/result.html` / `safety` / `dry-lab/model` / `human-practices/sustainability` | — | 3 828–7 930 | 7–24 | 既有 h3 收纳体系 |
| `project/contribution` / `description` / `design`（16 560 / 7 882 / 8 540）及以下页面 | — | 均 < 20 000 | 0 | 不折叠（阈值以下） |

**暂不适用的页面（低于阈值或结构特殊，不要套模板硬改）**：

- `index.html`（10 887 px，幻灯式全屏分屏，每屏 100vh + 滚动驱动动画，折叠会破坏分屏叙事）；
- `human-practices/integrated human-practices.html`（14 684 px，自定义地图 / 轮播 / 专家详情体系 `hp-map.js` / `hp-flat-carousel.js` / `hp-reveal-box.js`，隐藏容器会导致几何计算失效，须与这些组件一起改造并单独回归）；
- `team/attributions.html`（7 444 px，自定义双面板 + 成员网格，无 `.content-card` 结构，折叠粒度需先定）；
- 其余页面（`notebook` 4 878 / `parts` 4 550 / `education` 4 313 / `software` 4 302 / `protocol` 2 267 / `members` 1 887 / `description` 7 882 / `design` 8 540 / `contribution` 16 560）均低于 20 000 px 判据，保持展开不折叠。

> 2026-10-20 更新：上表与清单是 2026-10-15 的快照，其中 `project/description`（当时 7 882 px）已失效——该页按《EchoYeast Description.docx》整体重写为 18 张卡 + 31 个 h3，实测全展开 **19 938 px**、全折叠 **9 881 px**，已按本节口径改为「h3 小节收纳 + 概览卡常显」，详见 §5.14.2 的同名小节。其余页面数值未变。

**验证（可复跑）**：结构层 `node 对话归档/temporary-tools/check-content-pages.js`（9 页，`折叠 === h3[id]` 必须相等、level3 无死链、id 唯一）；几何层 `$env:CHROME_PATH='…'; node 对话归档/temporary-tools/e2e-content-pages.js`（默认全折叠 / 滚动高亮 / 锚点跳转自动展开）。改造前/后逐卡文本比对脚本见 `对话归档/2026-10/2026-10-15-hardware-page/temporary-tools/verify_site_folding_text.py`。

### 5.14.5 Safety 页重建与 Hardware 页改版（2026-10-15，`REQ-20261015-004`）

**Safety 页（`src/wet-lab/safety.njk`）**按 `static/expriments/safety/Safety Revised Edition (EN) 10.12.pdf` 整体重写，取代此前中英混排的占位稿（原稿含多处 `[待补充]`）：

- 6 张内容卡：Overview / LS Risk Matrix / Laboratory Safety Environment / Personal Safety / Project Safety / References；
- 4 张表：L 分级、S 分级、风险值换算、**15 步逐项评估表（10 列）**；表格与图数据抽到 `src/_data/safety.js`；
- 5 张插图 `static/image/safety/safety-fig1~5.jpg`，由 PDF 第 9–13 页导出（原图 1725×2300，统一缩到 1100 px 宽后转 JPEG）；Figure 1 的打码说明按源稿保留为图注附注；
- 17 条参考文献，正文 `[n]` 角标可点击跳转（角标类名已于 2026-10-21 由 `.safety-cite` 统一并入 `.cite-ref`，列表类名仍为 `.safety-references`）；
- 折叠：两个 h3 小节（`safety-grading` / `safety-matrix`）带 id，由 `section-fold.js` 折成收纳条并默认折叠，与 result / model 同写法；页面展开 13 363 px，低于 20 000 px 判据，卡片本身不折叠。

**Hardware 页第二版改版**：按 `static/expriments/drylab/hardware/Hardware Wiki page content (English) 2026.10.14 (1).pdf` 更新正文——补入 `[1]–[12]` 文献引用，新增三处论述（气溶胶实测浓度与粒径 `[2]`、旋风采样在高流速下的收集损失 `[4]`、DREADD 家族与 DCZ 高亲和力激动剂 `[9][10]`），改写 Design Goals 的 Optics 条目，并新增文末 References 一节（12 条）。27 张图题注、8 张表与三份附件在新版中均未变，故图片与附件沿用不动。改版后页面 13 812 px。

**2026-10-16 追改（同日反馈）**：

- **References 不再渲染外链**：按 iGEM 要求，Safety / Hardware 两页文末参考文献只保留条目文字，`link` 字段（DOI / 官网地址）仍留在 `src/_data/*.js` 里作溯源存档，页面不输出 `<a>`。正文中的 `[n]` 角标（页内锚点跳转）保留。

**2026-10-21 引用统一（并入全站文本规范）**：

- **角标类名收敛为 `.cite-ref`**：`static/css/navigation/navigation.css` 里的 `.cite-ref` 提为全站公共类（`font-size:0.72em; vertical-align:super`），`.safety-cite` / `.hardware-cite` 两套同义写法删除，Safety / Hardware 页的角标同步改用 `.cite-ref`。
- **新增通用列表规则**：`ol.ref-list > li` 统一加 `scroll-margin-top:130px` 与 `:target` 高亮（`rgba(139,90,43,.08)`），design / model / parts / human-practices 四页的文末列表共用。
- **Design 页**：22 处裸 `<sup>n</sup>` 改为可跳转角标；原「背景段 1–5 + 方案段 1–7」两段各自从 1 开始的列表合并为全页连续编号（背景 1–5、方案 6–12），条目加 `id="design-reference-N"`。
- **Model 页**：25 条参考文献条目加 `id="model-reference-N"`，并在正文明确提到该工具/力场的句子处补 20 个角标；ChimeraX / V-rescale / Parrinello-Rahman / PME / van der Rest 5 条正文无对应陈述，不硬挂角标。
- **Human Practices 页**：8 条纯文本 `<p>[n]` 改为 `<ol class="ref-list">` + `<li id="hp-reference-N">`，正文补 3 个角标（WHO / Lewin / AlphaFold 3），其余 5 条无正文对应；排版沿用 `.hp-interview-context p` 的段落样式（新增 `.hp-interview-context ol.ref-list > li` 规则）。
- **Parts 页**：`src/_data/parts.js` 的 `references.items` 由 `{ key, text }` 改为 `{ num, text, link }`（对齐 safety / hardware），条目加 `id="parts-reference-N"`，正文补 4 个角标。
- **错链修复**：Safety 页原 `[4]`（纳米抗体识别域）误指向 `#safety-reference-6`、两处 `[1]` 误指向 `#safety-reference-2`、6 处角标缺 `href`；Hardware 页 3 处角标 `href` 为损坏字节（`\x000\x00`）。已按显示号对齐目标号。
- 细则与模板见 `docs/design-system/text-standards.md`。
- **收纳条背景铺满修复（全站组件级）**：全局 `.content-card h3` 自带背景条，h3 在 summary 里改为 `inline-block` 后背景条缩到文字宽度。修复方式是把条状样式（背景 / 左边框 / 内边距）从 h3 上移到 `summary`，并在 `section-fold.css` 里把 summary 内的 h3 清成纯文字——result / safety / model / hardware / engineering 所有使用收纳条的页面同时受益，实测 summary 宽度与卡片内容宽一致（1440 宽下无截断）。

### 5.14.6 正文顶沿吉祥物装饰（2026-10-17）

除首页外 14 个内容页在正文模块顶沿挂一只 Echo 插画，取自 `static/image/any-icon/extension/Echo.docx` 的逐页方案，表现为「上半身露在卡片外、下半身压在卡片框沿上」。`team/members` 是三栏交互布局、没有正文容器，按要求不采用。

**资源**：`static/image/any-icon/extension/<页面名>.png`，文件名为页面名（`description` / `design` / `engineering` / `contribution` / `attributions` / `model` / `hardware` / `protocol` / `results` / `parts` / `safety` / `notebook` / `human-practices` / `sustainability`；`members.png` 已按同一规则备好但不使用）。2048×2048 原稿按 alpha 包围盒裁剪后等比缩到 440 px 宽（合计约 2.5 MB，未剪原稿备份在 `对话归档/2026-10/2026-10-17-page-mascot/originals/`），PNG 格式与透明通道不变。

**组件**：`static/css/components/page-mascot.css`，由 `head.njk` 全站加载（带 `?v=` 版本串避免样式缓存），**零 JS**。页面侧只写四行，且必须写在**第一张内容卡内部的最前面**：

```html
<div class="content-card">
  <figure class="page-mascot page-mascot--<页面名>" aria-hidden="true">
    <img src="../static/image/any-icon/extension/<页面名>.png" alt="" width="440" height="<真实高度>"
      loading="lazy" decoding="async">
  </figure>
  …
</div>
```

**父元素就是内容卡，这是对齐的唯一依据**：`position: absolute` 的 `top: 0` 落在卡片的 padding box 顶沿（卡片边框内侧），因此卡片自身的 `margin`（如 HP 页卡片的 `32px 0`）、外层容器有没有 hero / slide / 内边距，都不会把装饰推偏。`.content-card:has(> .page-mascot)` / `.section:has(> .page-mascot)` 只给承载装饰的那张卡补 `position: relative`，不动其它卡片。

**变量化的尺寸与留白**：`:root` 里 `--page-mascot-height: clamp(132px, 12.5vw, 200px)`、`--page-mascot-gap: 1.5rem`、`--page-mascot-reserve: calc(var(--page-mascot-height) * 0.88 + var(--page-mascot-gap))`。三个变量同时决定装饰高度与容器顶部留白，改一处即可整站等比缩放。

**视觉与层级**：`transform: translateY(-88%)` 让上面 88% 悬在卡片外、下面 12% 压在卡片顶沿上；`z-index: 3` 高于卡片内容，装饰完整可见不被裁切，是「压在框沿前面」而不是「藏进框里」。卡片顶部内边距（通常 32 px）大于 12% 压边量，不会压住标题或正文。

**多分辨率不漂移**：装饰高度与留白取同一个 `--page-mascot-height`，因此任何视口下装饰顶边与导航底边的间隙恒为 `--page-mascot-gap`（1100 / 1280 / 1440 / 1680 / 1920 五档实测都是 24–25 px），底部压边量按高度等比（18–26 px），既不上撞导航，也不与卡片脱开。

**各页落位**：

| 页面 | 承载装饰的卡片 |
|---|---|
| description / design / engineering / contribution / model / hardware / protocol / result / safety / notebook / sustainability | 页面第一张 `.content-card`（contribution 在 `{% for %}` 里用 `{% if loop.first %}` 只给首张卡） |
| `wet-lab/parts` | `.content-card.parts-summary`；`.parts-hero` 补 `padding-right` 防压字 |
| `team/attributions` | 首个 `.section`（`#team-contributions`），装饰落在标题区下方的正文卡上 |
| `human-practices/integrated human-practices` | 只在 `#section-overview.content-card` 挂一只（页面最上面那只），其余 section 不挂 |

**逐页人工校准**：`top` 以内容卡顶沿为基准，`0` = 装饰底沿压住卡片 22 px，±1 px 即同量位移；正值下沉、负值悬空。`right` 按每张插画的构图左右错落（道具偏左的图离右缘远一些，主体偏右的图贴近右缘），避免整站装饰全挤在同一条线上。

| 页面 | `top` | `right` |
|---|---|---|
| description | `3px` | `1.5rem` |
| design | `52px` | `2.5rem` |
| engineering | `3px` | `3.5rem` |
| contribution | `92px` | `3rem` |
| attributions | `-18px` | `3rem` |
| hardware | `-22px` | `4.5rem` |
| protocol | `-24px` | `4rem` |
| result | `54px` | `2rem` |
| parts | `31px` | `2.5rem` |
| safety | `44px` | `1.5rem` |
| notebook | `32px` | `3rem` |
| human-practices | `79px` | `2rem` |
| sustainability | `70px` | `3rem` |
| model | 沿用通用默认 | 沿用通用默认 |

**窄屏**：≤1024 px 时侧边栏改为上下堆叠、卡片上方没有可用留白，`.description-container` 内的装饰 `display: none` 且容器 `padding-top` 归零；无侧栏的 Parts / Attributions 在 ≤900 px 把 `--page-mascot-height` 降到 96 px，留白随变量自动收窄。

**验证**：`对话归档/temporary-tools/2026-10-17-check-mascot2.cjs`（16 页：装饰父元素均为 `content-card` / `section`、卡片 `position: relative` 且 `overflow: visible`、图片 `naturalWidth = 440`、压边量 18–26 px、`z-index: 3`、console 与 HTTP 零错误、Members 与首页 0 个装饰）与 `2026-10-17-measure-mascot.cjs`（五档宽度量 navGap / 压边量）；截图在 `对话归档/2026-10/2026-10-17-page-mascot/screenshots/`。当时只落了根站，flask 官方站未同步。

### 5.14.7 Attributions 页重构（2026-10-18，`REQ-20261018-001`）

Attributions 页按队伍填报的四份 attribution docx（`static/data/attribution/Team Members.docx`、`AI Tools Use.docx`、`third-party resources.docx`、`External Contributions.docx`）与 `project-timeline.png` 整体重写，**章节顺序与官方 attribution 表单一致**，不套用 §5.14.2 的 `.content-card` + 侧边栏体系（本页用 `.section` + `.jump-to-nav` + 页内 scrollspy）：

| 序 | 章节 | 锚点 | 内容来源 |
|---|---|---|---|
| 01 | Team Member Contributions | `#team-contributions` | Team Members.docx（17 人：2 PI、1 学生负责人、11 学生、3 顾问） |
| 02 | AI Tools | `#ai-tools` | AI Tools Use.docx（8 个工具，DeepSeek 分 Wet lab / Dry lab / Wiki / Writing 四块） |
| 03 | External Contributions | `#external-contributions` | External Contributions.docx（25 条）+ third-party resources.docx 的建模软件 9 条 + 站内前端库 4 条 = 38 条，按 External Advisor / Collaborator / Other / Sponsor 分组过滤 |
| 04 | Project Timeline | `#timeline` | project-timeline.png（5 个阶段、真实起止日期、日历周数与实际投入周数） |

- **数据源**：全部内容抽到 `src/_data/attribution.js`（成员、任务字典 `taskDefs`、AI 工具、外部贡献、时间线），模板只做循环；新增/修改内容改数据文件，不动 `.njk`。原 `modelStack` / `codeLibraries` / `wetLabPlatforms` 三组数据已删除（内容并入 `external`），`access` 字段亦已删除。
- **无标题区、无编号、无装饰图标（2026-10-18 用户口径）**：页面顶部不渲染 `h1` 视觉标题、副标题、导语与统计卡片，只保留 `<h1 class="sr-only">` 供读屏；各章节标题不挂 `01`–`05` 编号（`.jump-to-nav` 按钮上的序号保留）；正文内**不使用任何 iconfont 图标**（跳转按钮、章节标题、致谢横幅、时间线行首全部为纯文字）。
- **不设说明框**：成员区末尾的「Cross-Module Collaboration」与 AI 区的使用声明两个橙色说明框已删除（用户口径：不需要这两段说明）；页面只保留外部贡献末尾的 Special Acknowledgments 一条横幅，文案覆盖**人、团队、赞助方、工具**四类对象。
- **成员卡片无占位**：无任务/无具体贡献的成员（Zhen Gao）只渲染首字母头像、姓名与 `Advisor` 徽章，不再输出「no individual tasks were listed」占位句，也不再显示空的模块焦点标签；`.members-grid` 改为 `align-items: start`，卡片按内容高度收拢。
- **外部贡献只能用官方枚举（2026-10-18 定版，不得自造值）**：
  - `Institution Type`：`Academic` / `Nonprofit` / `Industry` / `Government` / `Other`（Other 需在 Specific Tasks 说明）。
  - `Relationship to the Team`：`Collaborator` / `Contractor` / `Sponsor` / `External Advisor` / `Other`（Other 需在 Specific Tasks 说明）。
  - 当前分布：External Advisor 10 / Collaborator 6 / Sponsor 2（SZPU、School of Food and Drug，资金与实物支持）/ Contractor 18（数据库、建模软件、前端库——按「provides services requested by the team」归类）/ Other 2（Shanshan Lu、Ran Liu）= 38 条；机构类型 **Academic 16 / Industry 5 / Government 3 / Other 14**。筛选按钮：All Contributions、External Advisors、Collaborators、Contractors、Sponsors、Other。
  - 机构类型口径（2026-10-18 定版）：人/机构按真实属性——Wenjie Wang、Manqing Deng、NCBI 为 `Government`，Xiaolong Liu、Rongkang Deng 为 `Industry`，其余个人与学校/学院/队伍为 `Academic`。工具类：**商业公司产品记 `Industry`**（Benchling、SnapGene–GSL Biotech/Insightful Science、PyMOL–Schrödinger），**高校或开源项目记 `Other`**（SGD、CRISPOR、ClusPro、HADDOCK、CHARMM-GUI、OPM/PPM、GROMACS、gmx_MMPBSA、SPICE、ChimeraX、3Dmol.js、Chart.js、Bootstrap、FlexSearch），`Other` 的说明由各条 Specific Contributions 正文承担。
  - 曾自造的 `Tools` 关系与 `Community` / `Government (Industry)` 机构类型已全部归一到上表。
- **AI 工具不得出现在 External Contributions**：AlphaFold2（含 ColabFold 1.6.2）与 DeepSeek 只出现在 `#ai-tools`，外部贡献里不重复；`third-party resources.docx` 的「计算环境」条目（WSL 2 / Anaconda / RTX 4070 Ti）属团队自有基础设施，未列入贡献。
- **CodeBuddy 回到 `#ai-tools`（2026-10-18 末轮，依 iGEM 规则）**：iGEM 明确「AI tool use 不在 External Contributions 表内、另有单独表」，故 CodeBuddy 不再登记为外部贡献；AI 章节标题按用户口径为 **AI Tools**（不是 AI-Assisted Tools），共 9 个工具。
- **AI 卡片不写 Verification 行（2026-10-18 用户口径）**：曾加过 9 条 `Verification` 小字（`.ai-verify`），已从页面与 `AI Tools Use.docx` 一并撤除。官方表单要求写「团队如何复核输出」，提交表单时另行填写。
- **iGEM & Partner Offers 表不单列**：用户确认五项（Distribution Kit / IDT / Twist / GenScript / Anthropic）一个都没用到，页面不设该章节。
- **AI 卡片不显示获取方式**：`access` 字段（Web / API / Local deployment）已从数据与模板移除。
- **时间线**：轴为 2025-10 → 2026-11 共 14 个月列，条形 `left/width` 由 `axisPercent()` 按「月索引 + 月内日比例」算出，与月份刻度严格对齐；点击条形弹出起止日期、日历时长、实际投入与阶段说明，页末另有五阶段汇总表（窄屏横向滚动）。
- **筛选**：成员按 `data-role`（pi / leader / student / advisor），外部贡献按 `data-rel`（relationship）。`static/js/pages/attributions.js` 的 `ScrollSpy` 已登记四个 section id。
- **样式坑（已修）**：`static/css/mobile.css` 里给 `team/members` 写的 `.member-avatar` / `.member-info`（`margin-top: 8.75rem`）会串到本页，`attributions.css` 末尾用 `.attributions-container .member-avatar` / `.member-info` 做隔离；`.acknowledgment-banner` 此前**完全没有样式**，本轮补齐；`navigation.css` 的 `body:not(.home-page) main { padding-top: 6.25rem }` 优先级高于 `.attributions-main`，顶部间距改用 `body:not(.home-page) main.attributions-main` 覆盖。
- **未迁**：flask 官方站仍是旧版 attributions 页，需按根站产物重新迁移（用户口径：先外部站、视觉通过后再迁）。
- **验证**：`npx @11ty/eleventy` 通过；1440 / 768 / 480 三档无横向溢出；本地静态资源全 200；console 0 错误；筛选、任务标签悬浮说明、条形详情面板实测可用；正文内 iconfont 计数 0（剩余均为全站页头/页脚组件）。截图与交付文档见 `对话归档/2026-10/2026-10-18-attribution-rebuild/`。
