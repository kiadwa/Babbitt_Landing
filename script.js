// Countdown Timer
function updateCountdown() {
    // Launch date: January 20, 2026
    const launchDate = new Date('2026-01-20T15:00:00');
    // Target date: 30 days after launch (February 19, 2026 at 3:00 PM)
    // This ensures everyone sees the same countdown regardless of when they visit
    const targetDate = new Date(launchDate);
    targetDate.setDate(targetDate.getDate() + 30);

    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance < 0) {
        // Countdown finished - show 0 or a message
        // You can update this to show a different message or reset to a new date
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (daysEl) daysEl.textContent = '00';
        if (hoursEl) hoursEl.textContent = '00';
        if (minutesEl) minutesEl.textContent = '00';
        if (secondsEl) secondsEl.textContent = '00';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update DOM elements
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
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
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Check if reCAPTCHA is completed
            const recaptchaResponse = grecaptcha.getResponse();
            if (!recaptchaResponse) {
                formMessage.textContent = 'Please complete the reCAPTCHA verification.';
                formMessage.className = 'form-message error';
                return;
            }
            
            // Disable submit button and show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            formMessage.textContent = '';
            formMessage.className = 'form-message';
            
            try {
                // Add reCAPTCHA response as hidden input to form
                // FormSubmit.co works better with direct form submission
                let recaptchaInput = form.querySelector('input[name="g-recaptcha-response"]');
                if (!recaptchaInput) {
                    recaptchaInput = document.createElement('input');
                    recaptchaInput.type = 'hidden';
                    recaptchaInput.name = 'g-recaptcha-response';
                    form.appendChild(recaptchaInput);
                }
                recaptchaInput.value = recaptchaResponse;
                
                // Add _next parameter to prevent redirect and show success message
                let nextInput = form.querySelector('input[name="_next"]');
                if (!nextInput) {
                    nextInput = document.createElement('input');
                    nextInput.type = 'hidden';
                    nextInput.name = '_next';
                    form.appendChild(nextInput);
                }
                nextInput.value = window.location.href + '#contact';
                
                // Submit form using fetch with proper error handling
                const formData = new FormData(form);
                
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData
                });
                
                // FormSubmit.co returns HTML on success, so we check response status
                if (response.ok || response.status === 200) {
                    formMessage.textContent = 'Thank you for joining the waitlist! We\'ll be in touch soon.';
                    formMessage.className = 'form-message success';
                    form.reset();
                    grecaptcha.reset();
                } else {
                    // Try to get error message from response
                    const text = await response.text();
                    formMessage.textContent = 'Oops! There was a problem submitting your form. Please try again.';
                    formMessage.className = 'form-message error';
                    grecaptcha.reset();
                    console.error('Form submission error:', response.status, text);
                }
            } catch (error) {
                console.error('Form submission error:', error);
                formMessage.textContent = 'Oops! There was a problem submitting your form. Please check your connection and try again.';
                formMessage.className = 'form-message error';
                grecaptcha.reset();
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.textContent = 'Secure My Spot';
            }
        });
    }
});

