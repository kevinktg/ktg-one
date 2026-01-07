"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useMemo } from "react";

// Register ScrollTrigger if not already registered (safety check)
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Helper Component for the stats at the bottom
const StatBox = ({ label, value, isFloat, suffix }) => (
  <div className="text-center expertise-group opacity-0">
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

  // OPTIMIZATION: Cache sessionStorage check
  const hasPlayed = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('expertise-revealed') === 'true';
  }, []);

  useGSAP(() => {
    // 1. Initial Setters
    // Ensure shutters are visible initially if not played
    if (!hasPlayed) {
      if (shutterRef.current?.children) {
        gsap.set(shutterRef.current.children, { scaleY: 1, transformOrigin: "top" });
      }
    } else {
      // If played, ensure content is visible and shutters hidden
      if (shutterRef.current?.children) {
        gsap.set(shutterRef.current.children, { scaleY: 0 });
      }
      gsap.set(".expertise-title", { opacity: 1, y: 0 });
      gsap.set(".expertise-group", { opacity: 1, y: 0 });
      
      const stats = gsap.utils.toArray(".stat-counter");
      stats.forEach((stat) => {
        const targetVal = parseFloat(stat.getAttribute("data-val"));
        const isFloat = stat.getAttribute("data-is-float") === "true";
        const suffix = stat.getAttribute("data-suffix") || "";
        stat.textContent = isFloat ? targetVal.toFixed(2) + suffix : Math.floor(targetVal) + suffix;
      });
      return;
    }

    // 2. Shutter Animation
    // More cinematic easing
    gsap.to(shutterRef.current?.children, {
      scaleY: 0,
      duration: 1.2,
      stagger: 0.05,
      ease: "power4.inOut",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%", // Start a bit earlier
        once: true
      },
      onComplete: () => {
        sessionStorage.setItem('expertise-revealed', 'true');
      }
    });

    // 3. Content Animation
    // Batch animations for better performance and coordinated entry
    ScrollTrigger.batch(".expertise-group", {
      start: "top 85%",
      onEnter: (elements) => {
        gsap.to(elements, {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 1.2,
          ease: "power4.out",
          overwrite: true
        });
      },
      once: true
    });

    // Title specific animation
    gsap.fromTo(".expertise-title",
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          once: true
        }
      }
    );

    // 4. Counter Animation
    // Trigger when stats row comes into view
    ScrollTrigger.create({
      trigger: ".stat-counter", // Use first counter as trigger
      start: "top 90%",
      once: true,
      onEnter: () => {
        const stats = gsap.utils.toArray(".stat-counter");
        stats.forEach((stat) => {
          const targetVal = parseFloat(stat.getAttribute("data-val"));
          const isFloat = stat.getAttribute("data-is-float") === "true";
          const suffix = stat.getAttribute("data-suffix") || "";
          const proxy = { val: 0 };

          gsap.to(proxy, {
            val: targetVal,
            duration: 2.5, // Slower, more deliberate count up
            ease: "power3.out",
            onUpdate: () => {
              stat.textContent = isFloat ? proxy.val.toFixed(2) + suffix : Math.floor(proxy.val) + suffix;
            }
          });
        });
      }
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative min-h-screen bg-white text-black overflow-hidden py-24 md:py-32 z-30 content-visibility-auto">

      {/* SHUTTERS (Transition Layer) */}
      <div ref={shutterRef} className="absolute inset-0 z-50 flex pointer-events-none h-full w-full" style={{ contain: 'layout paint' }}>
         {[...Array(5)].map((_, i) => (
           <div 
             key={i} 
             className={`w-1/5 h-full bg-black border-r border-white/10 ${!hasPlayed ? 'will-change-transform' : ''}`} 
             style={{ contain: 'strict', transformOrigin: 'top' }}
           />
         ))}
      </div>

      {/* Background Decor - Subtle Parallax */}
      <div className="absolute inset-0 pointer-events-none z-10 select-none overflow-hidden">
         <div className="absolute top-20 right-20 w-64 h-64 border border-black/5 rotate-45 opacity-60" />
         <div className="absolute top-1/3 right-1/4 w-48 h-48 border border-black/5" />
         <div className="absolute bottom-20 left-20 w-96 h-96 border border-black/5 rounded-full opacity-50" />
         <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 flex flex-col justify-center h-full">

        {/* Header */}
        <div className="mb-24 text-center overflow-hidden">
          <h2 className="expertise-title inline-block text-5xl md:text-7xl font-syne font-bold lowercase tracking-tighter text-black opacity-0">
            expertise_matrix
          </h2>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-16 mb-32">
          {data.map((area) => (
            <div key={area.category} className="expertise-group relative opacity-0 translate-y-12">
              <div className="mb-8 relative pl-6 border-l border-black/20">
                <h3 className="font-mono tracking-[0.2em] font-bold text-xs uppercase text-black/80 mb-2">{area.category}</h3>
                <div className="w-12 h-px bg-black/40" />
              </div>
              <ul className="space-y-4">
                {area.skills.map((skill, i) => (
                  <li key={i} className="relative pl-0 text-black/70 leading-loose text-sm md:text-base font-light hover:text-black transition-colors duration-300">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-black/5 py-16">
          <StatBox label="PERCENTILE" value="0.01" isFloat suffix="%" />
          <StatBox label="CAREERS" value="7" />

          <div className="text-center expertise-group opacity-0">
            <div className="font-mono text-xs opacity-50 mb-2 tracking-widest">DOMAINS</div>
            <div className="text-4xl md:text-5xl font-syne font-bold">∞</div>
          </div>

          <StatBox label="APPROACH" value="1" />
        </div>
      </div>
    </section>
  );
}
