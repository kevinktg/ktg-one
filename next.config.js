/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicitly set the workspace root to prevent Next.js from inferring incorrectly
  // when parent directories have lockfiles
  outputFileTracingRoot: require('path').join(__dirname),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ktg.one",
      },
      {
        protocol: "https",
        hostname: "lawngreen-mallard-558077.hostingersite.com",
      },
    ],
  },
};

module.exports = nextConfig;

