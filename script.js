// Countdown Timer
function updateCountdown() {
    // Target date: February 19, 2026 at 3:00 PM (UTC)
    // This is 30 days after launch date (January 20, 2026)
    // Using UTC to avoid timezone issues
    const targetDate = new Date(Date.UTC(2026, 1, 19, 15, 0, 0)); // Month is 0-indexed (1 = February)
    
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    // Get DOM elements
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    // Check if elements exist
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
        console.error('Countdown timer elements not found');
        return;
    }

    if (distance < 0) {
        // Countdown finished - show 0
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
    }

    // Calculate time remaining
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update DOM elements with zero-padding
    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
}

// Initialize countdown and update every second
document.addEventListener('DOMContentLoaded', function() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(10, 14, 39, 0.98)';
    } else {
        navbar.style.backgroundColor = 'rgba(10, 14, 39, 0.95)';
    }
});

// Intersection Observer for fade-in animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards and benefit cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.feature-card, .benefit-card, .problem-item, .benefit-item');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Form submission handler with reCAPTCHA verification for FormSubmit.co
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('waitlistForm');
    const formMessage = document.getElementById('formMessage');
    const submitBtn = document.getElementById('submitBtn');
    
    // Wait for reCAPTCHA to be ready
    function waitForRecaptcha(callback) {
        if (typeof grecaptcha !== 'undefined') {
            if (grecaptcha.ready) {
                grecaptcha.ready(callback);
            } else {
                // If ready() doesn't exist, check if widget is rendered
                setTimeout(function() {
                    try {
                        const widgetId = grecaptcha.render ? 0 : null;
                        if (widgetId !== null || grecaptcha.getResponse) {
                            callback();
                        } else {
                            waitForRecaptcha(callback);
                        }
                    } catch (e) {
                        waitForRecaptcha(callback);
                    }
                }, 100);
            }
        } else {
            // If grecaptcha isn't loaded yet, wait a bit and try again
            setTimeout(function() {
                waitForRecaptcha(callback);
            }, 100);
        }
    }
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Wait for reCAPTCHA to be ready before checking
            waitForRecaptcha(function() {
                try {
                    // Check if reCAPTCHA exists and get response
                    if (typeof grecaptcha === 'undefined' || !grecaptcha.getResponse) {
                        formMessage.textContent = 'reCAPTCHA is still loading. Please wait a moment and try again.';
                        formMessage.className = 'form-message error';
                        return;
                    }
                    
                    // Get the widget ID (0 for first widget)
                    let recaptchaResponse = '';
                    try {
                        recaptchaResponse = grecaptcha.getResponse();
                    } catch (err) {
                        // Try with explicit widget ID
                        try {
                            recaptchaResponse = grecaptcha.getResponse(0);
                        } catch (err2) {
                            console.error('reCAPTCHA getResponse error:', err2);
                        }
                    }
                    
                    if (!recaptchaResponse) {
                        formMessage.textContent = 'Please complete the reCAPTCHA verification.';
                        formMessage.className = 'form-message error';
                        return;
                    }
                    
                    // Add reCAPTCHA response as hidden input to form
                    // FormSubmit.co works best with direct form submission (not AJAX)
                    let recaptchaInput = form.querySelector('input[name="g-recaptcha-response"]');
                    if (!recaptchaInput) {
                        recaptchaInput = document.createElement('input');
                        recaptchaInput.type = 'hidden';
                        recaptchaInput.name = 'g-recaptcha-response';
                        form.appendChild(recaptchaInput);
                    }
                    recaptchaInput.value = recaptchaResponse;
                    
                    // Show loading state
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Submitting...';
                    formMessage.textContent = 'Submitting your request...';
                    formMessage.className = 'form-message';
                    
                    // Submit the form - FormSubmit.co will handle it
                    // The form will redirect back to the _next URL after submission
                    form.submit();
                } catch (error) {
                    console.error('reCAPTCHA error:', error);
                    formMessage.textContent = 'Please complete the reCAPTCHA verification.';
                    formMessage.className = 'form-message error';
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Secure My Spot';
                }
            });
        });
        
        // Check if we're returning from a successful form submission
        // FormSubmit.co redirects to _next URL
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('submitted') === 'true' || window.location.hash === '#contact') {
            // Show success message if form was just submitted
            const showSuccess = sessionStorage.getItem('formSubmitted');
            if (showSuccess) {
                formMessage.textContent = 'Thank you for joining the waitlist! We\'ll be in touch soon.';
                formMessage.className = 'form-message success';
                form.reset();
                sessionStorage.removeItem('formSubmitted');
                // Scroll to form message
                formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        
        // Mark form as about to be submitted
        form.addEventListener('submit', function() {
            sessionStorage.setItem('formSubmitted', 'true');
        }, { once: true });
    }
});

