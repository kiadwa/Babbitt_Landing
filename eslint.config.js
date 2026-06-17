// ESLint flat config — vanilla browser JS for the Babbitt landing page.
// Targets the code style script.js already uses (var, ES5-ish, IIFEs).

import globals from 'globals';
import js from '@eslint/js';

export default [
    js.configs.recommended,
    {
        files: ['script.js', 'pricing-copy.js', 'demo/**/*.js', 'qrlanding/**/*.js'],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'script',
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            'no-unused-vars': ['warn', { args: 'none' }],
            'no-undef': 'error',
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'no-empty': ['error', { allowEmptyCatch: true }],
            eqeqeq: ['error', 'smart'],
            'prefer-const': 'off',
            'no-var': 'off',
        },
    },
    {
        // Node-side Playwright harnesses; the page.evaluate() callbacks inside
        // them run in the browser, so allow browser globals too.
        files: ['audit*.mjs', 'audit-lib/**/*.mjs', 'tests/**/*.mjs', 'tests/**/*.js', 'playwright.config.*'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.node,
                ...globals.browser,
            },
        },
        rules: {
            'no-unused-vars': ['warn', { args: 'none' }],
            'no-console': 'off',
        },
    },
    {
        // Cloudflare Workers — use Web/ServiceWorker runtime globals.
        files: ['worker/**/*.js', 'eo-bridge/**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.serviceworker,
                ...globals.browser,
            },
        },
        rules: {
            'no-unused-vars': ['warn', { args: 'none' }],
            'no-console': 'off',
        },
    },
    {
        ignores: ['node_modules/', 'scroll-shots/', 'test-results/', 'playwright-report/', '_about/', 'worker/node_modules/', 'eo-bridge/node_modules/'],
    },
];
