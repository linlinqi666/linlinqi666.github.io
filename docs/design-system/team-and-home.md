# Team 成员页与首页分屏组件

> 本文件由根目录 `README.md` 分册而来（2026-10-17）。内容未做改写，
> 仅按主题归位；与 `README.md` 冲突时以 `README.md` 的红线章节为准。

### 5.15 Team 成员页分类与顺序（2026-09-15 重组）

`team/members.html` 的条带分组、成员卡与详情面板全部由 `static/js/pages/members.js` 的数据驱动渲染，分类顺序的唯一事实源是其中的 `ROLE_ORDER` 数组：

| 顺序 | 分类（`ROLE_ORDER`） | 含义 | 指示点颜色 |
|---|---|---|---|
| 1 | `PI` | 项目负责人（Primary / Secondary PI 作为展示标签另行传入 `roles`） | `--role-pi-text #991B1B` |
| 2 | `Adviser` | 指导教师 | `#92400E`（历史硬编码） |
| 3 | `Wet Lab` | 湿实验 | `--role-wet-text #1E40AF` |
| 4 | `Dry Lab` | 干实验 | `--role-dry-text #065F46` |
| 5 | `WIKI` | 网页与 wiki 建设 | `#2563EB`（历史硬编码） |
| 6 | `HP` | Human Practices | `--role-hp-text #9A3412` |
| 7 | `Art` | 视觉与美术 | `--role-art-text #0E7490` |
| 8 | `Designer` | 设计（当前无成员，空组自动不渲染） | `--role-designer-text #7E22CE` |

**成员数据字段（每人固定顺序）：** `id → name → roles → directions → bio → photoPosition → photoSize`，需要强制指定图片时在**末尾**追加可选的 `images`。

| 字段 | 作用 | 留空的后果 |
|---|---|---|
| `id` | 成员 id，同时决定图片文件名（`webp/<id>.webp`、`webp/<id>_kt.webp`） | 无 |
| `name` | 展示姓名（条带、详情面板、信息条） | 条带显示空白 |
| `roles` | 首项为展示标签，末项放分类角色（必须命中 `ROLE_ORDER`） | 不进入任何分组 |
| `directions` | 方向标签 | 不渲染标签行 |
| `bio` | 详情面板与右侧信息条的简介 | 不渲染简介，无占位文案 |
| `photoPosition` | 背景大图取景位置（CSS `background-position`） | 回退默认 `center top` |
| `photoSize` | 背景大图缩放（CSS `background-size`） | 回退默认 `cover` |
| `images`（可选） | 覆盖 `photo` / `avatar` 的候选路径 | 走下面的默认候选链 |

**照片微调（`photoPosition` / `photoSize`）速查表**（2026-09-30 现状，直接改 `members.js` 对应数值即可，无需动 CSS）：

| 成员 | id | 分组 | photoPosition | photoSize |
|---|---|---|---|---|
| Lijun Zhang | `zlj` | PI | `70% 0%` | `36% auto` |
| Yongjun Tang | `tyj` | PI | `100% 10%` | `78% auto` |
| Lizhen Zhu | `zlz` | Adviser | `100% 25%` | `68% auto` |
| Jianhua Zhou | `zjh` | Adviser | `100% 15%` | `84% auto` |
| Jie Xia | `xj` | Wet Lab | `center 30%` | `100% auto` |
| Yifan Gao | `gyf` | Wet Lab | `center 10%` | `60% auto` |
| Chengxi Luo | `lcx` | Wet Lab | `70% 10%` | `70% auto` |
| Xiaozhen Su | `sxz` | Wet Lab | `55% 10%` | `50% auto` |
| Aishi Zeng | `zas` | Wet Lab | `55% 10%` | `60% auto` |
| Yuelin Zheng | `zyl` | Wet Lab | `55% 10%` | `80% auto` |
| Rui Luo | `lr` | Dry Lab | `60% 30%` | `60% auto` |
| Qi Xu | `xq` | WIKI | `45% 30%` | `60% auto` |
| Ruoxi Li | `lrx` | WIKI | `60% 20%` | `60% auto` |
| Rouqing Chen | `crq` | WIKI | `center 34%` | `70% auto` |
| Yuquan Luo | `lyq` | HP | `60% 30%` | `60% auto` |
| Siqi Peng | `psq` | Art | `60% 30%` | `90% auto` |

