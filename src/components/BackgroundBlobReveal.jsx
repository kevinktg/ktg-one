'use client'

import { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useFBO } from '@react-three/drei'
import * as THREE from 'three'
import { useCursorPosition } from '@/hooks/useCursorPosition'

// ============================================================================
// SHADERS - Same as HeroImages
// ============================================================================

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
// BLOB COMPONENT - Same ping-pong FBO system as HeroImages
// ============================================================================

function Blob({ pointer, pointerDown, pointerRadius, pointerDuration, dTime, aspect, onTextureReady }) {
  const { gl, size } = useThree()
  
  // PING-PONG: Two FBOs that swap roles each frame
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
  
  const readRef = useRef(fbo1)
  const writeRef = useRef(fbo2)
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
           } else if (onTextureReady) {
             onTextureReady(readRef.current.texture)
           }
  })

  return null
}

// ============================================================================
// SCENE - Tracks cursor and creates blob texture
// ============================================================================

function Scene({ onBlobTextureReady, canvasRef }) {
  const { size, gl } = useThree()
  const { cursorPos, isActive } = useCursorPosition()
  const [pointer, setPointer] = useState(new THREE.Vector2(0, 0))
  const [pointerDown, setPointerDown] = useState(0)
  const [blobTexture, setBlobTexture] = useState(null)
  const pointerRadius = 0.375
  const pointerDuration = 2.5
  const aspect = size.width / size.height
  const dTime = useRef(0)
  const tempSceneRef = useRef(null)
  const tempCameraRef = useRef(null)
  const tempMeshRef = useRef(null)
  const conversionRenderTargetRef = useRef(null)
  
  // Initialize temp scene and camera for texture rendering
  useEffect(() => {
    tempCameraRef.current = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    tempSceneRef.current = new THREE.Scene()
    
    // Create a render target for texture conversion (separate from main render loop)
    const width = Math.min(size.width, 512)
    const height = Math.min(size.height, 512)
    conversionRenderTargetRef.current = new THREE.WebGLRenderTarget(width, height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat
    })
    
    return () => {
      if (conversionRenderTargetRef.current) {
        conversionRenderTargetRef.current.dispose()
      }
    }
  }, [size])

  // Update pointer from cursor position hook
  useEffect(() => {
    if (!isActive) {
      setPointerDown(0)
      return
    }
    
    // Map cursor position (0-100%) to normalized canvas space (-1 to 1)
    const x = (cursorPos.x / 100) * 2 - 1
    const y = -((cursorPos.y / 100) * 2 - 1) // Invert Y for WebGL
    
    setPointer(new THREE.Vector2(x, y))
    setPointerDown(1)
  }, [cursorPos, isActive])
  
  const lastDataUrlUpdate = useRef(0)
  const dataUrlThrottleMs = 50 // Throttle expensive readPixels/toDataURL operations

  useFrame((state, delta) => {
    dTime.current = delta
    
    // Convert Three.js texture to canvas data URL using WebGL readPixels
    // THROTTLED: Only update every 50ms to maintain 60fps
    if (blobTexture && canvasRef.current && onBlobTextureReady) {
      const currentTime = performance.now()
      if (currentTime - lastDataUrlUpdate.current < dataUrlThrottleMs) {
        return // Skip this frame - too soon since last update
      }

      try {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        
        // Get texture dimensions (use FBO dimensions, not full screen for performance)
        const width = Math.min(size.width, 512) // Cap at 512px for performance
        const height = Math.min(size.height, 512)
        
        // Update render target size if needed
        if (!conversionRenderTargetRef.current || 
            conversionRenderTargetRef.current.width !== width || 
            conversionRenderTargetRef.current.height !== height) {
          if (conversionRenderTargetRef.current) {
            conversionRenderTargetRef.current.dispose()
          }
          conversionRenderTargetRef.current = new THREE.WebGLRenderTarget(width, height, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat
          })
        }
        
        canvas.width = width
        canvas.height = height
        
        // Render texture to a separate render target (not main canvas)
        if (!tempSceneRef.current || !tempCameraRef.current || !conversionRenderTargetRef.current) return
        
        // Create or update temp mesh
        if (!tempMeshRef.current) {
          const tempGeometry = new THREE.PlaneGeometry(2, 2)
          const tempMaterial = new THREE.MeshBasicMaterial({ map: blobTexture })
          tempMeshRef.current = new THREE.Mesh(tempGeometry, tempMaterial)
          tempSceneRef.current.add(tempMeshRef.current)
        } else {
          tempMeshRef.current.material.map = blobTexture
          tempMeshRef.current.material.needsUpdate = true
        }
        
        // Render to separate render target (doesn't interfere with main render loop)
        const oldTarget = gl.getRenderTarget()
        gl.setRenderTarget(conversionRenderTargetRef.current)
        gl.clear()
        gl.render(tempSceneRef.current, tempCameraRef.current)
        
        // Read pixels from the render target framebuffer
        // After setRenderTarget, the render target's framebuffer is bound
        const webgl = gl.getContext()
        const pixels = new Uint8Array(width * height * 4)
        webgl.readPixels(0, 0, width, height, webgl.RGBA, webgl.UNSIGNED_BYTE, pixels)
        
        // Convert to ImageData and draw to 2D canvas (flip Y)
        const imageData = ctx.createImageData(width, height)
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const srcIndex = ((height - 1 - y) * width + x) * 4
            const dstIndex = (y * width + x) * 4
            imageData.data[dstIndex] = pixels[srcIndex]
            imageData.data[dstIndex + 1] = pixels[srcIndex + 1]
            imageData.data[dstIndex + 2] = pixels[srcIndex + 2]
            imageData.data[dstIndex + 3] = pixels[srcIndex + 3]
          }
        }
        ctx.putImageData(imageData, 0, 0)
        
        const dataUrl = canvas.toDataURL('image/png')
        onBlobTextureReady(dataUrl)
        lastDataUrlUpdate.current = currentTime
        
        // Restore render target
        gl.setRenderTarget(oldTarget)
      } catch (e) {
        // Fallback: pass texture object
        if (onBlobTextureReady) onBlobTextureReady(blobTexture)
      }
    } else if (blobTexture && onBlobTextureReady) {
      onBlobTextureReady(blobTexture)
    }
  })

  return (
    <Blob
      pointer={pointer}
      pointerDown={pointerDown}
      pointerRadius={pointerRadius}
      pointerDuration={pointerDuration}
      dTime={dTime.current}
      aspect={aspect}
      onTextureReady={setBlobTexture}
    />
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function BackgroundBlobReveal({ onBlobTextureReady }) {
  const canvasRef = useRef(null)
  
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        contain: 'layout style paint',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        style={{
          background: 'transparent',
          width: '100%',
          height: '100%',
          display: 'block'
        }}
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 2}
      >
        <Suspense fallback={null}>
          <Scene onBlobTextureReady={onBlobTextureReady} canvasRef={canvasRef} />
        </Suspense>
      </Canvas>
      {/* Hidden canvas for texture conversion - MUST be outside Canvas (DOM elements can't be inside R3F Canvas) */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}

