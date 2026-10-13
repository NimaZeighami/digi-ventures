CREATE TYPE "public"."user_role" AS ENUM('customer', 'admin', 'super_admin');--> statement-breakpoint
CREATE TYPE "public"."request_sector" AS ENUM('ecommerce', 'fintech', 'platform', 'supply_chain', 'ai', 'other');--> statement-breakpoint
CREATE TYPE "public"."request_stage" AS ENUM('seed', 'early', 'growth', 'scale');--> statement-breakpoint
CREATE TYPE "public"."request_status" AS ENUM('draft', 'submitted', 'under_review', 'needs_revision', 'accepted', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."article_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."email_outbox_status" AS ENUM('pending', 'sent', 'failed');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'customer' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" varchar(255) NOT NULL,
	"ip_address" varchar(45),
	"user_agent" varchar(500),
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "investment_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"startup_name" varchar(100) NOT NULL,
	"founder_name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"sector" "request_sector" NOT NULL,
	"stage" "request_stage" NOT NULL,
	"description" text NOT NULL,
	"file_path" varchar(500),
	"original_file_name" varchar(255),
	"file_size" integer,
	"mime_type" varchar(100),
	"status" "request_status" DEFAULT 'draft' NOT NULL,
	"admin_message" text,
	"internal_note" text,
	"idempotency_key" varchar(64) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "investment_requests_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "request_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid NOT NULL,
	"actor_id" uuid NOT NULL,
	"from_status" "request_status" NOT NULL,
	"to_status" "request_status" NOT NULL,
	"admin_message" text,
	"internal_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "news_articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"cover_image" varchar(500),
	"status" "article_status" DEFAULT 'draft' NOT NULL,
	"reading_time_minutes" integer DEFAULT 3 NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "news_articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contact_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"subject" varchar(200) NOT NULL,
	"message" text NOT NULL,
	"ip_address" varchar(45),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "email_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(50) NOT NULL,
	"subject" varchar(255) NOT NULL,
	"body" text NOT NULL,
	"updated_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "email_templates_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "password_resets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" varchar(255) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "password_resets_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rate_limits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(255) NOT NULL,
	"points" integer DEFAULT 1 NOT NULL,
	"expire_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rate_limits_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "email_outbox" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"to_email" varchar(255) NOT NULL,
	"subject" varchar(255) NOT NULL,
	"html_body" text NOT NULL,
	"text_body" text,
	"status" "email_outbox_status" DEFAULT 'pending' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"last_error" text,
	"sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "investment_requests" ADD CONSTRAINT "investment_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "request_status_history" ADD CONSTRAINT "request_status_history_request_id_investment_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."investment_requests"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "request_status_history" ADD CONSTRAINT "request_status_history_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "news_articles" ADD CONSTRAINT "news_articles_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_templates" ADD CONSTRAINT "email_templates_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "password_resets" ADD CONSTRAINT "password_resets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sessions_user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sessions_expires_at_idx" ON "sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "requests_user_id_idx" ON "investment_requests" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "requests_status_idx" ON "investment_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "requests_created_at_idx" ON "investment_requests" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "status_history_request_id_idx" ON "request_status_history" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "status_history_created_at_idx" ON "request_status_history" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "news_slug_idx" ON "news_articles" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "news_status_idx" ON "news_articles" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "news_published_at_idx" ON "news_articles" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "contact_created_at_idx" ON "contact_submissions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "password_resets_user_id_idx" ON "password_resets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "password_resets_expires_at_idx" ON "password_resets" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rate_limits_key_idx" ON "rate_limits" USING btree ("key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rate_limits_expire_at_idx" ON "rate_limits" USING btree ("expire_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_outbox_status_idx" ON "email_outbox" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_outbox_created_at_idx" ON "email_outbox" USING btree ("created_at");