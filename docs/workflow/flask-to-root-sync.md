# Flask 站 → 根站内容同步

> 与 `root-to-flask-sync.md`（2026-09-13，根站为权威源）**方向相反**。
> 本文件记录 2026-10-26 用户拍板的反向同步口径：`igem2026-flask/` 为权威源 → 覆盖根站页面正文。
> 两站技术栈不同，**只同步内容与资源，不搬迁运行框架**；与 `README.md` 红线冲突时以 `README.md` 为准。

## 一、同步方式：脚本化 `block main` 注入

转换器：`对话归档/temporary-tools/2026-10/2026-10-26-flask-to-root-sync.py`

```
python 对话归档/temporary-tools/2026-10/2026-10-26-flask-to-root-sync.py           # 只读体检报告
python …/2026-10-26-flask-to-root-sync.py --apply [--only results,model]           # 写回根站
```

执行动作（幂等，重跑结果一致）：

1. 解析 Flask 页 `{% block %}`（`page_content` / `styles` / `scripts` / `body_scripts` / `head_extra`）；
2. 正文做 Jinja→Nunjucks 改写后，**整体替换**根站 njk 的 `{% block main %}`；
3. `styles` 内联 CSS 写入 `static/css/flask-sync/<slug>.css` 并挂进 front matter `css`（整体重写，不手改）；
4. `scripts` / `body_scripts` 外链 JS 并入 front matter `js`，内联脚本进页面 `{% block scripts %}`；
5. 修改前把原 njk 备份到 `对话归档/backups/2026-10-flask-to-root-sync/src/…`（**只备份首次版本**）。

### 1.1 语法改写对照

| Flask / Jinja | 根站 / Nunjucks | 说明 |
|---|---|---|
| `url_for('static', filename='css/x.css')` | `{{ basePath \| default('') }}static/css/x.css` | CSS 走 `CSS_MAP` 改名表 |
| `url_for('pages', page='results')` | `{{ basePath \| default('') }}wet-lab/result.html` | 按路由映射表转换 |
| `url_for('home')` | `{{ basePath \| default('') }}index.html` | |
| `{{ media('rel') }}` / CDN 字面量 | `{{ basePath \| default('') }}static/image/<本地路径>` | 见 §2 |
| `{{ img_placeholder(alt, cls) }}` | 展开为内联 SVG `<img>` | 根站无该 macro |
| `{{ request.script_root }}` | `{{ basePath \| default('') }}` | Model 页 `SITE_ROOT` |
| `\| tojson` | `\| dump \| safe` | |
| `{% from "macros.html" import … %}`、`{% set active_page %}`、`{% extends %}` | 删除 | 根站布局在 `base.njk` |
| `{{ assetV }}` | 保留 | 由 `.eleventy.js` 注入 |
| `{% raw %}…{% endraw %}` | **原样保留** | 内部是 JS 动态拼路径，改写会把 `basePath` 变成字面量导致 404 |

### 1.2 页面路由映射（16 页，沿用根站路径）

| Flask 页面 | 根站模板 | 产物 |
|---|---|---|
| `home.html` | `src/index.njk` | `index.html` |
| `description` / `design` / `engineering` / `contribution` | `src/project/*.njk` | `project/*.html` |
| `model` / `hardware` | `src/dry-lab/*.njk` | `dry-lab/*.html` |
| `protocol` / `results` / `parts` / `safety-and-security` / `notebook` | `src/wet-lab/{protocol,result,parts,safety,notebook}.njk` | `wet-lab/*.html` |
| `human-practices` | `src/human-practices/integrated human-practices.njk` | 同名 html（含空格） |
| `sustainability` | `src/human-practices/sustainability.njk` | 同名 html |
| `team` | `src/team/members.njk` | `team/members.html` |
| `attributions` | `src/team/attributions.njk` | `team/attributions.html` |
| `entrepreneurship` / `inclusivity` / `measurement` | **不迁移** | 官方模板 stub，我方不参与 |

### 1.3 框架等价映射（不搬迁文件，只对齐语义）

| Flask 侧 | 根站等价物 |
|---|---|
| `app.py` `@app.route("/<page>")` | front matter `permalink`（带目录 + `.html`） |
| `FREEZER_BASE_URL` / 绝对链接 | front matter `basePath`（首页空、子页 `../`） |
| `app.py:_asset_version()` | `.eleventy.js:computeAssetV()`（css/js 最新 mtime） |
| `wiki/layout.html` 7 个 block | `layouts/base.njk` `main`/`scripts` + `partials/head.njk` |
| `wiki/menu.html` / `footer.html` | `partials/nav.njk` / `partials/footer.njk`（**硬编码，不随同步改**） |
| `static/data/dry-lab/model/*.json` + Python 桥 | `src/_data/modelDocking.js` / `modelGame.js` |
| `tools/search_index_generator.py` | `static/js/core/search-index-generator.js`（唯一事实源） |
| `dependencies.txt`（Flask/Frozen-Flask） | `package.json`（Eleventy 3.x） |

