/**
 * Cloudinary utility functions for team member avatars
 */

interface CloudinaryImageData {
  public_id: string;
  url: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
  version: string;
}

interface TeamMemberAvatarData {
  avatarPublicId: string;
  avatarUrl: string;
  avatarSecureUrl: string;
  avatarFormat: string;
  avatarWidth: number;
  avatarHeight: number;
  avatarVersion: string;
}

/**
 * Extract team member avatar data from Cloudinary upload response
 */
export function extractAvatarData(
  cloudinaryResponse: CloudinaryImageData
): TeamMemberAvatarData {
  return {
    avatarPublicId: cloudinaryResponse.public_id,
    avatarUrl: cloudinaryResponse.url,
    avatarSecureUrl: cloudinaryResponse.secure_url,
    avatarFormat: cloudinaryResponse.format,
    avatarWidth: cloudinaryResponse.width,
    avatarHeight: cloudinaryResponse.height,
    avatarVersion: cloudinaryResponse.version.toString(),
  };
}

/**
 * Generate optimized Cloudinary URL for team member avatar
 */
export function getOptimizedAvatarUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
    crop?: string;
    gravity?: string;
  } = {}
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName || !publicId) {
    return "";
  }

  const {
    width = 400,
    height = 400,
    quality = "auto",
    format = "auto",
    crop = "fill",
    gravity = "face",
  } = options;

  const transformations = [
    `w_${width}`,
    `h_${height}`,
    `q_${quality}`,
    `f_${format}`,
    `c_${crop}`,
    `g_${gravity}`,
  ].join(",");

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
}

/**
 * Generate different avatar sizes for responsive images
 */
export function getAvatarSrcSet(publicId: string): string {
  if (!publicId) return "";

  const sizes = [
    { width: 100, descriptor: "100w" },
    { width: 200, descriptor: "200w" },
    { width: 400, descriptor: "400w" },
    { width: 600, descriptor: "600w" },
  ];

  return sizes
    .map(({ width, descriptor }) => {
      const url = getOptimizedAvatarUrl(publicId, { width, height: width });
      return `${url} ${descriptor}`;
    })
    .join(", ");
}

/**
 * Get fallback avatar URL using UI Avatars service
 */
export function getFallbackAvatarUrl(
  firstName: string,
  lastName: string
): string {
  const name = `${firstName}+${lastName}`;
  return `https://ui-avatars.com/api/?name=${name}&bold=true&background=d9d9d9&rounded=true&size=400`;
}

/**
 * Get the best available avatar URL (Cloudinary or fallback)
 */
export function getBestAvatarUrl(
  publicId: string | null,
  firstName: string,
  lastName: string,
  options?: { width?: number; height?: number }
): string {
  if (publicId) {
    return getOptimizedAvatarUrl(publicId, options);
  }
  return getFallbackAvatarUrl(firstName, lastName);
}
