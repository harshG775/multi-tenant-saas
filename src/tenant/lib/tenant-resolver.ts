import { headers } from "next/headers";
import { getTenantByDomain, type Tenant } from "../services/tenant-services";

export async function resolveTenant(): Promise<Tenant> {
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
}
