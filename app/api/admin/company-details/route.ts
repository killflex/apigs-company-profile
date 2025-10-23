import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { companyDetails } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// GET - Fetch company details (there should only be one active record)
export async function GET() {
  try {
    const details = await db
      .select()
      .from(companyDetails)
      .where(eq(companyDetails.isActive, true))
      .limit(1);

    if (details.length === 0) {
      // Return default values if no record exists
      return NextResponse.json({
        teamMembersCount: 0,
        yearsExperience: 0,
        projectsCompleted: 0,
        companyName: "APIGS Indonesia",
        tagline: "",
        aboutUs: "",
        vision: "",
        mission: "",
        officeAddress: "",
        officeAddressUrl: "",
        officePhone: "",
        contactEmail: "",
        supportEmail: "",
        operationalHours: "",
        timezone: "Asia/Jakarta",
        websiteUrl: "",
        linkedinUrl: "",
        instagramUrl: "",
        facebookUrl: "",
        twitterUrl: "",
        youtubeUrl: "",
        foundedYear: null,
        certifications: [],
      });
    }

    return NextResponse.json(details[0]);
  } catch (error) {
    console.error("Error fetching company details:", error);
    return NextResponse.json(
      { error: "Failed to fetch company details" },
      { status: 500 }
    );
  }
}

// POST/PUT - Create or update company details
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    console.log("Received data:", data);

    // Prepare the data - ensure proper types
    const preparedData = {
      teamMembersCount: Number(data.teamMembersCount) || 0,
      yearsExperience: Number(data.yearsExperience) || 0,
      projectsCompleted: Number(data.projectsCompleted) || 0,
      companyName: String(data.companyName || "APIGS Indonesia"),
      tagline: data.tagline || null,
      aboutUs: data.aboutUs || null,
      vision: data.vision || null,
      mission: data.mission || null,
      officeAddress: data.officeAddress || null,
      officeAddressUrl: data.officeAddressUrl || null,
      officePhone: data.officePhone || null,
      contactEmail: data.contactEmail || null,
      supportEmail: data.supportEmail || null,
      operationalHours: data.operationalHours || null,
      timezone: data.timezone || "Asia/Jakarta",
      websiteUrl: data.websiteUrl || null,
      linkedinUrl: data.linkedinUrl || null,
      instagramUrl: data.instagramUrl || null,
      facebookUrl: data.facebookUrl || null,
      twitterUrl: data.twitterUrl || null,
      youtubeUrl: data.youtubeUrl || null,
      foundedYear: data.foundedYear ? Number(data.foundedYear) : null,
      certifications: Array.isArray(data.certifications)
        ? data.certifications
        : [],
    };

    // Check if a record already exists
    const existing = await db
      .select()
      .from(companyDetails)
      .where(eq(companyDetails.isActive, true))
      .limit(1);

    if (existing.length > 0) {
      // Update existing record
      console.log("Updating existing record:", existing[0].id);

      const updated = await db
        .update(companyDetails)
        .set({
          ...preparedData,
          updatedAt: new Date(),
        })
        .where(eq(companyDetails.id, existing[0].id))
        .returning();

      console.log("Update successful:", updated[0]);
      return NextResponse.json(updated[0]);
    } else {
      // Create new record
      console.log("Creating new record");

      const created = await db
        .insert(companyDetails)
        .values({
          ...preparedData,
          isActive: true,
        })
        .returning();

      console.log("Create successful:", created[0]);
      return NextResponse.json(created[0]);
    }
  } catch (error) {
    console.error("Error saving company details:", error);

    // Better error message
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        error: "Failed to save company details",
        details: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
