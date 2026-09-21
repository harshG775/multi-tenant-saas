import { createFileRoute, Link, useRouteContext } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/")({
    component: RouteComponent,
});

function RouteComponent() {
    const context = useRouteContext({ from: "__root__" });
    if (context.site) {
        return (
            <div className="p-8">
                <h1 className="text-4xl font-bold">
                    Welcome to <span className="text-primary">{context.site.name}</span> website
                </h1>
            </div>
        );
    }
    return <PlatformLanding />;
}

const highlights = [
    { title: "Your own address", description: "Every site gets its own subdomain, ready the moment you create it." },
    { title: "Custom domains", description: "Add your own domain to any site and serve it from your brand's address." },
    { title: "One dashboard", description: "See, open and manage all your sites in a single place." },
];

function PlatformLanding() {
    return (
        <main className="relative isolate flex min-h-svh flex-col">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, var(--border) 1px, transparent 1px),
                        linear-gradient(to bottom, var(--border) 1px, transparent 1px)
                    `,
                    backgroundSize: "20px 30px",
                    WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
                    maskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
                }}
            />
            <header className="flex items-center justify-between px-6 py-4">
                <span className="text-base font-semibold">Multi-Tenant SaaS</span>
                <Button variant="ghost" asChild>
                    <Link to="/owner/signin">Sign in</Link>
                </Button>
            </header>
            <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-10 px-6 py-16 text-center">
                <div className="grid gap-4">
                    <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                        Launch your site in minutes
                    </h1>
                    <p className="mx-auto max-w-xl text-lg text-balance text-muted-foreground">
                        Create an account, pick a name and an address, and your site is live. Add more whenever you
                        like, all from one dashboard.
                    </p>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                    <Button size="lg" asChild>
                        <Link to="/owner/signup">Get started</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <Link to="/owner/signin">Sign in</Link>
                    </Button>
                </div>
                <ul className="grid w-full gap-4 text-left sm:grid-cols-3">
                    {highlights.map(({ title, description }) => (
                        <li key={title} className="grid gap-1 rounded-xl border bg-card p-5">
                            <span className="font-medium">{title}</span>
                            <span className="text-sm text-muted-foreground">{description}</span>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
}
