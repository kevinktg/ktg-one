import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ktg.one",
      },
      // Add your WordPress domain here if different from ktg.one
      // {
      //   protocol: "https",
      //   hostname: "your-wordpress-domain.com",
      // },
    ],
  },
};

export default nextConfig;

