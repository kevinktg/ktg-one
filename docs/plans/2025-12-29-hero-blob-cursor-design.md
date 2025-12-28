# Hero Blob Cursor Reveal - Design Document

**Date**: 2025-12-29
**Feature**: Interactive blob cursor that reveals cyberpunk avatar behind ktg.svg logo
**Priority**: Hero section redesign - replaces current hero with premium interactive effect

---

## Overview

Transform the hero section into an interactive reveal experience. A large ktg.svg logo fills the viewport by default. As users move their cursor, an organic blob shape follows with a trailing effect, erasing the logo to reveal a cyberpunk avatar underneath against a neon grid background.

---

## Visual Concept

### Default State
- Large ktg.svg logo (scaled to ~80vh) centered on black background
- Existing hero text (title/subtitle) visible with high contrast
- Geometric background shapes (current floating squares/circles) remain

### Revealed State (via blob cursor)
- Cyberpunk avatar (`/assets/profile.svg`) centered
- CSS-generated grid background with cyan lines + purple radial glow
- Dark gradient base (dark purple to near-black)

### Interactive State
- Blob cursor follows mouse with smooth lag (~150ms)
- Speed-based trailing blobs fade out behind main blob
- Text fades to 20% opacity when blob is within 200px radius
- Text returns to 100% opacity when blob moves away

---

## Technical Architecture

### Layer Stack (z-index order, bottom to top)

1. **Revealed Layer** (`z-index: 1`)
   - Cyberpunk background (CSS grid + radial glow)
   - Avatar image (`/assets/profile.svg`, ~400px, centered)

2. **Mask Layer** (`z-index: 2`)
   - Large ktg.svg logo (~80vh height, centered)
   - Dynamic `clip-path` applied based on blob cursor position
   - Areas where blob has passed become transparent

3. **Blob Canvas** (`z-index: 3`)
   - Canvas element for visual blob rendering
   - `pointer-events: none` (purely decorative)
   - Shows the blob cursor shape itself

4. **Text Layer** (`z-index: 4`)
   - Existing hero title/subtitle
   - Dynamic opacity based on blob proximity

---

## Component Structure

```jsx
<section className="hero relative min-h-screen">
  {/* Layer 1: Revealed Background */}
  <div className="hero-revealed absolute inset-0 z-10">
    <div className="cyberpunk-background" />
    <Image src="/assets/profile.svg" className="avatar" />
  </div>

  {/* Layer 2: Logo Mask */}
  <div className="hero-mask absolute inset-0 z-20" ref={maskRef}>
    <Image src="/assets/ktg.svg" className="logo-large" />
  </div>

  {/* Layer 3: Blob Canvas */}
  <canvas ref={canvasRef} className="blob-canvas absolute inset-0 z-30" />

  {/* Layer 4: Text Content */}
  <div className="hero-text relative z-40" ref={textRef}>
    {/* Existing title/subtitle */}
  </div>

  {/* Background: Existing geometric shapes */}
  <div className="geometric-shapes">{/* Current floating shapes */}</div>
</section>
```

---

## Blob Cursor Implementation

### Algorithm

**Core Mechanics:**
- Track cursor position at 60fps via `requestAnimationFrame`
- Main blob follows cursor with easing: `currentPos += (targetPos - currentPos) * 0.15`
- Spawn trail blob at cursor position each frame (when cursor moves)
- Maintain array of 8-10 trail blobs, each with: `{ x, y, size, opacity, age }`
- Each frame: age trail blobs, fade opacity, remove when fully transparent

**Canvas Rendering:**
- Use `canvas.getContext('2d')`
- Set `globalCompositeOperation = 'lighter'` for metaball blending
- Draw each blob as radial gradient circle (opaque center, transparent edges)
- Main blob: ~150-200px diameter
- Trail blobs: ~80-120px diameter, decreasing size with age

