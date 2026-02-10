'use client'

import { Suspense, useRef, useEffect, useState, useCallback } from 'react'
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
import { TextureLoader, ShaderMaterial, Vector2 } from 'three'

// ============================================================================
// BRUSH REVEAL SHADER (no warping, no noise — clean soft-edge brush)
// ============================================================================

const fluidRevealFragmentShader = `
  uniform sampler2D topTex;
  uniform sampler2D bottomTex;
  uniform vec2 mouse;
  uniform float aspect;

  varying vec2 vUv;

  void main() {
    // 1. Aspect-corrected coordinates
    vec2 center = vUv * 2.0 - 1.0;
    center.x *= aspect;

    vec2 mousePos = mouse * 2.0 - 1.0;
    mousePos.x *= aspect;

    // 2. Distance from cursor
    float dist = distance(center, mousePos);

    // 3. Fetch textures with original UVs (no distortion)
    vec4 topColor = texture2D(topTex, vUv);
    vec4 bottomColor = texture2D(bottomTex, vUv);

    // 4. Brush reveal — clean soft-edge circle
    float radius = 0.25;
    float edgeSoftness = 0.18;
    float reveal = 1.0 - smoothstep(radius, radius + edgeSoftness, dist);

    // 5. Mix
    vec3 finalColor = mix(topColor.rgb, bottomColor.rgb, reveal);
    float finalAlpha = mix(topColor.a, bottomColor.a, reveal);

    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`

const simpleVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

class FluidRevealMaterial extends ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        topTex: { value: null },
        bottomTex: { value: null },
        mouse: { value: new Vector2(0.5, 0.5) },
        aspect: { value: 1.0 }
      },
      vertexShader: simpleVertexShader,
      fragmentShader: fluidRevealFragmentShader,
      transparent: true
    })
  }
}

extend({ FluidRevealMaterial })

function RevealPlane({ topImagePath, bottomImagePath, onLoaded }) {
  const materialRef = useRef()
  const { viewport } = useThree()
  const [textures, setTextures] = useState({ top: null, bottom: null })
  
  useEffect(() => {
    const loader = new TextureLoader()
    Promise.all([
      new Promise(resolve => loader.load(topImagePath, resolve)),
      new Promise(resolve => loader.load(bottomImagePath, resolve))
    ]).then(([top, bottom]) => {
      const ani = Math.min(window.devicePixelRatio > 1 ? 4 : 8, 8);
      top.anisotropy = ani;
      bottom.anisotropy = ani;
      setTextures({ top, bottom })
      if (onLoaded) onLoaded();
    })
  }, [topImagePath, bottomImagePath, onLoaded])

  // Update textures only when they change
  useEffect(() => {
    if (materialRef.current) {
      if (textures.top) materialRef.current.uniforms.topTex.value = textures.top
      if (textures.bottom) materialRef.current.uniforms.bottomTex.value = textures.bottom
    }
  }, [textures])

  // OPTIMIZATION: Update aspect ratio only on resize, avoiding per-frame assignment
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.aspect.value = viewport.aspect
    }
  }, [viewport.aspect])

  useFrame((state) => {
    if (!materialRef.current) return
    const targetX = (state.pointer.x + 1) / 2
    const targetY = (state.pointer.y + 1) / 2

    // Lerp mouse position for smooth brush movement
    materialRef.current.uniforms.mouse.value.x += (targetX - materialRef.current.uniforms.mouse.value.x) * 0.1
    materialRef.current.uniforms.mouse.value.y += (targetY - materialRef.current.uniforms.mouse.value.y) * 0.1
  })

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <fluidRevealMaterial ref={materialRef} />
    </mesh>
  )
}

export function HeroImages({ topImage, bottomImage }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false); // New state for fade-in

  useEffect(() => {
    // Session check: If previously visited, show immediately
    const hasPlayed = typeof window !== 'undefined' && sessionStorage.getItem('hero-animated') === 'true';
    if (hasPlayed) {
        setIsReady(true);
    }

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // If mobile, we are using a background image, so set ready quickly.
    // For Desktop, isReady is triggered by the onLoaded callback in RevealPlane.
    // However, if we've already played, we want it visible immediately (handled above),
    // but we still let the texture load in the background.
    if (window.innerWidth < 768) {
        const timer = setTimeout(() => setIsReady(true), 100);
        return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleLoaded = useCallback(() => setIsReady(true), []);

  if (isMobile) {
    return (
      <div 
        className={`absolute inset-0 z-10 w-full h-full bg-neutral-900 transition-opacity duration-1000 ${isReady ? 'opacity-50' : 'opacity-0'}`}
        style={{ 
           backgroundImage: `url(${topImage})`, 
           backgroundSize: 'cover', 
           backgroundPosition: 'center',
        }}
      />
    );
  }

  return (
    <div className={`absolute inset-0 z-10 w-full h-full bg-transparent transition-opacity duration-1000 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
      <Canvas
        eventSource={typeof document !== 'undefined' ? document.body : undefined}
        eventPrefix="client"
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
        camera={{ position: [0, 0, 1], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <RevealPlane
            topImagePath={topImage}
            bottomImagePath={bottomImage}
            onLoaded={handleLoaded}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
