"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="fixed top-0 right-0 z-[9999] p-6 flex justify-end items-start pointer-events-none">
      <nav aria-label="Main navigation" className="pointer-events-auto flex items-center gap-4">

        <Button
          variant="ghost"
          asChild
          className="group relative overflow-hidden text-white/50 hover:text-white tracking-widest text-xs cursor-pointer px-3 transition-colors duration-1000 motion-reduce:transition-none"
        >
          <Link href="/">
            <span className="relative z-10 transition-transform duration-1000 ease-out group-hover:-translate-y-0.5 motion-reduce:transform-none">
              home
            </span>
            <span
              aria-hidden="true"
              className="absolute bottom-1 left-2 right-2 h-0.5 bg-white/70 origin-left scale-x-0 transition-transform duration-1000 ease-out group-hover:scale-x-100 motion-reduce:hidden"
            />
          </Link>
        </Button>

        <Button
          variant="outline"
          asChild
          className="group relative overflow-hidden bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 hover:border-white/30 hover:text-white text-white/80 transition-all duration-1000 ease-out font-syne tracking-widest text-xs h-9 px-4 rounded-full font-bold motion-reduce:transition-none"
        >
          <Link href="/blog">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse shrink-0" />
            <span className="relative z-10 transition-transform duration-1000 ease-out group-hover:-translate-y-0.5 motion-reduce:transform-none">
              insights
            </span>
            <span
              aria-hidden="true"
              className="absolute bottom-1.5 left-4 right-4 h-0.5 bg-emerald-400/80 origin-left scale-x-0 transition-transform duration-1000 ease-out group-hover:scale-x-100 motion-reduce:hidden"
            />
          </Link>
        </Button>

        <Button
          variant="outline"
          asChild
          className="group relative overflow-hidden bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 hover:border-white/30 hover:text-white text-white/80 transition-all duration-1000 ease-out font-syne tracking-widest text-xs h-9 px-4 rounded-full font-bold motion-reduce:transition-none"
        >
          <Link href="/hub/snippets">
            <span className="relative z-10 transition-transform duration-1000 ease-out group-hover:-translate-y-0.5 motion-reduce:transform-none">
              hub
            </span>
            <span
              aria-hidden="true"
              className="absolute bottom-1.5 left-4 right-4 h-0.5 bg-white/70 origin-left scale-x-0 transition-transform duration-1000 ease-out group-hover:scale-x-100 motion-reduce:hidden"
            />
          </Link>
        </Button>

      </nav>
    </header>
  );
}
