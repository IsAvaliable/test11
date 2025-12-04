import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, SpotLight } from '@react-three/drei'
import { FoliageParticles } from './FoliageParticles'
import { GiftBoxes, Baubles, TinyLights, Stars } from './Ornaments'
import { TreeStar } from './TreeStar'
import { TreeTrunk } from './TreeTrunk'
import { useTreeStore, TreeMorphState } from '../store/useTreeStore'

export function Scene() {
  const { morphState, morphProgress, isTransitioning, setMorphProgress, setIsTransitioning } = useTreeStore()
  const targetProgress = morphState === TreeMorphState.TREE_SHAPE ? 1 : 0
  
  // Smooth transition animation
  useFrame((_, delta) => {
    if (isTransitioning) {
      const diff = targetProgress - morphProgress
      const speed = 1.2 // Transition speed
      
      if (Math.abs(diff) < 0.001) {
        setMorphProgress(targetProgress)
        setIsTransitioning(false)
      } else {
        // Eased interpolation
        const easeAmount = diff * Math.min(delta * speed, 0.1)
        setMorphProgress(morphProgress + easeAmount)
      }
    }
  })

  return (
    <>
      {/* Environment lighting - elegant lobby style */}
      <Environment preset="lobby" background={false} />
      
      {/* Ambient fill */}
      <ambientLight intensity={0.15} color="#1a3a2a" />
      
      {/* Main key light - warm gold */}
      <SpotLight
        position={[5, 12, 5]}
        angle={0.5}
        penumbra={0.8}
        intensity={100}
        color="#FFE4B5"
        castShadow
        shadow-mapSize={1024}
      />
      
      {/* Fill light - cool emerald */}
      <SpotLight
        position={[-6, 8, -4]}
        angle={0.6}
        penumbra={1}
        intensity={40}
        color="#2d5a4a"
      />
      
      {/* Rim light - golden accent */}
      <SpotLight
        position={[0, 15, -8]}
        angle={0.4}
        penumbra={0.5}
        intensity={60}
        color="#FFD700"
      />
      
      {/* Tree components */}
      <group>
        <FoliageParticles />
        <GiftBoxes count={18} />
        <Baubles count={50} />
        <TinyLights count={100} />
        <Stars count={30} />
        <TreeStar />
        <TreeTrunk />
      </group>
      
      {/* Ground reflection plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          color="#0a1a12"
          metalness={0.8}
          roughness={0.3}
          envMapIntensity={0.5}
        />
      </mesh>
    </>
  )
}
