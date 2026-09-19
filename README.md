# Prabhubhakti — Shopify → In-House Migration Roadmap

## Goal

Move `prabhubhakti.com` off Shopify without a risky big-bang cutover.

```
Shopify (today) → Shopify API + in-house frontend (current POC) → complete in-house
```

Current step: the basic technical proof (server → Shopify API pipeline) is done —
now **finishing the full Phase 1 feature list** below so this is a complete,
demo-able storefront, not just isolated proof pages.

For this POC, **this repo is the entire fullstack app** — UI, routing, and server
logic (TanStack Start server functions) all live here. Shopify is used purely as a
backend data API (Storefront GraphQL for catalog/cart), never as a rendering or
hosting layer. The only page we still hand off to Shopify is the hosted checkout
itself (see Checkout row below) — everything else the customer sees is served by
this app.

## What today's Shopify store actually does (from live site audit)

This matters because the POC has to cover these or the company will see it as a
downgrade, not a migration:

- Catalog: apparel (t-shirts, hoodies, sweatshirts, kurtis, kidswear) + silver jewelry
  (pendants, necklaces, bracelets, rings), deity-themed collections (Krishna, Hanuman,
  Shiva, Ram Mandir), Men/Women/Best Sellers navigation
- Cart with live updates, quick-add from listing pages
- Wishlist — **requires customer login** (so auth can't be deferred entirely, even
  in the POC)
- Product page upsells ("with this product also buy")
- Promotions: Buy-2-Get-1, collection-level % off, "sale ends today" urgency badges
- Newsletter signup
- Payments: UPI (all major providers) + **Cash on Delivery**
- Trust bar: free shipping over ₹499, easy returns, 100% original
- No blog today (so content/CMS is not a blocker)

## Architecture decisions for this phase

