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
                            id: "navbar-1",
                            type: "Navbar",
                            props: {
                                brand: "Facebook",
                                links: ["Home", "Profile", "Messages", "Settings"],
                            },
                        },

                        {
                            id: "features-1",
                            type: "Features",
                            props: {
                                items: [
                                    { title: "Fast", description: "Optimized for speed." },
                                    { title: "Secure", description: "Your data is protected." },
                                    { title: "Social", description: "Connect with your network." },
                                ],
                            },
                        },
                        {
                            id: "hero-1",
                            type: "HeroBlock",
                            props: {
                                title: "Connect with friends and the world around you",
                                subtitle: "See photos, videos, and updates from your friends.",
                                buttonText: "Sign Up",
                                buttonUrl: "/signup",
                            },
                        },
                        {
                            id: "testimonials-1",
                            type: "Testimonials",
                            props: {
                                quotes: [
                                    { name: "Alice", text: "Facebook keeps me connected with my friends!" },
                                    { name: "Bob", text: "Love sharing moments with my family here." },
                                ],
                            },
                        },
                        {
                            id: "footer-1",
                            type: "Footer",
                            props: {
                                brand: "Facebook",
                                year: "2025",
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
                            id: "navbar-1",
                            type: "Navbar",
                            props: {
                                brand: "YouTube",
                                links: ["Home", "Trending", "Subscriptions", "Library"],
                            },
                        },
                        {
                            id: "hero-1",
                            type: "HeroBlock",
                            props: {
                                title: "Discover and share the world’s videos",
                                subtitle: "Watch millions of videos, upload your own, and connect with creators.",
                                buttonText: "Get Started",
                                buttonUrl: "/explore",
                            },
                        },
                        {
                            id: "features-1",
                            type: "Features",
                            props: {
                                items: [
                                    { title: "Explore", description: "Find new and trending videos." },
                                    { title: "Upload", description: "Share your content easily." },
                                    { title: "Subscribe", description: "Follow your favorite channels." },
                                ],
                            },
                        },
                        {
                            id: "testimonials-1",
                            type: "Testimonials",
                            props: {
                                quotes: [
                                    { name: "Charlie", text: "YouTube is my go-to for tutorials!" },
                                    { name: "Dana", text: "I love discovering new music here." },
                                ],
                            },
                        },
                        {
                            id: "footer-1",
                            type: "Footer",
                            props: {
                                brand: "YouTube",
                                year: "2025",
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
