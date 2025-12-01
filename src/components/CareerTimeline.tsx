"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plane, TrendingUp, Mountain, Music, Briefcase, Brain } from "lucide-react";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const careers = [
  {
    id: 1,
    title: "Fighter Pilot",
    icon: Plane,
    description: "Precision under pressure. Split-second decision making.",
  },
  {
    id: 2,
    title: "Finance Broker",
    icon: TrendingUp,
    description: "Market analysis. Risk management. Strategic thinking.",
  },
  {
    id: 3,
    title: "Snowboard Instructor",
    icon: Mountain,
    description: "Teaching methodology. Adaptive communication.",
  },
  {
    id: 4,
    title: "Music Producer & Sound Engineer",
    icon: Music,
    description: "Audio architecture. Technical creativity. Attention to detail.",
  },
  {
    id: 5,
    title: "Chevron Head of Events",
    icon: Briefcase,
    description: "Large-scale coordination. Stakeholder management.",
  },
  {
    id: 6,
    title: "AI Engineer",
    icon: Brain,
    description: "Prompt engineering. Framework development. Research synthesis.",
  },
];

export function CareerTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const careerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    // Title animation
    gsap.from(titleRef.current, {
      scrollTrigger: {
        trigger: titleRef.current,
        start: "top 80%",
        end: "bottom 60%",
        scrub: 1,
      },
      x: -100,
      opacity: 0,
    });

    // Stagger career cards
    careerRefs.current.forEach((card, index) => {
      if (card) {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "top 60%",
            scrub: 1,
          },
          x: index % 2 === 0 ? -100 : 100,
          opacity: 0,
          rotation: index % 2 === 0 ? -5 : 5,
        });

        // Hover effect
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      }
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative min-h-screen py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 ref={titleRef} className="mb-20">
          cross-world<br />reasoning
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {careers.map((career, index) => {
            const Icon = career.icon;
            return (
              <div
                key={career.id}
                ref={(el) => (careerRefs.current[index] = el)}
                className="relative group cursor-pointer"
              >
                {/* Geometric border */}
                <div className="absolute -inset-1 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                
                <div className="relative border border-white/20 p-8 h-full bg-black">
                  {/* Icon */}
                  <div className="mb-6 relative">
                    <div className="absolute -inset-4 border border-white/10 rotate-45" />
                    <Icon className="relative w-12 h-12 stroke-[1.5]" />
                  </div>

                  {/* Title */}
                  <h3 className="mb-4">{career.title}</h3>

                  {/* Description */}
                  <p className="monospace text-sm text-white/60 leading-relaxed">
                    {career.description}
                  </p>

                  {/* Number indicator */}
                  <div className="absolute top-4 right-4 monospace text-6xl text-white/5 pointer-events-none">
                    {String(career.id).padStart(2, "0")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Connection lines visualization */}
        <div className="mt-20 relative h-32 overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="white" strokeWidth="1" opacity="0.1" />
            <line x1="0" y1="30%" x2="100%" y2="70%" stroke="white" strokeWidth="1" opacity="0.05" />
            <line x1="0" y1="70%" x2="100%" y2="30%" stroke="white" strokeWidth="1" opacity="0.05" />
          </svg>
        </div>
      </div>
    </section>
  );
}

