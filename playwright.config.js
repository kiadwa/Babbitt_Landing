// Playwright config for Babbitt landing-page smoke + visual tests.
// Serves the static site with `npx http-server` so anchor/asset paths work
// like they do under GitHub Pages, then drives it from the `tests/` dir.

import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;

export default defineConfig({
    testDir: './tests',
    timeout: 30_000,
    expect: { timeout: 5_000 },
    fullyParallel: true,
    reporter: [['list']],
    use: {
        baseURL: `http://127.0.0.1:${PORT}`,
        trace: 'retain-on-failure',
        viewport: { width: 1440, height: 900 },
    },
    projects: [
        { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'] } },
        { name: 'mobile', use: { ...devices['iPhone 13'] } },
    ],
    webServer: {
        command: `npx --yes http-server . -p ${PORT} -c-1 --silent`,
        url: `http://127.0.0.1:${PORT}/index.html`,
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
    },
});
