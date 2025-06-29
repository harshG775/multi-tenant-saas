import { Tenant } from "@/types/tenant";

export async function getTenantByDomain(domain: string): Promise<Tenant | null> {
    // In production, this would query your database

    const tenant = tenants.find((t) => t.domain === domain || domain.includes(t.domain));
    return tenant || null;
}


const tenants: Tenant[] = [
    {
        id: "tenant-demo",
        name: "Demo Company Ltd",
        domain: "multi-tenant-saas-delta.vercel.app",
        slug: "demo-company",
        status: "active",

        planId: "plan-pro",
        billingEmail: "billing@democompany.com",
        subscriptionStatus: "active",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),

        userLimit: 50,
        storageLimit: 10 * 1024 * 1024 * 1024,
        apiRateLimit: 1000,
        featureFlags: ["advanced-analytics", "custom-branding", "api-access"],

        theme: {
            mode: "light",
            colors: {
                primary: "oklch(0.646 0.222 41.116)",
                primaryForeground: "oklch(0.985 0.002 247.839)",
                accent: "oklch(0.6 0.118 184.704)",
            },
            branding: {
                logo: "https://picsum.photos/200/200?random=1",
                favicon: "https://picsum.photos/32/32?random=1",
            },
            radius: "0.75rem",
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
        createdBy: "user-admin",

        metadata: {
            title: { default: "Demo Company", template: "%s - Demo Company" },
            description: "Demo Company SaaS tenant",
            icons: { icon: "https://picsum.photos/32/32?random=1" },
            openGraph: {
                title: "Demo Company",
                description: "Explore the Demo Company portal.",
                images: ["https://picsum.photos/1200/630?random=1"],
            },
        },
    },
    {
        id: "tenant-fintechx",
        name: "FintechX Solutions",
        domain: "fintechx.localhost",
        slug: "fintechx",
        status: "active",
        planId: "plan-enterprise",
        billingEmail: "accounts@fintechx.com",
        subscriptionStatus: "active",
        currentPeriodEnd: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        userLimit: 100,
        storageLimit: 50 * 1024 * 1024 * 1024,
        apiRateLimit: 5000,
        featureFlags: ["advanced-analytics", "audit-logs", "priority-support"],
        theme: {
            mode: "dark",
            colors: {
                primary: "oklch(0.35 0.25 240)",
                primaryForeground: "oklch(0.95 0.02 250)",
                destructive: "oklch(0.5 0.15 27)",
            },
            branding: {
                logo: "https://picsum.photos/200/200?random=2",
                favicon: "https://picsum.photos/32/32?random=2",
            },
            radius: "0.5rem",
        },
        settings: {
            timezone: "America/New_York",
            locale: "en-US",
            contactEmail: "support@fintechx.com",
            industry: "Finance",
            companySize: "51-200",
            allowPublicSignup: true,
            requireEmailVerification: true,
        },
        createdAt: new Date("2023-11-01T09:00:00Z"),
        updatedAt: new Date(),
        createdBy: "user-fintech-admin",
        metadata: {
            title: { default: "FintechX", template: "%s - FintechX" },
            description: "FintechX enterprise tenant",
            icons: { icon: "https://picsum.photos/32/32?random=2" },
            openGraph: {
                title: "FintechX",
                description: "Manage your finance SaaS experience.",
                images: ["https://picsum.photos/1200/630?random=2"],
            },
        },
    },
    {
        id: "tenant-edunova",
        name: "EduNova Pvt Ltd",
        domain: "edunova.localhost",
        slug: "edunova",
        status: "trial",
        planId: "plan-startup",
        billingEmail: "billing@edunova.com",
        subscriptionStatus: "trial",
        trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userLimit: 10,
        storageLimit: 5 * 1024 * 1024 * 1024,
        apiRateLimit: 500,
        featureFlags: ["basic-analytics"],
        theme: {
            mode: "light",
            colors: {
                primary: "oklch(0.6 0.19 130)",
                primaryForeground: "oklch(0.98 0.01 90)",
            },
            branding: {
                logo: "https://picsum.photos/200/200?random=3",
                favicon: "https://picsum.photos/32/32?random=3",
            },
            radius: "0.375rem",
        },
        settings: {
            timezone: "Asia/Singapore",
            locale: "en-SG",
            contactEmail: "hello@edunova.com",
            industry: "Education",
            companySize: "1-10",
            allowPublicSignup: true,
            requireEmailVerification: false,
        },
        createdAt: new Date("2025-06-01T12:00:00Z"),
        updatedAt: new Date(),
        createdBy: "user-edunova-founder",
        metadata: {
            title: { default: "EduNova", template: "%s - EduNova" },
            description: "Education-focused startup tenant",
            icons: { icon: "https://picsum.photos/32/32?random=3" },
            openGraph: {
                title: "EduNova",
                description: "Learn and grow with EduNova.",
                images: ["https://picsum.photos/1200/630?random=3"],
            },
        },
    },
    {
        id: "tenant-mediquant",
        name: "MediQuant Inc",
        domain: "mediquant.localhost",
        slug: "mediquant",
        status: "suspended",
        planId: "plan-pro",
        billingEmail: "billing@mediquant.com",
        subscriptionStatus: "past_due",
        userLimit: 25,
        storageLimit: 20 * 1024 * 1024 * 1024,
        apiRateLimit: 1500,
        featureFlags: ["custom-branding", "api-access"],
        theme: {
            mode: "system",
            colors: {
                primary: "oklch(0.45 0.21 20)",
                primaryForeground: "oklch(0.95 0.02 245)",
                destructive: "oklch(0.4 0.18 20)",
            },
            branding: {
                logo: "https://picsum.photos/200/200?random=4",
                favicon: "https://picsum.photos/32/32?random=4",
            },
            radius: "0.25rem",
        },
        settings: {
            timezone: "Europe/London",
            locale: "en-GB",
            contactEmail: "contact@mediquant.com",
            industry: "Healthcare",
            companySize: "201-500",
            allowPublicSignup: false,
            requireEmailVerification: true,
        },
        createdAt: new Date("2023-08-15T08:30:00Z"),
        updatedAt: new Date(),
        createdBy: "user-mediquant-ceo",
        metadata: {
            title: { default: "MediQuant", template: "%s - MediQuant" },
            description: "Healthcare analytics provider",
            icons: { icon: "https://picsum.photos/32/32?random=4" },
            openGraph: {
                title: "MediQuant",
                description: "Healthcare analytics and insights.",
                images: ["https://picsum.photos/1200/630?random=4"],
            },
        },
    },
];