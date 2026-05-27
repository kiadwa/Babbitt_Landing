/* ════════════════════════════════════════════════════════════
   BABBITT LANDING — Interactions
   ════════════════════════════════════════════════════════════ */

/* ── 1. Word Cycling (hero headline — five sync'd slots: eyebrow + noun/verb/obj/single) ──
   Source of truth: Departments/MARKETING_BRAND/MKT-P010 - Landing V2/1- Outbound - Sent 14-05-26/0- Hero/Block Hero.md
   20 quartets across three ICPs (Tradies 7, Property 7, Suppliers 6). */
(function () {
    var entries = [
        // Tradies (4 — rows that pass the pub test)
        { eyebrow: 'Built for trades',    noun: 'Experience', verb: 'plans',    obj: 'job',      single: 'Resourced'  },
        { eyebrow: 'Built for trades',    noun: 'Trade',      verb: 'builds',   obj: 'home',     single: 'Remembered' },
        { eyebrow: 'Built for trades',    noun: 'hands',      verb: 'renovate', obj: 'property', single: 'Rewarded'   },
        { eyebrow: 'Built for trades',    noun: 'licence',    verb: 'backs',    obj: 'build',    single: 'Recorded'   },
        // Property (3 — rows that pass the pub test)
        { eyebrow: 'Built for property',  noun: 'property',  verb: 'holds',   obj: 'story',   single: 'Remembered' },
        { eyebrow: 'Built for property',  noun: 'portfolio', verb: 'shapes',  obj: 'career',  single: 'Respected'  },
        { eyebrow: 'Built for property',  noun: 'asset',     verb: 'secures', obj: 'tenancy', single: 'Remains'    },
        // Suppliers (6)
        { eyebrow: 'Built for suppliers', noun: 'product',    verb: 'starts',   obj: 'build',          single: 'Remembered' },
        { eyebrow: 'Built for suppliers', noun: 'stocklist',  verb: 'converts', obj: 'BoQ',            single: 'Relieved'   },
        { eyebrow: 'Built for suppliers', noun: 'delivery',   verb: 'moves',    obj: 'timeline',       single: 'Required'   },
        { eyebrow: 'Built for suppliers', noun: 'reputation', verb: 'earns',    obj: 'loyal customer', single: 'Returned'   },
        { eyebrow: 'Built for suppliers', noun: 'expertise',  verb: 'guides',   obj: 'order',          single: 'Respected'  },
        { eyebrow: 'Built for suppliers', noun: 'shipment',   verb: 'delivers', obj: 'con-note',       single: 'Recorded'   }
    ];

    var tracks = [
        { el: document.getElementById('c-eyebrow'), key: 'eyebrow' },
        { el: document.getElementById('c-noun'),    key: 'noun'    },
        { el: document.getElementById('c-verb'),    key: 'verb'    },
        { el: document.getElementById('c-obj'),     key: 'obj'     },
        { el: document.getElementById('c-single'),  key: 'single'  }
    ];
    var active = tracks.filter(function (t) { return t.el; });
    if (!active.length) return;

    var i = 0;
    setInterval(function () {
        active.forEach(function (t) {
            t.el.classList.remove('anim-in');
            t.el.classList.add('anim-out');
        });
        setTimeout(function () {
            i = (i + 1) % entries.length;
            active.forEach(function (t) {
                t.el.textContent = entries[i][t.key];
                t.el.classList.remove('anim-out');
                t.el.classList.add('anim-in');
            });
            setTimeout(function () {
                active.forEach(function (t) { t.el.classList.remove('anim-in'); });
            }, 300);
        }, 300);
    }, 3500);
})();

/* ── 2. Partner — hover effect + blue sweep form ── */
(function () {
    var btnPartner    = document.getElementById('btnPartner');
    var blueSweep     = document.getElementById('blueSweep');
    var sweepPartner  = document.getElementById('sweepPartner');
    var partnerContent = sweepPartner ? sweepPartner.querySelector('.sweep-content') : null;
    if (!btnPartner) return;

    // Hover: dim + vibrate/glow
    btnPartner.addEventListener('mouseenter', function () {
        document.body.classList.add('partner-hover');
    });
    btnPartner.addEventListener('mouseleave', function () {
        document.body.classList.remove('partner-hover');
    });

    // Click: open blue sweep form
    if (!blueSweep || !sweepPartner) return;

    function openPartner() {
        document.body.classList.remove('partner-hover');
        blueSweep.classList.add('active');
        sweepPartner.classList.add('active');
    }

    function closePartner() {
        sweepPartner.classList.remove('active');
        setTimeout(function () {
            blueSweep.classList.remove('active');
        }, 300);
    }

    btnPartner.addEventListener('click', function () {
        openPartner();
    });

    if (partnerContent) {
        partnerContent.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }

    sweepPartner.addEventListener('click', function () {
        closePartner();
    });
})();

/* ── 3. Yellow Sweep — open Babbitt 60 application overlay ── */
(function () {
    var btnNavCta    = document.getElementById('btnNavCta');
    var btnWaitlist  = document.getElementById('btnWaitlistCta');
    var yellowSweep  = document.getElementById('yellowSweep');
    var sweepMsg     = document.getElementById('sweepMessage');
    var sweepContent = sweepMsg ? sweepMsg.querySelector('.sweep-content') : null;
    if (!yellowSweep || !sweepMsg) return;

    function openSweep() {
        yellowSweep.classList.add('active');
        sweepMsg.classList.add('active');
    }

    function closeSweep() {
        sweepMsg.classList.remove('active');
        setTimeout(function () {
            yellowSweep.classList.remove('active');
        }, 300);
    }

    // Nav "Secure Your Spot" — open immediately
    if (btnNavCta) {
        btnNavCta.addEventListener('click', function (e) {
            e.preventDefault();
            openSweep();
        });
    }

    // Any element marked .js-open-babbitt60 also opens the application overlay
    document.querySelectorAll('.js-open-babbitt60').forEach(function (el) {
        el.addEventListener('click', function (e) {
            e.preventDefault();
            openSweep();
        });
    });

    // Pricing "Lock the early bird offer" — opens the placeholder waitlist modal
    // (#pbLockModal). When the real waitlist form is wired in by Ky Anh, the
    // body of #pbLockModal is replaced; this handler does not need to change.
    // The Stripe checkout IIFE still runs first if `data-checkout-endpoint` is
    // set on #pricingBuilder; if it isn't, the placeholder modal opens here.
    var lockModal     = document.getElementById('pbLockModal');
    var lockModalBg   = lockModal ? lockModal.querySelector('.pb-modal-backdrop') : null;
    var lockCloseEls  = lockModal ? lockModal.querySelectorAll('[data-lock-close]') : [];

    function openLockModal() {
        if (!lockModal) return;
        lockModal.classList.add('is-open');
        lockModal.setAttribute('aria-hidden', 'false');
    }
    function closeLockModal() {
        if (!lockModal) return;
        lockModal.classList.remove('is-open');
        lockModal.setAttribute('aria-hidden', 'true');
    }
    lockCloseEls.forEach(function (el) { el.addEventListener('click', closeLockModal); });
    if (lockModalBg) lockModalBg.addEventListener('click', closeLockModal);
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lockModal && lockModal.classList.contains('is-open')) closeLockModal();
    });

    if (btnWaitlist) {
        btnWaitlist.addEventListener('click', function () {
            var pb = document.getElementById('pricingBuilder');
            var endpoint = pb && pb.getAttribute('data-checkout-endpoint');
            if (endpoint) return; // handled by Stripe checkout IIFE
            openLockModal();
        });
    }

    // Prevent clicks inside the form card from closing
    if (sweepContent) {
        sweepContent.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }

    // Close: click sweepMsg background (outside the form card)
    sweepMsg.addEventListener('click', function () {
        closeSweep();
    });
})();

