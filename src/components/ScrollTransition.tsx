"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

// 14 Haki Images
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

    // Set Initial "Floating" State (Chaos)
    gsap.set(items, {
        x: () => Math.random() * 1500 - 750,
        y: () => Math.random() * 2000 - 1000,
        z: () => Math.random() * 500 - 250,
        rotation: () => Math.random() * 90 - 45,
        opacity: 0,
        scale: 0.6
    });

    // The Formation (Order)
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
            end: "+=400",
            pin: true,
            scrub: 1,
        }
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative h-screen bg-black text-white overflow-hidden z-30">

      <div className="relative h-full w-full flex items-center justify-center">

        {/* THE GRID: 3 Columns (Portrait Mode) */}
        <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl px-6 md:px-12"
            style={{ perspective: "1000px" }}
        >
            {hakiImages.map((item, index) => (
                <div
                    key={index}
                    className="relative aspect-[3/4] w-full bg-[#111] overflow-hidden border border-white/10 group rounded-sm"
                >
                    <Image
                        src={item.src}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
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