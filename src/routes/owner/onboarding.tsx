import { createFileRoute, redirect } from "@tanstack/react-router";
import { OnboardingForm } from "#/routes/owner/-components/onboarding-form";

export const Route = createFileRoute("/owner/onboarding")({
    beforeLoad: ({ context }) => {
        if (!context.owner) {
            throw redirect({ to: "/owner/signup" });
        }
        if (context.ownedSite) {
            throw redirect({ to: "/owner/dashboard" });
        }
    },
    component: OnboardingPage,
});

function OnboardingPage() {
    const { platformHost } = Route.useRouteContext();
    return <OnboardingForm platformHost={platformHost} />;
}
