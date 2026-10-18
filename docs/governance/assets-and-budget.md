# 图片与资源约定

> 本文件由根目录 `README.md` 分册而来（2026-10-17）。内容未做改写，
> 仅按主题归位；与 `README.md` 冲突时以 `README.md` 的红线章节为准。

## 六、图片与资源约定

- 所有图片归入 `static/image/`（导航背景 `nav_bc.webp`、HP 图片在 `static/image/HP/`）。
- **路径前缀规则：** 根目录页面用 `static/image/...`；子目录页面（如 `project/description.html`）必须用 `../static/image/...`。
- 引用图片前**必须确认文件真实存在于磁盘**，否则图片不显示。当前 HP 目录仅有 `expert.jpg`、`school1~4.jpg` 等少数真实文件；其余活动照片（如 `tsinghua-1~4.jpg`、`southchina-1~4.jpg`、`lecture-*.jpg`、`WWJ.png`）并不存在。
- 建议为 `<img>` 保留 `onerror` 兜底（显示"待补"或默认图），避免破图破坏版式。

---
