/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['cdn.shopify.com', 'images.unsplash.com', 'source.unsplash.com'],
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
  },
};

export default nextConfig;

