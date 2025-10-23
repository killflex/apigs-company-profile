import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

// GET /api/admin/categories
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // 'portfolio', 'service'
    const isPublic = searchParams.get("public") === "true";

    if (!isPublic) {
      // Admin route - require authentication
      const user = await currentUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    let categoriesList;
    if (type) {
      categoriesList = await db
        .select()
        .from(categories)
        .where(eq(categories.type, type))
        .orderBy(asc(categories.sortOrder), asc(categories.name));
    } else {
      categoriesList = await db
        .select()
        .from(categories)
        .orderBy(
          asc(categories.type),
          asc(categories.sortOrder),
          asc(categories.name)
        );
    }

    return NextResponse.json(categoriesList);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/admin/categories
export async function POST(request: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const newCategory = await db
      .insert(categories)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(newCategory[0], { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
