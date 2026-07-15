# Decisions

## TanStack Start over Next.js

The project originally started on Next.js (commit `a70f86f`, "remove:nextjs project"), then restarted on TanStack Start (`db5d9f2`, "tanstack start init"). Chosen for TanStack Router's fully-typed, file-based routing over Next.js's App Router, plus server functions/middleware and SSR living in one framework primitive instead of split across route handlers/RSC/middleware.

## Neon serverless driver (`neon-http`)

`src/lib/db/index.ts` uses `@neondatabase/serverless` (the `neon-http` adapter) rather than `node-postgres`/`postgres.js`. This follows Neon's own default client for a Neon-backed project, not a specific edge/serverless deploy constraint. Tradeoff: `neon-http` talks to Neon's HTTP endpoint, so `DATABASE_URL` must point at an actual Neon database (or its local proxy) — a plain local Postgres instance isn't a drop-in substitute.

## No organizations — fully isolated per-tenant identity

`user.tenantId` is a flat FK (one tenant per user), not a membership/organization table, and better-auth's `organization` plugin is intentionally unused. Each tenant is meant to be fully walled off. Full detail in [auth.md](./auth.md#design-decisions-settled-drive-future-work).

## Two separate admin tiers, not better-auth's `admin` plugin

Tenant-admin is a plain `role === "admin"` check scoped to one tenant; platform-admin (managing all tenants) is a separate, unbuilt concern. better-auth's built-in `admin` plugin assumes a platform-wide role set with ban/impersonate semantics, which doesn't fit per-tenant roles. Full detail in [auth.md](./auth.md#design-decisions-settled-drive-future-work).

## `trustedOrigins` as a function reading `x-tenant-id`, not a static list

Tenant hostnames are dynamic and DB-driven, so a static `trustedOrigins` array can't express them. `tenantMiddleware` already validates the `Host` header per request; `/api/auth/$` stamps that result as `x-tenant-id`, and `trustedOrigins` trusts the request only if that header is present. Full detail in [auth.md](./auth.md#how-tenant-awareness-reaches-better-auth).

## `baseURL`/`BETTER_AUTH_URL` intentionally left unset

A static `baseURL` would point every tenant's generated links (email verification, OAuth callbacks) at one fixed domain instead of that tenant's own; better-auth's `baseURL: { allowedHosts }` object has the same static-allowlist limitation. Left unset until derived-per-tenant origin behavior is implemented and tested — see [auth.md](./auth.md#how-tenant-awareness-reaches-better-auth) (currently a non-issue since no `emailAndPassword`/`socialProviders` are configured).

## Request rebuilt from `url` + headers, not cloned

`src/routes/api/auth/$.ts` builds a new `Request` from `request.url` (a string) plus explicit `method`/`headers`/`body`, instead of the more obvious `new Request(existingRequest, { headers })` clone form. The clone form throws `TypeError: Cannot read properties of undefined (reading 'window')` in this stack (a cross-realm/duplicate-`undici` issue). POST also needs `duplex: "half"` for streaming bodies, hence the `@ts-expect-error` next to it. Full detail in [auth.md](./auth.md#how-tenant-awareness-reaches-better-auth).

## Dual path aliases (`#/*` and `@/*`)

Both resolve to `src/*` (`tsconfig.json`, `vite.config.ts`). `#/*` is preferred and used throughout hand-written code — it follows the Node.js subpath-imports convention and avoids clashing with npm's `@scope/*` package-naming convention. `@/*` is kept because it ships as the default alias with the TanStack Start starter and is what `shadcn`'s CLI (`components.json`) generates imports against.
