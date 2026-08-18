import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    serverActions: {
      // Keep under Vercel's ~4.5 MB serverless body limit (photo + form fields).
      bodySizeLimit: "4mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
