import { createFileRoute } from "@tanstack/react-router";
import { userAuth } from "#/lib/auth/user-auth";

export const Route = createFileRoute("/api/v1/auth/$")({
    server: {
        handlers: {
            GET: ({ request }) => userAuth.handler(request),
            POST: ({ request }) => userAuth.handler(request),
        },
    },
});
