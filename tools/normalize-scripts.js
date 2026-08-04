#!/usr/bin/env node
/*
 * normalize-scripts.js
 * ---------------------------------------------------------------------------
 * 工程化脚本加载统一工具（零依赖，仅使用 Node 标准库）。
 *
 * 背景：项目原先混用三种脚本写法——(1) 同步脚本堆在 </body> 前；(2) 部分脚本在
 *       <head> 带 defer；(3) members.html 甚至 head 内同步 + 其余底部同步。这导致
 *       “谁先执行”依赖解析时机，且易漏顺序。
 *
 * 本工具统一为：所有外部 <script src> 全部移入 <head> 并加 defer，执行顺序固定为
 * utils.js 最先，其余按既定优先级排列。defer 保证 DOM 解析完成后、按文档顺序执行，
 * 且不阻塞渲染（早期并行下载）。
 *
 * 额外处理：原先位于外部脚本块“之后”的内联 <script>（如
 * `new PageProgressBar().startAutoProgress();`）会依赖已加载的外部脚本。外部脚本
 * 改为 defer 后会延后到解析结束后才执行，因此这类内联脚本被包裹进 DOMContentLoaded
 * 监听，确保 PageProgressBar 等已被定义。
 *
 * 脚本集合由各页面文件名规则生成（而非读取现有 src），以保证路径与顺序永远正确。
 *
 * 用法：node tools/normalize-scripts.js   （可重复运行，幂等）
 * ---------------------------------------------------------------------------
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// 需要处理的页面（排除 demo / 第三方 demo / 工具产物）
const TARGETS = [
  'index.html',
  'dry-lab/hardware.html', 'dry-lab/model.html', 'dry-lab/software.html',
  'wet-lab/experiments.html', 'wet-lab/parts.html', 'wet-lab/result.html', 'wet-lab/safety.html',
  'human-practices/education.html', 'human-practices/integrated human-practices.html', 'human-practices/social-groups.html',
  'project/description.html', 'project/design.html', 'project/engineering.html', 'project/contribution.html', 'project/log.html',
  'team/members.html', 'team/attributions.html',
];

// 无侧边栏的页面（不加载 sidebar-progress.js）
const NO_SIDEBAR = new Set([
  'parts.html', 'social-groups.html', 'members.html', 'attributions.html', 'log.html', 'index.html',
]);

// 根据文件名规则生成该页面应加载的外部脚本（顺序已排好）
function scriptsFor(file) {
  const fname = file.split('/').pop().toLowerCase();
  const isRoot = !file.includes('/');
  const base = isRoot ? 'static/' : '../static/';
  const core = (p) => `${base}js/${p}`;
  const comp = (p) => `${base}components/${p}`;

  const list = [];
  list.push({ order: 0, src: core('core/utils.js') });
  if (!NO_SIDEBAR.has(fname)) {
    list.push({ order: 1, src: comp('sidebar-progress.js') });
  }
  list.push({ order: 2, src: core('core/mobile-menu.js') });
  list.push({ order: 3, src: core('core/page-progress-bar.js') });
  list.push({ order: 4, src: core('core/scroll-progress-bar.js') });
  list.push({ order: 5, src: core('core/nav-scroll-behavior.js') });

  if (fname === 'integrated human-practices.html') {
    list.push({ order: 99, src: comp('hp-reveal-box.js') });
    list.push({ order: 99, src: comp('hp-carousel.js') });
  } else if (fname === 'members.html') {
    list.push({ order: 99, src: core('pages/members.js') });
  } else if (fname === 'attributions.html') {
    list.push({ order: 99, src: core('pages/attributions.js') });
  } else if (fname === 'index.html') {
    list.push({ order: 99, src: core('core/executive-summary-animation.js') });
  }

  list.sort((a, b) => a.order - b.order || a.src.localeCompare(b.src));
  return list.map((x) => x.src);
}

function normalize(file) {
  const abs = path.join(ROOT, file);
  if (!fs.existsSync(abs)) {
    console.log('SKIP (missing):', file);
    return;
  }
  let html = fs.readFileSync(abs, 'utf8');

  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  const matches = [];
  let m;
  while ((m = re.exec(html))) {
    matches.push({ start: m.index, end: m.index + m[0].length, attrs: m[1], inner: m[2] });
  }

  // 记录外部脚本块的结束位置，用于判断哪些内联脚本需要包裹
  let lastExternalEnd = -1;
  for (const mt of matches) {
    if (/\bsrc\s*=/.test(mt.attrs)) lastExternalEnd = Math.max(lastExternalEnd, mt.end);
  }

  // 逆序改写：删除所有外部脚本标签；包裹尾部依赖型内联脚本
  const sorted = matches.slice().sort((a, b) => b.start - a.start);
  for (const mt of sorted) {
    if (/\bsrc\s*=/.test(mt.attrs)) {
      html = html.slice(0, mt.start) + html.slice(mt.end);
    } else if (mt.start > lastExternalEnd && !/DOMContentLoaded/.test(mt.inner)) {
      const wrapped = `<script>\n  document.addEventListener('DOMContentLoaded', function () {\n${mt.inner}\n  });\n</script>`;
      html = html.slice(0, mt.start) + wrapped + html.slice(mt.end);
    }
  }

  // 移除上一次插入的标记注释（外部脚本标签本身已在上面被移除）
  html = html.replace(/\s*<!-- 标准化脚本[^\n]*-->\n?/g, '');

  // 生成并插入规范化的 head 脚本块
  const block = scriptsFor(file)
    .map((s) => `  <script src="${s}" defer></script>`)
    .join('\n');
  const headBlock = `  <!-- 标准化脚本：统一置于 head 并以 defer 加载（utils 最先，DOM 解析后按序执行） -->\n${block}\n`;

  if (html.includes('</head>')) {
    html = html.replace(/<\/head>/i, headBlock + '</head>');
  } else {
    html = html.replace(/<\/body>/i, headBlock + '</body>');
  }

  fs.writeFileSync(abs, html);
  console.log(`OK  ${file}  (${scriptsFor(file).length} 个外部脚本 → head+defer)`);
}

TARGETS.forEach(normalize);
console.log('\n完成：所有外部脚本已统一到 <head> 并加 defer；尾部依赖型内联脚本已包裹 DOMContentLoaded。');
