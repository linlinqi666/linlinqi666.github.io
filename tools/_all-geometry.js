const { chromium } = require('playwright-core');
const path = require('path');

const ROOT = 'f:/IGEM/SZPU-2026 wiki';
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

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(`${m.text()} (${m.location().url})`); });
  page.on('pageerror', e => consoleErrors.push('PAGEERR: ' + e.message));
  let bad = 0;
  for (const p of pages) {
    await page.goto('file://' + path.join(ROOT, p), { waitUntil: 'networkidle' });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    const info = await page.evaluate(() => {
      const nav = document.querySelector('nav');
      const main = document.querySelector('main');
      const fc = main ? main.firstElementChild : null;
      const fcr = fc ? fc.getBoundingClientRect() : null;
      const nr = nav ? nav.getBoundingClientRect() : null;
      return {
        navBottom: nr ? Math.round(nr.bottom) : null,
        contentTop: fcr ? Math.round(fcr.top) : null,
        bodyClass: document.body.className,
        hasFooter: !!document.querySelector('#footer'),
        footerBg: !!document.querySelector('.footer-bg-picture'),
      };
    });
    const isHome = info.bodyClass.includes('home-page');
    const ok = isHome ? (info.contentTop === 0) : (info.contentTop >= info.navBottom);
    if (!ok) {
      bad++;
      console.log('BAD', (p + '                    ').slice(0, 32), JSON.stringify(info));
    }
  }
  console.log(bad === 0 ? 'ALL 18 PAGES GEOMETRY OK' : `BAD PAGES: ${bad}`);
  console.log('CONSOLE_ERRORS', consoleErrors.length, consoleErrors.slice(0, 5).join(' | '));
  await browser.close();
})();