| Concern | Decision | Why |
|---|---|---|
| Framework | TanStack Start (already scaffolded) | already chosen, SSR + loaders fit a storefront |
| UI | shadcn/ui (already installed) | already chosen |
| Hosting | Dedicated Node.js process (GCloud — e.g. Compute Engine / Cloud Run always-on, not edge functions) | long-running process: no cold starts, no edge-runtime API restrictions, persistent connections allowed |
| Product/catalog data | Shopify **Storefront API** (GraphQL) | read-only, public, built for headless frontends, no Admin token exposure risk |
| Response caching | In-memory (or Redis alongside the Node process) server-side cache in front of Storefront API calls, TTL-based | on a dedicated server we can hold cache in the process itself (or a co-located Redis) instead of edge-specific Cache API/KV — simpler, and easy to swap for Redis later if we scale to multiple instances |
| Cart | Storefront API cart mutations, cart id in cookie | keeps cart state on Shopify, avoids rebuilding inventory/pricing logic |
| Checkout | Redirect to Shopify-hosted checkout (`cart.checkoutUrl`) for now | UPI + COD + tax + discount logic already work there; rebuilding a compliant checkout is its own project, not this POC |
| Customer accounts / wishlist | **Decided & built**: Shopify Customer Account API — hosted OAuth 2.0/PKCE login via a "Headless" sales channel, session held in TanStack Start's built-in encrypted session cookie (`useSession`/`updateSession`/`clearSession`), no DB | avoids the classic Storefront customer scopes' PII/plan restrictions, avoids building our own password flow, and needs no database — consistent with "Shopify API + in-house frontend, no DB yet" |
| Wishlist storage | Client-side only (`localStorage`, keyed by customer id) | proves "wishlist requires login" without syncing to Shopify — no metafield/Admin API scope needed for this POC |
| Auth (long-term, full in-house) | better-auth + Drizzle/Postgres, standard `pg`/`postgres.js` driver (no need for edge-compatible/HTTP drivers like Neon's serverless driver) | dedicated Node env supports normal TCP Postgres connections/pooling; only needed once checkout and accounts actually move off Shopify |
| Secrets | Storefront API public token client-side only; any Admin API token stays server-only (TanStack Start server functions) | Admin token must never reach the browser |
| Build/deploy target | TanStack Start's Nitro **node-server** preset | matches "dedicated Node process," produces a plain Node server we run under PM2/systemd/Docker on the GCloud instance |

Decision explicitly deferred: **better-auth vs Firebase vs Shopify-native accounts**
for the final in-house stage — not needed until Phase 2 (see below).

## Phases

### Phase 0 — Current state
Pure Shopify (theme + apps). Baseline to compare against.

### Phase 1 — POC: Shopify API + in-house frontend  ← we are here
Rebuild the storefront shell on TanStack Start, all data via Shopify Storefront API,
checkout still redirects to Shopify.

Scope for the POC to be a fair demo to the company:
1. [x] Home page + collection listing — `/collections`, `/collections/$handle`
   (deity/theme nav like Men/Women/Best Sellers can reuse the same route once the
   real store's collection handles are known; sample-data collections prove the
   mechanism now)
2. [x] Product listing with quick-add — collection page product cards have a
   "Quick add" button that adds the default variant straight to cart, no PDP
   visit needed
3. [x] Product detail page with variants — `/products/$handle`, live variant/price
   picker, plus a "With this product also buy" section (the plan's own suggested
   fallback: pulls a few other products from the product's first collection,
   since Storefront API has no native upsell field)
4. [x] Cart backed by Storefront API cart mutations — `src/lib/shopify/cart.functions.ts`
   (`getCart`, `addCartLine`, `updateCartLine`, `removeCartLine`), cart id in an
   httpOnly cookie, `/cart` route with quantity controls
5. [x] Redirect-to-Shopify-checkout — `/cart` page's Checkout button links straight
   to `cart.checkoutUrl`
6. [x] Login + wishlist — hosted Shopify OAuth login (`/auth/login`,
   `/auth/callback`, `/auth/logout`), session via TanStack Start's encrypted
   session cookie, wishlist toggle on the PDP + `/wishlist` page backed by
   `localStorage`
7. [x] Newsletter signup — footer form on every page (`NewsletterSignup`
   component), posts straight to Shopify's own classic `/contact#newsletter`
   form endpoint on the store's primary domain — no new API scope needed, same
   mechanism most Shopify themes use natively

**All 7 Phase 1 scope items are done.** Phase 1 is feature-complete for a demo.

Explicitly out of scope for the POC: promotions engine, custom checkout, payments,
returns flow, inventory sync, CMS/blog (none exists today anyway).

Success criteria to present to the company:
- Feature parity on items 1–7 above
- Page speed / Core Web Vitals equal or better than current Shopify theme
- No regression in checkout completion path (still Shopify's own, so this is low risk)
- Clear list of what Phase 2 would require (below), so they can decide on investment

### Phase 2 — Hybrid: in-house checkout & accounts, Shopify as backend
Only start once Phase 1 is approved.
- Introduce better-auth + Drizzle/Postgres for customer accounts (migrate off Shopify
  customer accounts)
- Build custom checkout: payment gateway integration replacing Shopify's (UPI provider
  + COD flow are hard requirements, not optional)
- Promotions/discount logic moves in-house (Buy-2-Get-1, % off, urgency badges)
- Shopify becomes primarily the product/inventory/order system of record, synced via
  webhooks (`products/update`, `inventory_levels/update`, `orders/create`) into our
  own Postgres read models

### Phase 3 — Complete in-house
- Own product/inventory/order database (Drizzle/Postgres), Shopify decommissioned
  or kept only as a supplier-side tool if the business still wants it for ops
- Own payment gateway integration end-to-end
- Own customer data, no dependency on Shopify Customer Account API

## Open questions to resolve before/during Phase 1

- Which Shopify plan/API version is available (Storefront API access, rate limits)?
- Are there existing Shopify apps doing upsell/reviews/wishlist that we're
  reimplementing vs. calling? (Wishlist today may be a third-party app, not native
  Shopify — needs checking; native Shopify has no wishlist feature.)
- Multipass availability (Shopify Plus only) — affects how smooth login can be if we
  want SSO between old and new frontend during the transition.
- Analytics/pixel continuity (Meta/Google) during the swap.

## Build log

- Test environment: free **Shopify Partner development store**
  (`prabhubhakti-dev.myshopify.com`, seeded with sample products), zero risk to the
  real store. Custom app scopes: `unauthenticated_read_product_listings` +
  `unauthenticated_read_customers`.
- `src/lib/shopify/client.server.ts` — server-only Storefront API client (token
  never reaches the browser)
- `src/lib/shopify/shop.functions.ts`, `collections.functions.ts`,
  `products.functions.ts`, `cart.functions.ts` — one server-function module per
  concern, matching the TanStack Start `.functions.ts`/`.server.ts` convention
- Routes so far: `/` (with a shop-info sanity check), `/collections`,
  `/collections/$handle`, `/products/$handle`, `/cart`, `/wishlist`,
  `/auth/login`, `/auth/callback`, `/auth/logout`, plus a basic nav in
  `__root.tsx` so all of them are reachable
- Auth setup: added the official **"Headless"** sales channel to the dev store
  (Shopify admin → Sales channels → Shopify App Store) to register a Customer
  Account API OAuth client (`Public (web app)` type, no client secret — PKCE
  only). Explicit Authorization/Token/Logout endpoints and Client ID come
  straight from that channel's "Customer Account API → Manage" screen.
- **Local-dev-only requirement**: the Customer Account API's OAuth redirect
  does not support `localhost` — testing login needs a tunnel (ngrok) exposing
  `localhost:3000`, with that tunnel's HTTPS URL registered as the callback
  URI/JS origin/logout URI in the Headless channel *and* set as `SERVER_URL` in
  `.env` (also doubles as Vite's dev `allowedHosts`). On a free ngrok plan this
  URL changes on every restart — both places need updating together when that
  happens. Once deployed to the real GCloud host this constraint disappears
  (real HTTPS domain throughout).
- Session/auth code: `src/lib/shopify/auth.ts` (session configs + PKCE/state
  generation), `auth.middleware.ts` (`authMiddleware` reads the session,
  `authedMiddleware` throws if logged out), `auth.function.ts` (`getSession`/
  `ensureSession`), `customer.functions.ts` (`getCurrentCustomer`, handles
  access-token refresh), `customer-account.server.ts` (token exchange + GraphQL
  calls to Shopify's Customer Account API)
- Customer Account API GraphQL endpoint is **not** discoverable via
  `.well-known/customer-account-api` (that 404s) — confirmed by direct probing
  that the real URL is the fixed pattern
  `https://shopify.com/{shop_id}/account/customer/api/{version}/graphql`.
  `customer-account.server.ts` builds it directly, no discovery call.
- Login flow **confirmed working end-to-end**: OAuth handshake, session
  cookie, and the customer-profile fetch (after the endpoint fix) all verified
  live — nav shows the logged-in customer's email + Logout, cart page
  (quantities, subtotal, checkout redirect) confirmed rendering correctly too.
- Root loader now fetches `{ customer, shop }` together (was customer-only) —
  `shop.primaryDomain.url` feeds the footer's newsletter form action, and the
  home page reuses this instead of fetching shop info a second time.
- Quick-add: `collections.functions.ts`'s product query now pulls each
  product's first variant (`id`, `availableForSale`) so listing-grid cards can
  add-to-cart directly without visiting the PDP.
- PDP upsell: `getProductByHandle` now also returns the product's first
  collection handle; `getRelatedProducts` (in `products.functions.ts`) reuses
  `getCollectionByHandle` to pull a few sibling products for the "With this
  product also buy" section — composing one server function from another,
  no new Shopify scope needed.
- Newsletter: `src/components/newsletter-signup.tsx`, a plain HTML form
  posting to `{primaryDomain}/contact#newsletter` — Shopify's own built-in
  classic newsletter-capture endpoint (`form_type=customer`,
  `contact[tags]=newsletter`), the same mechanism virtually every Shopify theme
  uses. No API token, no new scope, works even with JS disabled. Mounted in
  `__root.tsx`'s footer so it's on every page.

**Phase 1 is now feature-complete** — all 7 scope items done. Next: a pass on
the two documented gaps (deity/theme collection nav using real handles once
known, and confirming the `/contact` newsletter endpoint actually works against
this store), then it's ready to demo to the company per the success criteria
above.
