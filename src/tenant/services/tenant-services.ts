import { Tenant } from "@/types/tenant";

export async function getTenantByDomain(domain: string): Promise<Tenant | null> {
    // In production, this would query your database
    const tenant = tenants.find((t) => t.domain === domain || domain.includes(t.domain));
    return tenant || null;
}

// db simultaion for testing
export const tenants: Tenant[] = [
    {
        id: "tenant_001",
        name: "Facebook",
        domain: "facebook",
        data: {
            Layout: {
                root: {
                    props: {
                        title: "Facebook – Connect with Friends",
                        description: "Join Facebook to connect with friends, family and communities.",
                        favicon: "https://www.google.com/s2/favicons?domain=facebook.com",
                    },
                },
                content: {},
            },
            pages: {
                "/": {
                    root: {
                        props: {
                            title: "Welcome to Facebook",
                            description: "Your social hub to connect and share.",
                        },
                    },
                    content: [
                        {
                            id: "hero-1",
                            type: "HeroBlock",
                            props: {
                                title: "Welcome to Facebook",
                                subtitle: "Connect with friends and the world around you.",
                                buttonText: "Get Started",
                                buttonUrl: "/signup",
                            },
                        },
                    ],
                },
            },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "admin_001",
    },
    {
        id: "tenant_002",
        name: "Youtube",
        domain: "youtube",
        data: {
            Layout: {
                root: {
                    props: {
                        title: "YouTube – Broadcast Yourself",
                        description: "Discover, watch, and share videos.",
                        favicon: "https://www.google.com/s2/favicons?domain=youtube.com",
                    },
                },
                content: {},
            },
            pages: {
                "/": {
                    root: {
                        props: {
                            title: "Welcome to YouTube",
                            description: "The world’s biggest video platform.",
                        },
                    },
                    content: [
                        {
                            id: "hero-1",
                            type: "HeroBlock",
                            props: {
                                title: "Welcome to YouTube",
                                subtitle: "Discover and share the world’s videos.",
                                buttonText: "Start Watching",
                                buttonUrl: "/explore",
                            },
                        },
                    ],
                },
            },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "admin_001",
    },
];