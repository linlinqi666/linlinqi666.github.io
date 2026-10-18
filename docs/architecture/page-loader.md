# 全站加载动画与媒体外链策略

> 本文件由根目录 `README.md` 分册而来（2026-10-17）。内容未做改写，
> 仅按主题归位；与 `README.md` 冲突时以 `README.md` 的红线章节为准。

## 十六、全站页面加载动画（page-loader）与媒体外链策略（2026-09-13）

### 16.1 机制总览（两站同源）

每个页面在加载期间显示统一的加载遮罩，遮罩内是 **2 帧插画**（`loader-frame-1.jpg` / `loader-frame-2.jpg`）硬切构成的逐帧伪动画（2026-10-04 由原 6 帧雪碧图替换）；仅当该页「首屏可见的基础插画」全部就绪后遮罩才收起，其余资源继续懒加载。

| 组件 | 根站 | flask | 作用 |
|---|---|---|---|
| arm（同步，置于 head） | `static/js/components/page-loader-arm.js` | **暂缓**（组件整体未上线） | 首屏即给 `<html>` 打 `page-loader-armed`（显示遮罩 + 锁滚动 + 隐藏原生内容），8s 看门狗兜底 |
| 控制器（defer） | `static/js/components/page-loader.js` | **暂缓** | 收集关键图 → 预加载 → 判定收尾 → 派发 `pageloader:done`；帧图探测改为「两帧都就绪才切图片动画」 |
| 样式 | `static/css/components/page-loader.css`（本地帧图） | **暂缓** | 米黄/暖棕遮罩 + 2 帧硬切伪动画 + 纯 CSS 兜底 |
| 插画 | `static/image/any-icon/loader/loader-frame-{1,2}.jpg`（各 1280²，约 88KB） | 无需上传（组件暂缓） | 原 6 帧雪碧图 `loader-sprite[@2x].webp` 与 6 张逐帧导出已删除 |

### 16.1.1 全站「返回顶部」悬浮按钮（2026-10-04）

`src/_includes/partials/back-to-top.njk` + `static/css/components/back-to-top.css` + `static/js/components/back-to-top.js`；根站由 `base.njk` 引入（每个页面一份），flask 由 `wiki/layout.html` 引入。

- 结构：外圈图（自带环绕文字）套住内芯图，两张图绝对定位叠合；外圈 `back-to-top-spin` 无限顺时针旋转，hover 时按钮整体 `back-to-top-float` 上下浮动。
- 行为：`scrollY > 240px` 加 `.back-to-top--visible`（passive 滚动 + rAF 节流）；点击平滑回顶（reduced-motion 直接跳），并把焦点还给 `<main>`。
- 可达性：`<button aria-label="返回顶部">`；隐藏时 `visibility: hidden`（移出可聚焦序列）；`:active` 暂停浮动以保证点击精度。
- 图片：根站本地 `static/image/Animation/top/back-to-top-{ring,core}.jpg`（320²，各约 12KB）；flask 走 CDN `common/back-to-top-{ring,core}.jpg`。
- ⚠️ 根站 partial 内的图片路径必须带 `basePath`（子页在子目录，否则 404）。

**对外接口**：`window.PageLoader.register(urls)`（登记首屏关键图，支持候选回退 `[[c1,c2]]`）、`.done(cb)`、`.isDone()`。

### 16.2 判定「加载完成」的条件

- 就绪集合 S = 该页登记的首屏关键图；单图「结清」= `load` / `error` / 单图 3s 超时（error 不阻塞）。
- **收尾当且仅当**：`DOM 就绪（readyState ≥ interactive）` AND S 全部结清 AND `elapsed ≥ MIN_SHOW(600ms)`。
- **强制收尾**：`elapsed ≥ MAX_WAIT(8000ms)` 无条件收起；`prefers-reduced-motion` 时跳过 MIN_SHOW。
- 收尾动作幂等：移除 `armed` → 加 `done`（淡出）→ 解锁滚动 → 派发一次 `pageloader:done`。
- 无关键图的页面收敛为 `DOM 就绪 + MIN_SHOW`。

### 16.3 首屏关键资源登记

- 声明式：`<img data-critical>` / `[data-critical-bg]`。
- 命令式：JS 驱动、以 `background-image` 呈现的资源调用 `PageLoader.register()`。
- **members 页（首批落地）**：桌面端登记默认成员（队长 Jie Xia）的大幅背景形象候选；另登记左侧条带首屏可见的前 6 位成员头像。移动端无大图，故只登记头像。见 `static/js/pages/members.js` 的 `init()`。

### 16.4 首页 GIF 开场交接（修复「卡没」）

