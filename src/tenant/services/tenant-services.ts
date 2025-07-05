import { Tenant } from "@/types/tenant";

export async function getTenantByDomain(domain: string): Promise<Tenant | null> {
    // In production, this would query your database

    const tenant = tenants.find((t) => t.domain === domain || domain.includes(t.domain));
    return tenant || null;
}

export const tenants: Tenant[] = [
    {
        id: "tenant_001",
        name: "AstroZone",
        domain: "astrozone.localhost",
        slug: "astrozone",
        baseDomain: "astrohub.app",

        metadata: {
            root: {
                title: "AstroZone",
                description: "Get personalized astrology readings from AstroZone experts.",
            },
        },

        theme: {
            template: { id: "classic" },
            style: {
                id: "astro-light",
                mode: "light",
                href: "/themes/styles/sunset-horizon.css",
            },
            branding: {
                logo: "https://picsum.photos/seed/astrozone-logo/200/60",
                favicon: "https://picsum.photos/seed/astrozone-favicon/32/32",
            },
        },

        featureFlags: ["blog", "chat", "booking"],

        settings: {
            timezone: "Asia/Kolkata",
            locale: "en-IN",
            contactEmail: "support@astrozone.com",
        },

        billingEmail: "billing@astrozone.com",
        status: "active",
        trialEndsAt: new Date("2025-08-01"),
        currentPeriodEnd: new Date("2025-12-31"),

        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-07-01"),
        createdBy: "admin_001",
    },
    {
        id: "tenant_002",
        name: "StarGaze",
        domain: "stargaze.localhost",
        slug: "stargaze",

        metadata: {
            root: {
                title: "StarGaze",
                description: "Your personal gateway to the stars and future predictions.",
            },
        },

        theme: {
            template: { id: "modern" },
            style: {
                id: "stargaze-dark",
                mode: "dark",
                href: "/themes/styles/default.css",
            },
            branding: {
                logo: "https://picsum.photos/seed/stargaze-logo/200/60",
                favicon: "https://picsum.photos/seed/stargaze-favicon/32/32",
            },
        },

        featureFlags: ["booking", "calendar"],

        settings: {
            timezone: "America/New_York",
            locale: "en-US",
            contactEmail: "contact@stargaze.io",
        },

        billingEmail: "finance@stargaze.io",
        status: "trial",
        trialEndsAt: new Date("2025-07-30"),

        createdAt: new Date("2025-06-01"),
        updatedAt: new Date("2025-07-01"),
        createdBy: "admin_002",
    },
];
