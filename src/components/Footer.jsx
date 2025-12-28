"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Github, Linkedin, Mail, FileText } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const footerRef = useRef(null);

  useGSAP(() => {
    gsap.from(footerRef.current, {
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top bottom",
        end: "bottom bottom",
        toggleActions: "play none none reverse",
      },
      y: 20, // Reduced movement distance for a tighter feel
      opacity: 0,
      duration: 0.8,
    });
  }, { scope: footerRef });

  return (
    <footer ref={footerRef} className="relative py-10 px-6 border-t border-white/10 bg-black text-white overflow-hidden z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-12">

        {/* LEFT SIDE: Brand & Socials */}
        <div className="w-full md:w-auto">
          <h3 className="text-2xl font-bold mb-2 lowercase font-syne">let's build something</h3>
          <p className="text-white/50 text-sm mb-6 max-w-md font-mono">
            Context continuation. Framework development. Arxiv-ready research.
          </p>

          {/* Compact Social Row */}
          <div className="flex gap-3">
            {[
              { icon: Mail, label: "Email", href: "mailto:hello@ktg.one" },
              { icon: Github, label: "GitHub", href: "https://github.com" },
              { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
              { icon: FileText, label: "Papers", href: "/papers" },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className="group relative w-10 h-10 flex items-center justify-center border border-white/20 hover:border-white transition-colors duration-300"
                  aria-label={item.label}
                >
                  <Icon className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                </Link>
              );
            })}
          </div>

          <div className="mt-8 font-mono text-xs text-white/30 tracking-widest">
            © 2025 • TOP 0.01% PROMPT ENGINEER
          </div>
        </div>

        {/* RIGHT SIDE: Horizontal Links (Compressed) */}
        <div className="w-full md:w-auto text-left md:text-right space-y-6">

          {/* Navigation Row */}
          <div className="space-y-2">
            <div className="font-mono text-xs text-white/30 tracking-widest uppercase">Navigation</div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-sm font-syne font-bold text-white/80">
              <Link href="/" className="hover:text-white hover:underline decoration-white/30 underline-offset-4 transition-all">Home</Link>
              <Link href="/blog" className="hover:text-white hover:underline decoration-white/30 underline-offset-4 transition-all">Blog</Link>
              <Link href="/projects" className="hover:text-white hover:underline decoration-white/30 underline-offset-4 transition-all">System Audits</Link>
            </div>
          </div>

          {/* Specialties Row */}
          <div className="space-y-2">
            <div className="font-mono text-xs text-white/30 tracking-widest uppercase">Domain Expertise</div>
            <div className="flex flex-wrap md:justify-end gap-x-6 gap-y-2 text-xs font-mono text-white/50">
              <span>Prompt Engineering</span>
              <span>•</span>
              <span>Framework Design</span>
              <span>•</span>
              <span>Cognitive Architectures</span>
            </div>
          </div>

          {/* Tech Stack (Faded) */}
          <div className="pt-2 font-mono text-[10px] text-white/20">
            BUILT WITH: NEXT.JS • TAILWIND • GSAP • WORDPRESS HEADLESS
          </div>
        </div>

      </div>

      {/* Subtle Geometric Accent (Bottom Right Corner) */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 border border-white/5 rotate-45 pointer-events-none" />
    </footer>
  );
}