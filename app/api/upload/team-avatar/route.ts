import { NextRequest, NextResponse } from "next/server";
import {
  validateCloudinaryConfig,
  uploadImage,
  deleteImage,
} from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    console.log("=== Starting image upload process ===");

    // Check if Cloudinary is properly configured
    if (!validateCloudinaryConfig()) {
      console.error("Cloudinary configuration missing");
      console.log("Environment check:", {
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "MISSING",
        api_key: process.env.CLOUDINARY_API_KEY ? "SET" : "MISSING",
        api_secret: process.env.CLOUDINARY_API_SECRET ? "SET" : "MISSING",
      });
      return NextResponse.json(
        { error: "Cloudinary configuration is incomplete" },
        { status: 500 }
      );
    }

    console.log("✓ Cloudinary configuration validated");

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.error("No file provided in form data");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log("✓ File received:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // Validate file type
    if (!file.type.startsWith("image/")) {
      console.error("Invalid file type:", file.type);
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      console.error("File too large:", file.size);
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    console.log("✓ File validation passed");

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log("✓ File converted to buffer, size:", buffer.length);

    // Upload to Cloudinary using utility function
    console.log("Starting Cloudinary upload...");
    const result = await uploadImage(buffer, {
      folder: "team-avatars",
      transformation: [
        { width: 600, height: 600, crop: "fill", gravity: "face" },
        { quality: "auto", format: "auto" },
      ],
      resource_type: "image",
    });

    console.log("✓ Upload successful:", result?.public_id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("=== Upload Error Details ===");
    console.error("Error type:", typeof error);
    console.error("Error constructor:", error?.constructor?.name);
    console.error(
      "Error message:",
      error instanceof Error ? error.message : "No message"
    );
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack"
    );
    console.error("Full error object:", error);

    // Try to extract more details from Cloudinary errors
    let errorDetails = "Unknown error";
    let errorCode = "UNKNOWN";

    if (error && typeof error === "object") {
      const err = error as {
        message?: string;
        error?: { message?: string; http_code?: string | number };
        http_code?: string | number;
        toString: () => string;
      };
      errorDetails = err.message || err.error?.message || err.toString();
      errorCode = String(err.http_code || err.error?.http_code || "UNKNOWN");

      if (err.error) {
        console.error("Cloudinary error details:", err.error);
      }
    }

    return NextResponse.json(
      {
        error: "Failed to upload image",
        details: errorDetails,
        code: errorCode,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get("public_id");

    if (!publicId) {
      return NextResponse.json(
        { error: "No public_id provided" },
        { status: 400 }
      );
    }

    // Delete from Cloudinary using utility function
    const result = await deleteImage(publicId);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
