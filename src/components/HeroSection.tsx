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
    // 1. FLOATING SHAPES ANIMATION (Matches NarrativeIntro)
    gsap.to(".hero-shape", {
        y: "random(-20, 20)",
        x: "random(-10, 10)",
        rotation: "random(-5, 5)",
        duration: "random(3, 6)",
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.1
    });

    // 2. ENTRANCE ANIMATION (Text & Image)
    const tl = gsap.timeline();
    
    // Animate Title Words
    const titleWords = titleRef.current?.querySelectorAll(".split-word");
    if (titleWords?.length) {
        tl.from(titleWords, {
          y: 80,
          opacity: 0,
          duration: 1.0,
          stagger: 0.15,
          ease: "power4.out",
        });
    }
    
    // Animate Subtitle Words
    const subtitleWords = subtitleRef.current?.querySelectorAll(".split-word");
    if (subtitleWords?.length) {
      tl.from(subtitleWords, {
        y: 20,
        opacity: 0,
        duration: 1.5,
        stagger: 0.05,
        ease: "power2.out",
      }, "-=0.8");
    }

    // Animate Image
    if (imageRef.current) {
        tl.from(imageRef.current, {
          scale: 0.8,
          opacity: 0,
          duration: 1.5,
          ease: "power4.out",
        }, "-=1.0");
    }

    // 3. SCROLL EXIT ANIMATION
    gsap.to(heroRef.current, {
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
      opacity: 0,
      y: -100,
      ease: "none"
    });

    // Parallax Image Effect
    gsap.to(imageRef.current, {
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
      y: 100, 
      rotation: 5,
      ease: "none"
    });

  }, { scope: heroRef });

  return (
    <section ref={internalRef} className="hero relative min-h-screen flex items-center justify-center px-6 overflow-hidden z-20 bg-black">
      
      {/* 🌟 Floating Background Shapes */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
         <div className="hero-shape absolute top-20 right-20 w-64 h-64 border-2 border-white/20 rotate-45" />
         <div className="hero-shape absolute top-1/4 left-10 w-48 h-48 border-2 border-white/10" />
         <div className="hero-shape absolute bottom-1/4 right-1/3 w-96 h-96 border-2 border-white/20 rounded-full" />
         <div className="hero-shape absolute bottom-20 left-20 w-56 h-56 border-2 border-white/10 rotate-12" />
      </div>
      
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
});

HeroSection.displayName = "HeroSection";