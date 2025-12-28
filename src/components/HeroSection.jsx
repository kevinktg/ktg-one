"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef, forwardRef, useState, useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

export const HeroSection = forwardRef((props, ref) => {
  const heroRef = useRef(null);
  const internalRef = ref || heroRef;
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const imageRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useGSAP(() => {
    // 1. INTERACTIVE FLOATING SHAPES - Follow mouse with parallax
    gsap.to(".hero-shape-1", {
      x: () => mousePos.x * 20,
      y: () => mousePos.y * 20,
      rotation: "random(-5, 5)",
      duration: "random(3, 6)",
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    gsap.to(".hero-shape-2", {
      x: () => mousePos.x * -30,
      y: () => mousePos.y * 15,
      rotation: "random(-5, 5)",
      duration: "random(3, 6)",
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    gsap.to(".hero-shape-3", {
      x: () => mousePos.x * 15,
      y: () => mousePos.y * -25,
      rotation: "random(-5, 5)",
      duration: "random(3, 6)",
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    gsap.to(".hero-shape-4", {
      x: () => mousePos.x * -25,
      y: () => mousePos.y * 20,
      rotation: "random(-5, 5)",
      duration: "random(3, 6)",
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    // 2. ENTRANCE ANIMATION
    const tl = gsap.timeline();

    if (titleRef.current) {
      tl.from(titleRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    }

    if (subtitleRef.current) {
      tl.from(subtitleRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      }, "-=0.4");
    }

    if (imageRef.current) {
      tl.from(imageRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      }, "-=0.4");
    }

    // 3. SCROLL TRANSITION TO EXPERTISE SECTION
    // Fade out completely as you scroll toward expertise (white)
    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom 20%", // Fade out early to let white section show
        scrub: true,
      }
    });

    tl2.to(heroRef.current, {
      opacity: 0,
      scale: 1.3,
      y: -80,
      ease: "power2.inOut"
    });

  }, { scope: heroRef });

  return (
    <section ref={internalRef} className="hero relative min-h-screen flex items-center justify-center px-6 overflow-hidden z-20 bg-black">

      {/* Brand Logo - Top Left */}
      <div className="absolute top-8 left-6 md:left-12 z-20">
        <svg className="w-16 h-16 md:w-20 md:h-20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="50" y="70" textAnchor="middle" fontSize="28" fontWeight="bold" fill="white" fontFamily="sans-serif">
            ktg
          </text>
        </svg>
      </div>

      {/* Interactive Floating Background Shapes - White on Black */}
      <div className="absolute inset-0 pointer-events-none" style={{ contain: "strict" }}>
         <div className="hero-shape-1 absolute top-20 right-20 w-64 h-64 border-2 border-white/20 rotate-45" />
         <div className="hero-shape-2 absolute top-1/4 left-10 w-48 h-48 border-2 border-white/10" />
         <div className="hero-shape-3 absolute bottom-1/4 right-1/3 w-96 h-96 border-2 border-white/20 rounded-full" />
         <div className="hero-shape-4 absolute bottom-20 left-20 w-56 h-56 border-2 border-white/10 rotate-12" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Text content */}
        <div className="hero__title-wrapper space-y-6">
          <h1 ref={titleRef} className="hero__title tracking-tight font-syne font-bold text-5xl md:text-7xl lg:text-8xl lowercase text-white">
            <span className="block">top 0.01%</span>
            <span className="block mt-2 text-white/80">prompt</span>
            <span className="block mt-2">engineer</span>
          </h1>

          <p ref={subtitleRef} className="monospace text-xl md:text-2xl text-white/70 tracking-wide font-light">
            context continuation solve.<br />
            frameworks. arxiv-ready papers.
          </p>

          <div className="pt-8 flex gap-4 opacity-50">
            <div className="w-20 h-1 bg-white" />
            <div className="w-12 h-1 bg-white/50" />
            <div className="w-8 h-1 bg-white/30" />
          </div>
        </div>

        {/* Profile image */}
        <div ref={imageRef} className="flex justify-center md:justify-end">
          <div className="relative" style={{ contain: "layout paint" }}>
            <div className="absolute -inset-8 border-2 border-white/20 rotate-6" style={{ position: "absolute" }} />
            <div className="absolute -inset-12 border border-white/10 -rotate-3" style={{ position: "absolute" }} />

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
