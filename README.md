# multi-tenant-saas

A multi-tenant site builder. Site owners sign up on the platform host, create a site, and get a public site served from a subdomain or a custom domain (custom domains are modelled in the schema but have no UI yet).

## Stack

TanStack Start (React 19, file-based routing, server functions) on Vite 8 + Nitro · TanStack Query · Better Auth · Drizzle ORM (`1.0.0-rc.4`, relations v2) on Neon Postgres (HTTP driver) · Tailwind CSS 4 · shadcn/ui (`radix-nova`, Remix icons) · React Compiler · Biome · pnpm

## Setup

```bash
pnpm install
cp .env.example .env
pnpm db:migrate
pnpm dev
```

### Environment

Validated at startup in [src/env.ts](src/env.ts) with `@t3-oss/env-core` (empty strings count as unset). `drizzle.config.ts` reads `.env.local`, then `.env`.

| Variable             | Description                                                              |
| -------------------- | ------------------------------------------------------------------------ |
| `PLATFORM_URL`       | The platform's own origin, e.g. `http://localhost:3000`                  |
| `DATABASE_URL`       | Neon Postgres connection string                                          |
| `BETTER_AUTH_SECRET` | Random secret, at least 32 characters                                    |

An optional client variable, `VITE_APP_TITLE`, is also accepted.

## Scripts

| Script                            | Description                                                              |
| --------------------------------- | ------------------------------------------------------------------------ |
| `pnpm dev`                        | Start the dev server on port 3000                                        |
| `pnpm build` / `pnpm preview`     | Production build / preview                                               |
| `pnpm check`                      | Biome lint, format and import organization (`--write`, modifies files)   |
| `pnpm db:generate`                | Generate a Drizzle migration into `src/lib/db/migrations/`               |
| `pnpm db:migrate`                 | Apply migrations                                                         |
| `pnpm db:studio`                  | Open Drizzle Studio                                                      |
| `pnpm generate-routes`            | Regenerate `src/routeTree.gen.ts` (the dev server also does this)        |

There is no test suite. `tsconfig` is `strict` with `noUnusedLocals` and `noUnusedParameters`, so unused code fails typechecking.

## Architecture

### Tenant resolution

Every request is classified by its `Host` header (`x-forwarded-host` first) against `rootDomain`, the hostname of `PLATFORM_URL`:

| Host                    | Resolves to                          |
| ----------------------- | ------------------------------------ |
| `localhost:3000`        | Platform (marketing, signup)         |
| `<name>.localhost:3000` | Tenant subdomain                     |
| any other host          | Tenant custom domain                 |

`*.localhost` resolves automatically in modern browsers, so no hosts-file edits are needed in development.

