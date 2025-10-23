import { NextRequest, NextResponse } from "next/server";
import { validateCloudinaryConfig } from "@/lib/cloudinary";

export async function GET() {
  try {
    const isConfigValid = validateCloudinaryConfig();

    const config = {
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "missing",
      api_key: process.env.CLOUDINARY_API_KEY ? "configured" : "missing",
      api_secret: process.env.CLOUDINARY_API_SECRET ? "configured" : "missing",
      isValid: isConfigValid,
    };

    return NextResponse.json({
      message: "Cloudinary configuration check",
      config,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Configuration check failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
