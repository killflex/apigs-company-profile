import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import BlogClient from "./blog-client";
import HeroHeader from "@/components/hero5-header";
import CallToAction from "@/components/call-to-action";
import FooterSection from "@/components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - APIGS Indonesia",
  description:
    "Insights, tutorials, and updates on technology, software development, AI, and data analytics from APIGS Indonesia.",
};

export default async function BlogPage() {
  // Fetch published blog posts
  const posts = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"))
    .orderBy(desc(blogPosts.publishedAt));

  // Serialize dates to strings for client component
  const serializedPosts = posts.map((post) => ({
    ...post,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    createdAt: post.createdAt
      ? post.createdAt.toISOString()
      : new Date().toISOString(),
    updatedAt: post.updatedAt ? post.updatedAt.toISOString() : null,
  }));

  return (
    <>
      <HeroHeader />
      <BlogClient initialPosts={serializedPosts} />
      <CallToAction />

      <FooterSection />
    </>
  );
}
