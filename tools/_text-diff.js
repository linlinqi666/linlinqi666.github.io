const fs = require('fs');
const path = require('path');
const { parseHTML } = require('linkedom');

const ROOT = 'f:/IGEM/SZPU-2026 wiki';
const BACKUP = path.join(ROOT, '对话归档', 'backups', 'backup-pre-refactor');

function clean(t) {
  return t.replace(/\s+/g, ' ').trim();
}

function diff(p) {
  const h = fs.readFileSync(path.join(ROOT, p), 'utf8');
  const bh = fs.readFileSync(path.join(BACKUP, p), 'utf8');
  const main = parseHTML(h).document.querySelector('main')?.textContent || '';
  const bMain = parseHTML(bh).document.querySelector('main')?.textContent || '';
  const a = clean(main);
  const b = clean(bMain);
  console.log('\n' + p);
  console.log('gen len:', a.length, 'backup len:', b.length, 'ratio:', Math.round(a.length/b.length*1000)/1000);
  // find first difference
  let i = 0;
  for (; i < Math.min(a.length, b.length); i++) if (a[i] !== b[i]) break;
  console.log('first diff at', i);
  console.log('gen:', a.slice(Math.max(0,i-40), i+60));
  console.log('bkp:', b.slice(Math.max(0,i-40), i+60));
}

diff('human-practices/social-groups.html');
diff('wet-lab/parts.html');
