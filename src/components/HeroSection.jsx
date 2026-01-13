"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, forwardRef, lazy, Suspense, useMemo } from "react";

// Lazy load Three.js component
const HeroImages = lazy(() => import("@/components/HeroImages").then(mod => ({ default: mod.HeroImages })));

export const HeroSection = forwardRef((props, ref) => {
  const heroRef = useRef(null);
  const internalRef = ref || heroRef;
  const marqueeRef = useRef(null);

  // OPTIMIZATION: Cache sessionStorage check to avoid synchronous access on every render
  const hasPlayed = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('hero-animated') === 'true';
  }, []);

  useGSAP(() => {
    if (!marqueeRef.current) return;

    if (!hasPlayed) {
      gsap.from(marqueeRef.current, {
        opacity: 0,
        y: -20, // Slide down from top
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          sessionStorage.setItem('hero-animated', 'true');
        }
      });
    } else {
      gsap.set(marqueeRef.current, { opacity: 1, y: 0 });
    }
  }, { scope: heroRef });

  return (
    <section
      ref={internalRef}
      data-cursor-zone="hero"
      className="relative w-full min-h-screen flex items-center justify-center px-6 overflow-hidden"
      style={{ background: 'transparent' }}
      suppressHydrationWarning
    >
      {/* Block geometric background in hero only */}
      <div className="absolute inset-0 bg-black z-0" />

      <Suspense fallback={<div className="absolute inset-0 z-10 bg-neutral-900" />}>
        <HeroImages
          topImage="/assets/top-hero.webp"
          bottomImage="/assets/bottom-hero.webp"
        />
      </Suspense>

      {/* Marquee Banner (Top) */}
      <div 
        ref={marqueeRef}
        // pointer-events-none lets mouse pass through to the blob canvas
        // Moved down (pt-20 md:pt-24) to avoid overlapping header navigation
        className="absolute top-0 left-0 right-0 z-50 pointer-events-none overflow-hidden pt-20 md:pt-24 pb-5 md:pb-6 border-b border-white/10 bg-black/20 backdrop-blur-md"
      >
        <div className="flex items-center gap-8 md:gap-12 whitespace-nowrap w-max">
          <div className="flex items-center gap-8 md:gap-12 animate-scroll will-change-transform">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-8 md:gap-12 shrink-0">
                <span className="font-mono text-sm md:text-base text-white/70 uppercase tracking-wider">Cognitive Architect</span>
                <span className="text-white/20">•</span>
                <span className="font-mono text-sm md:text-base text-white/70 uppercase tracking-wider">Top 0.01%</span>
                <span className="text-white/20">•</span>
                <span className="font-mono text-sm md:text-base text-white/70 uppercase tracking-wider">Context Sovereignty</span>
                <span className="text-white/20">•</span>
                <span className="font-mono text-sm md:text-base text-white/70 uppercase tracking-wider">Framework Verification</span>
                <span className="text-white/20">•</span>
                <span className="font-mono text-sm md:text-base text-white/70 uppercase tracking-wider">Arxiv-Ready Research</span>
                <span className="text-white/20">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";