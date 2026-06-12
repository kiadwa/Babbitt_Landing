// Shared Safari/WebKit visibility probe — used by every section runner in
// audit-lib/*. The probe walks every text-bearing leaf under a root selector,
// composites translucent backgrounds top→bottom so the contrast number is what
// the eye actually sees, and flags WCAG AA failures + Safari smear risks
// (sub-10px bold uppercase) + zero-size + clip-path overflow.
//
// Re-export `runProbe(page, rootSel)` from a Playwright runner.

export async function runProbe(page, rootSel) {
    return page.evaluate(({ rootSel }) => {
        const root = document.querySelector(rootSel);
        if (!root) return { error: `root not found: ${rootSel}`, probes: [] };
        const out = [];
        const seen = new Set();
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
        let n;
        while ((n = walker.nextNode())) {
            const txt = n.nodeValue.replace(/\s+/g, ' ').trim();
            if (!txt) continue;
            const el = n.parentElement;
            if (!el || seen.has(el)) continue;
            seen.add(el);
            const r = el.getBoundingClientRect();
            if (r.width === 0 && r.height === 0) {
                let p = el; let hidden = false;
                while (p && p !== document.body) {
                    const cs = getComputedStyle(p);
                    if (cs.display === 'none' || cs.visibility === 'hidden') { hidden = true; break; }
                    p = p.parentElement;
                }
                if (hidden) continue;
            }
            const cs = getComputedStyle(el);

            // Collect translucent bg layers up the tree, top→down.
            const layers = [];
            let parent = el; let bgEl = el; let foundOpaque = false;
            while (parent && parent !== document.body) {
                const c = getComputedStyle(parent).backgroundColor;
                const m = c && c.match(/rgba?\(([^)]+)\)/i);
                if (m) {
                    const parts = m[1].split(',').map((s) => parseFloat(s.trim()));
                    const a = parts.length === 4 ? parts[3] : 1;
                    if (a > 0) {
                        layers.push({ r: parts[0], g: parts[1], b: parts[2], a });
                        if (bgEl === el) bgEl = parent;
                        if (a >= 0.999) { foundOpaque = true; break; }
                    }
                }
                parent = parent.parentElement;
            }
            if (!foundOpaque) {
                const bc = getComputedStyle(document.body).backgroundColor;
                const m = bc && bc.match(/rgba?\(([^)]+)\)/i);
                if (m) {
                    const parts = m[1].split(',').map((s) => parseFloat(s.trim()));
                    layers.push({ r: parts[0], g: parts[1], b: parts[2], a: 1 });
                } else {
                    layers.push({ r: 255, g: 255, b: 255, a: 1 });
                }
            }
            let R = layers[layers.length - 1].r;
            let G = layers[layers.length - 1].g;
            let B = layers[layers.length - 1].b;
            for (let i = layers.length - 2; i >= 0; i--) {
                const l = layers[i];
                R = l.a * l.r + (1 - l.a) * R;
                G = l.a * l.g + (1 - l.a) * G;
                B = l.a * l.b + (1 - l.a) * B;
            }
            const bgColor = `rgb(${Math.round(R)}, ${Math.round(G)}, ${Math.round(B)})`;

            // Clip-path overflow
            let clipped = false; let clipNote = '';
            let p2 = el;
            while (p2 && p2 !== document.body) {
                const cs2 = getComputedStyle(p2);
                const cp = cs2.clipPath || cs2.webkitClipPath;
                if (cp && cp !== 'none') {
                    const pr = p2.getBoundingClientRect();
                    if (r.right > pr.right + 1 || r.left < pr.left - 1 ||
                        r.bottom > pr.bottom + 1 || r.top < pr.top - 1) {
                        clipped = true;
                        clipNote = `clip-path on ${p2.tagName.toLowerCase()}.${(p2.className || '').toString().split(' ')[0]}`;
                    }
                }
                p2 = p2.parentElement;
            }
            out.push({
                path: cssPath(el),
                text: txt.slice(0, 80),
                x: Math.round(r.x), y: Math.round(r.y),
                w: Math.round(r.width), h: Math.round(r.height),
                fontSize: cs.fontSize,
                fontWeight: cs.fontWeight,
                lineHeight: cs.lineHeight,
                letterSpacing: cs.letterSpacing,
                textTransform: cs.textTransform,
                color: cs.color,
                opacity: parseFloat(cs.opacity),
                visibility: cs.visibility,
                display: cs.display,
                whiteSpace: cs.whiteSpace,
                bgColor,
                bgEl: bgEl.tagName.toLowerCase() + (bgEl.className ? '.' + bgEl.className.toString().split(' ')[0] : ''),
                clipped, clipNote,
            });
        }
        function cssPath(el) {
            const parts = [];
            let cur = el;
            while (cur && cur.nodeType === 1 && parts.length < 4) {
                let seg = cur.tagName.toLowerCase();
                if (cur.className) seg += '.' + cur.className.toString().trim().split(/\s+/).slice(0, 2).join('.');
                parts.unshift(seg);
                cur = cur.parentElement;
            }
            return parts.join(' > ');
        }
        return { error: null, probes: out };
    }, { rootSel });
}

