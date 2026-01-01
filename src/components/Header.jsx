"use client";

import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export function Header() {
  const headerRef = useRef(null);

  useGSAP(() => {
    // Check if animation has already played this session
    const hasPlayed = sessionStorage.getItem('header-animated') === 'true';

    if (hasPlayed) {
      // Skip animation - set final state immediately (always visible, no scroll hide)
      if (headerRef.current) gsap.set(headerRef.current, { opacity: 1, y: 0 });
      return;
    }

    // Subtle fade in - Run once on mount
    gsap.from(headerRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      onComplete: () => {
        sessionStorage.setItem('header-animated', 'true');
      }
    });
    
    // Removed scroll hide - header stays visible throughout session
    
  }, { scope: headerRef });

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 w-full z-[100] px-6 md:px-8 py-4 md:py-5 flex justify-between items-center border-b border-border bg-background backdrop-blur-md"
      suppressHydrationWarning
    >
      {/* LOGO: Syne bold lowercase - proper size hierarchy */}
      <Link href="/" className="group" suppressHydrationWarning>
        <span className="font-syne text-xl md:text-2xl font-bold lowercase text-foreground group-hover:text-foreground/80 transition-colors duration-200">
          ktg
        </span>
      </Link>

      {/* NAV: Clean minimal navigation */}
      <nav className="flex items-center gap-6 md:gap-8" suppressHydrationWarning>
        <Link
          href="/blog"
          className="font-mono text-sm text-foreground/70 hover:text-foreground transition-colors duration-200 uppercase tracking-wider"
          suppressHydrationWarning
        >
          Blog
        </Link>
      </nav>
    </header>
  );
}

