"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function Header() {
  return (
    <header className="fixed top-0 right-0 z-[100] p-6 flex justify-end items-start pointer-events-none">
      <div className="pointer-events-auto">
        <NavigationMenu>
          <NavigationMenuList className="gap-2">

            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                 <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent text-white/50 hover:text-white font-mono tracking-widest text-xs")}>
                   HOME
                 </NavigationMenuLink>
               </Link>
             </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/blog" legacyBehavior passHref>
                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:text-white text-white/80 transition-all duration-300 font-mono tracking-widest text-xs")}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                  INSIGHTS
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}
