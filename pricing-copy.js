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

    window.BABBITT_PRICING_COPY = {
        /* Short feature labels per account, per tier — for the pricing-builder boxes. */
        features: {
            trades: {
                free: [
                    'Job listing',
                    'Job finding',
                    'Job management',
                    'Personalize Profile',
                    'Networking, Community and Chat features',
                    'Basic AI-powered overview report',
                    '12 confirmed jobs per year'
                ],
                tier1: [
                    '10GB storage',
                    'All Free tier features included',
                    'CodeChecker included',
                    'Ads removed',
                    'P2P Payments with Stripe*',
                    'Automatic quote and invoice generation',
                    'Advanced AI assistant in your workflow',
                    'Team and staff management',
                    'Sub-contractor and staff hiring',
                    'AI-drafted SEO articles',
                    'Custom Branding',
                    'Fleet management',
                    'Per-job chat + inbox',
                    'Document upload and image upload',
                    '[*Stripe fees apply]'
                ],
                tier2: [
                    '100 GB storage',
                    'All Tier 1 features included',
                    'Agentic AI in your workflow',
                    'Dedicated customer support',
                    'No fees per transaction in app',
                    'Prioritized at job bidding',
                    'Franchisee + multi-location accounts',
                    'Business accounting',
                    'Networking + marketing dashboards'
                ]
            },
            propertyManager: {
                free: [
                    'Job listing (3 jobs/year)',
                    '2 Property records',
                    'Tenant Management',
                    'Owner Management',
                    'Real-time job tracking',
                    'Basic AI-powered overview report',
                    'Quote approvals'
                ],
                tier1: [
                    '10GB storage',
                    'Unlimited portfolio scale',
                    'All Free tier features included',
                    'Ads removed',
                    'Advanced AI assistant in your workflow',
                    'Link lot to strata notices',
                    'Pre-sale record handoff',
                    'Document upload and image upload',
                    'In-depth property record and condition overview',
                    'Per-property chat',
                    'Agency-wide trades list',
                    'Self serve tenant inspections',
                    'Agency profile',
                    'AI-drafted SEO articles'
                ],
                tier2: [
                    '100GB storage',
                    'All Tier 1 features included',
                    'No in-app payment fee',
                    '10 properties and beyond',
                    'Unlimited tenant slots per property',
                    'Automatic quote and invoice generation',
                    'Schedule rental payments in app'
                ]
            },
            propertyOwner: {
                free: [
                    'Job listing',
                    '2 Properties',
                    'Verify your property on Babbitt',
                    'Real-time job tracking',
                    'Basic AI-powered overview report',
                    'Connect your strata scheme or manager',
                    'Maintenance schedule',
                    'Project planning'
                ],
                tier1: [
                    '10GB storage',
                    'All Free tier features included',
                    'Ads removed',
                    'Advanced AI assistant in your workflow',
                    'Manage up to 10 properties',
                    'Pre-sale record handoff',
                    'Document upload and image upload',
                    'In-depth property record and condition overview',
                    'Per-property chat',
                    'Local opportunity radar',
                    'AI-drafted SEO articles',
                    'Project moodboards',
                    'Foreman owner briefings',
                    'Compliance log per address'
                ],
                tier2: [
                    '100GB storage',
                    'All Tier 1 features included',
                    'No in-app payment fee',
                    '10 properties and beyond',
                    'Schedule rental payments in app'
                ]
            },
            strata: {
                free: [
                    'Job listing',
                    '2 lot schemes',
                    'Real-time job tracking',
                    'Full management features',
                    'Basic AI-powered overview report',
                    'Scheme noticeboard + access notes',
                    'Lot-owner noticeboard in networking'
                ],
                tier1: [
                    '10GB storage',
                    'Unlimited lots in scheme',
                    'All Free tier features included',
                    'Ads removed',
                    'Advanced AI assistant in your workflow',
                    'Bulk upload lots',
                    'Foreman AI scheme briefings',
                    'Document upload and image upload',
                    'In-depth property record and condition overview',
                    'Live voting on motions',
                    'Per-property chat',
                    'Agency-wide trades list',
                    'Self serve tenant inspections',
                    'Agency profile',
                    'AI-drafted SEO articles',
                    'Document library',
                    'Per-motion + per-works chat'
                ],
                tier2: [
                    '100GB storage',
                    'Agentic Foreman AI',
                    'All Tier 1 features included',
                    'And much more'
                ]
            },
            supplier: {
                free: [
                    'Job/Order listing',
                    'Job/Order finding',
                    'Order management, quoting, invoice printing',
                    'Personalize Profile',
                    'Networking, Community and Chat features',
                    'Basic AI-powered overview',
                    '12 confirmed orders per year'
                ],
                tier1: [
                    '10GB storage',
                    'All Free tier features included',
                    'CodeChecker included',
                    'Catalogue setup',
                    'Ads removed',
                    'P2P Payments with Stripe*',
                    'Automatic quote and invoice generation',
                    'Advanced AI assistant in your workflow',
                    'Team and staff management',
                    'Sub-contractor and hiring',
                    'Route planning and digital con-notes',
                    'AI-drafted SEO articles',
                    'Per-order chat + inbox',
                    'Document upload and image upload',
                    '[*Stripe fees apply]'
                ],
                tier2: [
                    '100GB storage',
                    'All Tier 1 features included',
                    'Inventory management',
                    'Unlimited team and staff management',
                    'Real-time delivery tracking',
                    'No transaction fee'
                ]
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
