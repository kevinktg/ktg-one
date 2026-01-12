# Quick Visual Test Guide - UI Fixes
**5-Minute Validation Checklist**

## Pre-Test Setup (30 seconds)
```bash
# 1. Start dev server
npm run dev

# 2. Open browser console and clear storage
sessionStorage.clear()

# 3. Enable FPS meter
# Chrome DevTools → Rendering → FPS Meter → Enable
```

---

## Fix #1: ScrollTransition (1 minute)

### Visual Check:
1. **Load homepage** - Wait for Hero to appear
2. **Scroll down slowly** through Hero section
3. **Watch for:**
   - ✅ 5 black panels wipe from top to bottom
   - ✅ Smooth transition from black Hero to white Expertise
   - ✅ Hero section "sticks" at top during transition
   - ✅ No white flash or jump
   - ✅ Can scroll backwards to reverse animation

### Quick Fail Signs:
- ❌ White flash before shutters appear
- ❌ Hero section scrolls away instead of pinning
- ❌ Choppy/jittery animation
- ❌ Gaps between shutter panels

---

## Fix #2: ValidationSection (1 minute)

### Visual Check:
1. **Scroll down** past Hero and Expertise
2. **Continue to ValidationSection** (black section with "Subjective portfolios are obsolete" text)
3. **Watch for:**
   - ✅ White shutters wipe down to reveal section (first visit only)
   - ✅ Black background with white text visible
   - ✅ Continue scrolling - card should pin at top
   - ✅ Content scrolls horizontally inside card
   - ✅ Can see 5 audit panels: Intro → Audit → Percentile → Evidence → Verdict

### Quick Fail Signs:
- ❌ Section invisible or transparent
- ❌ Text not readable
- ❌ Shutters don't animate
- ❌ Card scrolls off screen instead of pinning
- ❌ Content doesn't scroll horizontally

---

## Fix #3: GeometricBackground (1 minute)

### Visual Check:
1. **Load homepage** - Look for animated squares immediately
2. **Scroll through ALL sections:**
   - Hero (black background)
   - Expertise (white background)
   - ValidationSection (black background)
   - Philosophy (black background)
   - Blog (black background)
   - Footer (black background)
3. **Watch for:**
   - ✅ White squares floating up on ALL sections
   - ✅ Squares visible on black backgrounds (white/light)
   - ✅ Squares visible on white backgrounds (inverted to black)
   - ✅ Grid lines visible everywhere
   - ✅ Static geometric shapes (rotated squares, circles) visible

### Quick Fail Signs:
- ❌ Squares only visible in footer
- ❌ Squares invisible on white sections
- ❌ Shapes disappear when scrolling
- ❌ No grid lines visible

---

## Fix #4: CursorDot (1 minute)

### Visual Check:
1. **Move mouse** over Hero section
2. **Continue moving mouse** through each section:
   - Hero (black background)
   - Expertise (white background)
   - ValidationSection (black background)
   - Footer (black background)
3. **Watch for:**
   - ✅ 12-dot trail follows cursor on ALL sections
   - ✅ Dots visible on black backgrounds (white/light)
   - ✅ Dots visible on white backgrounds (inverted to black)
   - ✅ Leader dot follows tightly, tail lags behind
   - ✅ Dots fade out after stopping mouse for 2 seconds
   - ✅ Dots reappear when moving mouse again

### Quick Fail Signs:
- ❌ Trail missing in any section
- ❌ Dots invisible on white backgrounds
- ❌ Dots don't follow mouse
- ❌ Dots stuck or frozen
- ❌ Trail doesn't lag (all dots on same position)

---

## Cross-Browser Quick Test (1 minute)

### Chrome/Edge:
- [ ] All 4 fixes working

### Firefox:
- [ ] All 4 fixes working

### Safari (if available):
- [ ] All 4 fixes working

---

## Performance Quick Check (30 seconds)

**Check FPS meter while scrolling:**
- ✅ Should stay at 60fps (or close)
- ❌ If drops below 50fps = FAIL

**Check console for errors:**
- ✅ No errors = PASS
- ❌ Any errors = FAIL (note error message)

---

## Overall Status

### All Tests Pass? ✅
**You should see:**
- Smooth black-to-white transition when scrolling from Hero to Expertise
- ValidationSection fully visible with white text on black background
- Animated geometric shapes everywhere (not just footer)
- Cursor trail working across all sections
- 60fps performance
- No console errors

### Any Test Fails? ❌
**Document:**
1. Which test failed
2. Browser/viewport
3. Screenshot or video
4. Console errors
5. Report to swarm

---

## Emergency Debug Commands

```javascript
// Browser console commands:

// Check if ScrollTriggers are set up
ScrollTrigger.getAll()

// Force refresh ScrollTriggers
ScrollTrigger.refresh()

// Check sessionStorage (for ValidationSection shutters)
sessionStorage.getItem('validation-animated')

// Clear sessionStorage to replay ValidationSection shutters
sessionStorage.clear()

// Check if GSAP is loaded
gsap.version

// Check Lenis smooth scroll
window.lenis
```

---

## Test Result Template

Copy/paste after testing:

```markdown
## Quick Test Results - [DATE]

**Browser:** [Chrome/Firefox/Safari] [Version]
**Viewport:** [1920x1080 / 375x667 / etc]

### Results:
- [ ] ScrollTransition: [PASS/FAIL]
- [ ] ValidationSection: [PASS/FAIL]
- [ ] GeometricBackground: [PASS/FAIL]
- [ ] CursorDot: [PASS/FAIL]

### FPS: [X fps]
### Console Errors: [None / Error message]

### Issues Found:
1. [Issue 1 description]
2. [Issue 2 description]

### Screenshots:
[Attach if any failures]
```

---

**Total Time:** ~5 minutes
**Next Step:** If all pass → Production ready. If any fail → Detailed testing with full test strategy.
