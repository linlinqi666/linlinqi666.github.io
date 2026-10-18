# docs/ 长阅读文档分册

本目录存放从根目录 `README.md` 拆出的长阅读文档（2026-10-17）。拆分目的：让每次任务只加载需要的那一册，而不是一次性吞掉 1359 行。

## 分册规则

- 一册一个主题，单文件控制在 **300 行以内**；超过就再拆。
- 主索引在根目录 `README.md`，本文件是 `docs/` 内部导航。
- 与 `README.md` 冲突时，以 `README.md` 的红线章节为准。

## 目录职责

| 子目录 | 放什么 | 不放什么 |
|---|---|---|
| `architecture/` | 目录结构、依赖关系、JS 架构、子系统机制、加载动画 | 组件视觉规范 |
| `design-system/` | 色彩/字体/间距/圆角/阴影/动效、页面框架、内容页规范 | 构建与发布流程 |
| `workflow/` | 构建与预览、新页模板、根站→Flask 同步、Git 规范、脚本工具 | 一次性案例 |
| `governance/` | 归档分类字典、`.gitignore`、素材与体积预算、编码红线 | 页面实现细节 |
| `cases/` | 已发现问题、组件案例、性能分析等**带时间与结论**的记录 | 长期有效的规范 |

判断口诀：**长期有效进前三类和治理目录，带日期和结论的进 `cases/`**。

## 文件清单

- `architecture/`：overview、directory-structure、dependencies、js-and-subsystems、page-loader
- `design-system/`：visual-spec、page-framework、content-page-standard、team-and-home
- `workflow/`：development-constraints、new-page-template、build-and-preview、root-to-flask-sync、git-conventions、tooling
- `governance/`：archive-and-gitignore、assets-and-budget
- `cases/`：known-issues、hp-carousel、performance
