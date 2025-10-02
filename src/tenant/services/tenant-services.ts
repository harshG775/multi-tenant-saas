import { Tenant } from "@/types/tenant";

export async function getTenantByDomain(domain: string): Promise<Tenant | null> {
    // In production, this would query your database
    const tenant = tenants.find((t) => t.domain === domain || domain.includes(t.domain));
    return tenant || null;
}

// db simultaion for testing
export const tenants: Tenant[] = [
    {
        id: "facebook",
        name: "Facebook",
        domain: "facebook",
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "admin_001",
    },
    {
        id: "youtube",
        name: "Youtube",
        domain: "youtube",
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "admin_001",
    },
];
