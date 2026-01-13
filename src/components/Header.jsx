"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="fixed top-0 right-0 z-[9999] p-6 flex justify-end items-start pointer-events-none">
      <div className="pointer-events-auto flex gap-4">

        <Button variant="ghost" asChild className="text-white/50 hover:text-white font-mono tracking-widest text-xs cursor-pointer">
          <Link href="/">
            HOME
          </Link>
        </Button>

        <Button variant="outline" asChild className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 hover:text-white text-white/80 transition-all duration-300 font-mono tracking-widest text-xs h-9 px-4 rounded-full" style={{ fontFamily: 'Syne, sans-serif' }}>
          <Link href="/blog">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
            INSIGHTS
          </Link>
        </Button>

      </div>
    </header>
  );
}
