// Founders section audit — static profile cards.
import { webkit, devices } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { rmSync, mkdirSync } from 'node:fs';
import { runProbe, scoreProbes, printReport } from './audit-lib/probe.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, 'audit-section-founders-shots');
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
    await page.locator('#founders').scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const box = await page.locator('#founders').boundingBox();
    if (box) await page.screenshot({ path: join(OUT, `${name}.png`), clip: box });
    const { probes, error } = await runProbe(page, '#founders');
    if (error) { console.log(error); continue; }
    const issues = scoreProbes(probes);
    printReport(name, viewport, '#founders', probes, issues);
    totalIssues += issues.length;
    await ctx.close();
}
await browser.close();
console.log(`\nShots in ${OUT}`);
if (totalIssues > 0) { console.log(`\nFAIL: ${totalIssues} issues.`); process.exit(1); }
console.log(`\nPASS: founders clean.`);
