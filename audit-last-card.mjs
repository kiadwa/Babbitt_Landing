/* Deep-dive on the last carousel card (idx=6 - article/network panel).
   Inspects internal article-card content vs evidence-strip bounds at the
   narrow stacked viewport where the bug is visible. */
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
import { mkdirSync, existsSync, rmSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const pageUrl    = 'file:///' + resolve(__dirname, 'index.html').replace(/\\/g, '/');
const outDir     = resolve(__dirname, 'audit-last-card');
if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const viewports = [
    { name: 'mobile', w: 390, h: 844 },
    { name: 'small-tablet', w: 600, h: 900 },
    { name: 'tablet', w: 900, h: 1000 },
    { name: 'desktop', w: 1440, h: 900 }
];

(async () => {
    const browser = await chromium.launch();

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

        /* Locate the last card */
        const cardInfo = await page.evaluate(() => {
            const card = document.querySelector('.why-card[data-why-index="6"]');
            if (!card) return null;
            const rect = card.getBoundingClientRect();
            return { top: rect.top + window.scrollY };
        });
        if (!cardInfo) { await ctx.close(); continue; }

        /* Scroll so the last card is centered */
        await page.evaluate(y => window.scrollTo(0, y), Math.max(0, cardInfo.top - 100));
        await page.waitForTimeout(400);

        const probe = await page.evaluate(() => {
            const card = document.querySelector('.why-card[data-why-index="6"]');
            const visual = card.querySelector('.why-card-visual');
            const stage = visual.querySelector('.evidence-stage');
            const article = visual.querySelector('.article-card');
            const heroPhoto = visual.querySelector('.article-hero--photo');
            const body = visual.querySelector('.article-body');
            const headline = visual.querySelector('.article-headline');
            const snippet = visual.querySelector('.article-snippet');
            const foot = visual.querySelector('.article-foot');
            const strip = visual.querySelector('.evidence-strip');
            const bar = visual.querySelector('.evidence-bar');

            function r(el) {
                if (!el) return null;
                const b = el.getBoundingClientRect();
                return { left: Math.round(b.left), top: Math.round(b.top), right: Math.round(b.right), bottom: Math.round(b.bottom), w: Math.round(b.width), h: Math.round(b.height) };
            }

            const visualRect = r(visual);
            const stageRect = r(stage);
            const articleRect = r(article);
            const bodyRect = r(body);
            const stripRect = r(strip);
            const barRect = r(bar);

            return {
                visualRect, stageRect, articleRect, bodyRect, stripRect, barRect,
                heroPhoto: r(heroPhoto),
                headline: r(headline),
                snippet: r(snippet),
                foot: r(foot),
                articleOverflowsStage: articleRect && stageRect ? (articleRect.bottom > stageRect.bottom + 1) : false,
                bodyOverlapsStrip: bodyRect && stripRect ? (bodyRect.bottom > stripRect.top + 1) : false,
                articleScrollH: article.scrollHeight,
                stageScrollH: stage.scrollHeight,
                visualOverflow: getComputedStyle(visual).overflow,
                stageOverflow: getComputedStyle(stage).overflow,
                articleOverflow: getComputedStyle(article).overflow
            };
        });
        console.log(JSON.stringify(probe, null, 2));

        await page.screenshot({ path: join(outDir, `${vp.name}.png`), fullPage: false });
        await ctx.close();
    }

    await browser.close();
})();
