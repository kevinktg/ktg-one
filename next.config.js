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
  // Security headers to enforce browser protections and defense-in-depth
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Prevent site from being embedded in iframes to protect against clickjacking attacks
          { key: 'X-Frame-Options', value: 'DENY' },
          // Prevent browsers from MIME-sniffing the response away from declared content-type
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Limit referrer information sent on cross-origin requests
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Restrict unnecessary browser feature and hardware API access
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

