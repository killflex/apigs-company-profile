/**
 * Centralized data fetching utilities for optimal performance
 * All queries use direct database access and are cached by Next.js
 */

import { db } from "@/lib/db";
import {
  companyDetails,
  teamMembers,
  testimonials,
  projects,
} from "@/lib/db/schema";
import { eq, asc, desc, and } from "drizzle-orm";
import { cache } from "react";

// ============================================================================
// COMPANY DETAILS QUERIES
// ============================================================================

/**
 * Get active company details with React cache
 * Used in: HeroSection, Stats, Footer, About
 */
export const getCompanyDetails = cache(async () => {
  try {
    const details = await db
      .select()
      .from(companyDetails)
      .where(eq(companyDetails.isActive, true))
      .limit(1);

    if (details.length === 0) {
      return {
        id: 0,
        teamMembersCount: 0,
        yearsExperience: 0,
        projectsCompleted: 0,
        companyName: "APIGS Indonesia",
        tagline: "",
        aboutUs: "",
        vision: "",
        mission: "",
        officeAddress: "",
        officeAddressUrl: null,
        officePhone: "",
        contactEmail: "",
        supportEmail: null,
        operationalHours: "",
        timezone: null,
        websiteUrl: "",
        linkedinUrl: null,
        instagramUrl: null,
        facebookUrl: null,
        twitterUrl: null,
        youtubeUrl: null,
        foundedYear: new Date().getFullYear(),
        certifications: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    return details[0];
  } catch (error) {
    console.error("Error fetching company details:", error);
    throw error;
  }
});

/**
 * Get only company statistics (optimized query)
 * Used in: Stats component
 */
export const getCompanyStats = cache(async () => {
  try {
    const stats = await db
      .select({
        teamMembersCount: companyDetails.teamMembersCount,
        yearsExperience: companyDetails.yearsExperience,
        projectsCompleted: companyDetails.projectsCompleted,
      })
      .from(companyDetails)
      .where(eq(companyDetails.isActive, true))
      .limit(1);

    if (stats.length === 0) {
      return {
        teamMembersCount: 0,
        yearsExperience: 0,
        projectsCompleted: 0,
      };
    }

    return stats[0];
  } catch (error) {
    console.error("Error fetching company stats:", error);
    return {
      teamMembersCount: 0,
      yearsExperience: 0,
      projectsCompleted: 0,
    };
  }
});

// ============================================================================
// TEAM QUERIES
// ============================================================================

/**
 * Get all active and public team members
 * Used in: Team component
 */
export const getTeamMembers = cache(async () => {
  try {
    const members = await db
      .select()
      .from(teamMembers)
      .where(
        and(eq(teamMembers.isPublic, true), eq(teamMembers.isActive, true))
      )
      .orderBy(asc(teamMembers.sortOrder));

    return members;
  } catch (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
});

/**
 * Get team member count (for stats)
 */
export const getTeamMemberCount = cache(async () => {
  try {
    const members = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.isActive, true));

    return members.length;
  } catch (error) {
    console.error("Error counting team members:", error);
    return 0;
  }
});

// ============================================================================
// TESTIMONIALS QUERIES
// ============================================================================

/**
 * Get all testimonials (no filtering - testimonials table has no isApproved field)
 * Used in: Testimonials component
 */
export const getTestimonials = cache(async () => {
  try {
    const data = await db
      .select()
      .from(testimonials)
      .orderBy(desc(testimonials.createdAt));

    return data;
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
});

/**
 * Get limited testimonials for homepage
 */
export const getFeaturedTestimonials = cache(async (limit: number = 6) => {
  try {
    const data = await db
      .select()
      .from(testimonials)
      .orderBy(desc(testimonials.createdAt))
      .limit(limit);

    return data;
  } catch (error) {
    console.error("Error fetching featured testimonials:", error);
    return [];
  }
});

// ============================================================================
// PORTFOLIO/PROJECTS QUERIES
// ============================================================================

/**
 * Get all published projects
 * Used in: Portfolio component
 */
export const getProjects = cache(async () => {
  try {
    const items = await db
      .select()
      .from(projects)
      .where(eq(projects.isActive, true))
      .orderBy(asc(projects.sortOrder), desc(projects.createdAt));

    return items;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
});

/**
 * Get featured projects for homepage
 */
export const getFeaturedProjects = cache(async (limit: number = 6) => {
  try {
    const items = await db
      .select()
      .from(projects)
      .where(eq(projects.isActive, true))
      .orderBy(asc(projects.sortOrder), desc(projects.createdAt))
      .limit(limit);

    return items;
  } catch (error) {
    console.error("Error fetching featured projects:", error);
    return [];
  }
});

// ============================================================================
// PARALLEL DATA FETCHING FOR PAGES
// ============================================================================

/**
 * Fetch all homepage data in parallel for optimal performance
 * This reduces total loading time by running queries concurrently
 */
export async function getHomepageData() {
  try {
    const [company, team, testimonialsList, projectsList] = await Promise.all([
      getCompanyDetails(),
      getTeamMembers(),
      getFeaturedTestimonials(6),
      getFeaturedProjects(6),
    ]);

    return {
      company,
      team,
      testimonials: testimonialsList,
      projects: projectsList,
    };
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    throw error;
  }
}

/**
 * Fetch all about page data in parallel
 */
export async function getAboutPageData() {
  try {
    const [company, team] = await Promise.all([
      getCompanyDetails(),
      getTeamMembers(),
    ]);

    return {
      company,
      team,
    };
  } catch (error) {
    console.error("Error fetching about page data:", error);
    throw error;
  }
}
