import { createFileRoute, redirect } from "@tanstack/react-router";
import { OwnerDashboard } from "#/routes/owner/-components/owner-dashboard";

export const Route = createFileRoute("/owner/dashboard")({
    beforeLoad: ({ context }) => {
        if (!context.owner) {
            throw redirect({ to: "/owner/signin" });
        }
        return { owner: context.owner };
    },
    component: DashboardPage,
});

function DashboardPage() {
    const { owner, ownedSite } = Route.useRouteContext();
    return <OwnerDashboard ownerName={owner.name} site={ownedSite} />;
}
