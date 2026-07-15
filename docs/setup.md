# Setup

## Environment variables

Defined and validated in [src/env.ts](../src/env.ts) unless noted otherwise.

| Variable             | Side   | Required | Purpose                                                                 |
| --------------------- | ------ | -------- | ------------------------------------------------------------------------ |
| `DATABASE_URL`        | server | yes      | Neon Postgres connection string, used by both the app's Drizzle client (`src/lib/db/index.ts`) and `drizzle-kit` (`drizzle.config.ts`) |
| `SERVER_URL`           | server | no       | Base URL of the server                                                 |
| `BETTER_AUTH_SECRET`   | server | yes      | better-auth's signing secret. Read directly by better-auth from `process.env` — **not** validated by `src/env.ts` (tracked as a gap in [auth.md](./auth.md)) |
| `VITE_APP_TITLE`       | client | no       | Default app title. Must keep the `VITE_` prefix to be exposed to client code |

`emptyStringAsUndefined: true` is set in `src/env.ts`, so a blank value in `.env` is treated as unset, not as an empty string.

## Local services

- **Postgres**: this project uses Neon's HTTP driver (`@neondatabase/serverless`, `neon-http` adapter in `src/lib/db/index.ts`), so `DATABASE_URL` must point at an actual Neon database (or a Neon local proxy) — a plain local `postgres://` instance won't work as a drop-in replacement.
- **No hosts file / wildcard DNS needed for local dev.** Modern browsers and OSes resolve any `*.localhost` hostname to `127.0.0.1` automatically. `src/lib/normalizeHostname.ts` strips the `.localhost` suffix and port so `tenant-1.com.localhost:3000` normalizes to `tenant-1.com` for tenant lookup.

## Running locally

```bash
pnpm install
cp .env.example .env      # fill in DATABASE_URL and BETTER_AUTH_SECRET
pnpm db:push               # or: pnpm db:generate && pnpm db:migrate
pnpm dev
```

Visit a seeded tenant hostname, not plain `localhost`:

- http://tenant-1.com.localhost:3000
- http://tenant-2.com.localhost:3000

## Gotchas

- The app **throws at startup** if `DATABASE_URL` is unset — `src/env.ts` declares it as a required `z.string()` with no default.
- Seeded tenants (`tenant-1.com`, `tenant-2.com`) are a hardcoded array (`tenantsDB`) in [src/modules/tenant/tenant.middleware.ts](../src/modules/tenant/tenant.middleware.ts), not the `tenant` DB table — the table exists in the schema but nothing queries it yet. Any hostname not in that array, including plain `http://localhost:3000`, redirects to the placeholder onboarding URL (`https://onboard.yourapp.com`).
- `drizzle-kit` commands (`db:generate`/`migrate`/`push`/`pull`) load env vars via `dotenv` directly from `.env`/`.env.local` (see `drizzle.config.ts`) — this is separate from, and doesn't go through, `src/env.ts`'s validation.
