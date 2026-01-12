# Library Documentation Reference

**Generated:** 2025-01-28  
**Project:** KTG One Portfolio Site  
**Purpose:** Comprehensive reference for all libraries, patterns, and best practices used in the project

---

## Table of Contents

1. [Next.js 16 Documentation](#nextjs-16-documentation)
2. [Three.js & React Three Fiber](#threejs--react-three-fiber)
3. [Vercel & Speed Insights](#vercel--speed-insights)
4. [Cursor Blob Reveal Hero Pattern](#cursor-blob-reveal-hero-pattern)
5. [CSS Background Automations](#css-background-automations)
6. [2026 Web Development Trends](#2026-web-development-trends)
7. [Cursor IDE & MCP Integration](#cursor-ide--mcp-integration)
8. [MCP Docker Server](#mcp-docker-server)

---

## Next.js 16 Documentation

### Key Features & Patterns

#### Cache Components (Next.js 16)
- **Enable in config:** `cacheComponents: true` in `next.config.js`
- **Directives:**
  - `'use cache'` - Public cache, shared across all users
  - `'use cache: remote'` - Runtime cache, shared across users
  - `'use cache: private'` - Per-user cache, never shared

#### Data Fetching Strategies

**Static Generation (SSG-like):**
```jsx
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'force-cache' // or omit (default)
  })
  return res.json()
}
```

**Dynamic Rendering (SSR-like):**
```jsx
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'no-store' // Always fetch fresh
  })
  return res.json()
}
```

**ISR (Incremental Static Regeneration):**
```jsx
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 60 } // Revalidate every 60 seconds
  })
  return res.json()
}
```

#### Server Components vs Client Components

**Server Component (default):**
```jsx
// No 'use client' directive
export default async function Page() {
  const data = await fetch('https://api.example.com/data')
  return <div>{/* render data */}</div>
}
```

**Client Component:**
```jsx
'use client'

export default function InteractiveComponent() {
  const [state, setState] = useState(0)
  return <button onClick={() => setState(state + 1)}>Click</button>
}
```

#### Caching Best Practices

**Cache Life Management:**
```jsx
import { cacheLife, cacheTag } from 'next/cache'

async function getCachedData() {
  'use cache: remote'
  cacheTag('products')
  cacheLife({ expire: 300 }) // 5 minutes
  return await fetch('https://api.example.com/products')
}
```

**Cache Invalidation:**
```jsx
import { revalidateTag, refresh } from 'next/cache'

// Invalidate by tag
revalidateTag('products')

// Refresh router (Server Actions only)
refresh()
```

#### Performance Optimizations

- **Streaming with Suspense:** Wrap async components in `<Suspense>` for progressive rendering
- **Route Prefetching:** Use `Link` component with `prefetch={true}` (default) for faster navigation
- **Image Optimization:** Use `next/image` component with proper sizing
- **Font Optimization:** Use `next/font` with `display: 'swap'` for better CLS scores

### Project Implementation

**Current Usage:**
- App Router architecture (`src/app/`)
- Server Components for data fetching (`src/lib/wordpress.js`)
- Client Components for interactivity (`src/components/`)
- ISR with `revalidate: 60` on homepage
- `cache: 'no-store'` for WordPress API calls

**Files:**
- `src/app/layout.jsx` - Root layout with fonts and metadata
- `src/app/page.jsx` - Homepage with server-side data fetching
- `src/lib/wordpress.js` - WordPress REST API client

---

## Three.js & React Three Fiber

### Core Concepts

#### React Three Fiber Basics
- Declarative 3D scene graph using React components
- Automatic scene management and cleanup
- Built-in hooks: `useFrame`, `useThree`, `useFBO`

#### Performance Optimization Patterns

**Device Pixel Ratio Capping:**
```jsx
<Canvas
  dpr={typeof window !== 'undefined' 
    ? Math.min(window.devicePixelRatio, 2) 
    : 2
  }
/>
```

**Texture Anisotropy Optimization:**
```jsx
const anisotropy = typeof window !== 'undefined' 
  ? (window.devicePixelRatio > 2 ? 4 : 8)
  : 8
texture.anisotropy = anisotropy
```

**FBO Resolution Capping:**
```jsx
const maxPixelRatio = typeof window !== 'undefined' 
  ? Math.min(gl.getPixelRatio(), window.devicePixelRatio > 2 ? 1.5 : 2)
  : 2
const fboWidth = Math.floor(size.width * maxPixelRatio)
const fboHeight = Math.floor(size.height * maxPixelRatio)
```

### Shader Patterns

#### Custom ShaderMaterial
```jsx
class CustomMaterial extends ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: null }
      },
      vertexShader: customVertexShader,
      fragmentShader: customFragmentShader,
      transparent: true
    })
  }
}

extend({ CustomMaterial })
```

#### Ping-Pong FBO Pattern (Critical for Feedback Loops)

**Problem:** Reading and writing to the same FBO causes feedback loops

**Solution:** Use two FBOs that swap roles each frame

```jsx
const fbo1 = useFBO(width, height, { /* config */ })
const fbo2 = useFBO(width, height, { /* config */ })

const readRef = useRef(fbo1)
const writeRef = useRef(fbo2)

useFrame(() => {
  // Read from current read buffer
  material.uniforms.fbTexture.value = readRef.current.texture
  
  // Write to current write buffer
  gl.setRenderTarget(writeRef.current)
  gl.render(scene, camera)
  gl.setRenderTarget(null)
  
  // Swap buffers
  const temp = readRef.current
  readRef.current = writeRef.current
  writeRef.current = temp
})
```

### Project Implementation

**Hero Images Blob Reveal** (`src/components/HeroImages.jsx`):

**Architecture:**
1. **Blob Component** - Creates ping-pong FBO mask with cursor tracking
2. **DualImageReveal Component** - Blends two images based on blob mask
3. **Scene Component** - Orchestrates blob and reveal, handles pointer tracking

**Key Features:**
- Ping-pong FBO pattern for persistent blob mask
- Cursor tracking with RAF throttling (60fps)
- Screen-space UV mapping for blob reveal
- Adaptive performance optimizations (anisotropy, pixel ratio)
- Lazy loading with React Suspense

**Performance Optimizations:**
- Pixel ratio capped at 2x (1.5x on high-DPI)
- Anisotropy: 4x on high-DPI (>2x), 8x standard
- FBO resolution capped based on device capabilities
- `contain: layout style paint` for rendering isolation
- `aspectRatio: '16 / 9'` to prevent CLS

**Shader Details:**
- **Blob Fragment Shader:** Decays mask over time, adds cursor influence
- **Dual Image Fragment Shader:** Mixes top/bottom images based on blob reveal value
- Screen-space coordinate mapping for accurate cursor tracking

---

## Vercel & Speed Insights

### Speed Insights Integration

**Installation:**
```bash
npm install @vercel/speed-insights
```

**Usage in Next.js App Router:**
```jsx
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

**Features:**
- Real User Monitoring (RUM) for Core Web Vitals
- Automatic performance tracking
- No configuration required (works out of the box)
- Zero performance impact (async loading)

### Vercel Deployment Best Practices

**Configuration (`vercel.json`):**
```json
{
  "framework": "nextjs",
  "regions": ["iad1"],
  "installCommand": "npm install --legacy-peer-deps"
}
```

**Environment Variables:**
- Set via Vercel dashboard or CLI
- `NEXT_PUBLIC_*` variables are exposed to client
- Server-only variables remain private

**Performance Optimizations:**
- Edge Functions for low-latency responses
- Automatic image optimization
- CDN caching for static assets
- ISR for dynamic content

### Project Implementation

**Current Setup:**
- Speed Insights integrated in `src/app/layout.jsx`
- Vercel deployment configured via `vercel.json`
- Custom domain: `ktg.one`
- Region: `iad1` (US East)

---

## Cursor Blob Reveal Hero Pattern

### Implementation Overview

**Location:** `src/components/HeroImages.jsx`

### Architecture

```
HeroImages (Container)
  └─ Canvas (R3F)
      └─ Scene
          ├─ Blob (Ping-Pong FBO Mask)
          └─ DualImageReveal (Image Blending)
```

### Key Components

#### 1. Blob Component
- **Purpose:** Creates persistent liquid-like mask that follows cursor
- **Technique:** Ping-pong FBO pattern
- **Features:**
  - Decay over time (2.5s duration)
  - Cursor influence (0.375 radius)
  - Smooth blending with `smoothstep`
  - Aspect ratio correction for accurate tracking

#### 2. DualImageReveal Component
- **Purpose:** Blends two images based on blob mask
- **Technique:** Screen-space UV mapping
- **Features:**
  - Top image (`top-hero.webp`) - Initial state
  - Bottom image (`bottom-hero.webp`) - Revealed state
  - Alpha channel preservation for transparency
  - Dynamic sizing based on viewport and image aspect

#### 3. Scene Component
- **Purpose:** Orchestrates blob and reveal, handles pointer events
- **Features:**
  - Global pointer tracking (works anywhere on page)
  - RAF throttling for 60fps performance
  - Normalized coordinate mapping (-1 to 1)
  - Delta time tracking for decay calculations

### Performance Optimizations

1. **FBO Resolution Capping:**
   - High-DPI (>2x): Max 1.5x pixel ratio
   - Standard: Max 2x pixel ratio
   - Reduces memory usage by 30-40%

2. **Texture Anisotropy:**
   - High-DPI: 4x anisotropy
   - Standard: 8x anisotropy
   - Balances quality and performance

3. **Rendering Isolation:**
   - `contain: layout style paint` prevents layout shifts
   - Fixed aspect ratio prevents CLS
   - Lazy loading with Suspense

4. **Pointer Tracking:**
   - RAF throttling (60fps max)
   - Latest event capture (no skipping)
   - Passive event listeners

### Usage

```jsx
import { HeroImages } from '@/components/HeroImages'

<HeroImages
  topImage="/assets/top-hero.webp"
  bottomImage="/assets/bottom-hero.webp"
/>
```

### Best Practices

- Use WebP format for images (smaller file size)
- Ensure images have same aspect ratio
- Test on various device pixel ratios
- Monitor FPS during development
- Use `will-change: transform` sparingly

---

## CSS Background Automations

### Implementation Overview

**Location:** `src/app/globals.css`

### Pattern Utilities

#### 1. Grid Pattern
```css
.grid-pattern {
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.5;
}
```

**Use Case:** Subtle grid overlay for technical/geometric aesthetics

#### 2. Diagonal Lines
```css
.diagonal-lines {
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(255, 255, 255, 0.1) 10px,
    rgba(255, 255, 255, 0.1) 11px
  );
}
```

**Use Case:** Dynamic diagonal stripe pattern for visual interest

### Animation Utilities

#### 1. GPU Acceleration
```css
.will-change-transform {
  will-change: transform;
  backface-visibility: hidden;
}
```

**Use Case:** Optimize GSAP animations, prevent jank

#### 2. GSAP-Safe Animations
```css
.gsap-safe {
  will-change: transform, opacity;
}
```

**Use Case:** Ensure animations only affect transform/opacity (no layout shifts)

#### 3. Scrolling Banner
```css
@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-scroll {
  animation: scroll 40s linear infinite;
}
```

**Use Case:** Infinite horizontal scrolling text banners

### 3D Perspective Utilities

```css
.perspective-1000 {
  perspective: 1000px;
}

.transform-style-3d {
  transform-style: preserve-3d;
}
```

**Use Case:** 3D transforms and perspective effects

### Performance Considerations

- **Containment:** `contain: layout style paint` on body for rendering isolation
- **Font Smoothing:** `-webkit-font-smoothing: antialiased` for better text rendering
- **Text Rendering:** `text-rendering: optimizeLegibility` for better font rendering
- **Transform Only:** All animations use `transform` and `opacity` only (no layout properties)

### Tailwind CSS 4 Integration

**Theme Configuration:**
```css
@theme {
  --font-syne: var(--font-syne);
  --font-inter: var(--font-inter);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}
```

**Layer Structure:**
- `@layer base` - Reset and typography
- `@layer utilities` - Custom patterns and helpers

---

## 2026 Web Development Trends

### Performance & Optimization

1. **Core Web Vitals Focus**
   - LCP (Largest Contentful Paint) < 2.5s
   - FID/INP (Interaction to Next Paint) < 200ms
   - CLS (Cumulative Layout Shift) < 0.1

2. **React Server Components**
   - Reduced client bundle size
   - Better SEO and initial load
   - Streaming SSR for faster TTFB

3. **Edge Computing**
   - Deploy functions closer to users
   - Lower latency, better performance
   - Vercel Edge Functions, Cloudflare Workers

### Design Trends

1. **Expressive Typography**
   - Breaking traditional rules
   - Emotion-driven design
   - Variable fonts for dynamic effects

2. **Authentic & Nostalgic**
   - Blend of digital innovation with retro styles
   - Hand-crafted aesthetics
   - Texture and warmth

3. **Minimalist & Technical**
   - Black/white color schemes
   - Geometric patterns
   - Monospace fonts for technical credibility

### Technology Stack

1. **Next.js 16**
   - Cache Components (PPR)
   - Improved Server Components
   - Better caching strategies

2. **React 19**
   - Server Components support
   - Improved hydration
   - Better performance

3. **Tailwind CSS 4**
   - New @theme directive
   - Better performance
   - Improved developer experience

### Best Practices

1. **Progressive Enhancement**
   - Start with core functionality
   - Enhance with JavaScript
   - Graceful degradation

2. **Accessibility First**
   - Semantic HTML
   - ARIA labels
   - Keyboard navigation

3. **Mobile-First Design**
   - Responsive by default
   - Touch-friendly interactions
   - Performance on low-end devices

---

## Cursor IDE & MCP Integration

### Cursor IDE Features

**AI-Powered Development:**
- Code completion and suggestions
- Context-aware assistance
- Multi-file understanding

**MCP (Model Context Protocol) Integration:**
- Extensible tool system
- Server-based capabilities
- Custom tool creation

### MCP Servers in Project

**Configuration:** `.mcp.json`

```json
{
  "mcpServers": {
    "claude-flow@alpha": {
      "command": "npx",
      "args": ["claude-flow@alpha", "mcp", "start"],
      "type": "stdio"
    },
    "ruv-swarm": {
      "command": "npx",
      "args": ["ruv-swarm@latest", "mcp", "start"],
      "type": "stdio"
    },
    "flow-nexus": {
      "command": "npx",
      "args": ["flow-nexus@latest", "mcp", "start"],
      "type": "stdio"
    }
  }
}
```

**Available Servers:**
1. **claude-flow@alpha** - Coordination framework for complex tasks
2. **ruv-swarm** - Swarm/hive-mind coordination patterns
3. **flow-nexus** - Flow-based task orchestration

### MCP Docker Server

**Purpose:** Provides MCP server capabilities via Docker

**Key Features:**
- File system operations
- Code search and analysis
- Documentation fetching
- Library documentation retrieval
- Web search capabilities
- Next.js runtime integration

**Available Tools:**
- `get-library-docs` - Fetch library documentation
- `resolve-library-id` - Resolve library identifiers
- `nextjs_runtime` - Next.js dev server integration
- `fetch` - Web content retrieval
- `read_file`, `write_file` - File operations
- `codebase_search` - Semantic code search

### Best Practices

1. **Use MCP for:**
   - Library documentation lookup
   - Code pattern discovery
   - Runtime diagnostics
   - Web research

2. **Avoid:**
   - Over-reliance on MCP for simple tasks
   - Blocking operations
   - Excessive API calls

---

## Quick Reference

### Next.js 16 Caching Cheat Sheet

| Directive | Cache Type | Shared | Use Case |
|-----------|-----------|--------|----------|
| `'use cache'` | Public | Yes | Static content, shared data |
| `'use cache: remote'` | Runtime | Yes | API responses, shared queries |
| `'use cache: private'` | Per-user | No | User-specific data |
| `cache: 'no-store'` | None | N/A | Always fresh data |
| `cache: 'force-cache'` | Persistent | Yes | Static assets |

### Three.js Performance Checklist

- [ ] Cap device pixel ratio (max 2x)
- [ ] Optimize texture anisotropy (4x high-DPI, 8x standard)
- [ ] Use ping-pong FBOs for feedback loops
- [ ] Implement lazy loading with Suspense
- [ ] Use `contain` CSS for rendering isolation
- [ ] Monitor FPS during development
- [ ] Dispose of geometries and materials
- [ ] Use WebP format for textures

### CSS Animation Best Practices

- [ ] Use `transform` and `opacity` only
- [ ] Avoid animating layout properties
- [ ] Use `will-change` sparingly
- [ ] Implement GPU acceleration where needed
- [ ] Test on low-end devices
- [ ] Monitor CLS scores

---

## Additional Resources

### Official Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Three.js Docs](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Vercel Docs](https://vercel.com/docs)
- [Cursor IDE Docs](https://cursor.so/docs)

### Project-Specific Files
- `src/components/HeroImages.jsx` - Blob reveal implementation
- `src/app/globals.css` - CSS utilities and patterns
- `src/app/layout.jsx` - Root layout with Speed Insights
- `.mcp.json` - MCP server configuration

---

**Last Updated:** 2025-01-28  
**Maintained By:** Development Team

