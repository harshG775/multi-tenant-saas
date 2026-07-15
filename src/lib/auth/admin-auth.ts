import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "#/lib/db"
import { tanstackStartCookies } from "better-auth/tanstack-start"
import * as schema from "#/lib/db/schema"

export const adminAuth = betterAuth({
    basePath: "/api/auth-admin",
    trustedOrigins: async (request) => {
        if (!request) return []

        // Same pattern as the site `auth` instance: x-tenant-id is only stamped
        // once tenantMiddleware resolved a real tenant for this Host.
        // TODO: also trust PLATFORM_HOST once /p/onboarding and /p/dashboard exist.
        const tenantId = request.headers.get("x-tenant-id")
        if (!tenantId) return []

        const rawHost = request.headers.get("host") ?? ""
        const protocol = rawHost.includes("localhost") ? "http" : "https"
        return [`${protocol}://${rawHost}`]
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
    user: {
        modelName: "admin",
    },
    session: {
        modelName: "adminSession",
        fields: {
            userId: "adminId",
        },
    },
    account: {
        modelName: "adminAccount",
        fields: {
            userId: "adminId",
        },
    },
    verification: {
        modelName: "adminVerification",
    },
    advanced: {
        cookiePrefix: "tenant-admin",
    },
    plugins: [tanstackStartCookies()],
})
