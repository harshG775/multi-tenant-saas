import { Config } from "../renderer/Render";

type Props = {
    Navbar_1: {
        brand: string;
        links: string[];
    };
    Navbar_2: {
        brand: string;
        links: string[];
    };
    HeroBlock_1: {
        title: string;
        subtitle?: string;
        buttonText?: string;
        buttonUrl?: string;
    };
    HeroBlock_2: {
        title: string;
        subtitle?: string;
        buttonText?: string;
        buttonUrl?: string;
    };
    Features_1: {
        items: { title: string; description: string; icon?: string }[];
    };
    Features_2: {
        items: { title: string; description: string; icon?: string }[];
    };
    Testimonials_1: {
        quotes: { name: string; text: string; role?: string }[];
    };
    Testimonials_2: {
        quotes: { name: string; text: string; role?: string }[];
    };
    Footer_1: {
        brand: string;
        year: string;
        links?: { name: string; url: string }[];
    };
    Footer_2: {
        brand: string;
        year: string;
        links?: { name: string; url: string }[];
    };
};

// Modern color palettes
const MODERN_COLORS = {
    gradient: {
        primary: "from-purple-600 to-blue-600",
        secondary: "from-emerald-500 to-cyan-600",
        dark: "from-gray-900 to-slate-800",
    },
    solid: {
        primary: "bg-slate-900",
        secondary: "bg-emerald-600",
        light: "bg-slate-50",
    },
    text: {
        light: "text-white",
        dark: "text-slate-900",
        muted: "text-slate-600",
    },
};

