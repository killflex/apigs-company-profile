import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import BlogPostClient from "./blog-post-client";
import HeroHeader from "@/components/hero5-header";
import FooterSection from "@/components/footer";
import type { Metadata } from "next";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [post] = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .limit(1);

  if (!post) {
    return {
      title: "Post Not Found - APIGS Indonesia",
    };
  }

  return {
    title: `${post.title} - APIGS Indonesia Blog`,
    description: post.excerpt || post.content.substring(0, 160),
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const [post] = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .limit(1);

  if (!post || post.status !== "published") {
    notFound();
  }

  // Increment view count (don't await to not slow down page load)
  db.update(blogPosts)
    .set({ viewCount: (post.viewCount || 0) + 1 })
    .where(eq(blogPosts.id, post.id))
    .then(() => console.log(`View count incremented for post: ${post.id}`))
    .catch((error) => console.error("Failed to increment view count:", error));

  // Serialize dates to strings
  const serializedPost = {
    ...post,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    createdAt: post.createdAt
      ? post.createdAt.toISOString()
      : new Date().toISOString(),
    updatedAt: post.updatedAt ? post.updatedAt.toISOString() : null,
  };

  return (
    <>
      <HeroHeader />
      <BlogPostClient post={serializedPost} />
      <FooterSection />
    </>
  );
}
