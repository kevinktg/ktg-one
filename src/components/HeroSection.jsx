"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef, forwardRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export const HeroSection = forwardRef((props, ref) => {
  const heroRef = useRef(null);
  const internalRef = ref || heroRef;
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const imageRef = useRef(null);
  const maskRef = useRef(null);

  useGSAP(() => {
    // 1. INTERACTIVE FLOATING SHAPES - Follow mouse with parallax using quickSetter
    const shapes = [
      { el: '.hero-shape-1', speedX: 20, speedY: 20 },
      { el: '.hero-shape-2', speedX: -30, speedY: 15 },
      { el: '.hero-shape-3', speedX: 15, speedY: -25 },
      { el: '.hero-shape-4', speedX: -25, speedY: 20 },
    ];

    // Create quickSetters for performance
    const setters = shapes.map(({ el, speedX, speedY }) => {
      const element = document.querySelector(el);
      if (!element) return null;
      return {
        x: gsap.quickSetter(element, 'x', 'px'),
        y: gsap.quickSetter(element, 'y', 'px'),
        speedX,
        speedY
      };
    }).filter(Boolean);

    // Animate on mouse move (outside GSAP context)
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      setters.forEach(({ x: setX, y: setY, speedX, speedY }) => {
        setX(x * speedX);
        setY(y * speedY);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };

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
    // Fade out later to let expertise shutter animation play out fully
    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top 10%",
        end: "bottom 10%", // Fade out over last 90% of hero section
        scrub: true,
      }
    });

    tl2.to(heroRef.current, {
      opacity: 0,
      scale: 1.2,
      y: -60,
      ease: "power2.inOut"
    });

  }, { scope: heroRef });

  return (
    <section ref={internalRef} className="hero relative min-h-screen flex items-center justify-center px-6 overflow-hidden z-20 bg-black">

      {/* Layer 1: Revealed Background (shown when logo is wiped away) */}
      <div className="absolute inset-0 z-10">
        <div className="cyberpunk-background" />
        <Image
          src="/assets/profile.svg"
          alt="cyberpunk avatar"
          width={400}
          height={400}
          className="avatar-revealed"
          priority
        />
      </div>

      {/* Keep existing geometric shapes */}
      <div className="absolute inset-0 pointer-events-none" style={{ contain: "strict" }}>
        <div className="hero-shape-1 absolute top-20 right-20 w-64 h-64 border-2 border-white/20 rotate-45" />
        <div className="hero-shape-2 absolute top-1/4 left-10 w-48 h-48 border-2 border-white/10" />
        <div className="hero-shape-3 absolute bottom-1/4 right-1/3 w-96 h-96 border-2 border-white/20 rounded-full" />
        <div className="hero-shape-4 absolute bottom-20 left-20 w-56 h-56 border-2 border-white/10 rotate-12" />
      </div>

      {/* Layer 4: Text content (keep existing) */}
      <div className="relative z-40 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
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

        {/* Layer 2: Logo Mask (will be clipped by blob cursor) */}
        <div ref={maskRef} className="absolute inset-0 z-30 flex items-center justify-center">
          <Image
            src="/assets/ktg.svg"
            alt="ktg logo"
            width={800}
            height={800}
            className="w-auto h-[80vh] object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";
