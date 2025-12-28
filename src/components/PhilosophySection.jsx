"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { GeometricBackground } from "@/components/GeometricBackground";

gsap.registerPlugin(ScrollTrigger);

export function PhilosophySection() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const quoteRefs = useRef([]);

  useGSAP(() => {
    // Main text parallax
    gsap.to(textRef.current, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
      y: -50,
    });

    // Quotes animation
    quoteRefs.current.forEach((quote, index) => {
      if (quote) {
        gsap.from(quote, {
          scrollTrigger: {
            trigger: quote,
            start: "top 85%",
            end: "top 60%",
            scrub: 1,
          },
          x: index % 2 === 0 ? -100 : 100,
          opacity: 0,
        });
      }
    });
  }, { scope: sectionRef });

  const quotes = [
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
  ];

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-black py-32 px-6" style={{ contain: "layout paint" }}>
      {/* Geometric Background */}
      <GeometricBackground />
      <div className="max-w-6xl mx-auto relative z-10" style={{ contain: "layout" }}>
        {/* Main statement */}
        <div ref={textRef} className="mb-32">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <div className="monospace text-sm text-white/40 mb-4 tracking-widest">
                PHILOSOPHY
              </div>
              <h2>
                synthesis<br />
                over<br />
                specialization
              </h2>
            </div>
            <div className="space-y-6 text-white/70 text-lg">
              <p>
                Seven careers aren't seven separate lives. They're seven lenses on the same problem:
                how to synthesize complexity into clarity.
              </p>
              <p>
                From the precision of a pilot to the creativity of sound engineering,
                from market dynamics to human teaching—each domain taught a different dimension
                of problem-solving.
              </p>
              <p className="monospace text-white/90">
                AI is where they all converge.
              </p>
            </div>
          </div>
        </div>

        {/* Principles */}
        <div className="space-y-16">
          {quotes.map((quote, index) => (
            <div
              key={index}
              ref={(el) => {
                quoteRefs.current[index] = el;
              }}
              className="relative group"
            >
              <div className="border-l-2 border-white/20 pl-8 py-4 group-hover:border-white/60 transition-colors duration-500">
                <div className="monospace text-xs text-white/40 mb-3 tracking-widest">
                  {quote.label}
                </div>
                <blockquote className="text-3xl md:text-4xl italic text-white/90 tracking-tight">
                  "{quote.text}"
                </blockquote>
              </div>

              {/* Geometric accent */}
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-16 h-16 border border-white/5 rotate-45 group-hover:rotate-90 transition-transform duration-700" />
            </div>
          ))}
        </div>

        {/* Closing statement */}
        <div className="mt-32 text-center space-y-8">
          <div className="inline-block relative">
            <div className="absolute -inset-8 border border-white/10" />
            <div className="relative monospace text-2xl md:text-3xl px-12 py-8 tracking-wide">
              CONTEXT • CONTINUATION • SOLVE
            </div>
          </div>
          
          {/* Blog link for SEO */}
          <div className="pt-8">
            <a 
              href="/blog" 
              className="monospace text-sm text-white/60 hover:text-white transition-colors underline underline-offset-4"
            >
              read insights →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

