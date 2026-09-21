import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginForm } from "#/routes/owner/-components/login-form";

export const Route = createFileRoute("/owner/login")({
    beforeLoad: ({ context }) => {
        if (context.owner) {
            throw redirect({ to: context.ownedSite ? "/owner/dashboard" : "/owner/onboarding" });
        }
    },
    component: LoginForm,
});
