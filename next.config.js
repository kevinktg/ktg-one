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
    // Optimize image loading
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  // Fix workspace root warning
  turbopack: {
    root: __dirname,
  },
  // Production optimizations
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  // Experimental performance features
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;

