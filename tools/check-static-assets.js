const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ignoredProtocols = /^(?:https?:|data:|mailto:|tel:|javascript:|#|\/\/)/i;
const referencePattern = /(?:src|href)\s*=\s*["']([^"']+)["']/gi;
const htmlFiles = [];
const missing = [];

function visit(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.codebuddy' || entry.name === 'igem2026-flask' || entry.name === '对话归档') continue;
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      visit(entryPath);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      htmlFiles.push(entryPath);
    }
  }
}

visit(ROOT);

for (const htmlFile of htmlFiles) {
  const html = fs.readFileSync(htmlFile, 'utf8');
  for (const match of html.matchAll(referencePattern)) {
    const reference = match[1].split('#')[0].split('?')[0];
    if (!reference || ignoredProtocols.test(reference)) continue;

    let decoded;
    try {
      decoded = decodeURIComponent(reference);
    } catch {
      decoded = reference;
    }

    const target = path.resolve(path.dirname(htmlFile), decoded);
    if (!target.startsWith(ROOT + path.sep) || !fs.existsSync(target)) {
      missing.push({ file: path.relative(ROOT, htmlFile), reference });
    }
  }
}

if (missing.length) {
  console.error(`Static asset check failed: ${missing.length} missing local reference(s)`);
  for (const item of missing) console.error(`- ${item.file}: ${item.reference}`);
  process.exit(1);
}

console.log(`Static asset check passed: ${htmlFiles.length} HTML file(s) scanned.`);
