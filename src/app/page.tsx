"use client";


import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CareerTimeline } from "@/components/CareerTimeline";
import { ExpertiseSection } from "@/components/ExpertiseSection";
import { PhilosophySection } from "@/components/PhilosophySection";
import { Footer } from "@/components/Footer";
import { ValidationSection } from "@/components/ValidationSection";
import { NarrativeIntro } from "@/components/NarrativeIntro";
import { GalleryFormation } from "@/components/ScrollTransition";
import { BlogPreview } from "@/components/BlogPreview";
import { useRef, useState, useEffect } from "react";
import { getPosts, WordPressPost } from "@/lib/wordpress";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [blogPosts, setBlogPosts] = useState<WordPressPost[]>([]);

  // Fetch blog posts on mount
  useEffect(() => {
    getPosts(1, 6).then(setBlogPosts).catch(console.error);
  }, []);

  return (
    <div>
      <Header />

      <main className="relative bg-transparent text-white">
        <div className="relative z-10">
          {/* Hero Section */}
          <HeroSection ref={heroRef} />

          {/* Gallery Formation */}
          <GalleryFormation />

          {/* Career Timeline */}
          <CareerTimeline />

          {/* Expertise Section */}
          <ExpertiseSection />

          {/* Validation Section */}
          <ValidationSection />

          {/* Philosophy Section */}
          <PhilosophySection />

          {/* Blog Preview */}
          <BlogPreview posts={blogPosts} />

          {/* Footer */}
          <Footer />
        </div>
      </main>
    </div>
  );
}
