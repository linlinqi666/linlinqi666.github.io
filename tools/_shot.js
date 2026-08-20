const { chromium } = require('playwright-core');
const path = require('path');

const ROOT = 'f:/IGEM/SZPU-2026 wiki';
const pages = [
  { file: 'index.html', name: 'home_top', scroll: 'top' },
  { file: 'project/description.html', name: 'desc_top', scroll: 'top' },
  { file: 'project/description.html', name: 'desc_footer', scroll: 'bottom' },
  { file: 'project/design.html', name: 'design_top', scroll: 'top' },
  { file: 'team/members.html', name: 'team_top', scroll: 'top' },
  { file: 'human-practices/integrated human-practices.html', name: 'hp_top', scroll: 'top' },
];

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('PAGEERR: ' + e.message));
  for (const p of pages) {
    const url = 'file://' + path.join(ROOT, p.file);
    await page.goto(url, { waitUntil: 'networkidle' });
    if (p.scroll === 'bottom') {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(400);
    } else {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);
    }
    const out = path.join(ROOT, 'site-preview', '_diag_' + p.name + '.png');
    await page.screenshot({ path: out });
    // nav geometry + main top offset
    const info = await page.evaluate(() => {
      const nav = document.querySelector('nav');
      const main = document.querySelector('main');
      const nr = nav ? nav.getBoundingClientRect() : null;
      const mr = main ? main.getBoundingClientRect() : null;
      const fc = main ? main.firstElementChild : null;
      const fcr = fc ? fc.getBoundingClientRect() : null;
      const navBg = nav ? getComputedStyle(nav).backgroundColor : null;
      return {
        navH: nr ? Math.round(nr.height) : null,
        navBottom: nr ? Math.round(nr.bottom) : null,
        contentTop: fcr ? Math.round(fcr.top) : null,
        bodyClass: document.body.className,
        mainClass: main ? main.className : null,
        footerBg: !!document.querySelector('.footer-bg-picture'),
        navBg,
      };
    });
    console.log(p.name, JSON.stringify(info));
  }
  console.log('CONSOLE_ERRORS', errors.length, errors.slice(0, 10).join(' | '));
  await browser.close();
})();
