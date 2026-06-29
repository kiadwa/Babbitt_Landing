/* global gtag */
/* ════════════════════════════════════════════════════════════
   BABBITT — Landing-page analytics event bindings (MKT-P015A).

   GA4 custom events for every live interactive surface on index.html.
   Mirrors script.js's defensive style: every lookup is guarded, missing
   DOM is a silent no-op. NEVER sends PII — form tracking records which
   field was touched (field_name), never the typed value.

   Loaded BEFORE script.js so the contact-form success signal (sessionStorage
   / URL hash) can be read before script.js (IIFE 9) consumes and clears it.
   Param names match the custom dimensions in the GA4 handoff (doc 04).
   ════════════════════════════════════════════════════════════ */
(function () {
    'use strict';
    if (typeof gtag !== 'function') return;

    function track(name, params) { gtag('event', name, params || {}); }

    // For elements that trigger a full-page navigation, use the Beacon
    // transport so the hit survives the unload.
    function trackNav(name, params) {
        var p = params || {};
        p.transport_type = 'beacon';
        gtag('event', name, p);
    }

    function nowMs() { return new Date().getTime(); }

    // Current pricing-builder selection, exposed read-only by script.js IIFE 14.
    function planParams() {
        var s = (window.babbittPricing && window.babbittPricing.getState)
            ? window.babbittPricing.getState() : null;
        if (!s) return {};
        return {
            account_type: s.account || 'unknown',
            tier: s.tier || 'unknown',
            billing: s.billing || 'unknown'
        };
    }

    // ── Contact-form success — signalled on the redirected return load via
    //    sessionStorage / URL hash. Read synchronously (before script.js clears it).
    try {
        if (sessionStorage.getItem('formSubmitted') === 'contact' ||
            location.hash === '#contact_submitted') {
            track('contact_form_success', { form_name: 'contact' });
        }
    } catch { /* storage blocked */ }

    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    ready(function () {
        var i;

        // ── Nav links ──
        document.querySelectorAll('#navLinks a[href^="#"]').forEach(function (a) {
            a.addEventListener('click', function () {
                track('nav_click', { nav_target: (a.getAttribute('href') || '').replace('#', '') });
            });
        });

        // ── Hero peek cards (demo card handled via its two halves below) ──
        bindPeek('.peek--lanes', 'who');
        bindPeek('.peek--why', 'why');
        bindPeek('.peek--founders', 'founders');

        var heroDemo = document.querySelector('.peek-half--babbitt');
        if (heroDemo) {
            heroDemo.addEventListener('click', function () {
                trackNav('demo_cta_click', { location: 'hero_peek' });
            });
        }
        var heroCc = document.querySelector('.peek-half--cc');
        if (heroCc) {
            heroCc.addEventListener('click', function () {
                track('codechecker_cta_click', { location: 'hero_peek' });
            });
        }

        // ── Floorplan room buttons ──
        document.querySelectorAll('#floorplan .room[data-tool]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                track('room_opened', { room: btn.getAttribute('data-tool') });
            });
        });

        // ── Room modal CTAs ──
        document.querySelectorAll('a.ticket-cta-primary[data-room-cta]').forEach(function (a) {
            a.addEventListener('click', function () {
                track('room_primary_cta_click', { room: a.getAttribute('data-room-cta') });
            });
        });
        document.querySelectorAll('a.ticket-cta-ghost').forEach(function (a) {
            a.addEventListener('click', function () {
                var panel = a.closest('[data-room]');
                trackNav('room_demo_cta_click', { room: panel ? panel.getAttribute('data-room') : 'unknown' });
            });
        });

        // ── Demo role chips ──
        document.querySelectorAll('a.demo-role-chip[data-flow]').forEach(function (a) {
            a.addEventListener('click', function () {
                var flow = a.getAttribute('data-flow');
                trackNav('demo_role_select', { role: flow });
                trackNav('demo_start', { demo_type: flow });
            });
        });

        // ── CodeChecker section CTA ──
        var ccCta = document.querySelector('a.codechecker-cta');
        if (ccCta) {
            ccCta.addEventListener('click', function () {
                track('codechecker_cta_click', { location: 'codechecker_section' });
            });
        }

        // ── Pricing builder ──
        document.querySelectorAll('.pb-billing .pb-chip[data-billing]').forEach(function (c) {
            c.addEventListener('click', function () {
                track('billing_toggle', { billing: c.getAttribute('data-billing') });
            });
        });
        document.querySelectorAll('.pb-account-chip[data-account]').forEach(function (c) {
            c.addEventListener('click', function () {
                track('account_type_select', { account_type: c.getAttribute('data-account') });
            });
        });
        document.querySelectorAll('.pb-property-subchip[data-property-type]').forEach(function (c) {
            c.addEventListener('click', function () {
                track('account_type_select', { account_type: c.getAttribute('data-property-type') });
            });
        });
        document.querySelectorAll('.pb-tier[data-tier]').forEach(function (c) {
            c.addEventListener('click', function () {
                track('pricing_tier_select', { tier: c.getAttribute('data-tier') });
            });
        });

        var lockBtn = document.getElementById('btnWaitlistCta');
        if (lockBtn) {
            lockBtn.addEventListener('click', function () {
                track('early_bird_lock_cta', planParams());
            });
        }

        // ── Early-bird lock modal: form funnel ──
        var FORM_NAME = 'early_bird_lock';
        var formStarted = false;
        var modal = document.getElementById('pbLockModal');
        if (modal) {
            var mo = new MutationObserver(function () {
                if (modal.classList.contains('is-open')) {
                    formStarted = false; // reset per open
                    track('early_bird_form_view', { form_name: FORM_NAME });
                }
            });
            mo.observe(modal, { attributes: true, attributeFilter: ['class'] });
        }

        var form = document.getElementById('pbLockForm');
        if (form) {
            var FIELDS = ['firstName', 'lastName', 'email', 'businessName', 'abn', 'icp'];
            FIELDS.forEach(function (name, idx) {
                var field = form.querySelector('[name="' + name + '"]');
                if (!field) return;
                field.addEventListener('focus', function () {
                    if (!formStarted) {
                        formStarted = true;
                        track('early_bird_form_start', { form_name: FORM_NAME });
                    }
                    track('form_field_focus', { form_name: FORM_NAME, field_name: name, field_position: idx + 1 });
                });
                field.addEventListener('blur', function () {
                    if (field.value && field.value.trim().length > 0) {
                        track('form_field_complete', { form_name: FORM_NAME, field_name: name, field_position: idx + 1 });
                    }
                });
            });
        }

        // sign_up — fire only when the success panel becomes visible. The
        // observer also fires when resetForm() re-hides it, so guard on !hidden.
        var success = document.getElementById('pbLockSuccess');
        if (success) {
            var so = new MutationObserver(function () {
                if (success.hidden) return;
                var p = planParams();
                p.method = 'early_bird_form';
                track('sign_up', p);
            });
            so.observe(success, { attributes: true, attributeFilter: ['hidden'] });
        }

        // ── Contact form ──
        var contact = document.getElementById('contactForm');
        if (contact) {
            contact.addEventListener('submit', function () {
                trackNav('contact_form_submit', { form_name: 'contact' });
            });
            var terms = document.getElementById('contact-terms');
            if (terms) {
                terms.addEventListener('change', function () {
                    if (terms.checked) {
                        track('form_field_complete', { form_name: 'contact', field_name: 'terms' });
                    }
                });
            }
        }

        // ── Section visibility (once) + dwell time ──
        var SECTIONS = ['features', 'why', 'demo', 'codechecker', 'waitlist', 'founders', 'contact'];
        var dwell = {};
        SECTIONS.forEach(function (id) {
            var el = document.getElementById(id);
            if (!el) return;
            dwell[id] = { enter: 0, total: 0, seen: false };
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        if (!dwell[id].seen) {
                            dwell[id].seen = true;
                            track('section_visible', { section: id });
                        }
                        dwell[id].enter = nowMs();
                    } else if (dwell[id].enter) {
                        dwell[id].total += nowMs() - dwell[id].enter;
                        dwell[id].enter = 0;
                    }
                });
            }, { threshold: 0.2 });
            io.observe(el);
        });

        // Flush dwell totals once, when the page is hidden/unloaded.
        window.addEventListener('pagehide', function () {
            for (i = 0; i < SECTIONS.length; i++) {
                var id = SECTIONS[i];
                if (!dwell[id]) continue;
                if (dwell[id].enter) {
                    dwell[id].total += nowMs() - dwell[id].enter;
                    dwell[id].enter = 0;
                }
                var secs = Math.round(dwell[id].total / 1000);
                if (secs > 0) {
                    track('section_dwell', { section: id, dwell_seconds: secs, transport_type: 'beacon' });
                }
            }
        }, { once: true });

        function bindPeek(sel, card) {
            var el = document.querySelector(sel);
            if (!el) return;
            el.addEventListener('click', function () {
                track('hero_peek_click', { peek_card: card });
            });
        }
    });
})();
