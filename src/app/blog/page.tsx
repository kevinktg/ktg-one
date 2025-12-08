import Link from "next/link";
import { getPosts } from "@/lib/wordpress";
import { formatDate, getFeaturedImage } from "@/lib/wordpress";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Blog | .ktg - AI Anthropology & Prompt Engineering Insights",
  description: "Thoughts, insights, and updates on AI anthropology, prompt engineering, LLM optimization, and the future of human-AI collaboration. Top 0.01% prompt engineer's perspective.",
  keywords: ["AI anthropology", "prompt engineering", "LLM optimization", "AI insights", "machine learning", "artificial intelligence"],
  openGraph: {
    title: "Blog | .ktg - AI Anthropology & Prompt Engineering",
    description: "Thoughts, insights, and updates on AI anthropology and prompt engineering from a top 0.01% prompt engineer.",
    type: "website",
    siteName: ".ktg",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | .ktg",
    description: "AI Anthropology & Prompt Engineering Insights",
  },
};

// Force dynamic rendering to avoid build-time API failures
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export default async function BlogPage() {
  const posts = await getPosts();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ktg.one';

  // Structured data for blog listing
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: ".ktg Blog",
    description: "AI Anthropology & Prompt Engineering Insights",
    url: `${siteUrl}/blog`,
    publisher: {
      "@type": "Organization",
      name: ".ktg",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/assets/ktg-one.svg`,
      },
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title.rendered,
      url: `${siteUrl}/blog/${post.slug}`,
      datePublished: new Date(post.date).toISOString(),
      image: getFeaturedImage(post) || `${siteUrl}/assets/ktg-one.svg`,
    })),
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-syne text-5xl md:text-6xl font-bold mb-4 lowercase">
            blog
          </h1>
          <p className="text-white/60 mb-12 font-mono">
            thoughts, insights, and updates
          </p>

          {posts.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-white/40 mb-4">No posts found.</p>
              <p className="text-white/30 text-sm">
                Make sure NEXT_PUBLIC_WORDPRESS_URL is set correctly in your environment variables.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {posts.map((post) => {
                const featuredImage = getFeaturedImage(post);
                const excerpt = post.excerpt.rendered
                  .replace(/<[^>]*>/g, "")
                  .substring(0, 150) + "...";

                return (
                  <article
                    key={post.id}
                    className="border-b border-white/10 pb-12 last:border-0"
                    itemScope
                    itemType="https://schema.org/BlogPosting"
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group block"
                      itemProp="url"
                    >
                      {featuredImage && (
                        <div className="mb-6 overflow-hidden rounded-lg">
                          <Image
                            src={featuredImage}
                            alt={post.title.rendered}
                            width={800}
                            height={400}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <h2 className="font-syne text-3xl md:text-4xl font-bold mb-3 group-hover:text-white/80 transition-colors lowercase" itemProp="headline">
                        {post.title.rendered}
                      </h2>
                      <div className="text-white/40 text-sm font-mono mb-4">
                        <time dateTime={new Date(post.date).toISOString()} itemProp="datePublished">
                          {formatDate(post.date)}
                        </time>
                      </div>
                      <div
                        className="text-white/70 prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: excerpt }}
                      />
                      <p className="mt-4 text-white/50 font-mono text-sm group-hover:text-white/70 transition-colors">
                        read more →
                      </p>
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}


