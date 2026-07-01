# CutOutStuff — Implementation Plan

How to turn the design prototype in `designs/` into a production system. Written for the implementing engineer(s); read alongside `README.md` (design spec) in this folder.

---

## 1. Recommended stack

| Layer | Recommendation | Why |
|---|---|---|
| App framework | **Next.js (App Router) + TypeScript** | SSR for the marketing/storefront pages (SEO + private slugs), API routes/server actions for the dashboard, one deploy |
| Database | **Postgres** (Supabase, Neon, or RDS) + **Prisma** | Relational fits orders/campaigns/payouts; migrations from day one |
| Payments | **Stripe** — Payment Element + webhooks, **Stripe Connect (Express)** for creator payouts | The checkout is already designed as a Payment Element; Connect solves the revenue split, payouts, and tax forms (1099s) natively |
| Email | **Resend** or **Postmark** + React Email | The 8 designed templates port 1:1 to React Email components |
| File storage | **S3 or Cloudflare R2** (private buckets, signed URLs) | Customer uploads, proofs, print-ready CMYK files |
| Auth | **Auth.js** or **Clerk**, role claims: `creator`, `staff` | Two separate login surfaces as designed; buyers stay guest |
| Hosting | Vercel (app) + managed Postgres | Boring and reliable |
| Background jobs | **Inngest** or Trigger.dev (or a simple queue table + cron) | Order routing emails, proof reminders, webhook retries |

Charts: keep **Recharts** (already used in the prototype, config documented in README).

---

## 2. Data model (core tables)

```
creators        id, display_name, slug, support_email, stripe_connect_id, status
applications    id, name, email, socials, audience_size, concept, launch_pref,
                country, rights_confirmed, status(new|approved|declined), decided_by, decided_at
campaigns       id, creator_id, slug, title, description, status(draft|live|paused),
                partner_id (default fulfillment), packaging_default, created_by
products        id, campaign_id, title, base_price_cents, sensitive(bool),
                sizes jsonb [{label, sub, price_cents}], image_key, sort
partners        id, name, routing_email, city, capabilities, turnaround, status(active|pending)
orders          id, number(COS-xxxxx), campaign_id, email, shipping_address jsonb,
                packaging(plain|standard), status(received|proof_pending|proof_approved|
                in_production|packed|shipped|delivered|cancelled),
                stripe_payment_intent, totals jsonb, tracking_number, partner_id
order_items     id, order_id, product_id, size_label, unit_cents, qty
proofs          id, order_id, file_key, version, status(pending|approved|changes_requested),
                change_notes, decided_at
claims          id, order_id (verified via email match), type, description,
                photo_keys[], status(open|approved|denied), resolution
files           id, order_id, kind(original|edited|proof|print_ready|fabrication), key, status
routing_events  id, order_id, partner_id, kind(packet_sent|confirmed|label|tracking|error),
                payload jsonb, created_at
payouts         id, creator_id, period, gross_cents, net_cents, status, stripe_transfer_id
tickets         id, order_id?, creator_id?, type, subject, status, thread jsonb
```

**Order status** maps exactly to the 6-step tracker in the design: received → artwork approved (proof_approved) → in production → packed → shipped → delivered.

---

## 3. Route map (design → production)

| Design page (hash) | Production route | Notes |
|---|---|---|
| `#home #how #quality #gallery #faq #contact` | `/`, `/how-it-works`, `/quality`, `/gallery`, `/faq`, `/contact` | Static/SSR |
| `#program #apply` | `/creators`, `/creators/apply` | Not in main nav; `noindex` optional |
| `#store` | `/c/[slug]` | **`noindex,nofollow`**, no sitemap entry — private by link |
| `#product` | `/c/[slug]/p/[product]` | |
| `#cart #checkout #confirm` | `/cart`, `/checkout`, `/orders/[number]/confirmed` | |
| `#tracking` | `/track` | Gated: order number + email |
| `#proof` | `/orders/[number]/proof?token=…` | Tokenized link from email — no login needed |
| `#claim` | `/support/claim` | |
| Legal pages | `/legal/*` | **Have counsel review before launch** |
| Dashboard | `dash.cutoutstuff.com` or `/dashboard` | Auth-gated, role-routed |

---

## 4. Build phases

### Phase 1 — Foundation (week 1)
- Repo, CI, Postgres + Prisma schema above, Auth with roles
- Port design tokens (README §Design Tokens) into Tailwind config or CSS variables — **single source of truth**
- Rebuild the shared shell: header/footer/nav, button + pill + input primitives with the hover/focus states from the prototype

