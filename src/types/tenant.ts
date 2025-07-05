import { Metadata } from "next";

export interface Tenant {
    // Core Identity
    id: string;
    name: string;
    domain: string;
    slug: string;
    baseDomain?: string;

    // Meta
    metadata: {
        // Defaults
        root: Metadata;
        // ... other pages
    };

    // Theme & Template Configuration
    theme: {
        template: { id: string }; // page layout template
        style: { id: string; href?: string; mode: "light" | "dark" | "system" }; // theme
        // Custom branding
        branding: {
            logo?: string;
            favicon?: string;
        };
    };

    // Limits & Configuration
    featureFlags: string[]; // List of enabled feature flags like Blog, Calendar, etc.

    // Settings
    settings: {
        timezone: string;
        locale: string;
        contactEmail?: string;
    };

    // Subscription
    billingEmail: string;
    status: "trial" | "active" | "past_due" | "cancelled" | "suspended";
    trialEndsAt?: Date;
    currentPeriodEnd?: Date;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
}
