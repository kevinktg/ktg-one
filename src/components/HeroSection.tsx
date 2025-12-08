"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { SplitText } from "./SplitText";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Initial entrance animation
    const tl = gsap.timeline();
    
    // Target words inside the SplitText components for Title
    const titleWords = titleRef.current?.querySelectorAll(".split-word");
    
    if (titleWords?.length) {
        tl.from(titleWords, {
          y: 80, // Increased distance for more drama
          opacity: 0,
          duration: 1.0,
          stagger: 0.15,
          ease: "power4.out",
        });
    }
    
    // Target words inside the SplitText components for Subtitle
    const subtitleWords = subtitleRef.current?.querySelectorAll(".split-word");

    if (subtitleWords?.length) {
      tl.from(subtitleWords, {
        y: 20,
        opacity: 0,
        duration: 1.5,
        stagger: 0.05, // Faster ripple effect
        ease: "power2.out",
      }, "-=0.8"); // Start sooner
    }

    if (imageRef.current) {
        tl.from(imageRef.current, {
          scale: 0.8,
          opacity: 0,
          duration: 1.5,
          ease: "power4.out",
        }, "-=1.0");
    }

    // Scroll Exit Animation
    // When user scrolls down, this section fades out gracefully
    gsap.to(heroRef.current, {
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true, // Smooth scrubbing instead of toggleActions
      },
      opacity: 0,
      y: -100,
      ease: "none" // Linear ease for scrub
    });

    // Parallax Image Effect
    gsap.to(imageRef.current, {
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
      y: 100, // Move image down slightly (parallax)
      rotation: 5,
      ease: "none"
    });

  }, { scope: heroRef });

  return (
    <section ref={heroRef} className="hero relative min-h-screen flex items-center justify-center px-6 overflow-hidden z-20">
      {/* Large geometric accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-4 border-white opacity-5 rotate-45 pointer-events-none" />
      
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
            {/* Geometric frame */}
            <div className="absolute -inset-8 border-2 border-white/20 rotate-6" />
            <div className="absolute -inset-12 border border-white/10 -rotate-3" />
            
            <div className="relative w-80 h-80 md:w-96 md:h-96">
              <Image 
                src="/assets/7d041e6f392514bea854c5ccc9f806bf8656635e.png" 
                alt="Profile" 
                width={384}
                height={384}
                className="w-full h-full object-contain filter brightness-110 contrast-125 grayscale hover:grayscale-0 transition-all duration-700"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}