- `photoSize` 用 `xx% auto` 表示"宽度按容器百分比、高度自适应"，人像不会被裁切；改用 `cover` 则铺满并裁切。
- 微调后需重新构建（`npx eleventy`；本环境 `npm run` 不可用，见第十.1 节），并在 HTTP 下刷新页面查看实际取景效果。

**图片候选链（`ImageResolver`）：**
- 背景大图：`webp/<id>.webp` → `源图片/<id>.jpg` → `源图片/<id>.png`。
- 条带头像：`webp/<id>_kt.webp` → `源图片/<id>_kt.jpg` → `源图片/<id>_kt.png` → `webp/<id>.webp` → `源图片/<id>.jpg` → `源图片/<id>.png`（后三项是「没有卡通头像」的兜底，避免 `onerror` 链耗尽出现破图）。
- **没有 `_kt` 卡通头像的成员**必须显式写 `images: { avatar: { candidates: [...] } }`，把本人照片放在首位：否则浏览器会先探测不存在的 `_kt` 路径，产生必然 404 的请求（已实测：不写会新增 12 条 404 控制台报错）。写成一行即可，与其余字段保持同一视觉格式；**补上 `_kt` 素材后应把该字段删掉**，回到默认候选链（否则会继续用本人照片当头像，`lrx` / `crq` 于 2026-09-16、`zlj` / `tyj` 于 2026-09-30 已按此处理）。
- **路径基准是页面，不是 JS 文件（2026-09-30 修坑）**：`images` 里的候选路径由浏览器按**当前页 URL**解析，成员页是 `/team/members.html`（一级目录），因此必须写 `../static/image/...`。写成 `../../image/...` 会被解析成 `/image/...` 而 404——`zlj` / `tyj` 的头像与大图曾因此整组裂图，且 `onerror` 兜底链同样指向错误路径，连回退都没有。默认候选链（`IMAGE_PATH_TEMPLATES`）本身就是 `../static/...`，**能走默认链就不要写覆盖**。
- **取景调参方法（2026-09-30）**：改完不要只凭肉眼，按「检测 → 求解 → 实测复核」三步走，脚本都在 `对话归档/temporary-tools/2026-09/`：
  1. `2026-09-30-face-detect-members.py`（YuNet）输出每张照片的人脸中心相对坐标与宽高比；
  2. `2026-09-30-members-photo-solve.py` 按桌面（1440×800）与移动端（334×219）两套容器尺寸网格搜索，求一组两端都能把人脸放进可视区的 `(size, px, py)`；
  3. `2026-09-30-members-photo-measure.js` 起真实浏览器截图并回读 `background-position/size`，再用第 1 步的脚本对截图做人脸检测复核（截图前必须先点掉全屏引导封面 `.members-intro`，否则每张截图都一样）。
  桌面理想落点：人脸中心 x≈0.60–0.62（避开左侧正文蒙版、又不压到右侧信息条）、y≈0.40–0.44；移动端卡片只有 219px 高且底部 62% 起淡出，人脸 y 需落在 0.35–0.40 才看得见。
- **照片晕影与取景参数的关系（2026-10-01）**：背景照片四周的米黄羽化由 `members.js` 的 `setPhotoBox()` 按**实际渲染框**算出并写入 CSS 变量（`--photo-left/right/top/bottom`、`--photo-fade-x/y`，挂在 `.members-bg-layer` 上），`members.css` 的 `.bg-mask` 四条渐变据此绘制。**不要让"照片边缘好不好看"成为改 `photoSize` / `photoPosition` 的理由**——取景参数只决定人脸构图，羽化跟随渲染框自动适配（窄幅照片的左右硬边同样会被羽化）。变量缺省时退化为"照片满铺、不羽化"，无 JS 或图片信息缺失时页面与旧版一致，不会出现整块不透明色。

