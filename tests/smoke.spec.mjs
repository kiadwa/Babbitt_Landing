// Smoke tests — verify the landing page loads, critical IDs JS depends on
// exist, and the primary CTAs open the sweep overlays.

import { test, expect } from '@playwright/test';

test.describe('landing page', () => {
    test('loads with no JS errors', async ({ page }) => {
        // We only fail on real JS errors (uncaught exceptions, syntax errors).
        // Network 404s from third-party CDNs / external embeds are flaky in
        // local runs and out of scope for a smoke test.
        const errors = [];
        page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
        page.on('console', (m) => {
            if (m.type() !== 'error') return;
            const t = m.text();
            if (/Failed to load resource/i.test(t)) return;
            errors.push('console: ' + t);
        });

        await page.goto('/index.html');
        await expect(page).toHaveTitle(/Babbitt/i);
        await page.waitForTimeout(800);
        expect(errors, errors.join('\n')).toEqual([]);
    });

    test('hero, nav, and form anchor IDs exist', async ({ page }) => {
        await page.goto('/index.html');
        const required = [
            '#hero',
            '#pricingBuilder',
            '#btnWaitlistCta',
            '#navHamburger',
            '#navLinks',
        ];
        for (const sel of required) {
            await expect(page.locator(sel), `missing ${sel}`).toHaveCount(1);
        }
    });

    test('room-modal CTA pre-selects the matching plan in the pricing builder', async ({ page }) => {
        await page.goto('/index.html');

        // Owner ticket → Property account, Owner sub-type selected.
        await page.locator('[data-room-cta="owner"]').dispatchEvent('click');
        await expect(page.locator('.pb-account-chip[data-account="property"]')).toHaveClass(/is-active/);
        await expect(
            page.locator('.pb-property-subchip[data-property-type="propertyOwner"]'),
        ).toHaveAttribute('aria-selected', 'true');

        // Supplier ticket → Supplier account selected.
        await page.locator('[data-room-cta="supplier"]').dispatchEvent('click');
        await expect(page.locator('.pb-account-chip[data-account="supplier"]')).toHaveClass(/is-active/);
    });

    test('hero word-cycling spans render', async ({ page }) => {
        await page.goto('/index.html');
        for (const id of ['#c-noun', '#c-verb', '#c-obj', '#c-single']) {
            await expect(page.locator(id), `missing cycle slot ${id}`).toHaveCount(1);
        }
    });
});

test.describe('sub-pages', () => {
    test('demo page loads', async ({ page }) => {
        const res = await page.goto('/demo/');
        expect(res?.ok()).toBeTruthy();
    });

    test('qrlanding page loads', async ({ page }) => {
        const res = await page.goto('/qrlanding/');
        expect(res?.ok()).toBeTruthy();
    });
});
