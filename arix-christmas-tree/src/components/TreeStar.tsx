import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useTreeStore } from '../store/useTreeStore'

export function TreeStar() {
  const groupRef = useRef<THREE.Group>(null)
  const { morphProgress } = useTreeStore()
  
  const scatterPosition = useMemo(() => new THREE.Vector3(
    (Math.random() - 0.5) * 15,
    8 + Math.random() * 5,
    (Math.random() - 0.5) * 15
  ), [])
  
  const treePosition = useMemo(() => new THREE.Vector3(0, 6.5, 0), [])

  const starShape = useMemo(() => {
    const shape = new THREE.Shape()
    const points = 5
    const outerRadius = 1
    const innerRadius = 0.38
    
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

  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.elapsedTime
    
    // Interpolate position
    const pos = new THREE.Vector3().lerpVectors(
      scatterPosition,
      treePosition,
      morphProgress
    )
    
    // Floating when scattered
    const floatAmount = (1 - morphProgress) * 0.8
    pos.y += Math.sin(time * 0.5) * floatAmount
    pos.x += Math.cos(time * 0.3) * floatAmount * 0.5
    
    groupRef.current.position.copy(pos)
    
    // Rotation - fast when scattered, slow pulse when on tree
    const rotationSpeed = 0.2 + (1 - morphProgress) * 1.5
    groupRef.current.rotation.z = time * rotationSpeed
    groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.2 * (1 - morphProgress)
    
    // Scale pulse
    const scale = 0.6 + Math.sin(time * 2) * 0.05
    groupRef.current.scale.setScalar(scale)
  })

  return (
    <group ref={groupRef}>
      {/* Main star */}
      <mesh>
        <extrudeGeometry args={[starShape, { depth: 0.15, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05 }]} />
        <meshStandardMaterial
          color="#FFD700"
          metalness={0.95}
          roughness={0.05}
          emissive="#FFD700"
          emissiveIntensity={1.5}
          envMapIntensity={2}
        />
      </mesh>
      
      {/* Inner glow sphere */}
      <mesh scale={0.3}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#FFFACD" transparent opacity={0.8} />
      </mesh>
      
      {/* Point light for glow effect */}
      <pointLight color="#FFD700" intensity={2} distance={5} decay={2} />
    </group>
  )
}
