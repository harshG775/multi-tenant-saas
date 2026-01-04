import { createMiddleware } from "@tanstack/react-start"
import { resolveDomain } from "./utils"
type tenant = {
    id: string
    name: string
    subDomain: string
    createdAt: Date
    updatedAt: Date
}
const getTenantByDomain = async ({ subdomain }: { subdomain: string }): Promise<tenant | undefined> => {
    const tenantsSample = [
        {
            id: "tenant-12-34",
            name: "Multi tenant SAAS",
            subDomain: "tenant",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ]
    const tenant = tenantsSample.find((item) => item.subDomain === subdomain)
    return tenant
}

export const globalTenantMiddleware = createMiddleware({ type: "request" }).server(async ({ next, request }) => {
    const result = resolveDomain(request)
    let tenant: tenant | undefined
    if (result.subdomain) {
        tenant = await getTenantByDomain({ subdomain: result.subdomain })
    }
    return next({
        context: {
            tenant,
        },
    })
})
