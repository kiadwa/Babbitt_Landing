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

/* ── 1b. Incentive Bridge — now a static mission statement.
   The cycling "Every <role> gets <value>." teaser and the hover/tap reveal
   were removed per Build Review 17-06-26; the yellow surface is shown by
   default (see styles.css ".incentive-card--static"). No JS needed. */

/* ── 1c. Founder quote cycling ──
   Each founder card rotates through its quotes with a fade + dot indicator.
   Quotes live in the HTML (one .founder-quote per card) so content is present
   without JS; this only toggles which one is active and builds the dots.
   Respects prefers-reduced-motion: shows the first quote, no dots, no motion. */
(function () {
    var wraps = document.querySelectorAll('[data-founder-quotes]');
    if (!wraps.length) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    Array.prototype.forEach.call(wraps, function (wrap, cardIdx) {
        var quotes = Array.prototype.slice.call(wrap.querySelectorAll('.founder-quote'));
        if (quotes.length < 2 || reduceMotion) return;

        var dotsWrap = wrap.parentNode.querySelector('[data-founder-dots]');
        var dots = [];
        if (dotsWrap) {
            quotes.forEach(function (_, i) {
                var dot = document.createElement('span');
                dot.className = 'founder-quote-dot' + (i === 0 ? ' is-active' : '');
                dotsWrap.appendChild(dot);
                dots.push(dot);
            });
        }

        var active = 0;
        // Stagger the two cards so they don't flip in lockstep.
        var interval = 5200 + cardIdx * 1300;
        setInterval(function () {
            quotes[active].classList.remove('is-active');
            if (dots[active]) dots[active].classList.remove('is-active');
            active = (active + 1) % quotes.length;
            quotes[active].classList.add('is-active');
            if (dots[active]) dots[active].classList.add('is-active');
        }, interval);
    });
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

/* ── 3. Pricing "Lock the early bird offer" — open the placeholder lock modal ──
   The Stripe checkout IIFE runs first if `data-checkout-endpoint` is set on
   #pricingBuilder; if it isn't, the placeholder modal #pbLockModal opens here. */
(function () {
    var btnWaitlist  = document.getElementById('btnWaitlistCta');
    var lockModal    = document.getElementById('pbLockModal');
    var lockModalBg  = lockModal ? lockModal.querySelector('.pb-modal-backdrop') : null;
    var lockCloseEls = lockModal ? lockModal.querySelectorAll('[data-lock-close]') : [];

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
        if (card.classList.contains('is-open')) return;
        var heroEl = card.closest('.hero');
        if (heroEl && heroEl.classList.contains('is-collapsing')) return;
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        // Softened tilt — rotation 10°→6°, zoom-out 0.94→0.97, shadows lighter.
        card.style.transform =
            'perspective(900px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg) scale3d(0.97,0.97,0.97)';
        card.style.boxShadow =
            (-x * 14) + 'px ' + (y * 14) + 'px 30px rgba(0,0,0,0.26), ' +
            (-x * 4) + 'px ' + (y * 4) + 'px 10px rgba(0,0,0,0.14)';
    });

    card.addEventListener('mouseleave', function () {
        if (card.classList.contains('is-open')) return;
        var heroEl = card.closest('.hero');
        if (heroEl && heroEl.classList.contains('is-collapsing')) return;
        card.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
        card.style.boxShadow = '';
    });
});

/* ── 4b3. Mosaic Center — click-to-reveal product quote ──
   Mirrors IIFE 1's incentive-card pattern: tap/click/keyboard toggles
   `.is-open`, which lets CSS expand the yellow surface via clip-path
   and fade out the default centre content. Tilt handlers above bail
   when `.is-open` so the card sits flat while the quote is shown. */
