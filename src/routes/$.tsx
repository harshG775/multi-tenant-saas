import { createFileRoute, redirect, useRouteContext } from "@tanstack/react-router";

export const Route = createFileRoute("/$")({
    beforeLoad: ({ context }) => {
        if (!context.site) {
            throw redirect({ to: "/owner" });
        }
    },
    component: RouteComponent,
});

function RouteComponent() {
    const context = useRouteContext({ from: "__root__" });
    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold">
                Welcome to <span className="text-primary">{context?.site?.name}</span> website
            </h1>
        </div>
    );
}
