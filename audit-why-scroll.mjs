/* Walk the Why carousel through 12 evenly-spaced scroll positions and verify
   that exactly one card is centered + opaque, right-rail cards are off to the
   right, past cards have faded out. Mirrors audit-hero-scroll.mjs in shape. */
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
    const ctx = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 1,
        reducedMotion: 'no-preference'
    });
    const page = await ctx.newPage();
    await page.goto(pageUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1700);

    /* Scroll to mid-section first so any deferred layout (hero fold, fonts)
       settles, then measure. */
    await page.evaluate(() => window.scrollTo(0, 2000));
    await page.waitForTimeout(400);

    const geom = await page.evaluate(() => {
        const why = document.querySelector('.why');
        const r = why.getBoundingClientRect();
        return {
            top: window.scrollY + r.top,
            height: why.offsetHeight,
            innerH: window.innerHeight
        };
    });
    const scrollMax = geom.top + (geom.height - geom.innerH);
    const STEPS = 12;
    let allOK = true;

    console.log(`whyTop=${geom.top}  whyHeight=${geom.height}  scrollMax=${scrollMax}\n`);

    for (let i = 0; i < STEPS; i++) {
        const y = Math.round(geom.top + ((geom.height - geom.innerH) * i) / (STEPS - 1));
        await page.evaluate(yy => window.scrollTo(0, yy), y);
        await page.waitForTimeout(220);

        const probe = await page.evaluate(() => {
            const stageRect = document.querySelector('.why-stage').getBoundingClientRect();
            const stageCx = stageRect.left + stageRect.width / 2;
            const cards = Array.from(document.querySelectorAll('.why-card')).map(el => {
                const r = el.getBoundingClientRect();
                return {
                    idx: parseInt(el.dataset.whyIndex, 10),
                    label: el.dataset.whyLabel,
                    cx: r.left + r.width / 2,
                    cy: r.top + r.height / 2,
                    w: r.width,
                    op: parseFloat(getComputedStyle(el).opacity),
                    inline: el.style.transform.substring(0, 60)
                };
            });
            const titleText = document.querySelector('.why-title-text').textContent;
            const indexText = document.querySelector('.why-index').textContent;
            return { stageCx, cards, titleText, indexText };
        });

        const stageCx = probe.stageCx;
        const opaque = probe.cards.filter(c => c.op > 0.85);
        const centered = probe.cards.filter(c => Math.abs(c.cx - stageCx) < 80 && c.op > 0.85);

        // Steady state: 1 opaque card centered. Mid-transition: 2 opaque
        // cards sliding side-by-side through the frame (one already past
        // center, one approaching). Anything else means the JS positioned
        // extra cards in the visible band.
        let stepOK = (opaque.length === 1 && centered.length === 1)
                  || (opaque.length === 2);
        const titleMatch = centered.length === 1
            ? (centered[0].label === probe.titleText)
            : true;
        if (!titleMatch) stepOK = false;

        const right = probe.cards.filter(c => c.cx > stageCx + 100 && c.op > 0.05);
        const past = probe.cards.filter(c => c.cx < stageCx - 100);

        const tag = `why-${String(i).padStart(2, '0')}-y${String(y).padStart(4, '0')}`;
        await page.screenshot({ path: join(outDir, `${tag}.png`) });

        console.log(`y=${y}  title="${probe.titleText}"(${probe.indexText})  opaque=${opaque.length}  centered=${centered.length}  right-rail=${right.length}  past=${past.length}  ${stepOK ? 'OK' : 'FAIL'}`);
        if (!stepOK) allOK = false;
        for (const c of probe.cards) {
            const tag2 = (c.cx < stageCx - 100) ? 'past' :
                         (c.cx > stageCx + 100) ? 'right' :
                         'center';
            console.log(`    [${c.idx}] ${tag2.padEnd(6)} cx=${Math.round(c.cx)} cy=${Math.round(c.cy)} w=${Math.round(c.w)} op=${c.op.toFixed(2)}  T="${c.inline}"`);
        }
    }

    /* Mobile pass */
    console.log('\n--- mobile pass (390x844) ---');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);

    const mob = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.why-card')).map(el => {
            const r = el.getBoundingClientRect();
            const s = el.style;
            return {
                idx: parseInt(el.dataset.whyIndex, 10),
                top: Math.round(r.top + window.scrollY),
                inlineTransform: s.transform,
                inlineOpacity: s.opacity,
                op: parseFloat(getComputedStyle(el).opacity)
            };
        });
    });
    let stacked = true, prevTop = -Infinity;
    for (const m of mob) {
        if (m.top <= prevTop) stacked = false;
        if (m.inlineTransform !== '' || (m.inlineOpacity !== '' && m.inlineOpacity !== '1')) stacked = false;
        prevTop = m.top;
        console.log(`  [${m.idx}] top=${m.top} op=${m.op}  inline.t="${m.inlineTransform}" inline.o="${m.inlineOpacity}"`);
    }
    console.log(`mobile stacked + clean inline: ${stacked ? 'OK' : 'FAIL'}`);
    if (!stacked) allOK = false;

    await browser.close();
    process.exit(allOK ? 0 : 1);
})();
