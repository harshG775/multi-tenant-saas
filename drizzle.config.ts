import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"

config({ path: [".env.local", ".env"] })

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) throw new Error(".env DATABASE_URL not found")

export default defineConfig({
    out: "./src/lib/db/migrations",
    schema: "./src/lib/db/schema/index.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: DATABASE_URL,
    },
})
