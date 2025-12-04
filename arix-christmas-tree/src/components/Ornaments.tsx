import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useTreeStore } from '../store/useTreeStore'

interface OrnamentData {
  scatterPosition: THREE.Vector3
  treePosition: THREE.Vector3
  scale: number
  weight: number // Movement weight
  rotationSpeed: number
}

// Generate positions on tree cone surface
function getTreeSurfacePosition(heightBias = 0.5): THREE.Vector3 {
  const heightRatio = Math.pow(Math.random(), heightBias)
  const y = heightRatio * 6 - 0.5
  const maxRadius = 3.2 * (1 - heightRatio * 0.85)
  const angle = Math.random() * Math.PI * 2
  const radius = maxRadius * (0.7 + Math.random() * 0.3)
  
  return new THREE.Vector3(
    Math.cos(angle) * radius,
    y,
    Math.sin(angle) * radius
  )
}

function getScatterPosition(weight: number): THREE.Vector3 {
  const radius = 6 + Math.random() * 10 * weight
  const theta = Math.random() * Math.PI * 2
  const phi = Math.acos(2 * Math.random() - 1)
  
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta) + 3,
    radius * Math.cos(phi)
  )
}

// Gift Boxes (Heavy ornaments)
export function GiftBoxes({ count = 15 }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const { morphProgress } = useTreeStore()
  
  const ornaments = useMemo<OrnamentData[]>(() => {
    return Array.from({ length: count }, () => {
      const weight = 0.3 + Math.random() * 0.2 // Heavy = less movement
      return {
        scatterPosition: getScatterPosition(weight),
        treePosition: getTreeSurfacePosition(0.7),
        scale: 0.25 + Math.random() * 0.15,
        weight,
        rotationSpeed: 0.2 + Math.random() * 0.3,
      }
    })
  }, [count])

  const colors = useMemo(() => {
    return [
      new THREE.Color('#8B0000'), // Dark red
      new THREE.Color('#FFD700'), // Gold
      new THREE.Color('#0d4a3a'), // Emerald
      new THREE.Color('#4a0d3a'), // Deep purple
    ]
  }, [])

  useFrame((state: { clock: { elapsedTime: number } }) => {
    if (!meshRef.current) return
    const time = state.clock.elapsedTime
    const dummy = new THREE.Object3D()
    
    ornaments.forEach((orn: OrnamentData, i: number) => {
      const pos = new THREE.Vector3().lerpVectors(
        orn.scatterPosition,
        orn.treePosition,
        morphProgress
      )
      
      // Floating animation when scattered
      const floatAmount = (1 - morphProgress) * orn.weight
      pos.y += Math.sin(time * 0.5 + i) * floatAmount * 0.5
      pos.x += Math.sin(time * 0.3 + i * 2) * floatAmount * 0.3
      
      dummy.position.copy(pos)
      dummy.rotation.set(
        time * orn.rotationSpeed * (1 - morphProgress * 0.8),
        time * orn.rotationSpeed * 0.5,
        0
      )
      dummy.scale.setScalar(orn.scale)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
      meshRef.current!.setColorAt(i, colors[i % colors.length])
    })
    
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        metalness={0.3}
        roughness={0.4}
        envMapIntensity={1.5}
      />
    </instancedMesh>
  )
}


// Baubles (Light ornaments - metallic spheres)
export function Baubles({ count = 40 }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const { morphProgress } = useTreeStore()
  
  const ornaments = useMemo<OrnamentData[]>(() => {
    return Array.from({ length: count }, () => {
      const weight = 0.6 + Math.random() * 0.3
      return {
        scatterPosition: getScatterPosition(weight),
        treePosition: getTreeSurfacePosition(0.5),
        scale: 0.15 + Math.random() * 0.12,
        weight,
        rotationSpeed: 0.5 + Math.random() * 0.5,
      }
    })
  }, [count])

  const colors = useMemo(() => [
    new THREE.Color('#FFD700'), // Gold
    new THREE.Color('#C0C0C0'), // Silver
    new THREE.Color('#B8860B'), // Dark gold
    new THREE.Color('#CD853F'), // Peru/bronze
  ], [])

  useFrame((state: { clock: { elapsedTime: number } }) => {
    if (!meshRef.current) return
    const time = state.clock.elapsedTime
    const dummy = new THREE.Object3D()
    
    ornaments.forEach((orn: OrnamentData, i: number) => {
      const pos = new THREE.Vector3().lerpVectors(
        orn.scatterPosition,
        orn.treePosition,
        morphProgress
      )
      
      const floatAmount = (1 - morphProgress) * orn.weight
      pos.y += Math.sin(time * 0.7 + i * 0.5) * floatAmount * 0.8
      pos.x += Math.cos(time * 0.4 + i) * floatAmount * 0.5
      pos.z += Math.sin(time * 0.5 + i * 1.5) * floatAmount * 0.4
      
      dummy.position.copy(pos)
      dummy.scale.setScalar(orn.scale)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
      meshRef.current!.setColorAt(i, colors[i % colors.length])
    })
    
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        metalness={0.95}
        roughness={0.05}
        envMapIntensity={2}
      />
    </instancedMesh>
  )
}

// Tiny Lights (Ultra-light elements)
export function TinyLights({ count = 80 }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const { morphProgress } = useTreeStore()
  
  const ornaments = useMemo<OrnamentData[]>(() => {
    return Array.from({ length: count }, () => {
      const weight = 0.8 + Math.random() * 0.2
      return {
        scatterPosition: getScatterPosition(weight),
        treePosition: getTreeSurfacePosition(0.3),
        scale: 0.04 + Math.random() * 0.03,
        weight,
        rotationSpeed: 1 + Math.random(),
      }
    })
  }, [count])

  useFrame((state: { clock: { elapsedTime: number } }) => {
    if (!meshRef.current) return
    const time = state.clock.elapsedTime
    const dummy = new THREE.Object3D()
    const color = new THREE.Color()
    
    ornaments.forEach((orn: OrnamentData, i: number) => {
      const pos = new THREE.Vector3().lerpVectors(
        orn.scatterPosition,
        orn.treePosition,
        morphProgress
      )
      
      const floatAmount = (1 - morphProgress) * orn.weight
      pos.y += Math.sin(time + i * 0.3) * floatAmount
      pos.x += Math.cos(time * 0.8 + i * 0.5) * floatAmount * 0.7
      pos.z += Math.sin(time * 0.6 + i * 0.7) * floatAmount * 0.6
      
      // Pulsing scale
      const pulse = 1 + Math.sin(time * 3 + i) * 0.3
      
      dummy.position.copy(pos)
      dummy.scale.setScalar(orn.scale * pulse)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
      
      // Warm white to gold color variation
      const hue = 0.1 + Math.sin(time * 2 + i) * 0.05
      color.setHSL(hue, 0.8, 0.6 + Math.sin(time * 4 + i) * 0.2)
      meshRef.current!.setColorAt(i, color)
    })
    
    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  )
}

// Stars (Floating star decorations)
export function Stars({ count = 25 }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const { morphProgress } = useTreeStore()
  
  const ornaments = useMemo<OrnamentData[]>(() => {
    return Array.from({ length: count }, () => {
      const weight = 0.9 + Math.random() * 0.1
      return {
        scatterPosition: getScatterPosition(weight),
        treePosition: getTreeSurfacePosition(0.4),
        scale: 0.08 + Math.random() * 0.06,
        weight,
        rotationSpeed: 0.8 + Math.random() * 0.4,
      }
    })
  }, [count])

  useFrame((state: { clock: { elapsedTime: number } }) => {
    if (!meshRef.current) return
    const time = state.clock.elapsedTime
    const dummy = new THREE.Object3D()
    
    ornaments.forEach((orn: OrnamentData, i: number) => {
      const pos = new THREE.Vector3().lerpVectors(
        orn.scatterPosition,
        orn.treePosition,
        morphProgress
      )
      
      const floatAmount = (1 - morphProgress) * orn.weight
      pos.y += Math.sin(time * 0.9 + i * 0.4) * floatAmount * 0.9
      pos.x += Math.cos(time * 0.5 + i * 0.6) * floatAmount * 0.6
      
      dummy.position.copy(pos)
      dummy.rotation.z = time * orn.rotationSpeed
      dummy.scale.setScalar(orn.scale)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  // Create star shape
  const starShape = useMemo(() => {
    const shape = new THREE.Shape()
    const points = 5
    const outerRadius = 1
    const innerRadius = 0.4
    
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius
      const angle = (i * Math.PI) / points - Math.PI / 2
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      
      if (i === 0) shape.moveTo(x, y)
      else shape.lineTo(x, y)
    }
    shape.closePath()
    return shape
  }, [])

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <extrudeGeometry args={[starShape, { depth: 0.1, bevelEnabled: false }]} />
      <meshStandardMaterial
        color="#FFD700"
        metalness={0.9}
        roughness={0.1}
        emissive="#FFD700"
        emissiveIntensity={0.5}
      />
    </instancedMesh>
  )
}
