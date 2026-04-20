import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pageUrl = 'file:///' + resolve(__dirname, 'index.html').replace(/\\/g, '/');

(async () => {
  const browser = await chromium.launch();

  // Mobile overflow debug
  const ctx = await browser.newContext({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.goto(pageUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Find overflowing elements
  const overflowing = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const results = [];
    document.querySelectorAll('*').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.right > docWidth + 1 || rect.left < -1) {
        const tag = el.tagName.toLowerCase();
        const cls = el.className ? `.${Array.from(el.classList).join('.')}` : '';
        const id = el.id ? `#${el.id}` : '';
        results.push({
          selector: `${tag}${id}${cls}`,
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          docWidth,
        });
      }
    });
    return results;
  });

  console.log('=== Mobile overflow elements ===');
  // Deduplicate by showing unique selectors
  const seen = new Set();
  overflowing.forEach(o => {
    if (!seen.has(o.selector)) {
      seen.add(o.selector);
      console.log(`  ${o.selector}: left=${o.left}, right=${o.right}, width=${o.width} (viewport=${o.docWidth})`);
    }
  });

  // Check section-by-section widths
  const sections = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const sels = ['.navbar', '.hero', '.stats', '.features', '.lanes', '.steps', '.waitlist', '.founders', '.footer'];
    return sels.map(s => {
      const el = document.querySelector(s);
      if (!el) return { selector: s, exists: false };
      const r = el.getBoundingClientRect();
      return { selector: s, width: Math.round(r.width), scrollWidth: el.scrollWidth, overflow: el.scrollWidth > docWidth };
    });
  });

  console.log('\n=== Section widths on mobile ===');
  sections.forEach(s => {
    if (s.exists === false) return console.log(`  ${s.selector}: NOT FOUND`);
    console.log(`  ${s.selector}: width=${s.width}, scrollWidth=${s.scrollWidth}${s.overflow ? ' ** OVERFLOW **' : ''}`);
  });

  // Desktop: check CTA alignment relative to headline
  const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page2 = await ctx2.newPage();
  await page2.goto(pageUrl, { waitUntil: 'networkidle' });
  await page2.waitForTimeout(1000);

  const alignment = await page2.evaluate(() => {
    const headline = document.querySelector('h1.hero-headline');
    const cta = document.querySelector('.hero-cta');
    const btn = document.querySelector('#btnMember');
    const subline = document.querySelector('.hero-subline');
    const partner = document.querySelector('.hero-partner-link');
    const heroInner = document.querySelector('.hero-inner');

    const get = el => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width), centerX: Math.round(r.left + r.width / 2) };
    };

    return {
      heroInner: get(heroInner),
      headline: get(headline),
      cta: get(cta),
      btn: get(btn),
      subline: get(subline),
      partner: get(partner),
    };
  });

  console.log('\n=== Desktop alignment ===');
  Object.entries(alignment).forEach(([k, v]) => {
    if (v) console.log(`  ${k}: left=${v.left}, right=${v.right}, width=${v.width}, centerX=${v.centerX}`);
  });

  // Check that feature/lane cards are rendering
  const cardCounts = await page2.evaluate(() => {
    return {
      featureCards: document.querySelectorAll('.feature-card').length,
      laneCards: document.querySelectorAll('.lane-card').length,
      stepCards: document.querySelectorAll('.step-card').length,
      founderCards: document.querySelectorAll('.founder-card').length,
    };
  });
  console.log('\n=== Card counts ===');
  console.log(cardCounts);

  await browser.close();
})();