**约定：**
- 成员的归属分类取自 `roles` 数组里**在 `ROLE_ORDER` 中排名最靠前**的一项（`getPrimaryRole`）；`roles` 中其余非分类项会作为标签显示在详情面板与右侧信息条，`ROLE_ORDER` 内的分类项则被 `CLASSIFICATION_ROLES` 过滤掉，不重复显示为标签。因此「Primary PI / Secondary PI」这类展示标签与分类角色 `PI` 必须同时写进 `roles`（如 `['Primary PI', 'PI']`）。
- 同组内成员顺序 = `members` 数组顺序；空分类组由渲染器跳过，不会出现空标题。
- 新增分类必须三处同步：`ROLE_ORDER`、`ROLE_COLORS`（`members.js`）与 `static/css/members.css` 的 `.group-indicator[data-role="…"]`，否则指示点无颜色。
- 新增成员只需补 `roles` / `directions` / `bio` / `photoPosition` / `photoSize`；`directions` 与 `bio` 暂缺时留空数组与空字符串，不写占位文案（遵守 flask 侧「占位符不得进入冻结版本」的同一口径）。
- **当前填写状态（2026-09-16）**：`zlj` / `tyj` / `lrx` / `crq` 的 `bio` 已填入本人句子（文案由团队成员提供，仅把中文全角逗号规范为英文逗号，其余未改）；四人的 `directions` 仍留空，待团队给出方向标签。`lrx` / `crq` 的源照片于同日替换为 3:4 竖构图，`lrx.webp` 1440×1920 / 263.1 KB、`crq.webp` 1440×1920 / 244.8 KB，取景仍为 `center 20%` / `60% auto`，如需更完整身位可下调到 `50% auto`。同日两人补入 `_kt` 卡通头像：`lrx_kt.webp` 1280×1280 / 62.3 KB、`crq_kt.webp` 1280×1280 / 44.8 KB（源 `lrx_kt.jpg` 108 KB、`crq_kt.jpg` 86.5 KB），条带头像改走默认候选链。
- `static/js/pages/members.js` 的性能预算已由 42 KB 上调至 46 KB（`tools/check-performance-budget.js`）：该文件同时承载成员数据与渲染逻辑，名册从 13 人增至 16 人并新增取景字段后，42 KB 只剩 71 字节余量，补文案即会触发构建失败；逻辑部分未增长。
- 生产提交工程 `igem2026-flask` 的同名文件为镜像（根站为权威源），仅图片前缀改为 `https://static.igem.wiki/2026/szpu-china/image/...`，改动须同步两侧；新增 WebP 需由团队上传至 iGEM Uploads CDN 后才在正式站点生效。
- 结构自检脚本（可重跑）：`node 对话归档/temporary-tools/2026-09/2026-09-15-check-members-format.js` —— 校验两工程字段顺序、分类命中、取景字段存在、`images` 首个候选文件真实存在，并打印上表。

### 5.16 成员页响应式布局与全屏引导封面（2026-09-16）

成员页此前的问题（多断点实测，见 `对话归档/logs/2026-09/2026-09-16-members-responsive-before*.txt`）：

| 问题 | 表现 | 根因 |
|---|---|---|
| 首屏双倍留白 | 桌面/移动条带顶部均在 200–228px 处才开始 | 全站 `main` 已有 `padding-top: 6.25rem`，`.members-strip` 又加了 `margin: 100px` |
| 移动端首屏"空白页" | ≤1024px 无任何成员内容、无照片 | 初始化只在 `width > 1024` 时选中首位成员；≤768 又直接 `display:none` 隐藏了背景图层 |
| 展开列表被裁 | 375px / 1024px 展开后末尾成员点不到 | `.members-strip.is-expanded .strip-groups { max-height: 1200px; overflow: hidden }` 固定上限 |
| 中段桌面照片被挤成缝 | 1180px 时照片可视带宽仅 410px | 条带固定 390px + 信息条固定 380px，均为固定值 |
| 嵌套滚动 | 移动端条带内部又出现独立滚动条 | 条带 `max-height: calc(100vh - 100px) + overflow-y: auto` 在堆叠布局下未取消 |

**改造后的布局矩阵（断点与 `members.js` 的 `DESKTOP_BREAKPOINT = 1100` 必须一致）：**

| 视口 | 布局 |
|---|---|
| ≥1100px | 桌面分栏：左条带（`clamp(300px,30vw,390px)`）+ 全幅人像背景 + 右侧信息条（`clamp(272px,24vw,380px)`），宽度随视口收缩 |
| ≤1099px | 堆叠：人像改为**顶部 hero 条**（`clamp(200px,30vh,340px)`，底部渐隐），条带折叠为切换器，信息条收起、简介进入详情卡 |
| ≤640px | 同上，hero 收窄至 `clamp(172px,26vh,260px)`，正文与标题降一档 |

关键实现点：

