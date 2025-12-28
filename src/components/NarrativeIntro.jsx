"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "./SplitText";

gsap.registerPlugin(ScrollTrigger);

// 1. LOGOS (The SVGs for the spin)
const LOGOS = [
  { src: "/assets/chatgpt-6.svg", alt: "ChatGPT" },
  { src: "/assets/claude-logo.svg", alt: "Claude" },
  { src: "/assets/gemini-icon-logo.svg", alt: "Gemini" },
  { src: "/assets/deepseek-2.svg", alt: "DeepSeek" },
  { src: "/assets/perplexity-color.svg", alt: "Perplexity" },
  { src: "/assets/kimi-color.svg", alt: "Kimi" },
  { src: "/assets/grok-1.svg", alt: "Grok" },
  { src: "/assets/qwen.svg", alt: "Qwen" },
];

// 2. AVATARS (Your specific .webp files)
const AVATARS = [
  { src: "/assets/chat.webp", alt: "Chat Avatar" },
  { src: "/assets/gem.webp", alt: "Gem Avatar" },
  { src: "/assets/claude.webp", alt: "Claude Avatar" },
  { src: "/assets/kimi.webp", alt: "Kimi Avatar" },
  { src: "/assets/qwen.webp", alt: "Qwen Avatar" },
  { src: "/assets/plex.webp", alt: "Plex Avatar" },
  { src: "/assets/grok.webp", alt: "Grok Avatar" },
];

