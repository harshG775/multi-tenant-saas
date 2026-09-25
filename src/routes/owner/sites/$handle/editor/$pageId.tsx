import { Puck } from "@puckeditor/core";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import config from "#/lib/puck/config.puck";
import { getOwnerPageFn, setOwnerPageFn } from "#/lib/puck/page.function";

export const Route = createFileRoute("/owner/sites/$handle/editor/$pageId")({
    beforeLoad: ({ context }) => {
        if (!context.owner) {
            throw redirect({ to: "/owner/signin" });
        }
    },
    loader: async ({ params }) => {
        return getOwnerPageFn({ data: { pageId: params.pageId } });
    },
    component: RouteComponent,
});

function RouteComponent() {
    const page = Route.useLoaderData();
    const setPage = useServerFn(setOwnerPageFn);

    return (
        <Puck
            config={config}
            data={page.data}
            onPublish={(newData) => {
                setPage({ data: { pageId: page.id, data: newData } });
            }}
        />
    );
}