- **默认选中首位成员**（所有断点）：桌面展示其背景与信息条，堆叠展示 hero 与详情卡；堆叠布局下选中后自动收起列表，并在详情卡移出视口时平滑带入。
- **展开高度实测**：`setStripGroupsExpanded()` 把 `scrollHeight` 写进 `--strip-groups-max`，CSS 仅保留 `2400px` 兜底；组内折叠后由事件委托触发 `resyncStripGroupsHeight()` 重测，视口切换时清理。
- **无缓存验证环境**：`python -m http.server` 不发 `Cache-Control`，Chromium 会按启发式新鲜度直接复用缓存（本项目实测出现过 `members.css` 一小时未重新校验，导致"改了没生效"的假象）。验证请用 `对话归档/temporary-tools/2026-09/2026-09-16-dev-server-nostore.py`（强制 no-store），并注意重启浏览器会话以清掉旧缓存条目。
- **预算条目**：`members.js` 46 → 48 KB（新增响应式逻辑），并新增 `members.css` 26 KB、`components/members-intro.js` 6 KB、`components/members-intro.css` 7 KB 三条守护（见 `tools/check-performance-budget.js`）。
- **右侧简介条带排版规范（2026-10-01）**：`.rail-scroll` **不带卡片背景框**（用户 2026-10-01 明确反馈去掉背景/边框/阴影——原半透明卡片 + 阴影在视觉上"越过内容左缘"，且让右侧照片硬边看起来更突兀）。文字直接落在 `.bio-rail-inner` 的右侧不透明渐变上，字号/字色统一走全站令牌：姓名 22px/700/`--primary-blue`，角色 14px/600/`--color-text-light`，方向标签 13px/600/`--tag-fill-blue` 底，简介 15px/`--color-text`、行高 1.8，并以 `border-top: 1px solid rgba(43,108,176,.16)` 与标签区分层。`.bio-rail-inner` 两侧等宽内边距 `clamp(20px, 4vw, 36px)`，姓名/标签/简介共享同一测量宽度，长短简介都不破版。实测（16 位成员，1600×900）简介文字左端最深到 x=1286，该处 rail 渐变不透明度约 0.59，文字区背景亮度中位数 ≈241，深色正文对比充足。
- **展开动画右缘贴合不变量（2026-10-01，禁止回退）**：
  1. `.bio-rail.is-visible .bio-rail-inner` 的缓动**不得使用 y 分量 > 1 的过冲曲线**——原 `cubic-bezier(0.34, 1.56, 0.64, 1)` 会把 `translateX(100%) → translateX(0)` 推过终点，面板右缘因此短暂离开视口右缘；现用不过冲的 `cubic-bezier(0.22, 1, 0.36, 1)`。
  2. `.rail-edge-filler` 纵向几何为纯 CSS `top:0; bottom:0`（`position: fixed; right:0`，宽度取 `--scrollbar-width`），展开态 `transition: none`，**不再由 JS 逐帧回写 `top`/`height`**（时点依赖的同步滞后正是右缘空当的来源之一）。
  3. JS 侧只保留 `measureScrollbarWidth()` 写 `--scrollbar-width`。
  4. 验收方式：展开全过程逐帧断言 `railInner.getBoundingClientRect().right >= window.innerWidth - 0.5`（含起手与过冲瞬间）。
- **照片边缘羽化的方向陷阱（2026-10-01）**：`.bg-mask` 的四条羽化层中，**右缘与下缘的渐变必须落在照片渲染框之"内"**（`transparent` → 在照片右/下缘处变为 `opaque`），因为渲染框外本来就是米黄底色，渐变写在外侧等于完全无效；左缘/上缘相反（框内由 `opaque` 渐隐到 `transparent`）。曾因右缘写成"框外渐显"导致只有左侧有羽化、右侧全是硬边，排查脚本见 `对话归档/temporary-tools/2026-10/`。
- **预算门禁的实际位置（2026-10-01 核查）**：`tools/check-performance-budget.js` 在根站与 `igem2026-flask/tools/` 中**均不存在**，且 `package.json` 的 `build:all` 只含 `eleventy && search-index-generator`，**构建不会执行预算校验**（§10.1 的第 4 条与 §14.5 的引用均为过期描述，与 §17.3.1 的说明冲突）。可用的脚本位于 `对话归档/temporary-tools/check-performance-budget.js`，需手动运行。本次改动结果：根站 `members.css` 25.3 KB（上限 26 KB）、`members.js` 47.5 KB（上限 48 KB），均在预算内；脚本中的 `members.js` 上限已从过期的 46 KB 对齐为 README §5.16 记录的 48 KB。**不要把未运行的预算检查写成"通过"。**

**全屏引导封面（`#members-intro`）** —— 用户要求"进入成员页先看整队照片，点击再进入"：

