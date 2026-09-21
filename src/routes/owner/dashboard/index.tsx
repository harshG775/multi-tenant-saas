import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/owner/dashboard/")({
    beforeLoad: () => {
        throw redirect({ to: "/owner/dashboard/sites" });
    },
});
