# Handoff: CutOutStuff — Public Site, Creator/Admin Dashboard, Emails

## Overview
CutOutStuff is a premium life-size cutout printing brand with a **neutral public storefront** and a **private creator-campaign business model**. This package covers the full MVP surface:

1. **Public marketing site** — homepage, how-it-works, quality, gallery, FAQ, contact, creator program (private), creator application, creator campaign storefront + product page, checkout, order confirmation, order tracking, and all legal/policy pages.
2. **Dashboard app** — a creator workspace (campaign overview, orders, assets, payouts, onboarding, settings) and an admin console (dashboard, campaigns, campaign builder, order management, file management, fabrication routing, support), behind an auth layer.
3. **Transactional emails** — order confirmation, shipping notification, creator payout notice.
4. **Style guide** — the single source of truth for tokens, type, components, and voice.

**Brand positioning (keep this exact tone):** lead with the emotional job, not the fabrication. The one-liner: *"CutOutStuff turns pets, people, creators, mascots, and characters into premium life-size cutouts, so anyone worth celebrating can actually be in the room."* Public site headline: "Bring them into the room." (eyebrow: "Presence, printed"; quality tagline: "Built to be displayed, not thrown away."). Occasion-led copy throughout ("Make your dog the guest of honor", "Surprise someone with themselves", "Bring someone who can't be there"). The creator area sells fan presence, not merch fulfillment: "Let fans put you in their room" — framed as collector-grade, creator-approved collectibles (limited drops, private links, plain shipping). Campaign pages read like official merch ("Official life-size cutout of [Creator]"). **Never** use language like "monetize fans", "super-fans", "adult creator", "payment protection", "stigma", "B2B2C". Fans may be referred to as "audience", "supporters", "customers", or "collectors".

## About the Design Files
The files in `designs/` are **design references created in HTML** — prototypes that show the intended look, layout, and behavior. They are **not production code to copy directly**. They are authored as "Design Components" (a streaming HTML prototyping format); the `.dc.html` wrapper, `support.js`, and the `{{ }}` template holes are prototype-runtime scaffolding, **not** part of your target stack.

Your task is to **recreate these designs in the target codebase's environment** using its established patterns, component library, and conventions. If there is no codebase yet, a modern React + TypeScript stack (Next.js or Vite) with a component library and a charting lib is a natural fit, but any framework can reproduce these layouts — they are plain flex/grid with inline styles.

Recommended real architecture (from the product brief):
- Public pages are static/SSR routes.
- Creator storefronts live at private URLs (e.g. `/c/:slug`), public-to-anyone-with-the-link but not indexed or linked from main nav.
- Dashboard is an authenticated SPA/app with two roles: `creator` and `admin` (staff). These are **separate logins in production** — the in-prototype role toggle is only a review convenience and must not ship.

## Fidelity
**High-fidelity (hifi).** Colors, typography, spacing, radii, and interactions are final. Recreate the UI pixel-accurately using the codebase's libraries. All hex values, font sizes, and spacing below are exact and pulled from the source files.

---

## Design Tokens

### Color
| Token | Hex | Use |
|---|---|---|
| Canvas | `#F5F6F7` | Page background |
| Surface | `#FBFCFC` | Cards, panels, footer |
| Panel | `#EEF0F1` / `#EEF1F2` | Alternating sections |
| Ink | `#17191C` | Primary text, primary buttons, dark sections |
| Muted ink | `#565C62` | Body copy |
| Soft ink | `#71767C` | Secondary text |
| Faint ink | `#9AA0A6` | Labels, metadata, placeholders |
| Petrol-slate (ACCENT) | `#345B6B` | Links, active states, chart series, small emphasis. The **only** accent. |
| Petrol tint bg | `#E7EFF2` | Info panels, "in production" pill bg |
| Petrol light (on dark) | `#8FB4C4` | Accent text on ink backgrounds |
| Hairline | `rgba(23,25,28,0.09)` | Borders, grid seams (also `0.08`, `0.1`, `0.12`, `0.14` for varying strength) |

