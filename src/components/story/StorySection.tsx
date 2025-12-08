"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

interface StorySectionProps {
  children: ReactNode;
  scrollDuration?: number; // Duration in pixels for this section
  pin?: boolean; // Whether to pin this section
  className?: string;
  id?: string;
}

export default function StorySection({
  children,
  scrollDuration = 2000,
  pin = false,
  className = "",
  id,
}: StorySectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (pin && containerRef.current) {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${scrollDuration}`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        anticipatePin: 1,
      });
    }

    // Animate children with reveal-scroll class
    const revealElements = gsap.utils.toArray<HTMLElement>(
      containerRef.current?.querySelectorAll(".reveal-scroll") || []
    );

    revealElements.forEach((element) => {
      gsap.fromTo(
        element,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            end: "top 50%",
            scrub: pin ? 1 : false,
            toggleActions: pin ? "play none none reverse" : "play none none reverse",
          },
          duration: pin ? 1.5 : 1.2,
          ease: "power2.out",
        }
      );
    });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id={id}
      className={`story-section ${className}`}
      style={pin ? { minHeight: `${scrollDuration}px` } : undefined}
    >
      {children}
    </section>
  );
}

