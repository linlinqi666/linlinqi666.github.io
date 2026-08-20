const { chromium } = require('playwright-core');
const path = require('path');

const ROOT = 'f:/IGEM/SZPU-2026 wiki';
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await ctx.newPage();
  await page.goto('file://' + path.join(ROOT, 'index.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(ROOT, 'site-preview', '_diag_home_footer.png') });
  await browser.close();
})();
