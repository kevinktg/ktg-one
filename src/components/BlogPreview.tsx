"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDate, getFeaturedImage, WordPressPost } from "@/lib/wordpress";
import { useEffect, useState } from "react";

interface BlogPreviewProps {
  posts: WordPressPost[];
}

export function BlogPreview({ posts }: BlogPreviewProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simple intersection observer for fade-in effect
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('.blog-preview-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (observer && element) {
        observer.unobserve(element);
      }
    };
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className={`relative py-20 px-6 overflow-hidden blog-preview-section ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`}>
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Title */}
        <div className="mb-16 text-center">
          <div className="monospace text-sm text-white/40 mb-4 tracking-widest">
            LATEST INSIGHTS
          </div>
          <h2 className="font-syne text-5xl md:text-6xl font-bold mb-6 lowercase">
            blog
          </h2>
          <p className="text-white/60 text-lg font-mono max-w-2xl mx-auto">
            thoughts, insights, and updates on AI anthropology and prompt engineering
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {posts.slice(0, 6).map((post, index) => {
            const featuredImage = getFeaturedImage(post);
            const excerpt = post.excerpt.rendered
              .replace(/<[^>]*>/g, "")
              .substring(0, 120) + "...";

            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className={`group block ${isVisible ? 'animate-fadeIn' : 'opacity-0'} transition-opacity duration-500`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <article className="h-full border border-white/10 hover:border-white/30 transition-all duration-300 bg-white/5 hover:bg-white/10">
                  {featuredImage && (
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={featuredImage}
                        alt={post.title.rendered}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="monospace text-xs text-white/40 mb-3">
                      {formatDate(post.date)}
                    </div>
                    <h3 className="font-syne text-2xl font-bold mb-3 lowercase group-hover:text-white/80 transition-colors line-clamp-2">
                      {post.title.rendered}
                    </h3>
                    <p className="text-white/60 text-sm line-clamp-3 mb-4">
                      {excerpt}
                    </p>
                    <div className="monospace text-xs text-white/50 group-hover:text-white transition-colors">
                      read more →
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="text-center">
          <Link
            href="/blog"
            className="inline-block monospace text-sm border border-white/20 hover:border-white/40 px-8 py-4 transition-all duration-300 hover:bg-white/5"
          >
            view all posts
          </Link>
        </div>
      </div>
    </section>
  );
}

