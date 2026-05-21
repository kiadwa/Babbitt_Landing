# Babbitt Checkout Worker

Cloudflare Worker that accepts a pricing-builder selection from `babbitt.app`, validates and re-prices it, then creates a Stripe Checkout Session (subscription mode) and returns the hosted-checkout URL.

> Note: `*.md` is gitignored at the repo root. To commit this file: `git add -f worker/README.md`.

## Architecture

```
[Pricing Builder UI]
    │  POST { billing, account, tier, addons, babbitt60 }
    ▼
[Cloudflare Worker]  ── validates against canonical pricing
    │  POST /v1/checkout/sessions  (inline price_data)
    ▼
[Stripe Checkout]
    │  on success → SUCCESS_URL?session_id=...
    ▼
[babbitt.app]
```

Pricing is duplicated in two places: `script.js` (display) and `worker/index.js` (source of truth). Keep them in sync when changing tier/addon prices — the Worker is authoritative; the UI is just a preview.

## One-time setup

```bash
cd worker
npm install
npx wrangler login
```

## Configure secrets

Use **test** keys until you're ready to take real money.

```bash
# Live secret key (production)
npx wrangler secret put STRIPE_SECRET_KEY
# paste sk_live_... when prompted

# Staging / dev — test key
npx wrangler secret put STRIPE_SECRET_KEY --env staging
# paste sk_test_... when prompted
```

## Edit `wrangler.toml`

Update `[vars]` for the production environment:

- `ALLOWED_ORIGIN` — exact origin allowed to call the worker (no trailing slash). Default: `https://babbitt.app`.
- `SUCCESS_URL` — landing URL after successful checkout. `&session_id={CHECKOUT_SESSION_ID}` is appended automatically.
- `CANCEL_URL` — landing URL if the user backs out.
- `CURRENCY` — ISO lowercase. Default: `aud`.

## Custom domain (recommended)

In the Cloudflare dashboard → Workers → `babbitt-checkout` → Triggers → Add Custom Domain → `api.babbitt.app`.

Or via routes in `wrangler.toml`:

```toml
[[routes]]
pattern = "api.babbitt.app/checkout"
custom_domain = true
```

## Deploy

```bash
# Staging
npm run deploy:staging

# Production
npm run deploy
```

Once deployed, copy the Worker URL (e.g. `https://api.babbitt.app/checkout` or `https://babbitt-checkout.<acct>.workers.dev`) into `index.html`:

```html
<div class="pricing-builder" id="pricingBuilder" data-checkout-endpoint="https://api.babbitt.app/checkout">
```

Leaving the attribute empty disables Stripe and the button falls back to the existing yellow-sweep waitlist form — handy while you're still finishing Stripe setup.

## Test it locally

```bash
# Terminal 1: serve the static site
npx http-server -p 4173

# Terminal 2: run the worker against test keys
cd worker
npx wrangler dev --env staging
# wrangler prints a local URL like http://localhost:8787
```

Then temporarily edit `index.html`:

```html
data-checkout-endpoint="http://localhost:8787"
```

Open `http://localhost:4173`, scroll to pricing, hit **Lock founding rate · Checkout**. You should land on a Stripe test-mode checkout page. Use Stripe's test card `4242 4242 4242 4242` (any future expiry, any CVC, any postcode).

## Stripe Tax

The worker passes `automatic_tax[enabled]=true` so Stripe Tax computes GST. You must enable Stripe Tax in your Stripe dashboard and register an Australian tax origin. If you'd rather hard-code GST 10% as a manual tax rate, swap that line for `line_items[*][price_data][tax_behavior]=inclusive` and either bake GST into `unit_amount` or use a pre-created `tax_rates[]` ID.

## Webhooks (next step, not yet wired)

For provisioning accounts on payment success, add a `/webhook` route here that handles `checkout.session.completed` and `customer.subscription.created`. That's out of scope for the landing-page lock-in flow but is the natural follow-on once Babbitt's backend exists.

## Files

- `index.js` — Worker entrypoint (single file, no deps at runtime).
- `wrangler.toml` — env config + routes.
- `package.json` — dev dependency on `wrangler`.
