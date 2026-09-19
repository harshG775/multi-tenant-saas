CREATE TABLE "owner_account" (
	"id" text PRIMARY KEY,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "owner_session" (
	"id" text PRIMARY KEY,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "owner_user" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "owner_verification" (
	"id" text PRIMARY KEY,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"owner_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_domain" (
	"id" text PRIMARY KEY,
	"site_id" text NOT NULL,
	"hostname" text NOT NULL UNIQUE,
	"kind" text NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"verified_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "owner_account_userId_idx" ON "owner_account" ("user_id");--> statement-breakpoint
CREATE INDEX "owner_session_userId_idx" ON "owner_session" ("user_id");--> statement-breakpoint
CREATE INDEX "owner_verification_identifier_idx" ON "owner_verification" ("identifier");--> statement-breakpoint
CREATE INDEX "site_owner_id_idx" ON "site" ("owner_id");--> statement-breakpoint
CREATE INDEX "site_domain_site_id_idx" ON "site_domain" ("site_id");--> statement-breakpoint
ALTER TABLE "owner_account" ADD CONSTRAINT "owner_account_user_id_owner_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "owner_user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "owner_session" ADD CONSTRAINT "owner_session_user_id_owner_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "owner_user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "site" ADD CONSTRAINT "site_owner_id_owner_user_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "owner_user"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "site_domain" ADD CONSTRAINT "site_domain_site_id_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "site"("id") ON DELETE CASCADE;