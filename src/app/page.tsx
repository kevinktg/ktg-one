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
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState, useEffect } from "react";
import { getPosts, WordPressPost } from "@/lib/wordpress";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const mainRef = useRef(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [blogPosts, setBlogPosts] = useState<WordPressPost[]>([]);

  // Fetch blog posts on mount
  useEffect(() => {
    getPosts(1, 6).then(setBlogPosts).catch(console.error);
  }, []);

  // Skip button handler - works with Lenis smooth scroll
  const handleSkip = () => {
    if (heroRef.current) {
      const heroPosition = heroRef.current.offsetTop;
      
      // Try to use Lenis if available, otherwise fallback to native scroll
      const lenisInstance = (window as any).lenis;
      if (lenisInstance) {
        lenisInstance.scrollTo(heroPosition, {
          duration: 1.5,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        // Fallback to smooth native scroll
        window.scrollTo({
          top: heroPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  useGSAP(() => {
    // Lenis handles smooth scrolling, so we don't need ScrollSmoother
    // ScrollTrigger works with Lenis via the ticker sync in lenis.tsx

    ScrollTrigger.create({
      trigger: ".hero__title-wrapper",
      pin: ".hero__title",
      scrub: true,
      start: "top top",
      end: () => "+=" + (document.querySelector(".hero") as HTMLElement)?.offsetHeight + " bottom",
      markers: false,
      pinSpacing: false
    });

    // Hide scroll indicator
    gsap.to(".scroll-indicator", {
        opacity: 0,
        scrollTrigger: {
            trigger: "main",
            start: "top top",
            end: "100px top",
            scrub: true
        }
    });

  }, { scope: mainRef });

  return (
    <div ref={mainRef}>
      <Header />

      {/* Skip Button */}
      <button 
        onClick={handleSkip} 
        className="fixed top-6 right-6 md:right-12 z-[1000] text-white/50 hover:text-white transition-colors text-xs font-mono uppercase tracking-widest cursor-pointer mix-blend-difference"
        title="Skip the narrative introduction"
      >
        (skip)
      </button>

      <main className="relative bg-transparent text-white">
                {/* ============================================ */}
                {/* ANIMATION ORDER - SCROLL SEQUENCE */}
                {/* ============================================ */}
                {/*
                  ORDER OF ANIMATIONS (top to bottom):

                  1️⃣ NARRATIVE INTRO (PINNED - scrolls through 4000px)
                     - Step 1: Void (black screen - 3s)
                     - Step 2: "So how do I optimize you" (4.5s in, 9s hold)
                     - Step 3: "My first words to LLMs" (3s fade out prev, 4.5s in, 9s hold)
                     - Step 4: "From then on," (3s fade out prev, 4.5s in, 9s hold)
                     - Step 5: "AI anthropology began...." (1s fade out prev, 1.5s in, 3s hold)
                     - Step 7: LLM Logos (1.5s in, 3s hold, 1s fade out)
                     - Step 9: "SOTA // VERIFIED" (2s in, 10s hold)

                  2️⃣ HERO SECTION (PINNED - scrolls through 1500px)
                     - Title words animate in sequentially (0.8s each, 0.2s stagger)
                     - Subtitle words animate in (2s each, 0.5s stagger)
                     - Profile image scales in (1.2s)
                     - Fades out on scroll (1s)

                  3️⃣ SCROLL TRANSITION
                     - Transition element between hero and content

                  4️⃣ CAREER TIMELINE (NOT PINNED - normal scroll)
                     - Reveals on scroll with .reveal-scroll class

                  5️⃣ EXPERTISE SECTION (NOT PINNED - normal scroll)
                     - Reveals on scroll with .reveal-scroll class

                  6️⃣ VALIDATION SECTION (NOT PINNED - normal scroll)
                     - Reveals on scroll with .reveal-scroll class

                  7️⃣ PHILOSOPHY SECTION (NOT PINNED - normal scroll)
                     - Reveals on scroll with .reveal-scroll class

                  8️⃣ BLOG PREVIEW (NOT PINNED - normal scroll)
                     - Shows recent blog posts in grid layout
                     - Reveals on scroll with animations

                  9️⃣ FOOTER (NOT PINNED - normal scroll)
                */}

                {/* 1️⃣ FIRST: Narrative Intro - Pinned scroll animation */}
                <NarrativeIntro />

                <div className="relative z-10">
                    {/* 2️⃣ SECOND: Hero Section */}
                    <HeroSection ref={heroRef} />

                    {/* 3️⃣ THIRD: Gallery Formation */}
                    <GalleryFormation />

                    {/* 4️⃣ FOURTH: Career Timeline */}
                    <CareerTimeline />

                    {/* 5️⃣ FIFTH: Expertise Section */}
                    <ExpertiseSection />

                    {/* 6️⃣ SIXTH: Validation Section */}
                    <ValidationSection />

                    {/* 7️⃣ SEVENTH: Philosophy Section */}
                    <PhilosophySection />

                    {/* 8️⃣ EIGHTH: Blog Preview */}
                    <BlogPreview posts={blogPosts} />

                    {/* 9️⃣ NINTH: Footer */}
                    <Footer />
                </div>
            </main>

      <div className="scroll-indicator fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-bounce pointer-events-none">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
          <span className="monospace text-xs text-white/30 tracking-widest">SCROLL</span>
        </div>
      </div>
    </div>
  );
}
