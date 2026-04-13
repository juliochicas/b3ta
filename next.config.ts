import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ncmsevbojzotkkfgoabp.supabase.co",
      },
    ],
  },
};

export default nextConfig;
