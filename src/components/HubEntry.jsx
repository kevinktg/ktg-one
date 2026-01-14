"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import Link from "next/link";
import { Terminal } from "lucide-react";

// Register ScrollTrigger safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function HubEntry() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useGSAP(() => {
    // Simple reveal on scroll
    gsap.from(contentRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative py-32 px-6 bg-black text-white z-40 border-t border-white/10">
      <div ref={contentRef} className="max-w-4xl mx-auto text-center">

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-white/60 tracking-widest uppercase">System Online</span>
        </div>

        <h2 className="font-syne text-4xl md:text-7xl font-bold mb-8 lowercase leading-tight">
          access_terminal
        </h2>

        <p className="text-white/50 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
          Enter the central hub for generative workflows, retrieval architectures, and experimental models.
        </p>

        <Link
          href="/hub"
          className="group inline-flex items-center gap-4 px-8 py-4 bg-white text-black rounded-full font-syne font-bold text-lg hover:bg-white/90 transition-all hover:scale-105"
        >
          <span>Initialize System</span>
          <Terminal className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>

      </div>
    </section>
  );
}
