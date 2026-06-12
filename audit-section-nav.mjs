// Nav audit — yellow-on-dark palette in idle state, plus the mobile hamburger
// menu open state on iPhone viewport.
import { webkit, devices } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { rmSync, mkdirSync } from 'node:fs';
import { runProbe, scoreProbes, printReport } from './audit-lib/probe.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, 'audit-section-nav-shots');
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
    await page.waitForTimeout(400);

    // State 1: idle nav.
    const nav = page.locator('nav.navbar');
    const navBox = await nav.boundingBox();
    if (navBox) await page.screenshot({ path: join(OUT, `${name}-idle.png`), clip: navBox });
    const { probes: p1 } = await runProbe(page, 'nav.navbar');
    const i1 = scoreProbes(p1);
    printReport(name, viewport, 'nav.navbar (idle)', p1, i1);
    totalIssues += i1.length;

    // State 2: mobile menu open (only meaningful on iphone viewport).
    if (name === 'iphone') {
        const hamburger = page.locator('#navHamburger');
        if (await hamburger.isVisible()) {
            await hamburger.click();
            await page.waitForTimeout(400);
            const navBox2 = await nav.boundingBox();
            if (navBox2) await page.screenshot({ path: join(OUT, `${name}-menu-open.png`), clip: navBox2 });
            const { probes: p2 } = await runProbe(page, 'nav.navbar');
            const i2 = scoreProbes(p2);
            printReport(name, viewport, 'nav.navbar (menu open)', p2, i2);
            totalIssues += i2.length;
        }
    }
    await ctx.close();
}
await browser.close();

console.log(`\nShots in ${OUT}`);
if (totalIssues > 0) {
    console.log(`\nFAIL: ${totalIssues} issues across nav.`);
    process.exit(1);
}
console.log(`\nPASS: nav clean.`);
