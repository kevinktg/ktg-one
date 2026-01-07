"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useMemo } from "react";
import Link from "next/link";
// Ensure this path is correct based on your folder structure
import { GeometricBackground } from "@/components/GeometricBackground";

// Register ScrollTrigger if not already registered
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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

  // OPTIMIZATION: Cache sessionStorage check
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

    // 1. HEADER - Cinematic Reveal
    if (textRef.current) {
      gsap.fromTo(textRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: "expo.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%",
            once: true
          }
        }
      );
    }

    // 2. QUOTES SLIDE-IN - Stagger with Parallax
    quoteRefs.current.forEach((quote, index) => {
      if (!quote) return;

      // Determine direction based on index (even = left, odd = right)
      // Increased offset for more drama
      const xVal = index % 2 === 0 ? -100 : 100;

      // Slide In
      gsap.fromTo(quote,
        { opacity: 0, x: xVal },
        {
          opacity: 1,
          x: 0,
          duration: 1.5,
          ease: "expo.out",
          scrollTrigger: {
            trigger: quote,
            start: "top 85%",
            once: true
          },
          onComplete: () => {
            if (index === quoteRefs.current.length - 1) {
              sessionStorage.setItem('philosophy-animated', 'true');
            }
          }
        }
      );

      // Subtle Parallax Effect on Scroll (scrub)
      // Moves the quotes slightly up as you scroll past them
      gsap.to(quote, {
        y: -50,
        ease: "none",
        scrollTrigger: {
          trigger: quote,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
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
        <div ref={textRef} className="mb-40 opacity-0 translate-y-[100px]">
          <div className="grid md:grid-cols-2 gap-16 items-start">

            {/* Header */}
            <div>
              <div className="font-mono text-xs md:text-sm text-white/40 mb-8 tracking-[0.2em] border-l border-white/20 pl-4 uppercase">
                Philosophy
              </div>
              <h2 className="text-5xl md:text-8xl font-syne font-bold lowercase leading-[0.85] text-white">
                <span className="block">{data.heading.line1}</span>
                <span className="block text-white/40">{data.heading.line2}</span>
                <span className="block">{data.heading.line3}</span>
              </h2>
            </div>

            {/* Description Text */}
            <div className="space-y-10 text-white/60 text-lg md:text-xl font-light pt-4">
              <p className="leading-relaxed">
                {data.description[0]}
              </p>
              <p className="leading-relaxed">
                {data.description[1]}
              </p>
              <p className="font-mono text-sm text-white/80 border-l border-white/30 pl-6 py-2 tracking-wide leading-relaxed">
                {data.description[2]}
              </p>
            </div>
          </div>
        </div>

        {/* Principles / Quotes */}
        <div className="space-y-32 md:space-y-48">
          {data.quotes.map((quote, index) => (
            <div
              key={index}
              ref={(el) => { quoteRefs.current[index] = el; }}
              className={`relative group flex opacity-0 ${index % 2 !== 0 ? 'justify-end' : 'justify-start'}`}
            >
              <div className="max-w-4xl relative">
                {/* Visual Anchor Line */}
                <div className={`absolute top-0 bottom-0 w-px bg-white/10 group-hover:bg-white/40 transition-colors duration-500 ${index % 2 !== 0 ? 'right-0' : 'left-0'}`} />

                <div className={`${index % 2 !== 0 ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                  <div className="font-mono text-xs text-white/30 mb-6 tracking-[0.25em]">
                    {quote.label}
                  </div>
                  <blockquote className="text-3xl md:text-6xl font-syne font-bold text-white/90 leading-tight group-hover:text-white transition-colors duration-500">
                    &quot;{quote.text}&quot;
                  </blockquote>
                </div>

                {/* Geometric accent (Diamond) - Animated on hover */}
                <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 border border-white/20 rotate-45 group-hover:rotate-180 group-hover:scale-150 transition-all duration-700 ${index % 2 !== 0 ? '-left-2' : '-right-2'} bg-black`} />
              </div>
            </div>
          ))}
        </div>

        {/* Closing statement */}
        <div className="mt-60 text-center space-y-12">
          <div className="inline-block relative group cursor-default">
            {/* Magnetic-like visual effect */}
            <div className="absolute -inset-12 border border-white/5 rounded-full scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 ease-out" />
            <div className="absolute -inset-8 border border-white/10 group-hover:border-white/20 transition-colors duration-500" />

            <div className="relative font-mono text-lg md:text-2xl px-12 py-8 tracking-[0.2em] text-white/80 group-hover:text-white transition-colors">
              CONTEXT • CONTINUATION • SOLVE
            </div>
          </div>

          {/* Blog link for SEO */}
          <div className="pt-8">
            <Link
              href="/blog"
              className="font-mono text-xs text-white/30 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1 tracking-widest uppercase"
            >
              read insights
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
