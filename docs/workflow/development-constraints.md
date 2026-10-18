# 未来开发约束规则

> 本文件由根目录 `README.md` 分册而来（2026-10-17）。内容未做改写，
> 仅按主题归位；与 `README.md` 冲突时以 `README.md` 的红线章节为准。

## 八、未来开发约束规则（必须遵循）

以下是硬约束，**任何新增或修改都不得违反**：

1. **CSS 加载顺序：** 每个页面必须包含五大共享 CSS，且顺序为 `navigation.css → index.css → [页面/description].css → mobile.css → components/*.css`；**`mobile.css` 必须最后**，以保证响应式覆盖生效。
2. **JS 加载位置与顺序：** 所有外部脚本统一置于页面 `<head>` 并以 `defer` 加载（不阻塞渲染、DOM 解析后按文档顺序执行）；`core/utils.js` 必须最先。组件/页面脚本只在对应页面加载，不得全局强加；依赖已加载脚本的页尾内联脚本须包裹进 `DOMContentLoaded`（由 `tools/normalize-scripts.js` 自动处理）。
3. **统一内容页模板：** 新增内容页必须采用标准结构——加载 `description.css`、包含 `<aside class="description-sidebar">`、加载 `sidebar-progress.js`，并复用 `--desc-*` 令牌与现有组件类，**不要凭空发明新结构**。
4. **色彩只能来自令牌：** 所有颜色必须使用 `:root` 中的令牌（`--color-*` 或 `--desc-color-*`）。**禁止在业务样式中硬编码十六进制色值**；蓝色仅用于链接、绿色仅用于成功/高亮，不可作为主色扩散。
5. **保持米黄/棕主题：** 主色固定米黄/奶油（`#FFF8E7` / `rgba(252,231,203,0.9)`），辅色固定暖棕 `#8B5A2B`，蓝色仅用于 footer；禁止引入新的主色/辅色或额外的字体族；字体栈保持 `system-ui` 体系。
6. **间距/圆角/阴影/动效复用令牌：** 必须使用 `--spacing-*`、`--radius-*`、`--shadow-*`、`--duration-*`、`--ease-smooth`，禁止随意写死像素数值或使用非标准缓动。
7. **图片必须可寻址：** 引用前确认文件存在于 `static/image/`（子页用 `../` 前缀），并为 `<img>` 保留 `onerror` 兜底。
8. **保留占位文件：** 不要删除任何专属 CSS 文件（即使是空占位），HTML 仍引用它们。
9. **全局组件不可删：** 顶栏、两条进度条、`nav-scroll-behavior.js` 是全局基础设施，删除会破坏全站一致性与阅读体验。
10. **尊重关键令牌注释：** `description.css` 中标注"不可改 / 由 navigation.css 接管"的令牌（侧边栏 sticky 定位、烧瓶进度因子、浮动装饰层级等）严禁改动。
11. **JS 模块化：** 新脚本以 IIFE/命名空间封装，避免全局污染，且不依赖 `utils.js` 之外的加载顺序。
12. **动效克制：** 新增动效须柔和、复用标准时长与 `--ease-smooth`，避免过长或突兀效果。
13. **对话产物隔离（最高优先级红线）：** 对话/工具产生的任何额外文件（截图、导出、报告、工具日志、临时调试脚本、测试页、误生成文件夹等），必须在生成当次立即移入 `对话归档/` 对应子目录，并确保 `.gitignore` 已覆盖；绝不允许留在仓库根目录或业务目录。提交前务必 `git status` 复查（详见第十一节）。