**Status colors (pill = text color on tinted bg, `border-radius: 100px`, Space Mono 11px/700):**
| Meaning | Text | Background | Applies to |
|---|---|---|---|
| Success | `#2E7D5B` | `#EAF4EF` | Live, Delivered, Paid, Approved, Done, Resolved |
| In-progress | `#345B6B` | `#E7EFF2` | In production, Packed, Shipped, Ready, Sent, New, Open |
| Waiting | `#B0791F` | `#F6EFE0` | Pending, Queued, Review, Waiting, Refund req. |
| Error | `#B4442E` | `#F6E4E0` | Error, Failed |
| Neutral | `#6B7076` | `#EDEFF1` | Draft, Paused |

### Typography
- **Display / UI:** `Schibsted Grotesk` (weights 400/500/600/700). Google Fonts.
- **Mono / labels:** `Space Mono` (400/700). Used for eyebrow labels, metadata, IDs, table headers, chart ticks.
- Scale (marketing): H1 `clamp(40px,6.5vw,80px)` weight 500, letter-spacing `-0.03em`, line-height ~1.0. H2 `clamp(28px,4vw,46px)` weight 500 `-0.02em`. H3 19–20px/600. Body 15–17px/1.6, color muted ink. Eyebrow label: Space Mono 12px, `letter-spacing:0.16em`, uppercase, accent color.
- Dashboard scale: page title 18px/600; card metric numbers 32px/600 `-0.02em`; card labels Space Mono 11px `0.06em` uppercase faint-ink; body 14–15px.

### Spacing & layout
- Container max-width **1200px** (marketing), **1160px** (dashboard content). Side gutter `clamp(20px,5vw,40px)`.
- Section vertical padding `clamp(56px,8vw,110px)`.
- Card grids: `1px` gap over a hairline background to create crisp seams; cards are `#FBFCFC`.
- Border radius: **2px** on controls/buttons/inputs, **3px** on cards/panels, **100px** on status pills, **50%** on avatars. Nothing exceeds 4px except pills/avatars.
- Shadows: near-none. Only subtle `0 1px 2px rgba(0,0,0,0.08)` on the segmented toggle, `0 4px 16px rgba(23,25,28,0.10)` on chart tooltips. The aesthetic is flat + hairline borders, not shadowed.
- Focus ring (a11y): `outline: 2px solid #345B6B; outline-offset: 2–3px` on `:focus-visible` for all interactive elements.

### Motion
- Page/section enter: `fadeUp` — translateY(10px)→0 over .5s ease.
- Sign-in loading spinner: 38px ring, 3px border, top border accent, `spin .8s linear infinite`.
- Respect `prefers-reduced-motion` (the homepage shader freezes; honor it globally).

---

## Screens / Views

### PUBLIC MARKETING SITE (`designs/CutOutStuff.dc.html`)
Single-page client router in the prototype; in production these are separate routes. Shared sticky header (blurred `rgba(245,246,247,0.82)`, 70px tall, hairline bottom border) + footer (4-column link grid on `#FBFCFC`).

- **Homepage** — Hero (centered, eyebrow "LIFE-SIZE CUTOUTS", H1 "Life-size cutouts made simple.", subhead, two CTAs: primary "Start a Project" ink button, secondary "See How It Works" outline). Below: a 5-tile example grid (3:4 aspect, striped placeholders labeled dog / grandmother / stylish man / fashion creator / mascot; alternating tiles nudged down `translateY` for rhythm). Trust strip (5 mono items: Life-size printing · Precision cutting · Premium materials · Careful packaging · Ships worldwide). How-It-Works preview (4 numbered cards in a seamed grid). Quality band (`#EEF0F1`, text + placeholder image). Use-cases grid (8 seamed cards). Closing CTA on ink background.
  - **Homepage-only detail:** the How-It-Works section has a subtle animated **WebGL shader background** (cool grey + faint petrol flowing fbm noise) with a CSS mesh-gradient fallback and reduced-motion freeze. Content sits in a `z-index:1` layer above it. In production this can be a lightweight shader/canvas or a static mesh gradient — it's decorative.
