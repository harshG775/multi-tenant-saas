import { boolean, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { ownerUser } from "./owner-auth.schema";

export const site = pgTable(
    "site",
    {
        id: text("id").primaryKey(),
        name: text("name").notNull(),
        ownerId: text("owner_id")
            .notNull()
            .references(() => ownerUser.id, { onDelete: "restrict" }),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("site_owner_id_idx").on(table.ownerId)],
);

export const siteDomain = pgTable(
    "site_domain",
    {
        id: text("id").primaryKey(),
        siteId: text("site_id")
            .notNull()
            .references(() => site.id, { onDelete: "cascade" }),
        hostname: text("hostname").notNull().unique(),
        kind: text("kind", { enum: ["subdomain", "custom"] }).notNull(),
        isPrimary: boolean("is_primary").default(false).notNull(),
        verifiedAt: timestamp("verified_at"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [index("site_domain_site_id_idx").on(table.siteId)],
);
