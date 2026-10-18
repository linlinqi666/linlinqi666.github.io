# 性能分析与优化

> 本文件由根目录 `README.md` 分册而来（2026-10-17）。内容未做改写，
> 仅按主题归位；与 `README.md` 冲突时以 `README.md` 的红线章节为准。

## 十四、性能分析与优化（2026-08-07）

> 本节记录全站卡顿的多维度定位、已实施的优化（均维持原有视觉效果）与未来性能预算。相关代码改动见第七.8–10、第五.10 与 `tools/normalize-scripts.js`、`static/js/components/sidebar-progress.js`、`static/js/hp-timeline-3d.js`、`static/js/components/executive-summary-animation.js`。

### 14.1 现象与定位

站点普遍反馈滚动/交互卡顿。定位手段：逐文件审查全部 JS 组件的实现原理，并对 `static/css/` 全量 CSS 做渲染性能审计（关注 `backdrop-filter`、`filter:blur`、`will-change`、无限动画、大 `box-shadow`、`position:fixed` 全屏层）。同时核对了每个页面实际加载的脚本路径，发现多处 404 与一处首屏阻塞。

### 14.2 多维度分析

**1) 关键渲染路径 / 资源加载维度**
- 多处脚本路径错误导致 404：`static/components/*`（应为 `static/js/components/*`）、`executive-summary-animation.js` 写成 `static/js/core/*`。后果是 `sidebar-progress.js`、`hp-reveal-box.js`、`executive-summary-animation.js` 在相关页面静默失效——侧边栏烧瓶进度与 TOC 高亮不工作、HP 揭示盒无响应、首页酵母浮动/打字机/滚动渐入不运行。
- 原 `search-index.js`（约 189KB）在每个页面 `<head>` 内同步加载，阻塞 HTML 解析与首屏渲染（LCP 明显变慢）；现已重构为 `search-index.json`（约 217KB）经 `fetch()` 按需加载（见第七.9），不再阻塞首屏。

**2) JS 渲染线程 / 事件监听维度**
- 内容页并存 3~4 个独立 `window` `scroll` 监听（nav / page-progress / scroll-progress / sidebar），各触发自身 rAF；attributions 页更多（再加 Tooltip、ScrollSpy）。每帧最多数个 rAF 回调。
- `sidebar-progress.js` 原实现每帧对全部 section 调用 `getBoundingClientRect()` 并与样式写入交错，造成**强制同步布局（layout thrash）**，长内容页尤为明显——这是内容页卡顿的主因之一。
- `scroll-progress-bar.js` 原 `calculateProgress()` 每帧调用 `getClientHeight()` + `getScrollHeight()`（读 `documentElement.scrollHeight/offsetHeight/clientHeight`），与每帧 `style.height` 写入交错形成**强制同步布局**；这些尺寸在滚动期恒定，本应缓存。`wet-lab/notebook.html` 内联 `updateNavHighlight` 同理每 100ms 对全部 `section` 调 `getBoundingClientRect()`，是 log 页滚动卡顿主因。
- `hp-timeline-3d.js` 原 `render` 以 `requestAnimationFrame` **永久循环**，即使圆环已静止也每帧重写所有卡片 `transform`，持续占用主线程（该脚本当前未被任何页面引用，属隐患）。
- `wet-lab/notebook.html` 的内联滚动高亮、各页 `scroll-progress-bar` 等"加了很多 JS"后，多个独立 `scroll` 监听叠加，任一在回调中同步读布局即放大为持续重排——这是"加了很多 js 开始卡"的直接机制。

**3) CSS 合成与绘制维度**
- `nav` 的 `backdrop-filter: blur` 在滚动时强制对背景内容做模糊重绘（fixed 全宽条带，开销持续）。
- 首页 8 个酵母 SVG 常驻 `will-change: transform` + 无限 `floatYeast` 动画（此前因脚本 404 实际未播放；路径修复后恢复，并已加离屏暂停）。
- 懒加载图 `filter:blur` 占位、多处大 `box-shadow`（首页 hero/card、HP orbit 卡片）、`position:fixed` 全屏浮动装饰层（`float-art`）持续绘制。

