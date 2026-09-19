import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { env } from "#/env";
import { db } from "#/lib/db";
import * as schema from "#/lib/db/schema/index";

export const userAuth = betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.PLATFORM_URL,
    basePath: "/api/v1/auth",
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema,
    }),
    plugins: [tanstackStartCookies()],
});
