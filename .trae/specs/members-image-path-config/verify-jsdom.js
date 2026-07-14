// Integration verification using jsdom: load the members page, execute scripts,
// and verify that avatar images and background images are resolved correctly.

const { JSDOM } = require('jsdom');

const BASE_URL = 'http://localhost:8765/team/members.html';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function run() {
  const dom = await JSDOM.fromURL(BASE_URL, {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true
  });

  const window = dom.window;
  const document = window.document;

  // jsdom does not actually load images, so stub HTMLImageElement.prototype.src
  // to immediately fire onload so the background cross-fade logic runs.
  Object.defineProperty(window.HTMLImageElement.prototype, 'src', {
    set(value) {
      this._src = value;
      if (this.onload) setTimeout(() => this.onload(), 0);
    },
    get() {
      return this._src;
    },
    configurable: true
  });

  // Wait a bit for scripts to execute and render the list.
  await new Promise(r => setTimeout(r, 500));

  // 1. Verify member strips are rendered.
  const strips = document.querySelectorAll('.member-strip');
  assert(strips.length > 0, `Expected member strips, got ${strips.length}`);
  console.log(`Found ${strips.length} member strips.`);

  // 2. Verify each avatar has a non-empty src with the expected pattern.
  const avatars = document.querySelectorAll('.strip-avatar');
  assert(avatars.length === strips.length, `Avatar count mismatch: ${avatars.length} vs ${strips.length}`);

  for (const img of avatars) {
    const src = img.getAttribute('src');
    assert(src && src.length > 0, 'Avatar src is empty');
    assert(!src.includes('${'), `Avatar src contains unresolved template: ${src}`);
    assert(!src.includes('$id'), `Avatar src contains broken variable: ${src}`);
    const candidates = img.getAttribute('data-candidates');
    assert(candidates && candidates.length > 0, 'Avatar is missing data-candidates');
  }
  console.log(`All ${avatars.length} avatars have resolved src and candidate fallback data.`);

  // 3. Click the first member and verify the background layer gets an image.
  const firstStrip = strips[0];
  const firstId = firstStrip.dataset.id;
  firstStrip.click();
  await new Promise(r => setTimeout(r, 300));

  const activeSlide = document.querySelector('.bg-slide.is-active');
  console.log('Active slide element:', activeSlide ? activeSlide.className : 'null');
  assert(activeSlide, 'No active background slide after click');
  const bgImage = activeSlide.style.backgroundImage;
  console.log('Computed backgroundImage:', bgImage);
  assert(bgImage && bgImage !== 'none', 'Background image is empty');
  assert(!bgImage.includes('${'), `Background image contains unresolved template: ${bgImage}`);
  assert(!bgImage.includes('$id'), `Background image contains broken variable: ${bgImage}`);
  console.log(`Background updated for member ${firstId}: ${bgImage}`);

  // 4. Verify the exposed fallback helper exists.
  assert(typeof window.membersImageFallback === 'function', 'membersImageFallback not exposed');
  console.log('membersImageFallback global helper is present.');

  window.close();
  console.log('jsdom integration verification passed.');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
