import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Validate configuration
export function validateCloudinaryConfig(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

// Get optimized image URL
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
  } = {}
): string {
  const {
    width = 600,
    height = 600,
    crop = "fill",
    quality = "auto",
    format = "auto",
  } = options;

  return cloudinary.url(publicId, {
    width,
    height,
    crop,
    quality,
    format,
    gravity: "face",
  });
}

// Upload image with error handling
export async function uploadImage(
  buffer: Buffer,
  options: {
    folder?: string;
    transformation?: Array<Record<string, string | number>>;
    resource_type?: "auto" | "image" | "video" | "raw";
  } = {}
): Promise<UploadApiResponse> {
  const {
    folder = "uploads",
    transformation = [
      { width: 600, height: 600, crop: "fill", gravity: "face" },
      { quality: "auto", format: "auto" },
    ],
    resource_type = "image" as const,
  } = options;

  console.log("Cloudinary upload options:", { folder, resource_type });

  return new Promise((resolve, reject) => {
    try {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          transformation,
          resource_type,
        },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined
        ) => {
          if (error) {
            console.error("Cloudinary stream error:", {
              message: error.message,
              name: error.name,
              error: error,
            });
            reject(
              new Error(
                `Cloudinary upload failed: ${error.message || "Unknown error"}`
              )
            );
          } else if (!result) {
            console.error("Cloudinary upload returned no result");
            reject(new Error("Cloudinary upload returned no result"));
          } else {
            console.log("Cloudinary upload success:", {
              public_id: result.public_id,
              secure_url: result.secure_url,
              width: result.width,
              height: result.height,
            });
            resolve(result);
          }
        }
      );

      if (!uploadStream) {
        reject(new Error("Failed to create Cloudinary upload stream"));
        return;
      }

      console.log("Writing buffer to upload stream...");
      uploadStream.end(buffer);
    } catch (syncError) {
      console.error("Synchronous error in uploadImage:", syncError);
      reject(
        new Error(
          `Upload setup failed: ${
            syncError instanceof Error ? syncError.message : "Unknown error"
          }`
        )
      );
    }
  });
}

// Delete image
export async function deleteImage(publicId: string): Promise<{
  result: string;
}> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Cloudinary delete result:", result);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
}

export default cloudinary;
