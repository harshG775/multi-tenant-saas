import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { env } from "#/env";
import { getRequestHost, normalizeHost } from "./host";
import { findSiteByHostname, type Site } from "./site.lookup";

type HostKind = { type: "platform" } | { type: "subdomain"; subdomain: string } | { type: "custom"; hostname: string };

const rootDomain = normalizeHost(new URL(env.PLATFORM_URL).hostname);

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

export const tenantMiddleware = createMiddleware({ type: "request" }).server(async ({ request, next }) => {
    const kind = classifyHost(getRequestHost(request.headers));

    let site: Site | null = null;

    if (kind.type !== "platform") {
        site = await findSite(kind);

        if (!site) {
            throw redirect({
                href: env.PLATFORM_URL,
            });
        }
    }

    return next({
        context: { site },
    });
});