export function NarrativeIntro() {
  const containerRef = useRef(null);
  
  // Refs
  const reflectionRef = useRef(null);        
  const contextRef = useRef(null);          
  const shiftRef = useRef(null);            
  const originRef = useRef(null);           
  const evolutionRef = useRef(null);        
  const avatarRef = useRef(null);           
  const teamLogoRef = useRef(null);         
  const shapesRef = useRef(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=18000", 
          pin: true,
          scrub: 1,
        }
    });

    // --- PHASE 1: FAST TEXT SEQUENCE ---
    // (Keeping this snappy as requested)
    tl.addLabel("start");
    
    // Text 1: "How do I optimize you"
    if (reflectionRef.current) {
      const chars = reflectionRef.current.querySelectorAll(".split-char");
      tl.fromTo(chars, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.0, stagger: 0.02 });
      tl.to(chars, { opacity: 0, y: -20, duration: 0.5 }, "+=0.2");
    }

    // Text 2: "First words to LLMs"
    if (contextRef.current) {
      const chars = contextRef.current.querySelectorAll(".split-char");
      tl.fromTo(chars, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.0, stagger: 0.02 }, "<+=0.3");
      tl.to(chars, { opacity: 0, y: -20, duration: 0.5 }, "+=0.2");
    }

    // Text 3: "From then on..." (Shapes start entering)
    if (shiftRef.current) {
      const chars = shiftRef.current.querySelectorAll(".split-char");
      const shapes = shapesRef.current?.querySelectorAll(".floating-shape");

      if (shapes?.length) {
         tl.fromTo(shapes, 
           { opacity: 0, scale: 0 },
           { opacity: 0.4, scale: 1, duration: 1.5, stagger: 0.1, ease: "back.out(1.2)" },
           "<"
         );
      }
      tl.fromTo(chars, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.0, stagger: 0.02 }, "<+=0.2");
      tl.to(chars, { opacity: 0, y: -20, duration: 0.5 }, "+=0.2");
    }

    // Text 4: "AI Anthropology began"
    if (originRef.current) {
      const chars = originRef.current.querySelectorAll(".split-char");
      tl.fromTo(chars, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.0, stagger: 0.02 }, "<+=0.2");
      tl.to(chars, { opacity: 0, duration: 0.5 }, "+=0.2");
    }


    // --- PHASE 2 & 3: THE CHAOS (Logos + Avatars together) ---
    tl.addLabel("battle_start");
    
    const logoItems = evolutionRef.current?.querySelectorAll(".logo-item");
    const avatars = avatarRef.current?.querySelectorAll(".avatar-item");

    // 1. Logos Pop In & Start Spinning
    if (logoItems?.length) {
      tl.fromTo(logoItems,
        { scale: 0, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 1.5, stagger: 0.05, ease: "elastic.out(1, 0.5)" },
        "battle_start"
      );
      
      // Infinite-feeling Spin
      tl.to(evolutionRef.current, { 
        rotation: 360, 
        duration: 8.0, 
        ease: "none" 
      }, "battle_start");
    }

    // 2. Avatars Flash In (ALMOST IMMEDIATELY after logos)
    // This creates that "Too much / Overload" effect you wanted
    if (avatars?.length) {
        tl.fromTo(avatars, 
            { opacity: 0, scale: 0, filter: "blur(10px)" },
            { 
              opacity: 1, 
              scale: 1, 
              filter: "blur(0px)", 
              duration: 0.8, 
              stagger: 0.05, // Very fast stagger ("at the same time")
              ease: "back.out(1.7)" 
            },
            "battle_start+=0.5" // Start just 0.5s after logos appear
        );
    }

    // 3. LET THEM BREATHE (The "Bit")
    // Keep everything on screen spinning and floating for a moment
    tl.to({}, { duration: 4.0 });


    // --- PHASE 4: THE TEAM UP (Exit & Slam) ---
    tl.addLabel("climax");

    // Suck everything into the black hole
    if (logoItems) tl.to(logoItems, { scale: 0, opacity: 0, duration: 0.8, stagger: 0.02, ease: "back.in(1.7)" }, "climax");
    if (avatars) tl.to(avatars, { scale: 0, opacity: 0, rotation: 180, duration: 0.8, stagger: 0.02, ease: "back.in(1.7)" }, "climax");

    // TEAM LOGO SLAM
    if (teamLogoRef.current) {
      // Slam in
      tl.fromTo(teamLogoRef.current,
        { opacity: 0, scale: 5, z: 100, rotation: -10 },
        { opacity: 1, scale: 1, z: 0, rotation: 0, duration: 1.5, ease: "power4.out" },
        "climax+=0.5"
      );

      // Hold the final logo
      tl.to({}, { duration: 4.0 }); 

      // Fade out scene
      tl.to(teamLogoRef.current, { opacity: 0, scale: 1.1, duration: 1.0 });
      tl.to(shapesRef.current, { opacity: 0, duration: 1.0 }, "<");
    }

  }, { scope: containerRef });

  // Floating Background Animation (Always running)
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
     // Subtle float for avatars too so they feel alive
     gsap.to(".avatar-item", {
        y: "random(-10, 10)",
        duration: "random(2, 4)",
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 2 // wait for them to enter first
     });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black z-40">
      
      {/* SHAPES */}
      <div ref={shapesRef} className="absolute inset-0 pointer-events-none z-0">
         <div className="floating-shape absolute top-20 right-20 w-64 h-64 border-2 border-white/20 rotate-45" />
         <div className="floating-shape absolute top-1/4 left-10 w-48 h-48 border-2 border-white/10" />
         <div className="floating-shape absolute bottom-1/4 right-1/3 w-96 h-96 border-2 border-white/20 rounded-full" />
      </div>

      <div className="relative z-10 w-full h-full text-white flex items-center justify-center">

        {/* TEXT SEQUENCE */}
        <div ref={reflectionRef} className="absolute inset-0 flex items-center justify-center px-4 z-50 pointer-events-none">
          <SplitText className="text-4xl md:text-6xl font-syne italic text-center">So how do I optimize you</SplitText>
        </div>
        <div ref={contextRef} className="absolute inset-0 flex items-center justify-center px-4 z-50 pointer-events-none">
          <SplitText className="text-4xl md:text-6xl font-syne italic text-center">My first words to LLMs</SplitText>
        </div>
        <div ref={shiftRef} className="absolute inset-0 flex items-center justify-center px-4 z-50 pointer-events-none">
          <SplitText className="text-4xl md:text-6xl font-syne italic text-center">From then on,</SplitText>
        </div>
        <div ref={originRef} className="absolute inset-0 flex items-center justify-center px-4 z-50 pointer-events-none">
          <SplitText className="text-4xl md:text-6xl font-syne italic text-center">AI anthropology began....</SplitText>
        </div>

        {/* LOGOS CIRCLE (SVGs) */}
        <div 
            ref={evolutionRef} 
            className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none [--radius:140px] md:[--radius:250px]"
        >
            {LOGOS.map((logo, i) => {
                const angle = (i / LOGOS.length) * 360;
                return (
                    <div
                        key={logo.alt}
                        className="logo-item absolute flex items-center justify-center"
                        style={{ transform: `rotate(${angle}deg) translate(var(--radius)) rotate(-${angle}deg)` }}
                    >
                        <div className="relative w-16 h-16 md:w-24 md:h-24">
                             <Image src={logo.src} alt={logo.alt} fill className="object-contain" />
                        </div>
                    </div>
                );
            })}
        </div>

        {/* AVATARS FLASH (WebP) */}
        {/* Adjusted positions to ensure they don't block the very center (where text/team logo is) */}
        <div ref={avatarRef} className="absolute inset-0 z-40 pointer-events-none overflow-hidden">
             {AVATARS.map((av, i) => {
                 const positions = [
                     { top: '15%', left: '20%' }, // Top Left
                     { top: '15%', left: '80%' }, // Top Right
                     { top: '85%', left: '20%' }, // Bottom Left
                     { top: '85%', left: '80%' }, // Bottom Right
                     { top: '50%', left: '10%' }, // Mid Left
                     { top: '50%', left: '90%' }, // Mid Right
                     { top: '20%', left: '50%' }, // Top Center
                 ];
                 const pos = positions[i] || { top: '50%', left: '50%' };
                 
                 return (
                    <div key={i} className="avatar-item absolute w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-2 border-white/50"
                        style={{ 
                            top: pos.top, 
                            left: pos.left,
                            transform: 'translate(-50%, -50%)' 
                        }}>
                        <Image src={av.src} alt={av.alt} fill className="object-cover" />
                    </div>
                 )
             })}
        </div>

        {/* TEAM LLM FINAL LOGO (GIF) */}
        <div ref={teamLogoRef} className="absolute inset-0 flex items-center justify-center z-50 opacity-0">
   <div className="relative w-[300px] h-[300px] md:w-[300px] md:h-[300px]"> 
      <Image 
        src="/assets/teamllm.gif" // <--- UPDATED PATH
        alt="Team LLM"
                fill 
                unoptimized
                className="object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                priority
              />
           </div>
        </div>

      </div>
    </div>
  );
}

