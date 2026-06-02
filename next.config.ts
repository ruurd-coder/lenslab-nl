import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Supabase Storage voor echte foto's straks
        protocol: "https",
        hostname: "xbvriaxprnupoakjpqnh.supabase.co",
      },
    ],
  },
};

export default nextConfig;
