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
    // Optimize image loading
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  turbopack: {
    root: __dirname,
  },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
  },
  // Security headers to enforce browser-side security controls
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' }, // Clickjacking protection
          { key: 'X-Content-Type-Options', value: 'nosniff' }, // MIME-sniffing prevention
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }, // Protect referrer privacy
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }, // Restrict sensitive browser features
          { key: 'X-DNS-Prefetch-Control', value: 'on' }, // Control DNS prefetching
        ],
      },
    ];
  },
};

module.exports = nextConfig;

