# reCAPTCHA Setup Guide

Your form now includes Google reCAPTCHA v2 to prevent spam submissions. Follow these steps to activate it:

## Quick Setup (5 minutes)

### Step 1: Get Your reCAPTCHA Keys
1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin/create)
2. Sign in with your Google account
3. Click **"+"** to create a new site

### Step 2: Configure Your reCAPTCHA
1. **Label**: Give it a name (e.g., "Babbitt Waitlist")
2. **reCAPTCHA type**: Select **"reCAPTCHA v2"** → **"I'm not a robot" Checkbox**
3. **Domains**: Add your domains:
   - For GitHub Pages: `yourusername.github.io` (replace with your GitHub username)
   - For custom domain: `yourdomain.com` and `www.yourdomain.com`
   - For testing locally: `localhost` and `127.0.0.1`
4. Accept the reCAPTCHA Terms of Service
5. Click **Submit**

### Step 3: Get Your Site Key
1. After creating the site, you'll see two keys:
   - **Site Key** (public) - This is what you need
   - **Secret Key** (private) - Keep this safe for future backend use
2. Copy your **Site Key**

### Step 4: Update Your HTML
1. Open `index.html`
2. Find line 233 (the reCAPTCHA div)
3. Replace `YOUR_RECAPTCHA_SITE_KEY` with your actual Site Key
   - Example: `data-sitekey="6LcAbCdeFgHiJkLmNoPqRsTuVwXyZ1234567890"`

### Step 5: Test It
1. Open your form in a browser
2. You should see the reCAPTCHA checkbox
3. Try submitting without checking it - you should get an error
4. Check the box and submit - it should work!

## How It Works

- **User fills form** → **Checks reCAPTCHA** → **Submits form** → **reCAPTCHA verifies** → **Form submits**

The reCAPTCHA widget will appear between the terms checkbox and the submit button. Users must complete it before the form can be submitted.

## Testing Domains

For local development, make sure to add these domains in your reCAPTCHA settings:
- `localhost`
- `127.0.0.1`

## Troubleshooting

**reCAPTCHA not showing?**
- Check that you replaced `YOUR_RECAPTCHA_SITE_KEY` with your actual key
- Verify your domain is added in reCAPTCHA settings
- Check browser console for errors
- Make sure the reCAPTCHA script is loaded (check Network tab)

**"Error for site owner: Invalid site key"**
- Double-check your Site Key is correct
- Make sure your domain matches what you registered
- Wait a few minutes after creating the key (propagation delay)

**Form submits without reCAPTCHA?**
- Check browser console for JavaScript errors
- Verify the JavaScript is checking for reCAPTCHA completion

## Free Tier

Google reCAPTCHA is **completely free** with no submission limits!

## Security Notes

- The Site Key is public and safe to use in frontend code
- The Secret Key should NEVER be exposed in frontend code
- For additional security, you can verify the reCAPTCHA response on a backend server using the Secret Key (optional for now)

## Alternative: hCaptcha

If you prefer a privacy-focused alternative, you can use **hCaptcha** instead:
- Website: https://www.hcaptcha.com/
- Similar setup process
- Privacy-focused, GDPR compliant
- Also completely free

