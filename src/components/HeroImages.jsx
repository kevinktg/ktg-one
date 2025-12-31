'use client'

import { Suspense, useRef, useEffect, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { useFBO, OrbitControls } from '@react-three/drei'
import { TextureLoader } from 'three'
import * as THREE from 'three'

// Dual Image Component - Reveals bottom image as blob reveals
function DualImageReveal({ blobTexture, topImagePath, bottomImagePath }) {
  const meshRef = useRef()
  const materialRef = useRef()
  const three = useThree()
  const viewport = three?.viewport || { width: 10, height: 10 } // Fallback
  const topTexture = useLoader(TextureLoader, topImagePath)
  const bottomTexture = useLoader(TextureLoader, bottomImagePath)
  
  useEffect(() => {
    [topTexture, bottomTexture].forEach(texture => {
      if (texture) {
        texture.wrapS = THREE.ClampToEdgeWrapping
        texture.wrapT = THREE.ClampToEdgeWrapping
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.needsUpdate = true
      }
    })
    console.log('[HeroImages] Textures loaded:', { topTexture, bottomTexture })
  }, [topTexture, bottomTexture])
  
  useEffect(() => {
    if (!materialRef.current) {
      console.log('[DualImageReveal] Waiting for material')
      return
    }
    
    // Show top image immediately (basic fallback)
    if (!topTexture || !bottomTexture) {
      console.log('[DualImageReveal] Textures not loaded yet')
      return
    }
    
    // If no blob texture, just show top image
    if (!blobTexture) {
      console.log('[DualImageReveal] No blobTexture yet, showing top image only')
      // Reset shader modification
      materialRef.current.onBeforeCompile = null
      materialRef.current.map = topTexture
      materialRef.current.needsUpdate = true
      return
    }
    
    console.log('[DualImageReveal] Setting up shader with blobTexture')
    
    const uniforms = { 
      texBlob: { value: blobTexture },
      topTex: { value: topTexture },
      bottomTex: { value: bottomTexture }
    }
    
    materialRef.current.onBeforeCompile = (shader) => {
      console.log('[DualImageReveal] Compiling shader')
      // Add uniforms
      shader.uniforms.texBlob = uniforms.texBlob
      shader.uniforms.topTex = uniforms.topTex
      shader.uniforms.bottomTex = uniforms.bottomTex
      
      // Modify vertex shader - add varying declarations at top
      shader.vertexShader = `
        varying vec4 vPosProj;
        varying vec2 vUv;
        ${shader.vertexShader}
      `.replace(
        `#include <project_vertex>`,
        `#include <project_vertex>
        vPosProj = gl_Position;
        `
      ).replace(
        `#include <uv_vertex>`,
        `#include <uv_vertex>
        vUv = uv;
        `
      )
      
      // Modify fragment shader - add uniforms and varyings declarations
      shader.fragmentShader = shader.fragmentShader.replace(
        `#include <common>`,
        `#include <common>
        uniform sampler2D texBlob;
        uniform sampler2D topTex;
        uniform sampler2D bottomTex;
        varying vec4 vPosProj;
        varying vec2 vUv;
        `
      ).replace(
        `#include <color_fragment>`,
        `#include <color_fragment>
        
        // Convert projection position to screen-space UV
        vec2 blobUV = ((vPosProj.xy / vPosProj.w) + 1.0) * 0.5;
        vec4 blobData = texture2D(texBlob, blobUV);
        
        // Sample both images
        vec4 topColor = texture2D(topTex, vUv);
        vec4 bottomColor = texture2D(bottomTex, vUv);
        
        // Mix based on blob reveal value
        float reveal = clamp(blobData.r, 0.0, 1.0);
        diffuseColor.rgb = mix(topColor.rgb, bottomColor.rgb, reveal);
        `
      )
    }
    materialRef.current.needsUpdate = true
    
    // Force shader recompilation
    if (materialRef.current.shader) {
      materialRef.current.shader.needsUpdate = true
    }
  }, [blobTexture, topTexture, bottomTexture])

  // Calculate size to fill viewport properly
  // viewport gives us 3D units visible based on camera distance
  const width = viewport.width
  const height = viewport.height
  
  // Get image aspect ratio once texture loads
  const imageAspect = topTexture?.image 
    ? topTexture.image.width / topTexture.image.height 
    : null
  
  // Calculate size to COVER viewport (fill entire screen, may crop edges)
  let finalWidth = width * 1.5  // Start larger to ensure coverage
  let finalHeight = height * 1.5
  
  if (imageAspect) {
    const viewportAspect = width / height
    if (imageAspect > viewportAspect) {
      // Image is wider - cover height completely, extend width if needed
      finalHeight = height * 1.5
      finalWidth = finalHeight * imageAspect
    } else {
      // Image is taller - cover width completely, extend height if needed
      finalWidth = width * 1.5
      finalHeight = finalWidth / imageAspect
    }
  }
  
  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[finalWidth, finalHeight]} />
      <meshStandardMaterial 
        ref={materialRef}
        map={topTexture}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// Blob Component - Creates the framebuffer feedback effect
function Blob({ pointer, pointerDown, pointerRadius, pointerDuration, dTime, aspect, onTextureReady }) {
  const { gl, size } = useThree()
  const rtOutput = useFBO(size.width, size.height)
  const rtSceneRef = useRef()
  const rtCameraRef = useRef(new THREE.Camera())
  const prevTextureRef = useRef(null)
  const blobTextureInitialized = useRef(false)

  useEffect(() => {
    // Initialize with black texture (no reveal)
    const initSize = size.width * size.height
    const data = new Uint8Array(initSize * 4) // RGBA - all zeros = black
    const initTexture = new THREE.DataTexture(data, size.width, size.height, THREE.RGBAFormat)
    initTexture.wrapS = THREE.ClampToEdgeWrapping
    initTexture.wrapT = THREE.ClampToEdgeWrapping
    initTexture.needsUpdate = true
    prevTextureRef.current = initTexture
    console.log('[Blob] Initialized texture:', { width: size.width, height: size.height })
  }, [rtOutput, size.width, size.height])

  const uniforms = useMemo(() => ({
    dTime: { value: dTime },
    aspect: { value: aspect },
    pointer: { value: new THREE.Vector2(pointer.x, pointer.y) },
    pointerDown: { value: pointerDown },
    pointerRadius: { value: pointerRadius },
    pointerDuration: { value: pointerDuration },
    fbTexture: { value: prevTextureRef.current || rtOutput.texture }
  }), [dTime, aspect, pointer.x, pointer.y, pointerDown, pointerRadius, pointerDuration, rtOutput.texture])

  useFrame(() => {
    if (!rtSceneRef.current) return
    
    // Update uniforms that change per frame
    uniforms.pointer.value.set(pointer.x, pointer.y)
    uniforms.pointerDown.value = pointerDown
    uniforms.aspect.value = aspect
    uniforms.dTime.value = dTime
    
    // Update feedback texture before rendering
    if (prevTextureRef.current) {
      uniforms.fbTexture.value = prevTextureRef.current
    }
    
    // Render blob to FBO
    gl.setRenderTarget(rtOutput)
    gl.render(rtSceneRef.current, rtCameraRef.current)
    gl.setRenderTarget(null)
    
    // Update feedback texture for next frame
    prevTextureRef.current = rtOutput.texture
    uniforms.fbTexture.value = rtOutput.texture
    
    // Notify that texture is ready (only once)
    if (onTextureReady && !blobTextureInitialized.current) {
      onTextureReady(rtOutput.texture)
      blobTextureInitialized.current = true
      console.log('[Blob] Texture ready and passed to DualImageReveal')
    }
  })

  return (
    <mesh ref={rtSceneRef} visible={false}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial
        color={0x000000}
        onBeforeCompile={(shader) => {
          Object.assign(shader.uniforms, uniforms)
          
          // Add vUv varying to vertex shader
          shader.vertexShader = `
            varying vec2 vUv;
            ${shader.vertexShader}
          `.replace(
            `#include <project_vertex>`,
            `vUv = uv;
            #include <project_vertex>`
          )
          
          // Add uniforms and varyings to fragment shader
          shader.fragmentShader = `
            uniform float dTime;
            uniform float aspect;
            uniform vec2 pointer;
            uniform float pointerDown;
            uniform float pointerRadius;
            uniform float pointerDuration;
            uniform sampler2D fbTexture;
            varying vec2 vUv;
            
            ${shader.fragmentShader}
          `.replace(
            `#include <color_fragment>`,
            `#include <color_fragment>
            
            float duration = pointerDuration;
            float rVal = texture2D(fbTexture, vUv).r;
            rVal -= clamp(dTime / duration, 0., 0.1);
            rVal = clamp(rVal, 0., 1.);
            
            float f = 0.;
            if (pointerDown > 0.5) {
              vec2 uv = (vUv - 0.5) * 2. * vec2(aspect, 1.);
              vec2 mouse = pointer * vec2(aspect, 1.);
              f = 1. - smoothstep(pointerRadius * 0.1, pointerRadius, distance(uv, mouse));
            }
            rVal += f * 0.1;
            rVal = clamp(rVal, 0., 1.);
            diffuseColor.rgb = vec3(rVal);
            `
          )
        }}
      />
    </mesh>
  )
}

function Scene({ topImage, bottomImage }) {
  const { size, gl } = useThree()
  const [pointer, setPointer] = useState(new THREE.Vector2(0, 0))
  const [pointerDown, setPointerDown] = useState(1) // Start at 1 - assume mouse is active
  const [blobTexture, setBlobTexture] = useState(null)
  const pointerRadius = 0.375
  const pointerDuration = 2.5
  const aspect = size.width / size.height
  const logIntervalRef = useRef(null)
  
  useEffect(() => {
    // Check if mouse is over canvas on mount
    const checkInitialPosition = () => {
      const rect = gl.domElement.getBoundingClientRect()
      // If canvas exists and is visible, assume we might start with mouse over it
      if (rect.width > 0 && rect.height > 0) {
        setPointerDown(1)
        console.log('[Scene] Canvas ready, pointerDown initialized to 1')
      }
    }
    
    // Small delay to ensure canvas is rendered
    const timer = setTimeout(checkInitialPosition, 100)
    
    let moveCount = 0
    const lastLogTime = { current: 0 }
    
    const handlePointerMove = (event) => {
      const rect = gl.domElement.getBoundingClientRect()
      
      // Check if pointer is within canvas bounds
      const isOverCanvas = (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      )
      
      if (isOverCanvas) {
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1
        
        setPointer(new THREE.Vector2(x, y))
        setPointerDown(1)
        
        // Log periodically (every 60 frames or ~1 second at 60fps)
        moveCount++
        const now = Date.now()
        if (moveCount <= 3 || now - lastLogTime.current > 1000) {
          console.log('[Scene] Pointer move:', { 
            x: x.toFixed(3), 
            y: y.toFixed(3), 
            pointerDown: 1,
            canvasSize: { width: rect.width, height: rect.height },
            aspect
          })
          lastLogTime.current = now
        }
      } else {
        // Mouse is outside canvas, but keep pointerDown active (might return)
        // Only set to 0 if we're definitely leaving
      }
    }
    
    const handlePointerLeave = () => {
      setPointer(new THREE.Vector2(0, 0)) // Reset to center instead of far away
      setPointerDown(0)
      console.log('[Scene] Pointer left canvas')
    }
    
    const handlePointerEnter = () => {
      setPointerDown(1)
      console.log('[Scene] Pointer entered canvas')
    }
    
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    gl.domElement.addEventListener('pointerleave', handlePointerLeave)
    gl.domElement.addEventListener('pointerenter', handlePointerEnter)
    
    console.log('[Scene] Pointer event listeners attached', {
      canvasSize: { width: size.width, height: size.height },
      aspect: aspect.toFixed(3)
    })
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('pointermove', handlePointerMove)
      gl.domElement.removeEventListener('pointerleave', handlePointerLeave)
      gl.domElement.removeEventListener('pointerenter', handlePointerEnter)
      if (logIntervalRef.current) {
        clearInterval(logIntervalRef.current)
      }
    }
  }, [gl.domElement, size.width, size.height, aspect])
  
  const dTime = useRef(0)
  
  useFrame((state, delta) => {
    dTime.current = delta
  })

  return (
    <>
      <ambientLight intensity={1.5} />
      <pointLight position={[5, 5, 5]} intensity={0.5} />
      
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
        {/* Always render - shows top image if blobTexture not ready */}
        <DualImageReveal 
          blobTexture={blobTexture}
          topImagePath={topImage}
          bottomImagePath={bottomImage}
        />
      </Suspense>
      
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        enableZoom={false}
        enablePan={false}
      />
    </>
  )
}

export function HeroImages({ 
  topImage = '/assets/top-hero.webp',
  bottomImage = '/assets/btm-hero.webp'
}) {
  return (
    <div className="absolute inset-0 z-10 pointer-events-auto w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ 
          background: 'transparent',
          width: '100%',
          height: '100%',
          display: 'block'
        }}
        dpr={[1, 2]} // Limit pixel ratio for performance
      >
        <Scene 
          topImage={topImage}
          bottomImage={bottomImage}
        />
      </Canvas>
    </div>
  )
}

