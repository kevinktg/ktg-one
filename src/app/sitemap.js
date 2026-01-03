import { getPosts } from '@/lib/wordpress';

export const revalidate = 3600; // Optional: Re-generate sitemap every hour

export default async function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ktg.one';
  
  // 1. Define Static Routes
  const routes = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // 2. Fetch Dynamic Routes (Safely)
  let blogRoutes = [];
  
  try {
    const posts = await getPosts(1, 100);
    
    if (Array.isArray(posts)) {
      blogRoutes = posts.map((post) => ({
        url: `${siteUrl}/blog/${post.slug}`,
        // Fallback to current date if post.date is missing/invalid
        lastModified: post.date ? new Date(post.date) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('[Sitemap] Failed to generate blog routes:', error);
    // We swallow the error so the static parts of the sitemap still generate
  }

  // 3. Merge and Return
  return [...routes, ...blogRoutes];
}