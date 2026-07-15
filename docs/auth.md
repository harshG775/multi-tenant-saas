# Auth (better-auth)

better-auth is installed and wired up, but the tenant-aware pieces are only partially built. This file tracks the actual current state — check it before assuming any of the "planned" items below are done.

## What exists today

- **Instance**: [src/lib/auth/index.ts](../src/lib/auth/index.ts) — `betterAuth()` with the `drizzleAdapter` (Postgres) and the `tanstackStartCookies()` plugin. This instance is the **site-facing** instance — it authenticates each site domain's own end users (see "Two identity spaces" below), not tenant owners.
- **Schema**: [src/lib/db/schema/auth.schema.ts](../src/lib/db/schema/auth.schema.ts) has better-auth's generated `user`/`session`/`account`/`verification` tables. `user` has a `siteDomainId` column (FK → `siteDomain.id`, `onDelete: "cascade"`) — **not** a direct `tenantId` FK. A user belongs to exactly one site domain; site domains belong to a tenant. Chain: `tenant → siteDomain → user`.
- **Tenant/siteDomain tables**: [src/lib/db/schema/tenant.schema.ts](../src/lib/db/schema/tenant.schema.ts) — `tenant` (`id`, `description`, timestamps — no hostname, no owner yet) and `siteDomain` (`id`, `hostname` unique, `tenantId` FK, timestamps). Neither is wired up as the source of truth for request-time lookups yet — `tenantMiddleware` still reads from the in-memory `tenantsDB` array, not these tables.
- **Relations**: [src/lib/db/relations/index.ts](../src/lib/db/relations/index.ts) — `tenant.siteDomains` (many) / `siteDomain.tenant` (one) / `siteDomain.users` (many) / `user.siteDomain` (one).
- **API route**: [src/routes/api/auth/$.ts](../src/routes/api/auth/$.ts) — catch-all forwarding `GET`/`POST` to `auth.handler(...)`.

## Design decisions (settled, drive future work)

- **No cross-tenant *or* cross-site-domain identity / no organizations.** Isolation is per `siteDomain`, not per `tenant` — a user belongs to exactly one site domain (flat `siteDomainId` FK, not a membership table). Two different site domains under the *same* tenant still can't share a user. Don't reach for better-auth's `organization` plugin — its `teams` feature groups members drawn from one shared org-wide member pool; it does not give isolated, independent member pools per sub-entity (per site domain), which is what this project needs (each connected domain has its own separate audience, Hostinger-style).
- **Two identity spaces, not one `user` table with roles.** Superseded the earlier "role === admin on user" plan — see below.
- **Platform admin (superadmin)** — a third tier that would manage all tenants platform-wide (billing, tenant creation/suspension). Explicitly **out of scope / not designed** right now — deferred until the two tiers below are working end-to-end.

## Two identity spaces: `admin` vs `user` (planned)

The onboarding flow doesn't fit a single `user` table: a tenant owner signs up on the platform's own domain *before* any site domain exists, so their account can't carry a `siteDomainId`. Rather than making that column nullable and overloading `user` with two meanings, the plan is two separate better-auth instances, sharing the same Postgres DB:

| | `auth` (exists) | `adminAuth` (planned, not built) |
| --- | --- | --- |
| Who | Each site domain's own end users | Tenant/site owners |
| Schema | `user` / `session` / `account` / `verification`, `user.siteDomainId` FK | New `admin` / `adminSession` / `adminAccount` / `adminVerification`, `admin.tenantId` FK |
| Scope | One site domain | One tenant (i.e. every site domain under it) |
| Used at | `tenant-x.com` (the site itself) | `platform.com/p/onboarding`, `platform.com/p/dashboard`, `tenant-x.com/admin` |
| `basePath` | `/api/auth` (default) | `/api/auth-admin` (must differ — same default path would collide) |
| `cookiePrefix` | must be set explicitly (e.g. `tenant-user`) | must differ from the above (e.g. `tenant-admin`) |

Both instances can coexist on the *same* domain (`tenant-x.com` serves the site via `auth` and `tenant-x.com/admin` via `adminAuth`) as long as `cookiePrefix` and `basePath` are both distinct per instance — otherwise their session cookies/endpoints collide. See `better-auth`'s `advanced.cookiePrefix` / `basePath` options.

