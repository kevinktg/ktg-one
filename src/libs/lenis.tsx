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
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

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