function parseColor(rgb) {
    const m = rgb && rgb.match(/rgba?\(([^)]+)\)/i);
    if (!m) return null;
    const parts = m[1].split(',').map((s) => parseFloat(s.trim()));
    const [r, g, b] = parts;
    const a = parts.length === 4 ? parts[3] : 1;
    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return { r, g, b, a, lum };
}

function contrast(fg, bg) {
    if (!fg || !bg) return null;
    const a = fg.a;
    const cr = a * fg.r + (1 - a) * bg.r;
    const cg = a * fg.g + (1 - a) * bg.g;
    const cb = a * fg.b + (1 - a) * bg.b;
    const cLum = (0.2126 * cr + 0.7152 * cg + 0.0722 * cb) / 255;
    const L1 = Math.max(cLum, bg.lum);
    const L2 = Math.min(cLum, bg.lum);
    return (L1 + 0.05) / (L2 + 0.05);
}

export function scoreProbes(probes) {
    const issues = [];
    for (const p of probes) {
        const fg = parseColor(p.color);
        const bg = parseColor(p.bgColor);
        p.contrast = contrast(fg, bg);
        if (p.display === 'none' || p.visibility === 'hidden' || p.opacity === 0) continue;
        if (p.w === 0 || p.h === 0) { issues.push({ ...p, why: 'zero-size box' }); continue; }
        if (p.clipped) issues.push({ ...p, why: `clipped (${p.clipNote})` });
        const fontPx = parseFloat(p.fontSize);
        const weight = parseInt(p.fontWeight, 10);
        if (fontPx < 10 && weight >= 600 && p.textTransform === 'uppercase') {
            issues.push({ ...p, why: `tiny bold uppercase (${p.fontSize} / weight ${p.fontWeight}) — Safari smear risk` });
        }
        if (fontPx < 11 && p.opacity < 0.7 && p.opacity > 0) {
            issues.push({ ...p, why: `tiny + low opacity (${p.fontSize} @ ${p.opacity})` });
        }
        const isLarge = fontPx >= 24 || (fontPx >= 18.66 && weight >= 700);
        const minContrast = isLarge ? 3.0 : 4.5;
        if (p.contrast != null && p.contrast < minContrast) {
            issues.push({ ...p, why: `low contrast ${p.contrast.toFixed(2)} (need ${minContrast})` });
        }
    }
    return issues;
}

export function printReport(label, viewport, root, probes, issues) {
    console.log(`\n=== ${label} (${viewport.width}×${viewport.height})  ::  ${root}  ===`);
    console.log(`  probed ${probes.length} text leaves, flagged ${issues.length}`);
    const seen = new Set();
    for (const i of issues) {
        const key = `${label}|${root}|${i.path}|${i.why}`;
        if (seen.has(key)) continue;
        seen.add(key);
        console.log(`  ⚠ ${i.path}`);
        console.log(`     "${i.text}"`);
        console.log(`     ${i.why}`);
        console.log(`     box=${i.w}×${i.h} @${i.x},${i.y}  font=${i.fontSize} wt=${i.fontWeight} ls=${i.letterSpacing} tt=${i.textTransform}`);
        console.log(`     fg=${i.color}  bg=${i.bgColor} (${i.bgEl})  contrast=${i.contrast ? i.contrast.toFixed(2) : 'n/a'}`);
    }
}
