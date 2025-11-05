"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Calendar, Tag, Eye } from "lucide-react";
import Image from "next/image";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  category: string | null;
  tags: string[] | null;
  author: string;
  viewCount: number | null;
  publishedAt: string | null;
  createdAt: string;
};

interface BlogClientProps {
  initialPosts: BlogPost[];
}

const categoryOptions = [
  "All Categories",
  "Technology",
  "Tutorial",
  "Case Study",
  "Industry Insights",
  "Company News",
  "AI & Machine Learning",
  "Web Development",
  "Data Analytics",
];

export default function BlogClient({ initialPosts }: BlogClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedTag, setSelectedTag] = useState("All Tags");

  // Get all unique tags
  const allTags = Array.from(
    new Set(initialPosts.flatMap((post) => post.tags || []))
  );

  // Filter posts
  const filteredPosts = initialPosts.filter((post) => {
    const matchesSearch =
      searchTerm === "" ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Categories" ||
      post.category === selectedCategory;

    const matchesTag =
      selectedTag === "All Tags" || (post.tags || []).includes(selectedTag);

    return matchesSearch && matchesCategory && matchesTag;
  });

  // Format date
  const formatDate = (date: string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="pt-24 md:pt-36">
        <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
          <div className="relative z-10 mx-auto max-w-3xl space-y-6 text-center">
            <h1 className="text-balance text-4xl font-semibold lg:text-6xl">
              Blog APIGS Indonesia
            </h1>
            <p className="text-lg text-muted-foreground">
              Wawasan, tutorial, dan pembaruan tentang teknologi, pengembangan
              software, AI, dan analitik data
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="pt-20">
        <div className="mx-auto max-w-6xl">
          <Card className="shadow-sm">
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari artikel..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Category Filter */}
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Tag Filter */}
                {allTags.length > 0 && (
                  <Select value={selectedTag} onValueChange={setSelectedTag}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Tags">All Tags</SelectItem>
                      {allTags.map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl">
          {/* Results Count */}
          <p className="text-muted-foreground mb-6">
            Menampilkan {filteredPosts.length} artikel
          </p>

          {/* Blog Posts */}
          {filteredPosts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">
                  Tidak ada artikel yang ditemukan
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="rounded-xl border gap-0 p-0 shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
                >
                  {/* Featured Image */}
                  {post.featuredImage && (
                    <div className="w-full overflow-hidden aspect-16/9 relative">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        width={1207}
                        height={929}
                        className="size-full object-cover dark:mix-blend-lighten"
                      />
                    </div>
                  )}

                  <CardContent className="p-6 space-y-4">
                    {/* Category & Date */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {post.category && (
                        <div className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          <span>{post.category}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="cursor-pointer"
                    >
                      <h2 className="text-xl font-bold line-clamp-2 hover:text-primary transition-colors mb-4">
                        {post.title}
                      </h2>
                    </Link>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-muted-foreground line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-muted text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="px-2 py-0.5 text-xs text-muted-foreground">
                            +{post.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{post.viewCount || 0}</span>
                        </div>
                        <span>Oleh {post.author}</span>
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <Button variant="ghost" size="sm">
                          Selengkapnya →
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
