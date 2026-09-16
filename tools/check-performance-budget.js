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
  // members.js 同时承载全队成员数据（16 人 × 7 字段，含 photoPosition/photoSize 取景微调）
  // 与渲染/交互逻辑，体积随名册与功能增长：
  //   42 KB（13 人时代）→ 46 KB（16 人 + 数据格式统一）→ 48 KB（2026-09-16 响应式重构：
  //   堆叠断点切换、条带展开实测高度、移动端默认选中与详情带入）。
  // 若希望维持更低上限，应把成员数据拆为独立数据文件（需同步改两工程页面加载与预算条目）。
  ['static/js/pages/members.js', 48],
  ['static/css/members.css', 26],
  ['static/js/components/members-intro.js', 6],
  ['static/css/components/members-intro.css', 7],
  ['static/js/core/search-index.json', 300]
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
