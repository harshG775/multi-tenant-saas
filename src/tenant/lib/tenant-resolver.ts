import { headers } from "next/headers";
import { type Tenant } from "@/types/tenant";
import { getTenantByDomain } from "../services/tenant-services";
import { cache } from "react";

export const resolveTenant = cache(async function (): Promise<Tenant> {
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";

    // Extract domain from host (remove port if present)
    const domain = host.split(":")[0];

    const tenant = await getTenantByDomain(domain);
    if (!tenant) {
        // Handle tenant not found - redirect to main site or show error
        throw new Error(`Tenant not found for domain: ${domain}`);
    }

    return tenant;
});
