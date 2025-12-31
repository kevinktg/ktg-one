"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, forwardRef } from "react";

export const HeroSection = forwardRef((props, ref) => {
  const heroRef = useRef(null);
  const internalRef = ref || heroRef;
  const titleRef = useRef(null);

  useGSAP(() => {
    // Check if animation has already played this session
    const hasPlayed = sessionStorage.getItem('hero-animated') === 'true';

    // Subtle fade in for banner
    if (!hasPlayed) {
      if (titleRef.current) {
        gsap.from(titleRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => {
            sessionStorage.setItem('hero-animated', 'true');
          }
        });
      }
    } else {
      // If already played, set final state immediately
      if (titleRef.current) gsap.set(titleRef.current, { opacity: 1 });
    }

  }, { scope: heroRef });

  return (
    <section ref={internalRef} className="hero relative min-h-screen flex items-center justify-center px-6 overflow-hidden z-20 bg-background">

      {/* Layer 1: Clean background */}
      <div className="absolute inset-0 z-10 bg-background">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:20px_20px] opacity-30"></div>
      </div>

      {/* Scrolling word banner at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-40 overflow-hidden py-5 md:py-6 border-t border-border bg-background/50 backdrop-blur-sm">
        <div className="flex items-center gap-8 md:gap-12 whitespace-nowrap">
          {/* Scrolling text wrapper */}
          <div ref={titleRef} className="flex items-center gap-8 md:gap-12 animate-scroll">
            {/* Repeat the text for seamless scroll */}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-8 md:gap-12">
                <span className="font-mono text-xs md:text-sm text-muted-foreground uppercase tracking-wider">Top 0.01%</span>
                <span className="text-muted-foreground/30">•</span>
                <span className="font-mono text-xs md:text-sm text-muted-foreground uppercase tracking-wider">Prompt Engineer</span>
                <span className="text-muted-foreground/30">•</span>
                <span className="font-mono text-xs md:text-sm text-muted-foreground uppercase tracking-wider">Context Continuation</span>
                <span className="text-muted-foreground/30">•</span>
                <span className="font-mono text-xs md:text-sm text-muted-foreground uppercase tracking-wider">Frameworks</span>
                <span className="text-muted-foreground/30">•</span>
                <span className="font-mono text-xs md:text-sm text-muted-foreground uppercase tracking-wider">Arxiv-Ready Research</span>
              </div>
            ))}
          </div>
          {/* Duplicate for seamless loop */}
          <div className="flex items-center gap-8 md:gap-12 animate-scroll">
            {[...Array(3)].map((_, i) => (
              <div key={`dup-${i}`} className="flex items-center gap-8 md:gap-12">
                <span className="font-mono text-xs md:text-sm text-muted-foreground uppercase tracking-wider">Top 0.01%</span>
                <span className="text-muted-foreground/30">•</span>
                <span className="font-mono text-xs md:text-sm text-muted-foreground uppercase tracking-wider">Prompt Engineer</span>
                <span className="text-muted-foreground/30">•</span>
                <span className="font-mono text-xs md:text-sm text-muted-foreground uppercase tracking-wider">Context Continuation</span>
                <span className="text-muted-foreground/30">•</span>
                <span className="font-mono text-xs md:text-sm text-muted-foreground uppercase tracking-wider">Frameworks</span>
                <span className="text-muted-foreground/30">•</span>
                <span className="font-mono text-xs md:text-sm text-muted-foreground uppercase tracking-wider">Arxiv-Ready Research</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";
