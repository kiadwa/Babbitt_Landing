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
            '#yellowSweep',
            '#sweepMessage',
            '#babbitt60',
            '#babbitt60Form',
            '#waitlistForm',
            '#btnNavCta',
            '#btnWaitlistCta',
            '#navHamburger',
            '#navLinks',
        ];
        for (const sel of required) {
            await expect(page.locator(sel), `missing ${sel}`).toHaveCount(1);
        }
    });

    test('nav "Babbitt 60" scrolls to the explainer section', async ({ page, isMobile }) => {
        await page.goto('/index.html');
        if (isMobile) {
            // The CTA lives inside the collapsed nav menu on small screens.
            await page.locator('#navHamburger').click();
            await expect(page.locator('#navLinks')).toHaveClass(/is-open/);
        }
        const cta = page.locator('#btnNavCta').first();
        await cta.click();
        // Clicking the nav CTA scrolls the #babbitt60 section into view rather
        // than opening the yellow sweep directly — users land on the explainer
        // and apply from there via a .js-open-babbitt60 button.
        await expect(page.locator('#babbitt60')).toBeInViewport();
    });

    test('Babbitt 60 "Apply" opens the yellow sweep with the application form', async ({ page }) => {
        await page.goto('/index.html');
        await page.locator('#babbitt60').scrollIntoViewIfNeeded();
        await page.locator('.js-open-babbitt60').first().click();
        await expect(page.locator('#yellowSweep')).toHaveClass(/active/);
        await expect(page.locator('#sweepMessage')).toHaveClass(/active/);
        await expect(page.locator('#babbitt60Form')).toBeVisible();
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
