import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { z } from "zod";
import { ownerAuth } from "#/lib/auth/owner-auth";
import { db } from "#/lib/db";
import { site, siteDomain } from "#/lib/db/schema/index";
import { rootDomain } from "#/lib/server/host";
import { siteNameSchema, subdomainSchema } from "./subdomain";

const createSiteInput = z.object({ name: siteNameSchema, subdomain: subdomainSchema });

export type CreateSiteResult = { ok: true } | { ok: false; field: "subdomain" | "form"; message: string };

const isUniqueViolation = (error: unknown): boolean => {
    let current = error;
    while (typeof current === "object" && current !== null) {
        if ("code" in current && current.code === "23505") {
            return true;
        }
        current = "cause" in current ? current.cause : null;
    }
    return false;
};

export const createSiteFn = createServerFn({ method: "POST" })
    .inputValidator(createSiteInput)
    .handler(async ({ data }): Promise<CreateSiteResult> => {
        const session = await ownerAuth.api.getSession({ headers: getRequestHeaders() });
        if (!session) {
            throw new Error("Unauthorized");
        }

        const existing = await db.query.site.findFirst({ where: { ownerId: session.user.id } });
        if (existing) {
            return { ok: false, field: "form", message: "You already have a site." };
        }

        const siteId = crypto.randomUUID();

        try {
            await db.batch([
                db.insert(site).values({ id: siteId, name: data.name, ownerId: session.user.id }),
                db.insert(siteDomain).values({
                    id: crypto.randomUUID(),
                    siteId,
                    hostname: `${data.subdomain}.${rootDomain}`,
                    kind: "subdomain",
                    isPrimary: true,
                }),
            ]);
        } catch (error) {
            if (isUniqueViolation(error)) {
                return { ok: false, field: "subdomain", message: "That subdomain is already taken." };
            }
            throw error;
        }

        return { ok: true };
    });
