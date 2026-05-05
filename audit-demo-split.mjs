/* Hover the Product&Demo card and verify the two diagonal halves animate
   in (clip-path expands from each corner) and remain clickable. */
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
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(pageUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    // Locate demo card
    const box = await page.evaluate(() => {
        const r = document.querySelector('.peek--demo').getBoundingClientRect();
        return { x: Math.round(r.left), y: Math.round(r.top),
                 w: Math.round(r.width), h: Math.round(r.height) };
    });
    console.log('demo card box:', box);

    // Default
    const def = await page.evaluate(() => {
        const a = document.querySelector('.peek-half--babbitt');
        const b = document.querySelector('.peek-half--cc');
        return {
            a_op: getComputedStyle(a).opacity,
            b_op: getComputedStyle(b).opacity,
            a_pe: getComputedStyle(a).pointerEvents,
            b_pe: getComputedStyle(b).pointerEvents,
            a_clip: getComputedStyle(a).clipPath,
            b_clip: getComputedStyle(b).clipPath
        };
    });
    console.log('default:', def);
    await page.screenshot({ path: join(outDir, 'demo-default.png'),
        clip: { x: box.x - 6, y: box.y - 6, width: box.w + 12, height: box.h + 12 } });

    // Mid-transition snapshot (~150ms after hover starts, well into the 450ms tween)
    await page.hover('.peek--demo');
    await page.waitForTimeout(150);
    await page.screenshot({ path: join(outDir, 'demo-mid.png'),
        clip: { x: box.x - 6, y: box.y - 6, width: box.w + 12, height: box.h + 12 } });

    // Settled hover state
    await page.waitForTimeout(500);
    const hov = await page.evaluate(() => {
        const a = document.querySelector('.peek-half--babbitt');
        const b = document.querySelector('.peek-half--cc');
        return {
            a_op: getComputedStyle(a).opacity,
            b_op: getComputedStyle(b).opacity,
            a_pe: getComputedStyle(a).pointerEvents,
            b_pe: getComputedStyle(b).pointerEvents,
            a_href: a.getAttribute('href'),
            b_href: b.getAttribute('href'),
            b_target: b.getAttribute('target')
        };
    });
    console.log('hover:', hov);
    await page.screenshot({ path: join(outDir, 'demo-hover.png'),
        clip: { x: box.x - 6, y: box.y - 6, width: box.w + 12, height: box.h + 12 } });

    await browser.close();
})();
