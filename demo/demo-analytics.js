/* global gtag */
/* ════════════════════════════════════════════════════════════
   BABBITT — Demo flow analytics (MKT-P015A).

   Fires GA4 events for the in-product walkthrough at /demo:
     • demo_page_view  — on load (flow from ?flow=, default property-owner-listing)
     • demo_step_view  — each time a step becomes visible
     • demo_complete   — when the final step of a flow is reached

   Steps are <div class="step [hidden]" data-flow data-step> inside
   #stepViewport; the inline demo script toggles the `hidden` CLASS to move
   between them. We observe class changes rather than patching that script.

   Bails inside the landing-page iframe (?embed=1) so embedded demos don't
   pollute the stream with duplicate views.
   ════════════════════════════════════════════════════════════ */
(function () {
    'use strict';
    if (typeof gtag !== 'function') return;

    var params = new URLSearchParams(location.search);
    if (params.get('embed') === '1') return;

    var flow = params.get('flow') || 'property-owner-listing';

    gtag('event', 'demo_page_view', { flow: flow });

    function totalSteps(f) {
        return document.querySelectorAll('#stepViewport .step[data-flow="' + f + '"]').length;
    }

    var lastKey = '';
    function reportStep(f, stepStr) {
        var step = parseInt(stepStr, 10) || 0;
        if (!f || !step) return;
        var key = f + ':' + step;
        if (key === lastKey) return; // de-dupe the same transition
        lastKey = key;
        gtag('event', 'demo_step_view', { flow: f, step_number: step });
        var total = totalSteps(f);
        if (total && step >= total) {
            gtag('event', 'demo_complete', { flow: f, total_steps: total });
        }
    }

    function reportVisible() {
        var vp = document.getElementById('stepViewport');
        if (!vp) return;
        var active = vp.querySelector('.step:not(.hidden)');
        if (active) reportStep(active.getAttribute('data-flow'), active.getAttribute('data-step'));
    }

    function start() {
        var vp = document.getElementById('stepViewport');
        if (!vp) return;
        reportVisible(); // initial step
        var obs = new MutationObserver(function (mutations) {
            for (var i = 0; i < mutations.length; i++) {
                var t = mutations[i].target;
                if (t && t.classList && t.classList.contains('step') && !t.classList.contains('hidden')) {
                    reportStep(t.getAttribute('data-flow'), t.getAttribute('data-step'));
                }
            }
        });
        obs.observe(vp, { subtree: true, attributes: true, attributeFilter: ['class'] });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
