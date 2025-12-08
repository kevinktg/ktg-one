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

    // 1. Set Initial "Floating" State
    gsap.set(items, {
        x: () => Math.random() * 2000 - 1000, 
        y: () => Math.random() * 1500 - 750, 
        z: () => Math.random() * 500 - 250,
        rotation: () => Math.random() * 45 - 22.5,
        opacity: 0,
        scale: 0.5
    });

    // 2. The Formation Animation
    gsap.to(items, {
        x: 0, 
        y: 0, 
        z: 0,
        rotation: 0, 
        opacity: 1, 
        scale: 1,
        stagger: {
            amount: 1.5,
            from: "random",
            grid: "auto"
        },
        duration: 2,
        ease: "expo.out", 
        scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=2500", 
            pin: true,
            scrub: 1,
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