**Mask Application:**
- Export canvas as image data
- Convert blob positions to SVG `<path>` coordinates
- Apply as `clip-path: path(...)` to mask layer
- Inverse the path (logo visible where blob hasn't been)

**Performance Optimizations:**
- Skip frames when cursor idle (> 100ms without movement)
- Canvas matches viewport size, cleared each frame
- Use `will-change: clip-path` on mask layer
- Debounce resize events

---

## Cyberpunk Background Styling

### CSS Implementation

```css
.cyberpunk-background {
  position: absolute;
  inset: 0;

  /* Base gradient: dark purple to near-black */
  background: radial-gradient(
    circle at center,
    #1a1a2e 0%,
    #0a0a0f 100%
  );

  /* Cyan grid overlay */
  background-image:
    linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
}

.cyberpunk-background::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(
    circle,
    rgba(138, 43, 226, 0.3) 0%,
    transparent 70%
  );
  filter: blur(60px);
  z-index: -1;
}
```

### Avatar Styling

```css
.avatar {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: auto;
  filter: drop-shadow(0 0 40px rgba(138, 43, 226, 0.6));
  z-index: 10;
}
```

---

## Text Fade Interaction

**Distance-Based Opacity:**

```javascript
// Calculate distance between blob center and text element center
const distance = Math.hypot(
  blobX - textCenterX,
  blobY - textCenterY
);

const fadeRadius = 200; // px

if (distance < fadeRadius) {
  // Fade from 100% to 20% as blob gets closer
  const opacity = 0.2 + (0.8 * (distance / fadeRadius));
  textElement.style.opacity = opacity;
} else {
  textElement.style.opacity = 1;
}

// Smooth transition
textElement.style.transition = 'opacity 300ms ease-out';
```

**Applied to:**
- Main title element
- Subtitle element
- Any decorative lines/bars

---

## Logo Scaling

**ktg.svg Sizing:**
- Height: `80vh` (fills most of viewport vertically)
- Width: Maintains aspect ratio
- Position: Absolute center (`top: 50%, left: 50%, transform: translate(-50%, -50%)`)
- Object-fit: `contain`

**Ensures:**
- Logo is large enough to feel like a "cover/mask"
- Still reveals significant avatar area per blob swipe
- Responsive across viewport sizes

---

## Integration with Existing Hero

### What Changes
- **Replace current hero-shape animations** with blob cursor
- **Replace profile image section** with layered reveal structure
- **Keep title/subtitle** but add proximity fade logic
- **Remove mouse parallax on shapes** (conflicts with blob interaction)

### What Stays
- Black background theme
- Font choices (Syne for title, Ubuntu Mono for subtitle)
- Entrance animations (title/subtitle fade-in on load)
- Scroll transition to Expertise section (fade out hero as user scrolls)

### Files Modified
- `src/components/HeroSection.jsx` - Complete rebuild
- `src/app/globals.css` - Add cyberpunk background utilities
- `public/assets/profile.svg` - New asset (user provides)

---

## Accessibility Considerations

- **Reduced motion**: If `prefers-reduced-motion`, disable blob trails (show only static cursor circle)
- **Keyboard navigation**: Blob doesn't interfere with tab navigation through text links
- **Screen readers**: Hidden decorative layers (`aria-hidden="true"` on canvas/backgrounds)
- **Performance**: Fallback to simple fade transition on low-end devices (detect via `navigator.hardwareConcurrency`)

---

## Success Criteria

✅ Blob cursor follows mouse smoothly (60fps) with organic lag
✅ Trail blobs fade naturally based on cursor speed
✅ Logo erases progressively as blob moves over it
✅ Cyberpunk avatar + grid background visible underneath
✅ Text fades when blob is nearby, returns when blob moves away
✅ No performance degradation (GSAP scroll animations still 60fps)
✅ Works across desktop viewports (1920x1080 to 2560x1440)
✅ Reduced motion users get simpler, accessible experience

---

## Open Questions

- Should blob "reset" (logo reappears) if user is idle for N seconds?
- Should there be a subtle hint/instruction on first load ("Move your cursor to reveal")?
- Mobile behavior: Tap to reveal, or disable entirely and show static reveal?

---

## Next Steps

1. Set up git worktree for isolated development
2. Create detailed implementation plan (task breakdown)
3. Build canvas blob cursor system
4. Implement layer structure + clip-path masking
5. Add cyberpunk background styling
6. Test performance + cross-browser compatibility
7. Add reduced motion fallback
