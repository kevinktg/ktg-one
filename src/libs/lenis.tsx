"use client";

import { ReactLenis as Lenis } from "lenis/react";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function ReactLenis({
  root,
  options,
  children,
  ...props
}: {
  root?: boolean;
  options?: any;
  children: React.ReactNode;
  [key: string]: any;
}) {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    // 1. THE BRIDGE: Sync Lenis with GSAP's internal clock (Ticker)
    // Why? GSAP updates animations on every frame. Lenis updates scroll on every frame.
    // If they aren't synced, your scroll-based animations will jitter or lag.
    function update(time: number) {
      // "raf" stands for Request Animation Frame. 
      // We manually tell Lenis to update exactly when GSAP updates.
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    // 2. CONNECT: Add our update function to GSAP's ticker
    // This ensures Lenis moves the page *before* GSAP calculates ScrollTrigger positions.
    gsap.ticker.add(update);

    // 3. CLEANUP: Remove the listener when component unmounts
    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <Lenis
      ref={lenisRef}
      root={root}
      options={{
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
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

