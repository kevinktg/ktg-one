# GSAP ScrollTrigger + Next.js 16 + Lenis Integration Guide

## Overview
This guide covers best practices for integrating GSAP ScrollTrigger, Lenis smooth scrolling, and SplitText with Next.js 16 App Router for optimal performance and smooth animations.

---

## 1. Lenis + GSAP Integration (Recommended Setup)

### Basic Setup with ReactLenis

```tsx
// src/libs/lenis.tsx
"use client";

import { ReactLenis as Lenis } from "lenis/react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ReactLenis({
  root,
  options,
  children,
  ...props
}: {
  root?: boolean;
  options?: any;
  children: React.ReactNode;
  [key: string]: any;
}) {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    if (!lenisRef.current?.lenis) return;

    // Sync Lenis with ScrollTrigger
    lenisRef.current.lenis.on("scroll", ScrollTrigger.update);

    // Add Lenis raf to GSAP ticker
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0); // Disable lag smoothing for immediate responsiveness

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <Lenis
      ref={lenisRef}
      root={root}
      options={{
        duration: 1.2, // Heavy, smooth feel
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        autoRaf: false, // We're using GSAP ticker instead
        ...options,
      }}
      {...props}
    >
      {children}
    </Lenis>
  );
}
```

### Layout Integration

```tsx
// src/app/layout.tsx
import { ReactLenis } from "@/libs/lenis";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReactLenis root>
          {children}
        </ReactLenis>
      </body>
    </html>
  );
}
```

---

## 2. ScrollTrigger Best Practices for Next.js

### Register Plugins in Client Component

```tsx
"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ScrollAnimations() {
  useEffect(() => {
    // Register plugins
    gsap.registerPlugin(ScrollTrigger);

    // Cleanup on unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return null;
}
```

### ScrollTrigger with Pinned Sections

```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function PinnedSection({ children }: { children: React.ReactNode }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger);

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=3000", // Pin for 3000px of scroll
        pin: true,
        pinSpacing: true,
        scrub: 1, // Smooth scrubbing with 1s delay
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="section">
      {children}
    </div>
  );
}
```

### ScrollTrigger with Timeline Animations

```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ScrollTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=2000",
          scrub: 1,
          pin: true,
          snap: {
            snapTo: "labels",
            duration: { min: 0.2, max: 3 },
            delay: 0.2,
            ease: "power1.inOut",
          },
        },
      });

      tl.addLabel("start")
        .from(".element-1", { y: 100, opacity: 0 })
        .addLabel("middle")
        .to(".element-2", { rotation: 360 })
        .addLabel("end")
        .to(".element-3", { scale: 1.5 });
    }, containerRef.current);

    return () => ctx.revert();
  }, []);

  return <div ref={containerRef}>...</div>;
}
```

---

## 3. SplitText Integration

### Basic SplitText Animation

```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

export function SplitTextAnimation({ text }: { text: string }) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const ctx = gsap.context(() => {
      gsap.registerPlugin(SplitText);

      const split = SplitText.create(textRef.current, {
        type: "words,chars",
        charsClass: "char",
        wordsClass: "word",
      });

      gsap.from(split.chars, {
        duration: 1,
        y: 100,
        autoAlpha: 0,
        stagger: 0.05,
        ease: "power2.out",
      });

      // Cleanup on unmount
      return () => {
        split.revert();
      };
    }, textRef.current);

    return () => ctx.revert();
  }, [text]);

  return <h1 ref={textRef}>{text}</h1>;
}
```

### SplitText with ScrollTrigger

```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

export function ScrollSplitText({ text }: { text: string }) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger, SplitText);

      const split = SplitText.create(textRef.current, {
        type: "words,chars",
      });

      gsap.from(split.chars, {
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 80%",
          end: "top 20%",
          scrub: true,
        },
        y: 50,
        opacity: 0,
        stagger: 0.02,
      });
    }, textRef.current);

    return () => ctx.revert();
  }, [text]);

  return <h2 ref={textRef}>{text}</h2>;
}
```

### Responsive SplitText with autoSplit

```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

export function ResponsiveSplitText({ text }: { text: string }) {
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const ctx = gsap.context(() => {
      gsap.registerPlugin(SplitText);

      SplitText.create(textRef.current, {
        type: "words,lines",
        autoSplit: true, // Re-split on resize/font load
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 20,
            opacity: 0,
            stagger: 0.1,
            duration: 1,
            ease: "power2.out",
          });
        },
      });
    }, textRef.current);

    return () => ctx.revert();
  }, [text]);

  return <p ref={textRef}>{text}</p>;
}
```