## 二、图片回映射（用户拍板：本地优先）

Flask 图片是 CDN 绝对地址（`https://static.igem.wiki/teams/6373/wiki/...`，多为 `.avif`），根站是本地 `static/image/…`。
转换器按三级回映射：

1. **同路径命中**：根站 `static/image/<rel>` 已存在 → 直接用；
2. **文件名主干命中**：去分隔符与 `-fix/-fix1/-fix2` 后缀后归一化匹配；同名冲突时优选父目录名与 CDN 父目录一致者；
3. **暂存回补**：命中 `igem2026-flask/static/image/wait/` 的原件 → **原格式、原文件名**复制到根站 `static/image/<rel>`（2026-10-26 回补 110 个）；
4. 三级都不中 → **保留 CDN 绝对地址**，写入 `对话归档/verification/2026-10-26-flask-to-root-sync-unresolved.txt` 待人工处理（当前 33 条，主要是 16 个成员头像 `team/NN-xxx-avatar.webp`——本地与 wait 均无原件）。

## 三、必须满足的约束条件

1. **改源不改产物**：只改 `src/**/*.njk`，禁止直接编辑根目录 HTML；同步后必须 `npm run build:all`。
2. **不得混用构建命令**：根站 `npm run build:all`；flask 站 `flask freeze`；两站不得复制对方构建产物。
3. **图片契约**：`tools/check-image-contract.mjs` 强制 `<img>` 带 `width`+`height`、`data-tier ∈ l0/l1/l2`；`build:all` 首步即跑，违规直接失败（需要豁免时改 `tools/image-contract-baseline.json`，不得绕过脚本）。
4. **素材格式保持原**：不得转码（PNG→WebP、→AVIF）或改名；wait 回补是原样复制。
5. **不重复注入脚本**：`home`/`team`/`human-practices` 的 `scripts` 块是根站外置 JS 的副本，重复注入会双初始化 → 列入 `SKIP_INLINE_SCRIPTS` 跳过。
6. **不覆盖根站 head-extra**：`index.njk`/`team-members.njk` 的 arm 脚本属根站机制，flask 的 `head_extra` 不另建 partial（`SKIP_HEAD_EXTRA`）。
7. **文本规范红线**：基因符号/拉丁学名斜体、引用角标可跳转（见 `README.md` 全站文本规范与 `docs/design-system/text-standards.md`）；同步不豁免这些规则。
8. **内容语义不得因迁移改变**：实验记录、访谈证据、团队归因、项目结论禁止改写或压缩；不得把设计机制写成已验证结果（`.codebuddy/rules/PAGER-yeast.mdc`）。
9. **对话产物归位**：脚本与中间报告放 `对话归档/temporary-tools/2026-10/`，备份放 `对话归档/backups/`，验证记录放 `对话归档/verification/`；均不入库。
10. **推送由用户执行**：AI 不 commit / push / freeze；只交付文件清单与校验结果。
11. **两站目录边界**：`igem2026-flask/` 不被本次同步反向修改；根站 `static/css/flask-sync/` 为本同步专用，勿手改。

## 四、同步后验证清单

| 步骤 | 命令 | 判据 |
|---|---|---|
| 1 正式构建 | `npm run build:all` | 图片契约 + Eleventy + 搜索索引三步全过 |
| 2 资源落地 | `python 对话归档/temporary-tools/2026-10/2026-10-26-root-asset-check.py` | 16 页缺失引用 = 0 |
| 3 HTTP 冒烟 | `python …/2026-10-26-root-smoke.py` | 16 页 200，抽查资源 0 失败 |
| 4 完整性 | `python …/2026-10-26-root-integrity-check.py` | 残留模板语法 = 0；`MODEL_GAME_DATA` 非空 |
| 5 CDN 兜底复核 | 读 `对话归档/verification/2026-10-26-flask-to-root-sync-unresolved.txt` | 逐条确认是"仅存于 CDN"而非漏映射 |

## 五、已知偏差（非阻塞，需知情）

1. **成员头像走 CDN**：根站原用本地卡通形象 `any-icon/character/webp/<id>.webp`，flask 用真实照片 `team/NN-xxx-avatar.webp`（仅存 CDN）；同步后成员页按 flask 口径走 CDN 照片。
2. **数据绑定退化为静态**：`hardware` / `parts` / `safety` / `attributions` / `contribution` 在根站原由 `src/_data/*.js` 驱动，flask 侧是渲染后的静态 HTML；同步后正文与 `_data` 不再联动（后续改数据需两处同步）。
3. **flask-sync CSS**：flask 页内联样式集中到 `static/css/flask-sync/<slug>.css`，与根站同名 CSS（`result.css` 等）并存，层叠顺序为「页面 CSS → flask-sync CSS → mobile/components」。
4. **浏览器 console 冒烟未执行**：本机 `chrome-headless-shell` 启动失败（ICU 报错），本次只完成 HTTP 层冒烟。
