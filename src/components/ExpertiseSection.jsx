"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

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
    // Check if animation has already played this session
    const hasPlayed = sessionStorage.getItem('expertise-revealed') === 'true';

    if (hasPlayed) {
      // Skip animation - just hide shutters immediately and set final states
      if (shutterRef.current?.children) {
        gsap.set(shutterRef.current.children, { scaleY: 0 });
      }
      gsap.set(".expertise-title", { opacity: 1, y: 0 });
      gsap.set(".expertise-group", { opacity: 1, y: 0 });
      
      // Set counters to final values immediately
      const stats = gsap.utils.toArray(".stat-counter");
      stats.forEach((stat) => {
        const targetVal = parseFloat(stat.getAttribute("data-val"));
        const isFloat = stat.getAttribute("data-is-float") === "true";
        const suffix = stat.getAttribute("data-suffix") || "";
        stat.textContent = isFloat ? targetVal.toFixed(2) + suffix : Math.floor(targetVal) + suffix;
      });
      return;
    }

    // SHUTTER REVEAL - Run immediately on mount
    gsap.to(shutterRef.current?.children, {
      scaleY: 0,
      duration: 1.5,
      stagger: 0.1,
      ease: "power3.inOut",
      transformOrigin: "top",
      onComplete: () => {
        sessionStorage.setItem('expertise-revealed', 'true');
      }
    });

    // CONTENT ENTRANCE - Start slightly after shutters begin
    const tl = gsap.timeline({ delay: 0.3 });
    tl.from(".expertise-title", { y: 50, opacity: 0, duration: 1.2, ease: "power4.out" })
      .from(".expertise-group", { y: 40, opacity: 0, duration: 1, stagger: 0.15, ease: "power2.out" }, "-=0.6");

    // COUNTERS - Animate after content appears
    const stats = gsap.utils.toArray(".stat-counter");
    stats.forEach((stat) => {
      const targetVal = parseFloat(stat.getAttribute("data-val"));
      const isFloat = stat.getAttribute("data-is-float") === "true";
      const suffix = stat.getAttribute("data-suffix") || "";
      const proxy = { val: 0 };

      gsap.to(proxy, {
        val: targetVal,
        duration: 2,
        delay: 1.5, // Start after content animation
        ease: "power2.out",
        onUpdate: () => {
          stat.textContent = isFloat ? proxy.val.toFixed(2) + suffix : Math.floor(proxy.val) + suffix;
        }
      });
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative min-h-screen bg-white text-black overflow-hidden py-20 z-30">

      {/* SHUTTERS (Transition Layer) */}
      <div ref={shutterRef} className="absolute inset-0 z-50 flex pointer-events-none h-full w-full" style={{ contain: 'layout paint' }}>
         {[...Array(5)].map((_, i) => (
           <div key={i} className="w-1/5 h-full bg-black border-r border-white/10 will-change-transform" style={{ contain: 'strict' }} />
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
            <div key={area.category} className="expertise-group relative">
              <div className="mb-8 relative pl-4">
                <div className="absolute left-0 top-0 w-1 h-full bg-black/30" />
                <h3 className="font-mono tracking-wider font-bold text-sm uppercase">{area.category}</h3>
                <div className="mt-2 w-24 h-0.5 bg-black" />
              </div>
              <ul className="space-y-3">
                {area.skills.map((skill, i) => (
                  <li key={i} className="relative pl-6 text-black/60 leading-relaxed text-base">
                    <span className="absolute left-0 top-2.5 w-1.5 h-1.5 bg-black/30 rotate-45" />
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
