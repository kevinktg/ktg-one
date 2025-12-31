"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, forwardRef } from "react";
import { HeroImages } from "@/components/HeroImages";

export const HeroSection = forwardRef((props, ref) => {
  const heroRef = useRef(null);
  const internalRef = ref || heroRef;
  const titleRef = useRef(null);

  useGSAP(() => {
    // Check if animation has already played this session
    const hasPlayed = sessionStorage.getItem('hero-animated') === 'true';

    if (!titleRef.current) return;

    // Fade in only on first load
    if (!hasPlayed) {
      gsap.from(titleRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          sessionStorage.setItem('hero-animated', 'true');
        }
      });
    } else {
      // Already played: Set opacity immediately
      gsap.set(titleRef.current, { opacity: 1 });
    }

    // Always start the infinite scroll animation
    // Move by 50% (half width) where the duplicate content starts for seamless loop
    gsap.to(titleRef.current, {
      x: "-50%",
      duration: 30,
      ease: "none",
      repeat: -1, // Infinite loop
    });

  }, { scope: heroRef });

  return (
    <section ref={internalRef} className="hero relative min-h-screen flex items-center justify-center px-6 overflow-hidden z-20" suppressHydrationWarning>

      {/* Layer 0: Pulsing Background - Your original design */}
      <div className="absolute inset-0 z-0 bg-black">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)]" style={{ backgroundSize: '14px 24px' }}></div>
        {/* Pulsing radial gradient */}
        <div className="absolute left-1/2 top-[-10%] -translate-x-1/2 h-[1000px] w-[1000px] rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,#fbfbfb36,#000)]"></div>
      </div>
      
      {/* Layer 1: Hero Images with Blob Reveal - Landon Norris Effect */}
      <HeroImages 
        topImage="/assets/top-hero.webp"
        bottomImage="/assets/btm-hero.webp"
      />

      {/* Center Content - Visible Title/Content */}
      <div className="relative z-30 text-center pointer-events-none">
        <h1 className="font-syne text-7xl md:text-9xl font-bold mb-6 lowercase text-foreground opacity-90">
          ktg
        </h1>
        <p className="font-mono text-sm md:text-base text-muted-foreground uppercase tracking-wider">
          Top 0.01% Prompt Engineer
        </p>
      </div>

      {/* Scrolling word banner at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-50 overflow-hidden py-5 md:py-6 border-t border-border bg-background/50 backdrop-blur-sm">
        <div className="flex items-center gap-8 md:gap-12 whitespace-nowrap">
          {/* Single scrolling container with duplicated content for seamless loop */}
          <div ref={titleRef} className="flex items-center gap-8 md:gap-12">
            {/* Original content */}
            <span className="font-mono text-sm md:text-base text-muted-foreground uppercase tracking-wider">Top 0.01%</span>
            <span className="text-muted-foreground/30">•</span>
            <span className="font-mono text-sm md:text-base text-muted-foreground uppercase tracking-wider">Prompt Engineer</span>
            <span className="text-muted-foreground/30">•</span>
            <span className="font-mono text-sm md:text-base text-muted-foreground uppercase tracking-wider">Context Continuation</span>
            <span className="text-muted-foreground/30">•</span>
            <span className="font-mono text-sm md:text-base text-muted-foreground uppercase tracking-wider">Frameworks</span>
            <span className="text-muted-foreground/30">•</span>
            <span className="font-mono text-sm md:text-base text-muted-foreground uppercase tracking-wider">Arxiv-Ready Research</span>
            {/* Duplicate for seamless loop */}
            <span className="font-mono text-sm md:text-base text-muted-foreground uppercase tracking-wider">Top 0.01%</span>
            <span className="text-muted-foreground/30">•</span>
            <span className="font-mono text-sm md:text-base text-muted-foreground uppercase tracking-wider">Prompt Engineer</span>
            <span className="text-muted-foreground/30">•</span>
            <span className="font-mono text-sm md:text-base text-muted-foreground uppercase tracking-wider">Context Continuation</span>
            <span className="text-muted-foreground/30">•</span>
            <span className="font-mono text-sm md:text-base text-muted-foreground uppercase tracking-wider">Frameworks</span>
            <span className="text-muted-foreground/30">•</span>
            <span className="font-mono text-sm md:text-base text-muted-foreground uppercase tracking-wider">Arxiv-Ready Research</span>
          </div>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";

