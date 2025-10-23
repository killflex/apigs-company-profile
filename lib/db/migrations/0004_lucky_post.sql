ALTER TABLE "inquiries" ALTER COLUMN "subject" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "inquiries" DROP COLUMN "position";--> statement-breakpoint
ALTER TABLE "inquiries" DROP COLUMN "budget";--> statement-breakpoint
ALTER TABLE "inquiries" DROP COLUMN "timeline";--> statement-breakpoint
ALTER TABLE "inquiries" DROP COLUMN "source";