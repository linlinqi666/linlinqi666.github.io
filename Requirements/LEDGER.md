# 需求台账

> 记录每个非 Bug 的功能/功能优化/体验优化需求。Bug 见文末「Bug 区」。复杂、长期或跨模块需求须另建 `REQ-YYYYMMDD-NNN.md` 详细记录，并在此登记链接。

## 需求区

| ID | 标题 | 类型 | 工程 | 状态 | 详细记录 | 进度文档 | 最近更新 |
|---|---|---|---|---|---|---|---|
| REQ-20260826-001 | 根站 JavaScript 插件治理（第一阶段） | 体验优化 | 根站 | 进行中 | `REQ-20260826-001.md` | `Progress/PROG-REQ-20260826-001-static-js-plugin-governance.md` | 2026-08-26 |
| REQ-20260826-002 | 根站内容同步至 Flask 站（逐页核对，仅补缺口） | 体验优化 | 跨工程 | 已完成 | `REQ-20260826-002.md` | `Progress/PROG-REQ-20260826-002-root-to-flask-sync.md` | 2026-08-26 |
| REQ-20260904-001 | 首页 GIF 开场动画（第一屏全屏，播完后显示导航栏） | 功能 | 根站 | 已完成 | `REQ-20260904-001.md` | — | 2026-09-04 |
| REQ-20260915-001 | Team 成员页分类重组与 PI / WIKI 成员入列 | 功能 | 跨工程 | 进行中 | `REQ-20260915-001.md` | `Progress/PROG-REQ-20260915-001-team-members-refactor.md` | 2026-09-15 |
| REQ-20260916-001 | 成员页响应式重构 + 全屏引导封面 | 功能/体验优化 | 跨工程 | 已完成 | `REQ-20260916-001.md` | `Progress/PROG-REQ-20260916-001-members-responsive-intro.md` | 2026-09-16 |
| REQ-20260916-001 | 提交与入库规范立项：忽略零引用图片、README 立提交规范 | 治理/规范 | 跨工程 | 进行中 | `REQ-20260916-001.md` | — | 2026-09-16 |
| REQ-20260922-001 | 实验三页按页面资料包重建（Experiments / Results / Contribution） | 功能（内容重建） | 根站（flask 待同步） | 进行中 | `REQ-20260922-001.md` | `Progress/PROG-REQ-20260922-001-three-pages-rebuild.md` | 2026-09-22 |
| REQ-20260926-001 | 四个模块 result 源语料化 + Results 页按结果源重写 | 内容（语料建设 + 页面重建） | 根站（flask 待同步） | 进行中 | `REQ-20260926-001.md` | `Progress/PROG-REQ-20260926-001-result-corpus-and-page.md` | 2026-09-26 |
| REQ-20260926-002 | 实验页拆分为 Design（实验设计）与 Protocol（实验方案）两页 | 功能（页面拆分） | 根站（flask 待同步） | 进行中 | `REQ-20260926-002.md` | — | 2026-09-27 |
| REQ-20260927-001 | dry-lab Model 页重写 + 交互演示（纳米抗体 × 甲流 HA 对接卡牌） | 功能（页面重写 + 交互） | 根站（flask 待同步） | 进行中 | `REQ-20260927-001.md` | — | 2026-09-27 |
| REQ-20260928-001 | 首页交互体验打磨（吸附偏移 / 导航 Hover 呼出 / GIF 开场 / 酵母浮动） | 体验优化 | 根站（flask 待同步） | 已完成 | `REQ-20260928-001.md` | — | 2026-09-28 |
| REQ-20260928-002 | 首页移动端适配（C 先行：CSS 缩放备选 / A 待定：美工专属素材） | 体验优化 | 根站（flask 待同步） | 进行中 | `REQ-20260928-002.md` | — | 2026-09-28 |
| REQ-20261001-001 | 首页 statistics（检测方法）屏「CGIS 揭示」交互动画 | 功能（交互动画） | 根站（flask 待同步） | 已完成 | `REQ-20261001-001.md` | — | 2026-10-01 |
| REQ-20261002-001 | 首页 dbtl-cycle 屏原理示意图「想法泵出」入场动画 | 功能（入场动画） | 根站（flask 待同步） | 已完成 | `REQ-20261002-001.md` | — | 2026-10-02 |
| REQ-20261003-001 | 首页新增「甲流负担」屏（1 in 12 剧场 + WHO 数据文案） | 功能（新增分屏） | 根站（flask 待同步） | 已完成 | `REQ-20261003-001.md` | — | 2026-10-03 |
| REQ-20261004-001 | 加载动画 6 帧→2 帧 + 探索屏四吉祥物门户 + 全站返回顶部组件 | 功能（素材替换 / 区块改版 / 新组件） | 根站 + flask（已同步，6 张图待传 CDN） | 已完成 | `REQ-20261004-001.md` | — | 2026-10-04 |
| REQ-20261003-002 | Model 页对接卡牌：刚性/半柔性双模式 + 随机抽 6 选 1 排名 + 真实复合物 + 卡面图标 + 修 Reload | 功能（交互改造） | 跨工程（已双站同步） | 已完成 | `REQ-20261003-002.md` | — | 2026-10-03 |
| REQ-20261005-001 | 首页 statistics 三方法信息条二段动画 + 首页离屏动画停表 | 功能（交互动画）+ 性能优化 | 根站（flask 待同步） | 已完成 | \REQ-20261005-001.md\ | — | 2026-10-05 |
| REQ-20261006-001 | 首页插画换新（美工 20 张透明图）+ 第二屏右下角病毒 + 轮播药丸白底 + 第一屏波浪/图例字体插图回归/统计图换新 | 体验优化 | 根站（flask 待同步） | 进行中（10-06c 回退 12 张角色装饰；10-06d 图例字号统一、错配字图清除；10-06e 五屏标题改美工字图 8/12/14/20 紧裁 + future-vision 标题 21/22 英文字图 + hero 9/10 重命名上屏删旧 webp） | `对话归档/implementation/2026-10-06-index-art-swap.md`、`对话归档/implementation/2026-10-06b-hero-wave-legends-gif-fix.md` | — | 2026-10-06 |
| （示例）REQ-20260823-001 | 示例需求 | 功能 | 根站 | 待确认 | `REQ-20260823-001.md` | — | 2026-08-23 |

