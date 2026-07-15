import * as schema from "#/lib/db/schema"
import { defineRelations } from "drizzle-orm"

export const relations = defineRelations(schema, (r) => ({
    tenant: {
        siteDomains: r.many.siteDomain(),
        admins: r.many.admin(),
    },
    siteDomain: {
        users: r.many.user(),
        tenant: r.one.tenant({
            from: r.siteDomain.tenantId,
            to: r.tenant.id,
        }),
    },
    user: {
        sessions: r.many.session(),
        accounts: r.many.account(),
        siteDomain: r.one.siteDomain({
            from: r.user.siteDomainId,
            to: r.siteDomain.id,
        }),
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
    admin: {
        sessions: r.many.adminSession(),
        accounts: r.many.adminAccount(),
        tenant: r.one.tenant({
            from: r.admin.tenantId,
            to: r.tenant.id,
        }),
    },
    adminSession: {
        admin: r.one.admin({
            from: r.adminSession.adminId,
            to: r.admin.id,
        }),
    },
    adminAccount: {
        admin: r.one.admin({
            from: r.adminAccount.adminId,
            to: r.admin.id,
        }),
    },
}))