| 项 | 说明 |
|---|---|
| 素材 | `static/image/character/源图片/total.jpg`（1919×1279 / 578 KB）→ `webp/total.webp`（1919×1279 / 163.5 KB）+ `webp/total-960.webp`（960×640 / 72.2 KB，供 `srcset`） |
| 状态机 | `<html>` 上的类驱动：`members-intro-armed`（显示封面、锁滚动、页面 `inert`）→ `members-intro-ready`（控制器就位，看门狗不再强收）→ `members-intro-finished`（收尾） |
| arm | 根站写在各页 head 片段 `src/_includes/head-extra/team-members.njk`（同步内联）；flask 为 `static/js/components/members-intro-arm.js`，由成员页 `head_extra` 块按页引入 |
| 进入方式 | 点击任意处 / Enter / Space / Esc / 「Enter the team」按钮；淡出后解锁滚动、恢复 `inert`、焦点交给条带容器（`tabindex="-1"`，不产生默认焦点环） |
| 降级 | 无 JS 时不 arm，`.members-intro` 默认 `display:none`，页面照常可用；控制器脚本 404/被拦截时 arm 内 8s 看门狗强制 `members-intro-finished` |
| 展示频率 | 默认**每次进入成员页都显示**；如需"每会话一次"，把 arm 脚本里的 `ONCE_PER_SESSION` 改为 `true`（控制器收尾时写 `sessionStorage`） |
| 无障碍 | 封面为 `role="dialog" aria-modal="true"`；页面内容置 `inert` + `aria-hidden`，避免 Tab 进入被遮挡区域；`prefers-reduced-motion` 下不做淡入淡出，页面唯一 `h1`（`.members-sr-only`）常驻 |
| 移动端取景 | 竖屏改用 `object-fit: contain`（整队完整可见，不裁人头）+ 同图模糊衬底；桌面用 `cover` + `object-position: center 28%` 保证头部完整 |

### 5.17 首页分屏组件拼装与「手动微调区」（2026-09-22）

首页 10 个 `.yeast-screen` 板块里的插画与装饰，由 `static/image/Animation/index/webp/` 的**设计切片**在 `static/css/index.css` 的 `.art-stage--sN` 舞台上拼装而成。成品对照图（7 张，1080×608）、实测数据与全部脚本归档在 `对话归档/2026-09/2026-09-22-homepage-assembly/`。

**素材目录已按屏分组（2026-10-06f）**：`webp/` 顶层不再放图，素材按滚动顺序入 `first-section/`（hero）→ `second-section/`（甲流负担）→ `third-section/`（human-practices 图表屏）→ `fourth-section/`（statistics）→ `fifth-section/`（safety）→ `sixth-section/`（public-health）→ `seventh-section/`（project-intro）→ `eighth-section/`（dbtl-cycle）→ `ninth-section/`（future-vision）→ `tenth-section/`（final-cta，含原 `explore/` 子树）；跨屏复用切片统一在 `shared/`。新增素材请放入对应屏文件夹，引用路径 `static/image/Animation/index/webp/<屏文件夹>/<文件名>`。

**2026-10-13 新增 `#passive-to-active` 过渡屏**（仅根站，flask 站不动）：位于 human-practices 与 statistics 之间，叙事为「现有检测方法都建立在被动检测之上（等发病→上医院→采样→等结果），本队不做技术超越，而是把检测起点前移」，向下引出 statistics 屏的 qPCR / ELISA / CGIS 三方法。结构：左插画（EchoYeast 被采样，素材 `webp/passive-to-active/passive-detection-swab.png`，用户提供 2048×2048 PNG 按 alpha 紧裁为 1625×1653，格式与画质不变）＋中缝竖向虚线长线（`.pta-thread`，两端 mask 渐隐，移动端隐藏）＋右文案三条 `.reveal` 自下而上错峰淡入。**实现要点**：① 全站 `.reveal` 原本没有基础 CSS（JS 加的 `.reveal--visible` 无人消费，属既有现状），本屏的隐藏/过渡样式只在 index.css「passive-to-active」段内**按屏作用域**补齐，不改动其他屏现状；② 插画浮动为纯 CSS 无限动画（`ptaFloat`），离屏暂停复用 home-idle-motion.js 已有的 `data-offscreen` 停表（index.css `[data-offscreen]` 段），reduced-motion 直接静止；③ 降级：无 JS 走 head-extra/index.njk 的 noscript 覆盖，reduced-motion 走 media query，文案均静态可见；④ 背景已把 `#passive-to-active` 加入 index.css 两组背景选择器（基础组 + 移动端组）与每屏 `--section-bg-img` 簇。样式定位只有一处：index.css 搜「passive-to-active」。验收：`npx eleventy` EXIT=0、1440×810 桌面/边界 + 390×844 移动端截图（`对话归档/screenshots/2026-10/pta-*.png`）、console 0 错误 0 警告。