- **How It Works** — hero + two cards (individual vs campaign) + a 4-step numbered list (`01`–`04`) + closing CTA.
- **Quality / Materials** — hero + sticky placeholder image beside a list of 7 material/finish points + a dark stat band (Scale 24in–7ft, Finish matte/anti-glare, Stand included, Durability indoor/long-term).
- **Gallery** — filter chips (All, Pets, People, Creators, Events, Retail, Gifts, Characters) that filter a CSS-columns masonry of striped placeholders. Active chip = ink fill.
- **FAQ** — `<details>` accordion, 9 questions (exact copy in file). Mono "+" markers.
- **Contact / Start a Project** — intake form (Name, Email, Project type, Order type single/campaign, Estimated quantity, Shipping destination, Upload/link, Notes) → on submit shows a success confirmation card. CTA "Request a Quote".
- **Creator Program** (private; reached via footer only) — dark hero "Turn your most memorable image into a premium physical collectible.", 6 benefit cards, 6-step how-it-works, CTA "Apply to Launch".
- **Creator Application** — qualifying form (Creator name, Email, Social links, Audience size, Expected demand, Concept, Launch date, Country, rights-confirmation checkbox, Notes) → success state.
- **Creator Campaign storefront** — shows a private URL breadcrumb (`cutoutstuff.com/c/ava-mercer`), product hero with "Official creator-approved" badge, H1 "Official life-size cutout of [Name].", price, Order Now, trust row, spec strip (Height/Material/Finish/Stand/Ships in), and a "Good to know" FAQ. Fan-safe — reads like official merch.
- **Product Detail** — image + thumbnails, size selector (Tabletop $59 / Life-size $149 / Grand $189 — selection drives price), quantity stepper, "Checkout — $X" button, description. Prices update live.
- **Checkout** — two-column: left = Contact / Shipping address / Shipping method (Standard $19 5–8d, Express $39 2–3d) / Payment fields; right = sticky order summary with live subtotal/shipping/total, discount field, "plain packaging" toggle, made-to-order terms checkbox, "Place Order · $X".
- **Order Confirmation** — success check, order #COS-40213, item summary, est. production/shipping, track + home CTAs.
- **Order Tracking** — order-number input, then a 6-step status stepper (Order received → Artwork approved → In production → Packed → Shipped → Delivered) with done/active/upcoming states.
- **Legal pages** — Privacy, Terms, Shipping, Return/Replacement, Content & Image Rights. Each is a max-760px prose column with mono "Last updated" label + H2 sections. **Content & Image Rights is business-critical** (submitter must own/control rights; prohibited: unauthorized celebrities, copyrighted characters, minors in inappropriate context, non-consensual/revenge content, impersonation, illegal material; company may reject). Copy is drafted, not lawyer-reviewed — flag for legal review.

**Responsive:** below **760px** the desktop nav (`.cos-desktop-nav`) hides and a hamburger button (`.cos-burger`) reveals a stacked mobile menu (state `menuOpen`, closes on navigate). All layouts use `clamp()` and `auto-fit` grids and reflow to one column on mobile.

### DASHBOARD (`designs/CutOutStuff Dashboard.dc.html`)
250px sticky left sidebar (logo, role label, **prototype-only role toggle**, nav list with active dot, account block + Sign out + Back to site) + sticky 64px top bar (page title, search, avatar) + content area (max 1160px).

**Auth layer (shown when not signed in — no sidebar):** centered 420px column.
- **Chooser** — "I'm a creator" / "Staff login" option buttons.
- **Creator login / Staff login** — email + password, "Forgot password?", Sign in (→ 850ms loading spinner → app).
- **Reset** — email → "Send reset link" → **reset-sent** confirmation ("Check your email").

**Creator workspace:**
- **Campaign Overview** — header (campaign name, LIVE pill, live URL, launched date). KPI cards: Orders 142 (▲18%), Revenue $21,340 (▲22%), Units sold 156, Conversion 4.8%. Bar chart "Orders — last 8 weeks" (Recharts). "Recent orders" list (clickable → order detail). **Empty-state** variant ("No orders yet") shown via the preview toggle — build this as the true zero-data state.
- **Orders** — toolbar (search by order/item, status filter) + paginated table (25/page, "Showing 26–50 of 142", Prev/Next). Rows clickable → order detail. Scales to any volume via pagination — in production use server-side pagination.
- **Assets** — 3 cards: uploaded image (RECEIVED), approved proof (APPROVED), print-ready file (READY).
- **Payouts** — dark "Available balance" card + Paid/Pending cards, next-payout banner, payout history table.
- **Onboarding** — 4-step wizard (Basics → Assets → Pricing & rights → Review) with step indicator, Back/Continue, rights-confirmation checkbox, and Submit on step 4.
- **Settings** — campaign details form + notification toggles + Save.

