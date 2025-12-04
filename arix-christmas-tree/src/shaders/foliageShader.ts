export const foliageVertexShader = `
  uniform float uTime;
  uniform float uMorphProgress;
  
  attribute vec3 scatterPosition;
  attribute vec3 treePosition;
  attribute float randomOffset;
  
  varying float vRandomOffset;
  varying vec3 vPosition;
  
  void main() {
    vRandomOffset = randomOffset;
    
    // Interpolate between scatter and tree positions
    vec3 morphedPosition = mix(scatterPosition, treePosition, uMorphProgress);
    
    // Add breathing/floating animation
    float breathe = sin(uTime * 1.5 + randomOffset * 6.28) * 0.05;
    float floatY = sin(uTime * 0.8 + randomOffset * 3.14) * 0.03;
    
    // More movement when scattered
    float scatterMovement = (1.0 - uMorphProgress) * 0.3;
    morphedPosition.x += sin(uTime * 0.5 + randomOffset * 10.0) * scatterMovement;
    morphedPosition.y += floatY + breathe * (1.0 - uMorphProgress * 0.5);
    morphedPosition.z += cos(uTime * 0.7 + randomOffset * 8.0) * scatterMovement;
    
    vPosition = morphedPosition;
    
    vec4 mvPosition = modelViewMatrix * vec4(morphedPosition, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Point size with distance attenuation
    gl_PointSize = (25.0 + randomOffset * 10.0) * (1.0 / -mvPosition.z);
  }
`

export const foliageFragmentShader = `
  uniform float uTime;
  uniform vec3 uBaseColor;
  uniform vec3 uGlowColor;
  
  varying float vRandomOffset;
  varying vec3 vPosition;
  
  void main() {
    // Circular point shape
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    if (dist > 0.5) discard;
    
    // Soft edge glow
    float edgeGlow = smoothstep(0.5, 0.2, dist);
    float coreGlow = smoothstep(0.3, 0.0, dist);
    
    // Pulsing glow effect
    float pulse = sin(uTime * 2.0 + vRandomOffset * 6.28) * 0.15 + 0.85;
    
    // Height-based gold tint (more gold at tips)
    float heightFactor = smoothstep(-2.0, 6.0, vPosition.y);
    vec3 goldTint = vec3(1.0, 0.85, 0.4);
    
    // Mix base green with gold highlights
    vec3 color = mix(uBaseColor, goldTint, heightFactor * 0.3 + coreGlow * 0.2);
    color += uGlowColor * coreGlow * pulse * 0.5;
    
    // Final alpha with soft edges
    float alpha = edgeGlow * 0.9;
    
    gl_FragColor = vec4(color, alpha);
  }
`
