import { createFileRoute, redirect } from "@tanstack/react-router";
import { OnboardingForm } from "#/routes/owner/-components/onboarding-form";

export const Route = createFileRoute("/owner/sites/new")({
    beforeLoad: ({ context }) => {
        if (!context.owner) {
            throw redirect({ to: "/owner/signup" });
        }
    },
    component: NewSitePage,
});

function NewSitePage() {
    const { platformHost } = Route.useRouteContext();
    return <OnboardingForm platformHost={platformHost} />;
}
