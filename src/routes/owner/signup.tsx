import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignupForm } from "#/features/owner/components/signup-form";

export const Route = createFileRoute("/owner/signup")({
    beforeLoad: ({ context }) => {
        if (context.owner) {
            throw redirect({ to: context.ownedSite ? "/owner/dashboard" : "/owner/onboarding" });
        }
    },
    component: SignupForm,
});
