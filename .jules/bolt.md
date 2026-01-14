## 2024-05-22 - [R3F Callback Stability]
**Learning:** Passing unstable inline callbacks to components wrapping React Three Fiber logic (like `RevealPlane`) can cause expensive resource re-loading (textures, shaders) if those callbacks are dependencies in `useEffect` hooks. This defeats the purpose of caching and causes visual glitches or wasted bandwidth.
**Action:** Always wrap callbacks passed to R3F-related components in `useCallback` to ensure stable references across renders.

## 2025-02-18 - [Redundant Geometric Backgrounds]
**Learning:** Stacking multiple instances of heavy animated background components (like `GeometricBackground`) creates unnecessary DOM nodes and animation overhead. In `PhilosophySection`, a local absolute instance was rendering on top of the global fixed instance, masked by an opaque background color.
**Action:** Identify global fixed backgrounds and make overlaying sections transparent where possible to reuse the existing background instance instead of duplicating it.
