'use client'

import { useRef, useEffect, useMemo, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { useFBO, OrbitControls, useGLTF } from '@react-three/drei'
import { TextureLoader } from 'three'
import * as THREE from 'three'

// SVG to 3D Extrusion Component
function SVGExtrusion({ svgPath, depth = 0.5 }) {
  const shapeRef = useRef()
  
  useEffect(() => {
    // Load SVG and convert to shape
    const loader = new THREE.FileLoader()
    loader.load(svgPath, (data) => {
      // Parse SVG and create shape
      // You'll need a proper SVG parser, but here's the concept:
      // 1. Parse SVG path data
      // 2. Create THREE.Shape from SVG path
      // 3. Extrude the shape
      const shape = new THREE.Shape() // Create from SVG path
      const extrudeSettings = {
        depth,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelSegments: 3
      }
      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
      shapeRef.current = geometry
    })
  }, [svgPath, depth])
  
  return shapeRef.current ? (
    <mesh geometry={shapeRef.current}>
      <meshStandardMaterial color={0xffffff} />
    </mesh>
  ) : null
}

// Blob Component - Creates the framebuffer feedback effect
function Blob({ pointer, pointerDown, pointerRadius, pointerDuration, dTime, aspect, onTextureReady }) {
  const { gl, size } = useThree()
  const rtOutput = useFBO(size.width, size.height)
  const rtSceneRef = useRef()
  const rtCameraRef = useRef(new THREE.Camera())
  const prevTextureRef = useRef(null)

  // Initialize render target texture
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

// Profile Image Component - Uses your profile photo
function ProfileImageMask({ blobTexture, imagePath }) {
  const meshRef = useRef()
  const materialRef = useRef()
  const texture = useLoader(TextureLoader, imagePath)
  
  useEffect(() => {
    if (texture) {
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.needsUpdate = true
    }
  }, [texture])
  
  useEffect(() => {
    if (!materialRef.current || !blobTexture) return
    
    const uniforms = { texBlob: { value: blobTexture } }
    
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
        varying vec4 vPosProj;
        ${shader.fragmentShader}
      `.replace(
        `#include <clipping_planes_fragment>`,
        `
        vec2 blobUV = ((vPosProj.xy / vPosProj.w) + 1.) * 0.5;
        vec4 blobData = texture(texBlob, blobUV);
        if (blobData.r < 0.01) discard;
        #include <clipping_planes_fragment>
        `
      )
    }
    materialRef.current.needsUpdate = true
  }, [blobTexture])

  return (
    <>
      {/* Option 1: Sphere with profile texture (3D portrait) */}
      <mesh ref={meshRef} position={[0, 1.5, 0]} scale={[3, 3, 3]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial 
          ref={materialRef}
          map={texture}
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>
      
      {/* Option 2: Flat plane (uncomment to use instead) */}
      {/* <mesh ref={meshRef} position={[0, 1.5, 0]} rotation={[0, 0, 0]} scale={[2.5, 2.5, 1]}>
        <planeGeometry args={[1, 1.2]} />
        <meshStandardMaterial 
          ref={materialRef}
          map={texture}
        />
      </mesh> */}
    </>
  )
}

// Helmet/Geometry Component with blob masking
function MaskedGeometry({ blobTexture, geometryType = 'gltf', modelPath, svgPath, profileImage }) {
  const meshRef = useRef()
  
  // Profile image mode
  if (geometryType === 'profile' && profileImage) {
    return <ProfileImageMask blobTexture={blobTexture} imagePath={profileImage} />
  }
  
  // Load GLTF model (BEST OPTION)
  let gltf = null
  try {
    if (geometryType === 'gltf' && modelPath) {
      gltf = useGLTF(modelPath)
    }
  } catch (e) {
    console.warn('GLTF model not found, using fallback:', e)
  }
  
  // Or use SVG extrusion
  const svgGeometry = geometryType === 'svg' && svgPath
    ? <SVGExtrusion svgPath={svgPath} />
    : null
  
  if (!blobTexture) {
    return (
      <mesh ref={meshRef} position={[0, 1.5, 0.75]} scale={[3.5, 3.5, 3.5]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={0xffffff} />
      </mesh>
    )
  }

  const materialRef = useRef()
  
  useEffect(() => {
    if (!materialRef.current) return
    
    const uniforms = { texBlob: { value: blobTexture } }
    
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
        varying vec4 vPosProj;
        ${shader.fragmentShader}
      `.replace(
        `#include <clipping_planes_fragment>`,
        `
        vec2 blobUV = ((vPosProj.xy / vPosProj.w) + 1.) * 0.5;
        vec4 blobData = texture(texBlob, blobUV);
        if (blobData.r < 0.01) discard;
        #include <clipping_planes_fragment>
        `
      )
    }
    materialRef.current.needsUpdate = true
  }, [blobTexture])

  // Render GLTF model if available
  if (gltf && gltf.nodes) {
    const helmetNode = Object.values(gltf.nodes)[0] // Get first node
    return (
      <>
        <primitive 
          ref={meshRef}
          object={helmetNode}
          position={[0, 1.5, 0.75]}
          scale={[3.5, 3.5, 3.5]}
        >
          <meshStandardMaterial 
            ref={materialRef}
            color={0xffffff}
          />
        </primitive>
        <WireframeOverlay />
      </>
    )
  }
  
  // Fallback to placeholder
  return (
    <>
      <mesh ref={meshRef} position={[0, 1.5, 0.75]} scale={[3.5, 3.5, 3.5]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial 
          ref={materialRef}
          color={0xffffff}
        />
      </mesh>
      <WireframeOverlay />
    </>
  )
}

function WireframeOverlay() {
  const meshRef = useRef()
  const timeRef = useRef(0)
  
  useFrame((state) => {
    timeRef.current = state.clock.elapsedTime
    if (meshRef.current?.material) {
      meshRef.current.material.uniforms?.time?.value = timeRef.current
    }
  })

  return (
    <mesh 
      ref={meshRef}
      position={[0, 1.5, 0.75]} 
      scale={[3.5, 3.5, 3.5]}
      rotation={[Math.PI * 0.5, 0, 0]}
    >
      <icosahedronGeometry args={[1, 0]} />
      <meshBasicMaterial
        color={0x000000}
        wireframe
        transparent
        opacity={0.25}
        onBeforeCompile={(shader) => {
          shader.uniforms.time = { value: timeRef.current }
          shader.vertexShader = `
            varying float vYVal;
            ${shader.vertexShader}
          `.replace(
            `#include <begin_vertex>`,
            `#include <begin_vertex>
              vYVal = position.y;
            `
          )
          
          shader.fragmentShader = `
            uniform float time;
            varying float vYVal;
            ${shader.fragmentShader}
          `.replace(
            `#include <color_fragment>`,
            `#include <color_fragment>
            float y = fract(vYVal * 0.25 + time * 0.5);
            float fY = smoothstep(0., 0.01, y) - smoothstep(0.02, 0.1, y);
            diffuseColor.a *= fY * 0.9 + 0.1;
            `
          )
        }}
      />
    </mesh>
  )
}

function Scene({ geometryType, modelPath, svgPath, profileImage }) {
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
      <ambientLight intensity={Math.PI} />
      
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
        <MaskedGeometry 
          blobTexture={blobTexture}
          geometryType={geometryType}
          modelPath={modelPath}
          svgPath={svgPath}
          profileImage={profileImage}
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

export function BlobCursorMask({ 
  geometryType = 'profile',     // 'profile' | 'gltf' | 'svg' | 'placeholder'
  modelPath = null,              // '/models/helmet.glb'
  svgPath = null,                // '/assets/helmet.svg'
  profileImage = '/assets/profile.jpg' // Your profile photo path
}) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene 
          geometryType={geometryType}
          modelPath={modelPath}
          svgPath={svgPath}
          profileImage={profileImage}
        />
      </Canvas>
    </div>
  )
}
