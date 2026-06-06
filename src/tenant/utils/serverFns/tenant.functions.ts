// src/lib/serverFns/tenant.functions.ts

import { createServerFn } from "@tanstack/react-start"
import { getRequestUrl } from "@tanstack/react-start/server"
import { normalizeHostname } from "#/tenant/utils/normalizeHostname"
import { getTenantConfigByHostname } from "#/tenant/lib/api"
import type { TenantType } from "#/tenant/types/tenant.type"

export const getTenantConfigFn = createServerFn().handler(async (): Promise<TenantType> => {
    const url = getRequestUrl()

    const hostname = normalizeHostname(url.hostname)

    const tenantConfig = getTenantConfigByHostname({ hostname })

    if (!tenantConfig) {
        throw new Response("Tenant Not Found", { status: 404 })
    }

    return tenantConfig
})
