/* ════════════════════════════════════════════════════════════
   Babbitt — Email Octopus form bridge (Cloudflare Worker)
   ════════════════════════════════════════════════════════════
   A drop-in replacement for FormSubmit.co that ALSO subscribes the
   contact to the correct Email Octopus list.

   - Native form POST (Content-Type: form-urlencoded/multipart, no JSON
     Accept header)  → responds 302 to the form's `_next`, exactly like
     FormSubmit, so the site's existing redirect+banner flow is unchanged.
   - AJAX POST (Accept: application/json, e.g. the pricing-lock modal)
     → responds JSON { success, message }.

   Either way it: (1) subscribes the contact to the right EO list, and
   (2) mirrors the submission to FormSubmit so Bruno's inbox still gets a
   copy during rollout (dual-send). See ../README.md for deploy + config.

   Secrets/config come from the environment (wrangler.toml [vars] +
   `wrangler secret put EO_API_KEY`). No keys live in the static site.
   ════════════════════════════════════════════════════════════ */

/* Form select value → EO list bucket. Both waitlist (`userType`) and the
   pricing-lock modal (`icp`) values are covered here. */
const LANE_MAP = {
    trades: 'TRADES',
    trades_owner: 'TRADES',
    trades_team: 'TRADES',
    property_owner: 'OWNERS',
    property_manager: 'MANAGERS',
    strata: 'STRATA',
    supplier: 'SUPPLIERS',
    enterprise: 'SUPPLIERS',
    tenant: 'DEFAULT',
    other: 'DEFAULT',
    '': 'DEFAULT'
};

export default {
    async fetch(request, env) {
        const origin = request.headers.get('Origin') || '';
        const cors = corsHeaders(origin, env);

        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: cors });
        }
        if (request.method !== 'POST') {
            return json({ success: false, message: 'Method not allowed' }, 405, cors);
        }

        const wantsJson = (request.headers.get('Accept') || '').includes('application/json');
        const debug = request.headers.get('X-Debug') === '1';

        let data;
        try {
            data = await parseBody(request);
        } catch {
            return finish(wantsJson, false, 'Could not read form data.', 400, cors, '');
        }

        const email = String(data.email || data.email_address || '').trim();
        const next = String(data._next || env.DEFAULT_NEXT || '');
        if (!email) {
            return finish(wantsJson, false, 'Email is required.', 422, cors, '');
        }

        const laneValue = String(data.userType || data.icp || '').trim();
        const laneKey = LANE_MAP[laneValue] || 'DEFAULT';
        const listId = env['EO_LIST_' + laneKey] || env.EO_LIST_DEFAULT || '';
        const source = String(data._source || 'website').trim();

        // 1) Subscribe to Email Octopus.
        let eoOk = false;
        let eoMsg = '';
        if (env.EO_API_KEY && listId) {
            try {
                eoOk = await subscribe(env, listId, email, data, source, laneValue);
            } catch (e) {
                eoMsg = (e && e.message) || 'Email Octopus error.';
            }
        } else {
            eoMsg = 'Email Octopus not configured (missing API key or list id).';
        }

        // 2) Mirror to FormSubmit so Bruno's inbox still gets a copy. FormSubmit's
        //    /ajax endpoint rejects requests without a Referer (its "open through a
        //    web server" guard) and returns HTTP 200 with success:"false", so we
        //    send the site origin as Referer/Origin and check the body, not r.ok.
        let mirrorOk = false;
        let mirrorMsg = '';
        if (env.FORMSUBMIT_ENDPOINT) {
            const siteOrigin = (String(env.ALLOWED_ORIGIN || '').split(',')[0] || 'https://babbitt.app').trim();
            try {
                const r = await fetch(env.FORMSUBMIT_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Referer: siteOrigin,
                        Origin: siteOrigin
                    },
                    body: JSON.stringify(stripControlFields(data))
                });
                const j = await r.json().catch(function () { return {}; });
                mirrorOk = r.ok && String(j.success) !== 'false';
                mirrorMsg = String((j && j.message) || ('HTTP ' + r.status));
            } catch (e) {
                mirrorMsg = 'fetch error: ' + ((e && e.message) || 'unknown');
            }
        }

        const ok = eoOk || mirrorOk;
        const message = ok ? '' : (eoMsg || 'Submission failed. Please try again.');
        if (wantsJson) {
            const payload = { success: ok, message: message };
            if (debug) { payload.eo = eoOk; payload.eoMessage = eoMsg; payload.mirror = mirrorOk; payload.mirrorMessage = mirrorMsg; }
            return json(payload, ok ? 200 : 502, cors);
        }
        return finish(false, ok, message, ok ? 200 : 502, cors, next);
    }
};

/* ── Email Octopus 1.6: add OR update the contact on a list ──
   First touch → POST (create). If the email is already on the list (any
   earlier form — contact, waitlist or pricing all share one list), EO rejects
   the POST with MEMBER_EXISTS; we then PUT to MERGE this submission's fields
   into the existing contact, so a 2nd form with the same email still records
   its answers instead of being silently dropped. */
