# Decisions

## TanStack Start over Next.js

The project originally started on Next.js (commit `a70f86f`, "remove:nextjs project"), then restarted on TanStack Start (`db5d9f2`, "tanstack start init"). Chosen for TanStack Router's fully-typed, file-based routing over Next.js's App Router, plus server functions/middleware and SSR living in one framework primitive instead of split across route handlers/RSC/middleware.

## Neon serverless driver (`neon-http`)

`src/lib/db/index.ts` uses `@neondatabase/serverless` (the `neon-http` adapter) rather than `node-postgres`/`postgres.js`. This follows Neon's own default client for a Neon-backed project, not a specific edge/serverless deploy constraint. Tradeoff: `neon-http` talks to Neon's HTTP endpoint, so `DATABASE_URL` must point at an actual Neon database (or its local proxy) — a plain local Postgres instance isn't a drop-in substitute.

## No organizations — fully isolated per-site-domain identity

`user.siteDomainId` is a flat FK (one site domain per user), not a membership/organization table, and better-auth's `organization` plugin is intentionally unused. Isolation is per `siteDomain`, not per `tenant` — two site domains under the same tenant still can't share a user. better-auth's `organization`/`teams` feature groups members drawn from one shared org-wide pool; it doesn't give each sub-entity (site domain) its own independent, isolated member pool, which is what a Hostinger-style "connect a domain, that domain gets its own users" flow needs. Full detail in [auth.md](./auth.md#design-decisions-settled-drive-future-work).

## Two better-auth instances (`admin` + `user`), not one `user` table with roles

A tenant owner signs up on the platform's own domain before any site domain exists, so their account can't carry a `siteDomainId` — the earlier plan (a `role === "admin"` column on `user`) doesn't fit once onboarding happens on a separate domain from any site. Instead: two identity spaces, each its own `betterAuth()` instance/schema, sharing one Postgres DB — `user` (site-domain-scoped end users, exists today) and `admin` (tenant-scoped owners, planned). Both instances can run on the same domain (`tenant-x.com` serves the site via `user` and `tenant-x.com/admin` via `admin`) as long as each sets a distinct `cookiePrefix` and `basePath` — same defaults on both would collide. Full detail in [auth.md](./auth.md#two-identity-spaces-admin-vs-user-planned).

## Platform-wide superadmin tier deferred

A third tier (managing all tenants — billing, tenant creation/suspension) is a real eventual need but explicitly out of scope until the `admin`/`user` split above is working end-to-end. Not designed yet.

## `trustedOrigins` as a function reading `x-tenant-id`, not a static list

Tenant hostnames are dynamic and DB-driven, so a static `trustedOrigins` array can't express them. `tenantMiddleware` already validates the `Host` header per request; `/api/auth/$` stamps that result as `x-tenant-id`, and `trustedOrigins` trusts the request only if that header is present. Full detail in [auth.md](./auth.md#how-tenant-awareness-reaches-better-auth).

## `baseURL`/`BETTER_AUTH_URL` intentionally left unset

A static `baseURL` would point every tenant's generated links (email verification, OAuth callbacks) at one fixed domain instead of that tenant's own; better-auth's `baseURL: { allowedHosts }` object has the same static-allowlist limitation. Left unset until derived-per-tenant origin behavior is implemented and tested — see [auth.md](./auth.md#how-tenant-awareness-reaches-better-auth) (currently a non-issue since no `emailAndPassword`/`socialProviders` are configured).

## Request rebuilt from `url` + headers, not cloned

`src/routes/api/auth/$.ts` builds a new `Request` from `request.url` (a string) plus explicit `method`/`headers`/`body`, instead of the more obvious `new Request(existingRequest, { headers })` clone form. The clone form throws `TypeError: Cannot read properties of undefined (reading 'window')` in this stack (a cross-realm/duplicate-`undici` issue). POST also needs `duplex: "half"` for streaming bodies, hence the `@ts-expect-error` next to it. Full detail in [auth.md](./auth.md#how-tenant-awareness-reaches-better-auth).

## Dual path aliases (`#/*` and `@/*`)

Both resolve to `src/*` (`tsconfig.json`, `vite.config.ts`). `#/*` is preferred and used throughout hand-written code — it follows the Node.js subpath-imports convention and avoids clashing with npm's `@scope/*` package-naming convention. `@/*` is kept because it ships as the default alias with the TanStack Start starter and is what `shadcn`'s CLI (`components.json`) generates imports against.
