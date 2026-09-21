import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { env } from "#/env";
import { ownerAuth } from "#/lib/auth/owner-auth";
import { db } from "#/lib/db";
import { siteOrigin } from "#/lib/server/host";

/** Query key for the cached result of `getOwnerStateFn`; invalidate it whenever the session or the owned site changes. */
export const ownerStateKey = ["owner-state"] as const;

/** Who is signed in as an owner, and the site they own (if any). Shared by every `/owner/*` route guard. */
export const getOwnerStateFn = createServerFn({ method: "GET" }).handler(async () => {
    const platformHost = new URL(env.PLATFORM_URL).host;

    const session = await ownerAuth.api.getSession({ headers: getRequestHeaders() });
    if (!session) {
        return { owner: null, ownedSite: null, platformHost };
    }

    const found = await db.query.site.findFirst({
        where: { ownerId: session.user.id },
        with: { domains: true },
    });
    const domain = found?.domains.find((d) => d.isPrimary) ?? found?.domains[0];

    return {
        owner: { id: session.user.id, name: session.user.name, email: session.user.email },
        ownedSite: found && domain ? { id: found.id, name: found.name, url: siteOrigin(domain.hostname) } : null,
        platformHost,
    };
});
