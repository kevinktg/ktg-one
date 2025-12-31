"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Github, Linkedin, Mail, FileText } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export function Footer() {
  const footerRef = useRef(null);

  useGSAP(() => {
    // Check if animation has already played this session
    const hasPlayed = sessionStorage.getItem('footer-animated') === 'true';

    if (hasPlayed) {
      // Skip animation - set final state immediately
      if (footerRef.current) gsap.set(footerRef.current, { opacity: 1, y: 0 });
      return;
    }

    // Subtle fade in - Run once on mount
    gsap.from(footerRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      onComplete: () => {
        sessionStorage.setItem('footer-animated', 'true');
      }
    });
  }, { scope: footerRef });

  return (
    <footer ref={footerRef} className="relative py-12 md:py-16 px-6 md:px-8 border-t border-border bg-background overflow-hidden z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-16">
          
          {/* LEFT SIDE: Brand & Socials */}
          <div className="flex-1">
            <div className="mb-6">
              <h3 className="font-syne text-sm font-bold lowercase text-foreground mb-3">let's build something</h3>
              <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                Context continuation. Framework development. Arxiv-ready research.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mb-8">
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
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-200"
                    aria-label={item.label}
                  >
                    <Icon className="w-4 h-4" />
                  </Link>
                );
              })}
            </div>

            <div className="text-xs text-muted-foreground">
              © 2025
            </div>
          </div>

          {/* RIGHT SIDE: Links */}
          <div className="flex flex-col md:flex-row gap-12 md:gap-16">
            
            {/* Navigation */}
            <div className="space-y-3">
              <div className="font-syne text-xs font-bold lowercase text-muted-foreground">navigation</div>
              <div className="flex flex-col gap-2">
                <Link href="/" className="text-sm text-foreground/80 hover:text-foreground transition-colors duration-200">Home</Link>
                <Link href="/blog" className="text-sm text-foreground/80 hover:text-foreground transition-colors duration-200">Blog</Link>
                <Link href="/projects" className="text-sm text-foreground/80 hover:text-foreground transition-colors duration-200">Projects</Link>
              </div>
            </div>

            {/* Expertise */}
            <div className="space-y-3">
              <div className="font-syne text-xs font-bold lowercase text-muted-foreground">expertise</div>
              <div className="flex flex-col gap-2">
                <span className="text-sm text-foreground/60">Prompt Engineering</span>
                <span className="text-sm text-foreground/60">Framework Design</span>
                <span className="text-sm text-foreground/60">Cognitive Architectures</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </footer>
  );
}