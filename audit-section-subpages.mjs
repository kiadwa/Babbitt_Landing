// Sub-pages audit: only demo/index.html is audited. qrlanding/ is a tiny
// redirect-only page (one styled <a> link with trivially-passing contrast on
// dark bg) that bounces to https://babbitt.app/ via meta-refresh + JS
// window.location.replace — auditing it inside Playwright either lets the
// redirect fire (auditing the live site instead) or hangs goto when the
// redirect is blocked. Visually inspect qrlanding directly if changed.
import { webkit, devices } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { rmSync, mkdirSync } from 'node:fs';
import { runProbe, scoreProbes, printReport } from './audit-lib/probe.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, 'audit-section-subpages-shots');
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
    { name: 'desktop', viewport: { width: 1440, height: 900 } },
    { name: 'iphone',  viewport: devices['iPhone 13'].viewport },
];

const PAGES = [
    { path: 'demo/index.html', label: 'demo' },
];

let totalIssues = 0;
const browser = await webkit.launch();
for (const { path: relPath, label } of PAGES) {
    const target = 'file://' + join(__dirname, relPath).replace(/\\/g, '/');
    for (const { name, viewport } of VIEWPORTS) {
        const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2 });
        const page = await ctx.newPage();
        await page.goto(target);
        await page.waitForLoadState('networkidle').catch(() => {});
        await page.evaluate(() => document.fonts && document.fonts.ready);
        await page.waitForTimeout(500);
        await page.screenshot({ path: join(OUT, `${label}-${name}.png`), fullPage: true });
        const { probes, error } = await runProbe(page, 'body');
        if (error) { console.log(error); continue; }
        // Filter zero-size <option> false positives.
        const filtered = probes.filter((p) => !/option$/.test(p.path) || (p.w > 0 || p.h > 0));
        const issues = scoreProbes(filtered);
        printReport(`${label} / ${name}`, viewport, 'body', filtered, issues);
        totalIssues += issues.length;
        await ctx.close();
    }
}
await browser.close();
console.log(`\nShots in ${OUT}`);
if (totalIssues > 0) { console.log(`\nFAIL: ${totalIssues} issues.`); process.exit(1); }
console.log(`\nPASS: sub-pages clean.`);
