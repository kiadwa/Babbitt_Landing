/* Probe the WHO card hover-reveal: default state hides the role grid;
   hover fades it in and the eyebrow/title/arrow out; each role link
   anchors to its lane card in #lanes. */
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

    const def = await page.evaluate(() => {
        const r = document.querySelector('.peek-roles');
        const cs = getComputedStyle(r);
        return {
            opacity: cs.opacity,
            pe: cs.pointerEvents,
            count: document.querySelectorAll('.peek-role').length
        };
    });
    console.log('default:', def);
    await page.screenshot({ path: join(outDir, 'who-default.png'),
        clip: { x: 60, y: 70, width: 480, height: 400 } });

    await page.hover('.peek--lanes');
    await page.waitForTimeout(400);

    const hov = await page.evaluate(() => {
        const r = document.querySelector('.peek-roles');
        const cs = getComputedStyle(r);
        const eyebrowOp = getComputedStyle(document.querySelector('.peek--lanes .peek-eyebrow')).opacity;
        const links = Array.from(document.querySelectorAll('.peek-role')).map(a => ({
            href: a.getAttribute('href'),
            text: a.innerText.trim()
        }));
        return { opacity: cs.opacity, pe: cs.pointerEvents, eyebrowOp, links };
    });
    console.log('hover:', JSON.stringify(hov, null, 2));
    await page.screenshot({ path: join(outDir, 'who-hover.png'),
        clip: { x: 60, y: 70, width: 480, height: 400 } });

    await page.click('.peek-role[href="#lane-trades"]');
    await page.waitForTimeout(800);
    const target = await page.evaluate(() => {
        const t = document.querySelector('#lane-trades');
        if (!t) return null;
        const r = t.getBoundingClientRect();
        return { y: Math.round(r.top), inView: r.top >= 0 && r.top < window.innerHeight };
    });
    console.log('after click #lane-trades:', target);

    await browser.close();
})();
