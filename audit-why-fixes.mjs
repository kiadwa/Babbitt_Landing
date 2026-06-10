/* Verify why-section fixes:
   1. Descender clipping on multi-line titles
   2. Title overrun into carousel at narrow viewports
   3. Last card (idx=6 "Your story...") layout integrity
*/
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
import { mkdirSync, existsSync, rmSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const pageUrl    = 'file:///' + resolve(__dirname, 'index.html').replace(/\\/g, '/');
const outDir     = resolve(__dirname, 'audit-why-fixes');
if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const viewports = [
    { name: 'wide', w: 1920, h: 1080 },
    { name: 'mid',  w: 1440, h: 900 },
    { name: 'narrow', w: 1100, h: 800 },
    { name: 'tablet', w: 900, h: 1000 }
];

(async () => {
    const browser = await chromium.launch();
    let allOK = true;

    for (const vp of viewports) {
        console.log(`\n=== ${vp.name} (${vp.w}x${vp.h}) ===`);
        const ctx = await browser.newContext({
            viewport: { width: vp.w, height: vp.h },
            deviceScaleFactor: 1,
            reducedMotion: 'no-preference'
        });
        const page = await ctx.newPage();
        await page.goto(pageUrl, { waitUntil: 'networkidle' });
        await page.waitForTimeout(1500);

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
        const NUM_CARDS = 7;

        for (let i = 0; i < NUM_CARDS; i++) {
            const y = Math.round(geom.top + ((geom.height - geom.innerH) * i) / (NUM_CARDS - 1));
            await page.evaluate(yy => window.scrollTo(0, yy), y);
            await page.waitForTimeout(300);

            const probe = await page.evaluate(() => {
                const header = document.querySelector('.why-header');
                const title  = document.querySelector('.why-title');
                const titleText = document.querySelector('.why-title-text');
                const stage  = document.querySelector('.why-stage');
                const hr = header.getBoundingClientRect();
                const tr = title.getBoundingClientRect();
                const sr = stage.getBoundingClientRect();
                const cs = getComputedStyle(title);

                /* Detect overrun: header bottom-right corner crossing stage area. */
                const headerOverlapsStage =
                    hr.right > sr.left &&
                    hr.bottom > sr.top &&
                    hr.top < sr.bottom;

                /* Detect descender clip: bottom of title is clipped by header
                   container. Container's clientHeight should be >= title scrollHeight. */
                const titleClipped = header.scrollHeight > header.clientHeight + 2;

                return {
                    headerRect: { left: Math.round(hr.left), top: Math.round(hr.top), right: Math.round(hr.right), bottom: Math.round(hr.bottom), width: Math.round(hr.width), height: Math.round(hr.height) },
                    titleRect: { left: Math.round(tr.left), top: Math.round(tr.top), right: Math.round(tr.right), bottom: Math.round(tr.bottom), width: Math.round(tr.width), height: Math.round(tr.height) },
                    stageRect: { left: Math.round(sr.left), top: Math.round(sr.top), right: Math.round(sr.right), bottom: Math.round(sr.bottom) },
                    titleText: titleText.textContent,
                    titleLines: Math.round(tr.height / parseFloat(cs.lineHeight || cs.fontSize)),
                    titleLineHeight: cs.lineHeight,
                    titleFontSize: cs.fontSize,
                    headerOverflow: getComputedStyle(header).overflow,
                    headerMaxHeight: getComputedStyle(header).maxHeight,
                    headerOverlapsStage,
                    titleClipped,
                    scrollY: window.scrollY
                };
            });

            const status = (probe.headerOverlapsStage || probe.titleClipped) ? 'FAIL' : 'OK';
            if (status === 'FAIL') allOK = false;

            console.log(
                `  card ${i} (y=${y}) "${probe.titleText}" lines=${probe.titleLines} ` +
                `header=${probe.headerRect.width}x${probe.headerRect.height} ` +
                `overrun=${probe.headerOverlapsStage} clipped=${probe.titleClipped} ${status}`
            );

            const tag = `${vp.name}-card${i}`;
            await page.screenshot({
                path: join(outDir, `${tag}.png`),
                clip: { x: 0, y: 0, width: vp.w, height: Math.min(vp.h, 900) }
            });
        }

        await ctx.close();
    }

    /* Last-card deep dive at mid viewport: zoom in on the article-card content
       and look for content overflow / layout problems specific to idx=6. */
    console.log('\n=== Last card (idx=6) deep dive @ 1440x900 ===');
    const ctx2 = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        reducedMotion: 'no-preference'
    });
    const page2 = await ctx2.newPage();
    await page2.goto(pageUrl, { waitUntil: 'networkidle' });
    await page2.waitForTimeout(1500);

    const lastCardProbe = await page2.evaluate(() => {
        const why = document.querySelector('.why');
        const r = why.getBoundingClientRect();
        const top = window.scrollY + r.top;
        const height = why.offsetHeight;
        const range = Math.max(1, height - window.innerHeight);
        return { top, range };
    });
    /* Scroll to end of why section */
    await page2.evaluate(y => window.scrollTo(0, y), lastCardProbe.top + lastCardProbe.range);
    await page2.waitForTimeout(500);

    const last = await page2.evaluate(() => {
        const card = document.querySelector('.why-card[data-why-index="6"]');
        if (!card) return { error: 'last card not found' };
        const stage = document.querySelector('.why-stage');
        const visual = card.querySelector('.why-card-visual');
        const article = card.querySelector('.article-card');
        const photo = card.querySelector('.article-hero-photo');
        const headline = card.querySelector('.article-headline');
        const body = card.querySelector('.why-card-body');

        const cr = card.getBoundingClientRect();
        const sr = stage.getBoundingClientRect();
        const vr = visual?.getBoundingClientRect();
        const ar = article?.getBoundingClientRect();
        const pr = photo?.getBoundingClientRect();
        const hr = headline?.getBoundingClientRect();
        const br = body?.getBoundingClientRect();

        return {
            cardOpacity: parseFloat(getComputedStyle(card).opacity),
            cardTransform: card.style.transform,
            cardRect:    { left: Math.round(cr.left), top: Math.round(cr.top), w: Math.round(cr.width), h: Math.round(cr.height) },
            stageRect:   { left: Math.round(sr.left), top: Math.round(sr.top), w: Math.round(sr.width), h: Math.round(sr.height) },
            visualRect:  vr  ? { top: Math.round(vr.top), h: Math.round(vr.height) } : null,
            articleRect: ar  ? { top: Math.round(ar.top), h: Math.round(ar.height) } : null,
            photoRect:   pr  ? { top: Math.round(pr.top), h: Math.round(pr.height), w: Math.round(pr.width) } : null,
            headlineRect: hr ? { top: Math.round(hr.top), h: Math.round(hr.height), text: headline.textContent.substring(0,40) } : null,
            bodyRect:    br  ? { top: Math.round(br.top), h: Math.round(br.height) } : null,
            cardBottomBelowStage: cr.bottom > sr.bottom + 2,
            bodyBottomBelowStage: br ? br.bottom > sr.bottom + 2 : false
        };
    });
    console.log(JSON.stringify(last, null, 2));
    await page2.screenshot({ path: join(outDir, 'last-card-deep.png'), fullPage: false });

    await browser.close();
    process.exit(allOK ? 0 : 1);
})();
