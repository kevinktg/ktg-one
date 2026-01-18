"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import Link from "next/link";
// Ensure this path is correct based on your folder structure
import { GeometricBackground } from "@/components/GeometricBackground";

// Register ScrollTrigger if not already registered
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function PhilosophySection({ philosophyData }) {
  const sectionRef = useRef(null);
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

  useGSAP(() => {
    // 1. HEADER & TEXT - Staggered Reveal
    const animElements = gsap.utils.toArray(".philosophy-anim");
    if (animElements.length > 0) {
      gsap.set(animElements, { y: 50, opacity: 0 });

      ScrollTrigger.batch(animElements, {
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 1.2,
            ease: "power3.out"
          });
        },
        start: "top 85%",
        once: true
      });
    }

    // 2. QUOTES SLIDE-IN - Robust Loop Implementation
    const quotes = quoteRefs.current.filter(q => q);
    if (quotes.length > 0) {
      quotes.forEach((quote, index) => {
        const xVal = index % 2 === 0 ? -100 : 100;

        // Set initial state explicitly
        gsap.set(quote, { opacity: 0, x: xVal });

        gsap.to(quote, {
          opacity: 1,
          x: 0,
          duration: 1.5,
          ease: "expo.out",
          scrollTrigger: {
            trigger: quote,
            start: "top 85%",
            once: true
          }
        });
      });
    }

    // 3. Parallax Effect (Separate Batch or Loop)
    // We can keep the scrub effect separate as it behaves differently (scrub vs trigger)
    // To optimize, we can just use a single loop for scrub triggers if we want,
    // or batch them if they shared the same start/end, but parallax usually needs individual tracking.
    // However, given the "Consolidate" request, let's keep it simple and efficient.
    quoteRefs.current.forEach((quote) => {
        if (!quote) return;
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

    // Refresh triggers to ensure correct positions after layout shifts
    setTimeout(() => ScrollTrigger.refresh(), 500);

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-black py-32 px-6 overflow-hidden z-50">

      {/* Geometric Background Layer */}
      <div className="absolute inset-0 z-0">
        <GeometricBackground />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Main Statement */}
        <div className="mb-40">
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* Header */}
            <div className="mb-8 lg:mb-0">
              <div className="philosophy-anim text-xs md:text-sm text-white/40 mb-8 tracking-[0.2em] border-l border-white/20 pl-4">
                Philosophy
              </div>
              <h2 className="text-4xl md:text-6xl lg:text-8xl font-syne font-bold lowercase leading-[0.9] md:leading-[0.85] text-white">
                <span className="philosophy-anim block">{data.heading.line1}</span>
                <span className="philosophy-anim block text-white/40">{data.heading.line2}</span>
                <span className="philosophy-anim block">{data.heading.line3}</span>
              </h2>
            </div>

            {/* Description Text */}
            <div className="space-y-10 text-white/60 text-lg md:text-xl font-light pt-4">
              <p className="philosophy-anim leading-relaxed">
                {data.description[0]}
              </p>
              <p className="philosophy-anim leading-relaxed">
                {data.description[1]}
              </p>
              <p className="philosophy-anim text-sm text-white/80 border-l border-white/30 pl-6 py-2 tracking-wide leading-relaxed">
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
              className={`relative group flex ${index % 2 !== 0 ? 'justify-end' : 'justify-start'}`}
            >
              <div className="max-w-4xl relative">
                {/* Visual Anchor Line */}
                <div className={`absolute top-0 bottom-0 w-px bg-white/10 group-hover:bg-white/40 transition-colors duration-500 ${index % 2 !== 0 ? 'right-0' : 'left-0'}`} />

                <div className={`${index % 2 !== 0 ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                  <div className="text-xs text-white/30 mb-6 tracking-[0.25em]">
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

            <div className="relative text-lg md:text-2xl px-12 py-8 tracking-[0.2em] text-white/80 group-hover:text-white transition-colors">
              context • continuation • solve
            </div>
          </div>

          {/* Blog link for SEO */}
          <div className="pt-8">
            <Link
              href="/blog"
              className="text-xs text-white hover:text-white/70 transition-colors border-b border-transparent hover:border-white pb-1 tracking-widest"
            >
              read insights
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}