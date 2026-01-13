"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// 1. SVG SHAPES
// ==========================================
const CAREER_SHAPES = {
  shape1: (className) => (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <rect x="20" y="20" width="60" height="60" transform="rotate(45 50 50)" />
      <rect x="30" y="30" width="40" height="40" transform="rotate(45 50 50)" className="opacity-70"/>
      <rect x="40" y="40" width="20" height="20" transform="rotate(45 50 50)" className="opacity-40"/>
      <path d="M50 80 Q 50 90 20 90" className="opacity-60" />
      <path d="M50 85 Q 50 95 15 95" className="opacity-40" />
      <path d="M50 90 Q 50 100 10 100" className="opacity-20" />
    </svg>
  ),
  shape2: (className) => (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <rect x="15" y="15" width="70" height="70" transform="rotate(45 50 50)" />
      <rect x="25" y="25" width="50" height="50" transform="rotate(45 50 50)" className="opacity-70"/>
      <rect x="35" y="35" width="30" height="30" transform="rotate(45 50 50)" className="opacity-40"/>
      <circle cx="20" cy="50" r="3" fill="currentColor" />
      <circle cx="12" cy="50" r="3" fill="currentColor" className="opacity-70"/>
      <circle cx="4" cy="50" r="3" fill="currentColor" className="opacity-40"/>
      <path d="M50 35 V 65 M 35 50 H 65" className="opacity-80"/>
      <circle cx="50" cy="50" r="8" className="opacity-50"/>
    </svg>
  ),
  shape3: (className) => (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <rect x="25" y="25" width="50" height="50" transform="rotate(45 50 50)" />
      <rect x="35" y="35" width="30" height="30" transform="rotate(45 50 50)" className="opacity-50"/>
      <line x1="75" y1="25" x2="95" y2="5" className="opacity-60" />
      <line x1="80" y1="30" x2="100" y2="10" className="opacity-40" />
      <line x1="75" y1="75" x2="95" y2="95" className="opacity-60" />
      <circle cx="80" cy="80" r="2" fill="currentColor" />
      <circle cx="88" cy="88" r="2" fill="currentColor" className="opacity-50" />
      <circle cx="96" cy="96" r="2" fill="currentColor" className="opacity-25" />
    </svg>
  ),
};

// ==========================================
// 2. DATA
// ==========================================
const careers = [
  {
    id: 1,
    title: "Pilot",
    Shape: CAREER_SHAPES.shape2,
    role: "Critical Systems",
    description: "Precision under pressure. Split-second decision making in high-velocity environments.",
    side: "left"
  },
  {
    id: 2,
    title: "Finance Broker",
    Shape: CAREER_SHAPES.shape3,
    role: "Risk Analysis",
    description: "Complex market modeling. Strategic resource allocation and probabilistic forecasting.",
    side: "right"
  },
  {
    id: 3,
    title: "Snowboard Instructor",
    Shape: CAREER_SHAPES.shape1,
    role: "Transfer Learning",
    description: "Deconstructing complex physical mechanics into learnable algorithmic steps.",
    side: "left"
  },
  {
    id: 4,
    title: "Sound Engineer",
    Shape: CAREER_SHAPES.shape2,
    role: "Signal Processing",
    description: "Managing signal flow. Frequency analysis. Technical creativity within strict constraints.",
    side: "right"
  },
  {
    id: 5,
    title: "Head of Events",
    Shape: CAREER_SHAPES.shape1,
    role: "Orchestration",
    description: "Large-scale agent coordination. Stakeholder alignment. Execution of parallel workflows.",
    side: "left"
  },
  {
    id: 6,
    title: "AI Engineer",
    Shape: CAREER_SHAPES.shape3,
    role: "Synthesis",
    description: "The culmination of all inputs. Framework development. Reasoning engines.",
    side: "center"
  },
];

