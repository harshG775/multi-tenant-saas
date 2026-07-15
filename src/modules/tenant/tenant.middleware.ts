import { createMiddleware } from "@tanstack/react-start"
import { normalizeHostname } from "#/lib/normalizeHostname"

const tenantsDB = [
    {
        id: "tenant-1",
        hostname: "tenant-1.com",
        meta: {
            name: "Tenant One",
            description: "Tenant One is a modern SaaS platform.",
            logo: "https://picsum.photos/seed/tenant1/200/200",
            favicon: "https://picsum.photos/seed/tenant1/32/32",
        },
    },
    {
        id: "tenant-2",
        hostname: "tenant-2.com",
        meta: {
            name: "Tenant Two",
            description: "Tenant Two helps businesses scale fast.",
            logo: "https://picsum.photos/seed/tenant2/200/200",
            favicon: "https://picsum.photos/seed/tenant2/32/32",
        },
    },
]
export const findTenantByHostname = (hostname: string) => tenantsDB.find((t) => t.hostname === hostname) ?? null

const platformHosts = new Set(["app.platform.com"])

export const tenantMiddleware = createMiddleware({ type: "request" }).server(async ({ request, next }) => {
    const hostname = normalizeHostname(request.headers.get("host") ?? "")

    if (platformHosts.has(hostname)) {
        return next({
            context: { tenant: null },
        })
    }

    const tenant = findTenantByHostname(hostname)
    return next({
        context: { tenant },
    })
})
