import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ExpertiseSection } from "@/components/ExpertiseSection";
import { PhilosophySection } from "@/components/PhilosophySection";
import { Footer } from "@/components/Footer";
import { ValidationSection } from "@/components/ValidationSection";
import { BlogPreview } from "@/components/BlogPreview";
import { getPosts } from "@/lib/wordpress";

// Force dynamic rendering if you want new blog posts to appear instantly on refresh
// or use 'export const revalidate = 3600' to cache for 1 hour.
export const revalidate = 60;

export default async function Home() {
  // 1. FETCH DATA ON SERVER
  // This runs on the server before the page is sent to the browser.
  let blogPosts = [];
  try {
    // Attempt to fetch posts. If WP is down, it won't crash the whole site.
    blogPosts = await getPosts(1, 6);
    console.log(`[Home] Fetched ${blogPosts?.length || 0} posts from WordPress`);
    
    // Debug: Log if posts array is empty
    if (!blogPosts || blogPosts.length === 0) {
      console.warn("[Home] No posts returned from WordPress API. Check:");
      console.warn("1. WordPress URL:", process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://lawngreen-mallard-558077.hostingersite.com');
      console.warn("2. WordPress REST API is enabled");
      console.warn("3. Posts exist and are published");
    }
  } catch (error) {
    console.error("[Home] Failed to fetch posts:", error);
    console.error("[Home] Error details:", error.message);
    // Continue - BlogPreview will show loading state
  }

  // 2. DEFINE DATA FOR OTHER SECTIONS (Optional)
  // You can fetch this from WP too, or define it here to keep the components "dumb"
  // For now, we rely on the default props inside the components,
  // but this is where you would pass "heroData", "expertiseData", etc.

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Header is usually fixed/sticky.
        Ensure it has z-50 to sit above the Hero canvas
      */}
      <Header />

      <main className="flex-grow">

        {/* HERO: Black Background */}
        <HeroSection />

        {/* EXPERTISE: White Background (Scrolls over Hero) */}
        <ExpertiseSection />

        {/* VALIDATION: Black Background (Horizontal Scroll) */}
        <ValidationSection />

        {/* PHILOSOPHY: Black Background (Parallax Quotes) */}
        <PhilosophySection />

        {/* BLOG: Black Background (Grid Stagger) */}
        {/* We pass the server-fetched posts here */}
        <BlogPreview posts={blogPosts} />

      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}