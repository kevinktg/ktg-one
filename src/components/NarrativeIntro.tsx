"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "./SplitText";

gsap.registerPlugin(ScrollTrigger);

const LOGOS = [
  { src: "/assets/chatgpt-6.svg", alt: "ChatGPT", width: 80, height: 80 },
  { src: "/assets/claude-logo.svg", alt: "Claude", width: 80, height: 80 },
  { src: "/assets/gemini-icon-logo.svg", alt: "Gemini", width: 80, height: 80 },
  { src: "/assets/deepseek-2.svg", alt: "DeepSeek", width: 80, height: 80 },
  { src: "/assets/perplexity-color.svg", alt: "Perplexity", width: 80, height: 80 },
  { src: "/assets/qwen.svg", alt: "Qwen", width: 80, height: 80 }, // Added Qwen
  { src: "/assets/kimi-color.svg", alt: "Kimi", width: 80, height: 80 },
  { src: "/assets/grok-1.svg", alt: "Grok", width: 80, height: 80 },
];

export function NarrativeIntro() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Narrative steps refs
  const reflectionRef = useRef<HTMLDivElement>(null);        // Step 2
  const contextRef = useRef<HTMLDivElement>(null);          // Step 3
  const shiftRef = useRef<HTMLDivElement>(null);            // Step 4
  const originRef = useRef<HTMLDivElement>(null);           // Step 5
  const evolutionRef = useRef<HTMLDivElement>(null);        // Step 7
  const resultRef = useRef<HTMLDivElement>(null);           // Step 9
  
  // Shape Ref
  const shapesRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // 1. MASTER TIMELINE (The Scroll Logic)
    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=15000", // Significantly increased for slower scroll
          pin: true,
          scrub: 1,
          markers: false,
        }
    });

    // --- STEP 1: THE VOID (Pure Black) ---
    tl.addLabel("void").to({}, { duration: 2.0 });

    // --- STEP 2: REFLECTION ("So how do I optimize you") ---
    if (reflectionRef.current) {
      tl.addLabel("reflection", "+=0.1");
      const chars = reflectionRef.current.querySelectorAll(".split-char");
      if (chars.length) {
        tl.fromTo(chars,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 4.0, stagger: 0.05 }
        ).to({}, { duration: 6.0 }); // Hold
      }
    }

    // --- STEP 3: CONTEXT ("My first words to LLMs") ---
    if (contextRef.current) {
      tl.addLabel("context", "+=0.1");
      const chars = contextRef.current.querySelectorAll(".split-char");
      const prevChars = reflectionRef.current?.querySelectorAll(".split-char");

      // Fade out previous
      if (prevChars?.length) tl.to(prevChars, { opacity: 0, y: -20, duration: 2.0, stagger: 0.01 }, "context");
      
      // Fade in current
      if (chars.length) {
        tl.fromTo(chars,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 4.0, stagger: 0.05 },
          "context+=0.5"
        ).to({}, { duration: 6.0 });
      }
    }

    // --- STEP 4: THE SHIFT ("From then on,") + SHAPES ENTER ---
    if (shiftRef.current) {
      tl.addLabel("shift", "+=0.1");
      const chars = shiftRef.current.querySelectorAll(".split-char");
      const prevChars = contextRef.current?.querySelectorAll(".split-char");
      const shapes = shapesRef.current?.querySelectorAll(".floating-shape");

      // Fade out previous
      if (prevChars?.length) tl.to(prevChars, { opacity: 0, y: -20, duration: 2.0, stagger: 0.01 }, "shift");

      // 🌟 TRIGGER SHAPES ENTERING HERE 🌟
      // They scale up and rotate in as the realization hits
      if (shapes?.length) {
         tl.fromTo(shapes, 
            { opacity: 0, scale: 0.5, rotation: -45 },
            { opacity: 0.3, scale: 1, rotation: 0, duration: 5.0, stagger: 0.2, ease: "back.out(1.7)" },
            "shift"
         );
      }

      // Fade in text
      if (chars.length) {
        tl.fromTo(chars,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 4.0, stagger: 0.05 },
          "shift+=0.5"
        ).to({}, { duration: 6.0 });
      }
    }

    // --- STEP 5: ORIGIN ("AI anthropology began...") ---
    if (originRef.current) {
      tl.addLabel("origin", "+=0.1");
      const chars = originRef.current.querySelectorAll(".split-char");
      const prevChars = shiftRef.current?.querySelectorAll(".split-char");

      if (prevChars?.length) tl.to(prevChars, { opacity: 0, y: -20, duration: 2.0, stagger: 0.01 }, "origin");
      
      if (chars.length) {
        tl.fromTo(chars,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 4.0, stagger: 0.05 },
          "origin+=0.5"
        ).to({}, { duration: 6.0 });
      }

      // 🌟 SHAPES MOVE/SHIFT HERE 🌟
      // As we go deeper, the shapes rotate slightly to follow the scroll
      if (shapesRef.current) {
         tl.to(shapesRef.current, { rotation: 10, scale: 1.1, duration: 8.0 }, "origin");
      }
    }

    // Fade out Origin text before Logos
    const originFade = originRef.current?.querySelectorAll(".split-char");
    if (originFade?.length) tl.to(originFade, { opacity: 0, duration: 1.0 });


    // --- STEP 7: EVOLUTION (Logos) ---
    tl.addLabel("evolution", "+=0.1");
    const logoItems = evolutionRef.current?.querySelectorAll(".logo-item");
    
    if (logoItems?.length) {
      // Animate logos popping in (scale up)
      tl.fromTo(logoItems,
        { scale: 0, opacity: 0, rotation: -90 }, 
        { scale: 1, opacity: 1, rotation: 0, duration: 2.5, stagger: 0.1, ease: "back.out(1.7)" }
      );
      
      // Gentle rotation of the whole container while logos are visible
      tl.to(evolutionRef.current, { rotation: 20, duration: 6.0, ease: "none" }, "<");
      
      tl.to({}, { duration: 4.0 }); // Hold

      // Fade out logos
      tl.to(logoItems, { scale: 0, opacity: 0, duration: 1.5, stagger: 0.05, ease: "back.in(1.7)" });
    }

    // --- STEP 9: RESULT (SOTA // VERIFIED) ---
    if (resultRef.current) {
      tl.addLabel("result", "+=0.1");
      tl.fromTo(resultRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 2.5 }
      ).to({}, { duration: 12.0 }); // Long hold for finale
    }

  }, { scope: containerRef });

  // 2. SECONDARY ANIMATION (The "Floating" Life)
  useGSAP(() => {
     gsap.to(".floating-shape", {
        y: "random(-20, 20)",
        x: "random(-10, 10)",
        duration: "random(3, 6)",
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.1
     });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black z-40">
      
      {/* ============================================ */}
      {/* SHAPES LAYER - Starts Invisible, Controlled by Scroll */}
      {/* ============================================ */}
      <div ref={shapesRef} className="absolute inset-0 pointer-events-none z-0">
         <div className="floating-shape absolute top-20 right-20 w-64 h-64 border-2 border-white/20 rotate-45" />
         <div className="floating-shape absolute top-1/4 left-10 w-48 h-48 border-2 border-white/10" />
         <div className="floating-shape absolute bottom-1/4 right-1/3 w-96 h-96 border-2 border-white/20 rounded-full" />
         <div className="floating-shape absolute bottom-20 left-20 w-56 h-56 border-2 border-white/10 rotate-12" />
         {/* Diagonal decorative lines */}
         <div className="floating-shape absolute top-0 right-0 w-[500px] h-[500px] border-l border-white/5 rotate-45 origin-top-right" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full h-full text-white flex items-center justify-center">

        {/* STEP 2: REFLECTION */}
        <div ref={reflectionRef} className="absolute inset-0 flex items-center justify-center px-4 z-50">
          <SplitText className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light font-syne italic text-center max-w-4xl">
            So how do I optimize you
          </SplitText>
        </div>

        {/* STEP 3: CONTEXT */}
        <div ref={contextRef} className="absolute inset-0 flex items-center justify-center px-4 z-50">
          <SplitText className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light font-syne italic text-center max-w-4xl">
            My first words to LLMs
          </SplitText>
        </div>

        {/* STEP 4: SHIFT */}
        <div ref={shiftRef} className="absolute inset-0 flex items-center justify-center px-4 z-50">
          <SplitText className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light font-syne italic text-center max-w-4xl">
            From then on,
          </SplitText>
        </div>

        {/* STEP 5: ORIGIN */}
        <div ref={originRef} className="absolute inset-0 flex items-center justify-center px-4 z-50">
          <SplitText className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light font-syne italic text-center max-w-4xl">
            AI anthropology began....
          </SplitText>
        </div>

        {/* STEP 7: EVOLUTION (LOGOS CIRCLE) */}
        {/* We center this container and set the 'radius' via CSS var for responsiveness */}
        <div 
            ref={evolutionRef} 
            className="absolute inset-0 flex items-center justify-center z-30 [--radius:140px] md:[--radius:220px] lg:[--radius:280px]"
        >
            {LOGOS.map((logo, i) => {
                const angle = (i / LOGOS.length) * 360;
                return (
                    <div
                        key={logo.alt}
                        className="logo-item absolute flex items-center justify-center"
                        style={{
                            // Rotate to angle -> Push out by radius -> Rotate back so image is upright
                            transform: `rotate(${angle}deg) translate(var(--radius)) rotate(-${angle}deg)`
                        }}
                    >
                        <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 transition-transform hover:scale-110">
                             <Image 
                                src={logo.src} 
                                alt={logo.alt} 
                                fill 
                                className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                             />
                        </div>
                    </div>
                );
            })}
        </div>

        {/* STEP 9: RESULT */}
        <div ref={resultRef} className="absolute inset-0 flex items-center justify-center px-4 md:px-8 z-40">
          <div className="relative">
            <div className="absolute -inset-12 border-4 border-white/40" />
            <div className="absolute -inset-8 border-2 border-white/30 rotate-3" />
            <div className="absolute -inset-8 border-2 border-white/30 -rotate-3" />
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold font-syne text-center max-w-6xl leading-tight uppercase tracking-widest">
              SOTA // VERIFIED
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
