# Multi-Tenant SaaS

A multi-tenant SaaS starter on TanStack Start that resolves the tenant per-request from the `Host` header, so one deployment serves multiple branded domains/subdomains.

## Tech Stack

- TanStack Start
- TanStack Router
- TanStack Query
- React 19 + React Compiler
- Vite + Nitro
- Tailwind CSS v4 + shadcn/ui
- Drizzle ORM + Neon (serverless Postgres)
- better-auth
- Zod + T3 Env
- Vitest
- TypeScript, ESLint, Prettier

## Quick Start

```bash
git clone <repo-url>
cd multi-tenant-saas
pnpm install
cp .env.example .env   # fill in DATABASE_URL and BETTER_AUTH_SECRET
pnpm db:push
pnpm dev
```

App runs at http://localhost:3000.

See [docs/README.md](docs/README.md) for setup details, architecture, auth, and design decisions.
