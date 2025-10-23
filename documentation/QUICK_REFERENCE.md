# Quick Reference: Data Fetching Patterns

## Import and Use

```typescript
import {
  getCompanyDetails,
  getCompanyStats,
  getTeamMembers,
  getTestimonials,
  getProjects,
  getHomepageData,
} from "@/lib/data/queries";
```

## Common Patterns

### 1. Simple Component (Single Query)

```typescript
// components/header.tsx
import { getCompanyDetails } from "@/lib/data/queries";

export default async function Header() {
  const { companyName, contactEmail } = await getCompanyDetails();

  return (
    <header>
      <h1>{companyName}</h1>
      <a href={`mailto:${contactEmail}`}>Contact</a>
    </header>
  );
}
```

### 2. Component with Conditional Rendering

```typescript
// components/team.tsx
import { getTeamMembers } from "@/lib/data/queries";

export default async function Team() {
  const team = await getTeamMembers();

  if (team.length === 0) {
    return <EmptyState message="No team members yet" />;
  }

  return (
    <div className="grid grid-cols-3">
      {team.map((member) => (
        <TeamCard key={member.id} member={member} />
      ))}
    </div>
  );
}
```

### 3. Page with Multiple Queries (Parallel)

```typescript
// app/about/page.tsx
import {
  getCompanyDetails,
  getTeamMembers,
  getCompanyStats,
} from "@/lib/data/queries";

export default async function AboutPage() {
  // ✅ Parallel fetching - all queries run at once
  const [company, team, stats] = await Promise.all([
    getCompanyDetails(),
    getTeamMembers(),
    getCompanyStats(),
  ]);

  return (
    <>
      <Hero company={company} />
      <TeamSection team={team} />
      <StatsSection stats={stats} />
    </>
  );
}
```

### 4. Using Pre-built Page Helpers

```typescript
// app/page.tsx
import { getHomepageData } from "@/lib/data/queries";

export default async function HomePage() {
  // Fetches: company, team, testimonials, projects (all parallel)
  const { company, team, testimonials, projects } = await getHomepageData();

  return (
    <>
      <Hero company={company} />
      <Team members={team} />
      <Testimonials items={testimonials} />
      <Portfolio projects={projects} />
    </>
  );
}
```

### 5. Component with Props (Avoid Prop Drilling)

```typescript
// ❌ BAD - Prop drilling from page to deep component
export default async function Page() {
  const data = await getData();
  return (
    <Layout>
      <Deep data={data} />
    </Layout>
  );
}

// ✅ GOOD - Each component fetches its own data
export default async function Page() {
  return (
    <Layout>
      <DeepComponent /> {/* Fetches own data */}
    </Layout>
  );
}

async function DeepComponent() {
  const data = await getData(); // Cached, no duplicate query!
  return <div>{data.title}</div>;
}
```

## Mutation Patterns

### Admin Form Submission

```typescript
// app/admin/company/actions.ts
"use server";

import { db } from "@/lib/db";
import { companyDetails } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

export async function updateCompanyDetails(formData: FormData) {
  try {
    await db
      .update(companyDetails)
      .set({
        companyName: formData.get("name") as string,
        tagline: formData.get("tagline") as string,
        updatedAt: new Date(),
      })
      .where(eq(companyDetails.id, 1));

    // Revalidate all pages that use this data
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### Client Component with Server Action

```typescript
"use client";

import { updateCompanyDetails } from "./actions";
import { useState } from "react";

export function CompanyForm({ initialData }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateCompanyDetails(formData);

    if (result.success) {
      alert("Updated successfully!");
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" defaultValue={initialData.companyName} />
      <input name="tagline" defaultValue={initialData.tagline} />
      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
```

## Adding New Queries

### Step 1: Define in lib/data/queries.ts

```typescript
import { cache } from "react";
import { db } from "@/lib/db";
import { yourTable } from "@/lib/db/schema";

/**
 * Get your data
 * Used in: ComponentName
 */
export const getYourData = cache(async () => {
  try {
    const data = await db
      .select()
      .from(yourTable)
      .where(eq(yourTable.isActive, true))
      .orderBy(desc(yourTable.createdAt));

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return []; // Always return fallback
  }
});
```

### Step 2: Use in Component

```typescript
import { getYourData } from "@/lib/data/queries";

export default async function YourComponent() {
  const data = await getYourData();
  return <div>{/* render data */}</div>;
}
```

### Step 3: Add to Page Helper (if needed)

```typescript
export async function getYourPageData() {
  const [data1, data2, data3] = await Promise.all([
    getYourData(),
    getOtherData(),
    getMoreData(),
  ]);

  return { data1, data2, data3 };
}
```

## Debugging

### Check if Query is Cached

```typescript
export const getCompanyDetails = cache(async () => {
  console.log("🔍 Query executed"); // Only logs once per request
  return await db.select()...;
});
```

### Measure Query Performance

```typescript
export const getCompanyDetails = cache(async () => {
  const start = performance.now();
  const result = await db.select()...;
  console.log(`⚡ Query took ${performance.now() - start}ms`);
  return result;
});
```

### Force Revalidation (Development)

```bash
# Clear Next.js cache
rm -rf .next/cache

# Or use dynamic rendering
export const dynamic = 'force-dynamic';
```

## Decision Tree

```
Need to fetch data?
│
├─ From YOUR database?
│  │
│  ├─ In Server Component?
│  │  └─ ✅ Use: import { getData } from "@/lib/data/queries"
│  │
│  └─ In Client Component?
│     └─ ❌ Convert to Server Component or use Server Action
│
├─ From EXTERNAL API?
│  │
│  ├─ Has API keys/secrets?
│  │  └─ ✅ Create API route → fetch from component
│  │
│  └─ Public API?
│     └─ ✅ Use: fetch() directly in Server Component
│
└─ User-submitted data?
   └─ ✅ Use: Server Actions with revalidatePath()
```

## Cheat Sheet

| Scenario           | Solution                           | File                  |
| ------------------ | ---------------------------------- | --------------------- |
| Fetch company info | `await getCompanyDetails()`        | `lib/data/queries.ts` |
| Fetch team members | `await getTeamMembers()`           | `lib/data/queries.ts` |
| Fetch testimonials | `await getTestimonials()`          | `lib/data/queries.ts` |
| Fetch projects     | `await getProjects()`              | `lib/data/queries.ts` |
| Multiple queries   | `Promise.all([...])`               | Any page/component    |
| Update data        | Server Action + `revalidatePath()` | `app/*/actions.ts`    |
| Check cache        | `console.log()` in query           | `lib/data/queries.ts` |
| Clear cache        | `revalidatePath("/")`              | After mutation        |

## Remember

1. ✅ **Always use `cache()` from React** for query functions
2. ✅ **Always use `Promise.all()`** for multiple queries
3. ✅ **Always provide fallback values** in catch blocks
4. ✅ **Always revalidate after mutations** with `revalidatePath()`
5. ✅ **Never use API routes** for your own database queries
6. ✅ **Never use useEffect + fetch** when you can use Server Components
7. ✅ **Never fetch in sequence** when you can fetch in parallel

---

**Quick Reference Guide** | [Full Documentation](./DATA_FETCHING.md) | [Performance](./PERFORMANCE_OPTIMIZATION.md)
