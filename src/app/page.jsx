"use client";

import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ExpertiseSection } from "@/components/ExpertiseSection";
import { PhilosophySection } from "@/components/PhilosophySection";
import { Footer } from "@/components/Footer";
import { ValidationSection } from "@/components/ValidationSection";
import { BlogPreview } from "@/components/BlogPreview";
import { useRef, useState, useEffect } from "react";
import { getPosts } from "@/lib/wordpress";

export default function Home() {
  const heroRef = useRef(null);
  const [blogPosts, setBlogPosts] = useState([]);

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

