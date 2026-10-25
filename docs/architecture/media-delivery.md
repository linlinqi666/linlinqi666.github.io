# 图片投递：分层、预取与构建期契约

> 2026-10-19 建立，取代此前零散的「看门狗 + 懒加载 + 解码前隐藏」组合。
> 上位规则：`README.md` 的红线与 `docs/architecture/page-loader.md` 的加载器机制；
> 本文只描述**图片**如何分级、如何等待、如何验证。

## 1. 为什么要重做

一周内出现四次「图片没出来」的故障，事后看都是同一个结构：

| 故障 | 直接原因 |
|---|---|
| 检测方法屏 JS 失效 | 量测等待上限只有 30 帧（0.5s），量不到就永久 `disarm` |
| 探索屏两只吉祥物稳定透明 | `media-reveal--pending`（`opacity:0`）在请求被取消时没被解除 |
| 整页卡住进不去 | 关键图改 eager 后进入 `document.readyState`，一张挂住就让 `load` 永不触发 |
| 新 HTML + 旧 CSS | 静态资源无版本串，两个文件各自缓存 10 分钟 |

共同点是**「先把图藏起来/把页面拦住，等某个条件满足再放开」**。条件没解开，就是空白或死锁。
所以本方案的第一原则是：**运行时不决定图片的可见性**。

## 2. 分层定义（写在模板上，运行时不猜）

```html
<img src="..." width="1280" height="1280" data-tier="l1" alt="...">
```

| 层 | 定义 | 上限 | 策略 | 硬上限 |
|---|---|---|---|---|
| `l0` | 进页立刻可见那一屏的图 | ≤ 6 张 | 加载遮罩等它们 `decode()` 完成 | `SOFT_WAIT` 2500ms / `MAX_WAIT` 6000ms |
| `l1` | 当前屏之后 2 屏内的图 | 按屏 | 进页后按「离当前屏距离」由近及远预取；换屏重排 | 单张 5s 放弃，不重试 |
| `l2` | 其余（不写 `data-tier` 即默认） | 不限 | 原生 `loading="lazy"`，JS 零介入 | 无 |

三条硬规矩：

1. **所有层都保留 `loading="lazy"`**，包括 `l0`。eager 图会进入 `document.readyState`，
   一张挂住就能让整页 `load` 永不触发——这是「整页卡住」事故的直接教训。
   `l0` 的「等齐」由加载器自己用 `new Image()` 预载实现。
2. **就绪判据用 `decode()` 而不是 `load`**。`load` 只代表字节到齐，解码还没发生；
   跨域无 CORS 时 `decode()` 可能 reject，一律 catch 后按「字节已到」放行，绝不等死。
3. **l0 没结清前不启动 l1 预取**，否则预取会抢首屏带宽。

## 3. 运行时不隐藏任何图片

- `media-reveal.js` 已停用为空壳，只负责清掉历史遗留的 `.media-reveal--pending`。
- `media-reveal.css` 的 `opacity:0` 规则已删除，并留了一条 `opacity:1` 兜底，
  防止旧缓存 HTML 把图重新藏起来。
- 需要「未解码时的占位」时，用 `main img[data-placeholder]` 的浅底色（**只给不透明照片**；
  透明插画不要标，底色会从透明像素里透出来）。
- 不做淡入。淡入必须从 `opacity:0` 起步，而「从 0 起步等条件」正是本方案的禁用模式。

## 4. 按屏预取（解决「到屏了图还没出来」）

snap 分屏的位置可预测，这是本项目最大的可利用结构：

1. `image-pipeline.js` 用 `closest('.presentation-section')` 把图归到屏，建立索引；
2. 滚动时算出当前屏，对 `[当前, +1, +2, -1, -2]` 内的 `l1` 图发起 `new Image()` 预取；
3. 并发上限 4，按距离由近及远；换屏时清空队列重排，避免越积越多；
4. 当前屏内的图不重复预取（浏览器已在加载）；
5. `navigator.connection.saveData` 或 2G 环境直接跳过预取。

## 5. 构建期契约（不参与运行时）

`tools/check-image-contract.mjs`，已接进 `npm run build:all`（构建前先跑）：

| 级别 | 规则 |
|---|---|
| error | `<img>` 缺 `width`/`height` 且未标 `data-allow-no-dims` |
| error | `data-tier` 取值不在 `l0/l1/l2` 内 |
| warn | 单图文件 > 3 MB；单页 `l0` > 6 张 |

- 只读 `src/**/*.njk` 的静态文本，**不产出、不修改、不拦截任何资源**，因此不可能导致图加载不出来。
- 注释、`<script>`、`<style>` 里的 `<img ...>` 会被先挖掉，不产生误报。
- 存量豁免走 `tools/image-contract-baseline.json`（当前为空，即零违规）。
- JS 动态注入的图（HP 成员卡、attributions 头像、model 卡片）不在模板扫描范围内，
  这些位置由容器 `aspect-ratio` 预留空间兜住布局（实测三页 CLS 0 / 0.009 / 0.022）。
  新增动态图时请同样保证容器有固定比例。

## 6. 静态资源版本串

`.eleventy.js` 用 `addGlobalData('assetV', ...)` 取 `static/css`、`static/js` 下最新 mtime，
`head.njk` 与 `base.njk` 的全部 `link`/`script` 挂 `?v={{ assetV }}`。
每次构建自动变化，HTML 与 CSS 不会再出现版本错配。

## 7. 可观测

`window.ImagePipeline.report()`：

```js
{
  entryMs,                     // l0 结清（遮罩放行）时刻
  l0Settled, prefetched, prefetchAvgMs,
  screens: [{ id, images, arrivedAt, notReady, notReadyUrls }],
  notReadyTotal                // 只统计真实分屏，不含长文页/页脚的伪分屏
}
```

验收口径：**`notReadyTotal === 0`**，且 CLS < 0.1。

## 8. 当前实测（根站首页，1440×900）

| 场景 | 进页 | CLS | 到屏未就绪 |
|---|---|---|---|
| 常规网络 | ~1.0s | **0** | 0 |
| 1.2 Mbps / 150ms | 受 CSS/JS 传输主导（19s） | **0** | 0 |

> 弱网下进页慢的主因已不是图片，而是约 200KB CSS + 13 个全局脚本的传输。
> 要再压，需要单独治理 CSS/JS 体积（不在本方案范围）。

## 9. 迁移到 flask 时的注意

1. `data-tier` 与尺寸契约在 flask 模板里同样适用；flask 的图走 CDN，`src` 是绝对地址，
   契约脚本对 CDN 地址只查属性、不查文件体积。
2. flask 的加载器是内联在 `wiki/layout.html` 的，`assetV` 用 `app.py` 的 context processor。
3. 迁移后必须重跑：`verify-pipeline.js`（到屏未就绪 = 0）、`verify-pager-scroll-story.js`（19 条断言）。
