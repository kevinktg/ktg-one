"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { formatDate, getFeaturedImage } from "@/lib/wordpress";

export function BlogPreview({ posts: serverPosts }) {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const [clientPosts, setClientPosts] = useState(null);
  
  // Client-side fallback: Try fetching posts if server-side fetch failed
  useEffect(() => {
    // Only fetch if server posts are empty/null
    if ((!serverPosts || serverPosts.length === 0) && !clientPosts) {
      const fetchPosts = async () => {
        try {
          const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://lawngreen-mallard-558077.hostingersite.com';
          const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/posts?_embed&per_page=6`, {
            cache: 'no-store',
          });
          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
              console.log('[BlogPreview] Client-side fetch successful:', data.length, 'posts');
              setClientPosts(data);
            }
          }
        } catch (error) {
          console.error('[BlogPreview] Client-side fetch failed:', error);
        }
      };
      fetchPosts();
    }
  }, [serverPosts, clientPosts]);
  
  // Use client posts if available, otherwise use server posts
  const posts = (clientPosts && clientPosts.length > 0) ? clientPosts : serverPosts;

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
  }, { scope: sectionRef, dependencies: [displayPosts] }); // Re-run when posts change

  // Always render the section, even if no posts (critical for visibility)
  // Handle both server-side props and potential undefined/null
  const displayPosts = posts && Array.isArray(posts) && posts.length > 0 ? posts : [];
  const hasPosts = displayPosts.length > 0;
  
  // Debug logging in development
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('[BlogPreview] Posts received:', {
      postsCount: posts?.length || 0,
      isArray: Array.isArray(posts),
      hasPosts,
      firstPost: posts?.[0]?.title?.rendered || posts?.[0]?.title || 'N/A',
    });
  }

  return (
    <section ref={sectionRef} className="relative min-h-screen py-32 px-6 overflow-hidden bg-background">
      {/* Subtle background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:20px_20px] opacity-30"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Title */}
        <div ref={titleRef} className="mb-20 text-center">
          <div className="font-mono text-xs text-muted-foreground mb-4 tracking-widest uppercase">
            Latest Insights
          </div>
          <h2 className="font-syne text-4xl md:text-5xl font-bold mb-6 lowercase tracking-tight">
            blog
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            thoughts, insights, and updates on AI anthropology and prompt engineering
          </p>
        </div>

        {/* Blog Grid */}
        {hasPosts ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {displayPosts.slice(0, 6).map((post) => {
            const featuredImage = getFeaturedImage(post);
            // Handle excerpt safely - WordPress may not always have excerpt.rendered
            const rawExcerpt = post.excerpt?.rendered || post.excerpt || post.content?.rendered || '';
            const excerpt = rawExcerpt
              ? rawExcerpt.replace(/<[^>]*>/g, "").substring(0, 120) + "..."
              : "Read more...";

            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="blog-card group block"
              >
                <article className="h-full border border-border hover:border-foreground/20 transition-all duration-300 bg-card/50 hover:bg-card/80">
                  {featuredImage && (
                    <div className="mb-6 overflow-hidden" style={{ aspectRatio: "2/1" }}>
                      <Image
                        src={featuredImage}
                        alt={post.title?.rendered || post.title || 'Blog post'}
                        width={800}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="font-mono text-xs text-muted-foreground mb-3">
                      {formatDate(post.date)}
                    </div>
                    <h3 className="font-syne text-xl font-bold mb-3 lowercase group-hover:text-foreground/90 transition-colors line-clamp-2">
                      {post.title?.rendered || post.title || 'Untitled Post'}
                    </h3>
                    <p className="text-muted-foreground text-base line-clamp-3 mb-4">
                      {excerpt}
                    </p>
                    <div className="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                      read more →
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
        ) : (
          <div className="text-center py-16 border border-border rounded-lg bg-card/30">
            <p className="text-muted-foreground text-base mb-4">
              Loading blog posts...
            </p>
            <p className="text-xs text-muted-foreground/60 font-mono">
              If posts don't appear, check WordPress API connection
            </p>
          </div>
        )}

        {/* View All Link - only show if we have posts */}
        {hasPosts && (
          <div className="text-center">
            <Link
              href="/blog"
              className="inline-block font-mono text-sm border border-border hover:border-foreground/40 px-8 py-4 transition-all duration-300 hover:bg-card/50"
            >
              view all posts
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

