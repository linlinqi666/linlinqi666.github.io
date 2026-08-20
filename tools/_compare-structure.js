const fs = require('fs');
const path = require('path');
const { parseHTML } = require('linkedom');

const ROOT = 'f:/IGEM/SZPU-2026 wiki';
const BACKUP = path.join(ROOT, '对话归档', 'backups', 'backup-pre-refactor');

const pages = [
  'index.html',
  'project/description.html',
  'project/design.html',
  'project/engineering.html',
  'project/log.html',
  'project/contribution.html',
  'team/members.html',
  'team/attributions.html',
  'human-practices/integrated human-practices.html',
  'human-practices/education.html',
  'human-practices/social-groups.html',
  'dry-lab/software.html',
  'dry-lab/model.html',
  'dry-lab/hardware.html',
  'wet-lab/experiments.html',
  'wet-lab/result.html',
  'wet-lab/parts.html',
  'wet-lab/safety.html',
];

function extract(p) {
  const html = fs.readFileSync(path.join(ROOT, p), 'utf8');
  const bHtml = fs.readFileSync(path.join(BACKUP, p), 'utf8');
  const doc = parseHTML(html);
  const bDoc = parseHTML(bHtml);
  const d = doc.document;
  const b = bDoc.document;
  const out = { file: p };

  out.titleOk = d.title === b.title;
  out.title = d.title;
  out.bTitle = b.title;

  const desc = d.querySelector('meta[name="description"]');
  const bDesc = b.querySelector('meta[name="description"]');
  out.descOk = (desc?.content || '') === (bDesc?.content || '');

  out.bodyClass = d.body.className;
  out.bBodyClass = b.body.className;
  out.bodyClassOk = out.bodyClass === out.bBodyClass;

  const links = [...d.querySelectorAll('link[rel="stylesheet"]')].map(l => l.getAttribute('href')).sort();
  const bLinks = [...b.querySelectorAll('link[rel="stylesheet"]')].map(l => l.getAttribute('href')).sort();
  out.cssOk = JSON.stringify(links) === JSON.stringify(bLinks);
  out.cssDiff = symmetricDiff(links, bLinks);

  const scripts = [...d.querySelectorAll('script[src]')].map(s => s.getAttribute('src')).sort();
  const bScripts = [...b.querySelectorAll('script[src]')].map(s => s.getAttribute('src')).sort();
  out.jsOk = JSON.stringify(scripts) === JSON.stringify(bScripts);
  out.jsDiff = symmetricDiff(scripts, bScripts);

  const styles = [...d.querySelectorAll('style')].length;
  const bStyles = [...b.querySelectorAll('style')].length;
  out.styleTags = styles;
  out.bStyleTags = bStyles;

  const imgs = [...d.querySelectorAll('img')].length;
  const bImgs = [...b.querySelectorAll('img')].length;
  out.imgCount = imgs;
  out.bImgCount = bImgs;

  const main = d.querySelector('main');
  const bMain = b.querySelector('main');
  out.mainLen = main?.textContent?.length || 0;
  out.bMainLen = bMain?.textContent?.length || 0;
  out.mainRatio = out.bMainLen ? Math.round((out.mainLen / out.bMainLen) * 1000) / 1000 : 1;

  // footer image (画板+7)
  out.footerBg = /footer-bg-picture/.test(html);
  out.bFooterBg = /footer-bg-picture/.test(bHtml);
  out.footerBgOk = out.footerBg === out.bFooterBg;

  return out;
}

function symmetricDiff(a, b) {
  const s = new Set(a), t = new Set(b);
  return { missingFromGen: [...t].filter(x => !s.has(x)), extraInGen: [...s].filter(x => !t.has(x)) };
}

const comparablePages = pages.filter(p => fs.existsSync(path.join(BACKUP, p)));
const skippedPages = pages.filter(p => !fs.existsSync(path.join(BACKUP, p)));
for (const p of skippedPages) console.log('SKIP_BACKUP_MISSING', p);
const rows = comparablePages.map(extract);
let bad = 0;
for (const r of rows) {
  const issues = [];
  if (!r.titleOk) issues.push('title mismatch');
  if (!r.descOk) issues.push('description mismatch');
  if (!r.bodyClassOk) issues.push('bodyClass mismatch');
  if (!r.cssOk) issues.push('CSS mismatch');
  if (!r.jsOk) issues.push('JS mismatch');
  if (r.styleTags !== r.bStyleTags) issues.push(`style tags ${r.styleTags} vs ${r.bStyleTags}`);
  if (Math.abs(r.mainRatio - 1) > 0.02) issues.push(`main text ratio ${r.mainRatio}`);
  if (!r.footerBgOk) issues.push(`footerBg ${r.footerBg} vs backup ${r.bFooterBg}`);
  if (issues.length) {
    bad++;
    console.log('\n' + r.file);
    console.log('  ' + issues.join(' | '));
    if (!r.cssOk) console.log('  cssDiff:', JSON.stringify(r.cssDiff));
    if (!r.jsOk) console.log('  jsDiff:', JSON.stringify(r.jsDiff));
    if (!r.bodyClassOk) console.log('  bodyClass:', JSON.stringify(r.bodyClass), 'vs', JSON.stringify(r.bBodyClass));
  }
}
console.log('\n' + (bad === 0 ? 'ALL STRUCTURAL CHECKS PASS' : `ISSUES IN ${bad} PAGES`));
