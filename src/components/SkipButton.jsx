"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { ArrowDown } from "lucide-react";

export function SkipButton() {
  const buttonRef = useRef(null);

  useGSAP(() => {
    if (!buttonRef.current) return;
    // Fade in after a delay to allow initial hero impact (duration >= 1s)
    gsap.fromTo(
      buttonRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, delay: 2, duration: 1.2, ease: "power2.out" }
    );
  }, { scope: buttonRef });

  const handleSkip = () => {
    // Find BlogPreview section and scroll to it
    const findBlogSection = () => {
      // Try data attribute first (most reliable)
      let blogSection = document.querySelector('[data-blog-section]');
      
      // Fallback: find section containing "blog" heading
      if (!blogSection) {
        const sections = document.querySelectorAll('section');
        for (const section of sections) {
          const heading = section.querySelector('h2');
          if (heading && heading.textContent.toLowerCase().includes('blog')) {
            blogSection = section;
            break;
          }
        }
      }
      
      return blogSection;
    };
    
    const blogSection = findBlogSection();
    
    if (blogSection) {
      // Scroll to the section
      blogSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    } else {
      // Fallback: scroll down significantly to get past hero and other sections
      // This is a rough estimate - should get us close to blog section
      window.scrollTo({
        top: window.innerHeight * 5, // Scroll past hero, transition, expertise, validation, philosophy
        behavior: "smooth"
      });
    }

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
      aria-label="Skip introduction and scroll to content"
      className="group relative overflow-hidden absolute bottom-8 right-8 z-50 flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-widest text-white/50 hover:text-white border border-white/10 hover:border-white/30 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md opacity-0 shadow-[0_0_0_rgba(255,255,255,0)] hover:shadow-[0_0_20px_rgba(255,255,255,0.12)] transition-all duration-1000 ease-out hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none cursor-pointer"
    >
      {/* Ambient subtle glow pulse on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-out pointer-events-none motion-reduce:transition-none"
      />

      <span className="relative z-10 transition-transform duration-1000 ease-out group-hover:tracking-wider motion-reduce:transform-none motion-reduce:transition-none">
        Skip Intro
      </span>

      <span className="relative z-10 transition-transform duration-1000 ease-out group-hover:translate-y-1 motion-reduce:transform-none motion-reduce:transition-none">
        <ArrowDown className="w-3 h-3 text-white/50 group-hover:text-emerald-400 transition-colors duration-1000 ease-out" />
      </span>

      {/* Subtle bottom animated accent border trail */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-emerald-400/80 scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100 transition-all duration-1000 ease-out motion-reduce:transition-none"
      />
    </button>
  );
}
