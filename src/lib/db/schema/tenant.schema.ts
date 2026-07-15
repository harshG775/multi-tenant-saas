import { pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const tenant = pgTable("tenant", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    description: text("description").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
})

export const siteDomain = pgTable("site_domain", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    hostname: text("hostname").notNull().unique(),
    tenantId: text("tenant_id")
        .notNull()
        .references(() => tenant.id, { onDelete: "cascade" }), // Links domain to tenant
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
})