---

## 4. Next.js 16 Turbo Router Considerations

### Router Transition Tracking

```tsx
// src/app/instrumentation-client.ts (if using instrumentation)
export function onRouterTransitionStart(
  url: string,
  navigationType: "push" | "replace" | "traverse"
) {
  // Clean up ScrollTriggers before navigation
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  
  // Re-initialize after navigation if needed
  console.log(`Navigation: ${navigationType} to ${url}`);
}
```

### Cleanup on Route Changes

```tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ScrollTriggerManager() {
  const pathname = usePathname();

  useEffect(() => {
    // Cleanup all ScrollTriggers on route change
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    
    // Refresh after a brief delay to allow DOM updates
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }, [pathname]);

  return null;
}
```

### Disable Scroll on Navigation (Optional)

```tsx
"use client";

import { useRouter } from "next/navigation";

export function NavigationButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/about", { scroll: false }); // Prevents scroll to top
  };

  return <button onClick={handleClick}>Navigate</button>;
}
```

---

## 5. Performance Optimization Tips

### 1. Use GSAP Context for Cleanup

Always wrap GSAP code in `gsap.context()` for automatic cleanup:

```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    // All GSAP code here
  }, containerRef);

  return () => ctx.revert(); // Cleanup on unmount
}, []);
```

### 2. Batch ScrollTrigger Creation

```tsx
ScrollTrigger.batch(".animate-on-scroll", {
  onEnter: (batch) => {
    gsap.to(batch, {
      opacity: 1,
      y: 0,
      stagger: 0.1,
    });
  },
  start: "top 80%",
});
```

### 3. Use `invalidateOnRefresh` for Dynamic Content

```tsx
ScrollTrigger.create({
  trigger: element,
  start: "top center",
  invalidateOnRefresh: true, // Recalculate on resize
});
```

### 4. Optimize Lenis Configuration

```tsx
const lenisOptions = {
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
  autoRaf: false, // Use GSAP ticker instead
};
```

---

## 6. Common Patterns

### Long-Form Storytelling with Pinned Sections

```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function StorySection({ 
  id, 
  scrollDuration = 3000,
  children 
}: { 
  id: string;
  scrollDuration?: number;
  children: React.ReactNode;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger);

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${scrollDuration}`,
        pin: true,
        pinSpacing: true,
        id: id,
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, [id, scrollDuration]);

  return (
    <section ref={sectionRef} id={id} className="story-section">
      {children}
    </section>
  );
}
```

### Scroll Progress Indicator

```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger);

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          if (progressRef.current) {
            gsap.to(progressRef.current, {
              scaleX: self.progress,
              transformOrigin: "left",
            });
          }
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
      <div
        ref={progressRef}
        className="h-full bg-white origin-left"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
```

---

## 7. Troubleshooting

### ScrollTrigger Not Working with Lenis

**Solution:** Ensure Lenis is synced with ScrollTrigger:

```tsx
lenis.on("scroll", ScrollTrigger.update);
```

### Animations Jumping on Route Change

**Solution:** Clean up ScrollTriggers before navigation:

```tsx
useEffect(() => {
  return () => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  };
}, [pathname]);
```

### SplitText Causing Layout Shift

**Solution:** Use `font-kerning: none` and `text-rendering: optimizeSpeed`:

```css
.split-text {
  font-kerning: none;
  text-rendering: optimizeSpeed;
}
```

### Performance Issues with Many ScrollTriggers

**Solution:** Use `refreshPriority` and batch operations:

```tsx
ScrollTrigger.create({
  trigger: element,
  refreshPriority: -1, // Lower priority = refreshed less often
});
```

---

## 8. November 2025 Best Practices Summary

1. **Always use `gsap.context()`** for automatic cleanup
2. **Sync Lenis with GSAP ticker** for optimal performance
3. **Clean up ScrollTriggers on route changes** in Next.js
4. **Use `autoSplit: true`** for responsive SplitText
5. **Batch ScrollTrigger creation** for better performance
6. **Disable lag smoothing** when using Lenis: `gsap.ticker.lagSmoothing(0)`
7. **Use `invalidateOnRefresh`** for dynamic content
8. **Register plugins in client components** only

---

## Resources

- [GSAP ScrollTrigger Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger)
- [Lenis Documentation](https://github.com/darkroomengineering/lenis)
- [Next.js 16 App Router](https://nextjs.org/docs/app)
- [GSAP SplitText Plugin](https://gsap.com/docs/v3/Plugins/SplitText)

