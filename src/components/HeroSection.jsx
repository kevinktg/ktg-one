"use client";

import { useRef, forwardRef, lazy, Suspense, useEffect } from "react";
import { SkipButton } from "@/components/SkipButton";

// Lazy load Three.js component
const HeroImages = lazy(() => import("@/components/HeroImages").then(mod => ({ default: mod.HeroImages })));

export const HeroSection = forwardRef((props, ref) => {
  const heroRef = useRef(null);
  const internalRef = ref || heroRef;

  // AUTO-SKIP INTRO LOGIC
  useEffect(() => {
      // Check if this is a return visit in the same session
      const hasSeenIntro = sessionStorage.getItem('intro-completed') === 'true';

      if (hasSeenIntro) {
          // Attempt to find the target section (prioritize blog, fallback to main content)
          const targetSection = document.getElementById('blog-section') || document.getElementById('main-content');

          if (targetSection) {
              // Use Lenis for immediate scroll if available, otherwise native
              // Add a delay to ensure layout/pinning (GSAP ScrollTrigger) is fully calculated
              setTimeout(() => {
                  if (window.lenis) {
                      window.lenis.scrollTo(targetSection, { immediate: true });
                  } else {
                      targetSection.scrollIntoView({ behavior: "auto" });
                  }
              }, 500);
          }
      } else {
          // Mark intro as completed once the user scrolls past the hero
          // We can use a simple timeout or scroll listener, but setting it on unmount or specific interaction is safer.
          // For now, let's set it when they click "Skip" (handled in SkipButton) OR when they scroll substantially.
          const handleScroll = () => {
              if (window.scrollY > window.innerHeight * 0.5) {
                  sessionStorage.setItem('intro-completed', 'true');
                  window.removeEventListener('scroll', handleScroll);
              }
          };
          window.addEventListener('scroll', handleScroll);
          return () => window.removeEventListener('scroll', handleScroll);
      }
  }, []);

  return (
    <section
      ref={internalRef}
      data-cursor-zone="hero"
      className="relative w-full min-h-screen flex items-center justify-center px-6 overflow-hidden z-10"
      style={{ background: 'transparent' }}
      suppressHydrationWarning
    >
      {/* Transparent background to show geometric background through */}
      <div className="absolute inset-0 bg-transparent z-0" style={{ top: '-1px', left: 0 }} />

      <Suspense fallback={<div className="absolute inset-0 z-10 bg-neutral-900" />}>
        <HeroImages
          topImage="/assets/top-hero.webp"
          bottomImage="/assets/bottom-hero.webp"
        />
      </Suspense>

      {/* Skip Button */}
      <SkipButton />
    </section>
  );
});

HeroSection.displayName = "HeroSection";