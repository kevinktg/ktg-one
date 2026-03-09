## 2024-05-22 - [R3F Callback Stability]
**Learning:** Passing unstable inline callbacks to components wrapping React Three Fiber logic (like `RevealPlane`) can cause expensive resource re-loading (textures, shaders) if those callbacks are dependencies in `useEffect` hooks. This defeats the purpose of caching and causes visual glitches or wasted bandwidth.
**Action:** Always wrap callbacks passed to R3F-related components in `useCallback` to ensure stable references across renders.

## 2024-05-24 - [Static Uniform Updates in R3F]
**Learning:** Assigning static uniforms (like textures) inside the `useFrame` loop is redundant and causes unnecessary CPU overhead on every frame.
**Action:** Move static uniform updates to a `useEffect` hook that runs only when the relevant data changes, keeping the `useFrame` loop clean for only dynamic values.

## 2024-05-24 - [Package Lock Noise]
**Learning:** Running `npm install` can update `package-lock.json` even if no dependencies are added, creating noise in PRs.
**Action:** Always restore `package-lock.json` if the task does not involve dependency updates, or use `npm ci` (if appropriate for the environment) to avoid modifying the lockfile.

## 2024-05-25 - [Event-Driven requestAnimationFrame]
**Learning:** Using a continuous `requestAnimationFrame` loop for simple DOM updates (like cursor position) consumes unnecessary idle CPU/GPU cycles, especially when interpolation is handled by CSS transitions.
**Action:** Refactor continuous `requestAnimationFrame` loops into event-driven patterns where the frame is only requested in response to user interaction (e.g., inside a `mousemove` handler).