/* ── 4. 3D Tilt Cards (cursor-driven perspective) ── */
document.querySelectorAll('.tilt-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform =
            'perspective(800px) rotateY(' + (x * 16) + 'deg) rotateX(' + (-y * 16) + 'deg) scale3d(1.03,1.03,1.03)';
        card.style.boxShadow =
            (-x * 25) + 'px ' + (y * 25) + 'px 35px rgba(0,0,0,0.25), ' +
            (-x * 8) + 'px ' + (y * 8) + 'px 14px rgba(0,0,0,0.12)';
    });

    card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
        card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
    });
});

/* ── 4b. Mosaic Cards — 3D tilt with zoom-OUT (cursor-driven) ── */
document.querySelectorAll('.mosaic-card').forEach(function (card) {
    // Clear .anim-hero entrance animation after it ends so inline transforms
    // are not blocked by the animation's `fill-mode: both` final keyframe.
    card.addEventListener('animationend', function () {
        card.style.animation = 'none';
        card.style.opacity = '1';
        card.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
    }, { once: true });

    card.addEventListener('mousemove', function (e) {
        var heroEl = card.closest('.hero');
        if (heroEl && heroEl.classList.contains('is-collapsing')) return;
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform =
            'perspective(900px) rotateY(' + (x * 10) + 'deg) rotateX(' + (-y * 10) + 'deg) scale3d(0.94,0.94,0.94)';
        card.style.boxShadow =
            (-x * 22) + 'px ' + (y * 22) + 'px 38px rgba(0,0,0,0.32), ' +
            (-x * 6) + 'px ' + (y * 6) + 'px 12px rgba(0,0,0,0.18)';
    });

    card.addEventListener('mouseleave', function () {
        var heroEl = card.closest('.hero');
        if (heroEl && heroEl.classList.contains('is-collapsing')) return;
        card.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
        card.style.boxShadow = '';
    });
});

