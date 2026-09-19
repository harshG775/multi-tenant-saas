import { createFileRoute, redirect } from "@tanstack/react-router";
import { OwnerDashboard } from "#/features/owner/components/owner-dashboard";

export const Route = createFileRoute("/owner/dashboard")({
    beforeLoad: ({ context }) => {
        if (!context.owner) {
            throw redirect({ to: "/owner/login" });
        }
        if (!context.ownedSite) {
            throw redirect({ to: "/owner/onboarding" });
        }
        return { owner: context.owner, ownedSite: context.ownedSite };
    },
    component: DashboardPage,
});

function DashboardPage() {
    const { owner, ownedSite } = Route.useRouteContext();
    return <OwnerDashboard ownerName={owner.name} siteName={ownedSite.name} siteUrl={ownedSite.url} />;
}
