// Floor plan surface audit — the visible "who is Babbitt for" floor plan.
// Modals (room interiors) are already audited by audit-floorplan-safari.mjs;
// this just probes the surface labels + section eyebrow.
import { webkit, devices } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { rmSync, mkdirSync } from 'node:fs';
import { runProbe, scoreProbes, printReport } from './audit-lib/probe.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, 'audit-section-floorplan-shots');
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
    await page.locator('#features').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const box = await page.locator('#features').boundingBox();
    if (box) await page.screenshot({ path: join(OUT, `${name}.png`), clip: box });
    const { probes, error } = await runProbe(page, '#features');
    if (error) { console.log(error); continue; }
    const issues = scoreProbes(probes);
    printReport(name, viewport, '#features', probes, issues);
    totalIssues += issues.length;
    await ctx.close();
}
await browser.close();
console.log(`\nShots in ${OUT}`);
if (totalIssues > 0) { console.log(`\nFAIL: ${totalIssues} issues.`); process.exit(1); }
console.log(`\nPASS: floor plan surface clean.`);
