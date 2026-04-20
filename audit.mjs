import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pageUrl = 'file:///' + resolve(__dirname, 'index.html').replace(/\\/g, '/');

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 812 },
];

(async () => {
  const browser = await chromium.launch();

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    await page.goto(pageUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    // Full page screenshot
    await page.screenshot({
      path: `audit-${vp.name}-full.png`,
      fullPage: true,
    });

    // Hero-only screenshot (above the fold)
    await page.screenshot({
      path: `audit-${vp.name}-hero.png`,
    });

    // Check for console errors
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));

    // Check hero H1 is visible
    const h1 = await page.$('h1.hero-headline');
    const h1Visible = h1 ? await h1.isVisible() : false;

    // Check cycling word
    const cycleEl = await page.$('#c-role');
    const cycleText = cycleEl ? await cycleEl.textContent() : 'NOT FOUND';

    // Check CTA button
    const cta = await page.$('#btnMember');
    const ctaVisible = cta ? await cta.isVisible() : false;

    // Check partner link
    const partnerLink = await page.$('.hero-partner-link');
    const partnerVisible = partnerLink ? await partnerLink.isVisible() : false;

    // Check for overflow
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    // Check hero-inner alignment
    const heroInnerBox = await page.$eval('.hero-inner', el => {
      const r = el.getBoundingClientRect();
      const s = window.getComputedStyle(el);
      return { textAlign: s.textAlign, alignItems: s.alignItems, left: r.left, width: r.width };
    });

    // Check headline box
    const headlineBox = await page.$eval('h1.hero-headline', el => {
      const r = el.getBoundingClientRect();
      const s = window.getComputedStyle(el);
      return { alignItems: s.alignItems, left: r.left, width: r.width, top: r.top };
    });

    // Check CTA box
    const ctaBox = await page.$eval('.hero-cta', el => {
      const r = el.getBoundingClientRect();
      const s = window.getComputedStyle(el);
      return { alignItems: s.alignItems, left: r.left, width: r.width };
    });

    console.log(`\n=== ${vp.name} (${vp.width}x${vp.height}) ===`);
    console.log(`H1 visible: ${h1Visible}`);
    console.log(`Cycle text: "${cycleText}"`);
    console.log(`CTA visible: ${ctaVisible}`);
    console.log(`Partner link visible: ${partnerVisible}`);
    console.log(`Horizontal overflow: ${overflow}`);
    console.log(`hero-inner: textAlign=${heroInnerBox.textAlign}, alignItems=${heroInnerBox.alignItems}`);
    console.log(`headline: alignItems=${headlineBox.alignItems}, left=${headlineBox.left.toFixed(0)}, width=${headlineBox.width.toFixed(0)}, top=${headlineBox.top.toFixed(0)}`);
    console.log(`CTA: alignItems=${ctaBox.alignItems}, left=${ctaBox.left.toFixed(0)}`);
    if (errors.length) console.log(`Console errors: ${errors.join('; ')}`);

    await context.close();
  }

  await browser.close();
})();
