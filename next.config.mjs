/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      'gsap',
      'gsap/ScrollTrigger',
      'gsap/Flip',
      'gsap/utils',
      'gsap/EasePack',
      'gsap/TextPlugin',
      'gsap/Draggable',
      'gsap/MotionPathPlugin',
      'gsap/PixiPlugin',
      'gsap/ScrollSmoother',
      'gsap/Observer',
      'gsap/SplitText',
      'gsap/gsap-core'
    ],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['cdn.shopify.com', 'images.unsplash.com', 'source.unsplash.com'],
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
  },
  webpack: (config, { dev, isServer }) => {
    // Optimize GSAP imports
    if (!isServer && typeof window !== 'undefined') {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    // Enable compression
    config.optimization.minimize = true;

    return config;
  },
};

export default nextConfig;