**Admin console:**
- **Dashboard** — KPI cards (Active campaigns 18, Orders·30d 612, Revenue·30d $98,420, Open support 7), production pipeline strip, Revenue area chart (Recharts), top-campaigns list, support-issues list.
- **Campaigns** — table (Campaign, URL, Orders, Status, Revenue); rows → campaign detail. "+ New campaign".
- **Campaign Builder** — form: basics (creator name, private URL slug with `/c/` prefix, product title, description), image slots, pricing & rules (base price, inventory rule, shipping, status). Create / Save draft.
- **Order Management** — search + status filter + paginated table over **~2,437 sample orders / 98 pages** (Order, Campaign, Customer, Payment pill, Print-status pill, Partner, Tracking, Manage→detail).
- **File Management** — per-order matrix of stage pills (Original, Edited, Proof, Print-ready, Fabrication, Approval); rows → file detail.
- **Fabrication Routing** — table (Vendor, Order, File sent, Production pill, Shipping-label pill, Tracking, Errors).
- **Support** — ticket list (type tag, subject, customer, status pill, Open→detail).

**Detail views (drill-ins, replace content area with a Back button):**
- **Order detail** — header (mono ID + status pill + Replace/refund + Update status), fulfillment timeline (6-step, done/active states), Order card (product/qty/placed/total), Customer & campaign card (+ tracking if shipped).
- **Campaign detail** — name + status + URL, Orders/Revenue/Status stat cards, Edit / View orders.
- **Support ticket** — subject + status, customer/type meta, conversation thread (customer left/support right bubbles), reply box + Mark resolved / Send reply.
- **File detail** — proof preview + per-stage pipeline status list.

### EMAILS (`designs/CutOutStuff Emails.dc.html`)
Three 600px-wide, email-client-safe templates (centered card, ink header bar with logo, mono footer). Build as table-based responsive HTML emails in production.
- **Order confirmation** — "Your cutout is being prepared." + order summary + production/shipping estimates + Track button.
- **Shipping notification** — "Your cutout has shipped." + tracking number block + Track button.
- **Payout notice (creator)** — "Your payout is on the way." + dark amount block ($3,120) + period/units/arrival + dashboard button.

### STYLE GUIDE (`designs/CutOutStuff Style Guide.dc.html`)
Living reference: color swatches, type scale, buttons/controls, status colors, spacing/layout notes, and voice (do/avoid). Use it to keep any new screens consistent.

---

## Interactions & Behavior
- **Marketing router:** client-side page switch, scroll-to-top on navigate; in production use real routes.
- **Gallery filter:** category chips filter the masonry; active chip = ink fill; "All" shows everything.
- **Product pricing:** size selection sets unit price (59/149/189); quantity stepper (1–99); subtotal = unit×qty; checkout total = subtotal + shipping (Standard $19 / Express $39). All recompute live.
- **Forms:** Contact and Creator Application submit to an inline success card (no real backend). Wire to real endpoints.
- **Dashboard tables:** live search (resets to page 1), status dropdown filter, 25/page pagination with disabled Prev/Next at ends and a "Showing X–Y of N" count. Zero-results shows "No matching orders."
- **Detail drill-in:** clicking a row/Manage/Open sets a selected item and swaps the content area for the detail view; Back clears it. Sidebar keeps the parent nav item active.
- **Onboarding wizard:** step 1–4, Back hidden on step 1, Continue advances, step 4 shows Submit.
- **Auth:** sign-in triggers an 850ms loading state then reveals the app in the chosen role; Sign out returns to the chooser.
- **Loading / empty / error states:** loading skeleton/spinner on sign-in; empty state on the creator overview; zero-results in tables. Add error/retry states for real data fetches.
- **Responsive:** hamburger nav < 760px; all grids reflow to one column; dashboard sidebar should collapse to a drawer on mobile in production (prototype keeps it fixed).

## State Management
- **Marketing:** `page` (current route), `menuOpen`, product `size`/`qty`, checkout `shipMethod`/`discreet`, `galleryCat`, form-submitted booleans.
- **Dashboard:** `authed`, `authScreen`, `loading`, `role` (creator|admin — **two separate logins in prod**), `screen`, table `page`/`search`/`filter` (per creator & admin), `onbStep`, `emptyDemo` (prototype-only), `detail` ({kind, item}).
- **Data fetching (production):** server-side paginated/filtered order lists; campaign + KPI aggregates; payout ledger; file/proof pipeline status; support threads. Charts consume simple `[{label, value}]` arrays.

