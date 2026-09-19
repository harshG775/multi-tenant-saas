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
    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold">Welcome to multi tenant platform</h1>
            <div className="mt-4 flex gap-2">
                <Button asChild>
                    <Link to="/owner/signup">get started</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link to="/owner/login">log in</Link>
                </Button>
            </div>
        </div>
    );
}