(function () {
    var card = document.getElementById('mosaicCenterCard');
    if (!card) return;

    function setOpen(open) {
        card.classList.toggle('is-open', open);
        card.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) {
            // Reset any in-flight tilt so the open state starts flat.
            card.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
            card.style.boxShadow = '';
        }
    }

    card.addEventListener('click', function () {
        setOpen(!card.classList.contains('is-open'));
    });

    card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(!card.classList.contains('is-open'));
        } else if (e.key === 'Escape' && card.classList.contains('is-open')) {
            setOpen(false);
            card.blur();
        }
    });
})();

/* ── 4b2. Demo Card — click-confirmation overlay + route ── */
(function () {
    document.querySelectorAll('.peek-half').forEach(function (half) {
        half.addEventListener('click', function (e) {
            e.preventDefault();
            var href = half.getAttribute('href');
            if (!href) return;
            // Show the confirmation overlay long enough for the user to read
            // "Jumping to demo…" / "Opening Code Checker…" before we route.
            half.classList.add('peek-half--clicked');
            var isExternal = href.indexOf('http') === 0 || half.getAttribute('target') === '_blank';
            setTimeout(function () {
                if (isExternal) {
                    window.open(href, '_blank', 'noopener');
                    // Leave the overlay visible briefly after open — feels less
                    // jarring than snapping back to the default card.
                    setTimeout(function () {
                        half.classList.remove('peek-half--clicked');
                    }, 400);
                } else if (href.charAt(0) === '#') {
                    var target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                    setTimeout(function () {
                        half.classList.remove('peek-half--clicked');
                    }, 600);
                } else {
                    window.location.href = href;
                }
            }, 520);
        });
    });
})();

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
    var descEl  = document.querySelector('.why-description');
    if (!section || !wrap || !stage || !descEl) return;

    // Per-tile descriptions shown in the header, keyed by card index. Source:
    // each card's (commented-out) body copy, condensed to one line.
    var DESCRIPTIONS = [
        'Owners, managers, trades and suppliers all work from the same job record — not scattered across inboxes, calls and portals.',
        'Every completed job becomes a permanent record on the property, still useful long after the invoice is paid.',
        'Reputation is tied to signed close-outs and verified work — trust built from proof, not paid visibility.',
        'Affordable from day one: no pay-to-bid, no charge before there is real value, no heavy onboarding to begin.',
        'Every repair, inspection, warranty and approval becomes part of the property’s service history.',
        'Variations open inside the job with scope, price and approval attached, so the invoice follows the work, not the argument.',
        'Foreman drafts SEO-ready articles from your closed jobs and catalogue updates. Add a photo, hit publish.'
    ];

    var cards  = Array.prototype.slice.call(stage.querySelectorAll('.why-card'));
    var thumbs = Array.prototype.slice.call(wrap.querySelectorAll('.why-thumb'));
    var arrowLeft  = document.getElementById('whyArrowLeft');
    var arrowRight = document.getElementById('whyArrowRight');
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
            descEl.textContent = DESCRIPTIONS[idx] || '';
        }

        // Show/hide arrows at carousel edges
        if (arrowLeft)  arrowLeft.classList.toggle('is-hidden',  idx <= 0);
        if (arrowRight) arrowRight.classList.toggle('is-hidden', idx >= LAST);
    }

    /* Scroll the page so the carousel rests on a given card index (0-based).
       The carousel maps scrollY in [sectionTop, sectionTop + scrollRange]
       to card indices [0, LAST]. We invert to find the target scrollY. */
    function scrollToCard(targetIdx) {
        if (!shouldRun()) return;
        capture(); // refresh metrics in case of resize
        var fraction = LAST > 0 ? targetIdx / LAST : 0;
        var targetY = sectionTop + fraction * scrollRange;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
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
        // Arrows are hidden in non-desktop layout via CSS; clear JS state too
        if (arrowLeft)  arrowLeft.classList.add('is-hidden');
        if (arrowRight) arrowRight.classList.add('is-hidden');
        wrap.classList.remove('is-animating');
        // In stacked (non-carousel) layout each card carries its own headline,
        // so the header just leads with the first description.
        descEl.textContent = DESCRIPTIONS[0];
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

    // Arrow click handlers — advance one tile in each direction
    if (arrowLeft) {
        arrowLeft.addEventListener('click', function () {
            var target = Math.max(0, lastIndex < 0 ? 0 : lastIndex - 1);
            scrollToCard(target);
        });
    }
    if (arrowRight) {
        arrowRight.addEventListener('click', function () {
            var target = Math.min(LAST, lastIndex < 0 ? 1 : lastIndex + 1);
            scrollToCard(target);
        });
    }

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

/* ── 8c. Hero Scroll Cue — fade as soon as the user starts scrolling ── */
(function () {
    var cue = document.getElementById('heroScrollCue');
    if (!cue) return;

    var FADE_AT = 80;
    function update() {
        if (window.scrollY > FADE_AT) cue.classList.add('is-hidden');
        else                          cue.classList.remove('is-hidden');
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
})();

/* ── 8d. Demo Role Selector — chips are anchors that route to /demo?flow=…
   No embedded iframe; navigation is the browser default on the <a> tags. ── */

/* ── 9. Form Submission (FormSubmit.co with built-in captcha) ── */
(function () {
    var successEl = document.getElementById('waitlistSuccess');

    // User waitlist form (fired from "Who Babbitt is for" room-modal CTAs)
    var waitlistForm = document.getElementById('waitlistForm');
    var waitlistMsg  = document.getElementById('formMessage');
    var waitlistBtn  = document.getElementById('submitBtn');
    // When the EO bridge is configured, route the native form through it instead
    // of FormSubmit. The worker mirrors to FormSubmit and 302s back to _next, so
    // the success-banner flow below is unchanged.
    if (window.EO_BRIDGE_ENDPOINT && waitlistForm) {
        waitlistForm.setAttribute('action', window.EO_BRIDGE_ENDPOINT);
    }
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', function () {
            if (waitlistBtn) {
                waitlistBtn.disabled = true;
                waitlistBtn.textContent = 'Submitting...';
            }
            if (waitlistMsg) {
                waitlistMsg.textContent = 'Submitting your details...';
                waitlistMsg.className = 'form-message';
            }
            sessionStorage.setItem('formSubmitted', 'user_waitlist');
        });
    }

    // Detect return from successful FormSubmit redirect — show inline banner.
    // Driven by sessionStorage (set on submit) with URL-hash as fallback,
    // so the banner still renders if sessionStorage was cleared cross-redirect
    // (e.g. mobile Safari ITP, private browsing).
    var banner      = document.getElementById('successBanner');
    var bannerText  = document.getElementById('successBannerText');
    var bannerClose = document.getElementById('successBannerClose');
    var bannerTimer = null;

    function hideBanner() {
        if (!banner) return;
        banner.classList.remove('is-visible');
        setTimeout(function () { banner.hidden = true; }, 320);
        if (bannerTimer) { clearTimeout(bannerTimer); bannerTimer = null; }
    }

    function showBanner(text) {
        if (!banner || !bannerText) return;
        bannerText.textContent = text;
        banner.hidden = false;
        // Force reflow so the transform transition runs from the offscreen state
        void banner.offsetWidth;
        banner.classList.add('is-visible');
        if (bannerTimer) clearTimeout(bannerTimer);
        bannerTimer = setTimeout(hideBanner, 8000);
    }

    if (bannerClose) bannerClose.addEventListener('click', hideBanner);

    var HASH_TO_KEY = {
        '#user_waitlist_submitted': 'user_waitlist',
        '#partner_waitlist':        'partner',
        '#partner_submitted':       'partner',
        '#contact_submitted':       'contact'
    };
    var SUCCESS_TEXT = {
        user_waitlist: "Thank you for joining the waitlist. We'll be in touch soon.",
        partner:       "Thank you for your partnership enquiry. We'll be in touch soon.",
        contact:       "Thanks for the message. We've got it and will reply soon."
    };

    var key = sessionStorage.getItem('formSubmitted') || HASH_TO_KEY[location.hash] || '';
    if (key && SUCCESS_TEXT[key]) {
        showBanner(SUCCESS_TEXT[key]);
        sessionStorage.removeItem('formSubmitted');
        if (HASH_TO_KEY[location.hash]) {
            history.replaceState(null, '', location.pathname + location.search);
        }
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

    // General inquiries (contact) form
    var contactForm = document.getElementById('contactForm');
    var contactMsg  = document.getElementById('contactFormMessage');
    var contactBtn  = document.getElementById('contactSubmitBtn');
    if (window.EO_BRIDGE_ENDPOINT && contactForm) {
        contactForm.setAttribute('action', window.EO_BRIDGE_ENDPOINT);
    }
    if (contactForm) {
        contactForm.addEventListener('submit', function () {
            if (contactBtn) {
                contactBtn.disabled = true;
                contactBtn.textContent = 'Sending...';
            }
            if (contactMsg) {
                contactMsg.textContent = 'Sending your message...';
                contactMsg.className = 'form-message';
            }
            sessionStorage.setItem('formSubmitted', 'contact');
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

/* ── 13a. Floorplan lanes — one-time "click" cursor attract hint ──
   When the plan scrolls into view, a small cursor pulses across each lane in
   turn (trades → supplier → manager → strata → owner → tenant) then clears,
   replacing the static "click any lane" note. Runs once; skipped under
   prefers-reduced-motion (the .room-cursor is display:none there). */
(function () {
    var plan = document.getElementById('floorplan');
    if (!plan) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var rooms = Array.prototype.slice.call(plan.querySelectorAll('.room'));
    if (!rooms.length) return;

    var played = false;
    function play() {
        if (played) return;
        played = true;
        rooms.forEach(function (room, i) {
            var onAt  = 500 + i * 650;   // stagger each lane in DOM order
            var offAt = onAt + 560;
            setTimeout(function () { room.classList.add('is-hinting'); }, onAt);
            setTimeout(function () { room.classList.remove('is-hinting'); }, offAt);
        });
    }

    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) { play(); io.disconnect(); }
            });
        }, { threshold: 0.4 });
        io.observe(plan);
    } else {
        play();
    }
})();

