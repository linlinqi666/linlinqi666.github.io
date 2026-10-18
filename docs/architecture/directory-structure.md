# 文件层级与目录结构

> 本文件由根目录 `README.md` 分册而来（2026-10-17）。内容未做改写，
> 仅按主题归位；与 `README.md` 冲突时以 `README.md` 的红线章节为准。

## 二、文件层级与目录结构

```
SZPU-2026 wiki/
├── index.html                      # 首页（落地页，无侧边栏）
├── README.md         # 本全局指导文档（唯一权威依据，!被 .gitignore 保留）
├── package.json / package-lock.json# 依赖声明（playwright-core）+ npm 脚本；支撑 npm run normalize
├── .gitignore                      # 忽略规则（含 /对话归档/、.playwright-cli/ 等非提交产物）
├── .github/                        # GitHub Pages 部署工作流（static.yml）
├── node_modules/                   # 依赖安装目录（.gitignore 忽略，不入库）
├── 对话归档/                       # 对话非正式文件归集地（.gitignore 忽略）
│   ├── README.md                   # 分类边界、目录树与维护清单
│   ├── analysis/                   # 分析、抓取与 OCR 输出
│   ├── backups/                    # 原始页面与修改前快照
│   ├── plans/                      # 执行与迁移计划
│   ├── research-reports/           # 调研、审计与总结报告
│   ├── screenshots/                # 截图与视觉验证图
│   ├── temporary-tools/            # 临时调试与抓取脚本
│   └── tests/                      # 演示、测试页与回归材料
├── tools/                          # 正式工程化脚本（非临时调试）
├── dry-lab/                        # 干实验板块
│   ├── hardware.html
│   ├── model.html
│   └── software.html
├── wet-lab/                        # 湿实验板块
│   ├── protocol.html               # 实验方案：材料 / 配方 / 步骤 / 对照（同上拆出）
│   ├── parts.html
│   ├── result.html
│   ├── safety.html
│   └── notebook.html
├── human-practices/                # 人类实践板块
│   ├── education.html
│   ├── integrated human-practices.html   # 综合 HP（含 3D 圆环轮播等特殊组件）
│   └── sustainability.html
├── project/                        # 项目正文板块
│   ├── description.html
│   ├── design.html
│   ├── engineering.html
│   └── contribution.html
├── team/                           # 团队板块
│   ├── members.html
│   └── attributions.html
└── static/                         # 所有静态资源（关键！）
    ├── css/
    │   ├── index.css               # 全局基础与重置样式
    │   ├── description.css         # 内容页布局（侧边栏/卡片/装饰）
    │   ├── mobile.css              # 响应式，必须最后加载
    │   ├── navigation/
    │   │   └── navigation.css      # 全局导航栏 + 全部 :root 设计令牌
    │   ├── components/             # 组件级 CSS
    │   │   ├── page-progress-bar.css
    │   │   ├── scroll-progress-bar.css
    │   │   └── index-intro-gif.css   # 首页 GIF 开场动画（见 5.13）
    │   └── ...（各页面专属 CSS，部分为占位空文件）
    ├── js/
    │   ├── core/                   # 核心脚本
    │   │   ├── utils.js            # 公共工具库（必须先加载，无依赖）
    │   │   ├── mobile-menu.js
    │   │   ├── page-progress-bar.js
    │   │   ├── scroll-progress-bar.js
    │   │   ├── nav-scroll-behavior.js
    │   │   ├── search.js           # 全站搜索模块（见 5.11）
    │   │   ├── search-index.json   # 由 search-index-generator.js 生成的搜索索引（首次打开搜索时 fetch 按需加载，约 217KB）
    │   │   └── search-index-generator.js  # Node 脚本，扫描全站页面生成 search-index.json
    │   ├── components/             # 页面组件脚本（位于 static/js/ 下，与 core/、pages/ 同级）
    │   │   ├── sidebar-progress.js # 侧边栏烧瓶进度 + TOC 高亮（内容页）
    │   │   ├── hp-carousel.js      # 3D 圆环轮播（见第十二节）
    │   │   ├── hp-reveal-box.js    # HP 下拉揭示盒
    │   │   ├── executive-summary-animation.js  # 首页 10 屏滚动驱动 + 酵母浮动 + 打字机（见 5.12 首页分屏）
    │   │   └── index-intro-gif.js              # 首页 GIF 开场动画控制器（见 5.13）
    │   ├── pages/                  # 页面专属脚本
    │   │   ├── members.js
    │   │   └── attributions.js
    │   └── hp-timeline-3d.js       # 3D 时间轴圆环引擎（当前未被任何页面引用，见 5.10/十四）
    └── image/                      # 所有图片资源
        ├── nav_bc.webp             # 导航栏背景图
        └── HP/                     # HP 板块图片（expert.jpg, school1~4.jpg 等）
```

---
