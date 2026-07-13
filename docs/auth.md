# Auth (better-auth)

better-auth is installed and wired up, but the tenant-aware pieces are only partially built. This file tracks the actual current state — check it before assuming any of the "planned" items below are done.

## What exists today

- **Instance**: [src/lib/auth/index.ts](../src/lib/auth/index.ts) — `betterAuth()` with the `drizzleAdapter` (Postgres) and the `tanstackStartCookies()` plugin.
- **Schema**: [src/lib/db/schema/auth.schema.ts](../src/lib/db/schema/auth.schema.ts) has better-auth's generated `user`/`session`/`account`/`verification` tables. `user` has a `tenantId` column (FK → `tenant.id`, `onDelete: "cascade"`, indexed).
- **Tenant table**: [src/lib/db/schema/tenant.schema.ts](../src/lib/db/schema/tenant.schema.ts) — `tenant` table (`id`, `hostname` unique, `name`, `description`, timestamps). Not yet wired up as the source of truth for tenant lookups — `tenantMiddleware` still reads from the in-memory `tenantsDB` array, not this table.
- **Relations**: [src/lib/db/relations/index.ts](../src/lib/db/relations/index.ts) — `user.tenant` (one) / `tenant.users` (many) via `user.tenantId`.
- **API route**: [src/routes/api/auth/$.ts](../src/routes/api/auth/$.ts) — catch-all forwarding `GET`/`POST` to `auth.handler(...)`.

## Design decisions (settled, drive future work)

- **No cross-tenant identity / no organizations.** Each tenant is fully walled off — a user belongs to exactly one tenant (hence `tenantId` as a flat FK on `user`, not a membership table). Don't reach for better-auth's `organization` plugin.
- **Two admin tiers, don't conflate them:**
  - **Tenant admin** (`tenant.com/admin`) — a user with `role === "admin"` inside that tenant. A simple role check on session user, not better-auth's `admin` plugin (that assumes a platform-wide role set / ban-impersonate semantics, not per-tenant roles).
  - **Platform admin** (managing all tenants — billing, tenant creation) — separate, unrelated to any tenant's `/admin` route, not built at all yet.

## How tenant-awareness reaches better-auth

better-auth has no built-in concept of "tenant." The bridge to `tenantMiddleware`'s already-resolved `context.tenant` is:

1. `tenantMiddleware` (global `requestMiddleware` in `src/start.ts`) resolves `context.tenant` from the `Host` header, same as always.
2. `src/routes/api/auth/$.ts`'s `withTenantHeader()` takes the raw request + `context.tenant?.id` and builds a **new** `Request` with an `x-tenant-id` header added, then passes *that* into `auth.handler(...)`.
3. `trustedOrigins` in `src/lib/auth/index.ts` reads `x-tenant-id` off the request: present → the origin is trusted (tenantMiddleware already proved it's a real tenant host); absent → `[]` (untrusted).

**Gotcha already hit and fixed**: `new Request(existingRequest, { headers })` (the "clone" form) throws `TypeError: Cannot read properties of undefined (reading 'window')` in this stack — the request object handed to the route isn't recognized as the same `Request` class by whatever `new Request()` implementation is in play (cross-realm/duplicate-undici issue). Fix: construct from `request.url` (a string) + explicit `method`/`headers`/`body`, not from the request object itself. POST also needs `duplex: "half"` when a body is present (Node's fetch requires it for streaming bodies) — TypeScript doesn't know about `duplex` on `RequestInit` yet, hence the `@ts-expect-error` on that line.

**`baseURL`/`BETTER_AUTH_URL` intentionally left unset.** better-auth logs a warning about this, but a static `baseURL` would be wrong here — it'd point every tenant's generated links (email verification, OAuth callbacks) at one fixed domain instead of that tenant's own. better-auth's `baseURL: { allowedHosts }` object doesn't fit either — it's a bounded, static allowlist (same limitation `trustedOrigins`' static array had), not built for arbitrary DB-driven tenant domains. This is a non-issue today since no `emailAndPassword`/`socialProviders` are configured (nothing constructs absolute callback URLs yet) — revisit and actually test the derived-origin behavior once those are added.

## Not done yet

- **Composite unique `(tenantId, email)`** — `user.email` is still globally `.unique()`. Two different tenants can't currently have a user with the same email; this needs to change before real signup is wired up.
- **`role` column** — not added to `user` yet (`"user" | "admin"`).
- **Signup tenant stamping** — no `databaseHooks` yet to set `tenantId` from `context.tenant.id` when a user is created. Right now `tenantId` is `.notNull()` with no default, so any insert through better-auth's normal flow will fail until this hook exists.
- **Sign-in / duplicate-check scoping** — better-auth's internal "find user by email" isn't scoped to the current tenant yet; needed before the composite-unique change is meaningful in practice.
- **`/admin` route guard** — no session-reading server function (`getSessionFn`) or route guard exists yet.
- **`tenantsDB` → real `tenant` table** — `tenantMiddleware` still reads the hardcoded in-memory array; the `tenant` table exists in the schema but nothing queries it yet.
- **`BETTER_AUTH_SECRET`** — set in `.env`, but not routed through `src/env.ts` like the rest of the project's env vars.
- **Import alias inconsistency** — `src/routes/api/auth/$.ts` imports `auth` via `@/lib/auth`; the rest of the codebase uses the `#/*` alias.
