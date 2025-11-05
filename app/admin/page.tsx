import { Suspense } from "react";
import { db } from "@/lib/db";
import {
  projects,
  inquiries,
  testimonials,
  teamMembers,
  blogPosts,
} from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FolderOpen,
  MessageSquare,
  Users,
  Quote,
  FileText,
} from "lucide-react";

async function getDashboardStats() {
  const [
    projectCount,
    pendingInquiryCount,
    testimonialsCount,
    teamCount,
    publishedBlogCount,
    draftBlogCount,
  ] = await Promise.all([
    db
      .select({ count: count() })
      .from(projects)
      .where(eq(projects.isActive, true)),
    db
      .select({ count: count() })
      .from(inquiries)
      .where(eq(inquiries.status, "new")),
    db.select({ count: count() }).from(testimonials),
    db
      .select({ count: count() })
      .from(teamMembers)
      .where(eq(teamMembers.isActive, true)),
    db
      .select({ count: count() })
      .from(blogPosts)
      .where(eq(blogPosts.status, "published")),
    db
      .select({ count: count() })
      .from(blogPosts)
      .where(eq(blogPosts.status, "draft")),
  ]);

  return {
    projects: projectCount[0].count,
    pendingInquiries: pendingInquiryCount[0].count,
    testimonials: testimonialsCount[0].count,
    activeTeamMembers: teamCount[0].count,
    publishedBlogs: publishedBlogCount[0].count,
    draftBlogs: draftBlogCount[0].count,
  };
}

function StatsCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              <div className="h-4 w-4 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-12 bg-muted rounded animate-pulse mb-2" />
              <div className="h-3 w-32 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

async function DashboardContent() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatsCard
          title="Active Projects"
          value={stats.projects}
          icon={FolderOpen}
          description="Active portfolio projects"
        />
        <StatsCard
          title="New Inquiries"
          value={stats.pendingInquiries}
          icon={MessageSquare}
          description="Pending responses"
        />
        <StatsCard
          title="Published Blogs"
          value={stats.publishedBlogs}
          icon={FileText}
          description="Published blog posts"
        />
        <StatsCard
          title="Draft Blogs"
          value={stats.draftBlogs}
          icon={FileText}
          description="Draft blog posts"
        />
        <StatsCard
          title="Testimonials"
          value={stats.testimonials}
          icon={Quote}
          description="Client testimonials"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatsCard
          title="Team Members"
          value={stats.activeTeamMembers}
          icon={Users}
          description="Active team members"
        />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
