// Hero mosaic audit — five mosaic cards + cycling spans + scroll-out fold.
// Steady state covers the colour palette; the cycle just rotates text content
// without recolouring, so one snapshot per viewport is sufficient for
// contrast/smear. Scroll-out fold (IIFE 4c) is checked separately because the
// transform changes which cards are visible.
import { webkit, devices } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { rmSync, mkdirSync } from 'node:fs';
import { runProbe, scoreProbes, printReport } from './audit-lib/probe.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, 'audit-section-hero-shots');
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const TARGET = 'file://' + join(__dirname, 'index.html').replace(/\\/g, '/');

const VIEWPORTS = [
    { name: 'desktop', viewport: { width: 1440, height: 900 } },
    { name: 'iphone',  viewport: devices['iPhone 13'].viewport },
];

let totalIssues = 0;
const browser = await webkit.launch();
for (const { name, viewport } of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    await page.goto(TARGET);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.waitForTimeout(800);

    // State 1: initial steady state.
    const hero = page.locator('section.hero#hero');
    const box = await hero.boundingBox();
    if (box) await page.screenshot({ path: join(OUT, `${name}-initial.png`), clip: box });
    const { probes: p1 } = await runProbe(page, 'section.hero#hero');
    const i1 = scoreProbes(p1);
    printReport(name, viewport, 'section.hero (initial)', p1, i1);
    totalIssues += i1.length;

    // State 2: scroll partway so the IIFE 4c scroll-out fold engages.
    await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'instant' }));
    await page.waitForTimeout(300);
    const box2 = await hero.boundingBox();
    if (box2 && box2.height > 0) {
        await page.screenshot({ path: join(OUT, `${name}-scrolled.png`), clip: box2 });
    } else {
        await page.screenshot({ path: join(OUT, `${name}-scrolled.png`), fullPage: false });
    }
    const { probes: p2 } = await runProbe(page, 'section.hero#hero');
    const i2 = scoreProbes(p2);
    printReport(name, viewport, 'section.hero (scrolled 400)', p2, i2);
    totalIssues += i2.length;

    await ctx.close();
}
await browser.close();

console.log(`\nShots in ${OUT}`);
if (totalIssues > 0) {
    console.log(`\nFAIL: ${totalIssues} issues across hero.`);
    process.exit(1);
}
console.log(`\nPASS: hero clean.`);
