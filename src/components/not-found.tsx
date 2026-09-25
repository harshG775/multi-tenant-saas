import { Link } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";

/** Set by the root route when the request host matches no site, so the page can link back to the platform. */
const platformUrlFrom = (data: unknown) =>
    typeof data === "object" && data !== null && "platformUrl" in data && typeof data.platformUrl === "string"
        ? data.platformUrl
        : null;

export function NotFound({ data }: { data?: unknown }) {
    const platformUrl = platformUrlFrom(data);

    return (
        <main className="flex min-h-svh items-center justify-center p-6">
            <div className="grid max-w-md gap-4 text-center">
                <h1 className="text-3xl font-semibold tracking-tight">
                    {platformUrl ? "This site doesn't exist" : "Page not found"}
                </h1>
                <p className="text-muted-foreground">
                    {platformUrl
                        ? "There's no site at this address. It may have been removed, or the address may be mistyped."
                        : "The page you're looking for doesn't exist or has moved."}
                </p>
                <div className="flex justify-center">
                    <Button asChild>
                        {platformUrl ? <a href={platformUrl}>Create your own site</a> : <Link to="/$">Go home</Link>}
                    </Button>
                </div>
            </div>
        </main>
    );
}
