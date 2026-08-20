/**
 * inject-search.js  （收纳自仓库根目录 → tools/，2026-08-07）
 * 批量为所有 HTML 页面注入搜索按钮与 search.js 脚本引用。
 *
 * 用法：node tools/inject-search.js   （或 npm run inject-search）
 *
 * 注意：本脚本与 tools/normalize-scripts.js 同为工程化 Node 脚本，
 * 不属于浏览器运行时资源，故放在 tools/ 而非 static/js/。
 * ROOT 须指向仓库根目录（本文件在 tools/ 下，故向上一级）。
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const PAGES = [
  'index.html',
  'project/description.html',
  'project/design.html',
  'project/engineering.html',
  'project/log.html',
  'project/contribution.html',
  'team/members.html',
  'team/attributions.html',
  'dry-lab/model.html',
  'dry-lab/hardware.html',
  'dry-lab/software.html',
  'wet-lab/experiments.html',
  'wet-lab/result.html',
  'wet-lab/parts.html',
  'wet-lab/safety.html',
  'human-practices/integrated human-practices.html',
  'human-practices/education.html',
  'human-practices/social-groups.html'
];

const SEARCH_ICON_SVG = `<svg class="nav-search__icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M20 20l-4.35-4.35" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`;

function getBasePath(pagePath) {
  const depth = pagePath.split(/[\\/]/).length - 1;
  if (depth <= 0) return '.';
  return Array(depth).fill('..').join('/');
}

function buildSearchMarkup(basePath) {
  return `
  <div class="nav-search" id="nav-search" data-base-path="${basePath}">
    <button class="nav-search__toggle" id="nav-search-toggle" aria-label="搜索" aria-expanded="false">
      ${SEARCH_ICON_SVG}
    </button>
    <div class="nav-search__panel" id="nav-search-panel">
      <div class="nav-search__input-wrap">
        ${SEARCH_ICON_SVG.replace('nav-search__icon', 'nav-search__input-icon')}
        <input type="text" class="nav-search__input" id="nav-search-input" placeholder="Search pages..." autocomplete="off" aria-label="搜索页面">
        <button class="nav-search__close" id="nav-search-close" aria-label="关闭搜索">×</button>
      </div>
      <div class="nav-search__results" id="nav-search-results">
        <div class="nav-search__empty">Start typing to search pages...</div>
      </div>
    </div>
  </div>`;
}

/**
 * 移除所有已有的 search.js 引用，包括被注释掉的。
 */
function removeExistingSearchScript(html) {
  // 移除 search.js 与 search-index.js 引用（包括被注释掉的）
  html = html.replace(/\s*<script[^>]*src="[^"]*static\/js\/core\/search(?:-index)?\.js"[^>]*(?:defer)?[^>]*><\/script>/gi, '');
  return html;
}

/**
 * 移除所有已有的搜索按钮标记。
 */
function removeExistingSearchMarkup(html) {
  return html.replace(/\s*<div class="nav-search"[\s\S]*?<\/div>\s*(?=\s*<\/nav>)/i, '');
}

function injectPage(pagePath) {
  const fullPath = path.join(ROOT, pagePath);
  if (!fs.existsSync(fullPath)) {
    console.warn('页面不存在，跳过：', pagePath);
    return;
  }

  let html = fs.readFileSync(fullPath, 'utf-8');
  const basePath = getBasePath(pagePath);
  let modified = false;

  // 清理旧的搜索相关代码
  html = removeExistingSearchScript(html);
  html = removeExistingSearchMarkup(html);

  // 1. 注入搜索按钮到 </nav> 之前
  const searchMarkup = buildSearchMarkup(basePath);
  const navMatch = html.match(/(<nav[^>]*>[\s\S]*?)<\/nav>/i);
  if (navMatch) {
    const navContent = navMatch[1];
    const lastDivClose = navContent.lastIndexOf('</div>');
    if (lastDivClose !== -1) {
      const insertPos = navMatch.index + lastDivClose + 6;
      html = html.slice(0, insertPos) + searchMarkup + html.slice(insertPos);
      modified = true;
    }
  }

  // 2. 注入搜索索引与 search.js 脚本引用到 </head> 之前
  //    注：search-index.js 与 search.js 统一 defer，避免阻塞首屏（见 README.md 第七.9、第八.2）
  const indexScriptTag = `  <script src="${basePath}/static/js/core/search-index.js" defer></script>`;
  const searchScriptTag = `  <script src="${basePath}/static/js/core/search.js" defer></script>`;
  const scriptTags = indexScriptTag + '\n' + searchScriptTag;
  html = html.replace(/<\/head>/i, scriptTags + '\n</head>');
  modified = true;

  if (modified) {
    fs.writeFileSync(fullPath, html, 'utf-8');
    console.log('已更新：', pagePath);
  }
}

PAGES.forEach(injectPage);
console.log('搜索按钮注入完成。');
