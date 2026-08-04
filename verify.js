const { chromium } = require('playwright-core');
const path = require('path');

(async () => {
  const url = 'file:///' + path.resolve('human-practices/integrated human-practices.html').replace(/\\/g, '/');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('PAGEERR: ' + e.message));

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);

  const data = await page.evaluate(() => {
    const root = document.querySelector('.hp3d-root');
    const ids = ['section-overview', 'section-carousel', 'section-southchina', 'section-dialogues', 'section-education'];
    const counts = {};
    ids.forEach(id => { counts[id] = document.querySelectorAll('#' + id).length; });
    return {
      cards: root.querySelectorAll('.orbit-card').length,
      nodes: root.querySelectorAll('.timeline-node').length,
      slides: root.querySelectorAll('.detail-slide').length,
      articleInSlides: ids.map(id => {
        const slide = Array.from(root.querySelectorAll('.detail-slide')).find(s => s.querySelector('#' + id));
        const titleEl = slide ? slide.querySelector('.hp-section-header h2, .hp-section-header, h1, h2, h3') : null;
        const txt = slide ? slide.textContent.replace(/\s+/g, '').slice(0, 40) : '';
        return id + '=>' + (slide ? 'YES' : 'NO') + '[' + txt + ']';
      }),
      counts,
      panelShow: root.querySelector('.detail-panel').classList.contains('show'),
      hasHP3D: typeof window.HP3D === 'object'
    };
  });
  console.log('STEP2 DATA:', JSON.stringify(data, null, 2));

  // Click node 3 (华南交流会, index 2) -> slide should switch
  const labels = await page.evaluate(() => Array.from(document.querySelectorAll('.hp3d-root .timeline-node-label')).map(n => n.textContent));
  console.log('NODE LABELS:', JSON.stringify(labels));
  await page.evaluate(() => document.querySelectorAll('.hp3d-root .timeline-node')[2].click());
  await page.waitForTimeout(700);
  const afterNode = await page.evaluate(() => {
    const root = document.querySelector('.hp3d-root');
    const track = root.querySelector('.detail-track');
    const current = Array.from(root.querySelectorAll('.detail-slide')).findIndex(s => s.querySelector('#section-southchina'));
    return {
      counter: root.querySelector('.detail-counter').textContent,
      trackTransform: track.style.transform,
      southchinaVisible: !!root.querySelector('.detail-slide #section-southchina')
    };
  });
  console.log('AFTER CLICK NODE 3:', JSON.stringify(afterNode));

  // Sidebar nav click -> index 4 (中学生)
  await page.evaluate(() => { const a = document.querySelector('a[data-hp-slide="4"]'); if (a) a.click(); });
  await page.waitForTimeout(700);
  const afterNav = await page.evaluate(() => {
    const root = document.querySelector('.hp3d-root');
    return { counter: root.querySelector('.detail-counter').textContent, hasEducation: !!root.querySelector('.detail-slide #section-education') };
  });
  console.log('AFTER SIDEBAR CLICK (slide 4):', JSON.stringify(afterNav));

  // screenshot of full hero+panel
  const hero = await page.$('.hp3d-root');
  await hero.screenshot({ path: 'verify-step2.png' });
  await page.screenshot({ path: 'verify-step2-full.png', fullPage: true });
  console.log('ERRORS (may be from other site scripts):', errors.slice(0, 6));
  await browser.close();
})();
