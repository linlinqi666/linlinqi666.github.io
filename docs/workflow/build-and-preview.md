# 本地预览与构建命令

> 本文件由根目录 `README.md` 分册而来（2026-10-17）。内容未做改写，
> 仅按主题归位；与 `README.md` 冲突时以 `README.md` 的红线章节为准。

## 十、本地预览命令

由于 `file:` 协议会拦截资源，测试请使用本地 HTTP 服务：

```powershell
cd "f:\IGEM\SZPU-2026 wiki"
python -m http.server 8080 --bind 127.0.0.1
# 浏览器访问 http://127.0.0.1:8080/index.html
```

### 10.1 构建命令与 npm 退出码陷阱（2026-09-16 实测）

`package.json` 定义的 `build:all` = `eleventy && node static/js/core/search-index-generator.js && node tools/check-static-assets.js && node tools/check-performance-budget.js`。

**注意：在本项目当前的 Windows 沙箱 shell 中，`npm run <script>` 无法执行脚本** —— `npm run build`、`npm run test:smoke` 均静默 `exit 1`、子进程无任何输出，`eleventy` 也未真正运行（产物时间戳不刷新）。此时 `npm run build:all` 的退出码**不能**作为构建结论，请改为逐条执行等价命令并各自核对退出码：

```powershell
cd "f:\IGEM\SZPU-2026 wiki"
npx eleventy                                    # 生成各栏目 HTML（当前 18 页）
node static/js/core/search-index-generator.js   # 生成 static/js/core/search-index.json
node tools/check-static-assets.js               # 静态资源引用检查
node tools/check-performance-budget.js          # 性能预算（见 14.5；members.js 现为 46 KB）
```

在能正常运行 npm 的环境（CI / 正常终端）中，仍以 `npm run build:all` 为准；若它失败，按上面四条逐条定位。

---
