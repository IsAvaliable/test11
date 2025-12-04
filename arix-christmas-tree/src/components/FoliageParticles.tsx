import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { foliageVertexShader, foliageFragmentShader } from '../shaders/foliageShader'
import { useTreeStore } from '../store/useTreeStore'

const PARTICLE_COUNT = 8000

// Generate tree cone position
function getTreePosition(): THREE.Vector3 {
  const heightRatio = Math.random()
  const y = heightRatio * 7 - 1 // -1 to 6
  const maxRadius = 3.5 * (1 - heightRatio * 0.85) // Cone shape
  const angle = Math.random() * Math.PI * 2
  const radius = Math.random() * maxRadius
  
  return new THREE.Vector3(
    Math.cos(angle) * radius,
    y,
    Math.sin(angle) * radius
  )
}

// Generate scattered position
function getScatterPosition(): THREE.Vector3 {
  const radius = 8 + Math.random() * 12
  const theta = Math.random() * Math.PI * 2
  const phi = Math.acos(2 * Math.random() - 1)
  
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta) + 2,
    radius * Math.cos(phi)
  )
}

export function FoliageParticles() {
  const pointsRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { morphProgress } = useTreeStore()

  const { geometry, uniforms } = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    
    const scatterPositions = new Float32Array(PARTICLE_COUNT * 3)
    const treePositions = new Float32Array(PARTICLE_COUNT * 3)
    const randomOffsets = new Float32Array(PARTICLE_COUNT)
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const scatter = getScatterPosition()
      const tree = getTreePosition()
      
      scatterPositions[i * 3] = scatter.x
      scatterPositions[i * 3 + 1] = scatter.y
      scatterPositions[i * 3 + 2] = scatter.z
      
      treePositions[i * 3] = tree.x
      treePositions[i * 3 + 1] = tree.y
      treePositions[i * 3 + 2] = tree.z
      
      randomOffsets[i] = Math.random()
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(treePositions.slice(), 3))
    geo.setAttribute('scatterPosition', new THREE.BufferAttribute(scatterPositions, 3))
    geo.setAttribute('treePosition', new THREE.BufferAttribute(treePositions, 3))
    geo.setAttribute('randomOffset', new THREE.BufferAttribute(randomOffsets, 1))
    
    const unis = {
      uTime: { value: 0 },
      uMorphProgress: { value: 0 },
      uBaseColor: { value: new THREE.Color('#0d4a3a') }, // Deep emerald
      uGlowColor: { value: new THREE.Color('#ffd700') }, // Gold glow
    }
    
    return { geometry: geo, uniforms: unis }
  }, [])

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
      materialRef.current.uniforms.uMorphProgress.value = morphProgress
    }
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={foliageVertexShader}
        fragmentShader={foliageFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
