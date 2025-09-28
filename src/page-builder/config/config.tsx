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
        items: { title: string; description: string }[];
    };
    Features_2: {
        items: { title: string; description: string }[];
    };
    Testimonials_1: {
        quotes: { name: string; text: string }[];
    };
    Testimonials_2: {
        quotes: { name: string; text: string }[];
    };
    Footer_1: {
        brand: string;
        year: string;
    };
    Footer_2: {
        brand: string;
        year: string;
    };
};

export const config: Config<Props> = {
    components: {
        Navbar_1: {
            defaultProps: { brand: "Brand", links: ["Home", "About"] },
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
        Navbar_2: {
            defaultProps: { brand: "Brand", links: ["Home", "About"] },
            render: ({ brand, links }) => (
                <nav className="bg-green-800 text-orange-100">
                    <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
                        <div className="font-bold text-xl">{brand}</div>
                        <ul className="flex gap-4">
                            {links.map((link, i) => (
                                <li key={i} className="hover:text-orange-300 cursor-pointer">
                                    {link}
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            ),
        },

        HeroBlock_1: {
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
        HeroBlock_2: {
            defaultProps: {
                title: "Default Hero Title",
                subtitle: "Default subtitle",
                buttonText: "Click Me",
                buttonUrl: "#",
            },
            render: ({ title, subtitle, buttonText, buttonUrl }) => (
                <section className="bg-green-100">
                    <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center py-32">
                        <h1 className="text-4xl font-bold mb-4 text-green-900">{title}</h1>
                        {subtitle && <p className="mb-6 text-lg text-green-700">{subtitle}</p>}
                        {buttonText && (
                            <a
                                href={buttonUrl}
                                className="px-6 py-3 bg-orange-600 text-green-900 rounded-lg hover:bg-orange-700 transition"
                            >
                                {buttonText}
                            </a>
                        )}
                    </div>
                </section>
            ),
        },

        Features_1: {
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
        Features_2: {
            defaultProps: {
                items: [
                    { title: "Fast", description: "Our product is super fast." },
                    { title: "Reliable", description: "It works every time." },
                    { title: "Secure", description: "Your data is safe with us." },
                ],
            },
            render: ({ items }) => (
                <section className="py-16 bg-orange-50">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        {items.map((f, i) => (
                            <div key={i} className="p-6 rounded-lg shadow-md bg-green-50">
                                <h3 className="text-xl font-semibold mb-2 text-green-800">{f.title}</h3>
                                <p className="text-green-600">{f.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            ),
        },

        Testimonials_1: {
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
        Testimonials_2: {
            defaultProps: {
                quotes: [
                    { name: "Alice", text: "This service is amazing!" },
                    { name: "Bob", text: "I love using this product." },
                ],
            },
            render: ({ quotes }) => (
                <section className="py-16 bg-green-50">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-2xl font-bold mb-8 text-green-900">What people say</h2>
                        <div className="space-y-6">
                            {quotes.map((q, i) => (
                                <blockquote key={i} className="italic text-green-700">
                                    “{q.text}”<footer className="mt-2 font-semibold text-green-900">- {q.name}</footer>
                                </blockquote>
                            ))}
                        </div>
                    </div>
                </section>
            ),
        },

        Footer_1: {
            defaultProps: { brand: "Brand", year: "2025" },
            render: ({ brand, year }) => (
                <footer className="bg-gray-800 text-white py-6 text-center">
                    <p>
                        © {year} {brand}. All rights reserved.
                    </p>
                </footer>
            ),
        },
        Footer_2: {
            defaultProps: { brand: "Brand", year: "2025" },
            render: ({ brand, year }) => (
                <footer className="bg-green-900 text-orange-100 py-6 text-center">
                    <p>
                        © {year} {brand}. All rights reserved.
                    </p>
                </footer>
            ),
        },
    },
};
