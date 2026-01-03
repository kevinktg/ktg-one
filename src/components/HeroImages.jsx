'use client'

import { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
import { TextureLoader, ShaderMaterial, Vector2 } from 'three'
import * as THREE from 'three'

// ============================================================================
// LIGHTWEIGHT SHADER
// ============================================================================
const simpleRevealFragmentShader = `
  uniform sampler2D topTex;
  uniform sampler2D bottomTex;
  uniform vec2 mouse;
  uniform float aspect;
  
  varying vec2 vUv;
  
  void main() {
    vec4 topColor = texture2D(topTex, vUv);
    vec4 bottomColor = texture2D(bottomTex, vUv);
    
    // Correct UVs for aspect ratio
    vec2 center = vUv * 2.0 - 1.0;
    center.x *= aspect;
    
    vec2 mousePos = mouse * 2.0 - 1.0;
    mousePos.x *= aspect;
    
    // Calculate Distance
    float dist = distance(center, mousePos);
    
    // SIZE CONFIGURATION
    // Changed from 0.4 (Massive) to 0.15 (Spotlight size)
    float radius = 0.15; 
    float softness = 0.15; // Soft edge fade
    
    float reveal = 1.0 - smoothstep(radius, radius + softness, dist);
    
    // Mix textures
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

class SimpleRevealMaterial extends ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        topTex: { value: null },
        bottomTex: { value: null },
        mouse: { value: new Vector2(0.5, 0.5) },
        aspect: { value: 1.0 }
      },
      vertexShader: simpleVertexShader,
      fragmentShader: simpleRevealFragmentShader,
      transparent: true
    })
  }
}

extend({ SimpleRevealMaterial })

function RevealPlane({ topImagePath, bottomImagePath }) {
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
    })
  }, [topImagePath, bottomImagePath])
  
  useFrame((state) => {
    if (!materialRef.current) return
    const targetX = (state.pointer.x + 1) / 2
    const targetY = (state.pointer.y + 1) / 2
    materialRef.current.uniforms.mouse.value.lerp(new Vector2(targetX, targetY), 0.1)
    materialRef.current.uniforms.aspect.value = viewport.aspect
    
    if (textures.top) materialRef.current.uniforms.topTex.value = textures.top
    if (textures.bottom) materialRef.current.uniforms.bottomTex.value = textures.bottom
  })

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry />
      <simpleRevealMaterial ref={materialRef} />
    </mesh>
  )
}

export function HeroImages({ topImage, bottomImage }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div 
        className="absolute inset-0 z-10 w-full h-full bg-neutral-900"
        style={{ 
           backgroundImage: `url(${topImage})`, 
           backgroundSize: 'cover', 
           backgroundPosition: 'center',
           opacity: 0.5 
        }}
      />
    );
  }

  return (
<div className="absolute inset-0 z-10 pointer-events-none w-full h-full bg-transparent">      <Canvas
        eventSource={typeof document !== 'undefined' ? document.body : undefined}
        eventPrefix="client"
        dpr={[1, 2]} 
        gl={{ antialias: false, powerPreference: "high-performance", alpha: true }} 
        camera={{ position: [0, 0, 1], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <RevealPlane topImagePath={topImage} bottomImagePath={bottomImage} />
        </Suspense>
      </Canvas>
    </div>
  )
}