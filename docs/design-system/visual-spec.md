# 设计系统核心视觉规范

> 本文件由根目录 `README.md` 分册而来（2026-10-17）。内容未做改写，
> 仅按主题归位；与 `README.md` 冲突时以 `README.md` 的红线章节为准。

## 四、设计系统核心视觉规范

以下数值均来自 `navigation.css` / `description.css` / `index.css` 的 `:root` 令牌，并已用浏览器计算样式交叉验证。

### 4.1 色彩系统

**基础色板（全局令牌，定义于 navigation.css）：**

| 角色 | 变量 | 值 |
|---|---|---|
| 主色 Primary（米黄/奶油） | `--color-beige` / `--bg-page` / `--bg-dropdown` / `--bg-sidebar` | `#FFF8E7` / `rgba(252, 231, 203, 0.9)` |
| 辅色 Secondary（暖棕） | `--color-primary` / `--color-brown` | `#8B5A2B` |
| 辅色深 | `--color-primary-dark` / `--color-brown-dark` | `#5D3A1A` |
| 辅色浅 | `--color-primary-light` / `--color-brown-light` | `#D4A574` |
| 主色极浅 | `--color-brown-lighter` | `rgba(139,90,43,0.05)` |
| 正文文字 | `--color-text` | `#333` |
| 次级文字 | `--color-text-light` | `#666` |
| 三级文字 | `--color-text-lighter` | `#999` |
| 卡片背景 | `--bg-card` | `#ffffff` |
| 页面背景 | `--bg-page` | `rgba(252, 231, 203, 0.9)`（暖奶油，米黄主色） |
| 侧边栏背景 | `--bg-sidebar` | `#FFF8E7`（米黄主色） |
| 页脚背景 | `--bg-footer` | `#4A90E2`（蓝，footer 专属） |
| 浅灰背景 | `--color-bg-gray` | `#f4f4f4` |

**强调色（仅作点缀，不可泛滥使用）：**

| 用途 | 值 |
|---|---|
| 链接蓝 | `#4285F4`（hover `#1A73E8`） |
| footer 蓝（强调 ACCENT，仅 footer） | `#4A90E2` / `#3570B5` |
| 成功/绿色 | `#2D5A3D` / `#2E7D32` |
| 绿色方案 | `#5A9A5A` / `#3D7A3D` |

**内容页专属色板（description.css，统一加 `--desc-` 前缀，刻意避免与全局令牌冲突）：**
`--desc-color-primary:#8B5A2B`、`--desc-color-primary-dark:#5D4E37`、`--desc-color-primary-light:#D4A574`、卡片悬停 `rgba(139,90,43,0.08)`、高亮 `rgba(245,238,225,0.7)`、边框 `rgba(212,165,116,0.2)` 等。

### 4.2 字体系统

- **字体栈（全局唯一）：** `system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif`。**禁止引入其他字体族**（iconfont 图标字体除外）。
- **全局字号令牌：** `--font-size-xs:.7rem` `--font-size-sm:.8rem` `--font-size-md:.9rem` `--font-size-lg:1.1rem` `--font-size-xl:1.3rem` `--font-size-2xl:3rem`。
- **正文排版：** `body` 行高 `1.7`；标准内容段落 `font-size:1rem`、行高 `1.8`。
- **标题层级（`.content-section` 全局规范）：** `h1` `2.2rem`/700、`h2` `1.6rem`/600、`h3` `1.25rem`/600，字色 `#5D3A1A`，行高 `1.3`，字距 `-0.01em`。
- **内容页实测计算值（description.css 覆盖后）：** `h2 ≈ 24.8px`、`h3 ≈ 17.6px`、正文 `p ≈ 15.04px`。说明标题尺寸在内容页由 `--desc-font-size-*` 系列重新定义（`--desc-font-size-3xl:1.55rem` 等）。

### 4.3 间距系统

全局令牌：`--spacing-xs:.25rem` `--spacing-sm:.5rem` `--spacing-md:.75rem` `--spacing-lg:1rem` `--spacing-xl:1.25rem` `--spacing-2xl:1.5rem` `--spacing-3xl:2rem` `--spacing-4xl:2.5rem` `--spacing-5xl:4rem`。内容页另有一套 `--desc-spacing-*` 同值体系。**所有间距必须用令牌，禁止随意写死数值。**

### 4.4 圆角系统

`--radius-xs:.5rem` `--radius-sm:.625rem` `--radius-md:.75rem` `--radius-lg:1rem` `--radius-full:50%` `--radius-pill:624.9375rem`。卡片/容器默认 `md`(0.75rem)，胶囊按钮用 `pill`。

### 4.5 阴影系统

- 卡片：`--shadow-card: 0 0.125rem 0.5rem rgba(139,90,43,0.3)`（偏暖棕调）。
- 导航：`--shadow-nav: 0 0.375rem 1.5625rem rgba(139,90,43,0.4)`。
- 侧边栏：`--shadow-sidebar: 0 0.5rem 2rem rgba(139,90,43,0.1)`。
- 内容卡片（description.css）：`--desc-shadow-card: 0 4px 12px rgba(139,90,43,0.06)`（更轻）。

### 4.6 动效风格

- **缓动函数：** `--ease-smooth: cubic-bezier(0.16, 1, 0.3, 1)`（主），`--ease-default: ease`。
- **时长：** `--duration-fast:.2s` `--duration-normal:.3s` `--duration-slow:.4s` `--duration-scroll:25s`（长滚动装饰用）。
- **风格基调：** 柔和、克制、以位移与透明度为主。导航栏滚动收缩+阴影、智能隐藏（`.nav-hidden` translateY(-100%)）、侧边栏烧瓶进度随滚动上升、两侧浮动装饰（`df-art`）随滚动淡入淡出。
- **约束：** 禁止突兀/过长的动画；新增动效必须复用令牌时长与 `--ease-smooth`。

---
