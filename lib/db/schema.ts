import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  jsonb,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Categories Table (for portfolio and services)
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  type: varchar("type", { length: 50 }).notNull(), // 'portfolio', 'service'
  color: varchar("color", { length: 7 }), // hex color
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Portfolio Projects Table
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(), // Short description for card
  image: varchar("image", { length: 500 }), // Project image/screenshot
  technologies: jsonb("technologies").$type<string[]>(), // Array of tech stack
  categoryId: uuid("category_id")
    .references(() => categories.id)
    .notNull(),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact Inquiries Table
export const inquiries = pgTable("inquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  company: varchar("company", { length: 200 }),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  inquiryType: varchar("inquiry_type", { length: 50 }).notNull(), // general, project, partnership, support
  status: varchar("status", { length: 20 }).notNull().default("new"), // new, contacted, qualified, converted, closed
  priority: varchar("priority", { length: 20 }).default("medium"), // low, medium, high, urgent
  followUpDate: timestamp("follow_up_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Testimonials Table
export const testimonials = pgTable("testimonials", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  position: varchar("position", { length: 150 }),
  company: varchar("company", { length: 200 }),
  text: text("text").notNull(), // The testimonial content
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Team Members Table
export const teamMembers = pgTable("team_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  displayName: varchar("display_name", { length: 200 }).notNull(), // For "Ferry Hasan" format
  jobTitle: varchar("job_title", { length: 150 }).notNull(), // "Founder - CEO"
  department: varchar("department", { length: 100 }), // "Executive", "Engineering", "Design", etc.
  // Cloudinary avatar fields
  avatarPublicId: varchar("avatar_public_id", { length: 255 }), // Cloudinary public_id for the image
  avatarUrl: varchar("avatar_url", { length: 500 }), // Full Cloudinary URL
  avatarSecureUrl: varchar("avatar_secure_url", { length: 500 }), // HTTPS Cloudinary URL
  avatarFormat: varchar("avatar_format", { length: 10 }), // Image format (jpg, png, webp, etc.)
  avatarWidth: integer("avatar_width"), // Original image width
  avatarHeight: integer("avatar_height"), // Original image height
  avatarVersion: varchar("avatar_version", { length: 20 }), // Cloudinary version for cache busting
  // Social media links
  linkedinUrl: varchar("linkedin_url", { length: 300 }),
  instagramUrl: varchar("instagram_url", { length: 300 }),
  githubUrl: varchar("github_url", { length: 300 }),
  twitterUrl: varchar("twitter_url", { length: 300 }), // Optional additional social
  websiteUrl: varchar("website_url", { length: 300 }), // Personal website
  // Contact and employment info
  email: varchar("email", { length: 255 }), // Work email
  phone: varchar("phone", { length: 20 }), // Work phone
  startDate: timestamp("start_date"), // When they joined the company
  // Status and display settings
  isActive: boolean("is_active").default(true), // Current employee status
  isPublic: boolean("is_public").default(true), // Show on public team page
  sortOrder: integer("sort_order").default(0), // Display order on team page
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Company Details Table
export const companyDetails = pgTable("company_details", {
  id: uuid("id").primaryKey().defaultRandom(),
  // Company Stats
  teamMembersCount: integer("team_members_count").default(0), // Total team members
  yearsExperience: integer("years_experience").default(0), // Combined years of experience
  projectsCompleted: integer("projects_completed").default(0), // Total projects completed
  // Company Information
  companyName: varchar("company_name", { length: 200 }).notNull(),
  tagline: varchar("tagline", { length: 300 }), // Company tagline/slogan
  aboutUs: text("about_us"), // About us text
  vision: text("vision"), // Company vision statement
  mission: text("mission"), // Company mission statement
  // Contact Information
  officeAddress: text("office_address"), // Main office address
  officeAddressUrl: varchar("office_address_url", { length: 500 }), // Google Maps URL
  officePhone: varchar("office_phone", { length: 50 }), // Office phone number
  contactEmail: varchar("contact_email", { length: 255 }), // General contact email
  supportEmail: varchar("support_email", { length: 255 }), // Support email
  // Operational Details
  operationalHours: text("operational_hours"), // E.g., "Monday-Friday, 9 AM - 6 PM"
  timezone: varchar("timezone", { length: 50 }).default("Asia/Jakarta"), // Company timezone
  // Social Media & Web
  websiteUrl: varchar("website_url", { length: 300 }),
  linkedinUrl: varchar("linkedin_url", { length: 300 }),
  instagramUrl: varchar("instagram_url", { length: 300 }),
  facebookUrl: varchar("facebook_url", { length: 300 }),
  twitterUrl: varchar("twitter_url", { length: 300 }),
  youtubeUrl: varchar("youtube_url", { length: 300 }),
  // Additional Company Info
  foundedYear: integer("founded_year"), // Year company was founded
  certifications: jsonb("certifications").$type<string[]>(), // Array of certifications
  // Settings
  isActive: boolean("is_active").default(true), // Only one active record should exist
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blog Posts Table
export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"), // Short summary for card display
  content: text("content").notNull(), // Main blog content
  featuredImage: varchar("featured_image", { length: 500 }), // Cloudinary URL
  featuredImagePublicId: varchar("featured_image_public_id", { length: 255 }), // For deletion
  gallery:
    jsonb("gallery").$type<
      Array<{ url: string; publicId: string; caption?: string }>
    >(), // Photo gallery
  category: varchar("category", { length: 100 }), // Technology, Tutorial, Case Study, etc.
  tags: jsonb("tags").$type<string[]>(), // Array of tags
  author: varchar("author", { length: 200 }).notNull(), // Author name
  authorId: varchar("author_id", { length: 255 }), // Clerk user ID
  status: varchar("status", { length: 20 }).notNull().default("draft"), // draft, published
  featured: boolean("featured").default(false), // Show on homepage
  viewCount: integer("view_count").default(0), // Track popularity
  publishedAt: timestamp("published_at"), // When published
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  category: one(categories, {
    fields: [projects.categoryId],
    references: [categories.id],
  }),
}));

// Type exports for use in the application
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type Inquiry = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;

export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;

export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;

export type CompanyDetail = typeof companyDetails.$inferSelect;
export type NewCompanyDetail = typeof companyDetails.$inferInsert;

export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;