**本轮同屏改动（2026-10-06f）**：① `#future-vision` 内容栏加宽至约 60% 页宽、纵向间距按 810px 视口收敛不溢出，正文段落/列表/占位句全部由中文译为英文（保持未来时态）；② statistics 屏新增 ELISA→qPCR 连线（内联 SVG，`.art--statistics-link`），揭示顺序改为「CGIS 弧画出 → ELISA 落位 → 连线擦出 → qPCR 落位」（`statistics-reveal.js` 时间轴 linkDelay/linkDraw/qpcrDelay=1420），降级红线不变（无 JS/reduced-motion 静态可见）。

**2026-10-07 三屏微调**（Q1–Q5 由用户拍板）：① 新素材 `shared/shared-wave-5.webp`（用户提供的透明细波，抠掉 63 万低 alpha 噪点 + 167 处白斑后按 alpha 紧裁为 1080×95），设计原理屏 `art--dbtl-cycle-wave` 换新素材并改为**满宽贴底、高度走原比例**、退出浮动动画（贴底横条浮动会露底缝）；② 安全屏新增 `.art--safety-sky`＝底部云波 `shared-cloud-1.webp` 垂直翻转（`scaleY(-1)`）满宽贴顶，同源同宽必对称；③ 安全屏星星补齐 3 颗（复用 `shared-sparkle.webp`，新增 `-star-a` 左上 / `-star-b` 右上），移动端断点同步；④ 轮播屏药丸 `clamp(15px,3.3vh,34px)→clamp(17px,4vh,40px)`、外盒 `top 16.5%/h 64%→top 18%/h 58%` 收紧行距、吉祥物 `height 55.2%→59%`，并**去掉椭圆条带蓝色描边**（`--intro-pill-lw: 0`）。验收：1440×810 三屏 + 与设计稿并排对照（`对话归档/2026-10/2026-10-07-visual-tuning/verification/compare-*.png`）+ 390×844 回归（无横向溢出）。**同日返工（b 轮）**：① 安全屏两波贴边——精测云波直边在画布 y84.2%，底部云波改 `bottom:-7.06%` 并退出浮动动画，上波改用离线翻转+纵压 72% 的新素材 `fifth-section/safety-sky.webp`（直边在素材顶边）并 `left:-3%/width:106%` 左移缩幅；② 轮播屏吉祥物再放大 1.3×（`height 77% / left 30% / top 20.5%`）；③ statistics 吉祥物按用户提供的 `34.png` 覆盖替换（同比例 1345×1387，CSS 零改动，旧图备份 `*.overcropped.webp`）。**同日动画顺滑化（c 轮）**：statistics 揭示动画取消二段式（先画线→等落位→再画线→再飞），改**一段式连贯揭示**——两段虚线一笔向上画（`linkDelay 1180→260`，紧接弧线尾端）、两圆随线起飞（`elisaDelay 280→180`、`qpcrDelay 1420→640`、`fly 950→900`，各环节互相重叠不空等），顺序仍为 CGIS→ELISA→qPCR，总时长 ≈2.4s→≈1.6s；位置/几何参数不动（保留用户 DevTools 实调值）。时序帧验收：`对话归档/screenshots/2026-10/2026-10-07-stat-t*.png`。

**hero 标语归位与主题色（2026-10-06h）**：`hero-echo-logo.png` 与 `shared-blue-curve.png` 原都是 1600×1600 大画布，字只占中间一条带（logo 字区 y541–1043、标语字区 y719–986），按整幅定位会算错位置——标语因此整体落到屏底被裁（用户报"字体掉下去了"）。两张图已按 alpha 紧裁（1510×526 / 1475×291，原件备份 `对话归档/2026-09/2026-09-22-homepage-assembly/backups/webp-original/*.1600square.png`），CSS 坐标换算自设计稿 1080×607：logo `left 8.8% / top 19% / width 44.9%`、标语 `left 8.8% / top 49% / width 43%`。**教训：设计切片务必紧裁后再定位，否则盒子≠内容区，位置全错。** `#future-vision` 正文改主题色（正文 `#2f6f96`、列表小标题 `#1f6ea6`、占位句 `#4f86a8`，与 `influenza-burden` 屏同口径；不用 `--color-echo-blue` 纯色，因米黄底上长段正文对比度仅 ≈2.6:1）。排查脚本 `对话归档/temporary-tools/audit-uncropped.py` 可复检全目录"未紧裁画布"隐患，当前仅剩 `shared-wave-alt-c/d.png` 两个未被引用的备用图。

