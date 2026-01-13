"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { ArrowDown } from "lucide-react";

export function SkipButton() {
  const buttonRef = useRef(null);

  useGSAP(() => {
    // Fade in after a delay to allow initial hero impact
    gsap.fromTo(buttonRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, delay: 2, duration: 1, ease: "power2.out" }
    );
  }, []);

  const handleSkip = () => {
    // Scroll to 100vh (past the hero)
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth"
    });

    // Set session flags so subsequent animations might be skipped or fast-forwarded
    if (typeof window !== 'undefined') {
        sessionStorage.setItem('hero-animated', 'true');
        sessionStorage.setItem('hero-transition-played', 'true');
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleSkip}
      className="absolute bottom-8 right-8 z-50 flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-widest text-white/50 hover:text-white transition-colors border border-white/10 hover:border-white/30 rounded-full bg-black/20 backdrop-blur-sm opacity-0"
    >
      <span>Skip Intro</span>
      <ArrowDown className="w-3 h-3" />
    </button>
  );
}
