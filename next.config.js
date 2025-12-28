/** @type {import('next').NextConfig} */
const nextConfig = {
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
  // Fix workspace root warning
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;

