import type { Config } from "@measured/puck";

type Props = {
    HeroOld: {
        title: string;
        subtitle: string;
        buttonText: string;
        buttonUrl: string;
    };
    HeroSplit: {
        title: string;
        subtitle: string;
        buttonText: string;
        buttonUrl: string;
        imageUrl: string;
    };
};

export const config: Config<Props> = {
    components: {
        // === Old Hero ===
        HeroOld: {
            fields: {
                title: { type: "text" },
                subtitle: { type: "text" },
                buttonText: { type: "text" },
                buttonUrl: { type: "text" },
            },
            defaultProps: {
                title: "Welcome to Our Site",
                subtitle: "We build amazing products with React and Tailwind",
                buttonText: "Get Started",
                buttonUrl: "#",
            },
            render: ({ title, subtitle, buttonText, buttonUrl }) => (
                <section
                    className="bg-background text-foreground min-h-screen flex items-center justify-center"
                    data-theme="classic"
                >
                    <div className="text-center px-6 md:px-12 lg:px-24">
                        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">{title}</h1>
                        <p className="text-lg md:text-xl text-muted-foreground mb-8">{subtitle}</p>
                        <a
                            href={buttonUrl}
                            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md shadow-md hover:shadow-lg transition"
                        >
                            {buttonText}
                        </a>
                    </div>
                </section>
            ),
        },

        // === Split Hero ===
        HeroSplit: {
            fields: {
                title: { type: "text" },
                subtitle: { type: "text" },
                buttonText: { type: "text" },
                buttonUrl: { type: "text" },
                imageUrl: { type: "text" },
            },
            defaultProps: {
                title: "Experience the Future of Web Design",
                subtitle: "Build modern, responsive, and beautiful websites with ease.",
                buttonText: "Learn More",
                buttonUrl: "#",
                imageUrl: "https://via.placeholder.com/500x400",
            },
            render: ({ title, subtitle, buttonText, buttonUrl, imageUrl }) => (
                <section className="bg-background text-foreground min-h-screen flex items-center" data-theme="split">
                    <div className="container mx-auto flex flex-col md:flex-row items-center px-6 md:px-12 lg:px-24">
                        {/* Left: Text */}
                        <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
                            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">{title}</h1>
                            <p className="text-lg md:text-xl text-muted-foreground mb-6">{subtitle}</p>
                            <a
                                href={buttonUrl}
                                className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md shadow-md hover:shadow-lg transition"
                            >
                                {buttonText}
                            </a>
                        </div>

                        {/* Right: Image */}
                        <div className="md:w-1/2 flex justify-center md:justify-end">
                            <img
                                src={imageUrl}
                                alt="Hero Illustration"
                                className="w-full max-w-md rounded-lg shadow-xl"
                            />
                        </div>
                    </div>
                </section>
            ),
        },
    },
};

export default config;