14. **脚本路径必须真实存在：** 所有 `<script src>` 指向的文件必须位于磁盘（组件在 `static/js/components/`、核心在 `static/js/core/`、页面在 `static/js/pages/`）。改动路径后须用 `npm run normalize` 重新生成并本地起服务验证无 404（历史教训见七.8）。
15. **滚动监听必须节流：** 任何 `scroll` 监听须用 `utils.rafThrottle` 或单 rAF 合并 + `passive:true`；**禁止在滚动回调中同步读取布局**（`getBoundingClientRect`/`offsetTop`/`clientHeight` 等），应在 init/resize 时缓存偏移，滚动期只做样式写入（见十四.3）。
16. **禁止永久 rAF 循环：** 动画/轮询类逻辑（如 3D 圆环）必须在达到目标态后停止 `requestAnimationFrame`，仅在交互时重启；不得每帧无条件重写 transform（见十四.3）。
17. **大体积数据脚本不得阻塞首屏：** 索引/数据类脚本（如 `search-index.json`）一律按需懒加载（同源 `fetch()`），禁止在 `<head>` 内同步加载（见十四.3）。
18. **谨慎使用高成本 CSS：** `backdrop-filter`、`filter:blur`、`position:fixed` 全屏层、过多/过大 `box-shadow` 会显著增加绘制与合成开销；`will-change` 仅作临时提升并尽快释放，不要永久堆在大量元素上；无限 `@keyframes` 动画须离屏暂停（`IntersectionObserver` 设 `animation-play-state:paused`）或尊重 `prefers-reduced-motion`。
19. **性能预算：** 单页并存独立 `scroll` 监听不超过必要数量；新增持续动画前先评估其合成/绘制成本，长页面尤甚。
20. **页面只呈现已得结果，冲突与审核事项写进代码注释（2026-09-26）：** 内容页正文只写已得结果与对应数据，不写进度、待办、自我审核或"还需核对"类陈述；跨源冲突、单位口径、归一化缺口等一律写入**模板源码的 HTML 注释**（构建后保留在页面源码中，读者不可见）。`在途与下一步`、`原始数据` 这类收尾节不进页面。一切审核与结论交由实验组，页面不作自我判定。当前实例：`src/wet-lab/result.njk` 页首的 `RS-1…RS-8` 注释块。
21. **进度/状态与官方对照内容一律不渲染（2026-09-16，最高优先级）：** 页面上不得出现任何实验进度状态（Progress Status、进度汇总表、✅/🔄/⏳、status-badge 徽章、"已完成/进行中/待进行"类字样）与"官方要求项 → 落实方式"对照表（iGEM Check 自检内容）。此类信息只允许三种去处：① 源码 HTML/JS 注释；② `对话归档/` 计划文档；③ 本 README 第七.18 警告区。实验页与贡献页已按此清理，后续新增内容必须遵守；对外页面没有资料的条目直接留空。
22. **菌种拉丁名必须斜体（2026-10-11，全站标准 + 迁移标准）：** 正文/图注/数据中出现酿酒酵母拉丁名 `Saccharomyces cerevisiae` 及其缩写 `S. cerevisiae` 时，必须渲染为斜体（HTML 用 `<i>` 或 `<em>`）；菌株号（如 `S288C`、`BY4741`）保持正体不斜体。此规则优先级高于"原样照录"，适用全站所有内容页与 `_data` 数据文件（数据字段若渲染纯文本需加 `| safe` 才能使其内 `<i>` 生效）。**迁移到 flask 时同样必须保留 `<i>` 斜体**，不得把拉丁名压平为纯文本；igem-wiki-migration-guard 校验应把"拉丁名未斜体"列为问题。
23. **侧栏分级目录必须限制最大高度，酵母发酵罐进度容器常驻可见（2026-10-11）：** 含左侧分级目录（`.description-nav`）与酵母发酵罐进度容器（`.progress-section` / `<!-- 发酵进度容器 -->`）的内容页，侧栏 `.description-sidebar` 必须 `position: sticky` 且锁定 `max-height: calc(100vh - 12rem); overflow: hidden`；其内部 `.description-nav-wrapper` 用 `flex: 1 1 auto; min-height: 0; overflow-y: auto` 自行滚动，`.progress-section` 用 `flex: 0 0 auto` 固定在侧栏底部。某页 TOC 条目过多时只允许目录内部滚动，**绝不允许把发酵进度容器顶出视口下方**。该规则已写入 `static/css/navigation/navigation.css`（通用，覆盖全站），`static/css/contribution.css` 的 `.contribution-page` 作用域版本须与之同步。
24-b. **页面可见内容一律英文——全站硬约束（2026-10-15，用户明确）：** 页面上不得出现中文，范围包括正文、标题、
   按钮/导航/侧栏标签（含进度容器 `Fermentation Progress`）、图注、`sr-only` 文本、`<title>`，以及会被读取或被脚本
   消费的 `alt` / `aria-label` / `data-title` / `data-hp-title` 等属性（`data-hp-title` 由 `hp-flat-carousel.js` 读取，
   属运行时可见，优先级等同正文）。中文只允许出现在三处：① 源码注释（`<!-- -->`、`{# #}`、CSS/JS 注释）；
   ② `对话归档/` 下的文档；③ README 与规范文件。
   **判据**：把产物源码中的注释、`<script>`、`<style>` 剥离后不应再匹配到任何 CJK 字符（`[\u4e00-\u9fff]`），
   并对属性值单独扫一遍（脚本 B 类）。**检查范围以"现在还有源（permalink）的页面"为准**——删源后遗留的产物属孤儿，
   一律删除（2026-10-15 已删 `dry-lab/software.html`、`human-practices/education.html`；排查脚本
   `对话归档/temporary-tools/2026-10-15-find-orphans.py`）。
   自检脚本 `对话归档/temporary-tools/2026-10-15-cjk-scan.py`（A 类=可见文本、B 类=属性、C 类=注释仅计数），
   报告存 `对话归档/logs/2026-10/2026-10-15-cjk-report.txt`。
   **2026-10-15 已清**：共享组件 6 处 `aria-label`（覆盖全站 96 处）、首页 `data-title`×10 + `alt`×9、
   集成式 HP 页 `data-hp-title`×4、7 处侧栏进度标签、首页 `<title>` 与 `sr-only` h1、页脚 Attribution 4.0 超链接。
   **当前未清项（均为未成稿内容，成稿即英文，不计为新增违规）**：① `contribution` / `description` / `safety` / `parts`
   四页仍是中文草稿（用户 2026-10-15 明确：成稿时自会用英文）；② `team/attributions` 的中文占位符 `[待补充 - 姓名/机构]`
   待团队填真名；③ `wet-lab/result` 的图 22–25 四条中文图注（英文译稿待团队确认）；④ `dry-lab/hardware` 仍在改版中。

24. **禁止擅自转码：素材一律保持原始格式与原始文件名（2026-10-11，用户明确；优先级最高）：** 任何图片/动画素材必须以**原始格式、原始文件名**使用与投放，**不得为压缩体积或"性能优先"擅自转码**（PNG→WebP、PNG/JPEG→AVIF、GIF→WebP 等）或改名。需要控体积时**只允许降质量 / 降尺寸并保持原格式**（且需说明参数与前后体积）。关键机制：iGEM `static.igem.wiki` 上传器**会自行把 png/jpeg 落地为 `.avif`**（实测：上传 `eng-chassis-fig01.png` → CDN 得到 `eng-chassis-fig01.avif`，尺寸与 alpha 完全保留），**所以本地无需转码，页面引用按上传器产物写 `.avif` 即可**。**本条优先级高于 README 中任何"优先使用 WebP/AVIF""照片统一 webp"类表述及 `.codebuddy/rules/` 中的同类表述**；冲突时一律以本条为准。反面案例（2026-10-11）：把 `Result(2).doc` 解包出的 PNG 擅自转成有损 `webp`（`quality=85`）写入上传暂存区，造成画质损失——已全部改回原始格式（20 个 `.png` + 1 个 `.jpeg`）。

---
