"use client";

import { ReactLenis as Lenis } from "lenis/react";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function ReactLenis({
  root,
  options,
  children,
  ...props
}) {
  const lenisRef = useRef(null);

  useEffect(() => {
    // 1. THE BRIDGE: Sync Lenis with GSAP's internal clock (Ticker)
    // Why? GSAP updates animations on every frame. Lenis updates scroll on every frame.
    // If they aren't synced, your scroll-based animations will jitter or lag.
    function update(time) {
      // "raf" stands for Request Animation Frame. 
      // We manually tell Lenis to update exactly when GSAP updates.
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    // 2. CONNECT: Add our update function to GSAP's ticker
    // This ensures Lenis moves the page *before* GSAP calculates ScrollTrigger positions.
    gsap.ticker.add(update);

    // 3. EXPOSE LENIS INSTANCE: Make it available globally for skip button
    // Use a small delay to ensure lenis instance is ready
    const exposeLenis = () => {
      if (lenisRef.current?.lenis) {
        window.lenis = lenisRef.current.lenis;
      }
    };
    
    // Try immediately and also after a short delay
    exposeLenis();
    const timeoutId = setTimeout(exposeLenis, 100);

    // 4. CLEANUP: Remove the listener when component unmounts
    return () => {
      clearTimeout(timeoutId);
      gsap.ticker.remove(update);
      if (window.lenis === lenisRef.current?.lenis) {
        delete window.lenis;
      }
    };
  }, []);

  return (
    <Lenis
      ref={lenisRef}
      root={root}
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        ...options,
      }}
      {...props}
    >
      {children}
    </Lenis>
  );
}

