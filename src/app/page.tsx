"use client";


import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CareerTimeline } from "@/components/CareerTimeline";
import { ExpertiseSection } from "@/components/ExpertiseSection";
import { PromptPortfolio } from "@/components/PromptPortfolio";
import { PhilosophySection } from "@/components/PhilosophySection";
import { Footer } from "@/components/Footer";
import { ValidationSection } from "@/components/ValidationSection";
import StorySection from "@/components/story/StorySection";
import { NarrativeIntro } from "@/components/NarrativeIntro";
import { ScrollTransition } from "@/components/ScrollTransition";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const mainRef = useRef(null);

  useGSAP(() => {
    // Lenis handles smooth scrolling, so we don't need ScrollSmoother
    // ScrollTrigger works with Lenis via the ticker sync in lenis.tsx

    ScrollTrigger.create({
      trigger: ".hero__title-wrapper",
      pin: ".hero__title",
      scrub: true,
      start: "top top",
      end: () => "+=" + (document.querySelector(".hero") as HTMLElement)?.offsetHeight + " bottom",
      markers: false,
      pinSpacing: false
    });
    
    // Hide scroll indicator
    gsap.to(".scroll-indicator", {
        opacity: 0,
        scrollTrigger: {
            trigger: "main",
            start: "top top",
            end: "100px top",
            scrub: true
        }
    });

  }, { scope: mainRef });

  return (
    <div ref={mainRef}>
      <Header />

      
      <main className="relative bg-transparent text-white">
                {/* ============================================ */}
                {/* ANIMATION ORDER - SCROLL SEQUENCE */}
                {/* ============================================ */}
                {/* 
                  ORDER OF ANIMATIONS (top to bottom):
                  
                  1️⃣ NARRATIVE INTRO (PINNED - scrolls through 4000px)
                     - Step 1: Void (black screen - 3s)
                     - Step 2: "So how do I optimize you" (4.5s in, 9s hold)
                     - Step 3: "My first words to LLMs" (3s fade out prev, 4.5s in, 9s hold)
                     - Step 4: "From then on," (3s fade out prev, 4.5s in, 9s hold)
                     - Step 5: "AI anthropology began...." (1s fade out prev, 1.5s in, 3s hold)
                     - Step 7: LLM Logos (1.5s in, 3s hold, 1s fade out)
                     - Step 9: "SOTA // VERIFIED" (2s in, 10s hold)
                  
                  2️⃣ HERO SECTION (PINNED - scrolls through 1500px)
                     - Title words animate in sequentially (0.8s each, 0.2s stagger)
                     - Subtitle words animate in (2s each, 0.5s stagger)
                     - Profile image scales in (1.2s)
                     - Fades out on scroll (1s)
                  
                  3️⃣ SCROLL TRANSITION
                     - Transition element between hero and content
                  
                  4️⃣ CAREER TIMELINE (NOT PINNED - normal scroll)
                     - Reveals on scroll with .reveal-scroll class
                  
                  5️⃣ EXPERTISE SECTION (NOT PINNED - normal scroll)
                     - Reveals on scroll with .reveal-scroll class
                  
                  6️⃣ VALIDATION SECTION (NOT PINNED - normal scroll)
                     - Reveals on scroll with .reveal-scroll class
                  
                  7️⃣ PHILOSOPHY SECTION (NOT PINNED - normal scroll)
                     - Reveals on scroll with .reveal-scroll class
                  
                  8️⃣ FOOTER (NOT PINNED - normal scroll)
                */}
                
                {/* 1️⃣ FIRST: Narrative Intro - Pinned scroll animation */}
                <NarrativeIntro />
                
                <div className="relative z-10">
                    {/* 2️⃣ SECOND: Hero Section - Pinned (1500px scroll duration) */}
                    <StorySection scrollDuration={1500} pin={true} id="hero">
                        <HeroSection />
                    </StorySection>

                    {/* 3️⃣ THIRD: Scroll Transition */}
                    <ScrollTransition />

                    {/* 4️⃣ FOURTH: Career Timeline - Normal scroll */}
                    <StorySection scrollDuration={0} pin={false} id="careers">
                        <CareerTimeline />
                    </StorySection>

                    {/* 5️⃣ FIFTH: Expertise Section - Normal scroll */}
                    <StorySection scrollDuration={0} pin={false} id="expertise">
                        <ExpertiseSection />
                    </StorySection>

                    {/* 6️⃣ SIXTH: Validation Section - Normal scroll */}
                    <StorySection scrollDuration={0} pin={false} id="validation">
                        <ValidationSection />
                    </StorySection>

                    {/* 7️⃣ SEVENTH: Philosophy Section - Normal scroll */}
                    <StorySection scrollDuration={0} pin={false} id="philosophy">
                        <PhilosophySection />
                    </StorySection>

                    {/* 8️⃣ EIGHTH: Footer - Normal scroll */}
                    <Footer />
                </div>
            </main>

      <div className="scroll-indicator fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-bounce pointer-events-none">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
          <span className="monospace text-xs text-white/30 tracking-widest">SCROLL</span>
        </div>
      </div>
    </div>
  );
}
