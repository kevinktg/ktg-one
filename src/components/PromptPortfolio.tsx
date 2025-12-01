"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const promptExamples = [
  {
    id: 1,
    title: "KTG-DIRECTIVE v25",
    category: "Meta-Prompting Framework",
    description: "16-phase cognitive OS with M.R.R.U.G initialization, Multi-Layer Density of Experts, and Prompt Bombs. Validated across 11 LLMs with 9.52/10 average.",
    techniques: ["M.R.R.U.G", "MLDoE v7", "Prompt Bombs", "CoD Compression"],
    result: "9,200 tokens | Vertex AI 0.1% | Cross-LLM compatible",
  },
  {
    id: 2,
    title: "Business Plan Visualization",
    category: "Perplexity Spaces",
    description: "Transforms business plan text into investor-ready visuals: financial charts, market analysis graphics, operational diagrams, performance metrics.",
    techniques: ["Mixture of Experts", "RAG Integration", "Tree-of-Thought", "CoD Optimization"],
    result: "9.2/10 confidence | Production-ready output",
  },
  {
    id: 3,
    title: "Multi-Format Document Processor",
    category: "Data Extraction",
    description: "Processes CSV/Word/Excel/PDF into unified JSON/CSV output. Platform-specific cognitive blueprints adapt to new formats without rewrites.",
    techniques: ["Platform-Specific Architecture", "Adaptive Parsing", "Format Detection"],
    result: "Production-grade reliability | Zero-rewrite adaptation",
  },
  {
    id: 4,
    title: "Copywriting Multi-Output Generator",
    category: "Content Creation",
    description: "Single prompt generates 6 different content forms: social media, website, LinkedIn, CEO letter—all targeted to specific audiences and platforms.",
    techniques: ["Few-Shot Learning", "Audience Targeting", "Multi-Format Output"],
    result: "6 outputs from 1 prompt | Platform-optimized",
  },
  {
    id: 5,
    title: "Memory Recall Protocol v3.0",
    category: "Context Preservation",
    description: "Cross-LLM universal context preservation with 9.5/10 continuity. Enables seamless conversation continuation across context limits.",
    techniques: ["M.R.R.U.G", "Multi-Layer Compression", "5-iter CoD", "LLM-Agnostic"],
    result: "47K tokens → 750 words | 9.5/10 continuity",
  },
  {
    id: 6,
    title: "IADHC v6.0-KTG",
    category: "Business Intelligence",
    description: "SME Digital Health Check Framework. YAML specification (3,500 tokens vs 15,000+ prose) for programmatic LLM execution with KTG-directive integration.",
    techniques: ["YAML Schema", "Deterministic Algorithms", "Evidence-Based Scoring"],
    result: "4.3x compression | LLM-executable",
  },
];

const techniques = [
  "Buffer of Thoughts (BoT)",
  "Universal Self-Consistency (USC)",
  "Multi-Expert Assembly",
  "Chain-of-Density (CoD)",
  "Tree-of-Thought (ToT)",
  "Graph-of-Thoughts (GoT)",
  "Skeleton-of-Thought (SoT)",
  "Prompt Bombs",
  "Prompt Weaving",
  "Expert ARQ",
  "ReAct Cycles",
  "Meta-Prompting",
];

export function PromptPortfolio() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const promptRefs = useRef<(HTMLDivElement | null)[]>([]);
  const techniqueRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    // Title animation
    gsap.from(titleRef.current, {
      scrollTrigger: {
        trigger: titleRef.current,
        start: "top 80%",
        end: "top 60%",
        scrub: 1,
      },
      y: 50,
      opacity: 0,
    });

    // Prompt cards animation
    promptRefs.current.forEach((card, index) => {
      if (card) {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "top 60%",
            scrub: 1,
          },
          y: 80,
          opacity: 0,
          rotation: index % 2 === 0 ? -2 : 2,
          stagger: 0.1,
        });
      }
    });

    // Techniques animation
    techniqueRefs.current.forEach((tag, index) => {
      if (tag) {
        gsap.from(tag, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 50%",
            scrub: 1,
          },
          scale: 0,
          opacity: 0,
          stagger: 0.05,
          delay: index * 0.02,
        });
      }
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative min-h-screen py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 ref={titleRef} className="mb-8">
          prompt<br />portfolio
        </h2>

        <p className="monospace text-sm text-white/60 mb-20 max-w-2xl">
          A curated selection from a 9,000+ prompt library. Each prompt represents
          a unique approach to AI interaction, optimized for specific platforms and use cases.
        </p>

        {/* Prompt Examples Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-32">
          {promptExamples.map((prompt, index) => (
            <div
              key={prompt.id}
              ref={(el) => {
                promptRefs.current[index] = el;
              }}
              className="relative group border border-white/10 p-8 bg-black/50 hover:bg-black/70 transition-colors"
            >
              {/* Number indicator */}
              <div className="absolute top-4 right-4 monospace text-4xl text-white/5 pointer-events-none">
                {String(prompt.id).padStart(2, "0")}
              </div>

              {/* Category badge */}
              <div className="inline-block mb-4 px-3 py-1 border border-white/20 monospace text-xs">
                {prompt.category}
              </div>

              {/* Title */}
              <h3 className="mb-4 text-2xl">{prompt.title}</h3>

              {/* Description */}
              <p className="monospace text-sm text-white/70 mb-6 leading-relaxed">
                {prompt.description}
              </p>

              {/* Techniques */}
              <div className="mb-6">
                <div className="monospace text-xs text-white/40 mb-2">TECHNIQUES</div>
                <div className="flex flex-wrap gap-2">
                  {prompt.techniques.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 border border-white/10 monospace text-xs text-white/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Result */}
              <div className="pt-4 border-t border-white/10">
                <div className="monospace text-xs text-white/40 mb-1">RESULT</div>
                <div className="text-sm text-white/80">{prompt.result}</div>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 transition-colors pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Techniques Library */}
        <div className="border-t border-white/10 pt-20">
          <h3 className="mb-8 text-xl">Core Techniques</h3>
          <div className="flex flex-wrap gap-3">
            {techniques.map((technique, index) => (
              <div
                key={index}
                ref={(el) => {
                  techniqueRefs.current[index] = el;
                }}
                className="px-4 py-2 border border-white/20 bg-black/30 monospace text-sm hover:bg-black/50 transition-colors cursor-pointer"
              >
                {technique}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-20">
          <div className="text-center">
            <div className="monospace text-xs text-white/40 mb-2">PROMPTS</div>
            <div className="text-5xl">9,000+</div>
          </div>
          <div className="text-center">
            <div className="monospace text-xs text-white/40 mb-2">FRAMEWORKS</div>
            <div className="text-5xl">25</div>
          </div>
          <div className="text-center">
            <div className="monospace text-xs text-white/40 mb-2">TECHNIQUES</div>
            <div className="text-5xl">12+</div>
          </div>
          <div className="text-center">
            <div className="monospace text-xs text-white/40 mb-2">PLATFORMS</div>
            <div className="text-5xl">11</div>
          </div>
        </div>
      </div>
    </section>
  );
}