async function subscribe(env, listId, email, data, source, laneValue) {
    const fields = buildFields(data, laneValue);
    const tags = ['source:' + source, 'lane:' + (laneValue || 'unknown')];
    const base = 'https://emailoctopus.com/api/1.6/lists/' + listId + '/contacts';

    // Stage + Source are stamped on first touch only — a later merge must not
    // reset the funnel stage or overwrite the original acquisition source.
    const res = await fetch(base, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            api_key: env.EO_API_KEY,
            email_address: email,
            fields: Object.assign({ Stage: 'cold', Source: source }, fields),
            tags: tags,
            status: 'SUBSCRIBED'
        })
    });
    if (res.ok) return true;

    const err = await res.json().catch(function () { return {}; });
    const code = err && err.error && err.error.code;
    if (code === 'MEMBER_EXISTS_WITH_EMAIL_ADDRESS') {
        return await updateContact(env, listId, email, fields);
    }
    throw new Error((err && err.error && err.error.message) || ('Email Octopus HTTP ' + res.status));
}

/* Merge this submission's fields into an existing contact. EO's contact id is
   the MD5 of the lowercased email. We READ the contact's current fields first
   and PUT the union (this submission's non-empty values winning), so the write
   is correct whether EO's PUT merges or replaces — earlier answers are never
   lost. `status` is deliberately omitted so we never silently re-subscribe
   someone who had opted out. */
async function updateContact(env, listId, email, fields) {
    const memberId = await md5Hex(email.trim().toLowerCase());
    const base = 'https://emailoctopus.com/api/1.6/lists/' + listId + '/contacts/' + memberId;

    // Read existing fields (best effort) so we can preserve everything already set.
    let existing = {};
    try {
        const getRes = await fetch(base + '?api_key=' + encodeURIComponent(env.EO_API_KEY));
        if (getRes.ok) {
            const body = await getRes.json().catch(function () { return {}; });
            if (body && body.fields) existing = body.fields;
        }
    } catch { /* fall back to writing just this submission's fields */ }

    const merged = Object.assign({}, existing, fields);
    const res = await fetch(base, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: env.EO_API_KEY, fields: merged })
    });
    if (res.ok) return true;
    const err = await res.json().catch(function () { return {}; });
    const code = err && err.error && err.error.code;
    // The contact is already on the list either way — don't fail the whole
    // submission over a merge hiccup.
    if (code === 'MEMBER_NOT_FOUND') return true;
    throw new Error((err && err.error && err.error.message) || ('Email Octopus update HTTP ' + res.status));
}

/* Map the site's form fields → the list's EmailOctopus merge tags. Keys MUST
   match the tags EXACTLY (EO strips underscores and capitalises only the first
   letter; they're case-sensitive — see the list's Settings -> Fields). Only
   NON-EMPTY values are returned, so merging a later form never wipes earlier
   answers, and forms that omit a field (e.g. waitlist has no Message) never
   send it. */
function buildFields(data, laneValue) {
    const fields = {};
    const set = function (tag, val) {
        const v = (val == null ? '' : String(val)).trim();
        if (v) fields[tag] = v;
    };
    set('FirstName', data.firstName);
    set('LastName', data.lastName);
    set('Icplane', laneValue);
    set('CompanyName', data.company || data.businessName);
    set('abn', data.abn);
    // Contact form: "What's this about?" (topic) + the message body.
    set('Whatabout', data.topic || data.what_about);
    set('Message', data.message);
    // Pricing snapshot (early-bird lock form).
    set('Planaccount', data.plan_account);
    set('Plantier', data.plan_tier);
    set('Planbilling', data.plan_billing);
    set('Plantotal', data.plan_total);
    return fields;
}

/* MD5 hex — used only to derive the EO contact id from the email. Cloudflare's
   Web Crypto exposes MD5 for digest() as a non-standard extension. */
async function md5Hex(str) {
    const buf = await crypto.subtle.digest('MD5', new TextEncoder().encode(str));
    return Array.prototype.map.call(new Uint8Array(buf), function (b) {
        return b.toString(16).padStart(2, '0');
    }).join('');
}

/* ── Helpers ── */
async function parseBody(request) {
    const ct = request.headers.get('Content-Type') || '';
    if (ct.includes('application/json')) {
        return await request.json();
    }
    // form-urlencoded (native POST) or multipart (fetch FormData)
    const form = await request.formData();
    const obj = {};
    for (const [k, v] of form.entries()) {
        obj[k] = typeof v === 'string' ? v : '';
    }
    return obj;
}

// FormSubmit control fields are fine to forward, but bridge-only markers aren't.
function stripControlFields(data) {
    const out = {};
    for (const k in data) {
        if (k === '_source') continue;
        out[k] = data[k];
    }
    return out;
}

function corsHeaders(origin, env) {
    const allowed = String(env.ALLOWED_ORIGIN || '')
        .split(',')
        .map(function (s) { return s.trim(); })
        .filter(Boolean);
    let allow = '*';
    if (allowed.length) {
        allow = allowed.indexOf(origin) !== -1 ? origin : allowed[0];
    }
    return {
        'Access-Control-Allow-Origin': allow,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept',
        Vary: 'Origin'
    };
}

function json(obj, status, cors) {
    return new Response(JSON.stringify(obj), {
        status: status,
        headers: Object.assign({ 'Content-Type': 'application/json' }, cors)
    });
}

// JSON for AJAX callers; 302-to-_next for native form posts (FormSubmit parity).
function finish(wantsJson, ok, message, status, cors, next) {
    if (wantsJson) {
        return json({ success: ok, message: message }, status, cors);
    }
    if (ok && next) {
        return new Response(null, { status: 302, headers: Object.assign({ Location: next }, cors) });
    }
    return new Response(ok ? 'OK' : message, { status: status, headers: cors });
}