/* ── 13b. User Waitlist Sweep — fired from "Who Babbitt is for" room-modal CTAs ── */
(function () {
    var sweep      = document.getElementById('userWaitlistSweep');
    var sweepMsg   = document.getElementById('userWaitlistMessage');
    var entryInput = document.getElementById('waitlistEntryPoint');
    var userType   = document.getElementById('waitlistUserType');
    var ctaEls     = document.querySelectorAll('[data-room-cta]');
    var roomModal  = document.getElementById('roomModal');
    if (!sweep || !sweepMsg || !ctaEls.length) return;

    var sweepContent = sweepMsg.querySelector('.sweep-content');

    // Maps the CTA's role context onto the form's userType <select> option value.
    var ROLE_TO_USERTYPE = {
        trades:   'trades',
        supplier: 'supplier',
        manager:  'property_manager',
        strata:   'strata',
        owner:    'property_owner',
        tenant:   'tenant'
    };

    function closeRoomModal() {
        if (!roomModal) return;
        roomModal.classList.remove('is-open');
        roomModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function openSweep() {
        sweep.classList.add('active');
        sweepMsg.classList.add('active');
    }

    function closeSweep() {
        sweepMsg.classList.remove('active');
        setTimeout(function () { sweep.classList.remove('active'); }, 300);
    }

    ctaEls.forEach(function (el) {
        el.addEventListener('click', function (e) {
            e.preventDefault();
            var role = el.getAttribute('data-room-cta') || '';
            if (entryInput) entryInput.value = role;
            if (userType && ROLE_TO_USERTYPE[role]) userType.value = ROLE_TO_USERTYPE[role];
            closeRoomModal();
            openSweep();
        });
    });

    sweep.addEventListener('click', closeSweep);
    if (sweepContent) {
        sweepContent.addEventListener('click', function (e) { e.stopPropagation(); });
    }
    sweepMsg.addEventListener('click', closeSweep);
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && sweepMsg.classList.contains('active')) closeSweep();
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

    var PRICING = {
        accountModifiers: {
            supplier: {
                setupFees: [
                    { id: 'catalogueSetup', name: 'Catalogue setup', amount: 200, explainLink: true }
                ]
            },
            propertyManager: {
                setupFees: [
                    { id: 'portfolioUpload', name: 'Bulk upload properties under management', amount: 200, explainLink: true, optional: true }
                ]
            },
            strata: {
                setupFees: [
                    { id: 'lotsUpload', name: 'Bulk upload lots under management', amount: 200, explainLink: true, optional: true }
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

    // Property sub-type — inline chip row (replaces the old picker modal).
    // The Property account chip activates the row and defaults to Owner; clicking
    // a sub-chip resolves the account to propertyOwner / propertyManager / strata.
    var propertyChip       = builder.querySelector('.pb-account-chip[data-account="property"]');
    var propertySublabelEl = propertyChip ? propertyChip.querySelector('[data-property-sublabel]') : null;
    var propertySubchipsEl = document.getElementById('pbPropertySubchips');
    var propertySubchips   = propertySubchipsEl ? propertySubchipsEl.querySelectorAll('.pb-property-subchip') : [];
    var DEFAULT_PROPERTY_TYPE = 'propertyOwner';

    // Setup-modal content slots (variant-driven via BABBITT_PRICING_COPY.setupFees)
    var setupEyebrowEl = setupModal ? setupModal.querySelector('[data-setup-eyebrow]') : null;
    var setupTitleEl   = setupModal ? setupModal.querySelector('[data-setup-title]') : null;
    var setupLeadEl    = setupModal ? setupModal.querySelector('[data-setup-lead]') : null;
    var setupListEl    = setupModal ? setupModal.querySelector('[data-setup-list]') : null;
    var setupNoteEl    = setupModal ? setupModal.querySelector('[data-setup-note]') : null;

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
        addons: {},
        // Tracks which optional setup fees the user has ticked. Cleared when
        // the active account changes so a PM toggle doesn't carry over to Strata.
        optedInSetupFees: {}
    };

    function getSetupFees(account) {
        var mods = PRICING.accountModifiers[account];
        return mods && mods.setupFees ? mods.setupFees : [];
    }

    function totalSetupFees(account) {
        return getSetupFees(account).reduce(function (sum, fee) {
            if (fee.optional && !state.optedInSetupFees[fee.id]) return sum;
            return sum + fee.amount;
        }, 0);
    }

    function updateTier2Card() {
        var card = builder.querySelector('.pb-tier[data-tier="tier2"]');
        if (!card) return;
        card.classList.remove('is-unlocked');
        card.setAttribute('aria-disabled', 'true');
        if (tier2Trigger) {
            tier2Trigger.innerHTML = '<strong>Unlocks at v2</strong><br>20+ staff or 50+ properties';
        }
    }

    // Billing toggle
    billingChips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            var next = chip.getAttribute('data-billing');
            if (next === state.billing) return;
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

    // Show/hide the inline sub-chip row.
    function setPropertySubchipsVisible(visible) {
        if (!propertySubchipsEl) return;
        propertySubchipsEl.hidden = !visible;
        if (propertyChip) propertyChip.setAttribute('aria-expanded', visible ? 'true' : 'false');
    }

    // Apply selected property sub-type — updates state, sublabel, and chip aria-selected.
    function selectPropertyType(typeKey, labelText) {
        if (!propertyChip) return;
        propertyChip.setAttribute('data-account-resolved', typeKey);
        if (propertySublabelEl) propertySublabelEl.textContent = labelText || '';
        // Mark the matching sub-chip as selected
        propertySubchips.forEach(function (sc) {
            var match = sc.getAttribute('data-property-type') === typeKey;
            sc.setAttribute('aria-selected', match ? 'true' : 'false');
        });
        // Ensure Property is the active account chip
        accountChips.forEach(function (c) {
            var active = c === propertyChip;
            c.classList.toggle('is-active', active);
            c.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        state.account = typeKey;
        state.optedInSetupFees = {};
        state.accountFee = totalSetupFees(state.account);
        populateTierFeatures();
        renderAddons();
        renderTotals();
    }

    // Sub-chip wiring
    propertySubchips.forEach(function (sc) {
        sc.addEventListener('click', function () {
            var typeKey = sc.getAttribute('data-property-type');
            var nameEl  = sc.querySelector('.pb-property-subchip-name');
            var label   = nameEl ? nameEl.textContent.trim() : '';
            selectPropertyType(typeKey, label);
        });
    });

    // Account type
    accountChips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            if (chip === propertyChip) {
                // Reveal sub-chips and resolve to last-picked sub-type, or default to Owner.
                var resolved = propertyChip.getAttribute('data-account-resolved') || DEFAULT_PROPERTY_TYPE;
                var match    = Array.prototype.find.call(propertySubchips, function (sc) {
                    return sc.getAttribute('data-property-type') === resolved;
                });
                var label    = match && match.querySelector('.pb-property-subchip-name')
                    ? match.querySelector('.pb-property-subchip-name').textContent.trim()
                    : 'Owner';
                setPropertySubchipsVisible(true);
                selectPropertyType(resolved, label);
                return;
            }
            accountChips.forEach(function (c) {
                c.classList.toggle('is-active', c === chip);
                c.setAttribute('aria-selected', c === chip ? 'true' : 'false');
            });
            // Hide sub-chips and clear any resolved Property sub-type when switching away.
            if (propertyChip && chip !== propertyChip) {
                if (propertySublabelEl) propertySublabelEl.textContent = '';
                propertyChip.setAttribute('data-account-resolved', '');
                propertySubchips.forEach(function (sc) { sc.setAttribute('aria-selected', 'false'); });
                setPropertySubchipsVisible(false);
            }
            state.account = chip.getAttribute('data-account');
            state.optedInSetupFees = {};
            state.accountFee = totalSetupFees(state.account);
            populateTierFeatures();
            renderAddons();
            renderTotals();
        });
    });

    // Tier selection
    tierCards.forEach(function (card) {
        card.addEventListener('click', function () {
            if (card.getAttribute('data-tier') === 'tier2') return;
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
                var isOptedIn = !fee.optional || !!state.optedInSetupFees[fee.id];
                var displayPrice = isOptedIn ? fee.amount : 0;

                var row = document.createElement('div');
                row.className = 'pb-addon' + (fee.optional ? ' pb-addon--optional' : '');
                row.setAttribute('data-setup-fee', fee.id);

                var controlsHtml = fee.optional
                    ? '<div class="pb-addon-controls">' +
                        '<label class="pb-setup-toggle">' +
                          '<input type="checkbox" class="pb-setup-toggle-input" ' + (isOptedIn ? 'checked' : '') + ' aria-label="Add ' + fee.name + '" />' +
                          '<span class="pb-setup-toggle-slider" aria-hidden="true"></span>' +
                        '</label>' +
                      '</div>'
                    : '';

                row.innerHTML =
                    '<div class="pb-addon-info">' +
                        '<div class="pb-addon-name">' + fee.name +
                            (fee.explainLink ? ' <button type="button" class="pb-explain">why?</button>' : '') +
                        '</div>' +
                        '<div class="pb-addon-qty">' +
                            (fee.optional ? 'Optional &middot; one-time &middot; manual upload is default' : 'one-time') +
                        '</div>' +
                    '</div>' +
                    controlsHtml +
                    '<div class="pb-addon-price">$' + displayPrice.toFixed(2) + '</div>';
                addonsContainer.appendChild(row);

                if (fee.explainLink) {
                    var btn = row.querySelector('.pb-explain');
                    if (btn) btn.addEventListener('click', function (e) { e.stopPropagation(); openSetupModal(); });
                }

                if (fee.optional) {
                    var toggleInput = row.querySelector('.pb-setup-toggle-input');
                    if (toggleInput) {
                        toggleInput.addEventListener('change', function () {
                            state.optedInSetupFees[fee.id] = toggleInput.checked;
                            state.accountFee = totalSetupFees(state.account);
                            renderAddons();
                            renderTotals();
                        });
                    }
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
                    '<input type="number" name="pb-qty-' + addon.id + '" class="pb-qty-input" min="0" step="1" inputmode="numeric" value="' + qty + '" aria-label="' + addon.name + ' quantity" />' +
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

        var addonsCost = addonsCostBase;

        var subtotal = state.tierCost + addonsCost;
        var gst = subtotal * 0.10;
        var monthlyTotal = subtotal + gst;
        var yearlyTotal = monthlyTotal * 12;

        if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2);
        if (gstEl)      gstEl.textContent      = '$' + gst.toFixed(2);

        // Discount line
        if (discountLine) {
            discountLine.innerHTML = '';
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
        var totalSavings = (monthlyTierPrice - yearlyTierPrice) * 12;

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
            addons:    addons,
        };
    }

    if (lockBtn && endpoint) {
        lockBtn.addEventListener('click', async function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            // Free tier has no paid items — open the placeholder lock modal instead
            if (state.tier === 'free' && state.accountFee === 0) {
                var lockModal = document.getElementById('pbLockModal');
                if (lockModal) {
                    lockModal.classList.add('is-open');
                    lockModal.setAttribute('aria-hidden', 'false');
                }
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

    // Expose a state snapshot so the #pbLockModal form can capture the user's
    // current pricing-builder selection (account, tier, billing, add-ons, total).
    if (typeof window !== 'undefined') {
        window.babbittPricing = {
            getState: function () {
                var addons = {};
                Object.keys(state.addons).forEach(function (k) {
                    var a = state.addons[k];
                    if (a && a.quantity > 0) addons[k] = { quantity: a.quantity };
                });
                return {
                    billing:     state.billing,
                    account:     state.account,
                    tier:        state.tier,
                    tierCost:    state.tierCost,
                    accountFee:  state.accountFee,
                    addons:      addons,
                    totalText:   totalEl        ? totalEl.textContent        : '',
                    savingsText: savingsDisplay ? savingsDisplay.textContent : ''
                };
            }
        };
    }
})();

/* ── 15. Lock Early Bird modal form — populates from pricing state, AJAX-submits ── */
(function () {
    var modal     = document.getElementById('pbLockModal');
    var form      = document.getElementById('pbLockForm');
    var snapshot  = document.getElementById('pbLockSnapshot');
    var successEl = document.getElementById('pbLockSuccess');
    var msgEl     = document.getElementById('pbLockFormMessage');
    var submitBtn = document.getElementById('pbLockSubmit');
    if (!modal || !form) return;

    var hidden = {
        account:   document.getElementById('pbLockPlanAccount'),
        tier:      document.getElementById('pbLockPlanTier'),
        billing:   document.getElementById('pbLockPlanBilling'),
        addons:    document.getElementById('pbLockPlanAddons'),
        total:     document.getElementById('pbLockPlanTotal')
    };

    var ACCOUNT_LABELS = {
        trades:          'Trades',
        property:        'Property',
        propertyOwner:   'Property · Owner',
        propertyManager: 'Property · Manager',
        strata:          'Property · Strata',
        propertyTenant:  'Property · Tenant',
        supplier:        'Supplier'
    };
    var TIER_LABELS = {
        free:  'Free',
        tier1: 'Tier 1',
        tier2: 'Tier 2'
    };
    var ADDON_LABELS = {
        noads:      'Remove ads',
        fleet:      'Fleet',
        staff:      'Staff',
        properties: 'Properties',
        storage:    'Storage'
    };

    function formatAddons(addons) {
        var keys = Object.keys(addons || {});
        if (!keys.length) return '';
        return keys.map(function (k) {
            var q = addons[k].quantity;
            var label = ADDON_LABELS[k] || k;
            return q > 1 ? label + ' \u00D7' + q : label;
        }).join(', ');
    }

    function setSnap(key, val) {
        var el = snapshot && snapshot.querySelector('[data-snap="' + key + '"]');
        if (el) el.textContent = val;
    }

    function toggleSnapRow(name, on) {
        var row = snapshot && snapshot.querySelector('[data-snap-row="' + name + '"]');
        if (row) row.hidden = !on;
    }

    function populateFromState() {
        var state = (window.babbittPricing && window.babbittPricing.getState)
            ? window.babbittPricing.getState() : null;
        if (!state) return;

        var accountLabel = ACCOUNT_LABELS[state.account] || state.account;
        var tierLabel    = TIER_LABELS[state.tier] || state.tier;
        var addonsText   = formatAddons(state.addons);
        var billingLabel = state.billing === 'yearly' ? 'Yearly' : 'Monthly';

        setSnap('account', accountLabel);
        setSnap('tier',    tierLabel);
        setSnap('billing', billingLabel);
        setSnap('total',   state.totalText || '\u2014');
        setSnap('savings', state.savingsText || '');

        toggleSnapRow('addons', !!addonsText);
        if (addonsText) setSnap('addons', addonsText);

        if (hidden.account)   hidden.account.value   = accountLabel;
        if (hidden.tier)      hidden.tier.value      = tierLabel;
        if (hidden.billing)   hidden.billing.value   = billingLabel;
        if (hidden.addons)    hidden.addons.value    = addonsText || 'none';
        if (hidden.total)     hidden.total.value     = state.totalText || '';
    }

    function resetForm() {
        form.style.display = '';
        if (snapshot)  snapshot.hidden  = false;
        if (successEl) successEl.hidden = true;
        if (msgEl) {
            msgEl.textContent = '';
            msgEl.className = 'pb-lock-form-message';
        }
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Lock my early bird offer';
        }
    }

    function showSuccess() {
        form.style.display = 'none';
        if (snapshot)  snapshot.hidden  = true;
        if (successEl) successEl.hidden = false;
    }

    // When #pbLockModal opens, reset and populate from current pricing state.
    var observer = new MutationObserver(function () {
        if (modal.classList.contains('is-open')) {
            resetForm();
            populateFromState();
        }
    });
    observer.observe(modal, { attributes: true, attributeFilter: ['class'] });

    // AJAX submit to FormSubmit.co so the page does NOT navigate away.
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting\u2026';
        }
        if (msgEl) {
            msgEl.textContent = '';
            msgEl.className = 'pb-lock-form-message';
        }

        fetch(window.EO_BRIDGE_ENDPOINT || 'https://formsubmit.co/ajax/db2386c230f1fd46e7c207920bbf4508', {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: new FormData(form)
        }).then(function (res) {
            return res.json().catch(function () { return {}; }).then(function (data) {
                if (!res.ok || (data && data.success === 'false')) {
                    throw new Error((data && data.message) || 'Submission failed. Please try again.');
                }
                showSuccess();
            });
        }).catch(function (err) {
            if (msgEl) {
                msgEl.textContent = (err && err.message) || 'Submission failed. Please try again.';
                msgEl.className = 'pb-lock-form-message pb-lock-form-message--error';
            }
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Lock my early bird offer';
            }
        });
    });
})();
