import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/owner/sites/$site_id/dashboard")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="flex h-screen">
            <div className="min-w-64 bg-sidebar">sidebar</div>
            <div className="flex-1 p-2"><Outlet /></div>
        </div>
    );
}
