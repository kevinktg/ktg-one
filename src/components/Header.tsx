"use client";

import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function Header() {
  const headerRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(headerRef.current, 
      { opacity: 0, y: -20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        scrollTrigger: {
          trigger: ".hero",
          start: "bottom top", // When hero bottom hits top of viewport
          toggleActions: "play none none reverse",
        }
      }
    );
  }, { scope: headerRef });

  return (
    <header ref={headerRef} className="fixed top-0 left-0 w-full z-50 mix-blend-difference opacity-0">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        {/* Logo - Typography using Syne */}
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <span className="font-syne text-2xl md:text-3xl font-bold tracking-tight lowercase">
            ktg
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/blog"
            className="font-mono text-sm hover:opacity-80 transition-opacity lowercase"
          >
            blog
          </Link>
        </nav>
      </div>
    </header>
  );
}

