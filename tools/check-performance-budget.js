const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const KB = 1024;
const budgets = [
  ['static/css/navigation/navigation.css', 110],
  ['static/css/mobile.css', 42],
  ['static/css/index.css', 30],
  ['static/css/integrated human-practices.css', 48],
  ['static/js/core/search.js', 12],
  ['static/js/components/hp-map.js', 40],
  ['static/js/pages/members.js', 42],
  ['static/js/core/search-index.json', 350]
];

const failures = [];
for (const [relativePath, budgetKB] of budgets) {
  const filePath = path.join(ROOT, relativePath);
  if (!fs.existsSync(filePath)) {
    failures.push(`${relativePath}: file not found`);
    continue;
  }
  const size = fs.statSync(filePath).size;
  const actualKB = size / KB;
  const status = actualKB <= budgetKB ? 'PASS' : 'FAIL';
  console.log(`${status} ${relativePath}: ${actualKB.toFixed(2)} KB / ${budgetKB.toFixed(2)} KB`);
  if (status === 'FAIL') failures.push(`${relativePath}: ${actualKB.toFixed(2)} KB exceeds ${budgetKB.toFixed(2)} KB`);
}

if (failures.length) {
  console.error('\nPerformance budget failed:');
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('\nPerformance budget passed.');
