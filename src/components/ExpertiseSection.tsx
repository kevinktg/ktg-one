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
    category: "FRAMEWORKS & TOOLS",
    skills: [
      "LangChain architecture",
      "Custom RAG implementations",
      "Agent-based systems",
      "Embedding strategies",
      "Fine-tuning workflows",
    ],
  },
  {
    category: "RESEARCH & PAPERS",
    skills: [
      "Arxiv literature review",
      "Experimental design",
      "Benchmark analysis",
      "Publication-ready documentation",
      "Novel approach synthesis",
    ],
  },
];

export function ExpertiseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const columnRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    // Title animation
    gsap.from(titleRef.current, {
      scrollTrigger: {
        trigger: titleRef.current,
        start: "top 80%",
        end: "top 50%",
        scrub: 1,
      },
      scale: 0.8,
      opacity: 0,
    });

    // Columns animation
    columnRefs.current.forEach((column, index) => {
      if (column) {
        gsap.from(column, {
          scrollTrigger: {
            trigger: column,
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
          },
          y: 100,
          opacity: 0,
        });

        // Animate list items
        const items = column.querySelectorAll("li");
        items.forEach((item, itemIndex) => {
          gsap.from(item, {
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              end: "top 70%",
              scrub: 1,
            },
            x: -30,
            opacity: 0,
          });
        });
      }
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative min-h-screen py-32 px-6 bg-white text-black">
      {/* Geometric patterns */}
      <div className="absolute inset-0 geometric-pattern" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 ref={titleRef} className="mb-20 text-center">
          expertise
        </h2>

        <div className="grid md:grid-cols-3 gap-12">
          {expertise.map((area, index) => (
            <div
              key={area.category}
              ref={(el) => {
                columnRefs.current[index] = el;
              }}
              className="relative"
            >
              {/* Category header */}
              <div className="mb-8 relative">
                <div className="absolute -left-4 top-0 w-1 h-full bg-black/10" />
                <h3 className="monospace tracking-wider">{area.category}</h3>
                <div className="mt-2 w-16 h-0.5 bg-black" />
              </div>

              {/* Skills list */}
              <ul className="space-y-4">
                {area.skills.map((skill, skillIndex) => (
                  <li
                    key={skillIndex}
                    className="relative pl-6 text-black/70 leading-relaxed"
                  >
                    <span className="absolute left-0 top-2 w-2 h-2 border border-black/30" />
                    {skill}
                  </li>
                ))}
              </ul>

              {/* Geometric accent */}
              <div className="absolute -top-8 -right-8 w-32 h-32 border-2 border-black/5 rotate-12 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-b border-black/10 py-16">
          <div className="text-center">
            <div className="monospace opacity-30 mb-2">PERCENTILE</div>
            <div className="text-5xl">0.1%</div>
          </div>
          <div className="text-center">
            <div className="monospace opacity-30 mb-2">CAREERS</div>
            <div className="text-5xl">7</div>
          </div>
          <div className="text-center">
            <div className="monospace opacity-30 mb-2">DOMAINS</div>
            <div className="text-5xl">∞</div>
          </div>
          <div className="text-center">
            <div className="monospace opacity-30 mb-2">APPROACH</div>
            <div className="text-5xl">1</div>
          </div>
        </div>
      </div>
    </section>
  );
}

