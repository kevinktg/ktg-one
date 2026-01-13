"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { getFeaturedImage, formatDate } from "@/lib/wordpress";

gsap.registerPlugin(ScrollTrigger);

export function BlogPreview({ posts = [] }) {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  // OPTIMIZATION: Cache sessionStorage check to avoid synchronous access on every render
  const hasPlayed = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('blog-animated') === 'true';
  }, []);

  useGSAP(() => {
    // Set initial state - posts should be visible
    gsap.set(".blog-post", { opacity: 1, y: 0 });
    
    if (hasPlayed) {
      return;
    }

    // Stagger animation for blog posts
    const blogPosts = gsap.utils.toArray(".blog-post");
    
    if (blogPosts.length > 0) {
      // Start hidden, animate in on scroll
      gsap.set(blogPosts, { opacity: 0, y: 50 });
      
      gsap.to(blogPosts, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
          onComplete: () => {
            sessionStorage.setItem('blog-animated', 'true');
          }
        }
      });
    }
  }, { scope: sectionRef });

  // Default fallback message
  if (!posts || posts.length === 0) {
    return (
      <section ref={sectionRef} data-blog-section className="relative min-h-screen py-32 px-6 bg-black text-white" suppressHydrationWarning>
        <div ref={containerRef} className="max-w-7xl mx-auto">
          <h2 className="font-syne text-4xl md:text-5xl font-bold mb-6 lowercase">blog</h2>
          <p className="text-muted-foreground">No posts available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} data-blog-section className="relative min-h-screen py-32 px-6 bg-black text-white" suppressHydrationWarning>
      <div ref={containerRef} className="max-w-7xl mx-auto">
        <h2 className="font-syne text-4xl md:text-5xl font-bold mb-12 lowercase">blog</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => {
            if (!post || !post.title) return null;
            
            const featuredImage = getFeaturedImage(post);
            const excerpt = (post.excerpt?.rendered || post.excerpt || '')
              .replace(/<[^>]*>/g, "")
              .substring(0, 120) + "...";
            const title = post.title?.rendered || post.title || 'Untitled';

            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="blog-post group block"
              >
                <article className="h-full flex flex-col border border-white/10 hover:border-white/30 transition-colors duration-300 bg-black/80 backdrop-blur-sm">
                  {featuredImage && (
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={featuredImage}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading={index < 3 ? "eager" : "lazy"}
                        priority={index === 0}
                      />
                    </div>
                  )}
                  
                  <div className="p-6 flex-1 flex flex-col">
                    {post.date && (
                      <time 
                        className="text-muted-foreground text-xs mb-3"
                        dateTime={new Date(post.date).toISOString()}
                      >
                        {formatDate(post.date)}
                      </time>
                    )}
                    
                    <h3 className="font-syne text-xl md:text-2xl font-bold mb-3 lowercase group-hover:text-foreground/80 transition-colors line-clamp-2">
                      {title}
                    </h3>
                    
                    {excerpt && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
                        {excerpt}
                      </p>
                    )}
                    
                    <span className="text-muted-foreground text-xs group-hover:text-foreground/70 transition-colors mt-auto">
                      read more →
                    </span>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        {posts.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-block text-sm text-muted-foreground hover:text-foreground transition-colors border-b border-transparent hover:border-foreground/30"
            >
              view all posts →
            </Link>
          </div>
        )}

        {/* Marquee Banner Footer */}
        <div className="mt-24 relative w-full overflow-hidden border-t border-white/10 pt-8 pb-8">
          <div className="flex items-center gap-8 md:gap-12 whitespace-nowrap w-max">
            <div 
              className="flex items-center gap-6 md:gap-6 animate-scroll will-change-transform" 
              style={{ 
                gap: '24px',
                justifyContent: 'flex-start',
                verticalAlign: 'top'
              }}
            >
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center gap-8 md:gap-12 shrink-0">
                  <span className="text-sm md:text-base text-white/70 tracking-wider">Cognitive Architect</span>
                  <span className="text-white/20">•</span>
                  <span className="text-sm md:text-base text-white/70 tracking-wider">Top 0.01%</span>
                  <span className="text-white/20">•</span>
                  <span className="text-sm md:text-base text-white/70 tracking-wider">Context Sovereignty</span>
                  <span className="text-white/20">•</span>
                  <span className="text-sm md:text-base text-white/70 tracking-wider">Framework Verification</span>
                  <span className="text-white/20">•</span>
                  <span className="text-sm md:text-base text-white/70 tracking-wider">Arxiv-Ready Research</span>
                  <span className="text-white/20">•</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

