const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  await page.goto('file:///f:/IGEM/SZPU-2026%20wiki/human-practices/integrated%20human-practices.html', { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  const box = await page.evaluate(() => {
    const r = document.getElementById('hp-timeline-hero').getBoundingClientRect();
    return { x: 0, y: r.top + window.scrollY, width: 1400, height: r.height + 60 };
  });
  await page.screenshot({ path: 'hero-final.png', clip: box });
  console.log('shot saved', JSON.stringify(box));
  await browser.close();
})();
