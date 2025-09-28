import { Config } from "../renderer/Render";

type Props = {
    Navbar: {
        brand: string;
        links: string[];
    };
    HeroBlock: {
        title: string;
        subtitle?: string;
        buttonText?: string;
        buttonUrl?: string;
    };
    Features: {
        items: { title: string; description: string }[];
    };
    Testimonials: {
        quotes: { name: string; text: string }[];
    };
    Footer: {
        brand: string;
        year: string;
    };
};

export const config: Config<Props> = {
    components: {
        Navbar: {
            defaultProps: {
                brand: "Brand",
                links: ["Home", "About"],
            },
            render: ({ brand, links }) => (
                <nav className="bg-gray-800 text-white">
                    <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
                        <div className="font-bold text-xl">{brand}</div>
                        <ul className="flex gap-4">
                            {links.map((link, i) => (
                                <li key={i} className="hover:text-gray-300 cursor-pointer">
                                    {link}
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            ),
        },

        HeroBlock: {
            defaultProps: {
                title: "Default Hero Title",
                subtitle: "Default subtitle",
                buttonText: "Click Me",
                buttonUrl: "#",
            },
            render: ({ title, subtitle, buttonText, buttonUrl }) => (
                <section className="bg-blue-100">
                    <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center py-32">
                        <h1 className="text-4xl font-bold mb-4">{title}</h1>
                        {subtitle && <p className="mb-6 text-lg">{subtitle}</p>}
                        {buttonText && (
                            <a
                                href={buttonUrl}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                {buttonText}
                            </a>
                        )}
                    </div>
                </section>
            ),
        },

        Features: {
            defaultProps: {
                items: [
                    { title: "Fast", description: "Our product is super fast." },
                    { title: "Reliable", description: "It works every time." },
                    { title: "Secure", description: "Your data is safe with us." },
                ],
            },
            render: ({ items }) => (
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        {items.map((f, i) => (
                            <div key={i} className="p-6 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                                <p className="text-gray-600">{f.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            ),
        },

        Testimonials: {
            defaultProps: {
                quotes: [
                    { name: "Alice", text: "This service is amazing!" },
                    { name: "Bob", text: "I love using this product." },
                ],
            },
            render: ({ quotes }) => (
                <section className="py-16 bg-gray-100">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-2xl font-bold mb-8">What people say</h2>
                        <div className="space-y-6">
                            {quotes.map((q, i) => (
                                <blockquote key={i} className="italic">
                                    “{q.text}”<footer className="mt-2 font-semibold">- {q.name}</footer>
                                </blockquote>
                            ))}
                        </div>
                    </div>
                </section>
            ),
        },

        Footer: {
            defaultProps: {
                brand: "Brand",
                year: "2025",
            },
            render: ({ brand, year }) => (
                <footer className="bg-gray-800 text-white py-6 text-center">
                    <p>
                        © {year} {brand}. All rights reserved.
                    </p>
                </footer>
            ),
        },
    },
};
