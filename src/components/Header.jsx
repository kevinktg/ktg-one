"use client";

import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Header() {
  const headerRef = useRef(null);

  useGSAP(() => {
    // --- 1. INITIAL ANIMATE IN (Existing) ---
    gsap.from(headerRef.current, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: "power4.out",
      delay: 0.5
    });
    
    // --- 2. HIDE ON SCROLL (New Logic) ---
    gsap.to(headerRef.current, {
        y: -100, // Move it up off screen
        opacity: 0,
        scrollTrigger: {
            trigger: "body", // Monitors global scroll
            start: "top 300px", // Starts fading when scroll reaches 300px down
            end: "top 100px",   // Fully hidden when scroll reaches 500px down
            scrub: 1, // Smoothly link animation to scroll position
        }
    });
    
  }, { scope: headerRef });

  return (
    <header 
      ref={headerRef}
      className="fixed top-0 left-0 w-full z-[100] px-6 py-6 md:px-12 flex justify-between items-center mix-blend-difference text-white"
    >
      {/* LOGO: Matches ktg.png style */}
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

