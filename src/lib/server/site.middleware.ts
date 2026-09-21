import { createMiddleware } from "@tanstack/react-start";
import { getRequestHost, normalizeHost, rootDomain } from "./host";
import { findSiteByHostname, type Site } from "./site.lookup";

type HostKind = { type: "platform" } | { type: "subdomain"; subdomain: string } | { type: "custom"; hostname: string };

const classifyHost = (host: string | null): HostKind => {
    if (!host) {
        return { type: "platform" };
    }

    const hostname = normalizeHost(host);
    if (hostname === rootDomain) {
        return { type: "platform" };
    }

    if (hostname.endsWith(`.${rootDomain}`)) {
        return { type: "subdomain", subdomain: hostname.slice(0, -(rootDomain.length + 1)) };
    }

    return { type: "custom", hostname };
};

const findSite = (kind: Exclude<HostKind, { type: "platform" }>) =>
    findSiteByHostname(kind.type === "subdomain" ? `${kind.subdomain}.${rootDomain}` : kind.hostname);

export const siteMiddleware = createMiddleware({ type: "request" }).server(async ({ request, next }) => {
    const kind = classifyHost(getRequestHost(request.headers));

    let site: Site | null = null;

    if (kind.type !== "platform") {
        site = await findSite(kind);
    }

    // A host that isn't the platform but matches no site is answered with a 404 by the root route.
    return next({
        context: { site, unknownHost: kind.type !== "platform" && !site },
    });
});
