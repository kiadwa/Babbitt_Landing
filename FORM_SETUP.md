# Form Submission Setup Guide

Your waitlist form is now configured to work with **Formspree**, a form backend service that works perfectly with GitHub Pages.

## Quick Setup (5 minutes)

### Step 1: Create a Formspree Account
1. Go to [https://formspree.io/](https://formspree.io/)
2. Click "Sign Up" (free account available)
3. Verify your email address

### Step 2: Create a New Form
1. After logging in, click "New Form"
2. Give your form a name (e.g., "Babbitt Waitlist")
3. Copy your form endpoint URL (looks like: `https://formspree.io/f/xpzgkqyz`)

### Step 3: Update Your HTML
1. Open `index.html`
2. Find line 215 (the form element)
3. Replace `YOUR_FORM_ID` with your actual Formspree form ID
   - Example: If your endpoint is `https://formspree.io/f/xpzgkqyz`
   - Change: `action="https://formspree.io/f/YOUR_FORM_ID"`
   - To: `action="https://formspree.io/f/xpzgkqyz"`

### Step 4: Test Your Form
1. Deploy to GitHub Pages or test locally
2. Fill out and submit the form
3. Check your email (Formspree will send you a confirmation email)
4. Check your Formspree dashboard for submissions

## Formspree Free Tier Limits
- ✅ 50 submissions per month
- ✅ Email notifications
- ✅ Spam protection
- ✅ Form submissions dashboard

## Alternative Services

If you prefer a different service, here are other options:

### 1. **FormSubmit** (No signup required)
- Website: https://formsubmit.co/
- Update form action to: `action="https://formsubmit.co/YOUR_EMAIL@example.com"`
- No account needed, but less features

### 2. **Web3Forms** (Free, no signup)
- Website: https://web3forms.com/
- Get an access key and update the form
- Good alternative to Formspree

### 3. **EmailJS** (Send emails directly)
- Website: https://www.emailjs.com/
- Requires more JavaScript setup
- Good for sending emails without backend

### 4. **Netlify Forms** (If hosting on Netlify)
- Add `netlify` attribute to form
- Works automatically on Netlify hosting

## Current Form Fields
Your form collects:
- First Name
- Last Name
- Email
- User Type (dropdown)
- Terms & Conditions (checkbox)

All submissions will be sent to your Formspree dashboard and you'll receive email notifications.

## Troubleshooting

**Form not submitting?**
- Check that you replaced `YOUR_FORM_ID` with your actual Formspree ID
- Make sure your Formspree form is active
- Check browser console for errors

**Not receiving emails?**
- Check your spam folder
- Verify your email in Formspree settings
- Check Formspree dashboard for submissions

**Need more submissions?**
- Formspree paid plans start at $19/month (unlimited submissions)
- Or use multiple free accounts for different forms

