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

    // Initial animate in - Run once on mount
    gsap.from(headerRef.current, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: "power4.out",
      delay: 0.5,
      onComplete: () => {
        sessionStorage.setItem('header-animated', 'true');
      }
    });
    
    // Removed scroll hide - header stays visible throughout session
    
  }, { scope: headerRef });

  return (
    <header 
      ref={headerRef}
      className="fixed top-0 left-0 w-full z-[100] px-6 py-6 md:px-12 flex justify-between items-center mix-blend-difference text-white"
    >
      {/* LOGO: ktg brand text */}
      <Link href="/" className="group">
        <span className="font-syne font-bold text-4xl md:text-5xl lowercase tracking-tighter leading-none group-hover:opacity-70 transition-opacity">
          ktg.
        </span>
      </Link>

      {/* NAV: Mono (The Terminal/Tech) */}
      <nav className="flex items-center gap-8">
        <Link href="/blog" className="group flex items-center gap-2">
          {/* Animated dot on hover */}
          <span className="w-1.5 h-1.5 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
          <span className="font-mono text-xs md:text-sm uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">
            blog
          </span>
        </Link>
      </nav>
    </header>
  );
}

