import { pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const tenant = pgTable("tenant", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    hostname: text("hostname").notNull().unique(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
})
