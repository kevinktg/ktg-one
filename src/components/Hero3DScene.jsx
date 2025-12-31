'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Wireframe } from '@react-three/drei'
import * as THREE from 'three'

// Geometric wireframe network - subtle, technical aesthetic
function NetworkGraph() {
  const meshRef = useRef()
  const linesRef = useRef()

  // Create network nodes
  const { nodes, edges } = useMemo(() => {
    const nodeCount = 12
    const nodes = []
    const edges = []

    // Generate nodes in a sphere distribution
    for (let i = 0; i < nodeCount; i++) {
      const theta = (i / nodeCount) * Math.PI * 2
      const phi = Math.acos(2 * (i / nodeCount) - 1)
      const radius = 2
      nodes.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
      })
    }

    // Connect nearby nodes (wireframe network)
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = Math.sqrt(
          Math.pow(nodes[i].x - nodes[j].x, 2) +
          Math.pow(nodes[i].y - nodes[j].y, 2) +
          Math.pow(nodes[i].z - nodes[j].z, 2)
        )
        // Only connect if distance is reasonable
        if (dist < 2.5) {
          edges.push([i, j])
        }
      }
    }

    return { nodes, edges }
  }, [])

  // Slow rotation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  // Create line geometry
  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = []

    edges.forEach(([i, j]) => {
      const node1 = nodes[i]
      const node2 = nodes[j]
      positions.push(node1.x, node1.y, node1.z)
      positions.push(node2.x, node2.y, node2.z)
    })

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return geometry
  }, [nodes, edges])

  return (
    <group ref={meshRef}>
      {/* Wireframe network lines */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          color="hsl(0, 0%, 40%)"
          transparent
          opacity={0.3}
          linewidth={1}
        />
      </lineSegments>

      {/* Node points */}
      {nodes.map((node, i) => (
        <mesh key={i} position={[node.x, node.y, node.z]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial
            color="hsl(0, 0%, 60%)"
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  )
}

// Subtle geometric shape alternative
function GeometricShape() {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.15
    }
  })

  return (
    <group ref={meshRef}>
      <mesh>
        <icosahedronGeometry args={[2, 0]} />
        <meshStandardMaterial
          color="hsl(0, 0%, 20%)"
          wireframe
          transparent
          opacity={0.4}
          emissive="hsl(0, 0%, 10%)"
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Inner wireframe for depth */}
      <mesh>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial
          color="hsl(0, 0%, 30%)"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  )
}

export function Hero3DScene({ variant = 'network' }) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        {/* Subtle ambient lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.3} />
        <pointLight position={[-10, -10, -10]} intensity={0.2} />

        {/* Choose variant */}
        {variant === 'network' ? <NetworkGraph /> : <GeometricShape />}

        {/* Disable controls - it's just background */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          autoRotate={false}
        />
      </Canvas>
    </div>
  )
}

