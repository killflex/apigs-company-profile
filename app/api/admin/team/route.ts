import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allTeamMembers = await db
      .select()
      .from(teamMembers)
      .orderBy(desc(teamMembers.sortOrder), desc(teamMembers.createdAt));

    return NextResponse.json(allTeamMembers);
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      firstName,
      lastName,
      displayName,
      jobTitle,
      department,
      avatarPublicId,
      avatarUrl,
      avatarSecureUrl,
      avatarFormat,
      avatarWidth,
      avatarHeight,
      avatarVersion,
      linkedinUrl,
      instagramUrl,
      githubUrl,
      twitterUrl,
      websiteUrl,
      email,
      phone,
      startDate,
      isActive,
      isPublic,
      sortOrder,
    } = body;

    if (!firstName || !lastName || !displayName || !jobTitle) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newTeamMember = await db
      .insert(teamMembers)
      .values({
        firstName,
        lastName,
        displayName,
        jobTitle,
        department: department || null,
        avatarPublicId: avatarPublicId || null,
        avatarUrl: avatarUrl || null,
        avatarSecureUrl: avatarSecureUrl || null,
        avatarFormat: avatarFormat || null,
        avatarWidth: avatarWidth || null,
        avatarHeight: avatarHeight || null,
        avatarVersion: avatarVersion || null,
        linkedinUrl: linkedinUrl || null,
        instagramUrl: instagramUrl || null,
        githubUrl: githubUrl || null,
        twitterUrl: twitterUrl || null,
        websiteUrl: websiteUrl || null,
        email: email || null,
        phone: phone || null,
        startDate: startDate ? new Date(startDate) : null,
        isActive: isActive !== undefined ? isActive : true,
        isPublic: isPublic !== undefined ? isPublic : true,
        sortOrder: sortOrder || 0,
      })
      .returning();

    return NextResponse.json(newTeamMember[0], { status: 201 });
  } catch (error) {
    console.error("Error creating team member:", error);
    return NextResponse.json(
      { error: "Failed to create team member" },
      { status: 500 }
    );
  }
}
