"use client";

import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function Header() {
  const headerRef = useRef(null);
  const lastScrollY = useRef(0);

  useGSAP(() => {
    if (!headerRef.current) return;

    // Initial fade in
    gsap.from(headerRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.6,
      ease: "power2.out",
    });

    // Scroll-based show/hide (Graphite-style) - hide on scroll down, show on scroll up
    let scrollTrigger = ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "max",
      onUpdate: (self) => {
        const currentScrollY = self.scroll();
        
        if (currentScrollY < 100) {
          // Always show near top
          gsap.to(headerRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        } else if (currentScrollY > lastScrollY.current) {
          // Scrolling down - hide
          gsap.to(headerRef.current, {
            y: -100,
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        } else {
          // Scrolling up - show
          gsap.to(headerRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        }
        
        lastScrollY.current = currentScrollY;
      },
    });

    return () => {
      if (scrollTrigger) scrollTrigger.kill();
    };
  }, { scope: headerRef });

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 w-full z-[100] pointer-events-none"
      suppressHydrationWarning
    >
      {/* Minimal logo - top left corner */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 md:top-8 md:left-8 pointer-events-auto group"
        suppressHydrationWarning
      >
        <span className="font-syne text-lg md:text-xl font-bold lowercase text-foreground/80 group-hover:text-foreground transition-colors duration-200">
          ktg
        </span>
      </Link>

      {/* Optional: Minimal nav - only show when needed */}
      {/* Uncomment when you add more pages */}
      {/*
      <nav className="absolute top-6 right-6 md:top-8 md:right-8 pointer-events-auto flex items-center gap-4">
        <Link
          href="/blog"
          className="font-mono text-xs text-foreground/50 hover:text-foreground/80 transition-colors duration-200 uppercase tracking-wider"
        >
          Blog
        </Link>
      </nav>
      */}
    </header>
  );
}

