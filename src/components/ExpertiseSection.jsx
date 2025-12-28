"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const expertise = [
  {
    category: "PROMPT ENGINEERING",
    skills: [
      "Context continuation strategies",
      "Multi-turn conversation optimization",
      "Chain-of-thought prompting",
      "Few-shot learning patterns",
      "Adversarial prompt testing",
    ],
  },
  {
    category: "AI SOLUTIONS [GoodAI]",
    skills: [
      "LangChain architecture",
      "Custom RAG implementations",
      "Agent-based systems",
      "Embedding strategies",
      "Fine-tuning workflows",
    ],
  },
  {
    category: "AI ANTHROPOLOGY",
    skills: [
      "Neural Pathway Mapping",
      "Cognitive Software Engineering",
      "Reverse-Engineering Engines",
      "Anti-Lazy Protocols",
      "Hallucination Management",
    ],
  },
];

export function ExpertiseSection() {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const shutterRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top", // When section hits top of viewport
        end: "+=500",     // Slightly longer for smoother transition
        pin: true,        // 🔒 Lock the screen
        scrub: 1,         // Smooth scrubbing
        pinSpacing: false, // Prevent overlap with other sections
      }
    });

    // 1. THE SHUTTER REVEAL (High Contrast Wipe)
    // The bars slide UP to reveal the white content underneath
    if (shutterRef.current) {
        const bars = shutterRef.current.children;
        tl.to(bars, {
            height: 0,
            duration: 2,
            stagger: 0.1, // Wave effect
            ease: "power3.inOut"
        });
    }

    // 2. CONTENT ENTRY (While shutters are opening)
    tl.from(contentRef.current, {
        scale: 1.1, // Subtle zoom out effect
        opacity: 0.5,
        duration: 2,
        ease: "power2.out"
    }, "<"); // Start at same time

    // 3. TEXT STAGGER (Geometric precision)
    tl.from(".expertise-item", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.05,
        ease: "back.out(1.7)"
    }, "-=1.0"); // Overlap slightly

    // 4. STATS COUNT UP (Visual flair)
    tl.from(".stat-value", {
        textContent: "0",
        duration: 2,
        snap: { textContent: 1 },
        stagger: 0.2,
    }, "-=1.5");

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative h-screen bg-white text-black overflow-hidden" style={{ contain: "strict" }}>

      {/* ============================================ */}
      {/* THE SHUTTERS (Transition Layer)              */}
      {/* These start full height (Black) and shrink   */}
      {/* ============================================ */}
      <div ref={shutterRef} className="absolute inset-0 z-50 flex pointer-events-none" style={{ contain: "strict layout paint" }}>
         <div className="w-1/5 h-full bg-black border-r border-white/10" />
         <div className="w-1/5 h-full bg-black border-r border-white/10" />
         <div className="w-1/5 h-full bg-black border-r border-white/10" />
         <div className="w-1/5 h-full bg-black border-r border-white/10" />
         <div className="w-1/5 h-full bg-black" />
      </div>

      {/* ============================================ */}
      {/* MAIN CONTENT                                 */}
      {/* ============================================ */}
      <div ref={contentRef} className="relative w-full h-full flex flex-col justify-center py-20 px-6">

          {/* Background Decor (More visible vectors) */}
          <div className="absolute inset-0 pointer-events-none">
             <div className="absolute top-20 right-20 w-64 h-64 border-2 border-black/15 rotate-45" />
             <div className="absolute top-1/3 right-1/4 w-48 h-48 border-2 border-black/10" />
             <div className="absolute bottom-20 left-20 w-96 h-96 border border-black/15 rounded-full" />
             <div className="absolute bottom-1/3 left-1/4 w-72 h-72 border border-black/10 rotate-12" />
             {/* Grid Texture */}
             <div className="absolute inset-0 opacity-[0.05]"
                  style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}
             />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto w-full">
            <h2 className="expertise-item mb-20 text-center text-4xl md:text-6xl font-syne font-bold lowercase tracking-tighter">
              expertise_matrix
            </h2>

            <div className="grid md:grid-cols-3 gap-12">
              {expertise.map((area, index) => (
                <div key={area.category} className="expertise-item relative group">
                  {/* Hover Box Effect */}
                  <div className="absolute -inset-6 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 rounded-lg -z-10" />

                  {/* Category Header */}
                  <div className="mb-8 relative">
                    <div className="absolute -left-4 top-0 w-1 h-full bg-black scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
                    <h3 className="monospace tracking-wider font-bold text-lg">{area.category}</h3>
                    <div className="mt-2 w-12 h-0.5 bg-black group-hover:w-full transition-all duration-700 ease-out" />
                  </div>

                  {/* Skills List */}
                  <ul className="space-y-3">
                    {area.skills.map((skill, skillIndex) => (
                      <li key={skillIndex} className="relative pl-6 text-black/70 leading-relaxed font-mono text-sm group-hover:text-black transition-colors">
                        <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-black/20 group-hover:bg-black transition-colors rotate-45" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Stats Row */}
            <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-black/10 py-12">
              <div className="text-center expertise-item">
                <div className="monospace text-xs opacity-50 mb-2 tracking-widest">PERCENTILE</div>
                <div className="text-4xl md:text-5xl font-syne font-bold stat-value">0.01%</div>
              </div>
              <div className="text-center expertise-item">
                <div className="monospace text-xs opacity-50 mb-2 tracking-widest">CAREERS</div>
                <div className="text-4xl md:text-5xl font-syne font-bold stat-value">7</div>
              </div>
              <div className="text-center expertise-item">
                <div className="monospace text-xs opacity-50 mb-2 tracking-widest">DOMAINS</div>
                <div className="text-4xl md:text-5xl font-syne font-bold">∞</div>
              </div>
              <div className="text-center expertise-item">
                <div className="monospace text-xs opacity-50 mb-2 tracking-widest">APPROACH</div>
                <div className="text-4xl md:text-5xl font-syne font-bold stat-value">1</div>
              </div>
            </div>
          </div>
      </div>
    </section>
  );
}

