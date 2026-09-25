import type { Config, Data } from "@puckeditor/core";
import { z } from "zod";

const linkSchema = z.object({
    label: z.string(),
    href: z.string(),
});

const imageSchema = z.object({
    src: z.string(),
    alt: z.string(),
});

export const componentPropsSchemas = z.object({
    Header: z.object({
        logoText: z.string(),
        logoImageSrc: z.string(), // empty string = use logoText instead
        links: z.array(linkSchema),
        ctaLabel: z.string(),
        ctaHref: z.string(),
    }),
    Hero: z.object({
        eyebrow: z.string(),
        title: z.string(),
        subtitle: z.string(),
        ctaLabel: z.string(),
        ctaHref: z.string(),
        secondaryLabel: z.string(), // empty string = hide secondary link
        secondaryHref: z.string(),
        image: imageSchema, // empty src = text-only centered hero
        align: z.enum(["left", "center"]),
    }),
    LogoCloud: z.object({
        heading: z.string(),
        logos: z.array(imageSchema),
    }),
    FeatureGrid: z.object({
        heading: z.string(),
        subheading: z.string(),
        columns: z.enum(["2", "3", "4"]),
        features: z.array(
            z.object({
                icon: z.string(), // single emoji/glyph, kept simple and font-based (no icon lib dependency)
                title: z.string(),
                description: z.string(),
            }),
        ),
    }),
    FeatureSplit: z.object({
        eyebrow: z.string(),
        title: z.string(),
        description: z.string(),
        bullets: z.array(z.object({ text: z.string() })),
        ctaLabel: z.string(), // empty string = hide CTA
        ctaHref: z.string(),
        image: imageSchema,
        imageSide: z.enum(["left", "right"]),
    }),
    Stats: z.object({
        heading: z.string(),
        stats: z.array(
            z.object({
                value: z.string(),
                label: z.string(),
            }),
        ),
    }),
    Testimonials: z.object({
        heading: z.string(),
        subheading: z.string(),
        testimonials: z.array(
            z.object({
                quote: z.string(),
                name: z.string(),
                role: z.string(),
                avatarSrc: z.string(), // empty string = initials fallback
            }),
        ),
    }),
    Pricing: z.object({
        heading: z.string(),
        subheading: z.string(),
        plans: z.array(
            z.object({
                name: z.string(),
                price: z.string(),
                period: z.string(),
                description: z.string(),
                features: z.array(z.object({ text: z.string() })),
                ctaLabel: z.string(),
                ctaHref: z.string(),
                highlighted: z.boolean(),
            }),
        ),
    }),
    FAQ: z.object({
        heading: z.string(),
        subheading: z.string(),
        items: z.array(
            z.object({
                question: z.string(),
                answer: z.string(),
            }),
        ),
    }),
    CallToAction: z.object({
        heading: z.string(),
        subheading: z.string(),
        buttonLabel: z.string(),
        buttonHref: z.string(),
        secondaryLabel: z.string(), // empty string = hide
        secondaryHref: z.string(),
    }),
    Footer: z.object({
        logoText: z.string(),
        tagline: z.string(),
        columns: z.array(
            z.object({
                heading: z.string(),
                links: z.array(linkSchema),
            }),
        ),
        bottomText: z.string(),
    }),
});

type Props = z.infer<typeof componentPropsSchemas>;

// Shared building blocks (kept as plain functions, not components, so Puck's
// render signature stays a simple function of props — no extra client boundary).
const container = "mx-auto w-full max-w-6xl px-6";

const primaryButtonClass =
    "inline-flex items-center justify-center rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700";
const secondaryButtonClass =
    "inline-flex items-center justify-center rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50";

const initials = (name: string) =>
    name
        .split(" ")
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase();

const columnsClass: Record<Props["FeatureGrid"]["columns"], string> = {
    "2": "sm:grid-cols-2",
    "3": "sm:grid-cols-2 lg:grid-cols-3",
    "4": "sm:grid-cols-2 lg:grid-cols-4",
};

