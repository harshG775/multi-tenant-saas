import type { Data } from "@puckeditor/core";
import { jsonb, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { site } from "./site.schema";

export const page = pgTable(
    "page",
    {
        id: text("id").primaryKey(),
        siteId: text("site_id")
            .notNull()
            .references(() => site.id, { onDelete: "cascade" }),
        path: text("path").notNull(),
        data: jsonb("data").$type<Data>().notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [uniqueIndex("page_site_id_path_idx").on(table.siteId, table.path)],
);
