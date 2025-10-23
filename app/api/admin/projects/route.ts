import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq, desc, and, ilike, or } from "drizzle-orm";

// GET /api/admin/projects
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isPublic = searchParams.get("public") === "true";

    if (!isPublic) {
      // Admin route - require authentication
      const user = await currentUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const search = searchParams.get("search");
    const categoryId = searchParams.get("categoryId");

    // Build conditions
    const conditions = [];

    if (isPublic) {
      // Public view - only active projects
      conditions.push(eq(projects.isActive, true));
    }

    if (search) {
      conditions.push(
        or(
          ilike(projects.title, `%${search}%`),
          ilike(projects.description, `%${search}%`)
        )
      );
    }

    if (categoryId && categoryId !== "all") {
      conditions.push(eq(projects.categoryId, categoryId));
    }

    // Execute query with conditions
    let projectsList;
    if (conditions.length > 0) {
      projectsList = await db
        .select()
        .from(projects)
        .where(and(...conditions))
        .orderBy(projects.sortOrder, desc(projects.createdAt));
    } else {
      projectsList = await db
        .select()
        .from(projects)
        .orderBy(projects.sortOrder, desc(projects.createdAt));
    }

    return NextResponse.json(projectsList);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/admin/projects
export async function POST(request: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const newProject = await db
      .insert(projects)
      .values({
        title: data.title,
        slug: data.slug,
        description: data.description,
        image: data.image || null,
        technologies: data.technologies || [],
        categoryId: data.categoryId,
        sortOrder: data.sortOrder || 0,
        isActive: data.isActive ?? true,
      })
      .returning();

    return NextResponse.json(newProject[0], { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/projects
export async function PUT(request: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const updated = await db
      .update(projects)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/projects
export async function DELETE(request: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const deleted = await db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, deleted: deleted[0] });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
