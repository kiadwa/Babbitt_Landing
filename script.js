/* ════════════════════════════════════════════════════════════
   BABBITT LANDING — Interactions
   ════════════════════════════════════════════════════════════ */

/* ── 1. Word Cycling (hero headline) ── */
(function () {
    var nouns   = ['trade','craft','skill','hands','licence','crew','work','property','product','supply'];
    var verbs   = ['builds','frames','finishes','renovates','installs','completes','holds','starts','moves'];
    var objects = ['home','site','job','property','build','project','story','team','reputation'];
    var singles = ['Remembered','Respected','Rewarded','Redefines','Re-orders','Remains'];

    var idx  = { n: 0, v: 0, o: 0, s: 0 };
    var els  = {
        n: document.getElementById('c-noun'),
        v: document.getElementById('c-verb'),
        o: document.getElementById('c-obj'),
        s: document.getElementById('c-single')
    };
    var words = { n: nouns, v: verbs, o: objects, s: singles };

    function swapWord(key) {
        var el  = els[key];
        var arr = words[key];
        if (!el) return;
        el.classList.remove('anim-in');
        el.classList.add('anim-out');
        setTimeout(function () {
            idx[key] = (idx[key] + 1) % arr.length;
            el.textContent = arr[idx[key]];
            el.classList.remove('anim-out');
            el.classList.add('anim-in');
            setTimeout(function () { el.classList.remove('anim-in'); }, 300);
        }, 300);
    }

    setInterval(function () {
        swapWord('n'); swapWord('v'); swapWord('o'); swapWord('s');
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
        // 1. Fade out the form first
        sweepMsg.classList.remove('active');
        // 2. After form fades (250ms), retract the yellow sweep
        setTimeout(function () {
            yellowSweep.classList.remove('active');
            if (btnMember) {
                setTimeout(function () {
                    btnMember.style.transform = '';
                    btnMember.style.opacity   = '1';
                    btnMember.classList.remove('flying');
                }, 250);
            }
        }, 300);
    }

    // Hero "I'm interested" — fly animation then open
    if (btnMember) {
        btnMember.addEventListener('click', function () {
            var rect = this.getBoundingClientRect();
            var flyX = (window.innerWidth - rect.right) + rect.width * 0.5 - 20;
            var flyY = -(rect.top) + 18;

            this.classList.add('flying');
            this.style.transform = 'translate(' + flyX + 'px, ' + flyY + 'px) scale(0.32) rotate(6deg)';
            this.style.opacity   = '0.5';

            setTimeout(openSweep, 400);
        });
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

/* ── 5. Hero Cursor Glare ── */
(function () {
    var hero = document.querySelector('.hero');
    var glare = document.getElementById('glareLayer');
    var glareWarm = document.getElementById('glareLayerWarm');
    if (!hero || !glare || !glareWarm) return;

    hero.addEventListener('mousemove', function (e) {
        var rect = hero.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;

        glare.style.opacity = '1';
        glare.style.background =
            'radial-gradient(600px circle at ' + x + 'px ' + y + 'px, rgba(255,255,255,0.07) 0%, transparent 50%)';

        glareWarm.style.opacity = '1';
        glareWarm.style.background =
            'radial-gradient(400px circle at ' + x + 'px ' + y + 'px, rgba(246,181,0,0.1) 0%, transparent 50%)';
    });

    hero.addEventListener('mouseleave', function () {
        glare.style.opacity = '0';
        glareWarm.style.opacity = '0';
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
                            this.style.animation = 'none';
                            this.style.opacity = '1';
                            this.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
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

/* ── 8. Navbar Scroll Effect ── */
(function () {
    var navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.style.borderBottomColor = 'rgba(46,43,38,0.8)';
            navbar.style.backgroundColor = 'rgba(19,18,16,0.95)';
        } else {
            navbar.style.borderBottomColor = '';
            navbar.style.backgroundColor = '';
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

/* ── 8. Campaign Modal (Yulli's Launch — swappable) ── */
(function () {
    var modal    = document.getElementById('campaignModal');
    if (!modal) return;

    var closeBtn = document.getElementById('campaignModalClose');
    var backdrop = modal.querySelector('.campaign-modal-backdrop');
    var fabBtn   = document.getElementById('btnCampaignFab');
    var navBtn   = document.getElementById('btnCampaignNav');

    function openCampaign() {
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeCampaign() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeCampaign);
    if (backdrop) backdrop.addEventListener('click', closeCampaign);
    if (fabBtn)   fabBtn.addEventListener('click', openCampaign);
    if (navBtn)   navBtn.addEventListener('click', openCampaign);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeCampaign();
        }
    });

    // Auto-open when user lands on /qrlanding (trailing slash tolerant)
    var path = window.location.pathname.replace(/\/$/, '');
    if (path.endsWith('/qrlanding') || path.endsWith('/qrlanding/index.html')) {
        setTimeout(openCampaign, 450);
    }
})();
