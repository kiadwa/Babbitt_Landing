/* Reproduce the browser scroll-restoration scenario.
   Loads the page and immediately sets scrollY > 0 before any deferred
   work runs. Confirms cards still render (opacity:1, finite transforms)
   instead of going blank. */
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
import { mkdirSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const pageUrl    = 'file:///' + resolve(__dirname, 'index.html').replace(/\\/g, '/');
const outDir     = resolve(__dirname, 'scroll-shots');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

(async () => {
    const browser = await chromium.launch();
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'no-preference' });
    const page = await ctx.newPage();

    // domcontentloaded — script.js has run, but page hasn't finished
    // network/resource loading. This is when scroll-restoration fires.
    await page.goto(pageUrl, { waitUntil: 'domcontentloaded' });
    // Force a scroll event before anything else can run.
    await page.evaluate(() => window.scrollTo(0, 250));
    await page.waitForTimeout(200);

    const probe = await page.evaluate(() => {
        const cards = ['.peek--lanes', '.peek--why', '.peek--demo', '.peek--founders', '.mosaic-center'];
        return cards.map(sel => {
            const el = document.querySelector(sel);
            if (!el) return [sel, null];
            const cs = getComputedStyle(el);
            const t = el.style.transform;
            return [sel, {
                opacity: cs.opacity,
                inlineTransform: t,
                hasNaN: t.indexOf('NaN') !== -1,
            }];
        });
    });
    await page.screenshot({ path: join(outDir, 'restore-scroll250.png') });
    console.log('After scroll-restoration to y=250:');
    for (const [sel, c] of probe) {
        console.log(`  ${sel}: opacity=${c.opacity} hasNaN=${c.hasNaN} inlineTransform="${c.inlineTransform.substring(0, 80)}"`);
    }

    // Now scroll back to 0 to confirm cards reset cleanly.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    const probe0 = await page.evaluate(() => {
        return ['.peek--lanes', '.peek--why', '.peek--demo', '.peek--founders', '.mosaic-center'].map(sel => {
            const el = document.querySelector(sel);
            return [sel, { opacity: getComputedStyle(el).opacity, inlineTransform: el.style.transform }];
        });
    });
    await page.screenshot({ path: join(outDir, 'restore-back-to-0.png') });
    console.log('\nAfter scrolling back to y=0:');
    for (const [sel, c] of probe0) {
        console.log(`  ${sel}: opacity=${c.opacity} inlineTransform="${c.inlineTransform.substring(0, 80)}"`);
    }

    await browser.close();
})();
