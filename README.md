# multi-tenant-saas

A multi-tenant site builder. Each tenant gets a dedicated public site and admin, served from a subdomain or a custom domain.

## Stack

TanStack Start · Better Auth · Drizzle ORM · Neon Postgres · Tailwind CSS 4 · shadcn/ui · Biome

## Setup

```bash
pnpm install
cp .env.example .env
pnpm db:migrate
pnpm dev
```

### Environment

| Variable             | Description                                                              |
| -------------------- | ------------------------------------------------------------------------ |
| `PLATFORM_URL`       | The platform's own origin, e.g. `http://localhost:3000`                  |
| `DATABASE_URL`       | Neon Postgres connection string                                          |
| `BETTER_AUTH_SECRET` | Random secret, at least 32 characters                                    |

## Tenant resolution

The host header is matched against the hostname of `PLATFORM_URL`:

| Host                    | Resolves to                          |
| ----------------------- | ------------------------------------ |
| `localhost:3000`        | Platform (marketing, signup)         |
| `<name>.localhost:3000` | Tenant subdomain                     |
| any other host          | Tenant custom domain                 |

`*.localhost` resolves automatically in modern browsers, so no hosts-file edits are needed in development.

## Scripts

| Script                            | Description                  |
| --------------------------------- | ---------------------------- |
| `pnpm dev`                        | Start the dev server         |
| `pnpm build`                      | Production build             |
| `pnpm check`                      | Biome lint and format        |
| `pnpm db:generate`                | Generate a Drizzle migration |
| `pnpm db:migrate`                 | Apply migrations             |
| `pnpm db:studio`                  | Open Drizzle Studio          |
