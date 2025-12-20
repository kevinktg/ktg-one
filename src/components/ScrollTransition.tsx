"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import Image from "next/image";
import { useEffect, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

// 14 Haki Images
const hakiImages = Array.from({ length: 14 }, (_, i) => ({
  src: `/assets/art/Colours-of-Haki-${i + 1}.webp`,
  title: `Synthesia_0${i + 1}`
}));

export function GalleryFormation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Simple fade-in effect without complex animations
  useGSAP(() => {
    if (!gridRef.current || !isVisible) return;

    const items = gsap.utils.toArray(gridRef.current.children);

    gsap.fromTo(items, 
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power2.out"
      }
    );

  }, { scope: containerRef, dependencies: [isVisible] });

  // Observer to detect when the section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only trigger once
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen bg-black text-white overflow-hidden z-30 py-20">

      <div className="relative w-full flex items-center justify-center">

        {/* THE GRID: 3 Columns (Portrait Mode) */}
        <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-5xl px-4 md:px-8"
        >
            {hakiImages.map((item, index) => (
                <div
                    key={index}
                    className={`relative aspect-[3/4] w-full bg-[#111] overflow-hidden border border-white/10 group rounded-sm ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`}
                >
                    <Image
                        src={item.src}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        loading="lazy"
                    />

                    {/* Minimal Hover Label */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                        <span className="font-mono text-[8px] sm:text-[10px] tracking-widest uppercase bg-black/80 text-white px-1.5 py-0.5">
                            {item.title}
                        </span>
                    </div>
                </div>
            ))}
        </div>

      </div>
    </section>
  );
}