CREATE TYPE "public"."project_status" AS ENUM('in_progress', 'shipped', 'paused', 'concept');--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"tagline" text NOT NULL,
	"description" text NOT NULL,
	"stack" text[] NOT NULL,
	"status" "project_status" DEFAULT 'in_progress' NOT NULL,
	"live_url" text,
	"github_url" text,
	"image_url" text,
	"featured" boolean DEFAULT false NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"started_at" timestamp,
	"shipped_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"ip_hash" varchar(64) NOT NULL,
	"user_agent" text,
	"referrer" text,
	"project_clicked" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "page_views" ADD CONSTRAINT "page_views_project_clicked_projects_id_fk" FOREIGN KEY ("project_clicked") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;