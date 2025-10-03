"use server";
import { headers } from "next/headers";
import { type Tenant } from "@/types/tenant";
import { getTenantByDomain } from "../services/tenant-services";
import { cache } from "react";

export const resolveTenant = cache(async function (): Promise<Tenant> {
    const headersList = await headers();
    const host = headersList.get("x-tenant") || "default";
    const tenantKey = host.split(".")[0];
    if (!tenantKey) {
        throw new Error("Tenant header missing in request");
    }

    const tenant = await getTenantByDomain(tenantKey);
    if (!tenant) {
        throw new Error(`Tenant not found for key: ${tenantKey}`);
    }

    return tenant;
});
