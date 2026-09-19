import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/")({
    component: RouteComponent,
});

function RouteComponent() {
    const context = useRouteContext({ from: "__root__" });
    if (context.tenant) {
        return (
            <div className="p-8">
                <h1 className="text-4xl font-bold">
                    Welcome to <span className="text-primary">{context.tenant?.id}</span> website
                </h1>
            </div>
        );
    }
    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold">Welcome to multi tenant</h1>
            <Button>get started</Button>
        </div>
    );
}