- 顺序固定为：**加载动画播完 → GIF 开场**。`index-intro-gif.js` 的 `whenLoaderReady()` 监听 `pageloader:done`（含 10s 硬兜底）后才启动播放。
- GIF arm 的看门狗改为**感知加载器**：遮罩期间不计时，等 `pageloader:done`（或 12s 硬上限）后再开始 6s 计时 —— 根除「GIF 尚未启动就被看门狗判为 finished」导致的开场丢失。
- 两站一致：根站见 `src/_includes/head-extra/index.njk`，flask 见 `static/js/components/intro-gif-arm.js`。

### 16.5 媒体外链策略（合规）

- **flask（生产站）**：`static/` 只允许 JS/CSS；**所有图片与 PDF 必须走 iGEM 自有 CDN** `https://static.igem.wiki/teams/6373/wiki/<归属>/<页面>/<文件>`（wet-lab 页面 `lab/wetlab/`、dry-lab 页面 `lab/drylab/`）。**旧基址 `static.igem.wiki/2026/szpu-china/...` 与 `static.igem.org/...` 整片 403，已废弃，禁止再使用**；**禁止任何第三方 CDN**。取址入口：模板用 `wiki/macros.html` 的 `media(rel)` / `igem_img(name,alt,cls)`；JS 用 `window.MEDIA_BASE`（由 `static/js/core/utils.js` 暴露）。flask 本地 `static/image/` 已删除，本地引用全部改为 CDN。
- **`403 application/xml` = 对象不存在（待上传）**，不是权限问题；`200` 才是已在 CDN。逐张探测用 `.codebuddy/skills/igem-wiki-migration-guard/scripts/check_images.py`。
- **iGEM 上传器单文件上限 10 MB（2026-10-11 记录）**：`static.igem.wiki` 一次性上传的单个文件**不得超过 10 MB**；超限文件必须先在本地压缩（或换体积更小的等价文件）再上传。上传前对 `igem2026-flask/static/image/wait/**` 逐文件核对体积。素材**按原格式原文件名直传**（上传器会自动转 avif 压体积），本地不擅自转码。
- **"透明底黑线图"必须先铺白底再上传（2026-10-11 实测）**：Origin/Excel 等导出的图表若**背景全透明、且不透明内容几乎全黑**（RGB 平面单调、细节全在 alpha 平面），上传器转 avif 时会把位元几乎全分给 RGB、alpha 只给极低位元 → **文字与细线被压糊**（实例：`result-fig13` 源图 50 KB，CDN 上只剩 3.1 KB，MAE 5.07 / 明显差异 2.94%）。处置：把透明区域**铺成页面卡片底色**（本站 `--bg-card: #ffffff`）再上传，细节回到 RGB 平面即无损。判据：图片 `mode=RGBA` 且不透明像素占比很低（< 5%）+ 不透明像素近黑 → 必须铺底。
- **上传暂存区纪律（2026-10-11）**：`igem2026-flask/static/image/wait/**` 是**上传中转站**，只允许存放「本次要上传的最终文件」。① 文件名必须是**页面引用名**——需要改名的，直接产出成目标名，**不要"原件 + 副本"两套并存**（曾因此留下两份逐字节相同的底盘 PDF）；② 已上传成功（CDN 探测 200）的文件随即删除，避免下次误传；③ 一切中间产物（扁平化副本、临时改名件、转码件）用完即删，或移入 `对话归档/misc/`；④ 上传前先跑重复检测：**同内容多份 = 待清理**。
- **根站（历史参考站）**：按用户确认保留本地 `static/image/`，仅共享同一套加载器逻辑（雪碧图用本地路径）。
- **根站插画入库边界（2026-10-04 更新）**：加载器插画改为两张独立帧图 `static/image/any-icon/loader/loader-frame-{1,2}.jpg`（原 6 帧雪碧图与逐帧导出已删除，不再有「多帧冗余副本」问题）；`.gitignore` 里针对旧 `static/image/loader/` 的排除项可保留（已无匹配文件）。
- **待上传清单（2026-10-04）**：见 `Requirements/REQ-20261004-001.md` §4——本轮新增 6 张需上传 CDN（首页 4 张吉祥物 + 全站返回顶部 2 张）；加载器插画**不再需要上传**（flask 侧组件暂缓）。未上传前吉祥物与返回顶部图标会退化为空白/缺图，页面结构不破版。

### 16.6 回归验证

`对话归档/temporary-tools/verify_sites.py` 可复跑：真实起本地 HTTP 服务校验关键页与资源状态码、全量审计构建产物的本地资源引用、并断言加载器契约（14 项）。当前结果：根站 1367 条引用 **0 缺失**；flask 1690 条引用仅 1 条为已文档化的注释示例（`index.css` 的 `xx.jpg`）；两站加载器资源全部 200。

---
