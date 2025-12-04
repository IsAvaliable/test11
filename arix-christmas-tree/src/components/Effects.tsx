import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Vector2 } from 'three'

export function Effects() {
  return (
    <EffectComposer>
      {/* Main bloom for luxurious golden glow */}
      <Bloom
        intensity={1.2}
        luminanceThreshold={0.8}
        luminanceSmoothing={0.9}
        mipmapBlur
        radius={0.8}
      />
      
      {/* Secondary bloom for softer overall glow */}
      <Bloom
        intensity={0.4}
        luminanceThreshold={0.4}
        luminanceSmoothing={0.5}
        mipmapBlur
        radius={0.4}
      />
      
      {/* Subtle chromatic aberration for cinematic feel */}
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new Vector2(0.0005, 0.0005)}
        radialModulation={true}
        modulationOffset={0.5}
      />
      
      {/* Vignette for dramatic framing */}
      <Vignette
        offset={0.3}
        darkness={0.6}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  )
}
