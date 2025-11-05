import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq, desc, or, like, asc } from "drizzle-orm";
import { deleteImage } from "@/lib/cloudinary";

// GET /api/admin/blog - Get all blog posts with filters
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const category = searchParams.get("category") || "all";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build query conditions
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(blogPosts.title, `%${search}%`),
          like(blogPosts.excerpt, `%${search}%`),
          like(blogPosts.author, `%${search}%`)
        )
      );
    }

    if (status !== "all") {
      conditions.push(eq(blogPosts.status, status));
    }

    if (category !== "all") {
      conditions.push(eq(blogPosts.category, category));
    }

    // Build order by clause
    let orderByClause;
    if (sortBy === "publishedAt") {
      orderByClause =
        sortOrder === "desc"
          ? desc(blogPosts.publishedAt)
          : asc(blogPosts.publishedAt);
    } else if (sortBy === "viewCount") {
      orderByClause =
        sortOrder === "desc"
          ? desc(blogPosts.viewCount)
          : asc(blogPosts.viewCount);
    } else {
      orderByClause =
        sortOrder === "desc"
          ? desc(blogPosts.createdAt)
          : asc(blogPosts.createdAt);
    }

    const posts = await db
      .select()
      .from(blogPosts)
      .where(conditions.length > 0 ? or(...conditions) : undefined)
      .orderBy(orderByClause);

    return NextResponse.json({
      success: true,
      posts,
      count: posts.length,
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch blog posts",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/blog - Create new blog post
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      featuredImagePublicId,
      gallery,
      category,
      tags,
      status,
      featured,
    } = body;

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPost = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1);

    if (existingPost.length > 0) {
      return NextResponse.json(
        { error: "A blog post with this slug already exists" },
        { status: 400 }
      );
    }

    // Get author info
    const authorName =
      `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Admin";

    // Create blog post
    const [newPost] = await db
      .insert(blogPosts)
      .values({
        title,
        slug,
        excerpt: excerpt || null,
        content,
        featuredImage: featuredImage || null,
        featuredImagePublicId: featuredImagePublicId || null,
        gallery: gallery || null,
        category: category || null,
        tags: tags || [],
        author: authorName,
        authorId: user.id,
        status: status || "draft",
        featured: featured || false,
        publishedAt: status === "published" ? new Date() : null,
        viewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      post: newPost,
      message: "Blog post created successfully",
    });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      {
        error: "Failed to create blog post",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/blog?id=xxx - Update blog post
export async function PATCH(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Blog post ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      featuredImagePublicId,
      gallery,
      category,
      tags,
      status,
      featured,
    } = body;

    // Check if slug is being changed and if it conflicts
    if (slug) {
      const existingPost = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.slug, slug))
        .limit(1);

      if (existingPost.length > 0 && existingPost[0].id !== id) {
        return NextResponse.json(
          { error: "A blog post with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Get current post to check if we need to delete old image
    const [currentPost] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1);

    if (!currentPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // If featured image is being changed, delete the old one from Cloudinary
    if (
      featuredImage &&
      currentPost.featuredImagePublicId &&
      currentPost.featuredImagePublicId !== featuredImagePublicId
    ) {
      try {
        await deleteImage(currentPost.featuredImagePublicId);
      } catch (error) {
        console.error("Failed to delete old image from Cloudinary:", error);
        // Continue anyway
      }
    }

    // If gallery is being changed, delete removed images from Cloudinary
    if (gallery !== undefined && currentPost.gallery) {
      const currentGalleryIds = currentPost.gallery.map(
        (img: { publicId: string }) => img.publicId
      );
      const newGalleryIds = (gallery || []).map(
        (img: { publicId: string }) => img.publicId
      );
      const deletedImages = currentGalleryIds.filter(
        (id: string) => !newGalleryIds.includes(id)
      );

      for (const publicId of deletedImages) {
        try {
          await deleteImage(publicId);
        } catch (error) {
          console.error(
            `Failed to delete gallery image ${publicId} from Cloudinary:`,
            error
          );
          // Continue anyway
        }
      }
    }

    // Build update data
    const updateData: {
      title?: string;
      slug?: string;
      excerpt?: string | null;
      content?: string;
      featuredImage?: string | null;
      featuredImagePublicId?: string | null;
      gallery?: Array<{
        url: string;
        publicId: string;
        caption?: string;
      }> | null;
      category?: string | null;
      tags?: string[];
      status?: string;
      featured?: boolean;
      publishedAt?: Date | null;
      updatedAt: Date;
    } = {
      updatedAt: new Date(),
    };

    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (excerpt !== undefined) updateData.excerpt = excerpt || null;
    if (content !== undefined) updateData.content = content;
    if (featuredImage !== undefined)
      updateData.featuredImage = featuredImage || null;
    if (featuredImagePublicId !== undefined)
      updateData.featuredImagePublicId = featuredImagePublicId || null;
    if (gallery !== undefined) updateData.gallery = gallery || null;
    if (category !== undefined) updateData.category = category || null;
    if (tags !== undefined) updateData.tags = tags;
    if (status !== undefined) {
      updateData.status = status;
      // Set publishedAt when publishing for the first time
      if (status === "published" && !currentPost.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }
    if (featured !== undefined) updateData.featured = featured;

    const [updatedPost] = await db
      .update(blogPosts)
      .set(updateData)
      .where(eq(blogPosts.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      post: updatedPost,
      message: "Blog post updated successfully",
    });
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      {
        error: "Failed to update blog post",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/blog?id=xxx - Delete blog post
export async function DELETE(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Blog post ID is required" },
        { status: 400 }
      );
    }

    // Get the post to delete the image from Cloudinary
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1);

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Delete featured image from Cloudinary if exists
    if (post.featuredImagePublicId) {
      try {
        await deleteImage(post.featuredImagePublicId);
      } catch (error) {
        console.error("Failed to delete image from Cloudinary:", error);
        // Continue with post deletion anyway
      }
    }

    // Delete gallery images from Cloudinary if exist
    if (post.gallery && Array.isArray(post.gallery)) {
      for (const image of post.gallery as Array<{ publicId: string }>) {
        try {
          await deleteImage(image.publicId);
        } catch (error) {
          console.error(
            `Failed to delete gallery image ${image.publicId} from Cloudinary:`,
            error
          );
          // Continue anyway
        }
      }
    }

    // Delete the blog post
    await db.delete(blogPosts).where(eq(blogPosts.id, id));

    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      {
        error: "Failed to delete blog post",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