## Charts
The prototype uses **Recharts 3.9.1** (MIT), isolated in `designs/cos-charts.js` as a `<cos-chart>` web component rendered in its own React root. In your codebase, use Recharts (or your standard charting lib) directly as React components. Styling to match: series color `#345B6B`; bar radius `[3,3,0,0]`; horizontal-only gridlines at `rgba(23,25,28,0.08)`; Space Mono 10px axis ticks in `#9AA0A6`; area charts use a vertical gradient of the accent (0.28→0.02 opacity); custom tooltip = white card, hairline border, `0 4px 16px rgba(23,25,28,0.10)` shadow, Space Mono. Charts implemented: creator "Orders — last 8 weeks" (bar), admin "Revenue — last 8 weeks" (area).

## Assets
- **Fonts:** Schibsted Grotesk + Space Mono (Google Fonts).
- **Imagery:** all product/example imagery is intentionally **labeled striped placeholders** (`// dog`, `// fashion creator`, etc.) — swap in real photography. Aspect ratios noted per screen (mostly 3:4 for cutouts).
- **Icons:** minimal; uses text glyphs (→, ✓, +) and CSS shapes. No icon library required; use the codebase's icon set if desired.
- **No raster/brand assets** ship with this package — all visuals are CSS.

## Files
In `designs/`:
- `CutOutStuff.dc.html` — full public marketing site + storefront + checkout + legal.
- `CutOutStuff Dashboard.dc.html` — auth + creator workspace + admin console + detail views.
- `CutOutStuff Emails.dc.html` — 3 transactional email templates.
- `CutOutStuff Style Guide.dc.html` — tokens, type, components, voice.
- `cos-charts.js` — Recharts chart component reference (styling/config to match).
- `support.js` — prototype runtime only; **ignore for production** (it powers the `.dc.html` format, not your app).

To view any file, open it in a browser. The `{{ }}` holes and `<sc-if>`/`<sc-for>` tags are prototype templating — read them as conditionals/loops, not literal markup.

## Not in this package (engineering scope)
Database schema, real auth/session security & role permissions, payment processing (Stripe/PCI) + refunds, file-upload → print-file pipeline, fabrication-vendor + carrier integrations, email/SMS sending infra, analytics/monitoring, hosting/CI, and **legal review of the policy pages**. These are the real work between this prototype and launch.


## Addendum: screens added after the initial handoff
The design files include these later additions (same tokens and patterns as above):
- **Creator storefront** (`#store`), multi-cutout collection grid at the private URL, with a viewer-discretion interstitial and per-item sensitive-content blur (click to reveal, HIDE to re-blur). Sensitive flags are set per product in the admin wizard.
- **Cart** (`#cart`), line items with qty steppers/remove, header cart count; checkout summary renders the cart and totals from it.
- **Stripe-style checkout payment element**, express pay row (Apple Pay / Link), card element with brand badges, MM/YY + CVC, country + ZIP, "processed by Stripe" note. Implement with Stripe Payment Element in production.
- **Proof approval** (`#proof`), proof preview + spec, Approve (final) / Request changes flow with approved/changes states. Linked from order confirmation.
- **Damage claim** (`#claim`), order + email, issue type, photo slots, description; success state. Linked from footer "Report an issue".
- **Order tracking gate**, status shown only after order number + email are entered.
- **404 page** (`#notfound`), unknown hash routes here.
- **Creator Agreement** (`#agreement`), summary legal page; footer-linked.
- **Dashboard: Creator Applications queue** (admin), review cards with Approve (sends onboarding invite) / Decline.
- **Dashboard: Fulfillment Partners directory** (admin), partner cards + add form; feeds the Campaign Builder wizard.
- **Dashboard: Campaign Builder wizard** (4 steps: Creator & URL, Products with per-item sensitive toggle, Fulfillment routing pre-filled per partner, Review & launch).
- **Dashboard: global topbar search**, routes to the orders table with the query applied.
- **Order detail routing card**, shows the auto-emailed order packet (facility, routing email, SENT status, resend).
- **Emails**: fulfillment order packet (to facility), proof ready, claim received, application approved, password reset.
