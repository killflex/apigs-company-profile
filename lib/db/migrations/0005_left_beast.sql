ALTER TABLE "projects" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "category_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "image" varchar(500);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "is_active" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "content";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "excerpt";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "featured_image";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "gallery";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "client_name";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "client_logo";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "project_url";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "github_url";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "demo_url";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "start_date";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "end_date";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "team_size";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "featured";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "view_count";