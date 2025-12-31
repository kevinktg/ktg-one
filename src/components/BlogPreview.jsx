"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { formatDate, getFeaturedImage } from "@/lib/wordpress";
import { GeometricBackground } from "@/components/GeometricBackground";

export function BlogPreview({ posts }) {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  useGSAP(() => {
    // Check if animation has already played this session
    const hasPlayed = sessionStorage.getItem('blog-animated') === 'true';

    if (hasPlayed) {
      // Skip animation - set final states immediately
      if (titleRef.current) gsap.set(titleRef.current, { opacity: 1, y: 0 });
      const cards = gsap.utils.toArray(
        sectionRef.current?.querySelectorAll(".blog-card") || []
      );
      cards.forEach((card) => {
        gsap.set(card, { opacity: 1, y: 0 });
      });
      return;
    }

    // Animate title - Run immediately on mount
    if (titleRef.current) {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 50,
        duration: 1.2,
        ease: "power2.out",
      });
    }

    // Animate blog cards - Stagger after title
    const cards = gsap.utils.toArray(
      sectionRef.current?.querySelectorAll(".blog-card") || []
    );

    cards.forEach((card, index) => {
      gsap.from(card, {
        opacity: 0,
        y: 60,
        duration: 1,
        delay: 0.6 + (index * 0.1), // Start after title, stagger cards
        ease: "power2.out",
        onComplete: () => {
          if (index === cards.length - 1) {
            sessionStorage.setItem('blog-animated', 'true');
          }
        }
      });
    });
  }, { scope: sectionRef });

  if (posts.length === 0) return null;

  return (
    <section ref={sectionRef} className="relative min-h-screen py-32 px-6 overflow-hidden" style={{ contain: "layout paint" }}>
      {/* Geometric Background */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{ contain: "strict layout paint" }}>
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 grid-pattern" />
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 right-20 w-64 h-64 border-2 border-white opacity-15 rotate-45" />
        <div className="absolute top-1/4 left-10 w-48 h-48 border-2 border-white opacity-12" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 border-2 border-white opacity-15 rounded-full" />
        <div className="absolute bottom-20 left-20 w-56 h-56 border-2 border-white opacity-12 rotate-12" />
        
        {/* Additional circles */}
        <div className="absolute top-1/3 right-1/4 w-72 h-72 border border-white opacity-8 rounded-full" />
        <div className="absolute bottom-1/3 left-1/3 w-40 h-40 border-2 border-white opacity-10 rounded-full" />
        <div className="absolute top-2/3 right-1/2 w-32 h-32 border border-white opacity-8 rounded-full" />
        
        {/* Diagonal lines */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 diagonal-lines" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 diagonal-lines" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Title */}
        <div ref={titleRef} className="mb-16 text-center">
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
          {posts.slice(0, 6).map((post) => {
            const featuredImage = getFeaturedImage(post);
            const excerpt = post.excerpt.rendered
              .replace(/<[^>]*>/g, "")
              .substring(0, 120) + "...";

            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="blog-card group block"
              >
                <article className="h-full border border-white/10 hover:border-white/30 transition-all duration-300 bg-white/5 hover:bg-white/10">
                  {featuredImage && (
                    <div className="mb-6 overflow-hidden rounded-lg" style={{ aspectRatio: "2/1", contain: "layout paint" }}>
                      <Image
                        src={featuredImage}
                        alt={post.title?.rendered || post.title || 'Blog post'}
                        width={800}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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

