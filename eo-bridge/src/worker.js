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

/* ── Email Octopus 1.6: add the contact to a list ── */
async function subscribe(env, listId, email, data, source, laneValue) {
    // Keys MUST match the list's EmailOctopus merge tags EXACTLY. EO generates
    // these from the field label (strips underscores, capitalises first letter
    // only) and they are case-sensitive — see the list's Settings -> Fields.
    const fields = {
        FirstName: data.firstName || '',
        LastName: data.lastName || '',
        Icplane: laneValue || '',
        Stage: 'cold',
        Source: source
    };
    const company = data.company || data.businessName || '';
    if (company) fields.CompanyName = company;
    // Pricing snapshot (early-bird form) -> EO merge tags.
    const PLAN_FIELDS = {
        plan_account: 'Planaccount',
        plan_tier: 'Plantier',
        plan_billing: 'Planbilling',
        plan_total: 'Plantotal'
    };
    Object.keys(PLAN_FIELDS).forEach(function (k) {
        if (data[k]) fields[PLAN_FIELDS[k]] = String(data[k]);
    });

    const tags = ['source:' + source, 'lane:' + (laneValue || 'unknown')];
    const url = 'https://emailoctopus.com/api/1.6/lists/' + listId + '/contacts';

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            api_key: env.EO_API_KEY,
            email_address: email,
            fields: fields,
            tags: tags,
            status: 'SUBSCRIBED'
        })
    });

    if (res.ok) return true;

    const err = await res.json().catch(function () { return {}; });
    const code = err && err.error && err.error.code;
    // Already on the list — treat as success (we don't overwrite their fields).
    if (code === 'MEMBER_EXISTS_WITH_EMAIL_ADDRESS') return true;
    throw new Error((err && err.error && err.error.message) || ('Email Octopus HTTP ' + res.status));
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
