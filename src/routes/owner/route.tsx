import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { getOwnerStateFn, ownerStateKey } from "#/features/owner/owner-state.function";

// Owner pages exist only on the platform host; a site host must never serve them.
export const Route = createFileRoute("/owner")({
    beforeLoad: async ({ context }) => {
        if (context.site) {
            throw notFound();
        }
        // Cached so hover preloads and redirects between `/owner/*` pages don't each hit the database.
        return await context.queryClient.query({
            queryKey: ownerStateKey,
            queryFn: () => getOwnerStateFn(),
            staleTime: 30_000,
        });
    },
    component: Outlet,
});
