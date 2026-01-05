"use client";

import { ReactLenis } from "@/libs/lenis";
import { GeometricBackground } from "./GeometricBackground";
import { GlobalCursor } from "./GlobalCursor";

export function ClientLayout({ children }) {
  return (
    <ReactLenis root>
      <div className="relative min-h-screen">
        <GeometricBackground />
        <GlobalCursor />
        {children}
      </div>
    </ReactLenis>
  );
}

