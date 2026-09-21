import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "#/components/ui/sidebar";
import DashboardSidebar from "./-components/dashboard-sidebar";

export const Route = createFileRoute("/owner/dashboard")({
    beforeLoad: ({ context }) => {
        if (!context.owner) {
            throw redirect({ to: "/owner/signin" });
        }
        return { owner: context.owner };
    },
    component: RouteComponent,
});

function RouteComponent() {
    const { owner } = Route.useRouteContext();
    return (
        <SidebarProvider>
            <DashboardSidebar owner={owner} />
            <SidebarInset>
                <SidebarTrigger />
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    );
}
