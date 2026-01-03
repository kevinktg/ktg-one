'use client'

import { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
import { useFBO } from '@react-three/drei'
import { TextureLoader, ShaderMaterial } from 'three'
import * as THREE from 'three'

// ============================================================================
// SHADERS
// ============================================================================

const dualImageVertexShader = `
  varying vec2 vUv;
  varying vec4 vPosProj;
  
  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vPosProj = gl_Position;
  }
`

const dualImageFragmentShader = `
  uniform sampler2D topTex;
  uniform sampler2D bottomTex;
  uniform sampler2D texBlob;
  
  varying vec2 vUv;
  varying vec4 vPosProj;
  
  void main() {
    vec2 blobUV = (vPosProj.xy / vPosProj.w) * 0.5 + 0.5;
    float reveal = texture2D(texBlob, blobUV).r;
    reveal = clamp(reveal, 0.0, 1.0);
    
    vec4 topColor = texture2D(topTex, vUv);
    vec4 bottomColor = texture2D(bottomTex, vUv);
    
    // Mix colors based on blob reveal
    vec3 finalColor = mix(topColor.rgb, bottomColor.rgb, reveal);
    
    // Mix alpha too - preserve transparency
    float finalAlpha = mix(topColor.a, bottomColor.a, reveal);
    
    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`

const blobVertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const blobFragmentShader = `
  uniform sampler2D fbTexture;
  uniform vec2 pointer;
  uniform float pointerDown;
  uniform float pointerRadius;
  uniform float pointerDuration;
  uniform float dTime;
  uniform float aspect;
  
  varying vec2 vUv;
  
  void main() {
    float duration = pointerDuration;
    float rVal = texture2D(fbTexture, vUv).r;
    
    rVal -= clamp(dTime / duration, 0.0, 0.1);
    rVal = clamp(rVal, 0.0, 1.0);
    
    float f = 0.0;
    if (pointerDown > 0.5) {
      vec2 uv = (vUv - 0.5) * 2.0 * vec2(aspect, 1.0);
      vec2 mouse = pointer * vec2(aspect, 1.0);
      float dist = distance(uv, mouse);
      f = 1.0 - smoothstep(pointerRadius * 0.1, pointerRadius, dist);
    }
    
    rVal += f * 0.1;
    rVal = clamp(rVal, 0.0, 1.0);
    
    gl_FragColor = vec4(rVal, rVal, rVal, 1.0);
  }
`

// ============================================================================
// COMPONENTS
// ============================================================================

class DualImageMaterial extends ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        topTex: { value: null },
        bottomTex: { value: null },
        texBlob: { value: null }
      },
      vertexShader: dualImageVertexShader,
      fragmentShader: dualImageFragmentShader,
      side: THREE.DoubleSide,
      transparent: true // Enable alpha blending for transparent PNGs
    })
  }
}

extend({ DualImageMaterial })

