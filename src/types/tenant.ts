import { Metadata } from "next";

export interface Theme {
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
}

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
    theme: Theme;

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

    // Meta
    metadata: Metadata;
}
