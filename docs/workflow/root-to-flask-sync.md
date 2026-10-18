# 根站 → Flask 内容同步

> 本文件由根目录 `README.md` 分册而来（2026-10-17）。内容未做改写，
> 仅按主题归位；与 `README.md` 冲突时以 `README.md` 的红线章节为准。

## 十五、根站→Flask 内容同步决策（2026-09-13）

为让生产提交工程 `igem2026-flask` 的内容与根站保持一致，经逐页对比后确定如下同步策略（工作台账见 `Progress/PROG-20260913-001-root-to-flask-resync.md`）：

- **已整体同步的页面**（根站为权威源，整体覆盖 flask 同名页）：contribution、description、design、engineering、hardware、model、software、experiments、results、safety-and-security、attributions、members。其中 attributions 含成员照（jpg+webp，已处理 `srcset`）并复制 `attributions.css`+`mainClass`+`js/pages/attributions.js`；members 复制 `members.css`+`members.js`。
- **Human Practices 采用「合并」而非覆盖**（用户拍板，2026-09-13，避免毁掉 flask 专家地图）：保留 flask 已有的交互专家地图（hzMap、`data/hp-map-data.js`、`js/components/hp-map.js`）与「活动照片」子节，**不**整体覆盖；仅把根站 `integrated human-practices.html` 的「访谈对象与项目反馈」可读专家档案段（7 位专家 + 4 个说明子节）以独立 `content-card` 合并进 flask 主 HP 页 `page_content` 末尾，补齐 flask 原"仅有地图、无可读正文"的缺口。education 页两站章节结构已逐一完全一致，无需改动。
- **新增页面**：`social-groups.html`（根站独有，flask 原缺，新增最小页以修复潜在导航 404）。
- **跳过 / 待办**：`parts.html` 与 `social-groups.html` 根站本身亦仅为占位（无真实内容），同步无意义，标记待撰写；flask 独有 5 页（alternative-platform / entrepreneurship / inclusivity / measurement / sustainability）无根站源，需另开需求撰写。
- **约束遵守**：全程复用 flask 现有 `layout.html` 块体系（`{% block page_content %}`/`styles`/`scripts`），不引入第三方 CDN、不写内联 `<script>`（仅 `defer` 外链），正文图片经 `../static/`→`/static/` 改写并 vendored 本地；全站冻结无 `../` 残留、无 404。

---
