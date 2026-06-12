/**
 * Babbitt founding-rates checkout — Cloudflare Worker.
 *
 * Accepts a POST from the pricing builder with the user's selection, validates
 * it against the canonical pricing table, then creates a Stripe Checkout
 * Session (subscription mode) and returns its URL.
 *
 * Bound secrets (set via `wrangler secret put`):
 *   - STRIPE_SECRET_KEY   live or test secret key
 *
 * Bound vars (in wrangler.toml [vars]):
 *   - ALLOWED_ORIGIN      e.g. https://babbitt.app
 *   - SUCCESS_URL         e.g. https://babbitt.app/?checkout=success
 *   - CANCEL_URL          e.g. https://babbitt.app/?checkout=cancel
 *   - CURRENCY            iso lowercase, e.g. aud
 */

const TIERS = {
  free:  { name: 'Babbitt Free',  monthly: 0,   yearly: 0   },
  tier1: { name: 'Babbitt Tier 1', monthly: 60,  yearly: 30  },
  tier2: { name: 'Babbitt Tier 2', monthly: 200, yearly: 100 },
};

const TIER_ADDONS = {
  free: [
    { id: 'noads',  name: 'Remove ads',        monthly: 11, yearly: 5.50, maxQty: 1 },
    { id: 'fleet',  name: 'Fleet (untracked)', monthly: 8,  yearly: 4,    maxQty: 1 },
  ],
  tier1: [
    { id: 'staff',      name: 'Staff members',     monthly: 20,   yearly: 10,   perItem: true,  maxQty: 50 },
    { id: 'properties', name: 'Properties',        monthly: 1.50, yearly: 0.75, perItem: true,  maxQty: 500, freeQty: 2 },
    { id: 'fleet',      name: 'Fleet (untracked)', monthly: 8,    yearly: 4,    maxQty: 1 },
    { id: 'storage',    name: 'Extra storage',     monthly: 10,   yearly: 5,    perGB: true,    maxQty: 1000 },
  ],
  tier2: [],
};

const SETUP_FEES = {
  supplier: [{ id: 'catalogueSetup', name: 'Catalogue setup', amount: 200 }],
};

const VALID_ACCOUNTS = ['trades', 'property', 'supplier'];
const VALID_BILLING  = ['monthly', 'yearly'];
const VALID_TIERS    = Object.keys(TIERS);

function corsHeaders(origin, allowed) {
  const ok = origin === allowed;
  return {
    'Access-Control-Allow-Origin':  ok ? origin : allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age':       '86400',
  };
}

function bad(status, message, origin, allowed) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin, allowed) },
  });
}

function toCents(amount) {
  return Math.round(amount * 100);
}

function validateAndPrice(payload) {
  const { billing, account, tier, addons = {} } = payload || {};

  if (!VALID_BILLING.includes(billing))   throw new Error('Invalid billing');
  if (!VALID_ACCOUNTS.includes(account))  throw new Error('Invalid account');
  if (!VALID_TIERS.includes(tier))        throw new Error('Invalid tier');

  const tierDef = TIERS[tier];
  const tierPrice = billing === 'yearly' ? tierDef.yearly : tierDef.monthly;

  const lineItems = [];

  // Tier line item (skip free tier — checkout requires at least one paid item)
  if (tierPrice > 0) {
    const unitMonthly = tierPrice;
    const unit = billing === 'yearly' ? unitMonthly * 12 : unitMonthly;
    lineItems.push({
      kind: 'recurring',
      name: `${tierDef.name} (${billing})`,
      unitAmount: toCents(unit),
      quantity: 1,
      interval: billing === 'yearly' ? 'year' : 'month',
    });
  }

  // Add-ons
  const addonDefs = TIER_ADDONS[tier] || [];
  for (const def of addonDefs) {
    const sel = addons[def.id];
    if (!sel) continue;
    const qty = Math.max(0, Math.floor(Number(sel.quantity) || 0));
    if (qty <= 0) continue;
    if (def.maxQty && qty > def.maxQty) throw new Error(`Addon ${def.id} exceeds max`);
    const chargeable = Math.max(0, qty - (def.freeQty || 0));
    if (chargeable === 0) continue;

    const unitMonthly = billing === 'yearly' ? def.yearly : def.monthly;
    const unit = billing === 'yearly' ? unitMonthly * 12 : unitMonthly;
    lineItems.push({
      kind: 'recurring',
      name: `${def.name}${def.perItem ? ' (per item)' : def.perGB ? ' (per GB)' : ''}`,
      unitAmount: toCents(unit),
      quantity: chargeable,
      interval: billing === 'yearly' ? 'year' : 'month',
    });
  }

  // One-time setup fees for the account type
  const setupFees = SETUP_FEES[account] || [];
  for (const fee of setupFees) {
    lineItems.push({
      kind: 'one_time',
      name: `${fee.name} (one-time)`,
      unitAmount: toCents(fee.amount),
      quantity: 1,
    });
  }

  if (lineItems.length === 0) {
    throw new Error('Free tier has no paid items — nothing to checkout');
  }

  return { lineItems, account, tier, billing };
}