### 14.3 已实施的优化（均维持原有效果）

- **路径修正（恢复被 404 静默失效的交互）：** `static/components/*` → `static/js/components/*`（18 个页面 + `normalize-scripts.js`）；`executive-summary-animation.js` 路径修正（首页 + `normalize`）。侧边栏烧瓶/TOC 高亮、HP reveal、首页酵母浮动/打字机/滚动渐入现已正常。
- **搜索索引重构（停止首屏阻塞 + 安全渲染）：** 原 `search-index.js`（约 189KB）内联 `window.iGEMSearchIndex` 并同步/defer 加载，已重构为 `search-index.json`（约 217KB）经同源 `fetch()` 按需加载（仅首次打开搜索时请求）；搜索结果以 `createElement` + `textContent` + 受控 `<mark>` 渲染，**移除 `innerHTML`**，杜绝索引内容（标题/正文/图片路径）进入 HTML 解析器；重复搜索复用同一 Promise，JSON 失败回退空索引（详见第七.9）。
- **`sidebar-progress.js` 去重排：** 在 init / resize / `load` 时一次性缓存各 section 的绝对偏移（`getBoundingClientRect().top + scrollY`），滚动期仅用 `scrollY` 与缓存偏移比对，彻底消除每帧 `getBoundingClientRect` 强制重排。
- **`hp-timeline-3d.js` 收敛即停：** `render` 在 `currentAngle` 收敛到 `targetAngle`（误差 < 0.01°）时停止 rAF 循环，仅在交互（滑块 `input`/`change`、‹ › 按钮、点击节点/卡片）时 `kick()` 重启，视觉完全不变。
- **`executive-summary-animation.js` 酵母离屏暂停：** 8 个酵母浮动 SVG 用 `IntersectionObserver` 在离屏时设 `animation-play-state:paused`、入屏恢复，视觉无差异，后台/长页滚动时大幅减少合成开销。
- **`scroll-progress-bar.js` 去重排：** 在 `init`/`onResize`/`load` 时缓存 `clientHeight`、`totalHeight`（`state.metrics` + `refreshMetrics()`），热路径每帧只读取 `getScrollPosition()`（scrollY，不触发重排）并写高度，彻底消除进度条的每帧 `scrollHeight/clientHeight` 强制重排。
- **`wet-lab/notebook.html` 滚动高亮去重排：** 一次性缓存各 `section` 绝对偏移（`buildSectionOffsets` 于 init/resize/load），滚动期仅以 `scrollY + innerHeight*0.3` 探针与缓存偏移比对切换 `.active` 类，彻底消除每帧 `getBoundingClientRect` 强制重排（与 sidebar-progress 同一手法）。

### 14.4 权衡与保留项（视觉效果不变）

- `nav` 的 `backdrop-filter` 属既定的毛玻璃导航视觉效果，**未移除**；其滚动重绘成本已知。若后续需进一步压榨滚动帧率，可改为不透明实色背景，或仅在滚动静止后启用模糊——属视觉改动，须走评审。
- `hp-carousel` 的卡片 `will-change` / `blur` 空气透视属第十二节冻结的视觉效果，保持不变；其交互已用 rAF 合并、滤镜层在过渡结束后释放（见 5.10）。
- 首页酵母 SVG 的 `will-change: transform` 保持（动画期间需要），离屏已由 `animation-play-state` 暂停。

### 14.5 性能预算与回归防护

- 新增/修改脚本后，本地起 `python -m http.server` 打开内容页与首页，确认：侧边栏烧瓶进度与 TOC 高亮随滚动更新、HP reveal/轮播（若启用）正常、首页酵母浮动/打字机/滚动渐入正常、搜索面板可开；并用 DevTools Performance 录制滚动，确认无长任务与持续 rAF。
- 严禁 reintroduce 第十四节所列反模式（永久 rAF、滚动中同步读布局、同步阻塞的大脚本、永久 `will-change` 堆、无守卫的无限动画）。对应硬约束见第八节第 14–19 条。
- 任何推崇"看起来更顺"的视觉微调，若涉及 `backdrop-filter`、模糊、环形结构、动画参数，按第十二.4 判断：视觉改动须用户拍板。
