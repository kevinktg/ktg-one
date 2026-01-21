# Jules Next.js 16 Comprehensive Site Audit

This audit evaluates the `ktg-one` codebase against Next.js 16 App Router best practices, focusing on layout architecture, styling, performance, and visual stability.

## 1. Layouts and Structure

### Current State
-   **Root Layout (`src/app/layout.jsx`):** Renders `ClientLayout`, `GeometricBackground` (fixed), and `CursorDot`.
-   **Client Layout (`src/components/ClientLayout.jsx`):** Wraps children in `ReactLenis` and renders `GlobalCursor`.
-   **Page (`src/app/page.jsx`):** Renders specific sections (`Hero`, `Expertise`, etc.) and explicitly renders `Header` and `Footer`.
-   **Blog (`src/app/blog/page.jsx`):** Explicitly renders `Header` and `Footer`.

### Issues & Recommendations

1.  **Duplicate Cursor Implementation:**
    -   **Issue:** The site renders two separate custom cursors. `RootLayout` renders `<CursorDot />` (z-99999), and `ClientLayout` renders `<GlobalCursor />` (z-9999). This causes unnecessary DOM weight and potential visual fighting.
    -   **Fix:** Consolidate to a single cursor component. `CursorDot` appears to be the newer/intended one based on its z-index and import in `layout.jsx`. Remove `GlobalCursor` from `ClientLayout`.

2.  **Repeated Shell Components:**
    -   **Issue:** `Header` and `Footer` are manually imported and rendered in `src/app/page.jsx`, `src/app/blog/page.jsx`, and `src/app/blog/[slug]/page.jsx`. This defeats the purpose of the App Router's persistent layouts, causing the header to unmount/remount on navigation (losing state/animations).
    -   **Fix:** Move `<Header />` and `<Footer />` into `src/app/layout.jsx` (or a route group layout if they need to be excluded from specific pages).

    ```jsx
    // src/app/layout.jsx
    export default function RootLayout({ children }) {
      return (
        <html lang="en">
          <body>
            <ClientLayout>
              <GeometricBackground fixed />
              <Header /> {/* Persistent across routes */}
              {children}
              <Footer /> {/* Persistent across routes */}
              <CursorDot />
            </ClientLayout>
          </body>
        </html>
      );
    }
    ```

3.  **Unused Imports:**
    -   **Issue:** `ClientLayout.jsx` imports `GeometricBackground` but does not use it.
    -   **Fix:** Remove the unused import.

## 2. Global CSS and Styling

### Current State
-   `src/app/globals.css` uses Tailwind 4 syntax (`@theme`).
-   Contains global resets, typography, and specific animations (`.background`, `animate-square`).
-   Uses `!important` on `body` background color.

### Issues & Recommendations

1.  **Global Animation Pollution:**
    -   **Issue:** The `.background` and `@keyframes animate-square` are in `globals.css`. These strictly belong to the `GeometricBackground` component. Keeping them global increases the bundle size for pages that might not use them (though currently all do) and risks name collisions.
    -   **Fix:** Move these styles into a CSS Module (`GeometricBackground.module.css`) or use Tailwind/CSS-in-JS within the component to encapsulate the logic.

2.  **Typography Strategy:**
    -   **Issue:** Headings (h1-h6) are styled globally in `globals.css` using `clamp()`. While `clamp` is excellent for responsiveness, applying it globally can make it hard to override for specific context (like a dense card UI).
    -   **Fix:** Keep the base styles but consider using Tailwind utility classes for specific section headings to ensure explicit control over size hierarchy.

## 3. Pages, Components, and Animations

### Current State
-   **Animations:** Heavy use of `GSAP` and `ScrollTrigger`.
-   **Hydration:** `HeroSection` and others use `suppressHydrationWarning` and `useEffect` checks for `window`.
-   **Performance:** `GeometricBackground` is memoized and logic is hoisted.

### Issues & Recommendations

1.  **`content-visibility: auto` Risk:**
    -   **Issue:** `ExpertiseSection.jsx` uses the class `content-visibility-auto` (via Tailwind or custom class). CSS `content-visibility` skips rendering work for off-screen content. However, GSAP `ScrollTrigger` relies on precise height calculations to determine start/end points. Using `content-visibility` can cause scroll markers to be miscalculated, leading to jarring jumps or broken animations.
    -   **Fix:** Remove `content-visibility-auto` from sections driven by ScrollTrigger pinning. Use standard virtualization if performance is truly an issue, but for landing pages, standard DOM rendering is usually safer for ScrollTrigger.

2.  **Session Storage Logic:**
    -   **Observation:** Components verify `sessionStorage` to skip intro animations. This is a good pattern for UX, but ensure the key names (`intro-completed`, `expertise-revealed`, `hero-animated`) are documented or consolidated in a constant file to prevent typo bugs.

## 4. Visual Stacking (Z-Index)

### Current State
-   Header: `z-[9999]`
-   Cursors: `z-[9999]` & `z-[99999]`
-   Sections: `z-30`, `z-40`, etc.
-   Background: `z-0` / `z-[-1]` (implied)

### Issues & Recommendations

1.  **Z-Index Inflation:**
    -   **Issue:** Using `z-[99999]` vs `z-[9999]` implies a battle for the top layer.
    -   **Fix:** Define a strict Z-index scale in `tailwind.config.js` or `globals.css` variables:
        -   `--z-negative`: -1 (Backgrounds)
        -   `--z-base`: 0 (Default)
        -   `--z-content`: 10-40 (Page Sections)
        -   `--z-sticky`: 50 (Nav/Header)
        -   `--z-overlay`: 100 (Modals, Dialogs)
        -   `--z-cursor`: 9999 (Cursor)
    -   Ensure the `Header` is strictly lower than the `Cursor` but higher than all `Page Sections`.

## 5. Responsiveness

### Current State
-   Uses `min-h-screen` and flexbox.
-   Mobile scrolling fix (`touch-auto`) applied to BlogPreview.

### Issues & Recommendations

1.  **Fluid Typography:**
    -   **Observation:** The use of `clamp()` in global headings is a strong modern pattern. Ensure that the minimum values in `clamp` are legible on small devices (e.g., 320px width).
    -   **Fix:** Verify `h1` minimum size. Currently `2rem` (32px). On very narrow phones, this might cause overflow if words are long (e.g., "Architecture"). Use `break-words` or slightly smaller minimums if needed.

## Summary of Action Plan

1.  **Cleanup Layouts:** Move `Header`/`Footer` to `RootLayout`. Remove unused `GeometricBackground` import in `ClientLayout`.
2.  **Fix Cursor:** Remove duplicate `GlobalCursor` usage.
3.  **Stability:** Remove `content-visibility-auto` from `ExpertiseSection` to ensure GSAP stability.
4.  **Refactor CSS:** Move global animation keyframes to component-specific styles if possible (low priority but cleaner).

This audit identifies the low-hanging fruit to improve stability and architectural cleanliness immediately.
