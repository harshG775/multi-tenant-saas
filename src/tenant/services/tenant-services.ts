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
            customCss: `
:root {
    /* Sunset Horizon */
    --background: oklch(0.9856 0.0084 56.3169);
    --foreground: oklch(0.3353 0.0132 2.7676);
    --card: oklch(1 0 0);
    --card-foreground: oklch(0.3353 0.0132 2.7676);
    --popover: oklch(1 0 0);
    --popover-foreground: oklch(0.3353 0.0132 2.7676);
    --primary: oklch(0.7357 0.1641 34.7091);
    --primary-foreground: oklch(1 0 0);
    --secondary: oklch(0.9596 0.02 28.9029);
    --secondary-foreground: oklch(0.5587 0.1294 32.7364);
    --muted: oklch(0.9656 0.0176 39.4009);
    --muted-foreground: oklch(0.5534 0.0116 58.0708);
    --accent: oklch(0.8278 0.1131 57.9984);
    --accent-foreground: oklch(0.3353 0.0132 2.7676);
    --destructive: oklch(0.6122 0.2082 22.241);
    --destructive-foreground: oklch(1 0 0);
    --border: oklch(0.9296 0.037 38.6868);
    --input: oklch(0.9296 0.037 38.6868);
    --ring: oklch(0.7357 0.1641 34.7091);
    --chart-1: oklch(0.7357 0.1641 34.7091);
    --chart-2: oklch(0.8278 0.1131 57.9984);
    --chart-3: oklch(0.8773 0.0763 54.9314);
    --chart-4: oklch(0.82 0.1054 40.8859);
    --chart-5: oklch(0.6368 0.1306 32.0721);
    --sidebar: oklch(0.9656 0.0176 39.4009);
    --sidebar-foreground: oklch(0.3353 0.0132 2.7676);
    --sidebar-primary: oklch(0.7357 0.1641 34.7091);
    --sidebar-primary-foreground: oklch(1 0 0);
    --sidebar-accent: oklch(0.8278 0.1131 57.9984);
    --sidebar-accent-foreground: oklch(0.3353 0.0132 2.7676);
    --sidebar-border: oklch(0.9296 0.037 38.6868);
    --sidebar-ring: oklch(0.7357 0.1641 34.7091);
    --font-sans: Montserrat, sans-serif;
    --font-serif: Merriweather, serif;
    --font-mono: Ubuntu Mono, monospace;
    --radius: 0.625rem;
    --shadow-2xs: 0px 6px 12px -3px hsl(0 0% 0% / 0.04);
    --shadow-xs: 0px 6px 12px -3px hsl(0 0% 0% / 0.04);
    --shadow-sm: 0px 6px 12px -3px hsl(0 0% 0% / 0.09), 0px 1px 2px -4px hsl(0 0% 0% / 0.09);
    --shadow: 0px 6px 12px -3px hsl(0 0% 0% / 0.09), 0px 1px 2px -4px hsl(0 0% 0% / 0.09);
    --shadow-md: 0px 6px 12px -3px hsl(0 0% 0% / 0.09), 0px 2px 4px -4px hsl(0 0% 0% / 0.09);
    --shadow-lg: 0px 6px 12px -3px hsl(0 0% 0% / 0.09), 0px 4px 6px -4px hsl(0 0% 0% / 0.09);
    --shadow-xl: 0px 6px 12px -3px hsl(0 0% 0% / 0.09), 0px 8px 10px -4px hsl(0 0% 0% / 0.09);
    --shadow-2xl: 0px 6px 12px -3px hsl(0 0% 0% / 0.22);
}

.dark {
    /* Sunset Horizon Dark */
    --background: oklch(0.2569 0.0169 352.4042);
    --foreground: oklch(0.9397 0.0119 51.3156);
    --card: oklch(0.3184 0.0176 341.4465);
    --card-foreground: oklch(0.9397 0.0119 51.3156);
    --popover: oklch(0.3184 0.0176 341.4465);
    --popover-foreground: oklch(0.9397 0.0119 51.3156);
    --primary: oklch(0.7357 0.1641 34.7091);
    --primary-foreground: oklch(1 0 0);
    --secondary: oklch(0.3637 0.0203 342.2664);
    --secondary-foreground: oklch(0.9397 0.0119 51.3156);
    --muted: oklch(0.3184 0.0176 341.4465);
    --muted-foreground: oklch(0.8378 0.0237 52.6346);
    --accent: oklch(0.8278 0.1131 57.9984);
    --accent-foreground: oklch(0.2569 0.0169 352.4042);
    --destructive: oklch(0.6122 0.2082 22.241);
    --destructive-foreground: oklch(1 0 0);
    --border: oklch(0.3637 0.0203 342.2664);
    --input: oklch(0.3637 0.0203 342.2664);
    --ring: oklch(0.7357 0.1641 34.7091);
    --chart-1: oklch(0.7357 0.1641 34.7091);
    --chart-2: oklch(0.8278 0.1131 57.9984);
    --chart-3: oklch(0.8773 0.0763 54.9314);
    --chart-4: oklch(0.82 0.1054 40.8859);
    --chart-5: oklch(0.6368 0.1306 32.0721);
    --sidebar: oklch(0.2569 0.0169 352.4042);
    --sidebar-foreground: oklch(0.9397 0.0119 51.3156);
    --sidebar-primary: oklch(0.7357 0.1641 34.7091);
    --sidebar-primary-foreground: oklch(1 0 0);
    --sidebar-accent: oklch(0.8278 0.1131 57.9984);
    --sidebar-accent-foreground: oklch(0.2569 0.0169 352.4042);
    --sidebar-border: oklch(0.3637 0.0203 342.2664);
    --sidebar-ring: oklch(0.7357 0.1641 34.7091);
    --font-sans: Montserrat, sans-serif;
    --font-serif: Merriweather, serif;
    --font-mono: Ubuntu Mono, monospace;
    --radius: 0.625rem;
    --shadow-2xs: 0px 6px 12px -3px hsl(0 0% 0% / 0.04);
    --shadow-xs: 0px 6px 12px -3px hsl(0 0% 0% / 0.04);
    --shadow-sm: 0px 6px 12px -3px hsl(0 0% 0% / 0.09), 0px 1px 2px -4px hsl(0 0% 0% / 0.09);
    --shadow: 0px 6px 12px -3px hsl(0 0% 0% / 0.09), 0px 1px 2px -4px hsl(0 0% 0% / 0.09);
    --shadow-md: 0px 6px 12px -3px hsl(0 0% 0% / 0.09), 0px 2px 4px -4px hsl(0 0% 0% / 0.09);
    --shadow-lg: 0px 6px 12px -3px hsl(0 0% 0% / 0.09), 0px 4px 6px -4px hsl(0 0% 0% / 0.09);
    --shadow-xl: 0px 6px 12px -3px hsl(0 0% 0% / 0.09), 0px 8px 10px -4px hsl(0 0% 0% / 0.09);
    --shadow-2xl: 0px 6px 12px -3px hsl(0 0% 0% / 0.22);
}`,
            branding: {
                logo: "https://picsum.photos/200/200?random=1",
                favicon: "https://picsum.photos/32/32?random=1",
            },
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
            customCss: `
:root {
    /* Sunset Horizon */
    --background: oklch(0.9856 0.0084 56.3169);
    --foreground: oklch(0.3353 0.0132 2.7676);
    --card: oklch(1 0 0);
    --card-foreground: oklch(0.3353 0.0132 2.7676);
    --popover: oklch(1 0 0);
    --popover-foreground: oklch(0.3353 0.0132 2.7676);
    --primary: oklch(0.7357 0.1641 34.7091);
    --primary-foreground: oklch(1 0 0);
    --secondary: oklch(0.9596 0.02 28.9029);
    --secondary-foreground: oklch(0.5587 0.1294 32.7364);
    --muted: oklch(0.9656 0.0176 39.4009);
    --muted-foreground: oklch(0.5534 0.0116 58.0708);
    --accent: oklch(0.8278 0.1131 57.9984);
    --accent-foreground: oklch(0.3353 0.0132 2.7676);
    --destructive: oklch(0.6122 0.2082 22.241);
    --destructive-foreground: oklch(1 0 0);
    --border: oklch(0.9296 0.037 38.6868);
    --input: oklch(0.9296 0.037 38.6868);
    --ring: oklch(0.7357 0.1641 34.7091);
    --chart-1: oklch(0.7357 0.1641 34.7091);
    --chart-2: oklch(0.8278 0.1131 57.9984);
    --chart-3: oklch(0.8773 0.0763 54.9314);
    --chart-4: oklch(0.82 0.1054 40.8859);
    --chart-5: oklch(0.6368 0.1306 32.0721);
    --sidebar: oklch(0.9656 0.0176 39.4009);
    --sidebar-foreground: oklch(0.3353 0.0132 2.7676);
    --sidebar-primary: oklch(0.7357 0.1641 34.7091);
    --sidebar-primary-foreground: oklch(1 0 0);
    --sidebar-accent: oklch(0.8278 0.1131 57.9984);
    --sidebar-accent-foreground: oklch(0.3353 0.0132 2.7676);
    --sidebar-border: oklch(0.9296 0.037 38.6868);
    --sidebar-ring: oklch(0.7357 0.1641 34.7091);
    --font-sans: Montserrat, sans-serif;
    --font-serif: Merriweather, serif;
    --font-mono: Ubuntu Mono, monospace;
    --radius: 0.625rem;
    --shadow-2xs: 0px 6px 12px -3px hsl(0 0% 0% / 0.04);
    --shadow-xs: 0px 6px 12px -3px hsl(0 0% 0% / 0.04);
    --shadow-sm: 0px 6px 12px -3px hsl(0 0% 0% / 0.09), 0px 1px 2px -4px hsl(0 0% 0% / 0.09);
    --shadow: 0px 6px 12px -3px hsl(0 0% 0% / 0.09), 0px 1px 2px -4px hsl(0 0% 0% / 0.09);
    --shadow-md: 0px 6px 12px -3px hsl(0 0% 0% / 0.09), 0px 2px 4px -4px hsl(0 0% 0% / 0.09);
    --shadow-lg: 0px 6px 12px -3px hsl(0 0% 0% / 0.09), 0px 4px 6px -4px hsl(0 0% 0% / 0.09);
    --shadow-xl: 0px 6px 12px -3px hsl(0 0% 0% / 0.09), 0px 8px 10px -4px hsl(0 0% 0% / 0.09);
    --shadow-2xl: 0px 6px 12px -3px hsl(0 0% 0% / 0.22);
}

.dark {
    /* Sunset Horizon Dark */
    --background: oklch(0.2569 0.0169 352.4042);
    --foreground: oklch(0.9397 0.0119 51.3156);
    --card: oklch(0.3184 0.0176 341.4465);
    --card-foreground: oklch(0.9397 0.0119 51.3156);
    --popover: oklch(0.3184 0.0176 341.4465);
    --popover-foreground: oklch(0.9397 0.0119 51.3156);
    --primary: oklch(0.7357 0.1641 34.7091);
    --primary-foreground: oklch(1 0 0);
    --secondary: oklch(0.3637 0.0203 342.2664);
    --secondary-foreground: oklch(0.9397 0.0119 51.3156);
    --muted: oklch(0.3184 0.0176 341.4465);
    --muted-foreground: oklch(0.8378 0.0237 52.6346);
    --accent: oklch(0.8278 0.1131 57.9984);
    --accent-foreground: oklch(0.2569 0.0169 352.4042);
    --destructive: oklch(0.6122 0.2082 22.241);
    --destructive-foreground: oklch(1 0 0);
    --border: oklch(0.3637 0.0203 342.2664);
    --input: oklch(0.3637 0.0203 342.2664);
    --ring: oklch(0.7357 0.1641 34.7091);
    --chart-1: oklch(0.7357 0.1641 34.7091);
    --chart-2: oklch(0.8278 0.1131 57.9984);
    --chart-3: oklch(0.8773 0.0763 54.9314);
    --chart-4: oklch(0.82 0.1054 40.8859);
    --chart-5: oklch(0.6368 0.1306 32.0721);
    --sidebar: oklch(0.2569 0.0169 352.4042);
    --sidebar-foreground: oklch(0.9397 0.0119 51.3156);
    --sidebar-primary: oklch(0.7357 0.1641 34.7091);
    --sidebar-primary-foreground: oklch(1 0 0);
    --sidebar-accent: oklch(0.8278 0.1131 57.9984);
    --sidebar-accent-foreground: oklch(0.2569 0.0169 352.4042);
    --sidebar-border: oklch(0.3637 0.0203 342.2664);
    --sidebar-ring: oklch(0.7357 0.1641 34.7091);
    --font-sans: Montserrat, sans-serif;
    --font-serif: Merriweather, serif;
    --font-mono: Ubuntu Mono, monospace;
    --radius: 0.625rem;
    --shadow-2xs: 0px 6px 12px -3px hsl(0 0% 0% / 0.04);
    --shadow-xs: 0px 6px 12px -3px hsl(0 0% 0% / 0.04);
    --shadow-sm: 0px 6px 12px -3px hsl(0 0% 0% / 0.09), 0px 1px 2px -4px hsl(0 0% 0% / 0.09);
    --shadow: 0px 6px 12px -3px hsl(0 0% 0% / 0.09), 0px 1px 2px -4px hsl(0 0% 0% / 0.09);
    --shadow-md: 0px 6px 12px -3px hsl(0 0% 0% / 0.09), 0px 2px 4px -4px hsl(0 0% 0% / 0.09);
    --shadow-lg: 0px 6px 12px -3px hsl(0 0% 0% / 0.09), 0px 4px 6px -4px hsl(0 0% 0% / 0.09);
    --shadow-xl: 0px 6px 12px -3px hsl(0 0% 0% / 0.09), 0px 8px 10px -4px hsl(0 0% 0% / 0.09);
    --shadow-2xl: 0px 6px 12px -3px hsl(0 0% 0% / 0.22);
}
            `,
            branding: {
                logo: "https://picsum.photos/200/200?random=2",
                favicon: "https://picsum.photos/32/32?random=2",
            },
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
            customCss: `
:root {
    --background: oklch(1 0 0);
    --foreground: oklch(0.3211 0 0);
    --card: oklch(0.9702 0 0);
    --card-foreground: oklch(0.3211 0 0);
    --popover: oklch(0.9702 0 0);
    --popover-foreground: oklch(0.3211 0 0);
    --primary: oklch(0.7482 0.1235 244.7492);
    --primary-foreground: oklch(1 0 0);
    --secondary: oklch(0.9551 0 0);
    --secondary-foreground: oklch(0.3211 0 0);
    --muted: oklch(0.9551 0 0);
    --muted-foreground: oklch(0.5103 0 0);
    --accent: oklch(0.6875 0.142 21.4566);
    --accent-foreground: oklch(1 0 0);
    --destructive: oklch(0.6875 0.142 21.4566);
    --destructive-foreground: oklch(1 0 0);
    --border: oklch(0.9067 0 0);
    --input: oklch(0.9067 0 0);
    --ring: oklch(0.7482 0.1235 244.7492);
    --chart-1: oklch(0.6875 0.142 21.4566);
    --chart-2: oklch(0.7482 0.1235 244.7492);
    --chart-3: oklch(0.766 0.1179 145.295);
    --chart-4: oklch(0.8287 0.1452 73.5424);
    --chart-5: oklch(0.6455 0.1622 321.6136);
    --sidebar: oklch(0.9702 0 0);
    --sidebar-foreground: oklch(0.3211 0 0);
    --sidebar-primary: oklch(0.7482 0.1235 244.7492);
    --sidebar-primary-foreground: oklch(1 0 0);
    --sidebar-accent: oklch(0.6875 0.142 21.4566);
    --sidebar-accent-foreground: oklch(1 0 0);
    --sidebar-border: oklch(0.9067 0 0);
    --sidebar-ring: oklch(0.7482 0.1235 244.7492);
    --font-sans: Inter, v-sans-serif;
    --font-serif: Georgia, Cambria, "Times New Roman", Times, serif;
    --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    --radius: 0.5rem;
    --shadow-2xs: 0 4 10 0 hsl(0 0% 0% / 0.05);
    --shadow-xs: 0 4 10 0 hsl(0 0% 0% / 0.05);
    --shadow-sm: 0 4 10 0 hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);
    --shadow: 0 4 10 0 hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1);
    --shadow-md: 0 4 10 0 hsl(0 0% 0% / 0.1), 0 2px 4px -1px hsl(0 0% 0% / 0.1);
    --shadow-lg: 0 4 10 0 hsl(0 0% 0% / 0.1), 0 4px 6px -1px hsl(0 0% 0% / 0.1);
    --shadow-xl: 0 4 10 0 hsl(0 0% 0% / 0.1), 0 8px 10px -1px hsl(0 0% 0% / 0.1);
    --shadow-2xl: 0 4 10 0 hsl(0 0% 0% / 0.25);
    --tracking-normal: normal;
}

.dark {
    --background: oklch(0.2284 0.0384 282.9324);
    --foreground: oklch(0.9067 0 0);
    --card: oklch(0.208 0.0296 283.5317);
    --card-foreground: oklch(0.9067 0 0);
    --popover: oklch(0.208 0.0296 283.5317);
    --popover-foreground: oklch(0.9067 0 0);
    --primary: oklch(0.7482 0.1235 244.7492);
    --primary-foreground: oklch(1 0 0);
    --secondary: oklch(0.4228 0.0529 283.9102);
    --secondary-foreground: oklch(1 0 0);
    --muted: oklch(0.4228 0.0529 283.9102);
    --muted-foreground: oklch(0.7166 0.0462 285.1741);
    --accent: oklch(0.6875 0.142 21.4566);
    --accent-foreground: oklch(1 0 0);
    --destructive: oklch(0.6875 0.142 21.4566);
    --destructive-foreground: oklch(1 0 0);
    --border: oklch(0.3147 0.0497 283.1716);
    --input: oklch(0.3147 0.0497 283.1716);
    --ring: oklch(0.7482 0.1235 244.7492);
    --chart-1: oklch(0.6875 0.142 21.4566);
    --chart-2: oklch(0.7482 0.1235 244.7492);
    --chart-3: oklch(0.766 0.1179 145.295);
    --chart-4: oklch(0.8287 0.1452 73.5424);
    --chart-5: oklch(0.6455 0.1622 321.6136);
    --sidebar: oklch(0.208 0.0296 283.5317);
    --sidebar-foreground: oklch(0.9067 0 0);
    --sidebar-primary: oklch(0.7482 0.1235 244.7492);
    --sidebar-primary-foreground: oklch(1 0 0);
    --sidebar-accent: oklch(0.6875 0.142 21.4566);
    --sidebar-accent-foreground: oklch(1 0 0);
    --sidebar-border: oklch(0.3147 0.0497 283.1716);
    --sidebar-ring: oklch(0.7482 0.1235 244.7492);
    --font-sans: Inter, v-sans-serif;
    --font-serif: Georgia, Cambria, "Times New Roman", Times, serif;
    --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    --radius: 0.5rem;
    --shadow-2xs: 0 4 10 0 hsl(0 0% 0% / 0.1);
    --shadow-xs: 0 4 10 0 hsl(0 0% 0% / 0.1);
    --shadow-sm: 0 4 10 0 hsl(0 0% 0% / 0.2), 0 1px 2px -1px hsl(0 0% 0% / 0.2);
    --shadow: 0 4 10 0 hsl(0 0% 0% / 0.2), 0 1px 2px -1px hsl(0 0% 0% / 0.2);
    --shadow-md: 0 4 10 0 hsl(0 0% 0% / 0.2), 0 2px 4px -1px hsl(0 0% 0% / 0.2);
    --shadow-lg: 0 4 10 0 hsl(0 0% 0% / 0.2), 0 4px 6px -1px hsl(0 0% 0% / 0.2);
    --shadow-xl: 0 4 10 0 hsl(0 0% 0% / 0.2), 0 8px 10px -1px hsl(0 0% 0% / 0.2);
    --shadow-2xl: 0 4 10 0 hsl(0 0% 0% / 0.5);
}

body {
    letter-spacing: var(--tracking-normal);
}

            `,
            branding: {
                logo: "https://picsum.photos/200/200?random=3",
                favicon: "https://picsum.photos/32/32?random=3",
            },
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
            customCss: `
:root {
  --background: oklch(0.9911 0 0);
  --foreground: oklch(0.2046 0 0);
  --card: oklch(0.9911 0 0);
  --card-foreground: oklch(0.2046 0 0);
  --popover: oklch(0.9911 0 0);
  --popover-foreground: oklch(0.4386 0 0);
  --primary: oklch(0.8348 0.1302 160.9080);
  --primary-foreground: oklch(0.2626 0.0147 166.4589);
  --secondary: oklch(0.9940 0 0);
  --secondary-foreground: oklch(0.2046 0 0);
  --muted: oklch(0.9461 0 0);
  --muted-foreground: oklch(0.2435 0 0);
  --accent: oklch(0.9461 0 0);
  --accent-foreground: oklch(0.2435 0 0);
  --destructive: oklch(0.5523 0.1927 32.7272);
  --destructive-foreground: oklch(0.9934 0.0032 17.2118);
  --border: oklch(0.9037 0 0);
  --input: oklch(0.9731 0 0);
  --ring: oklch(0.8348 0.1302 160.9080);
  --chart-1: oklch(0.8348 0.1302 160.9080);
  --chart-2: oklch(0.6231 0.1880 259.8145);
  --chart-3: oklch(0.6056 0.2189 292.7172);
  --chart-4: oklch(0.7686 0.1647 70.0804);
  --chart-5: oklch(0.6959 0.1491 162.4796);
  --sidebar: oklch(0.9911 0 0);
  --sidebar-foreground: oklch(0.5452 0 0);
  --sidebar-primary: oklch(0.8348 0.1302 160.9080);
  --sidebar-primary-foreground: oklch(0.2626 0.0147 166.4589);
  --sidebar-accent: oklch(0.9461 0 0);
  --sidebar-accent-foreground: oklch(0.2435 0 0);
  --sidebar-border: oklch(0.9037 0 0);
  --sidebar-ring: oklch(0.8348 0.1302 160.9080);
  --font-sans: Outfit, sans-serif;
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono: monospace;
  --radius: 0.5rem;
  --shadow-2xs: 0px 1px 3px 0px hsl(0 0% 0% / 0.09);
  --shadow-xs: 0px 1px 3px 0px hsl(0 0% 0% / 0.09);
  --shadow-sm: 0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 1px 2px -1px hsl(0 0% 0% / 0.17);
  --shadow: 0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 1px 2px -1px hsl(0 0% 0% / 0.17);
  --shadow-md: 0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 2px 4px -1px hsl(0 0% 0% / 0.17);
  --shadow-lg: 0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 4px 6px -1px hsl(0 0% 0% / 0.17);
  --shadow-xl: 0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 8px 10px -1px hsl(0 0% 0% / 0.17);
  --shadow-2xl: 0px 1px 3px 0px hsl(0 0% 0% / 0.43);
  --tracking-normal: 0.025em;
}

.dark {
  --background: oklch(0.1822 0 0);
  --foreground: oklch(0.9288 0.0126 255.5078);
  --card: oklch(0.2046 0 0);
  --card-foreground: oklch(0.9288 0.0126 255.5078);
  --popover: oklch(0.2603 0 0);
  --popover-foreground: oklch(0.7348 0 0);
  --primary: oklch(0.4365 0.1044 156.7556);
  --primary-foreground: oklch(0.9213 0.0135 167.1556);
  --secondary: oklch(0.2603 0 0);
  --secondary-foreground: oklch(0.9851 0 0);
  --muted: oklch(0.2393 0 0);
  --muted-foreground: oklch(0.7122 0 0);
  --accent: oklch(0.3132 0 0);
  --accent-foreground: oklch(0.9851 0 0);
  --destructive: oklch(0.3123 0.0852 29.7877);
  --destructive-foreground: oklch(0.9368 0.0045 34.3092);
  --border: oklch(0.2809 0 0);
  --input: oklch(0.2603 0 0);
  --ring: oklch(0.8003 0.1821 151.7110);
  --chart-1: oklch(0.8003 0.1821 151.7110);
  --chart-2: oklch(0.7137 0.1434 254.6240);
  --chart-3: oklch(0.7090 0.1592 293.5412);
  --chart-4: oklch(0.8369 0.1644 84.4286);
  --chart-5: oklch(0.7845 0.1325 181.9120);
  --sidebar: oklch(0.1822 0 0);
  --sidebar-foreground: oklch(0.6301 0 0);
  --sidebar-primary: oklch(0.4365 0.1044 156.7556);
  --sidebar-primary-foreground: oklch(0.9213 0.0135 167.1556);
  --sidebar-accent: oklch(0.3132 0 0);
  --sidebar-accent-foreground: oklch(0.9851 0 0);
  --sidebar-border: oklch(0.2809 0 0);
  --sidebar-ring: oklch(0.8003 0.1821 151.7110);
  --font-sans: Outfit, sans-serif;
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono: monospace;
  --radius: 0.5rem;
  --shadow-2xs: 0px 1px 3px 0px hsl(0 0% 0% / 0.09);
  --shadow-xs: 0px 1px 3px 0px hsl(0 0% 0% / 0.09);
  --shadow-sm: 0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 1px 2px -1px hsl(0 0% 0% / 0.17);
  --shadow: 0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 1px 2px -1px hsl(0 0% 0% / 0.17);
  --shadow-md: 0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 2px 4px -1px hsl(0 0% 0% / 0.17);
  --shadow-lg: 0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 4px 6px -1px hsl(0 0% 0% / 0.17);
  --shadow-xl: 0px 1px 3px 0px hsl(0 0% 0% / 0.17), 0px 8px 10px -1px hsl(0 0% 0% / 0.17);
  --shadow-2xl: 0px 1px 3px 0px hsl(0 0% 0% / 0.43);
}


body {
  letter-spacing: var(--tracking-normal);
}
            `,
            branding: {
                logo: "https://picsum.photos/200/200?random=4",
                favicon: "https://picsum.photos/32/32?random=4",
            },
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
