import { createFileRoute } from "@tanstack/react-router";
import { ownerAuth } from "#/lib/auth/owner-auth";

export const Route = createFileRoute("/api/v1/auth/owner/$")({
    server: {
        handlers: {
            GET: ({ request }) => ownerAuth.handler(request),
            POST: ({ request }) => ownerAuth.handler(request),
        },
    },
});
