# 新内容页快速模板

> 本文件由根目录 `README.md` 分册而来（2026-10-17）。内容未做改写，
> 仅按主题归位；与 `README.md` 冲突时以 `README.md` 的红线章节为准。

## 九、新内容页快速模板（推荐复制起点）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>页面标题 - SZPU-2026</title>
  <!-- 共享 CSS：顺序不可变，mobile.css 必须最后 -->
  <link rel="stylesheet" href="../static/css/navigation/navigation.css">
  <link rel="stylesheet" href="../static/css/index.css">
  <link rel="stylesheet" href="../static/css/description.css">
  <link rel="stylesheet" href="../static/css/[页面专属].css">
  <link rel="stylesheet" href="../static/css/mobile.css">
  <link rel="stylesheet" href="../static/css/components/page-progress-bar.css">
  <link rel="stylesheet" href="../static/css/components/scroll-progress-bar.css">
  <!-- JS：统一置于 head + defer，utils 最先（根目录页面前缀改为 static/） -->
  <script src="../static/js/core/utils.js" defer></script>
  <script src="../static/js/components/sidebar-progress.js" defer></script>
  <script src="../static/js/core/mobile-menu.js" defer></script>
  <script src="../static/js/core/page-progress-bar.js" defer></script>
  <script src="../static/js/core/scroll-progress-bar.js" defer></script>
  <script src="../static/js/core/nav-scroll-behavior.js" defer></script>
</head>
<body>
  <!-- 顶栏 nav（由 navigation.css + nav-scroll-behavior.js 驱动） -->
  <!-- 进度条（page/scroll-progress 组件） -->
  <main>
    <div class="description-container">   <!-- flex: 侧边栏 + 内容 -->
      <aside class="description-sidebar"><!-- TOC + 烧瓶进度 --></aside>
      <div class="description-content">
        <section class="content-section">
          <h1>标题</h1>
          <section><h2>小节</h2><p>正文…</p></section>
        </section>
      </div>
    </div>
  </main>
  <section id="footer" class="fullscreen-section section-footer"></section>
</body>
</html>
```

---
