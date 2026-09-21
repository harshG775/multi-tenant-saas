import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { env } from "#/env";
import { ownerAuth } from "#/lib/auth/owner-auth";

export const getOwnerStateFn = createServerFn({ method: "GET" }).handler(async () => {
    const platformHost = new URL(env.PLATFORM_URL).host;

    const session = await ownerAuth.api.getSession({ headers: getRequestHeaders() });
    if (!session) {
        return { owner: null, ownedSite: null, platformHost };
    }
    return {
        owner: { id: session.user.id, name: session.user.name, email: session.user.email },
        platformHost,
    };
});
