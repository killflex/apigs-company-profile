import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { companyDetails } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// GET - Public endpoint to fetch company details
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
        officePhone: "",
        contactEmail: "",
        operationalHours: "",
        websiteUrl: "",
        linkedinUrl: "",
        instagramUrl: "",
        facebookUrl: "",
        twitterUrl: "",
        youtubeUrl: "",
        foundedYear: null,
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

// Enable caching for better performance
export const revalidate = 3600; // Revalidate every hour
