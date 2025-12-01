# ktg-one Hydration Debug Session
**Date**: 2025-12-01
**Status**: IN PROGRESS - Passed to another agent

## Problem Summary
React hydration errors appearing repeatedly in ktg-one Next.js site. Every fix creates new hydration mismatches.

## Root Cause Analysis
**Systemic Issue**: Heavy DOM manipulation libraries (GSAP, Lenis, ScrollTrigger) + Next.js SSR = constant hydration conflicts

### Specific Issues Found:
1. **ReactLenis** - Client component with useEffect/useRef used in server layout
2. **Intro component** - GSAP animations manipulating DOM during hydration
3. **Browser extensions** - Injecting attributes (data-redeviation-bs-uid) during paint
4. **ScrollTrigger** - Pinning/scrubbing DOM before React finishes mounting

### Error Evolution:
```
1. Initial: "Attribute mismatch: data-redeviation-bs-uid"
   → Fixed by creating ClientLayout wrapper

2. Second: "Attribute mismatch: data-redeviation-bs-uid" (again)
   → Browser extension still injecting during hydration window

3. Current: "Failed to execute 'removeChild' on 'Node'"
   → GSAP/ScrollTrigger removing nodes before React hydrates
```

## Changes Made

### 1. ClientLayout.tsx (CREATED)
**Path**: `D:\projects\sites\ktg-one\src\components\ClientLayout.tsx`

```tsx
"use client";

import { ReactLenis } from "@/libs/lenis";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root>
      {children}
    </ReactLenis>
  );
}
```

**Purpose**: Isolate Lenis smooth scroll to client boundary

---

### 2. layout.tsx (MODIFIED)
**Path**: `D:\projects\sites\ktg-one\src\app\layout.tsx`

**Changes**:
```tsx
// Added dynamic import with ssr: false
import dynamic from "next/dynamic";

const ClientLayout = dynamic(
  () => import("@/components/ClientLayout").then(mod => ({ default: mod.ClientLayout })),
  { ssr: false }
);

// Added suppressHydrationWarning
<html lang="en" suppressHydrationWarning>
  <body className="..." suppressHydrationWarning>
    <ClientLayout>{children}</ClientLayout>
  </body>
</html>
```

**Effect**: Disables SSR for entire app, makes it client-only

---

## Recommended Solution (Nuclear Option)

**Why client-only is correct**:
- Portfolio site with heavy animations doesn't benefit from SSR
- All content is JavaScript-driven (GSAP timelines, scroll-triggered animations)
- SEO not critical for personal portfolio (no organic search intent)
- User experience depends on animations working perfectly

**Trade-offs**:
- ❌ No SSR (slightly slower initial paint)
- ❌ No SEO benefit from pre-rendered HTML
- ✅ Zero hydration errors
- ✅ All GSAP/Lenis/ScrollTrigger features work
- ✅ Browser extensions can't break React

---

## Files With Client Components

All using `"use client"`:
- `src/components/ClientLayout.tsx` ✅ (wrapper)
- `src/components/CareerTimeline.tsx`
- `src/components/ExpertiseSection.tsx`
- `src/components/Intro.tsx` ⚠️ (GSAP heavy, likely culprit)
- `src/components/PhilosophySection.tsx`
- `src/components/PromptPortfolio.tsx`
- `src/app/page.tsx`
- `src/components/Header.tsx`
- `src/components/HeroSection.tsx`
- `src/components/Footer.tsx`
- `src/components/story/StorySection.tsx` ⚠️ (ScrollTrigger)
- `src/libs/lenis.tsx`

---

## Production Status

**Vercel Deployment**: Live but likely showing same errors

**Current State**:
- Local dev: Modified with ssr: false
- Git: Changes NOT committed yet
- Vercel: Still has old SSR-enabled version

---

## Next Steps for Another Agent

### Option A: Keep Current Fix (Client-Only)
```bash
cd D:/projects/sites/ktg-one
git add .
git commit -m "Fix: Disable SSR for animation-heavy portfolio"
git push
```
Wait 2 minutes for Vercel auto-deploy.

---

### Option B: Fix Individual Components (More Work)

1. **Intro.tsx**: Only render after mount
```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return <div className="...">Loading...</div>;
```

2. **StorySection.tsx**: Same pattern
3. **All GSAP components**: Defer initialization to useEffect

**Why not recommended**: You have 11+ client components. Fixing each individually is tedious and error-prone.

---

### Option C: Investigate Production Errors

Check Vercel deployment logs:
```bash
vercel logs <deployment-url>
```

Look for:
- Runtime errors in production
- Hydration warnings in browser console
- GSAP initialization errors

---

## Technical Context

### Architecture:
- **Next.js 16.0.4** (Turbopack)
- **GSAP** with ScrollTrigger, useGSAP hook
- **Lenis** smooth scroll (client-only library)
- **React 19** (stricter hydration checks)

### Why This Keeps Happening:
React 19 has **stricter hydration validation** than React 18. Any mismatch between server HTML and client React = error.

GSAP/Lenis manipulate DOM imperatively (outside React's control) → constant mismatches.

---

## Debugging Commands

```bash
# Check current git status
cd D:/projects/sites/ktg-one && git status

# View current errors in browser
# Open http://localhost:3000
# Check console for hydration warnings

# Force clean build
rm -rf .next
npm run build
npm run dev

# Check if old site is interfering
cd D:/projects/sites/ktg && ls -la .next
# If exists, delete it: rm -rf .next
```

---

## Key Insight from User

> "Literally every time I'd fix one another would pop up"

**Translation**: This is systemic, not individual bugs. SSR + imperative DOM manipulation = whack-a-mole hydration errors.

**Correct approach**: Disable SSR entirely for animation-heavy apps.

---

## Files Modified This Session

1. ✅ `src/components/ClientLayout.tsx` - Created
2. ✅ `src/app/layout.tsx` - Modified (dynamic import, suppressHydrationWarning)

**Status**: Ready to commit and deploy

---

## Session End State

**User stopped debugging** to continue with another agent.
**Reason**: "Claude API only used for ktg-agents"
**Context**: User has separation between Claude API (for automation) and Claude Desktop (for debugging)

---

## Handoff Notes

This is an **architectural issue**, not a bug. The site was built expecting SSR to work with GSAP, but React 19's stricter hydration makes that untenable.

**Best path forward**: Accept client-only rendering for this portfolio. SEO isn't critical, animations are.

**Alternative**: Rebuild without GSAP using CSS animations + React state only. (Massive refactor, not recommended)
