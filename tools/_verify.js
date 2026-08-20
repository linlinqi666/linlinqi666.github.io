const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const BACKUP = path.join(ROOT, '对话归档', 'backups', 'backup-pre-refactor');
const pages = ['index.html','project/description.html','project/design.html','project/engineering.html','project/log.html','project/contribution.html','team/members.html','team/attributions.html','human-practices/integrated human-practices.html','human-practices/education.html','human-practices/social-groups.html','dry-lab/software.html','dry-lab/model.html','dry-lab/hardware.html','wet-lab/experiments.html','wet-lab/result.html','wet-lab/parts.html','wet-lab/safety.html'];
const REQUIRED_DEFERRED_SCRIPTS = [
  'static/js/core/utils.js',
  'static/js/core/search.js'
];
let bad = 0;
for (const p of pages) {
  const h = fs.readFileSync(path.join(ROOT, p), 'utf8');
  const headMatch = h.match(/<head[\s\S]*?<\/head>/i);
  const head = headMatch ? headMatch[0] : '';
  const scripts = [...h.matchAll(/<script\b([^>]*)><\/script>/gi)].map(match => match[1]);
  const externalScripts = scripts.filter(attrs => /\bsrc\s*=/.test(attrs));
  const sources = externalScripts
    .map(attrs => (attrs.match(/\bsrc\s*=\s*["']([^"']+)["']/i) || [])[1])
    .filter(Boolean);
  const managedScripts = externalScripts.filter(attrs => /(?:^|\/)static\/js\//.test((attrs.match(/\bsrc\s*=\s*["']([^"']+)["']/i) || [])[1] || ''));
  const nonDeferredManaged = managedScripts.filter(attrs => !/\bdefer\b/i.test(attrs)).length;
  const duplicateSources = sources.length - new Set(sources).size;
  const missingRequired = REQUIRED_DEFERRED_SCRIPTS.filter(src => !sources.some(value => value.endsWith(src)));
  const preloadedIndex = sources.filter(src => src.endsWith('static/js/core/search-index.js')).length;

  if (!head || nonDeferredManaged || duplicateSources || missingRequired.length || preloadedIndex) {
    bad++;
    console.log(
      'BAD', p,
      'head=' + Boolean(head),
      'nonDeferredManaged=' + nonDeferredManaged,
      'duplicates=' + duplicateSources,
      'missing=' + (missingRequired.join(',') || '-'),
      'preloadedIndex=' + preloadedIndex
    );
  }
}
// content parity vs backup
let maxDiff = 0;
let compared = 0;
for (const p of pages) {
  const backupPath = path.join(BACKUP, p);
  const pagePath = path.join(ROOT, p);
  if (!fs.existsSync(backupPath) || !fs.existsSync(pagePath)) {
    console.log('SKIP_BACKUP_MISSING', p);
    continue;
  }
  const a = (fs.readFileSync(backupPath, 'utf8').match(/<main[\s\S]*?<\/main>/i) || [''])[0];
  const b = (fs.readFileSync(pagePath, 'utf8').match(/<main[\s\S]*?<\/main>/i) || [''])[0];
  if (a && b) {
    compared++;
    const d = Math.abs(a.length - b.length);
    if (d > maxDiff) maxDiff = d;
  }
}
console.log(bad === 0 ? 'SCRIPTS_OK all 18' : ('SCRIPTS_BAD=' + bad));
console.log('compared backup pages = ' + compared);
console.log('max main length diff vs backup = ' + maxDiff + ' chars');
