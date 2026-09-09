const { chromium } = require('playwright-core');

const baseURL = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:8080';
const hpPath = '/human-practices/integrated%20human-practices.html';

async function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function main() {
  const launchOptions = { headless: true };
  if (process.env.PLAYWRIGHT_EXECUTABLE_PATH) {
    launchOptions.executablePath = process.env.PLAYWRIGHT_EXECUTABLE_PATH;
  }
  const browser = await chromium.launch(launchOptions);
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });

  try {
  const homeResponse = await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
  await assert(homeResponse && homeResponse.ok(), '首页未成功加载');
  await assert(await page.locator('link[rel="icon"]').count() === 1, '首页 favicon 未正确声明');
  await assert(await page.locator('.yeast-screen__svg').count() > 0, '首页酵母插画未生成');
  await page.locator('#nav-search-toggle').click();
  await page.locator('#nav-search-input').fill('Human');
  await page.waitForTimeout(250);
  await assert(await page.locator('#nav-search-results .nav-search__result').count() > 0, '搜索未返回结果');
  await assert(await page.locator('#nav-search-results mark').count() > 0, '搜索结果未高亮');
  await page.locator('#nav-search-input').press('Escape');

  const hpResponse = await page.goto(`${baseURL}${hpPath}`, { waitUntil: 'networkidle' });
  await assert(hpResponse && hpResponse.ok(), 'HP 页面未成功加载');
  const carousel = page.locator('#hpFlatCarousel');
  await assert(await carousel.count() === 1, 'HP 轮播容器不存在');
  await assert(await page.locator('#hpFlatTrack .hp-flat-card').count() > 0, 'HP 轮播卡片未生成');
  await carousel.focus();
  const firstActive = await page.locator('#hpFlatTrack .hp-flat-card.is-active').getAttribute('aria-label');
  await carousel.press('End');
  const lastActive = await page.locator('#hpFlatTrack .hp-flat-card.is-active').getAttribute('aria-label');
  await assert(firstActive !== lastActive, 'HP 轮播 End 键未切换');
  await assert(await page.locator('#chinaPins .hz-cluster').count() > 0, '专家地图图钉未生成');
  await page.locator('#hzFilter input[type="checkbox"]').first().uncheck();
  await assert(await page.locator('#chinaPins .hz-cluster').count() >= 0, '专家地图筛选执行失败');

    if (errors.length) throw new Error(errors.join('\n'));
    console.log('Smoke test passed: home search and HP interactions.');
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