export const config: Config<Props> = {
    components: {
        Navbar_1: {
            defaultProps: { brand: "Brand", links: ["Home", "Features", "Pricing", "Contact"] },
            render: ({ brand, links }) => (
                <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
                        <div className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            {brand}
                        </div>
                        <ul className="flex gap-8">
                            {links.map((link, i) => (
                                <li key={i}>
                                    <a className="text-slate-700 hover:text-purple-600 transition-colors duration-200 font-medium cursor-pointer">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            ),
        },
        Navbar_2: {
            defaultProps: { brand: "Brand", links: ["Home", "Features", "Pricing", "Contact"] },
            render: ({ brand, links }) => (
                <nav className="bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-lg sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
                        <div className="font-bold text-2xl">{brand}</div>
                        <ul className="flex gap-8">
                            {links.map((link, i) => (
                                <li key={i}>
                                    <a className="text-white/90 hover:text-white transition-colors duration-200 font-medium cursor-pointer">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            ),
        },

        HeroBlock_1: {
            defaultProps: {
                title: "Transform Your Digital Experience",
                subtitle: "Discover innovative solutions that drive growth and efficiency for your business",
                buttonText: "Get Started",
                buttonUrl: "#",
            },
            render: ({ title, subtitle, buttonText, buttonUrl }) => (
                <section className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 to-transparent"></div>

                    <div className="relative max-w-7xl mx-auto flex flex-col items-center justify-center text-center py-32 px-6">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">{title}</h1>
                        {subtitle && (
                            <p className="text-xl text-slate-300 mb-8 max-w-3xl leading-relaxed">{subtitle}</p>
                        )}
                        {buttonText && (
                            <div className="flex gap-4 flex-wrap justify-center">
                                <a
                                    href={buttonUrl}
                                    className="px-8 py-4 bg-white text-slate-900 rounded-xl hover:bg-slate-100 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    {buttonText}
                                </a>
                                <a
                                    href="#features"
                                    className="px-8 py-4 border-2 border-white/30 text-white rounded-xl hover:bg-white/10 transition-all duration-300 font-semibold"
                                >
                                    Learn More
                                </a>
                            </div>
                        )}
                    </div>
                </section>
            ),
        },
        HeroBlock_2: {
            defaultProps: {
                title: "Innovate. Create. Inspire.",
                subtitle: "Join thousands of satisfied customers using our platform to achieve their goals",
                buttonText: "Start Free Trial",
                buttonUrl: "#",
            },
            render: ({ title, subtitle, buttonText, buttonUrl }) => (
                <section className="relative bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-500 text-white overflow-hidden">
                    {/* Animated background elements */}
                    <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

                    <div className="relative max-w-7xl mx-auto flex flex-col items-center justify-center text-center py-32 px-6">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">{title}</h1>
                        {subtitle && <p className="text-xl text-white/90 mb-8 max-w-3xl leading-relaxed">{subtitle}</p>}
                        {buttonText && (
                            <div className="flex gap-4 flex-wrap justify-center">
                                <a
                                    href={buttonUrl}
                                    className="px-8 py-4 bg-white text-slate-900 rounded-xl hover:bg-slate-100 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    {buttonText}
                                </a>
                                <a
                                    href="#features"
                                    className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all duration-300 font-semibold"
                                >
                                    Watch Demo
                                </a>
                            </div>
                        )}
                    </div>
                </section>
            ),
        },

        Features_1: {
            defaultProps: {
                items: [
                    {
                        title: "Lightning Fast",
                        description: "Experience blazing fast performance with our optimized architecture",
                        icon: "⚡",
                    },
                    {
                        title: "Enterprise Grade",
                        description: "Bank-level security and reliability for your most critical operations",
                        icon: "🛡️",
                    },
                    {
                        title: "Intuitive Design",
                        description: "Beautiful, user-friendly interface that requires no training",
                        icon: "🎨",
                    },
                ],
            },
            render: ({ items }) => (
                <section className="py-20 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose Us</h2>
                            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                                Powerful features designed to help you succeed in the digital world
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {items.map((f, i) => (
                                <div
                                    key={i}
                                    className="group p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-purple-200 transform hover:-translate-y-2"
                                >
                                    <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                        {f.icon}
                                    </div>
                                    <h3 className="text-2xl font-semibold text-slate-900 mb-3">{f.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{f.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ),
        },
        Features_2: {
            defaultProps: {
                items: [
                    {
                        title: "Smart Automation",
                        description: "Automate repetitive tasks and focus on what matters most",
                        icon: "🤖",
                    },
                    {
                        title: "Real-time Analytics",
                        description: "Make data-driven decisions with live insights and reports",
                        icon: "📊",
                    },
                    {
                        title: "Global Scale",
                        description: "Scale seamlessly to meet growing demands worldwide",
                        icon: "🌍",
                    },
                ],
            },
            render: ({ items }) => (
                <section className="py-20 bg-gradient-to-b from-white to-emerald-50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-slate-900 mb-4">Powerful Features</h2>
                            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                                Everything you need to accelerate your business growth
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {items.map((f, i) => (
                                <div
                                    key={i}
                                    className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-emerald-100 transform hover:-translate-y-2"
                                >
                                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center text-2xl text-white mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                                        {f.icon}
                                    </div>
                                    <h3 className="text-2xl font-semibold text-slate-900 mb-3">{f.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{f.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ),
        },

        Testimonials_1: {
            defaultProps: {
                quotes: [
                    {
                        name: "Sarah Chen",
                        text: "This platform transformed how our team collaborates. The efficiency gains are incredible!",
                        role: "CTO at TechCorp",
                    },
                    {
                        name: "Marcus Johnson",
                        text: "Outstanding customer support and a product that just works. Highly recommended!",
                        role: "Product Manager",
                    },
                ],
            },
            render: ({ quotes }) => (
                <section className="py-20 bg-slate-900 text-white">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4">Trusted by Industry Leaders</h2>
                            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                                See what our customers have to say about their experience
                            </p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {quotes.map((q, i) => (
                                <div
                                    key={i}
                                    className="p-8 bg-slate-800 rounded-2xl border border-slate-700 hover:border-purple-500 transition-all duration-300"
                                >
                                    <div className="text-amber-400 text-4xl mb-4">"</div>
                                    <blockquote className="text-lg text-slate-200 mb-6 leading-relaxed">
                                        {q.text}
                                    </blockquote>
                                    <div>
                                        <footer className="font-semibold text-white">{q.name}</footer>
                                        {q.role && <div className="text-slate-400 text-sm">{q.role}</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ),
        },
        Testimonials_2: {
            defaultProps: {
                quotes: [
                    {
                        name: "Elena Rodriguez",
                        text: "The ROI was evident within the first month. This is exactly what our startup needed to scale.",
                        role: "Founder at StartupXYZ",
                    },
                    {
                        name: "David Kim",
                        text: "Finally, a solution that understands the needs of modern businesses. Game-changing!",
                        role: "Operations Director",
                    },
                ],
            },
            render: ({ quotes }) => (
                <section className="py-20 bg-gradient-to-br from-emerald-50 to-cyan-50">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-slate-900 mb-4">Customer Stories</h2>
                            <p className="text-xl text-slate-600 max-w-2xl mx-auto">Real results from real customers</p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {quotes.map((q, i) => (
                                <div
                                    key={i}
                                    className="p-8 bg-white rounded-2xl shadow-lg border border-emerald-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="flex items-start mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                                            {q.name.charAt(0)}
                                        </div>
                                        <div>
                                            <footer className="font-semibold text-slate-900">{q.name}</footer>
                                            {q.role && <div className="text-slate-500 text-sm">{q.role}</div>}
                                        </div>
                                    </div>
                                    <blockquote className="text-slate-700 leading-relaxed italic">
                                        "{q.text}"
                                    </blockquote>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ),
        },

        Footer_1: {
            defaultProps: {
                brand: "Brand",
                year: "2025",
                links: [
                    { name: "Privacy Policy", url: "#privacy" },
                    { name: "Terms of Service", url: "#terms" },
                    { name: "Contact", url: "#contact" },
                ],
            },
            render: ({ brand, year, links }) => (
                <footer className="bg-slate-900 text-white py-12">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="mb-6 md:mb-0">
                                <div className="font-bold text-2xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                    {brand}
                                </div>
                                <p className="text-slate-400 mt-2">
                                    © {year} {brand}. All rights reserved.
                                </p>
                            </div>
                            {links && (
                                <div className="flex gap-6 flex-wrap justify-center">
                                    {links.map((link, i) => (
                                        <a
                                            key={i}
                                            href={link.url}
                                            className="text-slate-400 hover:text-white transition-colors duration-200"
                                        >
                                            {link.name}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </footer>
            ),
        },
        Footer_2: {
            defaultProps: {
                brand: "Brand",
                year: "2025",
                links: [
                    { name: "Privacy", url: "#privacy" },
                    { name: "Terms", url: "#terms" },
                    { name: "Support", url: "#support" },
                ],
            },
            render: ({ brand, year, links }) => (
                <footer className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white py-12">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <div className="font-bold text-2xl mb-4">{brand}</div>
                        <p className="text-white/80 mb-6">Building the future, one innovation at a time</p>
                        {links && (
                            <div className="flex gap-6 justify-center flex-wrap mb-6">
                                {links.map((link, i) => (
                                    <a
                                        key={i}
                                        href={link.url}
                                        className="text-white/80 hover:text-white transition-colors duration-200"
                                    >
                                        {link.name}
                                    </a>
                                ))}
                            </div>
                        )}
                        <p className="text-white/60">
                            © {year} {brand}. All rights reserved.
                        </p>
                    </div>
                </footer>
            ),
        },
    },
};
