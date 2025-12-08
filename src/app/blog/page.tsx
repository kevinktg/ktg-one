import Link from "next/link";
import { getPosts } from "@/lib/wordpress";
import { formatDate, getFeaturedImage } from "@/lib/wordpress";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Blog | .ktg",
  description: "Blog posts and articles",
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
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
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group block"
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
                      <h2 className="font-syne text-3xl md:text-4xl font-bold mb-3 group-hover:text-white/80 transition-colors lowercase">
                        {post.title.rendered}
                      </h2>
                      <p className="text-white/40 text-sm font-mono mb-4">
                        {formatDate(post.date)}
                      </p>
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