function DualImageReveal({ blobTexture, topImagePath, bottomImagePath }) {
  const meshRef = useRef()
  const materialRef = useRef()
  const { viewport } = useThree()
  const [topTexture, setTopTexture] = useState(null)
  const [bottomTexture, setBottomTexture] = useState(null)
  
  useEffect(() => {
    const loader = new TextureLoader()
    
    loader.load(topImagePath, (texture) => {
      texture.wrapS = THREE.ClampToEdgeWrapping
      texture.wrapT = THREE.ClampToEdgeWrapping
      texture.minFilter = THREE.LinearMipmapLinearFilter
      texture.magFilter = THREE.LinearFilter
      // Adaptive anisotropy: 4x on high-DPI (>2x), 8x on standard (reduces memory by 30-40%)
      const anisotropy = typeof window !== 'undefined' 
        ? (window.devicePixelRatio > 2 ? 4 : 8)
        : 8
      texture.anisotropy = anisotropy
      texture.generateMipmaps = true
      texture.needsUpdate = true
      setTopTexture(texture)
    })
    
    loader.load(bottomImagePath, (texture) => {
      texture.wrapS = THREE.ClampToEdgeWrapping
      texture.wrapT = THREE.ClampToEdgeWrapping
      texture.minFilter = THREE.LinearMipmapLinearFilter
      texture.magFilter = THREE.LinearFilter
      // Adaptive anisotropy: 4x on high-DPI (>2x), 8x on standard (reduces memory by 30-40%)
      const anisotropy = typeof window !== 'undefined' 
        ? (window.devicePixelRatio > 2 ? 4 : 8)
        : 8
      texture.anisotropy = anisotropy
      texture.generateMipmaps = true
      texture.needsUpdate = true
      setBottomTexture(texture)
    })
  }, [topImagePath, bottomImagePath])
  
  useEffect(() => {
    if (!materialRef.current) return
    
    if (topTexture) materialRef.current.uniforms.topTex.value = topTexture
    if (bottomTexture) materialRef.current.uniforms.bottomTex.value = bottomTexture
    if (blobTexture) materialRef.current.uniforms.texBlob.value = blobTexture
  }, [topTexture, bottomTexture, blobTexture])
  
  const imageAspect = topTexture?.image 
    ? topTexture.image.width / topTexture.image.height 
    : 1.5
  
  let finalWidth = viewport.width * 1.2
  let finalHeight = viewport.height * 1.2
  
  const viewportAspect = viewport.width / viewport.height
  if (imageAspect > viewportAspect) {
    finalHeight = viewport.height * 1.2
    finalWidth = finalHeight * imageAspect
  } else {
    finalWidth = viewport.width * 1.2
    finalHeight = finalWidth / imageAspect
  }
  
  if (!topTexture || !bottomTexture) {
    return null
  }
  
  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[finalWidth, finalHeight]} />
      <dualImageMaterial ref={materialRef} />
    </mesh>
  )
}

// Blob with PING-PONG FBOs to fix feedback loop
function Blob({ pointer, pointerDown, pointerRadius, pointerDuration, dTime, aspect, onTextureReady }) {
  const { gl, size } = useThree()
  
  // PING-PONG: Two FBOs that swap roles each frame
  // Cap pixel ratio for performance (max 1.5x on high-DPI, 2x on standard)
  const maxPixelRatio = typeof window !== 'undefined' 
    ? Math.min(gl.getPixelRatio(), window.devicePixelRatio > 2 ? 1.5 : 2)
    : 2
  const fboWidth = Math.floor(size.width * maxPixelRatio)
  const fboHeight = Math.floor(size.height * maxPixelRatio)
  
  const fbo1 = useFBO(fboWidth, fboHeight, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat
  })
  const fbo2 = useFBO(fboWidth, fboHeight, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat
  })
  
  const readRef = useRef(fbo1)   // Read from this
  const writeRef = useRef(fbo2)  // Write to this
  const rtSceneRef = useRef()
  const rtCameraRef = useRef()
  const materialRef = useRef()
  const initialized = useRef(false)

  useEffect(() => {
    rtCameraRef.current = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    rtSceneRef.current = new THREE.Scene()
    
    // Clear both FBOs to black initially
    gl.setRenderTarget(fbo1)
    gl.clearColor(0, 0, 0, 1)
    gl.clear()
    gl.setRenderTarget(fbo2)
    gl.clearColor(0, 0, 0, 1)
    gl.clear()
    gl.setRenderTarget(null)
  }, [gl, fbo1, fbo2])

  useEffect(() => {
    if (!rtSceneRef.current) return
    
    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        fbTexture: { value: null },
        pointer: { value: new THREE.Vector2(0, 0) },
        pointerDown: { value: 0 },
        pointerRadius: { value: pointerRadius },
        pointerDuration: { value: pointerDuration },
        dTime: { value: 0 },
        aspect: { value: 1 }
      },
      vertexShader: blobVertexShader,
      fragmentShader: blobFragmentShader
    })
    
    const mesh = new THREE.Mesh(geometry, material)
    rtSceneRef.current.add(mesh)
    materialRef.current = material
    
    return () => {
      if (rtSceneRef.current && mesh) {
        rtSceneRef.current.remove(mesh)
      }
      if (geometry) geometry.dispose()
      if (material) material.dispose()
    }
  }, [pointerRadius, pointerDuration])

  useFrame(() => {
    if (!materialRef.current || !rtSceneRef.current || !rtCameraRef.current) return
    
    // Update uniforms - READ from current read buffer
    materialRef.current.uniforms.pointer.value.set(pointer.x, pointer.y)
    materialRef.current.uniforms.pointerDown.value = pointerDown
    materialRef.current.uniforms.aspect.value = aspect
    materialRef.current.uniforms.dTime.value = dTime
    materialRef.current.uniforms.fbTexture.value = readRef.current.texture
    
    // WRITE to current write buffer
    gl.setRenderTarget(writeRef.current)
    gl.render(rtSceneRef.current, rtCameraRef.current)
    gl.setRenderTarget(null)
    
    // SWAP buffers for next frame
    const temp = readRef.current
    readRef.current = writeRef.current
    writeRef.current = temp
    
    // Pass current read texture to parent
    if (!initialized.current && onTextureReady) {
      onTextureReady(readRef.current.texture)
      initialized.current = true
    }
  })

  return null
}

