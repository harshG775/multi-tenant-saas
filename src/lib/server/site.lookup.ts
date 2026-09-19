import { db } from "#/lib/db";

export type Site = { id: string; name: string; hostname: string };

/** Resolves a normalized hostname (no port) to its site. Custom domains must be verified. */
export const findSiteByHostname = async (hostname: string): Promise<Site | null> => {
    const domain = await db.query.siteDomain.findFirst({
        where: { hostname },
        with: { site: true },
    });

    if (!domain?.site || (domain.kind === "custom" && !domain.verifiedAt)) {
        return null;
    }

    return { id: domain.site.id, name: domain.site.name, hostname: domain.hostname };
};
