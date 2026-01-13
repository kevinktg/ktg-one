'use client'

import { Suspense, useRef, useEffect, useState, useCallback } from 'react'
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
import { TextureLoader, ShaderMaterial, Vector2 } from 'three'
import * as THREE from 'three'

// ============================================================================
// NOISE / DISTORTION SHADER
// ============================================================================

// Simplex 2D noise function included in the fragment shader
const simplexNoise2D = `
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`

const fluidRevealFragmentShader = `
  uniform sampler2D topTex;
  uniform sampler2D bottomTex;
  uniform vec2 mouse;
  uniform float aspect;
  uniform float uTime;
  
  varying vec2 vUv;
  
  ${simplexNoise2D}

  void main() {
    // 1. Coordinates setup
    vec2 center = vUv * 2.0 - 1.0;
    center.x *= aspect;
    
    vec2 mousePos = mouse * 2.0 - 1.0;
    mousePos.x *= aspect;
    
    // 2. Calculate Distance
    float dist = distance(center, mousePos);
    
    // 3. Generate Noise
    // We animate the noise with uTime
    float noiseValue = snoise(vUv * 5.0 + uTime * 0.5);

    // 4. Distortion - distort the texture lookup based on mouse proximity
    // The closer to the mouse, the more we distort the UVs
    float influence = smoothstep(0.5, 0.0, dist);
    vec2 distortedUv = vUv + (noiseValue * 0.03 * influence);
    
    // 5. Fetch Textures with distorted UVs
    vec4 topColor = texture2D(topTex, distortedUv);
    vec4 bottomColor = texture2D(bottomTex, distortedUv);

    // 6. Reveal Mask
    // Base radius + noise influence for irregular edge
    float radius = 0.25;
    float edgeSoftness = 0.15;

    // Add noise to the distance field to make the circle irregular
    float noisyDist = dist + noiseValue * 0.05;

    // Create the reveal mask
    float reveal = 1.0 - smoothstep(radius, radius + edgeSoftness, noisyDist);

    // 7. Mix
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
        aspect: { value: 1.0 },
        uTime: { value: 0.0 }
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
  
  useFrame((state) => {
    if (!materialRef.current) return
    const targetX = (state.pointer.x + 1) / 2
    const targetY = (state.pointer.y + 1) / 2

    // Update uniforms
    materialRef.current.uniforms.mouse.value.lerp(new Vector2(targetX, targetY), 0.1)
    materialRef.current.uniforms.aspect.value = viewport.aspect
    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime()
    
    if (textures.top) materialRef.current.uniforms.topTex.value = textures.top
    if (textures.bottom) materialRef.current.uniforms.bottomTex.value = textures.bottom
  })

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <fluidRevealMaterial ref={materialRef} />
    </mesh>
  )
}

export function HeroImages({ topImage, bottomImage }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false); // New state for fade-in

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // If mobile, we are using a background image, so set ready quickly.
    // For Desktop, isReady is triggered by the onLoaded callback in RevealPlane
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
    <div className={`absolute inset-0 z-10 pointer-events-none w-full h-full bg-neutral-900 transition-opacity duration-1000 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
      <Canvas
        eventSource={typeof document !== 'undefined' ? document.body : undefined}
        eventPrefix="client"
        dpr={[1, 2]} 
        gl={{ antialias: false, powerPreference: "high-performance", alpha: true }} 
        camera={{ position: [0, 0, 1], fov: 75 }}
        style={{ background: '#171717' }}
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