- [src/start.ts](src/start.ts) registers request middleware: a CSRF middleware (server functions only), then `siteMiddleware`.
- [src/lib/server/site.middleware.ts](src/lib/server/site.middleware.ts) classifies the host, looks up the site, and puts `site` (`Site | null`) in server context. An unknown site host redirects to `PLATFORM_URL`.
- [src/lib/server/site.lookup.ts](src/lib/server/site.lookup.ts) `findSiteByHostname` queries `site_domain` joined to `site`. Custom domains only resolve once `verifiedAt` is set.
- [src/lib/server/host.ts](src/lib/server/host.ts) holds `normalizeHost`, `getRequestHost`, `rootDomain` and `siteOrigin()` (builds a site's public origin, reusing the platform scheme and port).
- The client gets `site` through `getSiteFn` ([src/lib/server/site.function.ts](src/lib/server/site.function.ts)). The root route's `beforeLoad` caches it in Query with `staleTime: "static"` and adds it to router context. Components read it with `useRouteContext({ from: "__root__" })`. `/` renders a tenant welcome page when `site` is set, otherwise the platform landing page.

### Auth

Two separate Better Auth instances share `db` and the schema barrel, but use different tables, base paths and cookies.

|               | Owner auth                                                            | User auth                                      |
| ------------- | --------------------------------------------------------------------- | ---------------------------------------------- |
| File          | [src/lib/auth/owner-auth.ts](src/lib/auth/owner-auth.ts)              | [src/lib/auth/user-auth.ts](src/lib/auth/user-auth.ts) |
| Who           | Site owners                                                           | Future end users of tenant sites               |
| Base path     | `/api/v1/auth/owner`                                                  | `/api/v1/auth`                                 |
| Tables        | `owner_user`, `owner_session`, `owner_account`, `owner_verification`  | `user`, `session`, `account`, `verification`   |
| Cookie prefix | `owner`                                                               | default                                        |
| Status        | In use (email + password)                                             | Scaffold only; no UI uses it yet               |

- Owner auth's `trustedOrigins` is async. It always trusts `PLATFORM_URL` and additionally trusts the request host if it resolves to a known site. Preserve this when touching auth: owner auth is meant to be reachable from a site's own host too (a comment in `owner-auth.ts` mentions `/admin`, which doesn't exist yet).
- Handlers are mounted by the catch-all routes [src/routes/api/v1/auth/$.ts](src/routes/api/v1/auth/$.ts) and [src/routes/api/v1/auth/owner/$.ts](src/routes/api/v1/auth/owner/$.ts). Both instances use the `tanstackStartCookies()` plugin.
- Browser client: `ownerAuthClient` in [src/lib/auth/owner-client.ts](src/lib/auth/owner-client.ts). Server-side session check: `ownerAuth.api.getSession({ headers: getRequestHeaders() })`.

### Database

- [src/lib/db/index.ts](src/lib/db/index.ts) creates a `drizzle-orm/neon-http` client with `relations` passed in. **The HTTP driver has no interactive transactions**; use `db.batch([...])` for atomic multi-statement writes (see `createSiteFn`).
- Schema lives in `src/lib/db/schema/` (`auth`, `owner-auth`, `site`) and is re-exported from `schema/index.ts`, which `drizzle.config.ts` points at. New schema files must be added to that barrel.
- Relations are defined once in [src/lib/db/relations/index.ts](src/lib/db/relations/index.ts) with Drizzle relations v2 (`defineRelations`). Queries use the v2 object syntax: `db.query.site.findFirst({ where: { ownerId }, with: { domains: true } })`.
- Data model: `owner_user 1─* site` (`onDelete: restrict`) and `site 1─* site_domain` (`onDelete: cascade`). `site_domain.hostname` is globally unique, `kind` is `"subdomain" | "custom"`, and `isPrimary` marks the canonical domain. IDs are text (`crypto.randomUUID()`).
- Migrations are folder-style (`<timestamp>_<name>/migration.sql` plus `snapshot.json`). Generate them with `pnpm db:generate`; don't hand-edit.

### Routing and the owner flow

File-based routes live in `src/routes/`. `src/routeTree.gen.ts` is generated and ignored by Biome; don't edit it. The router ([src/router.tsx](src/router.tsx)) preloads on intent and integrates SSR with Query.

- `/`: tenant home or platform landing (see above).
- `/owner/*`: the owner area, **platform host only**. [src/routes/owner/route.tsx](src/routes/owner/route.tsx) throws `notFound()` when `context.site` is set, then loads `getOwnerStateFn` (`owner`, `ownedSite`, `platformHost`) into context for all children. Child routes gate themselves in `beforeLoad`:
  - `/owner` redirects to `/owner/dashboard`.
  - `/owner/signup` and `/owner/signin` redirect to the dashboard when already signed in.
  - `/owner/dashboard/sites` lists the owner's sites, inside the dashboard sidebar layout. `/owner/sites/new` is the onboarding form: it requires an owner (else signup) and redirects to `/owner/dashboard/sites` if a site already exists.
  - `/owner/dashboard` (layout with sidebar) requires an owner (else signin) for every page under it. With no site yet it shows a "Create your site" prompt instead of forcing onboarding.
- Flow: signin → dashboard. Signup → `/owner/sites/new?onboarding=true` (`createSiteFn`), where "Skip for now" appears only because of that search param; otherwise the page is reached from the sites list's "Create site" and has no skip. An owner can create any number of sites for now (no limit in `createSiteFn`).
- Server functions use `createServerFn` with a zod `inputValidator`. `createSiteFn` returns a discriminated `CreateSiteResult` for expected failures (for example a taken subdomain, detected via Postgres error `23505` by walking `cause`) and throws only for unexpected ones.

### Feature code

Files that belong to a route live next to it in a `-`-prefixed folder, which the router ignores when generating routes (do not use `_`, it marks a pathless layout route). `src/routes/owner/` uses `-components/` (forms, the `OwnerCard` and `FormError` layout primitives, the dashboard), `-functions/` (`*.function.ts` server functions) and `-lib/` (`subdomain.ts`: zod schemas and the reserved-subdomain list, shared by the client form and the server). New route groups should follow this layout.

### UI

- shadcn components live in `src/components/ui/`. Add more with the `shadcn` CLI (config in `components.json`, base color taupe). `cn` comes from `#/lib/utils`.
- `RouteProgressBar` ([src/components/route-progress-bar.tsx](src/components/route-progress-bar.tsx)) is mounted in the root document and reflects router-pending state.
- Styles are Tailwind 4 in `src/styles.css`, with the Inter variable font.
- The React Compiler is enabled through Babel in `vite.config.ts`, so avoid manual `useMemo`/`useCallback` unless needed.

## Conventions

- The import alias is `#/*` → `src/*` (package.json `imports` and tsconfig). Prefer it over relative paths across directories. Server-function files are named `*.function.ts`.
- Biome formatting: 4-space indent, double quotes, 120-column lines, organized imports. Run `pnpm check` before committing.
- `verbatimModuleSyntax` is on: use `import type` or inline `type` for type-only imports.
- Commit messages follow Conventional Commits with a scope, e.g. `feat(owner): ...`, `refactor(tenancy): ...`.
- Work happens on feature branches (currently `feature/database`), with `main` as the base.

## Not built yet

End-user (`userAuth`) flows, the site admin under a site's own host, a custom-domain add/verify UI, and any site content or page-builder features. Some of the schema and auth plumbing for these already exists, so check it before adding new tables.
