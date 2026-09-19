import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { env } from "#/env";

type Tenant = { id: string; subdomain: string };

const parseHostname = (host: string | null): { domain: string; subdomain: string | null } => {
    if (!host) {
        return { domain: "", subdomain: null };
    }

    const hostname = host.replace(/:\d+$/, "");
    const parts = hostname.split(".");

    // localhost has a single-label root (tenant-1.localhost), real domains have two (tenant-1.app.com)
    const rootLabels = hostname.endsWith("localhost") ? 1 : 2;

    if (parts.length <= rootLabels) {
        return { domain: hostname, subdomain: null };
    }

    return {
        domain: parts.slice(-rootLabels).join("."),
        subdomain: parts.slice(0, -rootLabels).join("."),
    };
};

export const tenantMiddleware = createMiddleware({ type: "request" }).server(async ({ request, next }) => {
    const { subdomain } = parseHostname(request.headers.get("host"));

    let tenant: Tenant | null = null;

    if (subdomain) {
        tenant = subdomain === "tenant-1" ? { id: "tenant-1", subdomain } : null;

        if (!tenant) {
            throw redirect({
                href: env.SERVER_URL,
            });
        }
    }

    return next({
        context: { tenant },
    });
});
