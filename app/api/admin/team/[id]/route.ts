import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const teamMember = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.id, id))
      .limit(1);

    if (teamMember.length === 0) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(teamMember[0]);
  } catch (error) {
    console.error("Error fetching team member:", error);
    return NextResponse.json(
      { error: "Failed to fetch team member" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
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

    const updatedTeamMember = await db
      .update(teamMembers)
      .set({
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
        updatedAt: new Date(),
      })
      .where(eq(teamMembers.id, id))
      .returning();

    if (updatedTeamMember.length === 0) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedTeamMember[0]);
  } catch (error) {
    console.error("Error updating team member:", error);
    return NextResponse.json(
      { error: "Failed to update team member" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const deletedTeamMember = await db
      .delete(teamMembers)
      .where(eq(teamMembers.id, id))
      .returning();

    if (deletedTeamMember.length === 0) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Team member deleted successfully" });
  } catch (error) {
    console.error("Error deleting team member:", error);
    return NextResponse.json(
      { error: "Failed to delete team member" },
      { status: 500 }
    );
  }
}
