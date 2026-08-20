const { chromium } = require('playwright-core');
const ROOT = 'f:/IGEM/SZPU-2026 wiki';

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('PAGEERR: ' + e.message));

  await page.goto('file:///' + ROOT.replace(/\\/g, '/') + '/project/description.html');
  await page.waitForTimeout(300);

  const btn = await page.$('#hamburger-menu');
  console.log('hamburger visible:', await btn.isVisible());

  // 打开前：菜单应在视口下方（translateY(100%)）
  const before = await page.evaluate(() => {
    const m = document.querySelector('.mobile-menu');
    const r = m.getBoundingClientRect();
    return { top: Math.round(r.top), bottom: Math.round(r.bottom), vh: window.innerHeight, bg: getComputedStyle(document.querySelector('.mobile-menu-overlay')).backdropFilter };
  });
  console.log('before open:', before);

  await btn.click();
  await page.waitForTimeout(500); // 等待过渡

  const after = await page.evaluate(() => {
    const ov = document.querySelector('.mobile-menu-overlay');
    const m = document.querySelector('.mobile-menu');
    const cs = getComputedStyle(m);
    const r = m.getBoundingClientRect();
    return {
      overlayActive: ov.classList.contains('active'),
      overlayOpacity: getComputedStyle(ov).opacity,
      overlayBackdrop: getComputedStyle(ov).backdropFilter,
      menuOpacity: cs.opacity,
      menuTransform: cs.transform,
      menuTop: Math.round(r.top),
      menuBottom: Math.round(r.bottom),
      vh: window.innerHeight,
      borderTopLeft: cs.borderTopLeftRadius,
    };
  });
  console.log('after open:', after);

  // 关闭
  await btn.click();
  await page.waitForTimeout(500);
  const closed = await page.evaluate(() => Math.round(document.querySelector('.mobile-menu').getBoundingClientRect().top));
  console.log('after close menu top:', closed, '(应回到视口下方)');

  console.log('CONSOLE_ERRORS', errors.length, errors.slice(0, 5));
  await browser.close();
})();
