/* global beTracker */
/* ════════════════════════════════════════════════════════════
   BABBITT — Analytics bootstrap (GA4 + consent mode v2 + Metricool)
   MKT-P015A.

   Loaded as the FIRST <script> in <head> on every page. It:
     1. defines the dataLayer + gtag stub synchronously, so any later
        script (analytics.js, demo-analytics.js) can call gtag() safely;
     2. sets consent-mode v2 defaults — denied in the EU/EEA/UK, granted
        elsewhere (Australia is the primary market);
     3. re-applies a stored choice before the first hit fires;
     4. loads GA4 (G-KH77ZM2JBK) with cookie_domain 'babbitt.app' so the
        codechecker.babbitt.app subdomain shares the same session;
     5. loads Metricool (cookieless — not gated by consent);
     6. injects a self-contained consent banner when no choice is stored.

   ES5 / IIFE to match script.js and the repo ESLint config.
   ════════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    var GA_ID = 'G-KH77ZM2JBK';
    var METRICOOL_HASH = 'a3e626dd54a287f7ea370a9d0426d315';
    var CONSENT_KEY = 'babbitt_consent';

    // EU + EEA + UK/EFTA — analytics denied by default until the visitor opts in.
    var EU_REGIONS = [
        'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
        'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
        'SI', 'ES', 'SE', 'GB', 'IS', 'LI', 'NO', 'CH'
    ];

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;

    // 1) Consent defaults. Two calls: EU/EEA/UK denied, everywhere else granted.
    gtag('consent', 'default', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
        wait_for_update: 500,
        region: EU_REGIONS
    });
    gtag('consent', 'default', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'granted',
        wait_for_update: 500
    });

    // 2) Re-apply a previously stored choice immediately (before the first hit).
    var stored = null;
    try { stored = localStorage.getItem(CONSENT_KEY); } catch { stored = null; }
    if (stored === 'granted' || stored === 'denied') {
        gtag('consent', 'update', consentState(stored));
    }

    // 3) GA4 base tag.
    gtag('js', new Date());
    gtag('config', GA_ID, { cookie_domain: 'babbitt.app' });

    var ga = document.createElement('script');
    ga.async = true;
    ga.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(ga);

    // 4) Metricool (cookieless overlay) — load unconditionally.
    (function loadMetricool(cb) {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = 'https://tracker.metricool.com/resources/be.js';
        s.onreadystatechange = cb;
        s.onload = cb;
        document.getElementsByTagName('head')[0].appendChild(s);
    })(function () {
        // be.js can fire onload yet leave beTracker undefined when an ad/tracker
        // blocker serves an empty 200 (or the script is otherwise stubbed). Guard
        // so a blocked Metricool never throws an uncaught ReferenceError.
        if (typeof beTracker !== 'undefined' && beTracker && beTracker.t) {
            beTracker.t({ hash: METRICOOL_HASH });
        }
    });

    // 5) Consent banner — only when no choice is stored yet.
    function consentState(value) {
        return {
            ad_storage: value,
            ad_user_data: value,
            ad_personalization: value,
            analytics_storage: value
        };
    }

    function setConsent(value) {
        gtag('consent', 'update', consentState(value));
        try { localStorage.setItem(CONSENT_KEY, value); } catch { /* storage blocked */ }
    }

    function injectBanner() {
        if (stored === 'granted' || stored === 'denied') return;
        if (document.getElementById('babbitt-consent')) return;

        var style = document.createElement('style');
        style.textContent = [
            '#babbitt-consent{position:fixed;left:0;right:0;bottom:0;z-index:2147483600;',
            'background:#1b1a17;color:#f0ede8;border-top:1px solid #2a2825;',
            "font-family:'Outfit',system-ui,sans-serif;font-size:14px;line-height:1.5;",
            'box-shadow:0 -6px 24px rgba(0,0,0,.35)}',
            '#babbitt-consent .bc-inner{max-width:1100px;margin:0 auto;padding:16px 20px;',
            'display:flex;flex-wrap:wrap;align-items:center;gap:12px 20px;justify-content:space-between}',
            '#babbitt-consent p{margin:0;flex:1 1 320px;color:#c9c5c0}',
            '#babbitt-consent a{color:#f6b500;text-decoration:underline}',
            '#babbitt-consent .bc-actions{display:flex;gap:10px;flex:0 0 auto}',
            '#babbitt-consent button{font:inherit;font-weight:600;cursor:pointer;border-radius:8px;',
            'padding:9px 18px;border:1px solid transparent}',
            '#babbitt-consent .bc-accept{background:#f6b500;color:#131210}',
            '#babbitt-consent .bc-decline{background:transparent;color:#f0ede8;border-color:#3a3833}',
            '@media(max-width:560px){#babbitt-consent .bc-actions{flex:1 1 100%}',
            '#babbitt-consent button{flex:1}}'
        ].join('');
        document.head.appendChild(style);

        var bar = document.createElement('div');
        bar.id = 'babbitt-consent';
        bar.setAttribute('role', 'dialog');
        bar.setAttribute('aria-label', 'Cookie consent');
        bar.innerHTML =
            '<div class="bc-inner">' +
            '<p>We use cookies and analytics (Google Analytics &amp; Metricool) to understand how ' +
            'babbitt.app is used. See our <a href="/privacy.html">Privacy Policy</a>.</p>' +
            '<div class="bc-actions">' +
            '<button type="button" class="bc-decline">Decline</button>' +
            '<button type="button" class="bc-accept">Accept</button>' +
            '</div></div>';
        document.body.appendChild(bar);

        function close() { if (bar.parentNode) bar.parentNode.removeChild(bar); }
        bar.querySelector('.bc-accept').addEventListener('click', function () { setConsent('granted'); close(); });
        bar.querySelector('.bc-decline').addEventListener('click', function () { setConsent('denied'); close(); });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectBanner);
    } else {
        injectBanner();
    }
})();
