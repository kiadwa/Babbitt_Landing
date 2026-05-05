/* Visual test harness for the hero card-fold animation.
   Scrolls the landing page in measured steps and saves a screenshot at
   each step so the choreography can be inspected frame-by-frame.

   Run:    node audit-hero-scroll.mjs
   Output: ./scroll-shots/desktop-NN-YY.png  (NN = step index, YY = scrollY)
*/

import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
import { mkdirSync, rmSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const pageUrl    = 'file:///' + resolve(__dirname, 'index.html').replace(/\\/g, '/');
const outDir     = resolve(__dirname, 'scroll-shots');

if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const viewport = { width: 1440, height: 900 };

// 13 evenly spaced scroll positions from 0 to 1.2 × viewport height.
// 1.0 = hero top has scrolled exactly one viewport above; 1.2 catches a bit
// after the hero is gone so we can confirm the stack exits cleanly.
const STEPS = 13;
const MAX_FRACTION = 1.2;

(async () => {
    const browser = await chromium.launch();
    const ctx = await browser.newContext({
        viewport,
        deviceScaleFactor: 1,
        reducedMotion: 'no-preference',
    });
    const page = await ctx.newPage();

    page.on('pageerror', e => console.log('PAGE ERROR:', e.message));
    page.on('console',   m => {
        if (m.type() === 'error') console.log('CONSOLE ERROR:', m.text());
    });

    await page.goto(pageUrl, { waitUntil: 'networkidle' });
    // Wait long enough for the .anim-hero entrance animation (0.9s + 0.5s max
    // delay = ~1.4s) to finish so the first screenshot captures the static
    // layout, not a mid-entrance frame.
    await page.waitForTimeout(1700);

    const heroBox = await page.$eval('.hero', el => {
        const r = el.getBoundingClientRect();
        return { top: r.top + window.scrollY, height: r.height };
    });
    console.log(`hero: top=${Math.round(heroBox.top)} height=${Math.round(heroBox.height)} viewport=${viewport.height}`);

    for (let i = 0; i < STEPS; i++) {
        const frac = (i / (STEPS - 1)) * MAX_FRACTION;
        const y    = Math.round(viewport.height * frac);
        await page.evaluate(scrollY => window.scrollTo(0, scrollY), y);
        // wait long enough for transform/transition to settle but short enough
        // to keep the run snappy.
        await page.waitForTimeout(180);

        const probe = await page.evaluate(() => {
            const hero    = document.querySelector('.hero');
            const heroR   = hero.getBoundingClientRect();
            const cards   = ['.peek--lanes', '.peek--why', '.peek--demo', '.peek--founders', '.mosaic-center']
                .map(sel => {
                    const el = document.querySelector(sel);
                    if (!el) return [sel, null];
                    const r = el.getBoundingClientRect();
                    return [sel, {
                        x: Math.round(r.left + r.width / 2),
                        y: Math.round(r.top + r.height / 2),
                        w: Math.round(r.width),
                        h: Math.round(r.height),
                        op: getComputedStyle(el).opacity,
                    }];
                });
            return {
                scrollY: window.scrollY,
                heroBottom: Math.round(heroR.bottom),
                heroTop: Math.round(heroR.top),
                isCollapsing: hero.classList.contains('is-collapsing'),
                cards: Object.fromEntries(cards),
            };
        });

        const tag  = `${String(i).padStart(2, '0')}-y${String(y).padStart(4, '0')}`;
        const file = join(outDir, `desktop-${tag}.png`);
        await page.screenshot({ path: file });
        console.log(`step ${i.toString().padStart(2)} y=${y.toString().padStart(4)} heroTop=${String(probe.heroTop).padStart(5)} heroBottom=${String(probe.heroBottom).padStart(5)} collapsing=${probe.isCollapsing}`);
        for (const [sel, data] of Object.entries(probe.cards)) {
            if (data) {
                console.log(`           ${sel.padEnd(18)} center=(${String(data.x).padStart(4)},${String(data.y).padStart(4)}) size=${String(data.w).padStart(4)}x${String(data.h).padStart(3)} op=${data.op}`);
            }
        }
    }

    await browser.close();
    console.log(`\n→ ${STEPS} screenshots written to ${outDir}`);
})();
