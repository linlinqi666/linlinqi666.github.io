/**
 * search-index-generator.js
 * 预生成全站搜索索引 JavaScript。
 *
 * 用法：node static/js/core/search-index-generator.js
 * 输出：static/js/core/search-index.js
 */
const fs = require('fs');
const path = require('path');
const { parseHTML } = require('linkedom');

const ROOT = path.resolve(__dirname, '../../..');
const OUTPUT_PATH = path.join(ROOT, 'static/js/core/search-index.js');

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

const TEXT_CHUNK_SIZE = 320;
const TEXT_CHUNK_OVERLAP = 80;

/**
 * 从站点根相对路径解析为当前页面可访问的相对路径。
 */
function normalizeToRootRelative(rawSrc, pagePath) {
  if (!rawSrc) return '';
  if (/^[a-z][a-z0-9+.-]*:/i.test(rawSrc)) return rawSrc;

  let src = rawSrc;
  const pageDir = path.dirname(pagePath).replace(/\\/g, '/');

  if (src.startsWith('/')) {
    src = src.slice(1);
  } else {
    src = path.posix.normalize(pageDir + '/' + src);
  }

  return src;
}

function cleanText(text) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\u200B/g, '')
    .trim();
}

function chunkText(text) {
  const chunks = [];
  for (let i = 0; i < text.length; i += TEXT_CHUNK_SIZE - TEXT_CHUNK_OVERLAP) {
    const slice = text.slice(i, i + TEXT_CHUNK_SIZE).trim();
    if (slice.length > 15) chunks.push(slice);
  }
  return chunks;
}

function buildIndex() {
  const records = [];

  PAGES.forEach(pagePath => {
    const fullPath = path.join(ROOT, pagePath);
    if (!fs.existsSync(fullPath)) {
      console.warn('页面不存在，跳过：', pagePath);
      return;
    }

    const html = fs.readFileSync(fullPath, 'utf-8');
    const { document } = parseHTML(html);

    const titleTag = document.querySelector('title');
    const pageTitle = titleTag ? cleanText(titleTag.textContent) || pagePath : pagePath;

    const body = document.body;
    if (!body) return;

    // 克隆 body 以避免修改原始 document
    const clone = body.cloneNode(true);

    // 移除导航、移动端菜单、页脚等与正文无关的元素
    const excludeSelectors = [
      'nav',
      '#mobile-menu-overlay',
      '#mobile-menu',
      '#footer',
      'footer',
      '.mobile-menu-overlay',
      '.mobile-menu'
    ];

    excludeSelectors.forEach(selector => {
      clone.querySelectorAll(selector).forEach(el => el.remove());
    });

    // 移除 script 与 style 标签
    clone.querySelectorAll('script, style, noscript, template').forEach(el => el.remove());

    // 提取正文
    const mainText = cleanText(clone.textContent || '');
    chunkText(mainText).forEach(chunk => {
      records.push({
        type: 'text',
        pageUrl: pagePath,
        pageTitle: pageTitle,
        content: chunk
      });
    });

    // 提取图片（从 body，但排除已移除的元素）
    clone.querySelectorAll('img').forEach(img => {
      const rawSrc = (img.getAttribute('src') || '').trim();
      const alt = (img.getAttribute('alt') || '').trim();
      if (!rawSrc) return;

      const src = normalizeToRootRelative(rawSrc, pagePath);
      const filename = path.basename(src);
      records.push({
        type: 'image',
        pageUrl: pagePath,
        pageTitle: pageTitle,
        src: src,
        content: alt || filename
      });
    });
  });

  const jsContent = `/* 由 search-index-generator.js 自动生成，请勿手动修改 */\nwindow.iGEMSearchIndex = ${JSON.stringify(records, null, 2)};\n`;
  fs.writeFileSync(OUTPUT_PATH, jsContent, 'utf-8');
  console.log(`已生成索引：${OUTPUT_PATH}`);
  console.log(`页面数：${PAGES.length}，记录数：${records.length}`);
}

buildIndex();