**Cross-domain session caveat**: `platform.com/p/dashboard` and `tenant-x.com/admin` use the same `adminAuth` instance/table, but a session cookie set on `platform.com` is **not** sent on `tenant-x.com` — browsers don't share cookies across unrelated registrable domains (`crossSubDomainCookies` only helps across subdomains of one shared root, which doesn't apply to arbitrary customer domains). So the owner logs in again on each domain with the same credentials; there's no SSO handoff between them yet (would need an explicit signed-token exchange if this becomes a real requirement — not planned for the POC).

**Planned request-flow addition**: `tenantMiddleware` needs a `PLATFORM_HOST` branch (e.g. `platform.com`) that skips the `siteDomain` lookup entirely and serves the `/p/onboarding` / `/p/dashboard` routes instead of the "unknown tenant" redirect it currently does for any unrecognized `Host`.

## How tenant-awareness reaches better-auth

better-auth has no built-in concept of "tenant." The bridge to `tenantMiddleware`'s already-resolved `context.tenant` is:

1. `tenantMiddleware` (global `requestMiddleware` in `src/start.ts`) resolves `context.tenant` from the `Host` header, same as always.
2. `src/routes/api/auth/$.ts`'s `withTenantHeader()` takes the raw request + `context.tenant?.id` and builds a **new** `Request` with an `x-tenant-id` header added, then passes *that* into `auth.handler(...)`.
3. `trustedOrigins` in `src/lib/auth/index.ts` reads `x-tenant-id` off the request: present → the origin is trusted (tenantMiddleware already proved it's a real tenant host); absent → `[]` (untrusted).

**Gotcha already hit and fixed**: `new Request(existingRequest, { headers })` (the "clone" form) throws `TypeError: Cannot read properties of undefined (reading 'window')` in this stack — the request object handed to the route isn't recognized as the same `Request` class by whatever `new Request()` implementation is in play (cross-realm/duplicate-undici issue). Fix: construct from `request.url` (a string) + explicit `method`/`headers`/`body`, not from the request object itself. POST also needs `duplex: "half"` when a body is present (Node's fetch requires it for streaming bodies) — TypeScript doesn't know about `duplex` on `RequestInit` yet, hence the `@ts-expect-error` on that line.

**`baseURL`/`BETTER_AUTH_URL` intentionally left unset.** better-auth logs a warning about this, but a static `baseURL` would be wrong here — it'd point every tenant's generated links (email verification, OAuth callbacks) at one fixed domain instead of that tenant's own. better-auth's `baseURL: { allowedHosts }` object doesn't fit either — it's a bounded, static allowlist (same limitation `trustedOrigins`' static array had), not built for arbitrary DB-driven tenant domains. This is a non-issue today since no `emailAndPassword`/`socialProviders` are configured (nothing constructs absolute callback URLs yet) — revisit and actually test the derived-origin behavior once those are added.

## Not done yet

- **The entire `admin` identity space** — schema, second `betterAuth()` instance, `/api/auth-admin/$` route, `/p/onboarding`, `/p/dashboard`, `tenant-x.com/admin` route guard. Everything in "Two identity spaces" above is a plan, not code.
- **`PLATFORM_HOST` branch in `tenantMiddleware`** — needed before `/p/*` routes can exist.
- **Composite unique `(siteDomainId, email)`** — `user.email` is still globally `.unique()`. Two different site domains can't currently have a user with the same email; this needs to change before real signup is wired up.
- **Signup site-domain stamping** — no `databaseHooks` yet to set `siteDomainId` from `context.tenant.id` when a user is created. Right now `siteDomainId` is `.notNull()` with no default, so any insert through better-auth's normal flow will fail until this hook exists.
- **Sign-in / duplicate-check scoping** — better-auth's internal "find user by email" isn't scoped to the current site domain yet; needed before the composite-unique change is meaningful in practice.
- **`tenantsDB` → real `siteDomain` table** — `tenantMiddleware` still reads the hardcoded in-memory array; the `tenant`/`siteDomain` tables exist in the schema but nothing queries them yet.
- **`BETTER_AUTH_SECRET`** — set in `.env`, but not routed through `src/env.ts` like the rest of the project's env vars.
- **Import alias inconsistency** — `src/routes/api/auth/$.ts` imports `auth` via `@/lib/auth`; the rest of the codebase uses the `#/*` alias.
- **Superadmin / platform-wide operator tier** — not designed at all, deferred past the two tiers above.
