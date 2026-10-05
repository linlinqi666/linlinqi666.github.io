# REQ-search-framework-flexsearch 全站搜索框架升级

## 目标

将全站搜索从“朴素 `includes` 子串匹配”升级为 FlexSearch 关键词智能检索，并接构建期钩子
实现“改页面即自动更新索引”。解决三痛点：① 匹配笨（无评分 / 分词）② 不自动更新 ③（PDF 暂缓）。

## 范围（本次）

- 引入 FlexSearch 前端库（vendor 文件，两站各一份）
- 两站 generator 输出加顺序 `id` 字段（records 结构不变，向前兼容）
- 重写 `search.js`：FlexSearch Document 索引 + `Intl.Segmenter` 中文分词 +
  BM25 评分 / 字段权重（title 优先）/ 模糊 / 前缀 + 保留结果分组与高亮
- 构建期自动更新：11ty `eleventy.after` + flask `freeze_cmd` 调 generator
- 两站模板在 `search.js` 之前加载 flexsearch vendor

## 非范围（本次）

- PDF 文本索引（暂缓，预留 records 结构）
- 语义向量搜索
- 跨语言 embedding

## 验收标准

1. `npm run build:all` 后根站 `search-index.json` 自动含 `id`，无需手动 `node` 命令
2. `flask freeze` 后索引自动重建，无需手动 `python` 命令
3. 中文查询（如“流感”“酵母”）能命中相关 chunk 并按相关度排序
4. 英文前缀 / 模糊（如 `yeas` → yeast）可命中
5. 移动端（375×667）搜索面板可用，查询延迟可接受（页面量小）
6. 结果高亮与分组渲染保持现有行为
7. 两站索引结构一致、FlexSearch 逻辑一致

## 影响文件

- 新增：两站 `static/js/vendor/flexsearch.min.js`
- 改：根站 `static/js/core/search-index-generator.js`、flask `tools/search_index_generator.py`（加 `id`）
- 改：两站 `static/js/core/search.js`（FlexSearch 化）
- 改：根站 `src/_includes/layouts/base.njk`（或 head）加载 vendor；flask `wiki/layout.html` 加载 vendor
- 改：`.eleventy.js`（eleventy.after）、`app.py`（freeze_cmd）

## 实施记录（2026-10-04）

### 改动文件
- 新增两站 `static/js/vendor/flexsearch.bundle.min.js`（v0.7 bundle，含 Document 模式，51KB）
- 两站 `static/js/core/search.js`：重写为 FlexSearch Document 索引 + 自定义 `encodeTokens`
  （英文/数字整词 + 中文逐字，配合 `tokenize:'forward'` 前缀匹配）+ 评分/字段权重
  （title 优先）+ 保留结果分组与高亮；FlexSearch 未加载时降级为朴素 `includes`
- 两站 generator：records 加顺序 `id`（根站 push 时 `id: records.length`；flask `main` 末尾 `rec["id"]=idx`）
- 根站 `.eleventy.js`：加 `eleventyConfig.on('eleventy.after', …)` 自动重建索引
- flask `app.py` 的 `freeze_cmd`：`freezer.freeze()` 后 `subprocess` 调 `tools/search_index_generator.py`
- 两站模板（根站 `base.njk` / flask `layout.html`）在 `search.js` 前加载 flexsearch vendor

### 验证
- 根站：删 `search-index.json` 后仅 `npx @11ty/eleventy` 自动重建（709 条，含 `id`）→ 钩子生效
- flask：`flask freeze` CLI 触发 `freeze_cmd` 自动重建（`public/` 596 条，含 `id`）
- 搜索逻辑（node 临时脚本）：`流感`/`酵母`/`安全` 中文逐字命中；`yeast` 整词、`yeas` 前缀同结果命中；
  `疫苗` 空（页面无该词，正常）
- vendor 部署：根站 `static/`、flask `static/` 与 `public/static/` 均就位；两站产物页面均引用 vendor（在 search.js 前）

### 推送清单指引
- 需推送（flask）：`static/js/vendor/flexsearch.bundle.min.js`、`static/js/core/search.js`、
  `tools/search_index_generator.py`、`wiki/layout.html`、`app.py`
- 不推送（根站同步）：`.eleventy.js`、`static/js/core/search-index-generator.js`、
  `static/js/core/search.js`（同份）、`src/_includes/layouts/base.njk`、
  `static/js/vendor/flexsearch.bundle.min.js`

## 关联

- 决策：`Decisions/DEC-2026-10-04-search-framework.md`
- 当前推送清单：`对话归档/plans/2026-10/2026-10-03-next-push-checklist.md`
