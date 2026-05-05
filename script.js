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

/* ── 4c. Hero Scroll-Out Collapse ──
   Scroll-tied: as the hero's bottom edge leaves the viewport, peek cards fold
   off-screen left in reverse-numbering order (04 → 03 → 02 → 01 → center),
   and the partner CTA untypes right-to-left. Reverses on scroll-up.
*/
(function () {
    var hero = document.querySelector('.hero.hero-mosaic');
    if (!hero) return;

    var partnerCta = hero.querySelector('.mosaic-partner-cta');
    var partnerBtn = partnerCta ? partnerCta.querySelector('button, a') : null;

    // Window the animation plays over, in px of scroll.
    // Wider = more time to see the choreography. Tunable.
    var EXIT_WINDOW = Math.round(window.innerHeight * 0.75);
    var OFFSCREEN_VW = 110;
    var MAX_ROTATE = 80;
    var MAX_SCALE_DELTA = 0.15;

    // Order: right-to-left, reverse of card numbering. Each gets a sub-window.
    var plan = [
        { sel: '.peek--founders', start: 0.00, end: 0.40 },
        { sel: '.peek--demo',     start: 0.15, end: 0.55 },
        { sel: '.peek--why',      start: 0.30, end: 0.70 },
        { sel: '.peek--lanes',    start: 0.45, end: 0.85 },
        { sel: '.mosaic-center',  start: 0.60, end: 1.00 }
    ];
    plan.forEach(function (p) { p.el = hero.querySelector(p.sel); });

    // Split partner CTA text into per-character spans (run once).
    var charSpans = [];
    if (partnerBtn) {
        var text = partnerBtn.textContent;
        partnerBtn.textContent = '';
        for (var i = 0; i < text.length; i++) {
            var span = document.createElement('span');
            span.className = 'untype-char';
            span.textContent = text[i];
            partnerBtn.appendChild(span);
            charSpans.push(span);
        }
    }

    function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

    var reduceMotionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    var desktopMq = window.matchMedia('(min-width: 769px)');

    function shouldRun() {
        return desktopMq.matches && !reduceMotionMq.matches;
    }

    function resetAll() {
        hero.classList.remove('is-collapsing');
        plan.forEach(function (p) {
            if (!p.el) return;
            p.el.style.transform = '';
            p.el.style.opacity = '';
        });
        if (partnerCta) {
            partnerCta.style.transform = '';
            partnerCta.style.opacity = '';
        }
        charSpans.forEach(function (s) { s.removeAttribute('data-hidden'); });
    }

    var pending = false;
    function update() {
        pending = false;
        if (!shouldRun()) {
            resetAll();
            return;
        }
        var rect = hero.getBoundingClientRect();
        // progress = 0 when bottom is EXIT_WINDOW above viewport top
        // progress = 1 when bottom hits viewport top (rect.bottom = 0)
        var progress = clamp01((EXIT_WINDOW - rect.bottom) / EXIT_WINDOW);

        if (progress > 0) {
            hero.classList.add('is-collapsing');
            // Force-end the entrance animation so its `fill-mode: both` final keyframe
            // doesn't outrank our inline transform at the cascade level.
            plan.forEach(function (p) {
                if (p.el && p.el.style.animation !== 'none') p.el.style.animation = 'none';
            });
            if (partnerCta && partnerCta.style.animation !== 'none') partnerCta.style.animation = 'none';
        } else {
            hero.classList.remove('is-collapsing');
        }

        plan.forEach(function (p) {
            if (!p.el) return;
            var span = p.end - p.start;
            var local = clamp01((progress - p.start) / span);
            if (local === 0) {
                p.el.style.transform = '';
                p.el.style.opacity = '';
                return;
            }
            var tx = -local * OFFSCREEN_VW;
            var ry = -local * MAX_ROTATE;
            var sc = 1 - local * MAX_SCALE_DELTA;
            p.el.style.transform =
                'translateX(' + tx + 'vw) rotateY(' + ry + 'deg) scale(' + sc + ')';
            p.el.style.opacity = String(1 - local);
        });

        if (partnerCta) {
            // Partner CTA sub-window: 0.0 → 0.6
            var ctaLocal = clamp01(progress / 0.6);
            if (ctaLocal === 0) {
                partnerCta.style.transform = '';
                partnerCta.style.opacity = '';
            } else {
                partnerCta.style.transform = 'translateX(' + (-ctaLocal * 30) + 'px)';
                partnerCta.style.opacity = String(1 - ctaLocal);
            }
            var n = charSpans.length;
            for (var i = 0; i < n; i++) {
                // Char i (0 = leftmost) hides when ctaLocal > 1 - i/n
                var threshold = 1 - i / n;
                if (ctaLocal > threshold) charSpans[i].setAttribute('data-hidden', '1');
                else charSpans[i].removeAttribute('data-hidden');
            }
        }
    }

    function onScroll() {
        if (pending) return;
        pending = true;
        requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    if (reduceMotionMq.addEventListener) reduceMotionMq.addEventListener('change', onScroll);
    if (desktopMq.addEventListener) desktopMq.addEventListener('change', onScroll);
    update();
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

