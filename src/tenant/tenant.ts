export interface Tenant {
    // Core Identity
    id: string;
    name: string;
    domain: string;
    slug: string;
    status: "active" | "suspended" | "trial" | "cancelled";

    // Subscription & Billing
    planId: string;
    billingEmail: string;
    subscriptionStatus: "trial" | "active" | "past_due" | "cancelled";
    trialEndsAt?: Date;
    currentPeriodEnd?: Date;

    // Limits & Configuration
    userLimit: number;
    storageLimit: number; // in bytes
    apiRateLimit: number; // per hour
    featureFlags: string[];

    // Theme Configuration (OKLCH values for Tailwind v4)
    theme: {
        mode: "light" | "dark" | "system";
        // Core brand colors (OKLCH format)
        colors: {
            primary: string; // oklch(0.21 0.034 264.665)
            primaryForeground: string; // oklch(0.985 0.002 247.839)
            accent?: string; // Optional accent override
            destructive?: string; // Optional destructive override
        };
        // Custom branding
        branding: {
            logo?: string;
            favicon?: string;
            customCss?: string;
        };
        // Component overrides
        radius?: string; // CSS border-radius value
    };

    // Settings & Metadata
    settings: {
        timezone: string;
        locale: string;
        contactEmail?: string;
        industry?: string;
        companySize?: string;
        allowPublicSignup: boolean;
        requireEmailVerification: boolean;
        [key: string]: any;
    };

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
}

export async function getTenantByDomain(domain: string): Promise<Tenant | null> {
    // In production, this would query your database

    if (domain === "multi-tenant-saas.vercel.app" || domain === "localhost" || domain === "127.0.0.1") {
        const dummyTenant: Tenant = {
            id: "tenant-demo-001",
            name: "Demo Company Ltd",
            domain: domain,
            slug: "demo-company",
            status: "active",

            planId: "plan-pro",
            billingEmail: "billing@democompany.com",
            subscriptionStatus: "active",
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),

            userLimit: 50,
            storageLimit: 10 * 1024 * 1024 * 1024, // 10GB
            apiRateLimit: 1000,
            featureFlags: ["advanced-analytics", "custom-branding", "api-access"],

            theme: {
                mode: "light",
                colors: {
                    primary: "oklch(0.646 0.222 41.116)", // Orange primary
                    primaryForeground: "oklch(0.985 0.002 247.839)",
                    accent: "oklch(0.6 0.118 184.704)", // Custom accent
                },
                branding: {
                    logo: "/logos/demo-company.png",
                    favicon: "/favicons/demo-company.ico",
                },
                radius: "0.75rem", // Slightly more rounded than default
            },

            settings: {
                timezone: "Asia/Kolkata",
                locale: "en-IN",
                contactEmail: "support@democompany.com",
                industry: "Technology",
                companySize: "11-50",
                allowPublicSignup: false,
                requireEmailVerification: true,
            },

            createdAt: new Date("2024-01-15T10:00:00Z"),
            updatedAt: new Date("2024-12-01T14:30:00Z"),
            createdBy: "user-admin-001",
        };

        return dummyTenant;
    }

    return null;
}
