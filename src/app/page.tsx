"use client";

import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { GalleryFormation } from "@/components/ScrollTransition";
import { Footer } from "@/components/Footer";
import { useRef, useState, useEffect } from "react";
import dynamic from 'next/dynamic';

// Dynamically import components with loading fallbacks to reduce initial bundle size
const CareerTimeline = dynamic(() => import("@/components/CareerTimeline"), { 
  loading: () => <div className="h-screen flex items-center justify-center">Loading...</div>,
  ssr: false
});
const ExpertiseSection = dynamic(() => import("@/components/ExpertiseSection"), { 
  loading: () => <div className="min-h-[50vh] flex items-center justify-center">Loading...</div>,
  ssr: false
});
const ValidationSection = dynamic(() => import("@/components/ValidationSection"), { 
  loading: () => <div className="min-h-[50vh] flex items-center justify-center">Loading...</div>,
  ssr: false
});
const PhilosophySection = dynamic(() => import("@/components/PhilosophySection"), { 
  loading: () => <div className="min-h-[50vh] flex items-center justify-center">Loading...</div>,
  ssr: false
});
const BlogPreview = dynamic(() => import("@/components/BlogPreview"), { 
  loading: () => <div className="min-h-[50vh] flex items-center justify-center">Loading...</div>,
  ssr: false
});

import { getPosts, WordPressPost } from "@/lib/wordpress";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [blogPosts, setBlogPosts] = useState<WordPressPost[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Fetch blog posts after initial render to prevent blocking
  useEffect(() => {
    const timer = setTimeout(() => {
      getPosts(1, 6)
        .then(posts => {
          setBlogPosts(posts);
          setHasLoaded(true);
        })
        .catch(console.error);
    }, 1000); // Small delay to prioritize above-the-fold content
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <Header />

      <main className="relative bg-transparent text-white">
        <div className="relative z-10">
          {/* Hero Section - Critical, load immediately */}
          <HeroSection ref={heroRef} />

          {/* Gallery Formation - Below fold, but important */}
          <GalleryFormation />

          {/* Non-critical sections loaded dynamically */}
          <CareerTimeline />
          <ExpertiseSection />
          <ValidationSection />
          <PhilosophySection />
          
          {/* Blog Preview - loaded dynamically with fetched data */}
          <BlogPreview posts={hasLoaded ? blogPosts : []} />

          {/* Footer */}
          <Footer />
        </div>
      </main>
    </div>
  );
}
