import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { ownerAuth } from "#/lib/auth/owner-auth";
import { db } from "#/lib/db";
import { site } from "#/lib/db/schema/index";

export const deleteSiteFn = createServerFn({ method: "POST" })
    .validator(z.object({ siteId: z.string().min(1) }))
    .handler(async ({ data }) => {
        const session = await ownerAuth.api.getSession({ headers: getRequestHeaders() });
        if (!session) {
            throw new Error("Unauthorized");
        }

        // Scoped to the owner so one owner can never delete another's site. Domains cascade.
        await db.delete(site).where(and(eq(site.id, data.siteId), eq(site.ownerId, session.user.id)));
    });
