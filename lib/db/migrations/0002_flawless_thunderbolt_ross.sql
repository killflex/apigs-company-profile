ALTER TABLE "team_members" ADD COLUMN "avatar_public_id" varchar(255);--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "avatar_secure_url" varchar(500);--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "avatar_format" varchar(10);--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "avatar_width" integer;--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "avatar_height" integer;--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "avatar_version" varchar(20);--> statement-breakpoint
ALTER TABLE "team_members" DROP COLUMN "bio";