/* ── 4c. Hero Scroll-Out Fold ──
   Scroll-tied. As the hero scrolls past the top of the viewport, the four
   peek cards converge toward the center card, scale down, and rotate into
   a tidy stack — like a hand of cards being gathered into a deck. The
   center card is the base of the stack and shrinks slightly with them.
   The whole stack then continues to scroll out naturally with the hero.
*/
(function () {
    var hero = document.querySelector('.hero.hero-mosaic');
    if (!hero) return;

    var partnerCta = hero.querySelector('.mosaic-partner-cta');

    // Per-card terminal state. rot/ox/oy are applied at progress = 1 to
    // give the stacked deck a hand-thrown, slightly-fanned appearance.
    // Larger rotations and offsets are intentional: at the final scale the
    // peek cards are small, so the fan needs to be visible to read as a deck.
    var cards = [
        { sel: '.peek--lanes',    rot: -14, ox: -34, oy: -12 },
        { sel: '.peek--why',      rot:  10, ox:  16, oy: -22 },
        { sel: '.peek--demo',     rot: -10, ox: -14, oy:  24 },
        { sel: '.peek--founders', rot:  16, ox:  30, oy:  10 },
        { sel: '.mosaic-center',  rot:   0, ox:   0, oy:   0 }
    ];
    cards = cards
        .map(function (c) { c.el = hero.querySelector(c.sel); return c; })
        .filter(function (c) { return c.el; });

    // All cards converge to this scale at progress = 1. The peek cards
    // shrink less than the centre card, which leaves the centre as the
    // visible "base" of the stack and creates a sense of depth.
    var FINAL_SCALE = 0.42;
    // Animation completes when the hero top has scrolled this fraction of a
    // viewport above the viewport top. Kept short enough that the formed
    // stack lingers in the viewport before the hero finishes scrolling out.
    var FOLD_WINDOW_VH = 0.45;

    function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

    // Per-card dx/dy (px) needed to translate its centre to the hero centre.
    // Recomputed on layout/resize.
    function capture() {
        var heroR = hero.getBoundingClientRect();
        var hcx = heroR.width / 2;
        var hcy = heroR.height / 2;
        cards.forEach(function (c) {
            // Strip the inline transform so we read the natural layout box,
            // not the in-progress folded box.
            var prev = c.el.style.transform;
            c.el.style.transform = '';
            var r = c.el.getBoundingClientRect();
            c.el.style.transform = prev;
            var cx = (r.left - heroR.left) + r.width / 2;
            var cy = (r.top - heroR.top) + r.height / 2;
            c.dx = hcx - cx;
            c.dy = hcy - cy;
        });
    }

    var reduceMotionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    var desktopMq = window.matchMedia('(min-width: 769px)');
    function shouldRun() { return desktopMq.matches && !reduceMotionMq.matches; }

    function resetAll() {
        hero.classList.remove('is-collapsing');
        // Only clear what this IIFE itself sets. Card opacity is owned by the
        // entrance animation (.anim-hero sets opacity: 0 in CSS, the keyframe
        // animates to 1, and IIFE 4b's animationend handler pins inline
        // opacity: 1). Clearing it here re-exposes the CSS opacity: 0 and the
        // cards vanish — which is exactly the bug we're avoiding.
        cards.forEach(function (c) {
            c.el.style.transform = '';
        });
        if (partnerCta) {
            partnerCta.style.transform = '';
            partnerCta.style.opacity = '';
        }
    }

    var pending = false;
    function update() {
        pending = false;
        if (!shouldRun()) { resetAll(); return; }

        var foldDist = window.innerHeight * FOLD_WINDOW_VH;
        var heroTop  = hero.getBoundingClientRect().top;
        var raw      = clamp01(-heroTop / foldDist);
        var t        = easeOut(raw);

        if (raw > 0) {
            hero.classList.add('is-collapsing');
            // Cancel any leftover entrance animation so inline transforms are
            // not overridden by the animation's filled final keyframe. We
            // also inline opacity:1 here because cancelling the animation
            // suppresses the animationend event that IIFE 4b normally uses
            // to pin opacity. Without this, CSS `.anim-hero { opacity: 0 }`
            // re-applies and the cards go invisible mid-fold.
            cards.forEach(function (c) {
                if (c.el.style.animation !== 'none') {
                    c.el.style.animation = 'none';
                    c.el.style.opacity = '1';
                }
            });
            if (partnerCta && partnerCta.style.animation !== 'none') {
                partnerCta.style.animation = 'none';
                partnerCta.style.opacity = '1';
            }
        } else {
            hero.classList.remove('is-collapsing');
        }

        var sc = 1 - (1 - FINAL_SCALE) * t;
        cards.forEach(function (c) {
            if (raw === 0) {
                c.el.style.transform = '';
                return;
            }
            var tx  = (c.dx + c.ox) * t;
            var ty  = (c.dy + c.oy) * t;
            var rot = c.rot * t;
            c.el.style.transform =
                'translate(' + tx + 'px, ' + ty + 'px) ' +
                'rotate(' + rot + 'deg) ' +
                'scale(' + sc + ')';
        });

        if (partnerCta) {
            // Partner CTA fades out faster than the cards so it doesn't
            // hover over the forming stack.
            var ctaT = clamp01(raw / 0.4);
            partnerCta.style.opacity = String(1 - ctaT);
            partnerCta.style.transform = 'translateY(' + (ctaT * 24) + 'px)';
        }
    }

    function onScroll() {
        if (pending) return;
        pending = true;
        requestAnimationFrame(update);
    }

    function init() {
        capture();
        update();
    }

    function onResize() {
        capture();
        onScroll();
    }

    // Capture immediately. Entrance animation is mid-flight at this moment,
    // but its keyframes only shift cards 40px on the Y axis and scale them
    // 0.96 — neither changes a card's centre, which is all capture()
    // measures. A scroll event arriving before capture() ran (e.g. from
    // browser scroll-restoration) would otherwise produce NaN transforms
    // and leave the cards at the CSS .anim-hero opacity:0 — i.e. blank.
    init();
    // Re-capture after entrance fully settles, in case any layout shift
    // happened during the animation (e.g. webfont swap reflowing content).
    if (document.readyState === 'complete') {
        setTimeout(init, 1500);
    } else {
        window.addEventListener('load', function () { setTimeout(init, 1500); });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    if (reduceMotionMq.addEventListener) reduceMotionMq.addEventListener('change', onScroll);
    if (desktopMq.addEventListener) desktopMq.addEventListener('change', onResize);
})();

/* ── 4d. Why Babbitt Scroll Carousel ── */
(function () {
    var section = document.querySelector('.why');
    var wrap    = document.querySelector('.why-stage-wrap');
    var stage   = document.querySelector('.why-stage');
    var titleEl = document.querySelector('.why-title-text');
    var indexEl = document.querySelector('.why-index');
    if (!section || !wrap || !stage || !titleEl || !indexEl) return;

    var cards  = Array.prototype.slice.call(stage.querySelectorAll('.why-card'));
    var thumbs = Array.prototype.slice.call(wrap.querySelectorAll('.why-thumb'));
    if (cards.length === 0) return;

    var NUM = cards.length;
    var LAST = NUM - 1;

    var desktopMq      = window.matchMedia('(min-width: 1025px)');
    var reduceMotionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    function shouldRun() { return desktopMq.matches && !reduceMotionMq.matches; }
    function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

    var pending = false;
    var lastIndex = -1;
    var sectionTop = 0, scrollRange = 1, stageW = 0, wrapW = 0;
    var thumbW = 0, thumbGap = 26, thumbEdgePad = 30;

    function capture() {
        var r = section.getBoundingClientRect();
        sectionTop = window.scrollY + r.top;
        scrollRange = Math.max(1, section.offsetHeight - window.innerHeight);
        stageW = stage.offsetWidth;
        wrapW  = wrap.offsetWidth;
        thumbW = thumbs.length ? thumbs[0].offsetWidth : 0;
    }

    /* Pure horizontal slide. Cards live inside .why-stage which has
       overflow:hidden + dashed border. The two cards crossing the frame at
       any moment sit side-by-side (no overlap) and are clipped at the frame
       edges. Beyond ±1 stage-widths the card is fully outside the window. */
    function getCardTransform(delta) {
        var tx;
        if (delta <= -1)      tx = -stageW;
        else if (delta >= 1)  tx =  stageW;
        else                  tx =  delta * stageW;
        return tx;
    }

    /* Thumb sits centered on the wrap (top:50%; left:50%). When |delta| < 1
       the thumb is hidden (its card is currently in the frame). When delta
       <= -1 the thumb takes a slot on the left rail; when delta >= 1 it
       takes a slot on the right rail. Slot 1 sits just outside the frame. */
    function getThumbState(delta) {
        var absD = Math.abs(delta);
        if (absD < 1) return { tx: 0, op: 0 };
        var slot = absD - 1;                          // 0..LAST-1
        var sign = delta < 0 ? -1 : 1;
        var offset = (stageW / 2) + thumbEdgePad + (thumbW / 2)
                   + slot * (thumbW + thumbGap);
        var tx = sign * offset - (thumbW / 2);        // left:50% offset by half thumb
        var op = Math.max(0, 1 - slot * 0.35);
        // Past cards (left rail) fade a touch more than upcoming
        if (sign < 0) op *= 0.85;
        return { tx: tx, op: op };
    }

    function update() {
        pending = false;
        if (!shouldRun()) { resetAll(); return; }

        var raw = clamp01((window.scrollY - sectionTop) / scrollRange);
        var activeFloat = raw * LAST;

        for (var i = 0; i < NUM; i++) {
            var d = i - activeFloat;
            var tx = getCardTransform(d);
            cards[i].style.transform = 'translate(' + tx + 'px, 0)';
            // Cards fully outside the frame (|delta| >= 1) are hidden so the
            // thumbnail rail rather than a stack of full cards is what the
            // user sees outside the dashed window.
            cards[i].style.opacity = (Math.abs(d) >= 1) ? '0' : '1';
            cards[i].style.zIndex = String(100 - Math.abs(Math.round(d)));
        }

        for (var j = 0; j < thumbs.length; j++) {
            var dd = j - activeFloat;
            var s = getThumbState(dd);
            thumbs[j].style.transform = 'translate(' + s.tx + 'px, -50%)';
            thumbs[j].style.opacity = String(s.op);
        }

        var idx = Math.round(activeFloat);
        if (idx < 0) idx = 0; else if (idx > LAST) idx = LAST;
        if (idx !== lastIndex) {
            lastIndex = idx;
            var label = cards[idx].dataset.whyLabel || ('Subsection ' + (idx + 1));
            titleEl.textContent = label;
            indexEl.textContent = (idx + 1 < 10 ? '0' : '') + (idx + 1);
        }
    }

    function resetAll() {
        for (var i = 0; i < cards.length; i++) {
            cards[i].style.transform = '';
            cards[i].style.opacity = '';
            cards[i].style.zIndex = '';
        }
        for (var j = 0; j < thumbs.length; j++) {
            thumbs[j].style.transform = '';
            thumbs[j].style.opacity = '';
        }
        wrap.classList.remove('is-animating');
        lastIndex = -1;
    }

    function onScroll() {
        if (pending) return;
        pending = true;
        requestAnimationFrame(update);
    }
    function onResize() { capture(); onScroll(); }

    function init() {
        if (!shouldRun()) { resetAll(); return; }
        capture();
        wrap.classList.add('is-animating');
        update();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
        window.addEventListener('load', function () { setTimeout(init, 1500); });
    } else {
        init();
        setTimeout(init, 1500);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    if (reduceMotionMq.addEventListener) reduceMotionMq.addEventListener('change', onResize);
    if (desktopMq.addEventListener) desktopMq.addEventListener('change', onResize);
})();

/* ── 5. Hero Cursor Glare ── */
(function () {
    var hero = document.querySelector('.hero');
    var glare = document.getElementById('glareLayer');
    if (!hero || !glare) return;

    hero.addEventListener('mousemove', function (e) {
        var rect = hero.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        glare.style.opacity = '1';
        glare.style.background =
            'radial-gradient(600px circle at ' + x + 'px ' + y + 'px, rgba(255,255,255,0.05) 0%, transparent 50%)';
    });

    hero.addEventListener('mouseleave', function () {
        glare.style.opacity = '0';
    });
})();

/* ── 6. Scroll Reveal (IntersectionObserver) ── */
(function () {
    var observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');

                    // After animation ends, clear it so JS tilt transform can take over
                    if (entry.target.classList.contains('tilt-card')) {
                        entry.target.addEventListener('animationend', function () {
                            var card = this;
                            card.style.transition = 'none';
                            card.style.animation = 'none';
                            card.style.opacity = '1';
                            card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
                            requestAnimationFrame(function () {
                                card.style.transition = '';
                            });
                        }, { once: true });
                    }
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.anim-up').forEach(function (el) {
        observer.observe(el);
    });
})();

/* ── 7. Smooth Scroll for Anchor Links ── */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ── 8. Navbar Scroll Effect — yellow nav: shadow on scroll ── */
(function () {
    var navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 18px rgba(0,0,0,0.18)';
        } else {
            navbar.style.boxShadow = '';
        }
    });
})();

