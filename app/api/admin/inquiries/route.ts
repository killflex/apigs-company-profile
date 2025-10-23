import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inquiries } from "@/lib/db/schema";
import { eq, and, like, or, desc, asc } from "drizzle-orm";

// GET /api/admin/inquiries
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get query parameters
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const priority = searchParams.get("priority") || "all";
    const inquiryType = searchParams.get("type") || "all";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build where conditions
    const conditions = [];

    // Search filter
    if (search) {
      conditions.push(
        or(
          like(inquiries.name, `%${search}%`),
          like(inquiries.email, `%${search}%`),
          like(inquiries.company, `%${search}%`),
          like(inquiries.subject, `%${search}%`)
        )
      );
    }

    // Status filter
    if (status !== "all") {
      conditions.push(eq(inquiries.status, status));
    }

    // Priority filter
    if (priority !== "all") {
      conditions.push(eq(inquiries.priority, priority));
    }

    // Inquiry type filter
    if (inquiryType !== "all") {
      conditions.push(eq(inquiries.inquiryType, inquiryType));
    }

    // Fetch inquiries from database
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Determine sort column
    let orderByClause;
    if (sortBy === "createdAt") {
      orderByClause =
        sortOrder === "desc"
          ? desc(inquiries.createdAt)
          : asc(inquiries.createdAt);
    } else if (sortBy === "priority") {
      orderByClause =
        sortOrder === "desc"
          ? desc(inquiries.priority)
          : asc(inquiries.priority);
    } else if (sortBy === "status") {
      orderByClause =
        sortOrder === "desc" ? desc(inquiries.status) : asc(inquiries.status);
    } else {
      orderByClause = desc(inquiries.createdAt); // default
    }

    const allInquiries = await db
      .select()
      .from(inquiries)
      .where(whereClause)
      .orderBy(orderByClause);

    console.log(`✅ Fetched ${allInquiries.length} inquiries`);

    return NextResponse.json({
      success: true,
      inquiries: allInquiries,
      count: allInquiries.length,
    });
  } catch (error) {
    console.error("❌ Error fetching inquiries:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch inquiries",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/inquiries?id=xxx
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Inquiry ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, priority, notes, followUpDate } = body;

    // Update inquiry
    const updateData: {
      updatedAt: Date;
      status?: string;
      priority?: string;
      notes?: string | null;
      followUpDate?: Date | null;
    } = {
      updatedAt: new Date(),
    };

    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (notes !== undefined) updateData.notes = notes;
    if (followUpDate !== undefined)
      updateData.followUpDate = followUpDate ? new Date(followUpDate) : null;

    const [updatedInquiry] = await db
      .update(inquiries)
      .set(updateData)
      .where(eq(inquiries.id, id))
      .returning();

    if (!updatedInquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    console.log(`✅ Updated inquiry: ${id}`);

    return NextResponse.json({
      success: true,
      inquiry: updatedInquiry,
    });
  } catch (error) {
    console.error("❌ Error updating inquiry:", error);
    return NextResponse.json(
      {
        error: "Failed to update inquiry",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/inquiries?id=xxx
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Inquiry ID is required" },
        { status: 400 }
      );
    }

    await db.delete(inquiries).where(eq(inquiries.id, id));

    console.log(`✅ Deleted inquiry: ${id}`);

    return NextResponse.json({
      success: true,
      message: "Inquiry deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting inquiry:", error);
    return NextResponse.json(
      {
        error: "Failed to delete inquiry",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
