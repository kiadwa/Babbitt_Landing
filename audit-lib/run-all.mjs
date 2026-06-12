// Run every audit-section-*.mjs runner sequentially. Exit 1 if any runner
// fails so `npm test` can gate on it.
import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const runners = readdirSync(ROOT)
    .filter((f) => f.startsWith('audit-section-') && f.endsWith('.mjs'))
    .sort();

if (runners.length === 0) {
    console.log('No audit-section-*.mjs runners found.');
    process.exit(0);
}

console.log(`Running ${runners.length} section audits sequentially.\n`);

let failed = 0;
for (const r of runners) {
    console.log(`────────── ${r} ──────────`);
    const res = spawnSync(process.execPath, [join(ROOT, r)], {
        stdio: 'inherit',
        cwd: ROOT,
    });
    if (res.status !== 0) {
        failed++;
        console.log(`✘ ${r} failed (exit ${res.status})\n`);
    } else {
        console.log(`✔ ${r}\n`);
    }
}

if (failed > 0) {
    console.log(`\n${failed} of ${runners.length} section audits failed.`);
    process.exit(1);
}
console.log(`\nAll ${runners.length} section audits passed.`);
