import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "#/lib/db"
import { tanstackStartCookies } from "better-auth/tanstack-start"

export const auth = betterAuth({
    trustedOrigins: async (request) => {
        if (!request) return [] // init / auth.api server-side calls — no Host to check

        // tenantMiddleware already resolved the tenant for this request and
        // stamped x-tenant-id in src/routes/api/auth/$.ts — its presence is
        // proof a valid tenant matched, no need to re-look-up by hostname here.
        const tenantId = request.headers.get("x-tenant-id")
        console.log("[trustedOrigins] x-tenant-id:", tenantId, "host:", request.headers.get("host"))
        if (!tenantId) return []

        const rawHost = request.headers.get("host") ?? ""
        const protocol = rawHost.includes("localhost") ? "http" : "https"
        return [`${protocol}://${rawHost}`]
    },
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    plugins: [tanstackStartCookies()],
})
