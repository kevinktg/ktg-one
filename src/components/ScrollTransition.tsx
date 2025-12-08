"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function ScrollTransition() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  // Select a few art images for the transition
  const artImages = [
    "/assets/art/Colours-of-Haki-1.webp",
    "/assets/art/Colours-of-Haki-3.webp",
    "/assets/art/Colours-of-Haki-6.webp",
    "/assets/art/Colours-of-Haki-9.webp",
  ];

  useGSAP(() => {
    if (!sectionRef.current || !bgRef.current) return;

    // NO PINNING - just animate as you scroll through the section
    // Each image gets its own ScrollTrigger with calculated positions
    const totalImages = artImages.length;
    const imageScrollDistance = 1000; // 1000px of scroll per image
    const sectionHeight = totalImages * imageScrollDistance;

    artImages.forEach((src, index) => {
      const imageElement = bgRef.current?.children[index] as HTMLElement;
      if (!imageElement) return;

      // Calculate scroll positions: each image gets its own range within the section
      const imageStart = index * imageScrollDistance;
      const imageEnd = (index + 1) * imageScrollDistance;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top", // Start when section top hits viewport top
        end: "bottom top", // End when section bottom hits viewport top
        scrub: 1,
        onUpdate: (self) => {
          // Calculate which image should be visible based on scroll progress through section
          const sectionProgress = self.progress; // 0 to 1 as we scroll through the section
          const imageStartProgress = index / totalImages; // e.g., 0, 0.25, 0.5, 0.75
          const imageEndProgress = (index + 1) / totalImages; // e.g., 0.25, 0.5, 0.75, 1.0
          
          // Only animate this image if we're in its range
          if (sectionProgress >= imageStartProgress && sectionProgress <= imageEndProgress) {
            // Local progress within this image's range (0 to 1)
            const localProgress = (sectionProgress - imageStartProgress) / (imageEndProgress - imageStartProgress);
            
            // Fade in (first 20%), hold (middle 60%), fade out (last 20%)
            let opacity = 0;
            let scale = 2;
            let blur = 30;
            
            if (localProgress < 0.2) {
              // Fade in
              const fadeProgress = localProgress / 0.2;
              opacity = fadeProgress * 0.8;
              scale = 2 - fadeProgress;
              blur = 30 - fadeProgress * 30;
            } else if (localProgress > 0.8) {
              // Fade out
              const fadeProgress = (localProgress - 0.8) / 0.2;
              opacity = 0.8 - fadeProgress * 0.8;
              scale = 1 + fadeProgress;
              blur = fadeProgress * 30;
            } else {
              // Hold at peak visibility
              opacity = 0.8;
              scale = 1;
              blur = 0;
            }

            gsap.set(imageElement, {
              opacity,
              scale,
              filter: `blur(${blur}px)`,
            });
          } else {
            // Hide image outside its range
            gsap.set(imageElement, {
              opacity: 0,
              scale: sectionProgress < imageStartProgress ? 2 : 2,
              filter: "blur(30px)",
            });
          }
        },
      });
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="scroll-transition-section bg-black" style={{ height: `${artImages.length * 1000}px`, position: "relative" }}>
      {/* Fixed background container */}
      <div ref={bgRef} className="scroll-transition-bg">
        {artImages.map((src, index) => (
          <div
            key={index}
            className="scroll-transition-image"
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              position: "absolute",
              inset: 0,
              opacity: 0,
              transform: "scale(2)",
              filter: "blur(30px)",
            }}
          />
        ))}
      </div>
      
      {/* Content overlay - Centered animation */}
      <div className="scroll-transition-content absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center">
          <div className="w-32 h-32 md:w-48 md:h-48 border-4 border-white/30 rotate-45 animate-spin-slow">
            <div className="absolute inset-4 border-2 border-white/20 -rotate-45" />
          </div>
        </div>
      </div>
    </section>
  );
}

