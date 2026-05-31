import { Effect } from 'postprocessing';
import * as THREE from 'three';

const fragmentShader = `
uniform vec2 uMouse;
uniform float uAspect;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  // Fix aspect ratio to ensure perfect circular distortion
  vec2 aspectUV = uv;
  aspectUV.x *= uAspect;
  
  vec2 aspectMouse = uMouse;
  aspectMouse.x *= uAspect;
  
  float dist = distance(aspectUV, aspectMouse);
  
  // Gravitational lensing parameters
  float radius = 0.35; // Size of the distortion field
  float strength = 0.08; // How heavily the space-time bends
  
  vec2 offset = vec2(0.0);
  
  if (dist < radius && dist > 0.0) {
    // Smooth falloff from center to edge of the gravity well
    float falloff = smoothstep(0.0, radius, dist);
    
    // Direction vector from the current pixel to the cursor (gravity source)
    vec2 dir = normalize(aspectUV - aspectMouse);
    
    // Push the pixel sampling inward towards the mass (simulating light bending around the mass)
    offset = dir * (1.0 - falloff) * strength;
    
    // Revert aspect ratio fix for the actual UV offset
    offset.x /= uAspect;
  }
  
  // Output the distorted pixel
  outputColor = texture2D(inputBuffer, uv - offset);
}
`;

export class LensingEffectImpl extends Effect {
  constructor() {
    super('LensingEffect', fragmentShader, {
      uniforms: new Map<string, THREE.Uniform<any>>([
        ['uMouse', new THREE.Uniform(new THREE.Vector2(0.5, 0.5))],
        ['uAspect', new THREE.Uniform(1.0)]
      ])
    });
  }
}