function buildStripeForm(params, currency, successUrl, cancelUrl, priced) {
  const form = new URLSearchParams();
  form.append('mode', 'subscription');
  form.append('success_url', `${successUrl}&session_id={CHECKOUT_SESSION_ID}`);
  form.append('cancel_url', cancelUrl);
  form.append('billing_address_collection', 'required');
  form.append('automatic_tax[enabled]', 'true');
  form.append('metadata[account]', priced.account);
  form.append('metadata[tier]',    priced.tier);
  form.append('metadata[billing]', priced.billing);
  form.append('subscription_data[metadata][account]', priced.account);
  form.append('subscription_data[metadata][tier]',    priced.tier);
  form.append('subscription_data[metadata][billing]', priced.billing);

  priced.lineItems.forEach((li, i) => {
    const base = `line_items[${i}]`;
    form.append(`${base}[quantity]`, String(li.quantity));
    form.append(`${base}[price_data][currency]`, currency);
    form.append(`${base}[price_data][unit_amount]`, String(li.unitAmount));
    form.append(`${base}[price_data][tax_behavior]`, 'exclusive');
    form.append(`${base}[price_data][product_data][name]`, li.name);
    if (li.kind === 'recurring') {
      form.append(`${base}[price_data][recurring][interval]`, li.interval);
    }
  });
  return form;
}

async function createCheckoutSession(env, priced) {
  const currency  = (env.CURRENCY    || 'aud').toLowerCase();
  const successUrl = env.SUCCESS_URL || 'https://babbitt.app/?checkout=success';
  const cancelUrl  = env.CANCEL_URL  || 'https://babbitt.app/?checkout=cancel';

  const form = buildStripeForm({}, currency, successUrl, cancelUrl, priced);

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type':  'application/x-www-form-urlencoded',
    },
    body: form.toString(),
  });

  const data = await res.json();
  if (!res.ok) {
    const msg = (data && data.error && data.error.message) || 'Stripe request failed';
    throw new Error(msg);
  }
  return data;
}

export default {
  async fetch(request, env) {
    const allowed = env.ALLOWED_ORIGIN || 'https://babbitt.app';
    const origin  = request.headers.get('Origin') || '';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin, allowed) });
    }
    if (request.method !== 'POST') {
      return bad(405, 'Method not allowed', origin, allowed);
    }
    if (!env.STRIPE_SECRET_KEY) {
      return bad(500, 'Server misconfigured: missing STRIPE_SECRET_KEY', origin, allowed);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return bad(400, 'Invalid JSON body', origin, allowed);
    }

    let priced;
    try {
      priced = validateAndPrice(payload);
    } catch (err) {
      return bad(400, err.message, origin, allowed);
    }

    try {
      const session = await createCheckoutSession(env, priced);
      return new Response(JSON.stringify({ url: session.url, id: session.id }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin, allowed) },
      });
    } catch (err) {
      return bad(502, err.message, origin, allowed);
    }
  },
};
