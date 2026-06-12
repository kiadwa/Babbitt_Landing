// Why-Babbitt carousel audit — probe each of the 7 slides by clicking the
// next-arrow between probes. The carousel is a horizontal slide (IIFE 4d);
// inactive cards remain in DOM but are translated offscreen.
import { webkit, devices } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { rmSync, mkdirSync } from 'node:fs';
import { runProbe, scoreProbes, printReport } from './audit-lib/probe.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, 'audit-section-why-shots');
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const TARGET = 'file://' + join(__dirname, 'index.html').replace(/\\/g, '/');

const VIEWPORTS = [
    { name: 'desktop', viewport: { width: 1440, height: 900 } },
    { name: 'iphone',  viewport: devices['iPhone 13'].viewport },
];
const SLIDES = 7;

let totalIssues = 0;
const browser = await webkit.launch();
for (const { name, viewport } of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    await page.goto(TARGET);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.locator('#why').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    for (let i = 0; i < SLIDES; i++) {
        // Probe only the active card by selector so offscreen cards' text
        // (transforms keep them in DOM with non-zero rect) doesn't get
        // double-counted across slides.
        const activeSel = `.why-card[data-why-index="${i}"]`;
        const box = await page.locator('.why-stage').boundingBox();
        if (box) await page.screenshot({ path: join(OUT, `${name}-slide-${i}.png`), clip: box });
        const { probes, error } = await runProbe(page, activeSel);
        if (error) { console.log(error); continue; }
        const issues = scoreProbes(probes);
        printReport(name, viewport, `${activeSel}`, probes, issues);
        totalIssues += issues.length;

        // Advance to next slide via arrow click (last iter skips).
        if (i < SLIDES - 1) {
            const arrow = page.locator('#whyArrowRight');
            if (await arrow.isVisible()) {
                await arrow.click({ force: true, timeout: 5000 }).catch(() => {});
                await page.waitForTimeout(500);
            }
        }
    }
    await ctx.close();
}
await browser.close();
console.log(`\nShots in ${OUT}`);
if (totalIssues > 0) { console.log(`\nFAIL: ${totalIssues} issues.`); process.exit(1); }
console.log(`\nPASS: why carousel clean.`);