**2026-10-06i 三项**：① statistics 第二条连线改为复用第一条弧的切图 `statistics-dashed-arc.webp` 并**只关于水平线翻转 `scaleY(-1)`**（不要用 `rotate(180deg)`，那会把走向也反过来、接不上 qPCR→ELISA；顺序仍为 CGIS 弧 → ELISA → 连线 → qPCR）；② 首页末屏「探索我们的 Wiki」改为 `Explore Our Wiki`（含 `data-title`/aria/alt）；③ **`human-practices/inclusivity` 改为 `human-practices/sustainability`**——本队不申报 Inclusivity Award（迁移技能 R3c），新页只写可查证的设计意图并显式声明"非生命周期评估"；根站 `src/human-practices/sustainability.njk` 与 flask `wiki/pages/sustainability.html` 同源，导航/页脚/搜索索引清单同步改指。菜单图标新增自绘内联 SVG 叶片 `shengtai`（flask `wiki/icons.html`），根站导航用等价内联路径 + `.nav-glyph`。

**flask 站镜像现状与上传清单**：flask 首页仍是上一代版本（无 webp 拼装、FV/末屏曾为中文 + `img_placeholder`），本轮只同步了纯文案部分；把 10 屏视觉体系迁过去必须**先**把 46 张 webp 上传 CDN（R7），否则只会得到"合规但全 403 空图"的页面。完整清单（官方仓库差集 NEW 67 / BOTH 需覆盖 5 / REMOTE-ONLY 11、CDN 31 张待处理、favicon 与 iconfont 处理、阻塞与待决策）见 `对话归档/2026-10-06i-sustainability-and-upload-manifest/verification/2026-10-06i-upload-manifest.md`；技能脚本原始输出同目录 `check-*.txt`。

#### 装配工作流（顺序不可颠倒）

1. **先核对骨架**：改动落在 `index.html`（产物）与 `static/css/index.css`。调样式前先确认 `index.html` 里对应节点的类名与层级是否符合预期。
2. **再反向回写源**：`index.html` 由 `src/index.njk` 经 Eleventy 生成，**`src/index.njk` 才是源**。骨架结构调整必须同步回 `.njk`，否则下次 `npx eleventy` 会把改动覆盖掉。
3. **重建**：`npx eleventy`（见 §10.1）。
4. 只改 CSS 不需要重建，但**必须免缓存预览**（见下）。

#### 本地调试必须用免缓存服务（否则「改了没变化」）

`python -m http.server` 不发送 `Cache-Control`，Chromium 会按启发式新鲜度直接复用缓存（本项目实测出现过 `members.css` 一小时未重新校验）。改完样式看不到变化时，第一嫌疑是缓存而不是选择器。

```powershell
python "对话归档/temporary-tools/2026-09/2026-09-16-dev-server-nostore.py" 8124
# → http://127.0.0.1:8124/
```

#### project-intro 文字条（内容条，2026-09-22 定稿；2026-10-01 类名词义化 s3→project-intro）

6 条文字条按 **3 排 × 每排 2 条**摆在成品图红框内，带椭圆描边、左右边缘渐隐与无缝流动。参数集中在 `static/css/index.css` 末尾「project-intro 文字条」段（`--intro-*` 变量），**定位只有这一处**（旧的逐条 `.art--project-intro-pN` 绝对定位已移除）。首页屏序已于 2026-10-01 重排为 1→7→5→6→2→3→4，类名已随语义化脱离位置编号（见 REQ-20260928-002 §16/§17）。

| 参数 | 定稿值 | 作用 |
|---|---|---|
| `.intro-pills` inset | `left 1% / top 16.5% / width 98% / height 64%` | 红框范围 |
| `--intro-pill-h` | `clamp(15px, 3.3vh, 34px)` | 文字条统一高度（图片按比例缩放） |
| `--intro-pill-line` | `#4c9dd3` | 描边色，与文字同色 |
| `--intro-pill-lw` | `2px` | 描边粗细 |
| `--intro-pill-radius` | `999px` | 扁椭圆；写 `50%` 是数学椭圆，但两端会切到文字 |
| `--intro-fade` | `12%` | 边缘淡化起点，到边缘正好 100% 透明 |
| `--intro-flow-dur` | `28s` | 流动周期，改 `0s` 即静止 |

