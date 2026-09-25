import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { ownerAuth } from "#/lib/auth/owner-auth";
import { db } from "#/lib/db";
import { page } from "#/lib/db/schema/index";
import { siteOrigin } from "#/lib/server/host";
import { pagePathSchema, pageTitleSchema, puckDataSchema } from "./config.puck";

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

/** Throws unless the current owner session owns `siteId`. */
const requireOwnedSite = async (siteId: string) => {
    const session = await ownerAuth.api.getSession({ headers: getRequestHeaders() });
    if (!session) {
        throw new Error("Unauthorized");
    }
    const site = await db.query.site.findFirst({ where: { id: siteId, ownerId: session.user.id } });
    if (!site) {
        throw new Error("Unauthorized");
    }
};

/** Throws unless the current owner session owns the site that `pageId` belongs to. Returns the page row. */
const requireOwnedPage = async (pageId: string) => {
    const session = await ownerAuth.api.getSession({ headers: getRequestHeaders() });
    if (!session) {
        throw new Error("Unauthorized");
    }
    const row = await db.query.page.findFirst({ where: { id: pageId }, with: { site: true } });
    if (!row?.site || row.site.ownerId !== session.user.id) {
        throw new Error("Unauthorized");
    }
    return row;
};

/** Read a published page for the request's own host (public storefront render). */
export const getPageFn = createServerFn({ method: "GET" })
    .validator(
        z.object({
            path: z.string(),
        }),
    )
    .handler(async ({ data, context }) => {
        if (!context.site) {
            return null;
        }

        const row = await db.query.page.findFirst({
            where: { siteId: context.site.id, path: data.path },
        });
        return row?.data ?? null;
    });

/** List a site's pages for the owner dashboard. Requires the caller to own `siteId`. */
export const listOwnerPagesFn = createServerFn({ method: "GET" })
    .validator(z.object({ siteId: z.string() }))
    .handler(async ({ data }) => {
        await requireOwnedSite(data.siteId);

        const rows = await db.query.page.findMany({
            where: { siteId: data.siteId },
            orderBy: { updatedAt: "desc" },
        });

        return rows.map((row) => ({
            id: row.id,
            path: row.path,
            title: row.data.root?.props?.title || row.path,
            updatedAt: row.updatedAt,
        }));
    });

/** Create a new (empty) page. Requires the caller to own `siteId`. */
export const createOwnerPageFn = createServerFn({ method: "POST" })
    .validator(z.object({ siteId: z.string(), title: pageTitleSchema, path: pagePathSchema }))
    .handler(async ({ data }): Promise<{ ok: true; id: string } | { ok: false; field: "path"; message: string }> => {
        await requireOwnedSite(data.siteId);

        const id = crypto.randomUUID();
        try {
            await db.insert(page).values({
                id,
                siteId: data.siteId,
                path: data.path,
                data: { content: [], root: { props: { title: data.title } } },
            });
        } catch (error) {
            if (isUniqueViolation(error)) {
                return { ok: false, field: "path", message: "That path is already used by another page." };
            }
            throw error;
        }

        return { ok: true, id };
    });

/** Read a page (details + content) for the owner. Requires the caller to own the page's site. */
export const getOwnerPageFn = createServerFn({ method: "GET" })
    .validator(z.object({ pageId: z.string() }))
    .handler(async ({ data }) => {
        const row = await requireOwnedPage(data.pageId);
        const domain = await db.query.siteDomain.findFirst({ where: { siteId: row.siteId, isPrimary: true } });
        return {
            id: row.id,
            path: row.path,
            title: row.data.root?.props?.title || row.path,
            data: row.data,
            siteUrl: domain ? siteOrigin(domain.hostname) : null,
        };
    });

/** Rename a page or move its path. Requires the caller to own the page's site. */
export const updateOwnerPageDetailsFn = createServerFn({ method: "POST" })
    .validator(z.object({ pageId: z.string(), title: pageTitleSchema, path: pagePathSchema }))
    .handler(async ({ data }): Promise<{ ok: true } | { ok: false; field: "path"; message: string }> => {
        const row = await requireOwnedPage(data.pageId);

        try {
            await db
                .update(page)
                .set({
                    path: data.path,
                    data: { ...row.data, root: { ...row.data.root, props: { ...row.data.root?.props, title: data.title } } },
                })
                .where(eq(page.id, data.pageId));
        } catch (error) {
            if (isUniqueViolation(error)) {
                return { ok: false, field: "path", message: "That path is already used by another page." };
            }
            throw error;
        }

        return { ok: true };
    });

/** Delete a page. Requires the caller to own the page's site. */
export const deleteOwnerPageFn = createServerFn({ method: "POST" })
    .validator(z.object({ pageId: z.string() }))
    .handler(async ({ data }) => {
        await requireOwnedPage(data.pageId);
        await db.delete(page).where(eq(page.id, data.pageId));
    });

/** Publish a page's content from the owner editor. Requires the caller to own the page's site. */
export const setOwnerPageFn = createServerFn({ method: "POST" })
    .validator(z.object({ pageId: z.string(), data: puckDataSchema }))
    .handler(async ({ data }) => {
        await requireOwnedPage(data.pageId);

        await db.update(page).set({ data: data.data }).where(eq(page.id, data.pageId));

        return {
            status: "ok",
        };
    });