## 记录规范

- ID：`REQ-YYYYMMDD-NNN`（按创建日期与当日序号）。
- 工程：`根站`（根目录 Eleventy 站点）或 `flask`（`igem2026-flask`）；跨工程单独标注为「跨工程」。
- 状态：`待确认` / `进行中` / `已完成` / `已归档` / `已拒绝`。
- 跨模块需求必须写详细记录，至少包含：写入入口、读取方与刷新/恢复路径、失败/取消/回滚与安全边界、已检查但不受影响的模块、行为验收矩阵。

## Bug 区

| ID | 现象 | 影响 | 工程 | 根因 | 修复 | 验证 | 状态 |
|---|---|---|---|---|---|---|---|
| BUG-20260823-001 | 人类实践轮播点击后页面跳动、第四篇定位偏移且前文残留 | 点击轮播图会触发视口滚动，详情轨道按百分比定位并在响应式/内容高度变化时出现错位；地图图钉和轮播详情缺少完整切换链路 | 根站 | 点击处理调用 `scrollIntoView`；详情轨道未按当前视口实际宽度重新定位，非当前幻灯片未明确视觉隐藏；图钉未绑定专家详情轨道 | 轮播改为稳定 `data-hp-article` 注册表和 `translate3d` 整篇切换；移除纵向滚动；非当前文章设置 `aria-hidden`/`inert`；图钉按 `data-hz-expert` 切换专家详情并同步动态高度 | `npm run build:all`、`node --check static/js/components/hp-flat-carousel.js` 通过；HTTP 页面已生成并核对标识与点击逻辑；浏览器自动化工具不可用，需人工点击复核 | 已完成 |
| BUG-20261005-001 | 首页滚回 project-intro 屏后药丸轮播停止（动画停在 paused） | 轮播优点屏回到视口不再滚动，视觉上「卡死」 | 根站 | 2026-10-05 离屏停表（home-idle-motion.js）初版用 `threshold:0 + ratio===0` 判定：Chrome 在相邻屏「边界相切」（ratio 恰为 0 且 isIntersecting 仍 true）进出该状态都可能不产生 IO 回调，快速滚到相邻屏时 data-offscreen 残留，滚回视口收不到恢复回调 | 改为 rootMargin 12% 缓冲带 + 布尔 isIntersecting 判定（相切态视为可见；离/进缓冲带是真翻转，IO 可靠触发）；另加滚动节流兜底 sweep：已打标 section 矩形与视口相交即立即摘除 | playwright 实测：相邻屏往返不打标、滚回 running 且 currentTime 增长；真离屏打标→滚回即恢复；兜底 sweep 误标场景实测生效；十屏回归 0 错误 0 断链 | 已完成 |
| BUG-20261006-001 | 弱网下首页 GIF 入场动画被「挤掉」（开场层直接消失/跳过） | 网速慢时开场 GIF 播不出或播一半消失，直接进页面 | 根站 | head 内联看门狗（head-extra/index.njk）在 pageloader:done 后 6s 检查 `intro-gif-running`，弱网下 29MB GIF 尚未下载完即被强加 `intro-gif-finished`；叠加 masterFinishTimer 在 start() 即起算（GIF 未开播也 9.2s 掐）与 GIF 请求过晚发起（等 loader 收尾后才下载） | 组件 init 挂出 `window.__introGifWaiting`，看门狗见标志不强判（改交组件 20s 单帧超时收尾 + 30s 二级硬兜底）；masterFinishTimer 改首帧开播后起算、唯一帧加载失败直接 finish；init 即预取首帧与关键图并行 | route 挂起 GIF 实测：挂起 8s（越过 6s 看门狗）running 保持无 finished，放行后正常播放至收尾；组件 404 时 6s 兜底解锁保持（降级红线）；十屏回归 0 错误 0 断链 | 已完成 |
| BUG-20261005-002 | 根站 protocol 页内嵌 PDF 无法显示，浏览器报「协议不支持」 | `wet-lab/protocol.html` 的 PDF 阅读区空白，只显示 fallback 文案；CDN 上的 PDF 本身正常（HTTP 200, application/pdf, 249,525 字节） | 根站 | `src/_includes/partials/pdf-embed.njk` 无条件把 front matter 的 `basePath`（protocol.njk 为 `../`）拼到 `pdfUrl` 前。2026-09-30 该页 `pdfUrl` 改用绝对地址 `https://static.igem.wiki/...`，拼出的 `data="../https://static.igem.wiki/..."` 被浏览器按未知协议解析，故报协议不支持（flask 站写的是纯绝对 URL，未受影响） | partial 改为按地址类型分支：绝对 URL（`http(s)://` 或 `//`）原样使用，仅站内相对路径才拼 `basePath`；绝对性判断用新增 `isRemoteUrl` filter（JS 正则），不用 Nunjucks 内置 `slice`——其底层 `Array.prototype.slice` 作用于字符串返回字符数组，与字符串比较恒为 false（此坑已踩过一次） | `npm run build:all` 通过且复跑幂等；产物 `wet-lab/protocol.html` 的 `data` 已是纯绝对 URL；`curl` 探测 CDN 200 / `application/pdf`；未做浏览器端渲染截图 | 已完成 |

