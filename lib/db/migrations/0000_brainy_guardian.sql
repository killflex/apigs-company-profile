CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"type" varchar(50) NOT NULL,
	"color" varchar(7),
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "inquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(200) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20),
	"company" varchar(200),
	"position" varchar(100),
	"subject" varchar(255),
	"message" text NOT NULL,
	"inquiry_type" varchar(50) NOT NULL,
	"budget" varchar(100),
	"timeline" varchar(100),
	"source" varchar(100),
	"status" varchar(20) DEFAULT 'new' NOT NULL,
	"priority" varchar(20) DEFAULT 'medium',
	"follow_up_date" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"content" jsonb,
	"excerpt" text,
	"featured_image" varchar(500),
	"gallery" jsonb,
	"technologies" jsonb,
	"category_id" uuid,
	"client_name" varchar(200),
	"client_logo" varchar(500),
	"project_url" varchar(500),
	"github_url" varchar(500),
	"demo_url" varchar(500),
	"start_date" timestamp,
	"end_date" timestamp,
	"team_size" integer,
	"status" varchar(20) DEFAULT 'published' NOT NULL,
	"featured" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"view_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"position" varchar(150),
	"company" varchar(200),
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;