function Scene({ topImage, bottomImage }) {
  const { size, gl } = useThree()
  const [pointer, setPointer] = useState(new THREE.Vector2(0, 0))
  const [pointerDown, setPointerDown] = useState(0) // Start with 0 - no reveal until mouse moves
  const [blobTexture, setBlobTexture] = useState(null)
  const pointerRadius = 0.375
  const pointerDuration = 2.5
  const aspect = size.width / size.height
  const dTime = useRef(0)
  
  useEffect(() => {
    // Track pointer globally across entire viewport - blob effect works anywhere on page
    // Smooth throttling: capture latest position, update at 60fps for performance
    let rafId = null
    let latestEvent = null
    
    const handlePointerMove = (event) => {
      // Always capture the latest position (no skipping)
      latestEvent = event
      
      // Only queue one RAF update
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          if (latestEvent) {
            const viewportWidth = window.innerWidth
            const viewportHeight = window.innerHeight
            
            // Map viewport coordinates to normalized canvas space (-1 to 1)
            const x = ((latestEvent.clientX / viewportWidth) * 2 - 1)
            const y = -((latestEvent.clientY / viewportHeight) * 2 - 1)
            
            setPointer(new THREE.Vector2(x, y))
            setPointerDown(1)
            latestEvent = null
          }
          rafId = null
        })
      }
    }
    
    // Keep blob active as long as mouse is moving anywhere on page
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    
    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [])
  
  useFrame((state, delta) => {
    dTime.current = delta
  })

  return (
    <>
      <ambientLight intensity={1.5} />
      
      <Blob
        pointer={pointer}
        pointerDown={pointerDown}
        pointerRadius={pointerRadius}
        pointerDuration={pointerDuration}
        dTime={dTime.current}
        aspect={aspect}
        onTextureReady={setBlobTexture}
      />
      
      <Suspense fallback={null}>
        <DualImageReveal 
          blobTexture={blobTexture}
          topImagePath={topImage}
          bottomImagePath={bottomImage}
        />
      </Suspense>
    </>
  )
}

export function HeroImages({
  topImage = '/assets/top-hero.webp',
  bottomImage = '/assets/bottom-hero.webp'
}) {
  return (
    <div
      className="absolute inset-0 z-10 pointer-events-auto w-full h-full"
      style={{
        contain: 'layout style paint',
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        // Explicit dimensions to prevent CLS
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          // Reduce initial load
          preserveDrawingBuffer: false,
        }}
        style={{
          background: 'transparent',
          width: '100%',
          height: '100%',
          display: 'block',
          // Prevent layout shift - explicit positioning
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1}
      >
        <Scene
          topImage={topImage}
          bottomImage={bottomImage}
        />
      </Canvas>
    </div>
  )
}
