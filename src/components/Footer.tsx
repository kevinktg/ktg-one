"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Github, Linkedin, Mail, FileText } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(footerRef.current, {
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top bottom",
        end: "top 80%",
        scrub: 1,
      },
      y: 50,
      opacity: 0,
    });
  }, { scope: footerRef });

  return (
    <footer ref={footerRef} className="relative py-24 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 mb-16">
          {/* Left column */}
          <div>
            <h3 className="mb-6 typography-geometric">let's build something</h3>
            <p className="text-white/60 mb-8 text-lg leading-relaxed">
              Whether it's context continuation, framework development, or Arxiv-ready research—
              let's push the boundaries of what's possible with AI.
            </p>
            
            {/* Social links */}
            <div className="flex gap-4">
              {[
                { icon: Mail, label: "Email" },
                { icon: Github, label: "GitHub" },
                { icon: Linkedin, label: "LinkedIn" },
                { icon: FileText, label: "Papers" },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    className="group relative w-12 h-12 border border-white/20 hover:border-white/60 transition-colors duration-300 gradient-border"
                    aria-label={item.label}
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    <Icon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right column */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="monospace text-sm text-white/40 mb-4 tracking-widest">
                NAVIGATION
              </div>
              <ul className="space-y-2 text-white/60">
                <li>
                  <a href="/" className="hover:text-white transition-colors">Home</a>
                </li>
                <li>
                  <a href="/blog" className="hover:text-white transition-colors">Blog</a>
                </li>
              </ul>
            </div>
            <div>
              <div className="monospace text-sm text-white/40 mb-4 tracking-widest">
                SPECIALTIES
              </div>
              <ul className="space-y-2 text-white/60">
                <li>Prompt Engineering</li>
                <li>Framework Design</li>
                <li>Research Papers</li>
                <li>Context Optimization</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="monospace text-white/40 text-sm">
            © 2025 • TOP 0.1% PROMPT ENGINEER
          </div>
          <div className="flex gap-8 monospace text-sm text-white/40">
            <span>SYNE • UBUNTU • IOSEVKA</span>
            <span>•</span>
            <span>GSAP SCROLLTRIGGER</span>
          </div>
        </div>

        {/* Geometric accent */}
        <div className="absolute bottom-0 right-0 w-64 h-64 border border-white/5 rotate-45 pointer-events-none animate-pulse-slow" />
      </div>
    </footer>
  );
}

