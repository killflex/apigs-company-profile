# Data Fetching Best Practices

This document outlines the optimized data fetching strategy implemented in this Next.js project for maximum performance.

## Overview

We use **direct database queries** with **React Server Components** and **React's cache()** function for optimal performance and automatic request deduplication.

## Architecture

### ✅ What We Use (Best Practice)

```
Component → Centralized Query Function (lib/data/queries.ts) → Database
```

**Benefits:**

- ⚡ **Fastest possible** - No HTTP overhead
- 🔄 **Automatic deduplication** - React's `cache()` prevents duplicate queries
- 🎯 **Type-safe** - Full TypeScript support
- 📦 **Smaller bundle** - No API routes needed
- 🚀 **Better DX** - Centralized, reusable, testable

### ❌ What We Don't Use

```
Component → API Route → Database (SLOWER - adds HTTP round trip)
```

## Core Principles

### 1. **Direct Database Access in Server Components**

```typescript
// ✅ CORRECT - Direct database query
import { getCompanyDetails } from "@/lib/data/queries";

export default async function HeroSection() {
  const details = await getCompanyDetails();
  return <div>{details.companyName}</div>;
}
```

```typescript
// ❌ AVOID - Unnecessary API route
export default async function HeroSection() {
  const response = await fetch("/api/company-details");
  const details = await response.json();
  return <div>{details.companyName}</div>;
}
```

### 2. **Use React's cache() for Automatic Deduplication**

All query functions in `lib/data/queries.ts` use React's `cache()`:

```typescript
import { cache } from "react";

export const getCompanyDetails = cache(async () => {
  const details = await db
    .select()
    .from(companyDetails)
    .where(eq(companyDetails.isActive, true))
    .limit(1);

  return details[0];
});
```

**How it works:**

- If multiple components call `getCompanyDetails()` during the same render
- React automatically deduplicates the query
- Database is queried **only once**, result is cached for that request

### 3. **Parallel Data Fetching with Promise.all**

For pages that need multiple data sources, fetch in parallel:

```typescript
// ✅ CORRECT - Parallel fetching (fast)
export async function getHomepageData() {
  const [company, team, testimonials] = await Promise.all([
    getCompanyDetails(),
    getTeamMembers(),
    getTestimonials(),
  ]);

  return { company, team, testimonials };
}

// ❌ AVOID - Sequential fetching (slow)
export async function getHomepageData() {
  const company = await getCompanyDetails(); // Waits
  const team = await getTeamMembers(); // Waits
  const testimonials = await getTestimonials(); // Waits

  return { company, team, testimonials };
}
```

**Performance Impact:**

- Sequential: 300ms + 200ms + 150ms = **650ms total**
- Parallel: max(300ms, 200ms, 150ms) = **300ms total**

### 4. **Selective Field Fetching**

Only query the fields you need:

```typescript
// ✅ CORRECT - Fetch only needed fields
export const getCompanyStats = cache(async () => {
  const stats = await db
    .select({
      teamMembersCount: companyDetails.teamMembersCount,
      yearsExperience: companyDetails.yearsExperience,
      projectsCompleted: companyDetails.projectsCompleted,
    })
    .from(companyDetails)
    .where(eq(companyDetails.isActive, true))
    .limit(1);

  return stats[0];
});

// ❌ AVOID - Fetching all 29 fields when only need 3
export const getCompanyStats = cache(async () => {
  const details = await db
    .select()
    .from(companyDetails)
    .where(eq(companyDetails.isActive, true))
    .limit(1);

  return details[0];
});
```

## File Structure

```
lib/
  data/
    queries.ts          # 🎯 All data fetching functions
  db/
    index.ts            # Database connection
    schema.ts           # Database schema
components/
  hero-section.tsx      # Uses: getCompanyDetails()
  team.tsx              # Uses: getTeamMembers()
  testimonials.tsx      # Uses: getTestimonials()
  stats.tsx             # Uses: getCompanyStats()
```

## Available Query Functions

### Company Details

```typescript
// Get full company details
const details = await getCompanyDetails();

// Get only statistics (optimized)
const stats = await getCompanyStats();
```

### Team Members

```typescript
// Get all active & public team members
const team = await getTeamMembers();

// Get team member count
const count = await getTeamMemberCount();
```

### Testimonials

```typescript
// Get all testimonials
const all = await getTestimonials();

// Get limited testimonials (homepage)
const featured = await getFeaturedTestimonials(6);
```

### Projects

```typescript
// Get all published projects
const projects = await getProjects();

// Get featured projects (homepage)
const featured = await getFeaturedProjects(6);
```

### Parallel Fetching Helpers

```typescript
// Homepage data (4 parallel queries)
const data = await getHomepageData();
// Returns: { company, team, testimonials, projects }

// About page data (2 parallel queries)
const data = await getAboutPageData();
// Returns: { company, team }
```

## Caching Strategy

