import { createFileRoute, redirect } from "@tanstack/react-router";
import { SigninForm } from "#/routes/owner/-components/signin-form";

export const Route = createFileRoute("/owner/signin")({
    beforeLoad: ({ context }) => {
        if (context.owner) {
            throw redirect({ to: "/owner/dashboard" });
        }
    },
    component: SigninForm,
});
