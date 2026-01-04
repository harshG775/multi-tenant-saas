export type TenantType = {
    id: string
    name: string
    subDomain: string
    createdAt: Date
    updatedAt: Date
}

const tenantsSample = [
    {
        id: "tenant-12-34",
        name: "Multi tenant SAAS",
        subDomain: "tenant",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
]
export const getTenantByDomain = async ({ subdomain }: { subdomain: string }): Promise<TenantType | undefined> => {
    const tenant = tenantsSample.find((item) => item.subDomain === subdomain)
    return tenant
}
