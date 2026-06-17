# Babbitt — Email Octopus form bridge

A Cloudflare Worker that receives the website's form submissions and adds the
contact to the correct **Email Octopus** list. It also mirrors each submission to
**FormSubmit** so Bruno's inbox keeps getting a copy during rollout (dual-send).

It's a **drop-in FormSubmit replacement**:

- **Native form POST** (waitlist, contact) → the worker responds `302` to the
  form's `_next`, exactly like FormSubmit, so the site's existing success-banner
  flow is unchanged.
- **AJAX POST** (the pricing-lock modal, `Accept: application/json`) → JSON
  `{ success, message }`.

```
website form ──POST──▶ babbitt-eo-bridge (Cloudflare Worker)
                         ├──▶ Email Octopus  (add contact to list by lane)
                         └──▶ FormSubmit      (copy to Bruno's inbox)
```

> Separate from `../worker/`, which is the **Stripe checkout** worker. Different
> job, different deploy.

---

## What you need from Email Octopus first

1. Log in (Bruno provides the credentials).
2. **Account Settings → API** → copy the API key.
3. **Lists** → note each list's **UUID**:
   - Trades, Owners, Managers, Strata, Suppliers, and a general/Default list.
4. In each list, **Settings → Fields**, confirm these custom fields exist
   (EO silently drops fields that aren't pre-created):
   - `FirstName`, `LastName` (usually default), `CompanyName`
   - `icp_lane` (TEXT), `stage` (TEXT), `source` (TEXT)
   - optional pricing snapshot: `plan_account`, `plan_tier`, `plan_billing`, `plan_total` (all TEXT)

---

## Deploy

```bash
cd eo-bridge
npm install                 # installs wrangler
# 1) fill the list UUIDs + origin in wrangler.toml [vars]
# 2) set the secret API key (never goes in the repo):
npx wrangler secret put EO_API_KEY
# 3) deploy:
npx wrangler deploy
```

`wrangler deploy` prints the worker URL, e.g.
`https://babbitt-eo-bridge.<your-subdomain>.workers.dev`.

---

## Wire the website

In `../index.html`, set the endpoint (one line, near the bottom):

```html
<script>window.EO_BRIDGE_ENDPOINT = 'https://babbitt-eo-bridge.<subdomain>.workers.dev';</script>
```

- Empty string (current) → forms post to FormSubmit as before. **Nothing breaks
  before you deploy.**
- Set → `script.js` repoints the waitlist + contact form `action`s and the
  pricing-lock `fetch()` at the worker. No other changes needed.

---

## Lane → list mapping (form value → EO list)

The select value from each form (`userType` on waitlist, `icp` on pricing-lock)
maps to a list bucket. Edit `LANE_MAP` in `src/worker.js` if these change.

| Form value | EO list (`EO_LIST_*`) |
|---|---|
| `trades`, `trades_owner`, `trades_team` | TRADES |
| `property_owner` | OWNERS |
| `property_manager` | MANAGERS |
| `strata` | STRATA |
| `supplier`, `enterprise` | SUPPLIERS |
| `tenant`, `other`, blank (contact form) | DEFAULT |

### Source tags (per form)

| Form | `_source` value → tag |
|---|---|
| Waitlist ("Secure My Spot") | `website_waitlist` |
| Pricing lock ("Lock my early bird offer") | `website_pricing` |
| Contact ("Get in touch") | `website_contact` |

Each contact also gets a `lane:<value>` tag and the `icp_lane`/`stage`/`source`
fields. `stage` is always `cold` on signup.

---

## Test end-to-end (after deploy)

- [ ] Waitlist for each lane (trades, property_owner, property_manager, strata, supplier) → contact lands in the right list within ~30s
- [ ] Custom fields populated (FirstName, LastName, icp_lane, stage, source, CompanyName)
- [ ] Tags applied (`source:website_waitlist`, `lane:trades`, …)
- [ ] Pricing-lock submit → JSON success, contact tagged `source:website_pricing`, plan_* fields set
- [ ] Contact form → lands in DEFAULT list, tagged `source:website_contact`
- [ ] Bruno still receives the FormSubmit copy (dual-send)
- [ ] Re-submitting the same email doesn't error (treated as already-subscribed)

---

## Notes / handoff

- **API key rotation:** re-run `npx wrangler secret put EO_API_KEY` and redeploy.
- **Turn off the FormSubmit mirror** once EO is proven: set `FORMSUBMIT_ENDPOINT = ""` in `wrangler.toml` and redeploy.
- **Re-submits:** an already-subscribed email is treated as success; the worker does **not** overwrite their fields (kept dependency-free — no MD5/PUT). Add a PUT-update path later if you want re-submits to refresh fields.
- **Not in this repo:** there is no Babbitt 60 form on the live site (it was removed). If it returns, give it `_source="b60_applicant"` and it'll route by lane like the others.
