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

### Auth (better-auth)

better-auth is installed and partially wired up — schema, tenant FK, and a request-header bridge from `tenantMiddleware` into better-auth's `trustedOrigins` all exist, but signup/sign-in aren't tenant-scoped yet and there's no `/admin` guard. Full current state, design decisions (no organizations, isolated-per-tenant model, tenant-admin vs. platform-admin split), the `x-tenant-id` header mechanism, and the remaining TODO list are tracked in @docs/auth.md — read it before touching auth code.

### UI components (shadcn)

Add components with the shadcn CLI rather than hand-writing them:

```bash
pnpm dlx shadcn@latest add <component>
```

Config is in `components.json` (style `base-vega`, neutral base color, icon library `lucide`, aliases pointing at `#/components`, `#/lib`, etc.).

## Status / known gaps

This is an early-stage starter (see README "Status / Roadmap"):
- `tenantsDB` is in-memory, not backed by the (already-configured) Postgres database yet.
- Auth is in progress — see "Auth (better-auth)" above / @docs/auth.md for what's built vs. still missing.
- Onboarding redirect target (`https://onboard.yourapp.com`) is a placeholder.
- No tenant-scoped data access/authorization yet.
