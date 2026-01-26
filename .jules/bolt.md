## 2024-05-22 - [R3F Callback Stability]
**Learning:** Passing unstable inline callbacks to components wrapping React Three Fiber logic (like `RevealPlane`) can cause expensive resource re-loading (textures, shaders) if those callbacks are dependencies in `useEffect` hooks. This defeats the purpose of caching and causes visual glitches or wasted bandwidth.
**Action:** Always wrap callbacks passed to R3F-related components in `useCallback` to ensure stable references across renders.

## 2026-01-26 - Optimizing R3F Uniform Updates
**Learning:** Moving static uniform assignments (like textures and aspect ratios) from `useFrame` to `useEffect` in React Three Fiber components reduces unnecessary CPU cycles. In this specific case, texture uniforms were being reassigned 60 times a second unnecessarily.
**Action:** Always audit `useFrame` loops for invariant assignments and move them to `useEffect` or relevant event handlers.