const config: Config<Props> = {
    components: {
        Header: {
            fields: {
                logoText: { type: "text" },
                logoImageSrc: { type: "text", label: "Logo image URL (optional, overrides text)" },
                links: {
                    type: "array",
                    arrayFields: {
                        label: { type: "text" },
                        href: { type: "text" },
                    },
                    getItemSummary: (item) => item.label,
                    defaultItemProps: { label: "Link", href: "/" },
                },
                ctaLabel: { type: "text" },
                ctaHref: { type: "text" },
            },
            defaultProps: {
                logoText: "Acme",
                logoImageSrc: "",
                links: [
                    { label: "Features", href: "#features" },
                    { label: "Pricing", href: "#pricing" },
                    { label: "FAQ", href: "#faq" },
                ],
                ctaLabel: "Sign up",
                ctaHref: "/",
            },
            render: ({ logoText, logoImageSrc, links, ctaLabel, ctaHref }) => (
                <header className="border-b border-neutral-200 bg-white">
                    <div className={`${container} flex items-center justify-between py-4`}>
                        {logoImageSrc ? (
                            <img src={logoImageSrc} alt={logoText} className="h-8 w-auto object-contain" />
                        ) : (
                            <span className="text-lg font-bold tracking-tight text-neutral-900">{logoText}</span>
                        )}
                        <nav className="hidden items-center gap-8 md:flex">
                            {links.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>
                        <a href={ctaHref} className={primaryButtonClass}>
                            {ctaLabel}
                        </a>
                    </div>
                </header>
            ),
        },

        Hero: {
            fields: {
                eyebrow: { type: "text" },
                title: { type: "text" },
                subtitle: { type: "textarea" },
                ctaLabel: { type: "text" },
                ctaHref: { type: "text" },
                secondaryLabel: { type: "text", label: "Secondary link label (optional)" },
                secondaryHref: { type: "text" },
                image: {
                    type: "object",
                    objectFields: {
                        src: { type: "text", label: "Image URL (optional, blank = text-only hero)" },
                        alt: { type: "text" },
                    },
                },
                align: {
                    type: "radio",
                    options: [
                        { label: "Center", value: "center" },
                        { label: "Left", value: "left" },
                    ],
                },
            },
            defaultProps: {
                eyebrow: "",
                title: "Build something great",
                subtitle: "A short pitch that explains what this product does and who it's for.",
                ctaLabel: "Get started",
                ctaHref: "/",
                secondaryLabel: "",
                secondaryHref: "",
                image: { src: "", alt: "" },
                align: "center",
            },
            render: ({ eyebrow, title, subtitle, ctaLabel, ctaHref, secondaryLabel, secondaryHref, image, align }) => {
                const textBlock = (
                    <div className={align === "center" ? "text-center" : "text-left"}>
                        {eyebrow && (
                            <span className="mb-4 inline-block rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                                {eyebrow}
                            </span>
                        )}
                        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">{title}</h1>
                        <p className="mt-4 text-lg text-neutral-600">{subtitle}</p>
                        <div className={`mt-8 flex gap-4 ${align === "center" ? "justify-center" : "justify-start"}`}>
                            <a href={ctaHref} className={primaryButtonClass}>
                                {ctaLabel}
                            </a>
                            {secondaryLabel && (
                                <a href={secondaryHref} className={secondaryButtonClass}>
                                    {secondaryLabel}
                                </a>
                            )}
                        </div>
                    </div>
                );

                if (!image.src) {
                    return (
                        <section className="bg-white py-24">
                            <div className={`${container} ${align === "center" ? "max-w-2xl" : ""}`}>{textBlock}</div>
                        </section>
                    );
                }

                return (
                    <section className="bg-white py-20">
                        <div className={`${container} grid items-center gap-12 md:grid-cols-2`}>
                            {textBlock}
                            <img src={image.src} alt={image.alt} className="w-full rounded-xl object-cover" />
                        </div>
                    </section>
                );
            },
        },

        LogoCloud: {
            fields: {
                heading: { type: "text" },
                logos: {
                    type: "array",
                    arrayFields: {
                        src: { type: "text", label: "Logo image URL" },
                        alt: { type: "text", label: "Company name" },
                    },
                    getItemSummary: (item) => item.alt || "Logo",
                    defaultItemProps: { src: "", alt: "Company" },
                },
            },
            defaultProps: {
                heading: "Trusted by teams at",
                logos: [
                    { src: "", alt: "Company One" },
                    { src: "", alt: "Company Two" },
                    { src: "", alt: "Company Three" },
                    { src: "", alt: "Company Four" },
                ],
            },
            render: ({ heading, logos }) => (
                <section className="bg-neutral-50 py-16">
                    <div className={container}>
                        {heading && (
                            <p className="mb-8 text-center text-sm font-medium uppercase tracking-wide text-neutral-500">
                                {heading}
                            </p>
                        )}
                        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
                            {logos.map((logo) =>
                                logo.src ? (
                                    <img
                                        key={logo.src}
                                        src={logo.src}
                                        alt={logo.alt}
                                        className="h-7 w-auto object-contain opacity-70 grayscale"
                                    />
                                ) : (
                                    <span key={logo.alt} className="text-lg font-semibold text-neutral-400">
                                        {logo.alt}
                                    </span>
                                ),
                            )}
                        </div>
                    </div>
                </section>
            ),
        },

        FeatureGrid: {
            fields: {
                heading: { type: "text" },
                subheading: { type: "textarea" },
                columns: {
                    type: "radio",
                    options: [
                        { label: "2", value: "2" },
                        { label: "3", value: "3" },
                        { label: "4", value: "4" },
                    ],
                },
                features: {
                    type: "array",
                    arrayFields: {
                        icon: { type: "text", label: "Icon (emoji, optional)" },
                        title: { type: "text" },
                        description: { type: "textarea" },
                    },
                    getItemSummary: (item) => item.title,
                    defaultItemProps: { icon: "✦", title: "Feature", description: "Describe the feature." },
                },
            },
            defaultProps: {
                heading: "Why choose us",
                subheading: "",
                columns: "3",
                features: [
                    { icon: "⚡", title: "Fast", description: "Ships in minutes, not weeks." },
                    { icon: "🧩", title: "Simple", description: "No unnecessary configuration." },
                    { icon: "🛡️", title: "Reliable", description: "Built to stay up." },
                ],
            },
            render: ({ heading, subheading, columns, features }) => (
                <section id="features" className="bg-white py-20">
                    <div className={container}>
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-neutral-900">{heading}</h2>
                            {subheading && <p className="mt-3 text-neutral-600">{subheading}</p>}
                        </div>
                        <div className={`mt-14 grid grid-cols-1 gap-10 ${columnsClass[columns]}`}>
                            {features.map((feature) => (
                                <div key={feature.title}>
                                    {feature.icon && <div className="mb-4 text-2xl">{feature.icon}</div>}
                                    <h3 className="text-base font-semibold text-neutral-900">{feature.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ),
        },

        FeatureSplit: {
            fields: {
                eyebrow: { type: "text" },
                title: { type: "text" },
                description: { type: "textarea" },
                bullets: {
                    type: "array",
                    arrayFields: { text: { type: "text" } },
                    getItemSummary: (item) => item.text,
                    defaultItemProps: { text: "Benefit point" },
                },
                ctaLabel: { type: "text", label: "CTA label (optional)" },
                ctaHref: { type: "text" },
                image: {
                    type: "object",
                    objectFields: {
                        src: { type: "text" },
                        alt: { type: "text" },
                    },
                },
                imageSide: {
                    type: "radio",
                    options: [
                        { label: "Left", value: "left" },
                        { label: "Right", value: "right" },
                    ],
                },
            },
            defaultProps: {
                eyebrow: "",
                title: "A closer look",
                description: "Explain the workflow or capability this section highlights, in a sentence or two.",
                bullets: [{ text: "First benefit" }, { text: "Second benefit" }, { text: "Third benefit" }],
                ctaLabel: "",
                ctaHref: "",
                image: { src: "", alt: "" },
                imageSide: "right",
            },
            render: ({ eyebrow, title, description, bullets, ctaLabel, ctaHref, image, imageSide }) => {
                const textBlock = (
                    <div>
                        {eyebrow && <span className="text-sm font-medium text-neutral-500">{eyebrow}</span>}
                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900">{title}</h2>
                        <p className="mt-4 text-neutral-600">{description}</p>
                        {bullets.length > 0 && (
                            <ul className="mt-6 space-y-3">
                                {bullets.map((bullet) => (
                                    <li key={bullet.text} className="flex items-start gap-3 text-sm text-neutral-700">
                                        <span className="mt-0.5 text-neutral-900">✓</span>
                                        {bullet.text}
                                    </li>
                                ))}
                            </ul>
                        )}
                        {ctaLabel && (
                            <a href={ctaHref} className={`${primaryButtonClass} mt-8`}>
                                {ctaLabel}
                            </a>
                        )}
                    </div>
                );

                const imageBlock = image.src ? (
                    <img src={image.src} alt={image.alt} className="w-full rounded-xl object-cover" />
                ) : (
                    <div className="aspect-[4/3] w-full rounded-xl bg-neutral-100" />
                );

                return (
                    <section className="bg-white py-20">
                        <div className={`${container} grid items-center gap-12 md:grid-cols-2`}>
                            {imageSide === "left" ? (
                                <>
                                    {imageBlock}
                                    {textBlock}
                                </>
                            ) : (
                                <>
                                    {textBlock}
                                    {imageBlock}
                                </>
                            )}
                        </div>
                    </section>
                );
            },
        },

        Stats: {
            fields: {
                heading: { type: "text" },
                stats: {
                    type: "array",
                    arrayFields: {
                        value: { type: "text" },
                        label: { type: "text" },
                    },
                    getItemSummary: (item) => item.value,
                    defaultItemProps: { value: "100+", label: "Metric" },
                },
            },
            defaultProps: {
                heading: "",
                stats: [
                    { value: "10k+", label: "Active users" },
                    { value: "99.9%", label: "Uptime" },
                    { value: "40+", label: "Countries" },
                    { value: "4.9/5", label: "Average rating" },
                ],
            },
            render: ({ heading, stats }) => (
                <section className="bg-neutral-900 py-16">
                    <div className={container}>
                        {heading && <h2 className="mb-10 text-center text-2xl font-bold text-white">{heading}</h2>}
                        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
                            {stats.map((stat) => (
                                <div key={`${stat.label}-${stat.value}`} className="text-center">
                                    <div className="text-3xl font-bold text-white sm:text-4xl">{stat.value}</div>
                                    <div className="mt-2 text-sm text-neutral-400">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ),
        },

        Testimonials: {
            fields: {
                heading: { type: "text" },
                subheading: { type: "textarea" },
                testimonials: {
                    type: "array",
                    arrayFields: {
                        quote: { type: "textarea" },
                        name: { type: "text" },
                        role: { type: "text" },
                        avatarSrc: { type: "text", label: "Avatar image URL (optional)" },
                    },
                    getItemSummary: (item) => item.name,
                    defaultItemProps: {
                        quote: "This product changed how our team works.",
                        name: "Jane Doe",
                        role: "VP of Engineering",
                        avatarSrc: "",
                    },
                },
            },
            defaultProps: {
                heading: "Loved by teams everywhere",
                subheading: "",
                testimonials: [
                    {
                        quote: "This product changed how our team works. Setup took minutes and we saw results the same day.",
                        name: "Jane Doe",
                        role: "VP of Engineering, Acme",
                        avatarSrc: "",
                    },
                    {
                        quote: "The best tool we've adopted this year, hands down.",
                        name: "John Smith",
                        role: "Founder, Widgetco",
                        avatarSrc: "",
                    },
                    {
                        quote: "Support is fast and the product just works.",
                        name: "Priya Nair",
                        role: "Product Lead, Northstar",
                        avatarSrc: "",
                    },
                ],
            },
            render: ({ heading, subheading, testimonials }) => (
                <section className="bg-neutral-50 py-20">
                    <div className={container}>
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-neutral-900">{heading}</h2>
                            {subheading && <p className="mt-3 text-neutral-600">{subheading}</p>}
                        </div>
                        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
                            {testimonials.map((t) => (
                                <figure key={t.name} className="rounded-xl border border-neutral-200 bg-white p-6">
                                    <blockquote className="text-sm leading-relaxed text-neutral-700">
                                        "{t.quote}"
                                    </blockquote>
                                    <figcaption className="mt-6 flex items-center gap-3">
                                        {t.avatarSrc ? (
                                            <img
                                                src={t.avatarSrc}
                                                alt={t.name}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 text-xs font-semibold text-neutral-600">
                                                {initials(t.name)}
                                            </div>
                                        )}
                                        <div>
                                            <div className="text-sm font-semibold text-neutral-900">{t.name}</div>
                                            <div className="text-xs text-neutral-500">{t.role}</div>
                                        </div>
                                    </figcaption>
                                </figure>
                            ))}
                        </div>
                    </div>
                </section>
            ),
        },

        Pricing: {
            fields: {
                heading: { type: "text" },
                subheading: { type: "textarea" },
                plans: {
                    type: "array",
                    arrayFields: {
                        name: { type: "text" },
                        price: { type: "text" },
                        period: { type: "text", label: "Billing period (e.g. /month)" },
                        description: { type: "text" },
                        features: {
                            type: "array",
                            arrayFields: { text: { type: "text" } },
                            getItemSummary: (item) => item.text,
                            defaultItemProps: { text: "Feature included" },
                        },
                        ctaLabel: { type: "text" },
                        ctaHref: { type: "text" },
                        highlighted: {
                            type: "radio",
                            options: [
                                { label: "Yes", value: true },
                                { label: "No", value: false },
                            ],
                        },
                    },
                    getItemSummary: (item) => item.name,
                    defaultItemProps: {
                        name: "Pro",
                        price: "$29",
                        period: "/month",
                        description: "For growing teams",
                        features: [{ text: "Everything in Starter" }, { text: "Priority support" }],
                        ctaLabel: "Get started",
                        ctaHref: "/",
                        highlighted: false,
                    },
                },
            },
            defaultProps: {
                heading: "Simple, transparent pricing",
                subheading: "",
                plans: [
                    {
                        name: "Starter",
                        price: "$0",
                        period: "/month",
                        description: "For individuals getting started",
                        features: [{ text: "Up to 3 projects" }, { text: "Community support" }],
                        ctaLabel: "Get started",
                        ctaHref: "/",
                        highlighted: false,
                    },
                    {
                        name: "Pro",
                        price: "$29",
                        period: "/month",
                        description: "For growing teams",
                        features: [
                            { text: "Unlimited projects" },
                            { text: "Priority support" },
                            { text: "Advanced analytics" },
                        ],
                        ctaLabel: "Start free trial",
                        ctaHref: "/",
                        highlighted: true,
                    },
                    {
                        name: "Enterprise",
                        price: "Custom",
                        period: "",
                        description: "For large organizations",
                        features: [
                            { text: "Everything in Pro" },
                            { text: "Dedicated support" },
                            { text: "Custom contracts" },
                        ],
                        ctaLabel: "Contact sales",
                        ctaHref: "/",
                        highlighted: false,
                    },
                ],
            },
            render: ({ heading, subheading, plans }) => (
                <section id="pricing" className="bg-white py-20">
                    <div className={container}>
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-neutral-900">{heading}</h2>
                            {subheading && <p className="mt-3 text-neutral-600">{subheading}</p>}
                        </div>
                        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
                            {plans.map((plan) => (
                                <div
                                    key={plan.name}
                                    className={`rounded-2xl border p-8 ${
                                        plan.highlighted ? "border-neutral-900 shadow-lg" : "border-neutral-200"
                                    }`}
                                >
                                    {plan.highlighted && (
                                        <span className="mb-4 inline-block rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium text-white">
                                            Most popular
                                        </span>
                                    )}
                                    <h3 className="text-lg font-semibold text-neutral-900">{plan.name}</h3>
                                    <p className="mt-1 text-sm text-neutral-500">{plan.description}</p>
                                    <div className="mt-6 flex items-baseline gap-1">
                                        <span className="text-4xl font-bold text-neutral-900">{plan.price}</span>
                                        {plan.period && <span className="text-sm text-neutral-500">{plan.period}</span>}
                                    </div>
                                    <ul className="mt-6 space-y-3">
                                        {plan.features.map((feature) => (
                                            <li
                                                key={feature.text}
                                                className="flex items-start gap-2 text-sm text-neutral-700"
                                            >
                                                <span className="mt-0.5 text-neutral-900">✓</span>
                                                {feature.text}
                                            </li>
                                        ))}
                                    </ul>
                                    <a
                                        href={plan.ctaHref}
                                        className={`mt-8 block text-center ${plan.highlighted ? primaryButtonClass : secondaryButtonClass}`}
                                    >
                                        {plan.ctaLabel}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ),
        },

        FAQ: {
            fields: {
                heading: { type: "text" },
                subheading: { type: "textarea" },
                items: {
                    type: "array",
                    arrayFields: {
                        question: { type: "text" },
                        answer: { type: "textarea" },
                    },
                    getItemSummary: (item) => item.question,
                    defaultItemProps: { question: "Question?", answer: "Answer goes here." },
                },
            },
            defaultProps: {
                heading: "Frequently asked questions",
                subheading: "",
                items: [
                    {
                        question: "How does billing work?",
                        answer: "You're billed monthly or annually, cancel any time.",
                    },
                    { question: "Can I change plans later?", answer: "Yes, upgrade or downgrade whenever you like." },
                    { question: "Is there a free trial?", answer: "Yes, all paid plans include a 14-day free trial." },
                ],
            },
            // Uses <details>/<summary> for a dependency-free, accessible accordion.
            render: ({ heading, subheading, items }) => (
                <section id="faq" className="bg-neutral-50 py-20">
                    <div className={`${container} max-w-3xl`}>
                        <div className="text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-neutral-900">{heading}</h2>
                            {subheading && <p className="mt-3 text-neutral-600">{subheading}</p>}
                        </div>
                        <div className="mt-10 divide-y divide-neutral-200 border-t border-b border-neutral-200">
                            {items.map((item) => (
                                <details key={item.question} className="group py-5">
                                    <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-neutral-900">
                                        {item.question}
                                        <span className="ml-4 text-neutral-400 transition-transform group-open:rotate-45">
                                            +
                                        </span>
                                    </summary>
                                    <p className="mt-3 text-sm leading-relaxed text-neutral-600">{item.answer}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>
            ),
        },

        CallToAction: {
            fields: {
                heading: { type: "text" },
                subheading: { type: "textarea" },
                buttonLabel: { type: "text" },
                buttonHref: { type: "text" },
                secondaryLabel: { type: "text", label: "Secondary link label (optional)" },
                secondaryHref: { type: "text" },
            },
            defaultProps: {
                heading: "Ready to get started?",
                subheading: "",
                buttonLabel: "Sign up now",
                buttonHref: "/",
                secondaryLabel: "",
                secondaryHref: "",
            },
            render: ({ heading, subheading, buttonLabel, buttonHref, secondaryLabel, secondaryHref }) => (
                <section className="bg-neutral-900 py-20">
                    <div className={`${container} text-center`}>
                        <h2 className="text-3xl font-bold text-white">{heading}</h2>
                        {subheading && <p className="mx-auto mt-3 max-w-xl text-neutral-400">{subheading}</p>}
                        <div className="mt-8 flex justify-center gap-4">
                            <a
                                href={buttonHref}
                                className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-200"
                            >
                                {buttonLabel}
                            </a>
                            {secondaryLabel && (
                                <a
                                    href={secondaryHref}
                                    className="inline-flex items-center justify-center rounded-lg border border-neutral-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                                >
                                    {secondaryLabel}
                                </a>
                            )}
                        </div>
                    </div>
                </section>
            ),
        },

        Footer: {
            fields: {
                logoText: { type: "text" },
                tagline: { type: "text" },
                columns: {
                    type: "array",
                    arrayFields: {
                        heading: { type: "text" },
                        links: {
                            type: "array",
                            arrayFields: {
                                label: { type: "text" },
                                href: { type: "text" },
                            },
                            getItemSummary: (item) => item.label,
                            defaultItemProps: { label: "Link", href: "/" },
                        },
                    },
                    getItemSummary: (item) => item.heading,
                    defaultItemProps: {
                        heading: "Product",
                        links: [{ label: "Features", href: "#features" }],
                    },
                },
                bottomText: { type: "text" },
            },
            defaultProps: {
                logoText: "Acme",
                tagline: "Building the future, one release at a time.",
                columns: [
                    {
                        heading: "Product",
                        links: [
                            { label: "Features", href: "#features" },
                            { label: "Pricing", href: "#pricing" },
                        ],
                    },
                    {
                        heading: "Company",
                        links: [
                            { label: "About", href: "/about" },
                            { label: "Careers", href: "/careers" },
                        ],
                    },
                    {
                        heading: "Legal",
                        links: [
                            { label: "Privacy", href: "/privacy" },
                            { label: "Terms", href: "/terms" },
                        ],
                    },
                ],
                bottomText: `© ${new Date().getFullYear()} Acme. All rights reserved.`,
            },
            render: ({ logoText, tagline, columns, bottomText }) => (
                <footer className="border-t border-neutral-200 bg-white py-16">
                    <div className={container}>
                        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
                            <div className="col-span-2">
                                <span className="text-lg font-bold text-neutral-900">{logoText}</span>
                                {tagline && <p className="mt-3 max-w-xs text-sm text-neutral-500">{tagline}</p>}
                            </div>
                            {columns.map((column) => (
                                <div key={column.heading}>
                                    <h4 className="text-sm font-semibold text-neutral-900">{column.heading}</h4>
                                    <ul className="mt-4 space-y-3">
                                        {column.links.map((link) => (
                                            <li key={link.label}>
                                                <a
                                                    href={link.href}
                                                    className="text-sm text-neutral-500 hover:text-neutral-900"
                                                >
                                                    {link.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        <div className="mt-12 border-t border-neutral-200 pt-8 text-sm text-neutral-500">
                            {bottomText}
                        </div>
                    </div>
                </footer>
            ),
        },
    },
};

const componentContentSchemas = Object.entries(componentPropsSchemas.shape).map(([type, schema]) =>
    z.object({
        type: z.literal(type),
        props: schema.extend({ id: z.string() }),
    }),
);

const contentItemSchema = z.discriminatedUnion(
    "type",
    componentContentSchemas as [
        (typeof componentContentSchemas)[number],
        ...(typeof componentContentSchemas)[number][],
    ],
);

export const puckDataSchema = z.object({
    root: z.object({ props: z.object({ title: z.string() }).partial().optional() }).loose(),
    content: z.array(contentItemSchema),
    zones: z.record(z.string(), z.array(contentItemSchema)).optional(),
}) satisfies z.ZodType<Partial<Data>>;

export const pageTitleSchema = z.string().trim().min(1, "Enter a title.").max(80, "Use at most 80 characters.");

export const pagePathSchema = z
    .string()
    .trim()
    .toLowerCase()
    .transform((value) => (value.startsWith("/") ? value : `/${value}`))
    .transform((value) => (value.length > 1 ? value.replace(/\/+$/, "") : value))
    .refine(
        (value) => value === "/" || /^\/[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(value),
        "Use lowercase letters, numbers, hyphens and slashes only.",
    );

/** Builds a starter landing page with fresh block ids for a new page:
 *  Header → Hero → LogoCloud → FeatureGrid → FeatureSplit → Stats → Testimonials → Pricing → FAQ → CallToAction → Footer. */
export const createLandingPageTemplate = (title: string): Data => ({
    root: { props: { title } },
    content: [
        {
            type: "Header",
            props: {
                id: crypto.randomUUID(),
                logoText: title,
                logoImageSrc: "",
                links: [
                    { label: "Features", href: "#features" },
                    { label: "Pricing", href: "#pricing" },
                    { label: "FAQ", href: "#faq" },
                ],
                ctaLabel: "Sign up",
                ctaHref: "/",
            },
        },
        {
            type: "Hero",
            props: {
                id: crypto.randomUUID(),
                eyebrow: "",
                title,
                subtitle: "A short pitch that explains what this product does and who it's for.",
                ctaLabel: "Get started",
                ctaHref: "/",
                secondaryLabel: "",
                secondaryHref: "",
                image: { src: "", alt: "" },
                align: "center",
            },
        },
        {
            type: "LogoCloud",
            props: {
                id: crypto.randomUUID(),
                heading: "Trusted by teams at",
                logos: [
                    { src: "", alt: "Company One" },
                    { src: "", alt: "Company Two" },
                    { src: "", alt: "Company Three" },
                    { src: "", alt: "Company Four" },
                ],
            },
        },
        {
            type: "FeatureGrid",
            props: {
                id: crypto.randomUUID(),
                heading: "Why choose us",
                subheading: "",
                columns: "3",
                features: [
                    { icon: "⚡", title: "Fast", description: "Ships in minutes, not weeks." },
                    { icon: "🧩", title: "Simple", description: "No unnecessary configuration." },
                    { icon: "🛡️", title: "Reliable", description: "Built to stay up." },
                ],
            },
        },
        {
            type: "FeatureSplit",
            props: {
                id: crypto.randomUUID(),
                eyebrow: "",
                title: "See it in action",
                description: "Show what makes your product different with a supporting visual.",
                bullets: [{ text: "First benefit" }, { text: "Second benefit" }, { text: "Third benefit" }],
                ctaLabel: "",
                ctaHref: "",
                image: { src: "", alt: "" },
                imageSide: "right",
            },
        },
        {
            type: "Stats",
            props: {
                id: crypto.randomUUID(),
                heading: "",
                stats: [
                    { value: "10k+", label: "Active users" },
                    { value: "99.9%", label: "Uptime" },
                    { value: "40+", label: "Countries" },
                    { value: "4.9/5", label: "Average rating" },
                ],
            },
        },
        {
            type: "Testimonials",
            props: {
                id: crypto.randomUUID(),
                heading: "Loved by teams everywhere",
                subheading: "",
                testimonials: [
                    {
                        quote: "This product changed how our team works.",
                        name: "Jane Doe",
                        role: "VP of Engineering, Acme",
                        avatarSrc: "",
                    },
                    {
                        quote: "The best tool we've adopted this year, hands down.",
                        name: "John Smith",
                        role: "Founder, Widgetco",
                        avatarSrc: "",
                    },
                    {
                        quote: "Support is fast and the product just works.",
                        name: "Priya Nair",
                        role: "Product Lead, Northstar",
                        avatarSrc: "",
                    },
                ],
            },
        },
        {
            type: "Pricing",
            props: {
                id: crypto.randomUUID(),
                heading: "Simple, transparent pricing",
                subheading: "",
                plans: [
                    {
                        name: "Starter",
                        price: "$0",
                        period: "/month",
                        description: "For individuals getting started",
                        features: [{ text: "Up to 3 projects" }, { text: "Community support" }],
                        ctaLabel: "Get started",
                        ctaHref: "/",
                        highlighted: false,
                    },
                    {
                        name: "Pro",
                        price: "$29",
                        period: "/month",
                        description: "For growing teams",
                        features: [
                            { text: "Unlimited projects" },
                            { text: "Priority support" },
                            { text: "Advanced analytics" },
                        ],
                        ctaLabel: "Start free trial",
                        ctaHref: "/",
                        highlighted: true,
                    },
                    {
                        name: "Enterprise",
                        price: "Custom",
                        period: "",
                        description: "For large organizations",
                        features: [
                            { text: "Everything in Pro" },
                            { text: "Dedicated support" },
                            { text: "Custom contracts" },
                        ],
                        ctaLabel: "Contact sales",
                        ctaHref: "/",
                        highlighted: false,
                    },
                ],
            },
        },
        {
            type: "FAQ",
            props: {
                id: crypto.randomUUID(),
                heading: "Frequently asked questions",
                subheading: "",
                items: [
                    {
                        question: "How does billing work?",
                        answer: "You're billed monthly or annually, cancel any time.",
                    },
                    { question: "Can I change plans later?", answer: "Yes, upgrade or downgrade whenever you like." },
                    { question: "Is there a free trial?", answer: "Yes, all paid plans include a 14-day free trial." },
                ],
            },
        },
        {
            type: "CallToAction",
            props: {
                id: crypto.randomUUID(),
                heading: "Ready to get started?",
                subheading: "",
                buttonLabel: "Sign up now",
                buttonHref: "/",
                secondaryLabel: "",
                secondaryHref: "",
            },
        },
        {
            type: "Footer",
            props: {
                id: crypto.randomUUID(),
                logoText: title,
                tagline: "Building the future, one release at a time.",
                columns: [
                    {
                        heading: "Product",
                        links: [
                            { label: "Features", href: "#features" },
                            { label: "Pricing", href: "#pricing" },
                        ],
                    },
                    {
                        heading: "Company",
                        links: [
                            { label: "About", href: "/about" },
                            { label: "Careers", href: "/careers" },
                        ],
                    },
                    {
                        heading: "Legal",
                        links: [
                            { label: "Privacy", href: "/privacy" },
                            { label: "Terms", href: "/terms" },
                        ],
                    },
                ],
                bottomText: `© ${new Date().getFullYear()} ${title}. All rights reserved.`,
            },
        },
    ],
});

/** Derives a URL path from a title as the user types, e.g. "About Us" -> "/about-us". */
export const slugifyToPath = (title: string) => {
    const slug = title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    return slug ? `/${slug}` : "/";
};

export default config;
