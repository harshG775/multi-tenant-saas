import { api } from "@/lib/api"
import { createMiddleware } from "@tanstack/react-start"
import { resolveDomain } from "./utils"

export const globalTenantMiddleware = createMiddleware({ type: "request" }).server(async ({ next, request }) => {
    const result = resolveDomain(request)
    let tenant
    if (result.subdomain) {
        tenant = await api.getTenantByDomain({ subdomain: result.subdomain })
    }
    return next({
        context: {
            tenant,
        },
    })
})