/* ── 8b. Scroll-to-top FAB — fades in once user scrolls past the hero ── */
(function () {
    var btn = document.getElementById('btnScrollTop');
    if (!btn) return;

    var hero = document.getElementById('hero');
    var ticking = false;

    function threshold() {
        // Reveal once scrolled roughly one viewport down, or past the hero.
        var heroBottom = hero ? hero.offsetTop + hero.offsetHeight : window.innerHeight;
        return Math.max(window.innerHeight * 0.6, heroBottom - window.innerHeight * 0.5);
    }

    function update() {
        ticking = false;
        if (window.scrollY > threshold()) {
            btn.classList.add('is-visible');
        } else {
            btn.classList.remove('is-visible');
        }
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: true });

    btn.addEventListener('click', function () {
        var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (hero && hero.scrollIntoView) {
            hero.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
        } else {
            window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
        }
    });

    update();
})();

/* ── 9. Form Submission (FormSubmit.co with built-in captcha) ── */
(function () {
    var successEl = document.getElementById('waitlistSuccess');

    // Babbitt 60 application form (lives inside the yellow sweep)
    var b60Form = document.getElementById('babbitt60Form');
    var b60Msg  = document.getElementById('babbitt60FormMessage');
    var b60Btn  = document.getElementById('babbitt60SubmitBtn');
    if (b60Form) {
        b60Form.addEventListener('submit', function () {
            if (b60Btn) {
                b60Btn.disabled = true;
                b60Btn.textContent = 'Submitting...';
            }
            if (b60Msg) {
                b60Msg.textContent = 'Submitting your application...';
                b60Msg.className = 'form-message';
            }
            sessionStorage.setItem('formSubmitted', 'babbitt60');
        });
    }

    // Detect return from successful FormSubmit redirect
    var submitted = sessionStorage.getItem('formSubmitted');
    if (submitted) {
        if (submitted === 'babbitt60') {
            var yellowSweep = document.getElementById('yellowSweep');
            var sweepMsg    = document.getElementById('sweepMessage');
            if (b60Form && b60Msg) {
                b60Form.style.display = 'none';
                b60Msg.textContent = "Thank you for applying to The Babbitt 60. We review every application and will be in touch soon.";
                b60Msg.className = 'form-message success';
            }
            if (yellowSweep) yellowSweep.classList.add('active');
            if (sweepMsg)    sweepMsg.classList.add('active');
            if (successEl) {
                successEl.textContent = "Thank you for applying to The Babbitt 60. We review every application and will be in touch soon.";
                successEl.className = 'form-message success';
            }
        } else if (successEl) {
            successEl.textContent = submitted === 'partner'
                ? "Thank you for your partnership enquiry. We'll be in touch soon."
                : "Thank you for joining the waitlist. We'll be in touch soon.";
            successEl.className = 'form-message success';
            successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        sessionStorage.removeItem('formSubmitted');
    }

    // Partner form submission
    var partnerForm = document.getElementById('partnerForm');
    var partnerMsg = document.getElementById('partnerFormMessage');
    var partnerBtn = document.getElementById('partnerSubmitBtn');
    if (partnerForm) {
        partnerForm.addEventListener('submit', function () {
            partnerBtn.disabled = true;
            partnerBtn.textContent = 'Sending...';
            if (partnerMsg) {
                partnerMsg.textContent = 'Submitting your enquiry...';
                partnerMsg.className = 'form-message';
            }
            sessionStorage.setItem('formSubmitted', 'partner');
        });
    }
})();

/* ── 10. Hamburger Menu Toggle ── */
(function () {
    var hamburger = document.getElementById('navHamburger');
    var navLinks = document.getElementById('navLinks');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('is-open');
        navLinks.classList.toggle('is-open');
    });

    // Close menu when a nav link is clicked
    navLinks.querySelectorAll('a, button').forEach(function (link) {
        link.addEventListener('click', function () {
            hamburger.classList.remove('is-open');
            navLinks.classList.remove('is-open');
        });
    });
})();

/* ── 13. Floorplan sheet — reveal graph-paper grid on scroll-into-view ── */
(function () {
    var sheet = document.querySelector('.floorplan-sheet');
    if (!sheet) return;

    // If the sheet is already on screen at first paint (e.g. page refresh
    // while focused on the section), reveal the grid synchronously and
    // suppress the 1.6s sweep — otherwise the user sees a gridless flash
    // before the IntersectionObserver callback fires on the next tick.
    var rect = sheet.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < vh && rect.bottom > 0) {
        sheet.classList.add('is-revealed', 'is-revealed-instant');
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                sheet.classList.remove('is-revealed-instant');
            });
        });
        return;
    }

    if (!('IntersectionObserver' in window)) {
        sheet.classList.add('is-revealed');
        return;
    }

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                sheet.classList.add('is-revealed');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    io.observe(sheet);
})();

/* ── 14. Floorplan Roll — scroll-tied unroll/re-roll ──
   The blueprint sheet behaves like a roll of paper:
   - Approaching the section: it unrolls LEFT → RIGHT.
   - Section centred: held flat (fully unrolled).
   - Scrolling past (either direction): it re-rolls RIGHT → LEFT.
   Progress is keyed off the sheet's own rect (not the surrounding section)
   so the animation has a full off-screen start state at scrollY=0 and a
   full off-screen end state past the section — meaning the re-roll is
   visible whether you scroll down past the section OR back up to the top
   of the page. A vertical cylindrical roller follows the leading edge
   during the transition. */
(function () {
    var stage = document.querySelector('.floorplan-stage');
    var sheet = document.querySelector('.floorplan-sheet');
    if (!stage || !sheet) return;

    var reduceMotionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    function shouldRun() { return !reduceMotionMq.matches; }

    var roller = document.createElement('div');
    roller.className = 'floorplan-roller';
    roller.setAttribute('aria-hidden', 'true');
    stage.appendChild(roller);

    function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
    function easeInOut(t) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    var pending = false;

    function capture() {
        var w = sheet.offsetWidth || 600;
        stage.style.setProperty('--sheet-w', w + 'px');
        // Match the roller's box to the sheet's box within the stage so it
        // tracks the exact edges of the paper regardless of breakpoint padding.
        roller.style.top    = sheet.offsetTop + 'px';
        roller.style.left   = sheet.offsetLeft + 'px';
        roller.style.height = sheet.offsetHeight + 'px';
    }

    function update() {
        pending = false;
        if (!shouldRun()) {
            sheet.style.setProperty('--roll', '1');
            stage.style.setProperty('--roll', '1');
            stage.style.setProperty('--roller-op', '0');
            return;
        }

        var r = sheet.getBoundingClientRect();
        var vh = window.innerHeight;
        // Distance, in pixels of scroll, over which each half of the
        // animation plays. Sized so the unroll plays *inside* the viewport
        // (not below it) — the user actually sees the spool walk across
        // the stage paying out paper.
        var win = Math.max(vh * 0.6, 360);

        // Unroll: rises 0→1 as the sheet's TOP rises from the viewport
        // bottom up into the upper half of the viewport. rise=0 while
        // sheet is still below the fold; rise=1 once its top has moved
        // ~win px above the viewport bottom.
        var rise = clamp01((vh - r.top) / win);
        // Re-roll: falls 1→0 as the sheet's BOTTOM rises up through the
        // viewport's upper region toward the top edge. fall=1 while the
        // bottom is still well in view; fall=0 once the bottom exits the
        // top of the viewport.
        var fall = clamp01(r.bottom / win);
        var raw = Math.min(rise, fall);
        var t = easeInOut(raw);

        sheet.style.setProperty('--roll', t.toFixed(4));
        // --roll also needs to reach the roller (a stage child) for its
        // horizontal translate, so mirror it onto the stage.
        stage.style.setProperty('--roll', t.toFixed(4));
        // The clip-path on the sheet starts cutting the right edge the
        // moment t drops below 1, so the spool's opacity needs to ramp up
        // immediately at that point — otherwise there's a window where the
        // edge retreats with no visible spool carrying it. A short linear
        // fade across the final ~4% of the curve reaches full opacity by
        // t ≈ 0.96 and is fully hidden only at t = 1 (paper laid flat).
        var op = Math.max(0, Math.min(1, (1 - t) * 25));
        stage.style.setProperty('--roller-op', op.toFixed(3));
    }

    function onScroll() {
        if (pending) return;
        pending = true;
        requestAnimationFrame(update);
    }

    function init() {
        capture();
        update();
    }

    init();
    if (document.readyState === 'complete') {
        setTimeout(init, 500);
    } else {
        window.addEventListener('load', function () { setTimeout(init, 500); });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { capture(); onScroll(); });
    if (reduceMotionMq.addEventListener) reduceMotionMq.addEventListener('change', onScroll);
})();

