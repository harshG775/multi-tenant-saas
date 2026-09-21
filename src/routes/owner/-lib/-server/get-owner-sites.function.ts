import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { ownerAuth } from "#/lib/auth/owner-auth";
import { db } from "#/lib/db";
import { siteOrigin } from "#/lib/server/host";

export const getOwnerSitesFn = createServerFn({ method: "GET" }).handler(async () => {
    const session = await ownerAuth.api.getSession({ headers: getRequestHeaders() });
    if (!session) {
        throw new Error("Unauthorized");
    }

    const sites = await db.query.site.findMany({
        where: { ownerId: session.user.id },
        with: { domains: { where: { isPrimary: true } } },
        orderBy: { createdAt: "desc" },
    });

    return sites.map(({ id, name, createdAt, domains }) => ({
        id,
        name,
        createdAt,
        url: domains[0] ? siteOrigin(domains[0].hostname) : null,
    }));
});
