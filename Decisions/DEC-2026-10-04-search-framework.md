# DEC-2026-10-04 全站搜索框架升级选型

- 日期：2026-10-04
- 提出：用户（讨论后拍板）
- 议题：现有全站搜索“笨”（朴素 `includes` 子串匹配）、不索引 PDF、不自动更新，需更智能框架
- 现状：根站 `static/js/core/search-index-generator.js`（Node + linkedom，手工 `PAGES` 列表）
  与 flask `tools/search_index_generator.py`（Python 标准库）各自生成 `search-index.json`；
  前端 `search.js` 用 `content.includes(q)` 子串匹配，无评分 / 分词 / 模糊 / 锚点。

## 决策

1. **搜索引擎：FlexSearch**（Document 模式 + BM25 评分 + 字段权重 `title` 优先 + 前缀 / 模糊匹配）。
   一次性解决三痛点，且两站可共用同一份 `search-index.json` 与同一份前端查询逻辑。
2. **中文分词：浏览器端 `Intl.Segmenter('zh', {granularity:'word'})` 自定义 encode**（FlexSearch）。
   generator 仅给每条 record 加顺序 `id`；旧浏览器降级为逐字 n-gram。
   ——理由：flask 生成器硬约束“纯 Python 标准库、无第三方依赖”，无法用 jieba；
   把分词放浏览器端，两站 generator 改动最小且索引结构完全一致。
3. **自动更新：构建期钩子**。
   - 根站：11ty `eleventy.after` 钩子里执行 `node search-index-generator.js`。
   - flask：`freeze_cmd` 在 `freezer.freeze()` 之后调用 `search_index_generator.main()`。
4. **PDF 索引：暂缓**（当前仓库 0 个 PDF）。generator 保持 records 结构可扩展，
   后续接入 `pdfjs-dist` 抽文本即可，本次不实现。

## 否决项与理由

- 语义向量 transformers.js：模型 3–6MB、首访慢、评审弱网 / 旧设备风险高；当前页面量小收益有限。
- Lunr.js：中文分词弱于 FlexSearch。
- 服务端 whoosh / sqlite FTS：根站纯静态无法用，破坏两站同步。
- 仅补 PDF + 自动更新不动引擎：用户选定换引擎路线。

## 影响范围

- 引入 `flexsearch.min.js` 到两站 `static/js/vendor/`（前端运行时，纯 JS，不依赖 Node）
- 两站 generator 仅给 records 加顺序 `id`
- 重写两站 `search.js`：FlexSearch 建索引 + 查询 + 保留高亮 / 分组渲染
- 两站模板在 `search.js` 之前加载 flexsearch vendor
- 改 `.eleventy.js`（eleventy.after 钩子）与 `app.py`（freeze_cmd 调 generator）

## 验证方式

- 根站 `npm run build:all` 后 `search-index.json` 自动含 `id`，无需手动 `node` 命令
- flask `flask freeze` 后索引自动重建，无需手动 `python` 命令
- 中文查询（如“流感”“酵母”）按相关度命中；英文前缀 / 模糊（yeas→yeast）命中
- 移动端（375×667）搜索面板可用；结果高亮与分组保持现有行为
