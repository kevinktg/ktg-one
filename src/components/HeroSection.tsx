"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef, forwardRef } from "react";
import { SplitText } from "./SplitText";

gsap.registerPlugin(ScrollTrigger);

export const HeroSection = forwardRef<HTMLDivElement>((props, ref) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const internalRef = ref || heroRef;
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Simple fade-in animation instead of complex GSAP timeline
    const tl = gsap.timeline();
    
    // Animate Title Words - Faster
    const titleWords = titleRef.current?.querySelectorAll(".split-word");
    if (titleWords?.length) {
        tl.from(titleWords, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
        });
    }
    
    // Animate Subtitle Words - Faster
    const subtitleWords = subtitleRef.current?.querySelectorAll(".split-word");
    if (subtitleWords?.length) {
      tl.from(subtitleWords, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.03,
        ease: "power2.out",
      }, "-=0.4");
    }

    // Animate Image - Faster
    if (imageRef.current) {
        tl.from(imageRef.current, {
          scale: 0.9,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        }, "-=0.6");
    }

  }, { scope: heroRef });

  return (
    <section ref={internalRef} className="hero relative min-h-screen flex items-center justify-center px-6 overflow-hidden z-20 bg-black">
      
      <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Text content */}
        <div className="hero__title-wrapper space-y-6">
          <h1 ref={titleRef} className="hero__title tracking-tight font-syne font-bold text-5xl md:text-7xl lg:text-8xl lowercase">
            <span className="block"><SplitText>top 0.01%</SplitText></span>
            <span className="block mt-2 text-white/80"><SplitText>prompt</SplitText></span>
            <span className="block mt-2"><SplitText>engineer</SplitText></span>
          </h1>
          
          <p ref={subtitleRef} className="monospace text-xl md:text-2xl text-white/70 tracking-wide font-light">
            <SplitText>context continuation solve.</SplitText><br />
            <SplitText>frameworks. arxiv-ready papers.</SplitText>
          </p>

          <div className="pt-8 flex gap-4 opacity-50">
            <div className="w-20 h-1 bg-white" />
            <div className="w-12 h-1 bg-white/50" />
            <div className="w-8 h-1 bg-white/30" />
          </div>
        </div>

        {/* Profile image */}
        <div ref={imageRef} className="flex justify-center md:justify-end">
          <div className="relative">
            {/* FIX: Ensure these lines are complete single lines */}
            <div className="absolute -inset-8 border-2 border-white/20 rotate-6" />
            <div className="absolute -inset-12 border border-white/10 -rotate-3" />
            
            <div className="relative w-80 h-80 md:w-96 md:h-96">
              <Image
                src="/assets/ktg.svg"
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
});

HeroSection.displayName = "HeroSection";