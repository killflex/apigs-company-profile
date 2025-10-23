"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploader from "@/components/ui/image-uploader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";

// Form validation schema
const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().optional().or(z.literal("")),
  categoryId: z.string().min(1, "Category is required"),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const techOptions = [
  "Next.js",
  "React",
  "Node.js",
  "Python",
  "TypeScript",
  "PostgreSQL",
  "MongoDB",
  "Docker",
  "AWS",
  "TensorFlow",
  "OpenAI",
  "FastAPI",
  "Vue.js",
  "Angular",
  "Django",
  "Laravel",
  "MySQL",
  "Redis",
];

type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string | null;
  categoryId: string;
  technologies: string[];
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

export default function PortfolioManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>(
    []
  );
  const [projectImage, setProjectImage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch projects and categories on mount
  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/projects");
      if (!response.ok) throw new Error("Failed to fetch projects");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      image: "",
      categoryId: "",
    },
  });

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Watch title changes to auto-generate slug
  const watchTitle = form.watch("title");
  useEffect(() => {
    if (watchTitle && !selectedProject) {
      form.setValue("slug", generateSlug(watchTitle));
    }
  }, [watchTitle, form, selectedProject]);

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterCategory === "all" || project.categoryId === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const openEditDialog = (project?: Project) => {
    if (project) {
      setSelectedProject(project);
      const imageValue = project.image || "";
      form.reset({
        title: project.title,
        slug: project.slug,
        description: project.description,
        image: imageValue,
        categoryId: project.categoryId,
      });
      setSelectedTechnologies(project.technologies || []);
      setProjectImage(imageValue);
      console.log("Editing project, image value:", imageValue);
    } else {
      setSelectedProject(null);
      form.reset({
        title: "",
        slug: "",
        description: "",
        image: "",
        categoryId: "",
      });
      setSelectedTechnologies([]);
      setProjectImage("");
      console.log("Creating new project");
    }
    setIsEditDialogOpen(true);
  };

  const handleSaveProject = async (data: ProjectFormData) => {
    try {
      const projectData = {
        title: data.title,
        slug: data.slug,
        description: data.description,
        image: projectImage || null,
        technologies: selectedTechnologies,
        categoryId: data.categoryId,
        sortOrder: selectedProject?.sortOrder || 0,
        isActive: selectedProject?.isActive ?? true,
      };

      // Debug logging
      console.log("Saving project with data:", projectData);
      console.log("Project image state:", projectImage);

      if (selectedProject) {
        // Update existing project
        const response = await fetch("/api/admin/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: selectedProject.id, ...projectData }),
        });

        if (!response.ok) throw new Error("Failed to update project");

        const updated = await response.json();
        setProjects((prev) =>
          prev.map((p) => (p.id === selectedProject.id ? updated : p))
        );
        toast.success("Project updated successfully!");
      } else {
        // Create new project
        const response = await fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectData),
        });

        if (!response.ok) throw new Error("Failed to create project");

        const created = await response.json();
        setProjects((prev) => [...prev, created]);
        toast.success("Project created successfully!");
      }

      setIsEditDialogOpen(false);
      form.reset();
      setSelectedTechnologies([]);
      setProjectImage("");
      setSelectedProject(null);
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project. Please try again.");
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/admin/projects?id=${projectId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete project");

      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      setIsDeleteDialogOpen(false);
      setSelectedProject(null);
      toast.success("Project deleted successfully!");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project. Please try again.");
    }
  };

  const toggleTechnology = (tech: string) => {
    setSelectedTechnologies((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Portfolio Management</h1>
          <p className="text-muted-foreground">
            Manage your project portfolio and case studies
          </p>
        </div>
        <Button onClick={() => openEditDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
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
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select
                  value={filterCategory}
                  onValueChange={setFilterCategory}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Projects List */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => {
              const category = categories.find(
                (c) => c.id === project.categoryId
              );

              return (
                <Card
                  key={project.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-lg line-clamp-2">
                          {project.title}
                        </CardTitle>
                        <div className="text-xs text-muted-foreground">
                          {category?.name || "Uncategorized"}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {project.description}
                    </p>

                    {project.technologies &&
                      project.technologies.length > 0 && (
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
                      )}

                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(project)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedProject(project);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredProjects.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  No projects found matching your criteria.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Edit/Create Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedProject ? "Edit Project" : "Create New Project"}
                </DialogTitle>
                <DialogDescription>
                  {selectedProject
                    ? "Update project information"
                    : "Create a new portfolio project showcase"}
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={form.handleSubmit(handleSaveProject)}
                className="space-y-6"
              >
                {/* Basic Information */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Title *
                    </label>
                    <Input
                      id="title"
                      {...form.register("title")}
                      placeholder="Project title"
                    />
                    {form.formState.errors.title && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="slug" className="text-sm font-medium">
                      Slug *
                    </label>
                    <Input
                      id="slug"
                      {...form.register("slug")}
                      placeholder="project-url-slug"
                    />
                    {form.formState.errors.slug && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.slug.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description *
                  </label>
                  <Textarea
                    id="description"
                    {...form.register("description")}
                    placeholder="Brief project description that will be displayed on the card"
                    rows={4}
                  />
                  {form.formState.errors.description && (
                    <p className="text-sm text-red-600">
                      {form.formState.errors.description.message}
                    </p>
                  )}
                </div>

                {/* Project Image */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Image</label>
                  <ImageUploader
                    value={projectImage}
                    onChange={(value) => {
                      const imageUrl =
                        typeof value === "string" ? value : value[0] || "";
                      console.log(
                        "ImageUploader onChange called with:",
                        imageUrl
                      );
                      setProjectImage(imageUrl);
                      // Also update the form state
                      form.setValue("image", imageUrl);
                    }}
                    placeholder="Upload project image or screenshot"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label htmlFor="categoryId" className="text-sm font-medium">
                    Category *
                  </label>
                  <Select
                    value={form.watch("categoryId")}
                    onValueChange={(value: string) =>
                      form.setValue("categoryId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.categoryId && (
                    <p className="text-sm text-red-600">
                      {form.formState.errors.categoryId.message}
                    </p>
                  )}
                </div>

                {/* Technologies */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Technologies Used
                  </label>
                  <div className="flex flex-wrap gap-2 p-3 border border-border rounded-lg">
                    {techOptions.map((tech) => (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => toggleTechnology(tech)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          selectedTechnologies.includes(tech)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    {selectedProject ? "Update Project" : "Create Project"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{selectedProject?.title}
              &rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                selectedProject && handleDeleteProject(selectedProject.id)
              }
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