/* ── 12. Mosaic cards — rotating photo backgrounds (crossfade) ── */
(function () {
    var base = 'stock-photo/';

    function urlFor(src) {
        return 'url("' + encodeURI(src) + '")';
    }

    function setupRotator(el, images, intervalMs) {
        if (!el || !images.length) return;
        images.forEach(function (src) { var i = new Image(); i.src = src; });

        var idx = 0;
        var showingA = true;
        el.style.setProperty('--hero-bg-a', urlFor(images[idx]));
        el.classList.add('is-bg-a');

        setInterval(function () {
            idx = (idx + 1) % images.length;
            if (showingA) {
                el.style.setProperty('--hero-bg-b', urlFor(images[idx]));
                el.classList.remove('is-bg-a');
                el.classList.add('is-bg-b');
            } else {
                el.style.setProperty('--hero-bg-a', urlFor(images[idx]));
                el.classList.remove('is-bg-b');
                el.classList.add('is-bg-a');
            }
            showingA = !showingA;
        }, intervalMs);
    }

    setupRotator(document.querySelector('.mosaic-center'), [
        base + 'WhatsApp Image 2026-05-14 at 18.30.27.jpeg',
        base + 'WhatsApp Image 2026-05-14 at 18.30.27 (1).jpeg',
        base + 'WhatsApp Image 2026-05-14 at 18.30.27 (2).jpeg',
        base + 'WhatsApp Image 2026-05-14 at 18.30.28.jpeg',
        base + 'WhatsApp Image 2026-05-14 at 18.30.28 (1).jpeg',
        base + 'WhatsApp Image 2026-05-14 at 18.30.28 (2).jpeg'
    ], 5000);

    setupRotator(document.querySelector('.peek--founders'), [
        base + 'Thefounder_1.png',
        base + 'Thefounder_2.png',
        base + 'Thefounder_3.png',
        base + 'Thefounder_4.png'
    ], 5000);

    setupRotator(document.querySelector('.peek--lanes'), [
        base + 'for_every_role_onit_1.jpg',
        base + 'for_every_role_onit_2.jpg',
        base + 'for_every_role_onit_3.jpg'
    ], 5000);
})();

/* ── 13. Room modals — open per floor-plan lane ── */
(function () {
    var modal = document.getElementById('roomModal');
    if (!modal) return;

    var backdrop  = modal.querySelector('.room-modal-backdrop');
    var closeBtns = modal.querySelectorAll('.room-modal-close');
    var rooms     = document.querySelectorAll('#floorplan .room');
    var panels    = modal.querySelectorAll('.room-modal-inner[data-room]');
    var lastFocus = null;

    function showPanelFor(tool) {
        var matched = false;
        panels.forEach(function (panel) {
            var on = panel.getAttribute('data-room') === tool;
            panel.hidden = !on;
            if (on) matched = true;
        });
        return matched;
    }

    function openFor(tool) {
        if (!showPanelFor(tool)) return;
        lastFocus = document.activeElement;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        var activePanel = modal.querySelector('.room-modal-inner[data-room="' + tool + '"]');
        var btn = activePanel ? activePanel.querySelector('.room-modal-close') : null;
        if (btn) setTimeout(function () { btn.focus(); }, 40);
    }

    function close() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    rooms.forEach(function (room) {
        room.addEventListener('click', function (e) {
            var tool = room.getAttribute('data-tool');
            if (!tool) return;
            // Only intercept when we have a matching modal panel.
            var has = Array.prototype.some.call(panels, function (p) {
                return p.getAttribute('data-room') === tool;
            });
            if (!has) return;
            e.preventDefault();
            openFor(tool);
        });
    });

    closeBtns.forEach(function (btn) { btn.addEventListener('click', close); });
    if (backdrop) backdrop.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });
})();