结构约定：每排 `.intro-pills__track` 内含**两段完全相同**的 `.intro-pills__group`（第二段 `aria-hidden`），位移 50% 恰好等于一整段宽度；删掉第二段会跳帧。

#### 组件切片的坐标系偏差（板块 4–7 与原图偏差大的根因）

实测差异（`section-verify.json`，数值越小越接近原图）：板块1 = 8.1、板块2 = 9.2、板块3 = 13.1、**板块4 = 15.6**、**板块5 = 14.0**、板块6 = 9.8、板块7 = 8.9 —— 板块 4/5 最差。已确认五条根因：

1. **坐标系错配**：切片导出画布是 **2720×1600（1.700）**，原图是 **1080×608（1.776）**。切片按宽等比缩到 1080 时总高变成 635，比原图高 27px（4.4%）。按原图量出的百分比套到切片上，纵向越往下误差越大；板块 4–7 的内容都在画面下半部，所以偏差最集中。
2. **画布留白未裁**：`s7-mascot-peek` 的内容只占画布 x 0.14–0.87、y 0.26–0.75。不裁留白就按 `width%` 放置，会整体缩小并错位。放置任何切片前都要先裁到 alpha 边界。
3. **整幅画布被当单件使用**：`s5-cloud`（2720×1600）、`s5-hill`、`shared-cloud-1`、`shared-wave-2/3` 是未裁剪的整幅画布，却被按「云／山本身」的小宽度（50.4%、60%）摆放，尺寸与位置双错。
4. **素材被误删**：`s7-mascot-peek.webp` 在抠底时因判定「近乎全挖」被丢弃（`alpha-report.json` 记 minAlpha=0），导致板块 7 缺右下角吉祥物。已从 `backups/webp-original/` 取回并裁到 alpha 边界（1169×795）。
5. **白色圆角卡片缺失**：原图中板块 4 的流程图与板块 7 的图表都坐在白色圆角卡片上；而 `s4-workflow-diagram.webp` 是 **RGB 无 alpha** 的矩形裁切（白底、直角、无描边），直接平铺会失去卡片观感。

> 动板块 4–7 之前先解决第 1 条。坐标系没定标就调百分比，等于在上一次错误的基准上再调一次。

#### human-practices 定稿（FluNet 图表，2026-09-24；2026-10-01 类名词义化 s7→human-practices）

定位只有 `static/css/index.css` 搜「human-practices：FluNet 图表」这一处。

| 元件 | 定稿值 | 说明 |
|---|---|---|
| `s7-wave` | `left 0 / bottom 0 / width 100%`（不写 height） | 满宽横条，贴底 |
| `s7-title` | `left 18.1% / top 5.9% / width 63.3%` | 图表标题（两行） |
| `s7-chart` | `left 5% / top 20% / width 90%` + `padding 3% 1.2%` + `background #fff` | 原图卡片比例约 2.97，切片本身 3.98，用 padding 撑高 |
| `s7-axis` | `left 40.9% / top 76% / width 20.4%` | Week start date |
| `s7-legend-*` | `top 91.4%`（三条） | 图例压在底部蓝波上 |
| `s7-mascot` | `left 77.6% / top 70.4% / width 15.9%` | 素材曾误删，已从 `backups/webp-original/` 取回并裁留白 |

卡片圆角 / 描边 / 阴影由 CSS 补（切片是直角白底矩形，见根因 5）。

#### 本轮已清掉的死引用（2026-09-24）

- `executive-summary` 吸顶条 section：徽标块删除后只剩空容器，仍是 `100vh + sticky`，会以空白奶油底盖住视口 → 整段已删。
- `s2-dashed-arrow.webp`（板块2 虚线箭头）与徽标块 5 张图（`Animation/line.svg`、`DNA-transparent.webp`、`Gpa1.webp`、`human-derived genes.webp`）引用已从 `src/index.njk` 移除。
- `shared-cloud-1.webp` 已把不透明纯白底键成透明（消除奶油底上的补丁块），原图在 `backups/webp-original/`。
- `static/image/bc/画板+1.webp`（hero 背景）原 404 已修复：源位于 `src/_includes/head-extra/index.njk` 的 `<link rel="preload">`（URL 编码 `%E7%94%BB%E6%9D%BF+1.webp`），图从未存在，已删除该预加载引用（2026-09-27，经 `对话归档/temporary-tools/check-static-assets.js` 复核 0 死链）。

---
