import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { ownerAuth } from "#/lib/auth/owner-auth";
import { db } from "#/lib/db";
import { rootDomain, siteOrigin } from "#/lib/server/host";

const siteHandle = (domain: { hostname: string; kind: "subdomain" | "custom" }) =>
    domain.kind === "subdomain" ? domain.hostname.slice(0, -(rootDomain.length + 1)) : domain.hostname;

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
        handle: siteHandle(domains[0]),
        url: siteOrigin(domains[0].hostname),
    }));
});