/* ── 14. Pricing Builder — interactive quote in #waitlist ── */
(function () {
    var builder = document.getElementById('pricingBuilder');
    if (!builder) return;

    var billingChips    = builder.querySelectorAll('.pb-billing .pb-chip');
    var accountChips    = builder.querySelectorAll('.pb-account-chip');
    var tierCards       = builder.querySelectorAll('.pb-tier');
    var tierLabel       = document.getElementById('pbTierLabel');
    var tierPriceEl     = document.getElementById('pbTierPrice');
    var subtotalEl      = document.getElementById('pbSubtotal');
    var gstEl           = document.getElementById('pbGst');
    var totalEl         = document.getElementById('pbTotal');
    var totalLabelEl    = document.getElementById('pbTotalLabel');
    var addonsContainer = document.getElementById('pbAddonsContainer');
    var discountLine    = document.getElementById('pbDiscountLine');
    var recurringNote   = document.getElementById('pbRecurringNote');
    var savingsDisplay  = document.getElementById('pbSavingsDisplay');
    var tier2Trigger    = document.getElementById('pbTier2Trigger');
    var setupModal      = document.getElementById('pbSetupModal');
    var setupClose      = document.getElementById('pbSetupClose');
    var setupConfirm    = document.getElementById('pbSetupConfirm');
    var setupBackdrop   = setupModal ? setupModal.querySelector('.pb-modal-backdrop') : null;
    var yellowSweep     = document.getElementById('yellowSweep');
    var sweepMsg        = document.getElementById('sweepMessage');

    var PRICING = {
        accountModifiers: {
            supplier: {
                setupFees: [
                    { id: 'catalogueSetup', name: 'Catalogue setup', amount: 200, explainLink: true }
                ]
            },
            propertyManager: {
                setupFees: [
                    { id: 'portfolioUpload', name: 'Portfolio bulk upload', amount: 200, explainLink: true }
                ]
            },
            strata: {
                setupFees: [
                    { id: 'lotsUpload', name: 'Lots bulk upload', amount: 200, explainLink: true }
                ]
            }
        }
    };

    var COPY = (typeof window !== 'undefined' && window.BABBITT_PRICING_COPY) || null;

    /* Per-account addon locks. If an addon is locked for the active account,
       render it as a fixed "included free" row instead of an adjustable control.
       Trades + Supplier accounts get the 2 free properties baked in; need more →
       upgrade to a Property account. */
    var ACCOUNT_ADDON_LOCKS = {
        trades:   { properties: { quantity: 2, note: 'Need more? Add a Property account.' } },
        supplier: { properties: { quantity: 2, note: 'Need more? Add a Property account.' } }
    };
    function getAddonLock(account, addonId) {
        return (ACCOUNT_ADDON_LOCKS[account] && ACCOUNT_ADDON_LOCKS[account][addonId]) || null;
    }

    // Property picker (popup) elements
    var propertyChip       = builder.querySelector('.pb-account-chip[data-account="property"]');
    var propertySublabelEl = propertyChip ? propertyChip.querySelector('[data-property-sublabel]') : null;
    var pickerModal        = document.getElementById('pbPropertyPickerModal');
    var pickerCards        = pickerModal ? pickerModal.querySelectorAll('.pb-property-card') : [];
    var pickerCloseEls     = pickerModal ? pickerModal.querySelectorAll('[data-property-picker-close]') : [];

    // Setup-modal content slots (variant-driven via BABBITT_PRICING_COPY.setupFees)
    var setupEyebrowEl = setupModal ? setupModal.querySelector('[data-setup-eyebrow]') : null;
    var setupTitleEl   = setupModal ? setupModal.querySelector('[data-setup-title]') : null;
    var setupLeadEl    = setupModal ? setupModal.querySelector('[data-setup-lead]') : null;
    var setupListEl    = setupModal ? setupModal.querySelector('[data-setup-list]') : null;
    var setupNoteEl    = setupModal ? setupModal.querySelector('[data-setup-note]') : null;

    var BABBITT_60 = {
        availableFor: 'yearly-only',
        addonsDiscount: 100, // 100% off add-ons for 12 months
        note: 'Introductory offer — yearly billing only.'
    };

    var tierAddons = {
        free: [
            { id: 'noads',     name: 'Remove ads',         monthly: 11,  yearly: 5.50 },
            { id: 'fleet',     name: 'Fleet (untracked)',  monthly: 8,   yearly: 4 }
        ],
        tier1: [
            { id: 'staff',      name: 'Staff members',       monthly: 20,   yearly: 10,   perItem: true },
            { id: 'properties', name: 'Properties',          monthly: 1.50, yearly: 0.75, perItem: true, freeQty: 2 },
            { id: 'fleet',      name: 'Fleet (untracked)',   monthly: 8,    yearly: 4 },
            { id: 'storage',    name: 'Extra storage',       monthly: 10,   yearly: 5,    perGB: true }
        ],
        tier2: []
    };

    var state = {
        billing: 'yearly',
        account: 'trades',
        tier: 'tier1',
        tierCost: 30,
        accountFee: 0,
        babbitt60: false,
        addons: {}
    };

    function getSetupFees(account) {
        var mods = PRICING.accountModifiers[account];
        return mods && mods.setupFees ? mods.setupFees : [];
    }

    function totalSetupFees(account) {
        return getSetupFees(account).reduce(function (sum, fee) { return sum + fee.amount; }, 0);
    }

    function isTier2Eligible() {
        var staff = (state.addons.staff && state.addons.staff.quantity) || 0;
        var props = (state.addons.properties && state.addons.properties.quantity) || 0;
        return staff >= 20 || props >= 50;
    }

    function updateTier2Card() {
        var card = builder.querySelector('.pb-tier[data-tier="tier2"]');
        if (!card) return;
        var eligible = isTier2Eligible();
        if (eligible) {
            card.classList.add('is-unlocked');
            card.setAttribute('aria-disabled', 'false');
            if (tier2Trigger) {
                tier2Trigger.innerHTML = '<button type="button" class="pb-tier-cta" id="pbTier2Cta">Register interest</button>';
                var ctaBtn = document.getElementById('pbTier2Cta');
                if (ctaBtn) {
                    ctaBtn.addEventListener('click', function (e) {
                        e.stopPropagation();
                        openCampaignModal();
                    });
                }
            }
        } else {
            card.classList.remove('is-unlocked');
            card.setAttribute('aria-disabled', 'true');
            if (tier2Trigger) {
                tier2Trigger.innerHTML = '<strong>Unlocks at</strong><br>20+ staff or 50+ properties';
            }
        }
    }

    function openCampaignModal() {
        if (!yellowSweep || !sweepMsg) return;
        yellowSweep.classList.add('active');
        sweepMsg.classList.add('active');
    }

    // Billing toggle
    billingChips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            var next = chip.getAttribute('data-billing');
            if (next === state.billing) return;
            if (state.babbitt60 && next === 'monthly') {
                var ok = window.confirm(
                    'Switching to monthly will remove your Babbitt 60 offer.\n\nContinue?'
                );
                if (!ok) return;
                state.babbitt60 = false;
            }
            billingChips.forEach(function (c) {
                c.classList.toggle('is-active', c === chip);
                c.setAttribute('aria-selected', c === chip ? 'true' : 'false');
            });
            state.billing = next;

            tierCards.forEach(function (card) {
                var monthly = parseFloat(card.getAttribute('data-monthly'));
                var yearly  = parseFloat(card.getAttribute('data-yearly'));
                var price = state.billing === 'yearly' ? yearly : monthly;
                var amountEl = card.querySelector('.pb-tier-amount');
                var periodEl = card.querySelector('.pb-tier-period');
                if (amountEl) amountEl.textContent = '$' + price.toFixed(0);
                if (periodEl) periodEl.textContent = state.billing === 'yearly' ? '/month, billed yearly' : '/month';
            });

            var selectedCard = builder.querySelector('.pb-tier[data-tier="' + state.tier + '"]');
            if (selectedCard) {
                var p = state.billing === 'yearly'
                    ? parseFloat(selectedCard.getAttribute('data-yearly'))
                    : parseFloat(selectedCard.getAttribute('data-monthly'));
                state.tierCost = p;
                if (tierPriceEl) tierPriceEl.textContent = '$' + p.toFixed(2);
            }
            renderAddons();
            renderTotals();
        });
    });

    // Per-ICP tier-list content swap — driven by BABBITT_PRICING_COPY.features
    function populateTierFeatures() {
        if (!COPY || !COPY.features) return;
        var accountKey = state.account;
        var bundle = COPY.features[accountKey];
        if (!bundle) return;
        tierCards.forEach(function (card) {
            var tier = card.getAttribute('data-tier');
            var list = bundle[tier];
            var ul = card.querySelector('.pb-tier-list');
            if (!ul || !list) return;
            ul.innerHTML = list.map(function (item) {
                return '<li>' + item + '</li>';
            }).join('');
        });
    }

    // Variant-driven setup modal copy — sourced from BABBITT_PRICING_COPY.setupFees
    function populateSetupModal() {
        if (!setupModal || !COPY || !COPY.setupFees) return;
        var variant = COPY.setupFees[state.account];
        if (!variant) return;
        if (setupEyebrowEl) setupEyebrowEl.textContent = variant.eyebrow || '';
        if (setupTitleEl)   setupTitleEl.innerHTML     = (variant.title || '').replace(/\$/g, '&#36;');
        if (setupLeadEl)    setupLeadEl.textContent    = variant.lead || '';
        if (setupListEl)    setupListEl.innerHTML      = (variant.bullets || [])
            .map(function (b) { return '<li>' + b + '</li>'; }).join('');
        if (setupNoteEl)    setupNoteEl.textContent    = variant.note || '';
    }

    // Property picker (popup) — modal that resolves Property → Manager / Owner / Strata
    function openPropertyPicker() {
        if (!pickerModal) return;
        pickerModal.classList.add('is-open');
        pickerModal.setAttribute('aria-hidden', 'false');
        // Mark the currently-resolved sub-type, if any
        var resolved = propertyChip ? propertyChip.getAttribute('data-account-resolved') : '';
        pickerCards.forEach(function (card) {
            var match = card.getAttribute('data-property-type') === resolved;
            card.classList.toggle('is-selected', match);
            if (match) { try { card.focus(); } catch (e) {} }
        });
    }
    function closePropertyPicker() {
        if (!pickerModal) return;
        pickerModal.classList.remove('is-open');
        pickerModal.setAttribute('aria-hidden', 'true');
    }
    function selectPropertyType(typeKey, labelText) {
        if (!propertyChip) return;
        propertyChip.setAttribute('data-account-resolved', typeKey);
        if (propertySublabelEl) propertySublabelEl.textContent = labelText || '';
        // Activate Property chip and clear others
        accountChips.forEach(function (c) {
            var active = c === propertyChip;
            c.classList.toggle('is-active', active);
            c.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        state.account = typeKey;
        state.accountFee = totalSetupFees(state.account);
        populateTierFeatures();
        renderAddons();
        renderTotals();
        closePropertyPicker();
    }

    // Picker card wiring
    pickerCards.forEach(function (card) {
        card.addEventListener('click', function () {
            var typeKey = card.getAttribute('data-property-type');
            var labelEl = card.querySelector('.pb-property-name');
            var label   = labelEl ? labelEl.textContent.trim() : '';
            selectPropertyType(typeKey, label);
        });
    });
    pickerCloseEls.forEach(function (el) {
        el.addEventListener('click', closePropertyPicker);
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && pickerModal && pickerModal.classList.contains('is-open')) closePropertyPicker();
    });

    // Account type
    accountChips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            // Property chip is a popup trigger, not a direct account setter
            if (chip === propertyChip) {
                openPropertyPicker();
                return;
            }
            accountChips.forEach(function (c) {
                c.classList.toggle('is-active', c === chip);
                c.setAttribute('aria-selected', c === chip ? 'true' : 'false');
            });
            // Clear any previously-resolved Property sub-type sublabel when switching to non-Property
            if (propertyChip && chip !== propertyChip && propertySublabelEl) {
                propertySublabelEl.textContent = '';
                propertyChip.setAttribute('data-account-resolved', '');
            }
            state.account = chip.getAttribute('data-account');
            state.accountFee = totalSetupFees(state.account);
            populateTierFeatures();
            renderAddons();
            renderTotals();
        });
    });

    // Tier selection
    tierCards.forEach(function (card) {
        card.addEventListener('click', function () {
            if (card.getAttribute('data-tier') === 'tier2') {
                if (!isTier2Eligible()) return;
            }
            tierCards.forEach(function (c) {
                c.classList.toggle('is-selected', c === card);
                c.setAttribute('aria-checked', c === card ? 'true' : 'false');
            });
            state.tier = card.getAttribute('data-tier');
            state.addons = {};
            var price = state.billing === 'yearly'
                ? parseFloat(card.getAttribute('data-yearly'))
                : parseFloat(card.getAttribute('data-monthly'));
            state.tierCost = price;
            if (tierLabel) tierLabel.textContent = card.querySelector('.pb-tier-name').textContent;
            if (tierPriceEl) tierPriceEl.textContent = '$' + price.toFixed(2);
            renderAddons();
            renderTotals();
            updateTier2Card();
        });

        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });

    // Setup fee modal wiring
    function openSetupModal() {
        if (!setupModal) return;
        populateSetupModal();
        setupModal.classList.add('is-open');
        setupModal.setAttribute('aria-hidden', 'false');
    }
    function closeSetupModal() {
        if (!setupModal) return;
        setupModal.classList.remove('is-open');
        setupModal.setAttribute('aria-hidden', 'true');
    }
    if (setupClose)    setupClose.addEventListener('click', closeSetupModal);
    if (setupBackdrop) setupBackdrop.addEventListener('click', closeSetupModal);
    if (setupConfirm)  setupConfirm.addEventListener('click', closeSetupModal);
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && setupModal && setupModal.classList.contains('is-open')) closeSetupModal();
    });

    function renderAddons() {
        if (!addonsContainer) return;
        addonsContainer.innerHTML = '';

        var setupFees = getSetupFees(state.account);
        if (setupFees.length > 0) {
            var setupLabel = document.createElement('div');
            setupLabel.className = 'pb-quote-addons-label';
            setupLabel.textContent = 'Setup & add-ons';
            addonsContainer.appendChild(setupLabel);

            setupFees.forEach(function (fee) {
                var row = document.createElement('div');
                row.className = 'pb-addon';
                row.setAttribute('data-setup-fee', fee.id);
                row.innerHTML =
                    '<div class="pb-addon-info">' +
                        '<div class="pb-addon-name">' + fee.name +
                            (fee.explainLink ? ' <button type="button" class="pb-explain">why?</button>' : '') +
                        '</div>' +
                        '<div class="pb-addon-qty">one-time</div>' +
                    '</div>' +
                    '<div class="pb-addon-price">$' + fee.amount.toFixed(2) + '</div>';
                addonsContainer.appendChild(row);

                if (fee.explainLink) {
                    var btn = row.querySelector('.pb-explain');
                    if (btn) btn.addEventListener('click', function (e) { e.stopPropagation(); openSetupModal(); });
                }
            });
        }

        var list = tierAddons[state.tier] || [];
        if (list.length === 0) return;

        var addonsLabel = document.createElement('div');
        addonsLabel.className = 'pb-quote-addons-label';
        addonsLabel.textContent = 'Add-ons';
        addonsContainer.appendChild(addonsLabel);

        list.forEach(function (addon) {
            // Locked addon for this account? Render fixed "included free" row, no controls.
            var lock = getAddonLock(state.account, addon.id);
            if (lock) {
                // Pin state to the locked quantity so totals + downstream checks (Tier 2 unlock) see it
                if (!state.addons[addon.id]) {
                    state.addons[addon.id] = {
                        name: addon.name,
                        monthly: addon.monthly,
                        yearly: addon.yearly,
                        freeQty: addon.freeQty || 0,
                        quantity: lock.quantity
                    };
                } else {
                    state.addons[addon.id].quantity = lock.quantity;
                }

                var lockedRow = document.createElement('div');
                lockedRow.className = 'pb-addon pb-addon--locked';
                lockedRow.innerHTML =
                    '<div class="pb-addon-info">' +
                        '<div class="pb-addon-name">' + addon.name + '</div>' +
                        '<div class="pb-addon-qty">' + lock.quantity + ' included free &middot; ' + lock.note + '</div>' +
                    '</div>' +
                    '<div class="pb-addon-controls">' +
                        '<span class="pb-qty-locked">' + lock.quantity + '</span>' +
                    '</div>' +
                    '<div class="pb-addon-price">$0.00</div>';
                addonsContainer.appendChild(lockedRow);
                return; // skip the adjustable render path below
            }

            var qty = (state.addons[addon.id] && state.addons[addon.id].quantity) || 0;
            var price = state.billing === 'yearly' ? addon.yearly : addon.monthly;
            var unit = addon.perGB ? 'GB' : (addon.perItem ? 'each' : '');
            var chargeable = Math.max(0, qty - (addon.freeQty || 0));
            var line = price * chargeable;

            var nameSuffix = addon.freeQty
                ? ' (' + addon.freeQty + ' free, then $' + price.toFixed(2) + '/' + unit + ')'
                : (unit ? ' ($' + price.toFixed(2) + '/' + unit + ')' : '');

            var row = document.createElement('div');
            row.className = 'pb-addon';
            row.innerHTML =
                '<div class="pb-addon-info">' +
                    '<div class="pb-addon-name">' + addon.name + nameSuffix + '</div>' +
                    '<div class="pb-addon-qty">× ' + qty + '</div>' +
                '</div>' +
                '<div class="pb-addon-controls">' +
                    '<button type="button" class="pb-qty-btn pb-qty-minus" aria-label="Decrease ' + addon.name + '">−</button>' +
                    '<input type="number" class="pb-qty-input" min="0" step="1" inputmode="numeric" value="' + qty + '" aria-label="' + addon.name + ' quantity" />' +
                    '<button type="button" class="pb-qty-btn pb-qty-plus" aria-label="Increase ' + addon.name + '">+</button>' +
                '</div>' +
                '<div class="pb-addon-price">$' + line.toFixed(2) + '</div>';
            addonsContainer.appendChild(row);

            row.querySelector('.pb-qty-minus').addEventListener('click', function () { decreaseQty(addon.id); });
            row.querySelector('.pb-qty-plus').addEventListener('click', function () { increaseQty(addon); });

            var qtyInput = row.querySelector('.pb-qty-input');
            if (qtyInput) {
                qtyInput.addEventListener('change', function () {
                    var newQty = Math.max(0, Math.floor(Number(qtyInput.value) || 0));
                    if (addon.id === 'noads' && state.tier === 'free') newQty = Math.min(1, newQty);
                    if (!state.addons[addon.id]) {
                        state.addons[addon.id] = {
                            name: addon.name,
                            monthly: addon.monthly,
                            yearly: addon.yearly,
                            freeQty: addon.freeQty || 0,
                            quantity: 0
                        };
                    }
                    state.addons[addon.id].quantity = newQty;
                    renderAddons();
                    renderTotals();
                    updateTier2Card();
                });
                qtyInput.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        qtyInput.blur();
                    }
                });
                // Select-on-focus so it's easy to overwrite the current value
                qtyInput.addEventListener('focus', function () { qtyInput.select(); });
            }
        });

        // Shake the setup fee row when supplier just selected
        if (state.accountFee > 0) {
            requestAnimationFrame(function () {
                var feeRow = addonsContainer.querySelector('[data-setup-fee]');
                if (feeRow) {
                    feeRow.classList.add('is-shake');
                    setTimeout(function () { feeRow.classList.remove('is-shake'); }, 600);
                }
            });
        }
    }

    function increaseQty(addon) {
        if (!state.addons[addon.id]) {
            state.addons[addon.id] = {
                name: addon.name,
                monthly: addon.monthly,
                yearly: addon.yearly,
                freeQty: addon.freeQty || 0,
                quantity: 0
            };
        }
        if (addon.id === 'noads' && state.tier === 'free') {
            state.addons[addon.id].quantity = 1;
        } else {
            state.addons[addon.id].quantity++;
        }
        renderAddons();
        renderTotals();
        updateTier2Card();
    }

    function decreaseQty(id) {
        if (state.addons[id] && state.addons[id].quantity > 0) {
            state.addons[id].quantity--;
            renderAddons();
            renderTotals();
            updateTier2Card();
        }
    }

    function renderTotals() {
        var addonsCostBase = Object.keys(state.addons).reduce(function (sum, key) {
            var a = state.addons[key];
            var price = state.billing === 'yearly' ? a.yearly : a.monthly;
            var chargeable = Math.max(0, a.quantity - (a.freeQty || 0));
            return sum + (price * chargeable);
        }, 0);

        var b60AddonDiscount = (state.babbitt60 && state.billing === 'yearly') ? addonsCostBase : 0;
        var addonsCost = addonsCostBase - b60AddonDiscount;

        var subtotal = state.tierCost + addonsCost;
        var gst = subtotal * 0.10;
        var monthlyTotal = subtotal + gst;
        var yearlyTotal = monthlyTotal * 12;

        if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2);
        if (gstEl)      gstEl.textContent      = '$' + gst.toFixed(2);

        // Discount line
        if (discountLine) {
            discountLine.innerHTML = '';
            if (state.babbitt60 && state.billing === 'yearly') {
                var badge = document.createElement('div');
                badge.className = 'pb-discount-badge';
                badge.innerHTML = '✦ Babbitt 60 active · add-ons free for 12 months';
                discountLine.appendChild(badge);
            }
        }

        // Total
        var recurringTotal = state.billing === 'yearly' ? yearlyTotal : monthlyTotal;
        var finalTotal = recurringTotal + state.accountFee;
        var hasSetup = state.accountFee > 0;

        if (state.billing === 'monthly' && hasSetup) {
            if (totalLabelEl) totalLabelEl.textContent = 'Total · first month';
            if (totalEl) totalEl.textContent = '$' + finalTotal.toFixed(2);
            if (recurringNote) {
                recurringNote.className = 'pb-recurring-note';
                recurringNote.innerHTML = 'Then <strong>$' + monthlyTotal.toFixed(2) + '</strong> / month';
            }
        } else {
            if (totalLabelEl) totalLabelEl.textContent = 'Total · ' + (state.billing === 'yearly' ? 'yearly' : 'monthly');
            if (totalEl) totalEl.textContent = '$' + finalTotal.toFixed(2);
            if (recurringNote) {
                recurringNote.className = '';
                recurringNote.innerHTML = '';
            }
        }

        // Savings
        var monthlyTierPrice = parseFloat(builder.querySelector('.pb-tier[data-tier="' + state.tier + '"]').getAttribute('data-monthly'));
        var yearlyTierPrice  = parseFloat(builder.querySelector('.pb-tier[data-tier="' + state.tier + '"]').getAttribute('data-yearly'));
        var tierSavings = (monthlyTierPrice - yearlyTierPrice) * 12;
        var b60Savings  = (state.babbitt60 && state.billing === 'yearly') ? addonsCostBase * 12 : 0;
        var totalSavings = tierSavings + b60Savings;

        if (savingsDisplay) {
            savingsDisplay.innerHTML = '';
            if (state.billing === 'yearly' && totalSavings > 0) {
                savingsDisplay.className = 'pb-savings';
                savingsDisplay.innerHTML = 'You save $' + totalSavings.toFixed(2) + ' / year';
            }
        }
    }

    // ── Stripe Checkout wiring ──
    // When `data-checkout-endpoint` is set on #pricingBuilder, the lock button
    // POSTs the current selection to the Cloudflare Worker, which returns a
    // Stripe Checkout Session URL. We then redirect the browser there.
    var lockBtn = document.getElementById('btnWaitlistCta');
    var errEl   = document.getElementById('pbCheckoutError');
    var endpoint = builder.getAttribute('data-checkout-endpoint');

    function showError(msg) {
        if (!errEl) return;
        errEl.style.display = 'block';
        errEl.textContent = msg;
    }
    function clearError() {
        if (!errEl) return;
        errEl.style.display = 'none';
        errEl.textContent = '';
    }

    function buildCheckoutPayload() {
        var addons = {};
        Object.keys(state.addons).forEach(function (k) {
            var a = state.addons[k];
            if (a && a.quantity > 0) addons[k] = { quantity: a.quantity };
        });
        return {
            billing:   state.billing,
            account:   state.account,
            tier:      state.tier,
            babbitt60: !!state.babbitt60,
            addons:    addons,
        };
    }

    if (lockBtn && endpoint) {
        lockBtn.addEventListener('click', async function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            // Free tier has no paid items — fall back to waitlist sweep form
            if (state.tier === 'free' && state.accountFee === 0) {
                var pb = document.getElementById('yellowSweep');
                var sm = document.getElementById('sweepMessage');
                if (pb && sm) { pb.classList.add('active'); sm.classList.add('active'); }
                return;
            }

            clearError();
            var original = lockBtn.textContent;
            lockBtn.disabled = true;
            lockBtn.textContent = 'Redirecting to checkout…';

            try {
                var res = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(buildCheckoutPayload()),
                });
                var data = await res.json().catch(function () { return {}; });
                if (!res.ok || !data.url) {
                    throw new Error(data.error || 'Checkout could not be started. Please try again.');
                }
                window.location.assign(data.url);
            } catch (err) {
                showError(err.message || 'Checkout failed. Please try again.');
                lockBtn.disabled = false;
                lockBtn.textContent = original;
            }
        }, true); // capture phase: run before the IIFE-3 fallback handler
    }

    // Initialise
    state.accountFee = totalSetupFees(state.account);
    populateTierFeatures();
    renderAddons();
    renderTotals();
    updateTier2Card();
})();

