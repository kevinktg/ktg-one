import { notFound } from "next/navigation";
import { getPostBySlug, formatDate, getFeaturedImage } from "@/lib/wordpress";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found | .ktg",
    };
  }

  return {
    title: `${post.title.rendered} | .ktg`,
    description: post.excerpt.rendered.replace(/<[^>]*>/g, "").substring(0, 160),
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const featuredImage = getFeaturedImage(post);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 font-mono text-sm"
          >
            ← back to blog
          </Link>

          <article>
            <h1 className="font-syne text-4xl md:text-5xl lg:text-6xl font-bold mb-4 lowercase">
              {post.title.rendered}
            </h1>
            <p className="text-white/40 text-sm font-mono mb-8">
              {formatDate(post.date)}
            </p>

            {featuredImage && (
              <div className="mb-12 overflow-hidden rounded-lg">
                <Image
                  src={featuredImage}
                  alt={post.title.rendered}
                  width={1200}
                  height={600}
                  className="w-full h-auto"
                  priority
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
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors font-mono text-sm"
            >
              ← back to blog
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


