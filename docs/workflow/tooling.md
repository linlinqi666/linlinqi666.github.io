# 工程化脚本统一工具

> 本文件由根目录 `README.md` 分册而来（2026-10-17）。内容未做改写，
> 仅按主题归位；与 `README.md` 冲突时以 `README.md` 的红线章节为准。

## 十三、工程化脚本统一工具（tools/normalize-scripts.js）

为消除手工维护 18 个页面脚本顺序/路径的出错风险，项目引入零依赖 Node 脚本 `tools/normalize-scripts.js`，统一所有页面的外部脚本加载方式。另有一同属工程化的 `tools/inject-search.js`（历史脚本，负责批量注入导航搜索按钮与 `search.js`/`search-index.js` 引用，2026-08-26 索引重构为 `search-index.json` 后已弃用，见第七.11）；两者均须从 `tools/` 目录运行，不得放回仓库根。

**它做什么：**
- 移除每个页面里散落的外部 `<script src>`（无论位于 `<head>` 还是 `</body>` 前），重新按固定顺序写入 `<head>` 并加 `defer`：`utils.js` 最先，其次 `sidebar-progress.js`（仅内容页），随后四个核心行为脚本，最后按文件名追加页面/组件脚本（`hp-carousel.js` / `hp-reveal-box.js` / `members.js` / `attributions.js` / `executive-summary-animation.js`）。
- 将原先位于外部脚本块之后、依赖 `PageProgressBar` 的页尾内联脚本 `new PageProgressBar().startAutoProgress();` 自动包裹进 `DOMContentLoaded` 监听，确保 defer 脚本先于其执行（否则 defer 延后会导致 `PageProgressBar is not defined`）。
- 幂等：可重复运行；路径与顺序由文件名规则生成，不依赖现有（可能被手改坏的）`src` 字符串。

**用法：**
```powershell
cd "f:\IGEM\SZPU-2026 wiki"
npm run normalize        # 等价于 node tools/normalize-scripts.js
```

**约束：** 新增页面请从第九节模板复制（脚本已在 `<head>` 内），不要再把 `<script>` 堆到 `</body>` 前；若需增删某页脚本集合，改 `tools/normalize-scripts.js` 内的 `scriptsFor()` 规则后重跑即可，不要在页面里手动改。

> **2026-08-07 路径修正：** `scriptsFor()` 中的组件路径已从错误的 `static/components/*` 改为 `static/js/components/*`，`executive-summary-animation.js` 改由 `comp('executive-summary-animation.js')` 生成（原为 `core('core/...')` 的 404）。重新运行 `npm run normalize` 现在会产出正确路径；请勿再改回。

---