export function CareerTimeline() {
  const containerRef = useRef(null);
  const lineRef = useRef(null);
  const cardRefs = useRef([]);
  const dotRefs = useRef([]);

  useGSAP(() => {
    if (!containerRef.current || !lineRef.current) return;

    // 1. DRAW THE MAIN LINE
    gsap.fromTo(lineRef.current, 
      { height: "0%" }, 
      {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 1,
        }
      }
    );

    // 2. CARD ANIMATION LOGIC
    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      
      const isLastCard = index === careers.length - 1;

      // Initial State
      gsap.set(card, { 
          opacity: 0.1, 
          scale: 0.8, 
          filter: "blur(10px)",
          y: 0 
      });
      gsap.set(dotRefs.current[index], { scale: 0.5, opacity: 0.5 });

      if (isLastCard) {
          // ============================================
          // LAST CARD - STANDARD FOCUS (NO PIN)
          // ============================================
          ScrollTrigger.create({
            trigger: card,
            start: "top center+=150",
            end: "bottom center-=150",
            scrub: true,
            onUpdate: (self) => {
                 const progress = self.progress;
                 const intensity = Math.sin(progress * Math.PI);

                 gsap.to(card, {
                     opacity: 0.1 + (intensity * 0.9),
                     scale: 0.8 + (intensity * 0.2),
                     filter: `blur(${10 - (intensity * 10)}px)`,
                     duration: 0.1,
                     overwrite: true
                 });

                 if(dotRefs.current[index]) {
                     gsap.to(dotRefs.current[index], {
                         scale: 0.5 + (intensity * 0.8),
                         opacity: 0.5 + (intensity * 0.5),
                         boxShadow: `0 0 ${intensity * 30}px rgba(255,255,255,${intensity})`,
                         duration: 0.1,
                         overwrite: true
                     });
                 }
            }
          });
      } else {
          // ============================================
          // STANDARD FOCUS EFFECT
          // ============================================
          ScrollTrigger.create({
            trigger: card,
            start: "top center+=150", 
            end: "bottom center-=150",
            scrub: true, 
            onUpdate: (self) => {
                 const progress = self.progress; 
                 const intensity = Math.sin(progress * Math.PI); 

                 gsap.to(card, { 
                     opacity: 0.1 + (intensity * 0.9), 
                     scale: 0.8 + (intensity * 0.2),   
                     filter: `blur(${10 - (intensity * 10)}px)`, 
                     duration: 0.1,
                     overwrite: true
                 });

                 if(dotRefs.current[index]) {
                     gsap.to(dotRefs.current[index], {
                         scale: 0.5 + (intensity * 0.8),
                         opacity: 0.5 + (intensity * 0.5),
                         boxShadow: `0 0 ${intensity * 30}px rgba(255,255,255,${intensity})`,
                         duration: 0.1,
                         overwrite: true
                     });
                 }
            }
          });
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative min-h-[200vh] pt-40 pb-20 overflow-hidden bg-black z-10">
      
      {/* CENTRAL LINE */}
      <div className="absolute inset-0 pointer-events-none z-0 flex justify-center">
         <div className="h-full w-1 bg-white/10" />
         <div 
            ref={lineRef}
            className="absolute top-0 w-1 bg-white origin-top"
            style={{ height: "0%" }}
         />
      </div>

      <div className="w-full relative z-10">
        <h2 className="text-4xl md:text-6xl font-syne font-bold mb-60 text-center text-white lowercase">
            context<br/><span className="text-white/50">synthesis</span>
        </h2>

        {/* SPACING */}
        <div className="flex flex-col space-y-[30vh]">
          {careers.map((career, index) => {
            const isCenter = career.side === "center";
            const isLeft = career.side === "left";
            
            // 🌟 LAYOUT LOGIC FOR CENTER CARD
            if (isCenter) {
                return (
                    <div key={career.id} className="w-full flex items-center justify-center relative z-40">
                         {/* Centered Card */}
                         <CareerCard 
                            career={career} 
                            index={index} 
                            cardRefs={cardRefs} 
                            align="center"
                         />
                    </div>
                )
            }

            // STANDARD LAYOUT
            return (
              <div key={career.id} className="w-full flex items-center justify-center relative">
                
                {/* LEFT */}
                <div className="hidden md:flex flex-1 justify-end pr-12 lg:pr-24">
                  {isLeft && (
                     <CareerCard 
                        career={career} 
                        index={index} 
                        cardRefs={cardRefs} 
                        align="right"
                     />
                  )}
                </div>

                {/* CENTER DOT */}
                <div className="relative w-0 flex justify-center items-center z-30">
                   <div 
                     ref={el => { dotRefs.current[index] = el }}
                     className="absolute w-5 h-5 bg-white rounded-full hidden md:block transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                   />
                </div>

                {/* RIGHT */}
                <div className="hidden md:flex flex-1 justify-start pl-12 lg:pl-24">
                   {!isLeft && (
                     <CareerCard 
                        career={career} 
                        index={index} 
                        cardRefs={cardRefs} 
                        align="left"
                     />
                   )}
                </div>

                {/* MOBILE */}
                <div className="md:hidden w-full px-6 pl-12">
                   <CareerCard 
                      career={career} 
                      index={index} 
                      cardRefs={cardRefs} 
                      align="left"
                   />
                   <div className="absolute left-[23px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Sub-component
function CareerCard({ career, index, cardRefs, align }) {
    const isCenter = align === "center";

    return (
        <div 
        ref={el => { cardRefs.current[index] = el }}
        className={`
            relative w-full md:w-[600px] bg-black border border-white/20 p-10 group will-change-transform
            ${isCenter ? 'text-center md:scale-110 border-white' : align === 'right' ? 'text-right' : 'text-left'}
        `}
      >
        {/* Connector Line */}
        {!isCenter && (
            <div className={`absolute top-1/2 -translate-y-1/2 w-12 h-[1px] bg-white/30 hidden md:block
                ${align === 'right' ? '-right-12' : '-left-12'}
            `} />
        )}

        {/* Corners */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white opacity-50" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white opacity-50" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white opacity-50" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white opacity-50" />

        <div className={`
            flex items-start mb-6 gap-8 
            ${isCenter ? 'flex-col items-center justify-center text-center' : align === 'right' ? 'flex-row-reverse' : 'flex-row'}
        `}>
            <div className={`flex-1 ${isCenter ? 'w-full' : ''}`}>
                <div className="text-xs text-white/50 tracking-widest mb-2">{career.role}</div>
                
                {/* ⬇️ TYPOGRAPHY UPDATE: Font Syne + Lowercase ⬇️ */}
                <h3 className={`font-syne font-bold lowercase ${isCenter ? 'text-5xl md:text-6xl mb-4' : 'text-4xl'}`}>
                    {career.title}
                </h3>
            </div>
            
            <div className={`
                text-white flex items-center justify-center opacity-100
                ${isCenter ? 'w-32 h-32 mb-4' : 'w-20 h-20'}
            `}>
                {career.Shape("w-full h-full stroke-1")}
            </div>
        </div>
        
        <p className={`text-white/70 text-base leading-relaxed ${isCenter ? 'max-w-xl mx-auto' : ''}`}>
            {career.description}
        </p>
      </div>
    )
}

