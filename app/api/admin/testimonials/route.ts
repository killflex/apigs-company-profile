import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

// GET /api/admin/testimonials - Get all testimonials
export async function GET() {
  try {
    const allTestimonials = await db
      .select()
      .from(testimonials)
      .orderBy(desc(testimonials.createdAt));

    return NextResponse.json(allTestimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

// POST /api/admin/testimonials - Create new testimonial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, position, company, text } = body;

    if (!firstName || !lastName || !text) {
      return NextResponse.json(
        { error: "First name, last name, and text are required" },
        { status: 400 }
      );
    }

    const newTestimonial = await db
      .insert(testimonials)
      .values({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        position: position?.trim() || null,
        company: company?.trim() || null,
        text: text.trim(),
      })
      .returning();

    return NextResponse.json(newTestimonial[0], { status: 201 });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
