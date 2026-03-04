"use client";

import { useRef, useMemo } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * SectionTransition - Reusable wipe transition between sections
 * @param {string} sessionKey - Key for sessionStorage animation tracking
 * @param {string} panelColor - Color of the wipe panel ("black" or "white")
 * @param {string} zIndex - Tailwind z-index class (e.g. "z-20", "z-35")
 * @param {string} topGradientFrom - Top gradient start color
 * @param {string} bottomGradientFrom - Bottom gradient start color
 */
export function SectionTransition({
  sessionKey,
  panelColor = "black",
  zIndex = "z-20",
  topGradientFrom = "from-black",
  bottomGradientFrom = "from-black",
}) {
  const containerRef = useRef(null);
  const wipeRef = useRef(null);
  const gridRevealRef = useRef(null);

  const hasPlayed = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(sessionKey) === 'true';
  }, [sessionKey]);

  useGSAP(() => {
    if (!containerRef.current) return;

    if (hasPlayed) {
      if (wipeRef.current) {
        gsap.set(wipeRef.current, { clipPath: 'inset(100% 0 0 0)' });
      }
      if (gridRevealRef.current) {
        gsap.set(gridRevealRef.current, { opacity: 1 });
      }
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 0.8,
        onLeave: () => {
          sessionStorage.setItem(sessionKey, 'true');
        },
      },
    });

    tl.fromTo(
      wipeRef.current,
      { clipPath: 'inset(0 0 0 0)' },
      { clipPath: 'inset(100% 0 0 0)', ease: 'power2.inOut' },
      0
    );

    tl.fromTo(
      gridRevealRef.current,
      { opacity: 0 },
      { opacity: 1, ease: 'power1.in' },
      0.2
    );

  }, { scope: containerRef });

  const panelBg = panelColor === "white" ? "bg-white" : "bg-black";
  const gradientClass = panelColor === "white"
    ? "bg-linear-to-b from-white via-white to-transparent"
    : "bg-gradient-to-b from-black via-black to-transparent";

  return (
    <div
      ref={containerRef}
      className={`relative h-[60vh] w-full overflow-hidden ${zIndex}`}
      style={{ contain: 'layout paint' }}
    >
      <div
        ref={gridRevealRef}
        className="absolute inset-0 pointer-events-none opacity-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />

      <div
        ref={wipeRef}
        className={`absolute inset-0 ${panelBg}`}
        style={{
          clipPath: 'inset(0 0 0 0)',
          willChange: 'clip-path',
        }}
        aria-hidden="true"
      >
        <div className={`absolute inset-0 ${gradientClass}`} />
      </div>

      <div
        className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${topGradientFrom} to-transparent pointer-events-none z-10`}
        aria-hidden="true"
      />

      <div
        className={`absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t ${bottomGradientFrom} to-transparent pointer-events-none z-10`}
        aria-hidden="true"
      />
    </div>
  );
}
