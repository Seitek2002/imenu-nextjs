import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Disable optimization to allow any external URLs (API-hosted product photos) without domain config
    unoptimized: true,
  },
};

export default nextConfig;
