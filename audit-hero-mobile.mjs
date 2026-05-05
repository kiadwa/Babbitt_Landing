/* Verify the fold animation is disabled on mobile and the mosaic
   simply renders as a stacked column. */
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
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(pageUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1700);

    for (const y of [0, 200, 500, 800]) {
        await page.evaluate(yy => window.scrollTo(0, yy), y);
        await page.waitForTimeout(180);
        await page.screenshot({ path: join(outDir, `mobile-y${String(y).padStart(4,'0')}.png`) });
    }

    const probe = await page.evaluate(() => {
        const hero = document.querySelector('.hero.hero-mosaic');
        const cards = ['.peek--lanes', '.peek--why', '.peek--demo', '.peek--founders', '.mosaic-center'];
        return {
            collapsing: hero.classList.contains('is-collapsing'),
            cards: cards.map(sel => {
                const el = document.querySelector(sel);
                if (!el) return [sel, null];
                const r = el.getBoundingClientRect();
                const cs = getComputedStyle(el);
                return [sel, {
                    rect: { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) },
                    opacity: cs.opacity,
                    transform: cs.transform,
                    inlineTransform: el.style.transform,
                    inlineOpacity: el.style.opacity,
                    animation: cs.animation,
                }];
            }),
        };
    });
    console.log('mobile collapsing class set:', probe.collapsing, '(expected false)');
    for (const [sel, c] of probe.cards) {
        if (!c) { console.log(`  ${sel}: NOT FOUND`); continue; }
        console.log(`  ${sel}: rect=${JSON.stringify(c.rect)} opacity=${c.opacity} transform=${c.transform.substring(0, 60)}`);
        console.log(`    inline.transform="${c.inlineTransform}" inline.opacity="${c.inlineOpacity}"`);
    }

    await browser.close();
})();
