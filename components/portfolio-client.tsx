"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string | null;
  technologies: string[];
  categoryId: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

export default function PortfolioClient() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: "all", name: "All Projects", slug: "all" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsRes, categoriesRes] = await Promise.all([
        fetch("/api/admin/projects?public=true"),
        fetch("/api/admin/categories?public=true"),
      ]);

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData);
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories([
          { id: "all", name: "All Projects", slug: "all" },
          ...categoriesData,
        ]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter((p) => p.categoryId === selectedCategory);

  return (
    <>
      {/* Hero Section */}
      <section className="pt-24 md:pt-36">
        <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
          <div className="relative z-10 mx-auto max-w-3xl space-y-6 text-center">
            <h1 className="text-balance text-4xl font-semibold lg:text-6xl">
              Portfolio Proyek Kami
            </h1>
            <p className="text-lg text-muted-foreground">
              Jelajahi berbagai proyek teknologi yang telah kami kerjakan untuk
              membantu klien mencapai tujuan bisnis mereka. Dari startup hingga
              enterprise, kami bangga dengan hasil yang telah dicapai bersama.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="py-8">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                size="sm"
                className="rounded-full"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-6">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card
                  key={i}
                  className="rounded-xl border gap-0 p-0 shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="aspect-video bg-muted animate-pulse" />
                  <CardHeader>
                    <div className="h-6 bg-muted rounded animate-pulse" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => {
                  const category = categories.find(
                    (c) => c.id === project.categoryId
                  );

                  return (
                    <Card
                      key={project.id}
                      className="rounded-xl border py-0 shadow-sm hover:shadow-lg transition-shadow overflow-hidden "
                    >
                      <div className="aspect-video bg-muted relative">
                        {project.image && (
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                        )}
                        <div className="absolute top-4 left-4 z-10">
                          <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium">
                            {category?.name || "Uncategorized"}
                          </span>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {project.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 mb-6">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-1">
                          {project.technologies.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 bg-muted rounded text-xs"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 4 && (
                            <span className="px-2 py-1 bg-muted rounded text-xs">
                              +{project.technologies.length - 4}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {filteredProjects.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No projects found in this category.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
