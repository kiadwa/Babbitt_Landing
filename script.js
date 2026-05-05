/* ════════════════════════════════════════════════════════════
   BABBITT LANDING — Interactions
   ════════════════════════════════════════════════════════════ */

/* ── 1. Word Cycling (hero headline — four sync'd slots) ── */
(function () {
    var tracks = [
        { el: document.getElementById('c-noun'),   words: ['trade', 'craft', 'skill', 'work'] },
        { el: document.getElementById('c-verb'),    words: ['builds', 'shapes', 'defines', 'proves'] },
        { el: document.getElementById('c-obj'),     words: ['home', 'building', 'project', 'community'] },
        { el: document.getElementById('c-single'),  words: ['Remembered', 'Verified', 'Trusted', 'Proven'] }
    ];
    // Bail if none of the elements exist
    var active = tracks.filter(function (t) { return t.el; });
    if (!active.length) return;

    var i = 0;
    setInterval(function () {
        active.forEach(function (t) {
            t.el.classList.remove('anim-in');
            t.el.classList.add('anim-out');
        });
        setTimeout(function () {
            i = (i + 1) % active[0].words.length;
            active.forEach(function (t) {
                t.el.textContent = t.words[i];
                t.el.classList.remove('anim-out');
                t.el.classList.add('anim-in');
            });
            setTimeout(function () {
                active.forEach(function (t) { t.el.classList.remove('anim-in'); });
            }, 300);
        }, 300);
    }, 2800);
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

/* ── 3. Yellow Sweep — open form overlay ── */
(function () {
    var btnMember    = document.getElementById('btnMember');
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

    if (btnMember) {
        btnMember.addEventListener('click', openSweep);
    }

    // Nav "Get Early Access" — open immediately
    if (btnNavCta) {
        btnNavCta.addEventListener('click', function (e) {
            e.preventDefault();
            openSweep();
        });
    }

    // Waitlist section "I'm interested" — open immediately
    if (btnWaitlist) {
        btnWaitlist.addEventListener('click', function () {
            openSweep();
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

/* ── 9. Form Submission (FormSubmit.co with built-in captcha) ── */
(function () {
    var form = document.getElementById('waitlistForm');
    var formMessage = document.getElementById('formMessage');
    var submitBtn = document.getElementById('submitBtn');
    var successEl = document.getElementById('waitlistSuccess');
    if (!form) return;

    form.addEventListener('submit', function () {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        if (formMessage) {
            formMessage.textContent = 'Submitting your request...';
            formMessage.className = 'form-message';
        }
        sessionStorage.setItem('formSubmitted', 'true');
    });

    // Detect return from successful FormSubmit redirect
    var submitted = sessionStorage.getItem('formSubmitted');
    if (submitted && successEl) {
        var msg = submitted === 'partner'
            ? "Thank you for your partnership enquiry. We'll be in touch soon."
            : "Thank you for joining the waitlist. We'll be in touch soon.";
        successEl.textContent = msg;
        successEl.className = 'form-message success';
        sessionStorage.removeItem('formSubmitted');
        successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

/* ── 11. Campaign Modal ── */
(function () {
    var modal      = document.getElementById('campaignModal');
    var closeBtn   = document.getElementById('campaignModalClose');
    var backdrop   = modal ? modal.querySelector('.campaign-modal-backdrop') : null;
    var btnNav     = document.getElementById('btnCampaignNav');
    var btnFab     = document.getElementById('btnCampaignFab');
    if (!modal) return;

    function openModal() {
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
    }

    if (btnNav) btnNav.addEventListener('click', openModal);
    if (btnFab) btnFab.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
})();

