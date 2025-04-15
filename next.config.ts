import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "res.cloudinary.com",
        protocol: "https",
      },
      {
        hostname: "alt.tailus.io",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
