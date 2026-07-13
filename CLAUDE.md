# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev            # dev server at http://localhost:3000
pnpm build          # production build (outputs to dist/)
pnpm preview        # preview the production build
pnpm test           # run all tests (vitest run)
pnpm lint           # eslint
pnpm format         # prettier --write . && eslint --fix
pnpm check          # prettier --check . (no writes)

pnpm db:generate    # generate a drizzle migration from schema changes
pnpm db:migrate     # apply migrations
pnpm db:push        # push schema directly (no migration file)
pnpm db:pull        # introspect DB into schema
pnpm db:studio      # open Drizzle Studio
```

There is no dedicated single-test-file script; use vitest's own filtering, e.g. `pnpm vitest run path/to/file.test.ts`.

Package manager is pnpm (`packageManager: pnpm@11.1.2` in package.json) — don't use npm/yarn.

## Architecture

This is a **TanStack Start** (full-stack React/SSR) app that resolves the tenant for each request from the `Host` header, so one deployment can serve multiple branded domains/subdomains.

### Request flow

1. `src/start.ts` defines the TanStack Start instance and registers global `requestMiddleware`: `csrfMiddleware` then `tenantMiddleware`.
2. `tenantMiddleware` ([src/modules/tenant/tenant.middleware.ts](src/modules/tenant/tenant.middleware.ts)) reads the `Host` header, normalizes it via [src/lib/normalizeHostname.ts](src/lib/normalizeHostname.ts) (strips `.localhost` and port for local dev, e.g. `tenant-1.com.localhost:3000` → `tenant-1.com`), looks up the tenant, and attaches `{ tenant }` (or `null`) to the request context.
3. `getTenantFn` ([src/modules/tenant/tenant.function.ts](src/modules/tenant/tenant.function.ts)) is a server function that reads `context.tenant`; if there's no match it throws a `redirect` to the (placeholder) onboarding URL.
4. `src/routes/__root.tsx` calls `getTenantFn` in `beforeLoad` and uses the result in `head()` to set per-tenant `<title>`, meta description, Open Graph tags, and favicon.

Tenants currently live in an in-memory array (`tenantsDB`) inside `tenant.middleware.ts` — not the database yet. When wiring tenant lookups to Postgres, that's the place to change.

### Feature module pattern

Tenant logic is colocated in [src/modules/tenant/](src/modules/tenant/) rather than spread across generic `lib`/`types` folders:

```
src/modules/tenant/
├── tenant.middleware.ts   # resolves tenant from Host header
├── tenant.function.ts     # server fn exposing tenant to routes/loaders
├── tenant.type.ts         # TenantType
└── index.ts               # public API barrel
```

New features should follow the same shape: `src/modules/<feature>/` with its own middleware/server functions/types, consumed only through the module's `index.ts` barrel:

```ts
import { getTenantFn, tenantMiddleware, type TenantType } from "#/modules/tenant"
```

Reserve `src/lib/` for generic, cross-feature utilities (e.g. `cn()` in `utils.ts`, `normalizeHostname.ts`, the db client) — not feature-specific logic.

### Database (Drizzle + Neon)

- `src/lib/db/index.ts` creates the Neon HTTP client and the Drizzle instance: `drizzle({ client: sql, relations })`.
- `src/lib/db/schema/index.ts` defines tables (`pgTable`).
- `src/lib/db/relations/index.ts` defines Drizzle relations via `defineRelations(schema, ...)` — keep this in sync whenever tables with foreign keys are added.
- `drizzle.config.ts` points at that schema, outputs migrations to `src/lib/db/migrations/`, and loads `DATABASE_URL` from `.env`/`.env.local` via `dotenv`.
- Schema changes: edit `schema/index.ts` (and `relations/index.ts` if needed) → `pnpm db:generate` → `pnpm db:migrate`.

### Environment variables

Typed and validated with `@t3-oss/env-core` + Zod in [src/env.ts](src/env.ts). Server vars go in the `server` block, client vars must be prefixed `VITE_` and go in the `client` block (enforced by `clientPrefix`). Add new vars there — both the schema entry and the `runtimeEnv` mapping — then consume via `import { env } from "#/env"`. `emptyStringAsUndefined: true` is set intentionally so blank `.env` values don't defeat defaults/optionality.

### Routing

File-based routing via TanStack Router; `src/routeTree.gen.ts` is generated (don't hand-edit). `src/routes/__root.tsx` is the shell (`shellComponent`) and owns per-tenant `<head>` metadata. `src/router.tsx` wires the query client into the router via `setupRouterSsrQueryIntegration`.

### Build tooling notes

- `vite.config.ts` composes: TanStack devtools plugin, `nitro()` (server adapter, with `@sentry/*` externalized from the rollup bundle), Tailwind v4 vite plugin, `tanstackStart()`, React plugin, and a Babel plugin enabling the React Compiler preset.
- Two path aliases resolve to `src/`: `#/*` (used throughout the existing code) and `@/*`. Prefer `#/*` for consistency with existing imports.
- ESLint config extends `@tanstack/eslint-config` with several rules turned off (`import/no-cycle`, `import/order`, `sort-imports`, `@typescript-eslint/array-type`, `@typescript-eslint/require-await`, `pnpm/json-enforce-catalog`) — don't fight these when linting.

### Auth (planned: better-auth)

Not implemented yet, but the intended model has been decided:

- **No cross-tenant identity / no organizations.** Each tenant is fully walled off — a user belongs to exactly one tenant. Do not reach for better-auth's `organization` plugin (that's for one identity with memberships across many orgs); it doesn't fit here.
- Put `tenantId` and `role` (`"user" | "admin"`) directly on better-auth's user model via its additional-fields mechanism — a flat field, not a separate membership table, since it's a 1:1 user↔tenant relationship.
- Email uniqueness must be scoped to `(tenantId, email)`, not global — two different tenants may have a user with the same email.
- better-auth has no built-in tenant awareness, so two hook points need custom wiring against the existing `tenantMiddleware`/`context.tenant`:
  1. **Sign-up** — stamp `tenantId` from `context.tenant.id` onto the new user (e.g. a `databaseHooks` "before create" hook).
  2. **Sign-in / user lookup** — scope the "find user by email" query to the current tenant too, or a same-email user from a different tenant could match.
- Session cookies are already domain-scoped (tenants are separate hostnames), so cross-tenant session leakage isn't a concern — no extra work needed there.
- Two admin tiers, don't conflate them:
  - **Tenant admin** (`tenant.com/admin`) — a user with `role === "admin"` inside that tenant. Gate with a simple role check; better-auth's `admin` plugin is likely unnecessary since it assumes a platform-wide role set (ban/impersonate semantics), not per-tenant roles.
  - **Platform admin** (managing all tenants — billing, tenant creation) — a separate, not-yet-built concern, unrelated to any single tenant's `/admin` route.

### UI components (shadcn)

Add components with the shadcn CLI rather than hand-writing them:

```bash
pnpm dlx shadcn@latest add <component>
```

Config is in `components.json` (style `base-vega`, neutral base color, icon library `lucide`, aliases pointing at `#/components`, `#/lib`, etc.).

## Status / known gaps

This is an early-stage starter (see README "Status / Roadmap"):
- `tenantsDB` is in-memory, not backed by the (already-configured) Postgres database yet.
- No auth / per-tenant user management yet — see "Auth (planned: better-auth)" above for the decided model before implementing.
- Onboarding redirect target (`https://onboard.yourapp.com`) is a placeholder.
- No tenant-scoped data access/authorization yet.
