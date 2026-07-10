# Multi-Tenant SaaS

A multi-tenant SaaS starter built on [TanStack Start](https://tanstack.com/start). Tenants are resolved on the server from the request's `Host` header, so each domain/subdomain can serve its own branding (name, description, logo, favicon) from a single deployment.

## Tech Stack

- [TanStack Start](https://tanstack.com/start) — full-stack React framework (SSR, server functions, middleware)
- [TanStack Router](https://tanstack.com/router) — file-based routing
- [TanStack Query](https://tanstack.com/query) — data fetching / cache
- [React 19](https://react.dev/) + [React Compiler](https://react.dev/learn/react-compiler)
- [Vite](https://vite.dev/) + [Nitro](https://nitro.build/) server adapter
- [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn](https://ui.shadcn.com/)
- [Zod](https://zod.dev/) + [T3 Env](https://env.t3.gg/) for typed environment variables
- [Vitest](https://vitest.dev/) for testing
- TypeScript, ESLint (`@tanstack/eslint-config`), Prettier

## How Multi-Tenancy Works

Tenant logic is colocated as a feature module in [src/modules/tenant/](src/modules/tenant/) rather than spread across generic `lib`/`types` folders. Each new feature should follow the same pattern: `src/modules/<feature>/` with its own middleware, server functions, types, and an `index.ts` barrel exporting the public API.

1. Every request passes through `tenantMiddleware` ([src/modules/tenant/tenant.middleware.ts](src/modules/tenant/tenant.middleware.ts)), which reads the `Host` header, normalizes it, and looks up a matching tenant.
2. The hostname is normalized by [src/lib/normalizeHostname.ts](src/lib/normalizeHostname.ts) — a generic string helper, not tenant-specific — so that local dev URLs like `tenant-1.com.localhost:3000` resolve to `tenant-1.com`.
3. The matched tenant (or `null`) is attached to the request context and exposed to routes via `getTenantFn` ([src/modules/tenant/tenant.function.ts](src/modules/tenant/tenant.function.ts)).
4. The root route (`src/routes/__root.tsx`) loads the tenant in `beforeLoad` and uses it to set the page `<title>`, meta description, Open Graph tags, and favicon per tenant.
5. If no tenant matches the hostname, the app redirects to an onboarding URL (`https://onboard.yourapp.com`) — update this placeholder before shipping.

Tenants currently live in an in-memory array inside `tenant.middleware.ts`. Swap this for a real lookup (database, KV store, edge config, etc.) when moving past prototyping.

Consumers import from the module's barrel, not its internal files:

```ts
import { getTenantFn, tenantMiddleware, type TenantType } from "#/modules/tenant"
```

### Try it locally

The dev server binds to `localhost:3000`. To exercise tenant resolution locally, use a `<tenant-hostname>.localhost` URL so it maps to a seeded tenant:

- http://tenant-1.com.localhost:3000
- http://tenant-2.com.localhost:3000

Any other hostname (including plain `http://localhost:3000`) won't match a tenant and will redirect to the onboarding URL.

### Adding a tenant

Add an entry to the `tenantsDB` array in [src/modules/tenant/tenant.middleware.ts](src/modules/tenant/tenant.middleware.ts):

```ts
{
    id: "tenant-3",
    hostname: "tenant-3.com",
    meta: {
        name: "Tenant Three",
        description: "...",
        logo: "https://.../logo.png",
        favicon: "https://.../favicon.ico",
    },
}
```

The shape is defined by `TenantType` in [src/modules/tenant/tenant.type.ts](src/modules/tenant/tenant.type.ts).

## Getting Started

```bash
pnpm install
pnpm dev
```

The app runs at http://localhost:3000.

## Available Scripts

```bash
pnpm dev       # start the dev server
pnpm build     # production build (outputs to dist/)
pnpm preview   # preview the production build
pnpm test      # run tests with Vitest
pnpm lint      # lint with ESLint
pnpm format    # format with Prettier + ESLint --fix
pnpm check     # check formatting without writing
```

## Environment Variables

Managed with `@t3-oss/env-core` in [src/env.ts](src/env.ts):

| Variable          | Side   | Required | Description                     |
| ----------------- | ------ | -------- | -------------------------------- |
| `SERVER_URL`      | server | no       | Base URL of the server           |
| `VITE_APP_TITLE`  | client | no       | Default app title (must be prefixed with `VITE_` to reach the client) |

Add new variables in `src/env.ts`, then read them via `import { env } from "#/env"`.

## Project Structure

```
src/
├── components/ui/          # shadcn-generated UI components
├── integrations/
│   └── tanstack-query/     # QueryClient setup + devtools panel
├── lib/
│   ├── utils.ts             # generic, cross-feature helpers (e.g. cn())
│   └── normalizeHostname.ts # generic hostname string helper
├── modules/                 # feature modules — one folder per feature
│   └── tenant/
│       ├── tenant.middleware.ts   # resolves tenant from Host header
│       ├── tenant.function.ts     # server fn exposing tenant to routes
│       ├── tenant.type.ts
│       └── index.ts               # public API barrel
├── routes/                 # file-based routes (TanStack Router)
│   ├── __root.tsx          # root layout, per-tenant <head> metadata
│   └── index.tsx           # home page, renders tenant branding
├── env.ts                  # typed environment variables
├── router.tsx               # router + query integration
└── start.ts                 # TanStack Start instance, request middleware
```

New features go in their own `src/modules/<feature>/` folder (server functions, middleware, types, components as needed) with an `index.ts` barrel as the public entry point. Reserve `src/lib/` for truly generic, cross-feature utilities.

## Adding a Route

Add a file under `src/routes`; TanStack Router generates the route tree automatically. Use `<Link to="/path">` from `@tanstack/react-router` to navigate between routes. See the [Routing docs](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts) for layouts, loaders, and nested routes.

## Adding UI Components

This project uses shadcn. Add new components with:

```bash
pnpm dlx shadcn@latest add <component>
```

## Deployment

The app builds to a self-contained Node server via Nitro:

```bash
pnpm build
node dist/server/index.mjs
```

Push the `dist/` directory to any Node-compatible host (Render, Fly.io, a VPS, etc.). For platform-specific presets (Vercel, Netlify, Cloudflare, AWS Lambda) and tuning, see the [Nitro deploy docs](https://v3.nitro.build/deploy). In production, tenant hostnames should be real domains/subdomains pointed at this deployment (with wildcard DNS/TLS for subdomain-based tenancy).

## Status / Roadmap

This is an early-stage starter. Notable gaps to fill in before production use:

- [ ] Replace the in-memory `tenantsDB` with a real data store
- [ ] Authentication and per-tenant user management
- [ ] Real onboarding flow (the current redirect target is a placeholder)
- [ ] Tenant-scoped data access / authorization
