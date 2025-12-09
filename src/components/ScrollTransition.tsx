"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

// =========================================
// CONFIGURATION
// =========================================

// 1. DATA: 14 Haki Images
const hakiImages = Array.from({ length: 14 }, (_, i) => ({
  src: `/assets/art/Colours-of-Haki-${i + 1}.webp`, 
  title: `Synthesia_0${i + 1}`
}));

// 2. ANIMATION STYLE: "explorations"
// This matches the "Lennox Montgomery / Explorations" demo
type AnimationStyle = "explorations" | "scatter" | "deck";
const CURRENT_STYLE: AnimationStyle = "explorations"; 

export function GalleryFormation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!gridRef.current) return;

    const items = gsap.utils.toArray(gridRef.current.children);

    // ==================================================
    // STYLE: EXPLORATIONS
    // Behavior: Large scattered float -> Snaps to 3-column Portrait Grid
    // ==================================================
    if (CURRENT_STYLE === "explorations") {
        
        // 1. Set Initial "Floating" State (Chaos)
        gsap.set(items, {
            x: () => Math.random() * 1500 - 750, // Wide horizontal scatter
            y: () => Math.random() * 2000 - 1000, // Deep vertical scatter
            z: () => Math.random() * 500 - 250,   // Random depth
            rotation: () => Math.random() * 90 - 45, // Dramatic tilt
            opacity: 0,
            scale: 0.6
        });

        // 2. The Formation (Order)
        gsap.to(items, {
            x: 0, 
            y: 0, 
            z: 0,
            rotation: 0, 
            opacity: 1, 
            scale: 1,
            stagger: {
                amount: 1.5,
                from: "random", // They come in organically, not in order
                grid: "auto"
            },
            duration: 2,
            ease: "expo.out", // The "Snap" feel at the end
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=400", // Much shorter - 400px instead of 2500px
                pin: true,     // Pin the container so we watch them form
                scrub: 1,
            }
        });
    }

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative h-screen bg-black text-white overflow-hidden z-30">
      
      {/* Header */}
      <div className="absolute top-10 left-0 w-full text-center z-10 pointer-events-none mix-blend-difference">
        <h2 className="text-4xl md:text-6xl font-syne font-bold lowercase tracking-tighter">
          explorations
        </h2>
        <p className="font-mono text-xs opacity-50 mt-2 tracking-[0.5em] uppercase">
          Nothing left unseen
        </p>
      </div>

      <div className="relative h-full w-full flex items-center justify-center">
        
        {/* THE GRID: 3 Columns (Portrait Mode) */}
        <div 
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl px-6 md:px-12"
            style={{ perspective: "1000px" }} // Adds 3D depth for the fly-in
        >
            {hakiImages.map((item, index) => (
                <div 
                    key={index} 
                    // aspect-[3/4] is the crucial "Explorations" shape
                    className="relative aspect-[3/4] w-full bg-[#111] overflow-hidden border border-white/10 group rounded-sm"
                >
                    <Image
                        src={item.src}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    
                    {/* Minimal Hover Label */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <span className="font-mono text-[10px] tracking-widest uppercase bg-black/80 text-white px-2 py-1">
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