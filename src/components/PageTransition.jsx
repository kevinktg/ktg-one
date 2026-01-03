"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import { useRef, useEffect } from "react";

export function PageTransition({ children }) {
  const containerRef = useRef(null);
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip animation on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevPathnameRef.current = pathname;
      return;
    }

    // Only animate if pathname actually changed
    if (prevPathnameRef.current === pathname) return;

    if (!containerRef.current) return;

    // Page transition: fade out → route changes → fade in
    const tl = gsap.timeline();

    // Fade out current page
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
    })
      // Fade in new page (route change happens between these)
      .to(containerRef.current, {
        opacity: 1,
        duration: 0.35,
        ease: "power2.out",
      });

    prevPathnameRef.current = pathname;
  }, [pathname]);

  useGSAP(() => {
    // Set initial opacity
    if (containerRef.current) {
      gsap.set(containerRef.current, { opacity: 1 });
    }
  }, { scope: containerRef });

  return (
    <div ref={containerRef} style={{ opacity: 1, willChange: 'opacity' }}>
      {children}
    </div>
  );
}

