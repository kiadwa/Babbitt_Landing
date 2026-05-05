/* Verify cards un-fold cleanly when scrolling back to the top. */
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
    await page.goto(pageUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1700);

    // Scroll forward, then back, capturing at the same key positions twice
    const sequence = [
        { y: 0,   tag: 'fwd-y0000' },
        { y: 200, tag: 'fwd-y0200' },
        { y: 400, tag: 'fwd-y0400' },
        { y: 600, tag: 'fwd-y0600' },
        { y: 400, tag: 'rev-y0400' },
        { y: 200, tag: 'rev-y0200' },
        { y: 0,   tag: 'rev-y0000' },
    ];

    for (const { y, tag } of sequence) {
        await page.evaluate(yy => window.scrollTo(0, yy), y);
        await page.waitForTimeout(220);
        const probe = await page.evaluate(() => {
            const c = document.querySelector('.peek--lanes');
            const r = c.getBoundingClientRect();
            return { x: Math.round(r.left + r.width/2), y: Math.round(r.top + r.height/2), w: Math.round(r.width), inline: c.style.transform };
        });
        await page.screenshot({ path: join(outDir, `reverse-${tag}.png`) });
        console.log(`${tag}: lanes center=(${probe.x},${probe.y}) w=${probe.w} inline.transform="${probe.inline.substring(0,80)}"`);
    }

    await browser.close();
})();
