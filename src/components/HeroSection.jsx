"use client";

import { useRef, forwardRef, lazy, Suspense } from "react";

// Lazy load Three.js component
const HeroImages = lazy(() => import("@/components/HeroImages").then(mod => ({ default: mod.HeroImages })));

export const HeroSection = forwardRef((props, ref) => {
  const heroRef = useRef(null);
  const internalRef = ref || heroRef;

  return (
    <section
      ref={internalRef}
      data-cursor-zone="hero"
      className="relative w-full min-h-screen flex items-center justify-center px-6 overflow-hidden"
      style={{ background: 'transparent' }}
      suppressHydrationWarning
    >
      {/* Block geometric background in hero only */}
      <div className="absolute inset-0 bg-black z-0" style={{ top: '-1px', left: 0 }} />

      <Suspense fallback={<div className="absolute inset-0 z-10 bg-neutral-900" />}>
        <HeroImages
          topImage="/assets/top-hero.webp"
          bottomImage="/assets/bottom-hero.webp"
        />
      </Suspense>
    </section>
  );
});

HeroSection.displayName = "HeroSection";