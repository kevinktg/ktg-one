"use client";


import { GeometricBackground } from "@/components/GeometricBackground";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CareerTimeline } from "@/components/CareerTimeline";
import { ExpertiseSection } from "@/components/ExpertiseSection";
import { PromptPortfolio } from "@/components/PromptPortfolio";
import { PhilosophySection } from "@/components/PhilosophySection";
import { Footer } from "@/components/Footer";
import StorySection from "@/components/story/StorySection";
import { Intro } from "@/components/Intro";

export default function Home() {


  return (
    <>
      <Intro />
      <main className="relative bg-black text-white">
      {/* Header with logo */}
      <Header />
      
      {/* Fixed geometric background */}
      <GeometricBackground />
      
      {/* Main content with long-form storytelling */}
      <div className="relative z-10">
        {/* Hero - Extended scroll duration for storytelling */}
        <StorySection scrollDuration={3000} pin={true} id="hero">
          <HeroSection />
        </StorySection>

        {/* Career Timeline - Extended scroll */}
        <StorySection scrollDuration={2500} pin={true} id="careers">
          <CareerTimeline />
        </StorySection>

        {/* Expertise - Extended scroll */}
        <StorySection scrollDuration={2500} pin={true} id="expertise">
          <ExpertiseSection />
        </StorySection>

        {/* Philosophy - Extended scroll */}
        <StorySection scrollDuration={2500} pin={true} id="philosophy">
          <PhilosophySection />
        </StorySection>

        {/* Footer */}
        <Footer />
      </div>

      {/* Scroll indicator */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-bounce">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
          <span className="monospace text-xs text-white/30 tracking-widest">SCROLL</span>
        </div>
      </div>
    </main>
    </>
  );
}

