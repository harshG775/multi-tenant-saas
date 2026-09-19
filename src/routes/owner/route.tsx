import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { getOwnerStateFn } from "#/features/owner/owner-state.function";

// Owner pages exist only on the platform host; a site host must never serve them.
export const Route = createFileRoute("/owner")({
    beforeLoad: async ({ context }) => {
        if (context.site) {
            throw notFound();
        }
        return await getOwnerStateFn();
    },
    component: Outlet,
});
