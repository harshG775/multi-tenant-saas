import { defineRelations } from "drizzle-orm";
import * as schema from "#/lib/db/schema/index";

export const relations = defineRelations(schema, (r) => ({
    user: {
        sessions: r.many.session(),
        accounts: r.many.account(),
    },
    session: {
        user: r.one.user({
            from: r.session.userId,
            to: r.user.id,
        }),
    },
    account: {
        user: r.one.user({
            from: r.account.userId,
            to: r.user.id,
        }),
    },
    ownerUser: {
        sessions: r.many.ownerSession(),
        accounts: r.many.ownerAccount(),
        ownedSites: r.many.site(),
    },
    ownerSession: {
        user: r.one.ownerUser({
            from: r.ownerSession.userId,
            to: r.ownerUser.id,
        }),
    },
    ownerAccount: {
        user: r.one.ownerUser({
            from: r.ownerAccount.userId,
            to: r.ownerUser.id,
        }),
    },
    site: {
        owner: r.one.ownerUser({
            from: r.site.ownerId,
            to: r.ownerUser.id,
        }),
        domains: r.many.siteDomain(),
        pages: r.many.page(),
    },
    siteDomain: {
        site: r.one.site({
            from: r.siteDomain.siteId,
            to: r.site.id,
        }),
    },
    page: {
        site: r.one.site({
            from: r.page.siteId,
            to: r.site.id,
        }),
    },
}));
