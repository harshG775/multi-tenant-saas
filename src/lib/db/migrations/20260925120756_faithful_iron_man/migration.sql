CREATE TABLE "page" (
	"id" text PRIMARY KEY,
	"site_id" text NOT NULL,
	"path" text NOT NULL,
	"data" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "page_site_id_path_idx" ON "page" ("site_id","path");--> statement-breakpoint
ALTER TABLE "page" ADD CONSTRAINT "page_site_id_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "site"("id") ON DELETE CASCADE;