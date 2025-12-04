import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Scene } from './components/Scene'
import { Effects } from './components/Effects'
import { UI } from './components/UI'

export default function App() {
  return (
    <>
      <Canvas
        camera={{
          position: [0, 4, 20],
          fov: 45,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
        style={{ background: 'linear-gradient(180deg, #0a1a12 0%, #050a07 100%)' }}
      >
        <color attach="background" args={['#050a07']} />
        <fog attach="fog" args={['#050a07', 15, 40]} />
        
        <Scene />
        <Effects />
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={8}
          maxDistance={35}
          minPolarAngle={Math.PI * 0.2}
          maxPolarAngle={Math.PI * 0.6}
          autoRotate
          autoRotateSpeed={0.3}
          dampingFactor={0.05}
          enableDamping
        />
      </Canvas>
      
      <UI />
      
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Playfair+Display:wght@300;400&display=swap"
        rel="stylesheet"
      />
    </>
  )
}
