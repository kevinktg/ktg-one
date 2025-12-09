"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

// 1. DATA: 14 Haki Images
const hakiImages = Array.from({ length: 14 }, (_, i) => ({
  src: `/assets/art/Colours-of-Haki-${i + 1}.webp`, 
  title: `Synthesia_0${i + 1}`
}));

export function GalleryFormation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!gridRef.current) return;

    const items = gsap.utils.toArray(gridRef.current.children);

    // Start with items visible but slightly offset (less dramatic)
    gsap.set(items, {
        x: () => Math.random() * 100 - 50, 
        y: () => Math.random() * 100 - 50, 
        opacity: 0.3,
        scale: 0.9
    });

    // Quick formation animation - shorter scroll distance
    gsap.to(items, {
        x: 0, 
        y: 0, 
        opacity: 1, 
        scale: 1,
        stagger: {
            amount: 0.8, // Much faster
            from: "start",
            grid: "auto"
        },
        duration: 1,
        ease: "power2.out", 
        scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%", // Start when section is 80% down viewport
            end: "top 20%", // End much sooner
            scrub: 0.5, // Faster scrub
            pin: false, // No pinning - just animate on scroll
        }
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative h-screen bg-black text-white overflow-hidden z-30">
      
      {/* NO TEXT OVERLAY - JUST ART */}

      <div className="relative h-full w-full">
        
        {/* THE GRID: Full Screen */}
        <div 
            ref={gridRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-2 w-screen h-screen p-2"
            style={{ perspective: "1000px" }} 
        >
            {hakiImages.map((item, index) => (
                <div 
                    key={index} 
                    className="relative aspect-[4/3] w-full h-full bg-[#111] overflow-hidden group"
                >
                    <Image
                        src={item.src}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                        sizes="(max-width: 768px) 50vw, 25vw"
                    />
                </div>
            ))}
        </div>

      </div>
    </section>
  );
}