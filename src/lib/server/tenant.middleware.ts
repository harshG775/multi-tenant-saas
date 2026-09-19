import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { env } from "#/env";

type Tenant = { id: string; hostname: string };

type HostKind = { type: "platform" } | { type: "subdomain"; subdomain: string } | { type: "custom"; hostname: string };

const normalizeHost = (host: string) => host.toLowerCase().replace(/:\d+$/, "").replace(/\.$/, "");

const rootDomain = normalizeHost(new URL(env.PLATFORM_URL).hostname);

const getRequestHost = (headers: Headers) =>
    headers.get("x-forwarded-host")?.split(",")[0]?.trim() || headers.get("host");

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

// TODO: replace with a DB lookup (subdomain or custom hostname -> tenant)
const findTenant = (kind: Exclude<HostKind, { type: "platform" }>): Tenant | null => {
    if (kind.type === "subdomain" && kind.subdomain === "tenant-1") {
        return { id: "tenant-1", hostname: `tenant-1.${rootDomain}` };
    }
    return null;
};

export const tenantMiddleware = createMiddleware({ type: "request" }).server(async ({ request, next }) => {
    const kind = classifyHost(getRequestHost(request.headers));

    let tenant: Tenant | null = null;

    if (kind.type !== "platform") {
        tenant = findTenant(kind);

        if (!tenant) {
            throw redirect({
                href: env.PLATFORM_URL,
            });
        }
    }

    return next({
        context: { tenant },
    });
});
