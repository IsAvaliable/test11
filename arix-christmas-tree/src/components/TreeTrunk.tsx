import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useTreeStore } from '../store/useTreeStore'

export function TreeTrunk() {
  const meshRef = useRef<THREE.Mesh>(null)
  const { morphProgress } = useTreeStore()

  useFrame(() => {
    if (!meshRef.current) return
    // Fade in trunk as tree forms
    const material = meshRef.current.material as THREE.MeshStandardMaterial
    material.opacity = morphProgress * 0.9
  })

  return (
    <mesh ref={meshRef} position={[0, -1.8, 0]}>
      <cylinderGeometry args={[0.3, 0.4, 1.5, 16]} />
      <meshStandardMaterial
        color="#3d2817"
        roughness={0.9}
        metalness={0.1}
        transparent
        opacity={0}
      />
    </mesh>
  )
}
