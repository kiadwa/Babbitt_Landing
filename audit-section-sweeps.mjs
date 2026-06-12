// Sweep overlay audits: partner blue sweep + user waitlist yellow sweep.
// Trigger by adding `active` class so form contents render in viewport.
import { webkit, devices } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { rmSync, mkdirSync } from 'node:fs';
import { runProbe, scoreProbes, printReport } from './audit-lib/probe.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, 'audit-section-sweeps-shots');
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const TARGET = 'file://' + join(__dirname, 'index.html').replace(/\\/g, '/');

const VIEWPORTS = [
    { name: 'desktop', viewport: { width: 1440, height: 900 } },
    { name: 'iphone',  viewport: devices['iPhone 13'].viewport },
];

// sweepPartner is commented out in current build; only the user waitlist
// yellow sweep is live. Audit that one. The backdrop is a sibling element
// (#userWaitlistSweep) that animates in independently — must be activated
// so the text reads on yellow, not on bg-base.
const SWEEPS = [
    { id: 'userWaitlistMessage', backdropId: 'userWaitlistSweep', backdropColor: '#F6B500', label: 'user waitlist yellow sweep' },
];

let totalIssues = 0;
const browser = await webkit.launch();
for (const { name, viewport } of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    await page.goto(TARGET);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts && document.fonts.ready);

    for (const { id, backdropId, backdropColor, label } of SWEEPS) {
        // Programmatically open the sweep AND fast-forward its delayed
        // transition by setting opacity/pointer-events inline. The CSS uses
        // a 720ms delay which would block bounding-box measurement.
        await page.evaluate(({ sweepId, bdColor }) => {
            const el = document.getElementById(sweepId);
            if (el) {
                el.classList.add('active');
                el.style.opacity = '1';
                el.style.pointerEvents = 'auto';
                el.style.transition = 'none';
                el.style.visibility = 'visible';
                // Sibling backdrop (yellow-sweep) provides the rendered colour
                // the user actually sees. Probe walks ancestors only, so paint
                // the colour on this element directly to give the probe the
                // correct effective background.
                el.style.backgroundColor = bdColor;
            }
        }, { sweepId: id, bdColor: backdropColor });
        await page.waitForTimeout(400);
        const sel = `#${id}`;
        const box = await page.evaluate((s) => {
            const el = document.querySelector(s);
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return { x: r.x, y: r.y, width: r.width, height: r.height };
        }, sel);
        if (box && box.width > 0 && box.height > 0) {
            await page.screenshot({ path: join(OUT, `${name}-${id}.png`), clip: box });
        } else {
            await page.screenshot({ path: join(OUT, `${name}-${id}.png`), fullPage: false });
        }
        const { probes, error } = await runProbe(page, sel);
        if (error) { console.log(error); continue; }
        // Filter <option> zero-size false positives — <select> options are
        // always 0×0 until the native dropdown is open, so the probe's
        // zero-size flag is structural noise here.
        const filtered = probes.filter((p) => !/option$/.test(p.path) || (p.w > 0 || p.h > 0));
        const issues = scoreProbes(filtered);
        printReport(name, viewport, sel, probes, issues);
        totalIssues += issues.length;
        // Close before next sweep.
        await page.evaluate((sweepId) => {
            const el = document.getElementById(sweepId);
            if (el) {
                el.classList.remove('active');
                el.style.cssText = '';
            }
        }, id);
        await page.waitForTimeout(200);
    }
    await ctx.close();
}
await browser.close();
console.log(`\nShots in ${OUT}`);
if (totalIssues > 0) { console.log(`\nFAIL: ${totalIssues} issues.`); process.exit(1); }
console.log(`\nPASS: sweeps clean.`);
