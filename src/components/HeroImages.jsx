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
  const topTexture = useLoader(TextureLoader, topImagePath)
  const bottomTexture = useLoader(TextureLoader, bottomImagePath)
  
  useEffect(() => {
    [topTexture, bottomTexture].forEach(texture => {
      if (texture) {
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.needsUpdate = true
      }
    })
  }, [topTexture, bottomTexture])
  
  useEffect(() => {
    if (!materialRef.current || !blobTexture) return
    
    const uniforms = { 
      texBlob: { value: blobTexture },
      topTex: { value: topTexture },
      bottomTex: { value: bottomTexture }
    }
    
    materialRef.current.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms)
      
      shader.vertexShader = `
        varying vec4 vPosProj;
        ${shader.vertexShader}
      `.replace(
        `#include <project_vertex>`,
        `#include <project_vertex>
          vPosProj = gl_Position;
        `
      )
      
      shader.fragmentShader = `
        uniform sampler2D texBlob;
        uniform sampler2D topTex;
        uniform sampler2D bottomTex;
        varying vec4 vPosProj;
        ${shader.fragmentShader}
      `.replace(
        `#include <clipping_planes_fragment>`,
        `
        vec2 blobUV = ((vPosProj.xy / vPosProj.w) + 1.) * 0.5;
        vec4 blobData = texture(texBlob, blobUV);
        
        vec2 uv = vUv;
        vec4 topColor = texture(topTex, uv);
        vec4 bottomColor = texture(bottomTex, uv);
        
        // Mix between top and bottom based on blob mask
        float reveal = blobData.r;
        vec4 finalColor = mix(topColor, bottomColor, reveal);
        
        if (blobData.r < 0.01) {
          // Show top image where blob hasn't revealed
          finalColor = topColor;
        }
        
        diffuseColor = finalColor;
        
        #include <clipping_planes_fragment>
        `
      )
    }
    materialRef.current.needsUpdate = true
  }, [blobTexture, topTexture, bottomTexture])

  return (
    <mesh ref={meshRef} position={[0, 1.5, 0]} scale={[2.5, 2.5, 1]}>
      <planeGeometry args={[1.6, 2]} />
      <meshStandardMaterial 
        ref={materialRef}
        map={topTexture}
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

  useEffect(() => {
    const initSize = size.width * size.height
    const data = new Uint8Array(initSize * 4)
    const initTexture = new THREE.DataTexture(data, size.width, size.height, THREE.RGBAFormat)
    initTexture.needsUpdate = true
    prevTextureRef.current = initTexture
    if (onTextureReady) onTextureReady(rtOutput.texture)
  }, [rtOutput, onTextureReady, size.width, size.height])

  useFrame(() => {
    if (!rtSceneRef.current) return
    gl.setRenderTarget(rtOutput)
    gl.render(rtSceneRef.current, rtCameraRef.current)
    gl.setRenderTarget(null)
    if (onTextureReady) onTextureReady(rtOutput.texture)
  })

  const uniforms = useMemo(() => ({
    dTime: { value: dTime },
    aspect: { value: aspect },
    pointer: { value: pointer },
    pointerDown: { value: pointerDown },
    pointerRadius: { value: pointerRadius },
    pointerDuration: { value: pointerDuration },
    fbTexture: { value: prevTextureRef.current || rtOutput.texture }
  }), [dTime, aspect, pointer, pointerDown, pointerRadius, pointerDuration, rtOutput.texture])

  useFrame(() => {
    if (!uniforms.fbTexture.value) {
      uniforms.fbTexture.value = rtOutput.texture
    }
  })

  return (
    <mesh ref={rtSceneRef} visible={false}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial
        color={0x000000}
        onBeforeCompile={(shader) => {
          Object.assign(shader.uniforms, uniforms)
          
          shader.fragmentShader = `
            uniform float dTime;
            uniform float aspect;
            uniform vec2 pointer;
            uniform float pointerDown;
            uniform float pointerRadius;
            uniform float pointerDuration;
            uniform sampler2D fbTexture;
            
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
              vec2 mouse = pointer * vec2(aspect, 1);
              f = 1. - smoothstep(pointerRadius * 0.1, pointerRadius, distance(uv, mouse));
            }
            rVal += f * 0.1;
            rVal = clamp(rVal, 0., 1.);
            diffuseColor.rgb = vec3(rVal);
            `
          )
          
          shader.defines = shader.defines || {}
          shader.defines.USE_UV = ''
        }}
      />
    </mesh>
  )
}

function Scene({ topImage, bottomImage }) {
  const { size, gl } = useThree()
  const [pointer, setPointer] = useState(new THREE.Vector2().setScalar(10))
  const [pointerDown, setPointerDown] = useState(1)
  const [blobTexture, setBlobTexture] = useState(null)
  const pointerRadius = 0.375
  const pointerDuration = 2.5
  const aspect = size.width / size.height
  
  useEffect(() => {
    const handlePointerMove = (event) => {
      setPointer(new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      ))
    }
    
    const handlePointerLeave = () => {
      setPointer(new THREE.Vector2().setScalar(10))
    }
    
    window.addEventListener('pointermove', handlePointerMove)
    gl.domElement.addEventListener('pointerleave', handlePointerLeave)
    
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      gl.domElement.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [gl.domElement])
  
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
        {blobTexture && (
          <DualImageReveal 
            blobTexture={blobTexture}
            topImagePath={topImage}
            bottomImagePath={bottomImage}
          />
        )}
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
    <div className="absolute inset-0 z-0 pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene 
          topImage={topImage}
          bottomImage={bottomImage}
        />
      </Canvas>
    </div>
  )
}

