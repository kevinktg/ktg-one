"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useMemo } from "react";
// Ensure this path is correct based on your folder structure
import { GeometricBackground } from "@/components/GeometricBackground";

export function PhilosophySection({ philosophyData }) {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const quoteRefs = useRef([]);

  // Default WP Fallback Data
  const data = philosophyData || {
    heading: {
      line1: "synthesis",
      line2: "over",
      line3: "specialization"
    },
    description: [
      "Seven careers aren't seven separate lives. They're seven lenses on the same problem: how to synthesize complexity into clarity.",
      "From the precision of a pilot to the creativity of sound engineering, from market dynamics to human teaching—each domain taught a different dimension of problem-solving.",
      "AI is where they all converge."
    ],
    quotes: [
      {
        text: "Don't just evaluate... collaborate.",
        label: "PRINCIPLE 01",
      },
      {
        text: "Ideation. Brainstorm. Implement. Test. Evaluate. Feedback. Iterate",
        label: "PRINCIPLE 02",
      },
      {
        text: "'Each LLM is wildly unique with patterned traits & features' - April 2024",
        label: "PRINCIPLE 03",
      },
    ]
  };

  // OPTIMIZATION: Cache sessionStorage check to avoid synchronous access on every render
  const hasPlayed = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('philosophy-animated') === 'true';
  }, []);

  useGSAP(() => {
    if (hasPlayed) {
      // Skip animation - set final states immediately
      if (textRef.current) gsap.set(textRef.current, { opacity: 1, y: 0 });
      quoteRefs.current.forEach((quote) => {
        if (quote) gsap.set(quote, { opacity: 1, x: 0 });
      });
      return;
    }

    // 1. HEADER - Run immediately on mount
    if (textRef.current) {
      gsap.from(textRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });
    }

    // 2. QUOTES SLIDE-IN - Stagger after header
    quoteRefs.current.forEach((quote, index) => {
      if (!quote) return;

      // Determine direction based on index (even = left, odd = right)
      const xVal = index % 2 === 0 ? -50 : 50;

      gsap.fromTo(quote,
        { opacity: 0, x: xVal },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power2.out",
          delay: 0.5 + (index * 0.2), // Stagger quotes
          onComplete: () => {
            if (index === quoteRefs.current.length - 1) {
              sessionStorage.setItem('philosophy-animated', 'true');
            }
          }
        }
      );
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-black py-32 px-6 overflow-hidden z-30 content-visibility-auto">

      {/* Geometric Background Layer */}
      <div className="absolute inset-0 z-0">
        <GeometricBackground />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Main Statement */}
        <div ref={textRef} className="mb-40">
          <div className="grid md:grid-cols-2 gap-16 items-start">

            {/* Header */}
            <div>
              <div className="font-mono text-sm text-white/40 mb-6 tracking-widest border-l border-white/20 pl-4">
                PHILOSOPHY
              </div>
              <h2 className="text-5xl md:text-7xl font-syne font-bold lowercase leading-[0.9] text-white">
                <span className="block">{data.heading.line1}</span>
                <span className="block text-white/50">{data.heading.line2}</span>
                <span className="block">{data.heading.line3}</span>
              </h2>
            </div>

            {/* Description Text */}
            <div className="space-y-8 text-white/70 text-lg md:text-xl font-light">
              <p className="leading-relaxed">
                {data.description[0]}
              </p>
              <p className="leading-relaxed">
                {data.description[1]}
              </p>
              <p className="font-mono text-white/90 border-l-2 border-white/50 pl-4">
                {data.description[2]}
              </p>
            </div>
          </div>
        </div>

        {/* Principles / Quotes */}
        <div className="space-y-24 md:space-y-32">
          {data.quotes.map((quote, index) => (
            <div
              key={index}
              ref={(el) => { quoteRefs.current[index] = el; }}
              className={`relative group flex ${index % 2 !== 0 ? 'justify-end' : 'justify-start'}`}
            >
              <div className="max-w-3xl relative">
                {/* Visual Anchor Line */}
                <div className={`absolute top-0 bottom-0 w-1 bg-white/20 group-hover:bg-white/60 transition-colors duration-500 ${index % 2 !== 0 ? 'right-0' : 'left-0'}`} />

                <div className={`${index % 2 !== 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <div className="font-mono text-xs text-white/40 mb-4 tracking-widest">
                    {quote.label}
                  </div>
                  <blockquote className="text-3xl md:text-5xl font-syne font-bold text-white/90 leading-tight">
                    "{quote.text}"
                  </blockquote>
                </div>

                {/* Geometric accent (Diamond) */}
                <div className={`absolute top-1/2 -translate-y-1/2 w-12 h-12 border border-white/10 rotate-45 group-hover:rotate-90 transition-transform duration-700 ${index % 2 !== 0 ? '-left-6' : '-right-6'}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Closing statement */}
        <div className="mt-40 text-center space-y-8">
          <div className="inline-block relative group cursor-default">
            <div className="absolute -inset-8 border border-white/10 group-hover:border-white/30 transition-colors duration-500" />
            <div className="absolute -inset-8 border border-white/5 rotate-3 group-hover:rotate-0 transition-transform duration-700" />

            <div className="relative font-mono text-xl md:text-3xl px-12 py-8 tracking-wide text-white">
              CONTEXT • CONTINUATION • SOLVE
            </div>
          </div>

          {/* Blog link for SEO */}
          <div className="pt-12">
            <a
              href="/blog"
              className="font-mono text-sm text-white/40 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1"
            >
              read insights →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
