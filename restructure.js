const fs = require('fs');

const file = 'F:\\IGEM\\SZPU-2026 wiki\\human-practices\\integrated human-practices.html';
const raw = fs.readFileSync(file);
const hasBOM = raw.length >= 2 && raw[0] === 0xFF && raw[1] === 0xFE;
let html = raw.toString('utf16le');
if (html.charCodeAt(0) === 0xFEFF) html = html.slice(1);
console.log('file bytes:', raw.length, 'hasBOM:', hasBOM, 'idx(section-overview):', html.indexOf('section-overview'));

// ========== 1. 提取 5 篇真实文章块（按 id 找顶层 <div>）==========
function extractBlock(id) {
  const marker = '<div id="' + id + '"';
  const start = html.indexOf(marker);
  if (start === -1) throw new Error('Start not found: ' + id);
  let i = start, depth = 0;
  while (i < html.length) {
    const openIdx = html.indexOf('<div', i);
    const closeIdx = html.indexOf('</div>', i);
    if (openIdx === -1 && closeIdx === -1) break;
    if (openIdx !== -1 && (closeIdx === -1 || openIdx < closeIdx)) {
      depth++; i = openIdx + 4;
    } else {
      depth--;
      i = closeIdx + 6;
      if (depth === 0) return html.slice(start, i);
    }
  }
  throw new Error('End not found for: ' + id);
}

const sectionIds = ['section-overview', 'section-carousel', 'section-southchina', 'section-dialogues', 'section-education'];
const blocks = sectionIds.map(extractBlock);

// ========== 2. 构造新的 hero：把文章塞进 #detailTrack ==========
const heroStartMarker = '<!-- ===== 3D 时间轴导航：照搬自 communication/demos/demo-3d-timeline.html ===== -->';
const heroStart = html.indexOf(heroStartMarker);
if (heroStart === -1) throw new Error('Hero start marker not found');
const afterHeroMarker = '<!-- 页面概述：内容待后续补充 -->';
let afterHeroIdx = html.indexOf(afterHeroMarker, heroStart);
if (afterHeroIdx === -1) throw new Error('After hero marker not found');
let heroEnd = afterHeroIdx;
while (heroEnd > heroStart && /\s/.test(html[heroEnd - 1])) heroEnd--;
const oldHeroHtml = html.slice(heroStart, heroEnd);

const detailSlidesHtml = blocks.map(b => '        <div class="detail-slide">\n' + b + '\n        </div>').join('\n\n');
const newHeroHtml = oldHeroHtml.replace(
  '<div class="detail-viewport"><div class="detail-track" id="detailTrack"></div></div>',
  '<div class="detail-viewport"><div class="detail-track" id="detailTrack">\n' + detailSlidesHtml + '\n        </div></div>'
);

// ========== 3. 替换 hero + 删掉下方独立的文章列表 ==========
const eduStart = html.indexOf('<div id="section-education"');
if (eduStart === -1) throw new Error('section-education not found');
let eduEnd = eduStart, eduDepth = 0;
for (let i = eduStart; i < html.length; i++) {
  if (html.slice(i, i + 4) === '<div') { eduDepth++; i += 3; }
  else if (html.slice(i, i + 6) === '</div>') {
    eduDepth--;
    if (eduDepth === 0) { eduEnd = i + 6; break; }
  }
}

const beforeHero = html.slice(0, heroStart);
const afterEdu = html.slice(eduEnd);
const cleanedAfter = afterEdu.replace(/^\s*<!-- Chapter 3: 影响平衡章节 -->\s*/, '\n');
html = beforeHero + newHeroHtml + '\n\n' + cleanedAfter;

// ========== 4. 更新侧边导航 ==========
const navHtml = '        <div class="description-nav-wrapper">\n          <ul class="description-nav">\n            <li class="level1"><div class="nav-link-wrapper"><a href="#section-overview" class="nav-main-link" data-hp-slide="0">概述</a></div></li>\n            <li class="level1"><div class="nav-link-wrapper"><a href="#section-carousel" class="nav-main-link" data-hp-slide="1">清华参赛交流</a></div></li>\n            <li class="level1"><div class="nav-link-wrapper"><a href="#section-southchina" class="nav-main-link" data-hp-slide="2">华南交流会</a></div></li>\n            <li class="level1"><div class="nav-link-wrapper"><a href="#section-dialogues" class="nav-main-link" data-hp-slide="3">专家访谈</a></div></li>\n            <li class="level1"><div class="nav-link-wrapper"><a href="#section-education" class="nav-main-link" data-hp-slide="4">中学生科普</a></div></li>\n          </ul>\n        </div>';

html = html.replace(
  /<div class="description-nav-wrapper">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<!-- 阅读进度监测 -->/,
  navHtml + '\n\n        <!-- 阅读进度监测 -->'
);

// ========== 5. 改写 3D 脚本里的 articles 元数据 ==========
const realArticlesArray = "var articles = [\n      { time: '00', title: '项目概述', img: '' },\n      { time: '01', title: '清华参赛交流', img: '../static/image/HP/tsinghua/1.webp' },\n      { time: '02', title: '华南交流会', img: '../static/image/HP/southchina/cover.jpg' },\n      { time: '03', title: '专家访谈', img: '../static/image/HP/expert.jpg' },\n      { time: '04', title: '中学生科普', img: '../static/image/HP/school1.jpg' }\n    ];";

html = html.replace(/var articles = \[[\s\S]*?\];\s*\n\s*var timelineScene/, realArticlesArray + '\n\n    var timelineScene');

// ========== 6. 不再让 JS 重新生成 detail slides（HTML 里已预置） ==========
html = html.replace('renderDetailSlides();', '// detail slides are pre-rendered in HTML');

// ========== 7. 暴露全局接口给侧边栏使用 ==========
html = html.replace(
  'if (document.readyState',
  'window.HP3D = {\n      goTo: function (idx) {\n        autoLoopEnabled = false;\n        goTo(idx);\n        updateDetailPanel(idx);\n      }\n    };\n\n    if (document.readyState'
);

// ========== 8. 给侧边栏导航添加点击切换 slide 的事件 ==========
const navScript = '  <script>\n    document.addEventListener(\'click\', function (e) {\n      var a = e.target.closest && e.target.closest(\'a[data-hp-slide]\');\n      if (!a) return;\n      var idx = parseInt(a.getAttribute(\'data-hp-slide\'), 10);\n      if (isNaN(idx) || !window.HP3D) return;\n      e.preventDefault();\n      window.HP3D.goTo(idx);\n      var root = document.querySelector(\'.hp3d-root\');\n      if (root) root.scrollIntoView({ behavior: \'smooth\', block: \'start\' });\n    });\n  </script>\n';

html = html.replace(
  '  <!-- 3D 时间轴导航脚本：照搬自 communication/demos/demo-3d-timeline.html（逻辑原封不动） -->',
  navScript + '  <!-- 3D 时间轴导航脚本：照搬自 communication/demos/demo-3d-timeline.html（逻辑原封不动） -->'
);

const out = (hasBOM ? '\uFEFF' : '') + html;
fs.writeFileSync(file, out, 'utf16le');
console.log('Restructured OK. Articles moved:', sectionIds.join(', '));
