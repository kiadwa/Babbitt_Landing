/* Babbitt landing — pricing copy data
 *
 * Authored editorially in:
 *   Babbitt OS/Departments/MARKETING_BRAND/MKT-P010 - Landing V2/finalcopy.md
 *
 * Mirrored here as the runtime source of truth for the pricing builder
 * (`#pricingBuilder` in index.html, wired in script.js).
 *
 * When the .md changes, update this file in the same PR.
 */

(function () {
    'use strict';

    var TIER2_SHARED = [
        'Agentic Foreman AI',
        'AI Plan reader + estimates',
        'Customer follow-up automations',
        'Weather warnings + AI rescheduling',
        'Franchisee + multi-location accounts',
        'Business accounting',
        'Networking + marketing dashboards',
        'In-app advertising portal',
        'Babbitt-native P2P + escrow',
        'Cross-user m² benchmark'
    ];

    window.BABBITT_PRICING_COPY = {
        /* Short feature labels per account, per tier — for the pricing-builder boxes.
         * Tier 2 is universal across ICPs (see finalcopy.md §"Tier 2"). */
        features: {
            trades: {
                free: [
                    'Basic job management',
                    '2 properties',
                    'Business registration',
                    'Basic AI features',
                    '12 confirmed jobs / year'
                ],
                tier1: [
                    'Unlimited jobs',
                    'Foreman AI on every job',
                    'Code Checker · 25 q/mo',
                    'P2P payments via Stripe',
                    'Full Business page',
                    'Custom branding everywhere',
                    'Sub-contractor + hire pipeline',
                    'Fleet register with GVM',
                    'AI-drafted articles + public profile',
                    'Per-job chat + Inbox'
                ],
                tier2: TIER2_SHARED
            },
            propertyManager: {
                free: [
                    'Basic property management',
                    '2 properties',
                    'Tenant invitations',
                    'Basic AI features',
                    'Quote approvals'
                ],
                tier1: [
                    'Unlimited portfolio scale',
                    'Foreman daily portfolio briefings',
                    'Recurring maintenance packages',
                    'Budget actuals per property',
                    'Free tenant + owner invites',
                    'Full Business page',
                    'Saved trades agency-wide',
                    'Compliance log per address',
                    'Agency profile + AI articles',
                    'Per-property chat that fans out'
                ],
                tier2: TIER2_SHARED
            },
            propertyOwner: {
                free: [
                    'Basic property management',
                    '2 properties free',
                    'Job tracking',
                    'Basic AI features',
                    'Project planning'
                ],
                tier1: [
                    'Properties beyond 2',
                    'Foreman owner briefings',
                    'P2P payments to trades',
                    'Full Business page',
                    'Project planning + moodboards',
                    'Maintenance schedule per address',
                    'Connect your trade network',
                    'Pre-sale record handoff',
                    'Public profile per address',
                    'Per-property chat'
                ],
                tier2: TIER2_SHARED
            },
            strata: {
                free: [
                    'Basic scheme management',
                    '4 lots free (chair’s account)',
                    'Common works tracking',
                    'Basic AI features',
                    'Lot register'
                ],
                tier1: [
                    'Unlimited lots in scheme',
                    'Foreman scheme briefings',
                    'Common works workflow',
                    'Live voting on motions',
                    'Recurring maintenance packages',
                    'Scheme noticeboard + access notes',
                    'Pending-scheme auto-onboard',
                    'Document library',
                    'Lot-owner network + newsletter',
                    'Per-motion + per-works chat'
                ],
                tier2: TIER2_SHARED
            },
            supplier: {
                free: [
                    'Basic order management',
                    'Receive RFQs',
                    'Customer accounts',
                    'Basic AI features',
                    'Quote drafting'
                ],
                tier1: [
                    'Full Pack-Ship-Fleet dashboards',
                    'Foreman AI on the order queue',
                    'Dispatch + run sheet, GVM-aware',
                    'Free driver + warehouse logins',
                    'Customer accounts CRM',
                    'Advanced marketplace offers',
                    'P2P payments + reconciliation',
                    'Compliance hub',
                    'Local opportunity radar + AI articles',
                    'Per-order chat threaded'
                ],
                tier2: TIER2_SHARED
            }
        },

        /* Property sub-types shown in the picker popup. */
        propertyTypes: [
            {
                id: 'propertyManager',
                label: 'Manager',
                icon: 'fa-building',
                description: 'Agency, in-house, residential or commercial. Run a portfolio of properties.'
            },
            {
                id: 'propertyOwner',
                label: 'Owner',
                icon: 'fa-house',
                description: 'Investor, landlord or owner-occupier. Keep the record against your home.'
            },
            {
                id: 'strata',
                label: 'Strata',
                icon: 'fa-users',
                description: 'Body corporate, owners corporation or committee. Common works and lot votes.'
            }
        ],

        /* Setup-fee copy per account. Used by the one-time setup modal.
         * Triggered when an account with setupFees registered in PRICING.accountModifiers
         * (script.js) is the active account. */
        setupFees: {
            supplier: {
                eyebrow: 'Supplier · one-time setup',
                title: 'Catalogue setup · $200',
                lead: 'We connect your product catalogue to the Babbitt trade-code system. That gets you:',
                bullets: [
                    'Guided AI migration of your stock data',
                    'Automatic BTC code sync for accurate quoting',
                    'BoQs arrive pre-mapped against your catalogue',
                    'Faster project matches with trades and property teams'
                ],
                note: 'One-time fee. After setup, all sync updates are automatic.'
            },
            propertyManager: {
                eyebrow: 'Property Manager · one-time setup',
                title: 'Portfolio bulk upload · $200',
                lead: 'We bulk-load your entire portfolio against the Babbitt property model. That gets you:',
                bullets: [
                    'Guided AI migration of your property data',
                    'Owner and tenant invitations sent against every property',
                    'Existing trades and contractor lists carried across',
                    'Faster first-month dispatch with the Babbitt 60 network'
                ],
                note: 'One-time fee. New properties added thereafter are included in your plan.'
            },
            strata: {
                eyebrow: 'Strata · one-time setup',
                title: 'Lots bulk upload · $200',
                lead: 'We bulk-load the scheme’s lots and seed lot-owner invitations. That gets you:',
                bullets: [
                    'Guided AI migration of the scheme’s lot register',
                    'Lot-owner email invitations sent at onboarding',
                    'Pending-scheme auto-resolution when lot owners join',
                    'Strata documents pre-loaded into the document library'
                ],
                note: 'One-time fee. New lots and motions thereafter are included in your plan.'
            }
        }
    };
})();
