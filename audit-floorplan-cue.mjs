/* Verify the floor plan click affordance:
   1. .sheet-note renders between scale (bottom-left) and compass (bottom-right)
   2. .room-cue chevron appears in top-right of every room
   3. Hover state on a room brightens its chevron + lifts it
   4. No collision with .room-dim--top or .room-tag
*/
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
import { mkdirSync, existsSync, rmSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const pageUrl    = 'file:///' + resolve(__dirname, 'index.html').replace(/\\/g, '/');
const outDir     = resolve(__dirname, 'audit-floorplan-cue');
if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const viewports = [
    { name: 'desktop', w: 1440, h: 900 },
    { name: 'narrow',  w: 1100, h: 900 },
    { name: 'tablet',  w: 820,  h: 1000 },
    { name: 'mobile',  w: 390,  h: 844 }
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
        await page.waitForTimeout(800);

        /* Scroll the floor plan into view */
        const fpTop = await page.evaluate(() => {
            const fp = document.querySelector('.floorplan-sheet');
            return fp ? fp.getBoundingClientRect().top + window.scrollY : -1;
        });
        if (fpTop < 0) {
            console.log('  floorplan not found');
            allOK = false;
            await ctx.close();
            continue;
        }
        await page.evaluate(y => window.scrollTo(0, y - 60), fpTop);
        await page.waitForTimeout(500);

        const probe = await page.evaluate(() => {
            const sheet = document.querySelector('.floorplan-sheet');
            const note  = document.querySelector('.sheet-note');
            const scale = document.querySelector('.sheet-scale');
            const compass = document.querySelector('.sheet-compass');
            const cues  = Array.from(document.querySelectorAll('.room-cue'));

            function r(el) {
                if (!el) return null;
                const b = el.getBoundingClientRect();
                return { left: Math.round(b.left), top: Math.round(b.top), right: Math.round(b.right), bottom: Math.round(b.bottom), w: Math.round(b.width), h: Math.round(b.height) };
            }

            const cueData = cues.map(c => {
                const room = c.closest('.room');
                const tag = room.querySelector('.room-tag');
                const dimTop = room.querySelector('.room-dim--top');
                const rr = r(room);
                const cr = r(c);
                const tr = r(tag);
                const dr = r(dimTop);
                const collidesTag = tr && cr ? (cr.left < tr.right + 1 && cr.top < tr.bottom + 1 && cr.bottom > tr.top - 1) : false;
                const collidesDim = dr && cr ? (cr.left < dr.right + 1 && cr.right > dr.left - 1 && cr.top < dr.bottom + 1 && cr.bottom > dr.top - 1) : false;
                const inTopRightOfRoom = cr && rr ? (cr.right <= rr.right + 2 && cr.top >= rr.top - 2 && (rr.right - cr.right) < 32 && (cr.top - rr.top) < 32) : false;
                return {
                    room: room.className.match(/room--\w+/)?.[0] ?? '?',
                    cue: cr,
                    inTopRightOfRoom,
                    collidesTag,
                    collidesDim
                };
            });

            return {
                sheetRect:   r(sheet),
                noteRect:    r(note),
                scaleRect:   r(scale),
                compassRect: r(compass),
                noteVisible: !!note && note.offsetWidth > 0,
                noteBetweenScaleAndCompass: note && scale && compass
                    ? (r(note).left > r(scale).right && r(note).right < r(compass).left)
                    : false,
                cues: cueData
            };
        });

        console.log(`  note: visible=${probe.noteVisible} between=${probe.noteBetweenScaleAndCompass} rect=${JSON.stringify(probe.noteRect)}`);
        let fails = 0;
        for (const c of probe.cues) {
            const ok = c.inTopRightOfRoom && !c.collidesTag && !c.collidesDim;
            if (!ok) fails++;
            console.log(`  cue[${c.room}] topRight=${c.inTopRightOfRoom} tagHit=${c.collidesTag} dimHit=${c.collidesDim} ${ok ? 'OK' : 'FAIL'}`);
        }
        if (!probe.noteVisible || probe.cues.length === 0 || fails > 0) allOK = false;

        await page.screenshot({ path: join(outDir, `${vp.name}-overview.png`), fullPage: false });

        /* Hover the trades room and screenshot to verify hover state */
        const trades = await page.$('.room--trades');
        if (trades) {
            await trades.hover();
            await page.waitForTimeout(400);
            await page.screenshot({ path: join(outDir, `${vp.name}-hover-trades.png`), fullPage: false });
        }

        await ctx.close();
    }

    await browser.close();
    process.exit(allOK ? 0 : 1);
})();
