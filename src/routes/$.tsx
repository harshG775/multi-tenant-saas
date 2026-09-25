import { Render } from "@puckeditor/core";
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { NotFound } from "#/components/not-found";
import { RouteError } from "#/components/route-error";
import { RoutePending } from "#/components/route-pending";
import config from "#/lib/puck/config.puck";
import { getPageFn } from "#/lib/puck/page.function";

export const Route = createFileRoute("/$")({
    beforeLoad: ({ context }) => {
        if (!context.site) {
            throw redirect({ to: "/owner" });
        }
    },
    loader: async ({ params }) => {
        const path = `/${params._splat ?? ""}`;

        const data = await getPageFn({ data: { path } });
        if (!data) {
            throw notFound();
        }

        return data;
    },
    pendingComponent: RoutePending,
    errorComponent: RouteError,
    notFoundComponent: NotFound,
    component: RouteComponent,
});

function RouteComponent() {
    const data = Route.useLoaderData();
    return <Render config={config} data={data} />;
}