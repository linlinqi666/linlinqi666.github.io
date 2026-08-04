const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:8080/human-practices/integrated%20human-practices.html', {
    waitUntil: 'networkidle'
  });
  await page.waitForTimeout(1500);

  const layout = await page.evaluate(() => {
    const nav = document.querySelector('nav');
    const container = document.querySelector('.description-container');
    const content = document.querySelector('.description-content');
    const orbitContainer = document.querySelector('.timeline-orbit-container');
    const stage = document.querySelector('.timeline-stage');
    return {
      nav: nav ? nav.getBoundingClientRect() : null,
      navHeight: nav ? nav.offsetHeight : null,
      containerTop: container ? container.getBoundingClientRect().top : null,
      containerPaddingTop: container ? window.getComputedStyle(container).paddingTop : null,
      contentTop: content ? content.getBoundingClientRect().top : null,
      orbitTop: orbitContainer ? orbitContainer.getBoundingClientRect().top : null,
      stageTop: stage ? stage.getBoundingClientRect().top : null
    };
  });
  console.log(JSON.stringify(layout, null, 2));

  await page.screenshot({ path: 'screenshots/hp-timeline.png', fullPage: true });
  await browser.close();
})();
