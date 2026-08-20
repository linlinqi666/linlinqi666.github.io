// 构建后功能冒烟测试：用 Playwright 加载每个生成页面（file://），
// 捕获 console 错误 / 页面异常，并校验关键元素存在。
// 用法：node tools/_smoke.js
const path = require('path');
const fs = require('fs');

let pw;
try {
  pw = require('playwright-core');
} catch (e) {
  console.error('playwright-core 不可用：', e.message);
  process.exit(2);
}

const ROOT = path.resolve(__dirname, '..');
const pages = [
  'index.html',
  'project/description.html', 'project/design.html', 'project/engineering.html',
  'project/log.html', 'project/contribution.html',
  'team/members.html', 'team/attributions.html',
  'human-practices/integrated human-practices.html', 'human-practices/education.html',
  'human-practices/social-groups.html',
  'dry-lab/software.html', 'dry-lab/model.html', 'dry-lab/hardware.html',
  'wet-lab/experiments.html', 'wet-lab/result.html', 'wet-lab/parts.html', 'wet-lab/safety.html'
];

(async () => {
  const browser = await pw.chromium.launch({ headless: true });
  const results = [];
  for (const p of pages) {
    const fileUrl = 'file://' + path.join(ROOT, p).replace(/\\/g, '/');
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
    try {
      await page.goto(fileUrl, { waitUntil: 'load', timeout: 20000 });
      await page.waitForTimeout(400);
      const checks = await page.evaluate(() => {
        const q = s => document.querySelector(s);
        return {
          nav: !!q('nav'),
          main: !!q('main'),
          mainLen: (q('main') ? q('main').innerText.length : 0),
          search: !!q('.nav-search'),
          footer: !!q('#footer') || !!q('footer'),
          scripts: document.querySelectorAll('script[src]').length,
        };
      });
      results.push({ page: p, errors, checks, ok: errors.length === 0 && checks.nav && checks.main && checks.mainLen > 50 });
    } catch (e) {
      results.push({ page: p, errors: ['GOTO_FAIL: ' + e.message], checks: {}, ok: false });
    }
    await ctx.close();
  }
  await browser.close();

  let fail = 0;
  for (const r of results) {
    const status = r.ok ? 'OK ' : 'FAIL';
    if (!r.ok) fail++;
    console.log(status, (r.page + '                          ').slice(0, 42),
      'nav=' + (r.checks.nav ? 1 : 0), 'main=' + (r.checks.mainLen || 0),
      'search=' + (r.checks.search ? 1 : 0), 'footer=' + (r.checks.footer ? 1 : 0),
      'scripts=' + (r.checks.scripts || 0),
      'err=' + r.errors.length + (r.errors.length ? ' ' + r.errors.slice(0, 2).join(' | ') : ''));
  }
  console.log('\nTOTAL_FAIL=' + fail + '/18');
})();
