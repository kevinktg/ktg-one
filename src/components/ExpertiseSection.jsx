"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

// Helper Component for the stats at the bottom
const StatBox = ({ label, value, isFloat, suffix }) => (
  <div className="text-center expertise-group">
    <div className="font-mono text-xs opacity-50 mb-2 tracking-widest">{label}</div>
    <div
      className="text-4xl md:text-5xl font-syne font-bold stat-counter"
      data-val={value}
      data-is-float={isFloat}
      data-suffix={suffix}
    >
      0
    </div>
  </div>
);

export function ExpertiseSection({ expertiseData }) {
  const containerRef = useRef(null);
  const shutterRef = useRef(null);

  // Default Fallback Data
  const data = expertiseData || [
    {
      category: "PROMPT ENGINEERING",
      skills: ["Context continuation strategies", "Multi-turn conversation optimization", "Chain-of-thought prompting", "Few-shot learning patterns", "Adversarial prompt testing"]
    },
    {
      category: "AI SOLUTIONS [GoodAI]",
      skills: ["LangChain architecture", "Custom RAG implementations", "Agent-based systems", "Embedding strategies", "Fine-tuning workflows"]
    },
    {
      category: "AI ANTHROPOLOGY",
      skills: ["Neural Pathway Mapping", "Cognitive Software Engineering", "Reverse-Engineering Engines", "Anti-Lazy Protocols", "Hallucination Management"]
    },
  ];

  useGSAP(() => {
    // 1. SHUTTER REVEAL
    // Uses scaleY for high-performance animation
    gsap.to(shutterRef.current?.children, {
      scaleY: 0,
      duration: 1.5,
      stagger: 0.1,
      ease: "power3.inOut",
      transformOrigin: "top",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "top 20%",
        scrub: 1,
      }
    });

    // 2. CONTENT ENTRANCE
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 60%",
        end: "top 20%",
        toggleActions: "play none none reverse"
      }
    });

    tl.from(".expertise-title", { y: 50, opacity: 0, duration: 1, ease: "power4.out" })
      .from(".expertise-group", { y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }, "-=0.5");

    // 3. COUNTERS
    const stats = gsap.utils.toArray(".stat-counter");
    stats.forEach((stat) => {
      const targetVal = parseFloat(stat.getAttribute("data-val"));
      const isFloat = stat.getAttribute("data-is-float") === "true";
      const suffix = stat.getAttribute("data-suffix") || "";
      const proxy = { val: 0 };

      gsap.to(proxy, {
        val: targetVal,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: { trigger: stat, start: "top 85%", toggleActions: "play none none reverse" },
        onUpdate: () => {
          stat.textContent = isFloat ? proxy.val.toFixed(2) + suffix : Math.floor(proxy.val) + suffix;
        }
      });
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative min-h-screen bg-white text-black overflow-hidden py-20 z-30">

      {/* SHUTTERS (Transition Layer) */}
      <div ref={shutterRef} className="absolute inset-0 z-50 flex pointer-events-none h-full w-full">
         {[...Array(5)].map((_, i) => (
           <div key={i} className="w-1/5 h-full bg-black border-r border-white/10 will-change-transform" />
         ))}
      </div>

      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none z-10 select-none overflow-hidden">
         <div className="absolute top-20 right-20 w-64 h-64 border-2 border-black/10 rotate-45 opacity-60" />
         <div className="absolute top-1/3 right-1/4 w-48 h-48 border-2 border-black/5" />
         <div className="absolute bottom-20 left-20 w-96 h-96 border-2 border-black/10 rounded-full opacity-50" />
         <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 flex flex-col justify-center h-full">

        {/* Header */}
        <h2 className="expertise-title mb-20 text-center text-4xl md:text-6xl font-syne font-bold lowercase tracking-tighter text-black">
          expertise_matrix
        </h2>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-12 mb-24">
          {data.map((area) => (
            <div key={area.category} className="expertise-group relative group">
              <div className="absolute -inset-6 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl -z-10" />
              <div className="mb-8 relative pl-4">
                <div className="absolute left-0 top-0 w-1 h-full bg-black scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
                <h3 className="font-mono tracking-wider font-bold text-lg">{area.category}</h3>
                <div className="mt-2 w-12 h-0.5 bg-black group-hover:w-24 transition-all duration-500 ease-out" />
              </div>
              <ul className="space-y-3">
                {area.skills.map((skill, i) => (
                  <li key={i} className="relative pl-6 text-black/60 leading-relaxed font-mono text-sm group-hover:text-black transition-colors duration-300">
                    <span className="absolute left-0 top-2.5 w-1.5 h-1.5 bg-black/20 group-hover:bg-black transition-colors rotate-45" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-black/10 py-12">
          <StatBox label="PERCENTILE" value="0.01" isFloat suffix="%" />
          <StatBox label="CAREERS" value="7" />

          <div className="text-center expertise-group">
            <div className="font-mono text-xs opacity-50 mb-2 tracking-widest">DOMAINS</div>
            <div className="text-4xl md:text-5xl font-syne font-bold">∞</div>
          </div>

          <StatBox label="APPROACH" value="1" />
        </div>
      </div>
    </section>
  );
}