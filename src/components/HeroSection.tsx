"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Initial entrance animation
    gsap.from(titleRef.current, {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: "power4.out",
    });

    gsap.from(subtitleRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      delay: 0.3,
      ease: "power4.out",
    });

    gsap.from(imageRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 1.2,
      delay: 0.5,
      ease: "power4.out",
    });

    // Parallax scroll effect
    gsap.to(heroRef.current, {
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
      opacity: 0.3,
      y: -200,
    });

    gsap.to(imageRef.current, {
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
      y: -100,
      rotation: 10,
    });
  }, { scope: heroRef });

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      {/* Large geometric accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-4 border-white opacity-5 rotate-45" />
      
      <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Text content */}
        <div className="space-y-6">
          <h1 ref={titleRef} className="tracking-tight">
            <span className="block">top 0.1%</span>
            <span className="block mt-2 text-white/80">prompt</span>
            <span className="block mt-2">engineer</span>
          </h1>
          
          <p ref={subtitleRef} className="monospace text-xl md:text-2xl text-white/70 tracking-wide">
            context continuation solve.<br />
            frameworks. arxiv-ready papers.
          </p>

          <div className="pt-8 flex gap-4">
            <div className="w-20 h-1 bg-white" />
            <div className="w-12 h-1 bg-white/50" />
            <div className="w-8 h-1 bg-white/30" />
          </div>
        </div>

        {/* Profile image */}
        <div ref={imageRef} className="flex justify-center md:justify-end">
          <div className="relative">
            {/* Geometric frame */}
            <div className="absolute -inset-8 border-2 border-white/20 rotate-6" />
            <div className="absolute -inset-12 border border-white/10 -rotate-3" />
            
            <div className="relative w-80 h-80 md:w-96 md:h-96">
              <Image 
                src="/assets/7d041e6f392514bea854c5ccc9f806bf8656635e.png" 
                alt="Profile" 
                width={384}
                height={384}
                className="w-full h-full object-contain filter brightness-110 contrast-125"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

