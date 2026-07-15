# Architecture

## Routing

- File-based routing via TanStack Router. `src/routeTree.gen.ts` is generated — don't hand-edit it.
- `src/routes/__root.tsx` — root route (`createRootRouteWithContext`). Resolves the tenant in `beforeLoad`, uses it in `head()` to set per-tenant `<title>`, meta description, Open Graph tags, and favicon. `shellComponent` renders the `<html>`/`<body>` shell (also mounts TanStack Router/Query devtools panels).
- `src/routes/index.tsx` — home page, reads `tenant` off route context (`Route.useRouteContext()`) and renders tenant branding.
- `src/routes/api/auth/$.ts` — catch-all API route (`/api/auth/*`) forwarding `GET`/`POST` to the better-auth handler. See [auth.md](./auth.md).
- No nested layouts or route groups exist yet beyond the root shell.

## Request flow

1. `src/start.ts` defines the TanStack Start instance and registers global `requestMiddleware`, in order: `csrfMiddleware` (filtered to `handlerType === "serverFn"`), then `tenantMiddleware`.
2. `tenantMiddleware` ([src/modules/tenant/tenant.middleware.ts](../src/modules/tenant/tenant.middleware.ts)) reads the `Host` header, normalizes it via [src/lib/normalizeHostname.ts](../src/lib/normalizeHostname.ts), looks up the tenant in the in-memory `tenantsDB` array, and attaches `{ tenant }` (or `null`) to the request context.
3. `getTenantFn` ([src/modules/tenant/tenant.function.ts](../src/modules/tenant/tenant.function.ts)) is a server function that reads `context.tenant`. No match → throws a `redirect` to the placeholder onboarding URL.
4. `__root.tsx`'s `beforeLoad` calls `getTenantFn()` and puts the result on router context, so every route/loader downstream can read `tenant` without re-fetching.
5. DB access goes through `src/lib/db/index.ts` (Neon HTTP client + Drizzle instance), with relations defined separately in `src/lib/db/relations/index.ts` via `defineRelations` — the two must be kept in sync when tables with foreign keys change.
6. Auth requests hit `/api/auth/$` (site users) or `/api/auth-admin/$` (tenant/site owners), each rebuilding the incoming request with an `x-tenant-id` header (from `context.tenant.id`) before handing it to the matching `betterAuth()` instance's `.handler(...)`. `trustedOrigins` in `src/lib/auth/auth.ts` / `admin-auth.ts` reads that header to decide whether to trust the request's `Host`. Full detail in [auth.md](./auth.md).

There's no client/server rendering split beyond standard TanStack Start SSR — everything under `src/routes` is server-rendered on first load, no client-only islands exist yet.

## Folder layout

| Path | Purpose |
| --- | --- |
| `src/components/ui/` | shadcn-generated UI components |
| `src/integrations/tanstack-query/` | `QueryClient` setup + devtools panel |
| `src/lib/` | Generic, cross-feature code: `utils.ts` (`cn()`), `normalizeHostname.ts`, `db/` (Drizzle client, schema, relations, migrations), `auth/` (better-auth instance) |
| `src/modules/tenant/` | Tenant feature module — middleware, server function, types, `index.ts` barrel. New features follow this same `src/modules/<feature>/` shape, consumed only through their barrel. |
| `src/routes/` | File-based routes |
| `src/env.ts` | Typed/validated environment variables (`@t3-oss/env-core` + Zod) |
| `src/router.tsx` | Router instance, wires the query client in via `setupRouterSsrQueryIntegration` |
| `src/start.ts` | TanStack Start instance + global request middleware |
