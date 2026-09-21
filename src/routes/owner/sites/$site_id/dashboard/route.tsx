import { createFileRoute, notFound, Outlet, redirect } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "#/components/ui/sidebar";
import { getOwnerSitesFn } from "#/routes/owner/-lib/-server/get-owner-sites.function";
import { ownerKeys } from "#/routes/owner/-lib/owner-keys";
import SiteSidebar from "./-components/site-sidebar";

export const Route = createFileRoute("/owner/sites/$site_id/dashboard")({
    beforeLoad: ({ context }) => {
        if (!context.owner) {
            throw redirect({ to: "/owner/signin" });
        }
    },
    loader: async ({ context, params }) => {
        const sites = await context.queryClient.query({
            queryKey: ownerKeys.sites,
            queryFn: () => getOwnerSitesFn(),
            staleTime: 30_000,
        });
        const site = sites.find((s) => s.id === params.site_id);
        if (!site) {
            throw notFound();
        }
        return site;
    },
    component: RouteComponent,
});

function RouteComponent() {
    const site = Route.useLoaderData();
    return (
        <SidebarProvider>
            <SiteSidebar site={site} />
            <SidebarInset>
                <header className="flex h-12 items-center border-b px-4">
                    <SidebarTrigger />
                </header>
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    );
}
