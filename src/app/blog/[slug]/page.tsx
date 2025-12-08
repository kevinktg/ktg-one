import { notFound } from "next/navigation";
import { getPostBySlug, getPosts, formatDate, getFeaturedImage } from "@/lib/wordpress";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Force dynamic rendering to avoid build-time API failures
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found | .ktg",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ktg.one';
  const postUrl = `${siteUrl}/blog/${slug}`;
  const excerpt = post.excerpt.rendered.replace(/<[^>]*>/g, "").substring(0, 160);
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || `${siteUrl}/assets/ktg-one.svg`;
  const publishedTime = new Date(post.date).toISOString();
  const modifiedTime = post.date ? new Date(post.date).toISOString() : publishedTime;

  return {
    title: `${post.title.rendered} | .ktg`,
    description: excerpt,
    keywords: ["AI", "prompt engineering", "LLM", "artificial intelligence", "machine learning"],
    authors: [{ name: ".ktg" }],
    openGraph: {
      title: post.title.rendered,
      description: excerpt,
      url: postUrl,
      siteName: ".ktg",
      images: [
        {
          url: featuredImage,
          width: 1200,
          height: 630,
          alt: post.title.rendered,
        },
      ],
      type: "article",
      publishedTime,
      modifiedTime,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title.rendered,
      description: excerpt,
      images: [featuredImage],
    },
    alternates: {
      canonical: postUrl,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const featuredImage = getFeaturedImage(post);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ktg.one';
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const publishedTime = new Date(post.date).toISOString();

  // Structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title.rendered,
    description: post.excerpt.rendered.replace(/<[^>]*>/g, "").substring(0, 200),
    image: featuredImage || `${siteUrl}/assets/ktg-one.svg`,
    datePublished: publishedTime,
    dateModified: publishedTime,
    author: {
      "@type": "Person",
      name: ".ktg",
    },
    publisher: {
      "@type": "Organization",
      name: ".ktg",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/assets/ktg-one.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 font-mono text-sm"
          >
            ← back to blog
          </Link>

          <article itemScope itemType="https://schema.org/BlogPosting">
            <h1 className="font-syne text-4xl md:text-5xl lg:text-6xl font-bold mb-4 lowercase" itemProp="headline">
              {post.title.rendered}
            </h1>
            <div className="text-white/40 text-sm font-mono mb-8">
              <time dateTime={publishedTime} itemProp="datePublished">
                {formatDate(post.date)}
              </time>
            </div>

            {featuredImage && (
              <div className="mb-12 overflow-hidden rounded-lg">
                <Image
                  src={featuredImage}
                  alt={post.title.rendered}
                  width={1200}
                  height={600}
                  className="w-full h-auto"
                  priority
                  itemProp="image"
                />
              </div>
            )}

            <div
              className="prose prose-invert prose-lg max-w-none
                prose-headings:font-syne prose-headings:lowercase
                prose-headings:text-white prose-headings:font-bold
                prose-p:text-white/80 prose-p:leading-relaxed
                prose-a:text-white prose-a:underline prose-a:underline-offset-4
                prose-a:decoration-white/50 hover:prose-a:decoration-white
                prose-strong:text-white prose-strong:font-bold
                prose-code:text-white/90 prose-code:bg-white/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10
                prose-img:rounded-lg prose-img:my-8
                prose-blockquote:border-l-white/30 prose-blockquote:text-white/70
                prose-ul:text-white/80 prose-ol:text-white/80
                prose-li:marker:text-white/50"
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />
          </article>

          <div className="mt-16 pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors font-mono text-sm"
              >
                ← back to blog
              </Link>
              
              {/* Related/Recent Posts */}
              <div className="text-white/40 font-mono text-sm">
                <Link href="/" className="hover:text-white transition-colors">
                  ← home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