### React Server Components (Default)

Next.js automatically caches server component renders:

```typescript
// This component's output is cached
export default async function HeroSection() {
  const details = await getCompanyDetails();
  return <div>{details.companyName}</div>;
}
```

**Cache duration:**

- **Development:** No cache (always fresh)
- **Production:** Cached until revalidation

### Manual Revalidation

Trigger revalidation when data changes:

```typescript
// In your admin mutation (after updating company details)
import { revalidatePath } from "next/cache";

export async function updateCompanyDetails(data) {
  await db.update(companyDetails).set(data);

  // Revalidate all pages using company details
  revalidatePath("/", "layout");
}
```

### Time-based Revalidation

For API routes (if you must use them):

```typescript
// app/api/company-details/route.ts
export const revalidate = 3600; // Revalidate every hour
```

## When to Use API Routes

**Use API routes ONLY for:**

1. **Client-side mutations** (POST/PUT/DELETE from browser)

   ```typescript
   // ✅ Correct use case
   async function handleSubmit() {
     await fetch("/api/contact", {
       method: "POST",
       body: JSON.stringify(formData),
     });
   }
   ```

2. **Webhooks** (external services calling your app)

   ```typescript
   // ✅ Correct use case
   // app/api/webhooks/stripe/route.ts
   export async function POST(request: Request) {
     // Handle Stripe webhook
   }
   ```

3. **External data sources** (third-party APIs with secrets)
   ```typescript
   // ✅ Correct use case - hide API keys
   export async function GET() {
     const data = await fetch("https://api.example.com", {
       headers: { "API-Key": process.env.SECRET_KEY },
     });
     return Response.json(data);
   }
   ```

**Don't use API routes for:**

- ❌ Fetching your own database data
- ❌ Server-side rendering
- ❌ Static site generation

## Performance Checklist

When adding a new data fetching function:

- [ ] Use `cache()` from `react` for automatic deduplication
- [ ] Place in `lib/data/queries.ts` for reusability
- [ ] Use selective field fetching if possible
- [ ] Add to parallel fetching helpers if used on same page
- [ ] Add proper error handling with fallback values
- [ ] Document usage in this file

## Example: Adding a New Query

```typescript
// lib/data/queries.ts

/**
 * Get active blog posts
 * Used in: BlogList component
 */
export const getBlogPosts = cache(async (limit?: number) => {
  try {
    let query = db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.status, "published"))
      .orderBy(desc(blogPosts.publishedAt));

    if (limit) {
      query = query.limit(limit);
    }

    return await query;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
});
```

Then use in component:

```typescript
// components/blog-list.tsx
import { getBlogPosts } from "@/lib/data/queries";

export default async function BlogList() {
  const posts = await getBlogPosts(10);

  return (
    <div>
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

## Monitoring Performance

Use Next.js built-in performance monitoring:

```bash
# Development - see query times in console
npm run dev

# Production build - check bundle size
npm run build
```

Look for:

- ⚡ Fast server component rendering
- 📦 Small JavaScript bundle size
- 🔄 Efficient cache usage

## Common Patterns

### Pattern 1: Simple Component

```typescript
import { getCompanyDetails } from "@/lib/data/queries";

export default async function Header() {
  const { companyName, contactEmail } = await getCompanyDetails();
  return <header>{companyName}</header>;
}
```

### Pattern 2: Parallel Fetching in Page

```typescript
export default async function AboutPage() {
  const [company, team, stats] = await Promise.all([
    getCompanyDetails(),
    getTeamMembers(),
    getCompanyStats(),
  ]);

  return (
    <>
      <AboutHero company={company} />
      <TeamSection team={team} />
      <StatsSection stats={stats} />
    </>
  );
}
```

### Pattern 3: Conditional Rendering

```typescript
export default async function Testimonials() {
  const testimonials = await getTestimonials();

  if (testimonials.length === 0) {
    return <EmptyState />;
  }

  return <TestimonialGrid items={testimonials} />;
}
```

## Troubleshooting

### Issue: Duplicate queries

**Symptom:** Same query runs multiple times
**Solution:** Ensure you're using `cache()` in `lib/data/queries.ts`

### Issue: Slow page loads

**Symptom:** Page takes long to render
**Solution:**

1. Check if queries are running in parallel (`Promise.all`)
2. Use selective field fetching
3. Add database indexes

### Issue: Stale data

**Symptom:** Data not updating after mutation
**Solution:** Call `revalidatePath()` after mutations

```typescript
import { revalidatePath } from "next/cache";

// After updating data
revalidatePath("/"); // Revalidate homepage
revalidatePath("/about"); // Revalidate about page
```

## Resources

- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [React cache()](https://react.dev/reference/react/cache)
- [Drizzle ORM Queries](https://orm.drizzle.team/docs/select)

---

**Last Updated:** October 21, 2025
**Maintained By:** Development Team
