"use client";

import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface IntroProps {
  onComplete: () => void;
}

export function Intro({ onComplete }: IntroProps) {
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !shapesRef.current) return;

      gsap.registerPlugin(ScrollTrigger);

      // Create a ScrollTrigger that pins the intro section
      const scrollTrigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=2000", // Pin for 2000px of scroll
        pin: true,
        scrub: 1,
        onLeave: () => {
          setIsVisible(false);
          setTimeout(onComplete, 300);
        },
        onLeaveBack: () => {
          setIsVisible(true);
        },
      });

      const tl = gsap.timeline({
        scrollTrigger: scrollTrigger,
      });

      // Animate shapes coming in
      const shapes = shapesRef.current.children;
      
      // Circles - scale and rotate in
      gsap.from(".intro-circle", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=500",
          scrub: 1,
        },
        scale: 0,
        rotation: 180,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out",
      });

      // Squares - scale and rotate in
      gsap.from(".intro-square", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=500",
          scrub: 1,
        },
        scale: 0,
        rotation: -180,
        opacity: 0,
        stagger: 0.15,
        ease: "power2.out",
      });

      // Text animation
      tl.from(".intro-text", {
        opacity: 0,
        y: 50,
        scale: 0.8,
        duration: 0.8,
        ease: "power3.out",
      })
        // Hold text visible
        .to(".intro-text", {
          duration: 0.5,
        })
        // Fade out text
        .to(".intro-text", {
          opacity: 0,
          y: -30,
          scale: 1.1,
          duration: 0.6,
          ease: "power3.in",
        })
        // Fade out shapes
        .to(".intro-shape", {
          opacity: 0,
          scale: 1.2,
          rotation: "+=90",
          duration: 0.8,
          stagger: 0.05,
          ease: "power2.in",
        })
        // Fade out container
        .to(containerRef.current, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
        });

      return () => {
        scrollTrigger.kill();
        tl.kill();
      };
    },
    { scope: containerRef, dependencies: [] }
  );

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
    >
      {/* Geometric Shapes */}
      <div ref={shapesRef} className="absolute inset-0 pointer-events-none">
        {/* Circles */}
        <div className="intro-shape intro-circle absolute top-20 right-20 w-32 h-32 md:w-64 md:h-64 border-2 border-white opacity-20 rounded-full" />
        <div className="intro-shape intro-circle absolute top-1/4 left-10 w-24 h-24 md:w-48 md:h-48 border-2 border-white opacity-15 rounded-full" />
        <div className="intro-shape intro-circle absolute bottom-1/4 right-1/3 w-40 h-40 md:w-96 md:h-96 border-2 border-white opacity-20 rounded-full" />
        <div className="intro-shape intro-circle absolute bottom-20 left-20 w-28 h-28 md:w-56 md:h-56 border-2 border-white opacity-15 rounded-full" />
        <div className="intro-shape intro-circle absolute top-1/3 right-1/4 w-36 h-36 md:w-72 md:h-72 border border-white opacity-10 rounded-full" />
        <div className="intro-shape intro-circle absolute bottom-1/3 left-1/3 w-20 h-20 md:w-40 md:h-40 border-2 border-white opacity-12 rounded-full" />
        
        {/* Squares */}
        <div className="intro-shape intro-square absolute top-1/2 left-1/4 w-24 h-24 md:w-48 md:h-48 border-2 border-white opacity-18 rotate-45" />
        <div className="intro-shape intro-square absolute top-2/3 right-1/3 w-20 h-20 md:w-40 md:h-40 border-2 border-white opacity-15 rotate-12" />
        <div className="intro-shape intro-square absolute bottom-1/4 left-1/2 w-16 h-16 md:w-32 md:h-32 border-2 border-white opacity-12 -rotate-45" />
        <div className="intro-shape intro-square absolute top-10 right-1/2 w-28 h-28 md:w-56 md:h-56 border-2 border-white opacity-16 rotate-12" />
      </div>

      {/* Text */}
      <div className="intro-text text-center relative z-10">
        <h1 className="font-syne text-4xl md:text-6xl font-bold tracking-tight text-white">
          Go
        </h1>
      </div>
    </div>
  );
}

