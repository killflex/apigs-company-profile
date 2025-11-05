"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Tag, Eye, ArrowLeft, Share2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  gallery: Array<{ url: string; publicId: string; caption?: string }> | null;
  category: string | null;
  tags: string[] | null;
  author: string;
  viewCount: number | null;
  publishedAt: string | null;
  createdAt: string;
};

interface BlogPostClientProps {
  post: BlogPost;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  // Format date
  const formatDate = (date: string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Share post
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || "",
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link berhasil disalin!");
    }
  };

  return (
    <section className="pt-20 mx-auto max-w-4xl">
      {/* Back Button */}
      <div className="py-8">
        <Link href="/blog">
          <Button variant="ghost" size="sm" className="cursor-pointer">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Blog
          </Button>
        </Link>
      </div>

      {/* Article Header */}
      <div className="mx-auto pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Category */}
          {post.category && (
            <div className="mb-4">
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                {post.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{post.viewCount || 0} views</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Oleh {post.author}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="ml-auto"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Bagikan
            </Button>
          </div>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="aspect-video overflow-hidden rounded-lg mb-8">
              <Image
                src={post.featuredImage}
                alt={post.title}
                width={1280}
                height={720}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Excerpt */}
          {post.excerpt && (
            <div className="text-xl text-muted-foreground pb-8 border-b">
              {post.excerpt}
            </div>
          )}
        </div>
      </div>

      {/* Article Content */}
      <div className="mx-auto pb-12">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 md:p-12">
              <div
                className="prose prose-lg dark:prose-invert max-w-none"
                style={{
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                }}
              >
                {post.content}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Photo Gallery */}
      {post.gallery && post.gallery.length > 0 && (
        <div className="mx-auto pb-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Galeri Foto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {post.gallery.map((image, index) => (
                <div
                  key={index}
                  className="aspect-video overflow-hidden rounded-lg bg-muted"
                >
                  <Image
                    src={image.url}
                    alt={image.caption || `Gallery image ${index + 1}`}
                    width={400}
                    height={300}
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {image.caption && (
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                      {image.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mx-auto pb-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Tags:</span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-muted text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Back to Blog Button */}
      <div className="mx-auto pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <Link href="/blog" className="cursor-pointer">
            <Button size="lg">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Lihat Artikel Lainnya
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