### Phase 2 — Public site + storefronts (weeks 1–2)
- Static marketing pages from the designs (copy is final — lift it verbatim)
- Storefront `/c/[slug]`: products grid; **sensitive blur** as a client component (CSS `filter: blur(22px)` + reveal state, exactly as prototyped); viewer-discretion interstitial stored in `sessionStorage`
- Never leak sensitive images into OG tags/link previews for flagged products

### Phase 3 — Cart + Stripe checkout (week 2–3) ⭐ critical path
- Cart in localStorage (guest) with the designed cart page
- Checkout: **Stripe Payment Element** + Express Checkout Element (Apple Pay/Link render automatically), shipping address collected via Stripe's Address Element
- Create PaymentIntent server-side with metadata: `campaign_id`, items, packaging preference
- **Webhook `payment_intent.succeeded`** → create order (number `COS-#####`), send *Order confirmation* email, enqueue proof job. Never trust the client for order creation.
- Stripe Radar defaults on; statement descriptor: `CUTOUTSTUFF` (neutral — matches plain-packaging promise)

### Phase 4 — Proof pipeline (week 3)
- Staff uploads proof in dashboard (files table) → *Proof ready* email with tokenized `/orders/[n]/proof` link
- Approve → status `proof_approved`, production job fires; Request changes → notes stored, ticket opened, status stays `proof_pending`
- Approval is final: lock the proof record

### Phase 5 — Fulfillment routing (weeks 3–4) ⭐ the automation you asked for
- Partners CRUD (the designed directory)
- On `proof_approved`: background job builds the **order packet** (designed email: spec, ship-to, signed print-file URL valid ~7 days, packaging, service level) → sends to `partner.routing_email` → logs `routing_events.packet_sent`
- Packet contains two tokenized links for the facility: **Confirm** (marks in_production) and **Upload tracking** (marks shipped, stores tracking, triggers *Shipped* email to buyer)
- Retry w/ exponential backoff; alert staff on failure (the "Error" status in the design); "Resend packet" button = re-enqueue

### Phase 6 — Dashboards (weeks 4–5)
- Staff: applications queue (approve → *Application approved* email with onboarding link), campaign builder wizard (writes campaigns/products incl. sensitive flags, partner assignment), order management (server-side pagination — the design's 25/page pattern), file pipeline, support
- Creator: overview KPIs (materialized daily + live order count), orders, assets, payouts, onboarding wizard
- Global search: one indexed query across orders/campaigns → orders table with query applied (as designed)

### Phase 7 — Payouts, claims, hardening (weeks 5–6)
- **Stripe Connect Express**: onboard creators during onboarding wizard; monthly transfer job computes split from paid orders minus refunds; dashboard payouts page reads from transfers
- Claims: form → `claims` row + *Claim received* email; staff approval spawns a zero-cost replacement order through the same fulfillment pipeline
- Track gate: lookup by `(order_number, lower(email))`, rate-limited
- Monitoring (Sentry), backups, rate limits on all public forms, image moderation queue for creator uploads (rights policy enforcement), legal review of the five policy pages + Creator Agreement

---

## 5. Email events (all 8 designed templates)

| Trigger | Template |
|---|---|
| `payment_intent.succeeded` | Order confirmation |
| Proof uploaded | Proof ready |
| Proof approved | (to facility) Fulfillment order packet |
| Facility uploads tracking | Shipping notification |
| Monthly payout transfer | Payout notice |
| Application approved | Application approved |
| Claim submitted | Claim received |
| Reset requested | Password reset |

Log every send in an `email_events` table; make the facility packet idempotent per order.

---

## 6. Gotchas & decisions to make early

1. **Connect vs. manual payouts** — Connect Express is more setup now, but removes tax-form, split, and refund-clawback pain permanently. Strongly recommended.
2. **Sensitive content policy** — the blur/interstitial is UX; you still need a written content standard (what's allowed at all) enforced in the staff review step. The Content & Image Rights policy is the anchor.
3. **Print file specs** — agree with partners on one spec (CMYK PDF, 300dpi, cut path layer, bleed). Validate uploads against it before proofs.
4. **Refund window vs. production start** — cancelation allowed until proof approval; after that, sales final (matches Terms + proof screen copy).
5. **Slug collisions & renames** — slugs are permanent once live (fans hold the links); add redirects table if you ever must change one.
6. **Chargebacks** — evidence kit = approved proof + tracking + policy screenshots; automate via Stripe's dispute API.

## 7. Rough sizing

One experienced full-stack engineer: **~6 weeks to a launchable MVP** (through Phase 5), payouts + hardening in weeks 6–8. Two engineers roughly halves it. The design work — every screen, state, email, and token — is done; this plan is purely wiring.
