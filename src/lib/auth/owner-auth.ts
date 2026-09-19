import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { env } from "#/env";
import { db } from "#/lib/db";
import * as schema from "#/lib/db/schema/index";
import { getRequestHost, normalizeHost } from "#/lib/server/host";
import { findSiteByHostname } from "#/lib/server/site.lookup";

const platformProtocol = new URL(env.PLATFORM_URL).protocol;

/** Auth for site owners. Served on the platform host and on each site's own host (`/admin`). */
export const ownerAuth = betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.PLATFORM_URL,
    basePath: "/api/v1/auth/owner",
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema,
    }),
    emailAndPassword: { enabled: true },
    user: { modelName: "ownerUser" },
    session: { modelName: "ownerSession" },
    account: { modelName: "ownerAccount" },
    verification: { modelName: "ownerVerification" },
    advanced: { cookiePrefix: "owner" },
    trustedOrigins: async (request) => {
        const origins = [env.PLATFORM_URL];

        // `request` is undefined during init and direct `auth.api` calls.
        const host = request ? getRequestHost(request.headers) : null;
        if (host && (await findSiteByHostname(normalizeHost(host)))) {
            origins.push(`${platformProtocol}//${host}`);
        }

        return origins;
    },
    plugins: [tanstackStartCookies()],
});
