"use client";

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Clouds, Cloud } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { LensingEffect } from '@/components/effects/LensingEffectComponent';

// Custom shader for our 6,000+ astrophysics stars
const starShader = {
  uniforms: {},
  vertexShader: `
    attribute float size;
    attribute vec3 color;
    varying vec3 vColor;
    void main() {
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      // Realistic size attenuation based on depth
      gl_PointSize = size * (400.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    varying vec3 vColor;
    void main() {
      // Map point coordinates from 0..1 to -1..1
      vec2 coord = (gl_PointCoord - 0.5) * 2.0;
      float dist = length(coord);
      
      // Core point of light (sharp and intensely focused)
      float core = exp(-dist * 12.0);
      
      // Astrophotography Diffraction Spikes (Cross shape)
      // Spikes extend outward along X and Y axes
      float spikeX = exp(-abs(coord.y) * 60.0 - abs(coord.x) * 1.5);
      float spikeY = exp(-abs(coord.x) * 60.0 - abs(coord.y) * 1.5);
      
      float alpha = core + (spikeX + spikeY) * 0.5;
      
      // Smooth fade at the edges of the quad
      alpha *= smoothstep(1.0, 0.8, dist);
      
      gl_FragColor = vec4(vColor, alpha);
    }
  `
};

function Starfield() {
  const ref = useRef<THREE.Points>(null);
  
  const [positions, colors, sizes] = useMemo(() => {
    // Reduced density by 60% for vast negative space
    const count = 6000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    
    const colorWhite = new THREE.Color('#ffffff');
    const colorBlue = new THREE.Color('#bae6fd');
    const colorOrange = new THREE.Color('#f97316');

    for (let i = 0; i < count; i++) {
      // Distribute spherically around the camera
      const r = 20 + Math.random() * 80;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      
      // Steeper logarithmic size scale: very few massive bright stars, thousands of dim points
      siz[i] = Math.pow(Math.random(), 6) * 3.5 + 0.1;

      // Temperature ratio: 85% White, 10% Blue, 5% Orange
      const rand = Math.random();
      const c = rand > 0.15 ? colorWhite : rand > 0.05 ? colorBlue : colorOrange;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    
    return [pos, col, siz];
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      // Infinitesimal automatic rotation of the entire galaxy
      ref.current.rotation.y += delta * 0.01;
      ref.current.rotation.x += delta * 0.005;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial 
        vertexShader={starShader.vertexShader} 
        fragmentShader={starShader.fragmentShader} 
        transparent={true} 
        depthWrite={false} 
        blending={THREE.AdditiveBlending} 
      />
    </points>
  );
}

export function SpaceBackground() {
  return (
    <div className="fixed inset-0 pointer-events-auto z-0 overflow-hidden bg-[#09090b]">
      <Canvas camera={{ position: [0, 0, 0], fov: 60 }}>
        {/* Layer 1: The Void */}
        <color attach="background" args={['#09090b']} />
        
        {/* Ambient lighting for volumetric clouds */}
        <ambientLight intensity={1.0} />
        
        {/* Layer 2: Starfield */}
        <Starfield />

        {/* Layer 3: Realistic Milky Way Nebulae & Dust Lanes */}
        <Clouds material={THREE.MeshBasicMaterial} limit={400} range={400}>
          {/* Ethereal Gas: Warm Golds / Ambers */}
          <Cloud position={[10, 5, -40]} speed={0.1} opacity={0.06} color="#fbbf24" bounds={[30, 20, 15]} volume={25} />
          {/* Ethereal Gas: Aged Stellar Yellows */}
          <Cloud position={[-20, -10, -50]} speed={0.1} opacity={0.04} color="#fde047" bounds={[40, 20, 15]} volume={30} />
          {/* Ethereal Gas: H-alpha Hydrogen Pink */}
          <Cloud position={[0, 15, -60]} speed={0.05} opacity={0.05} color="#fecdd3" bounds={[40, 30, 20]} volume={35} />
          
          {/* Opaque Dark Dust Lanes (cuts through the gas to create structural voids) */}
          <Cloud position={[5, -5, -35]} speed={0.1} opacity={0.7} color="#09090b" bounds={[40, 10, 10]} volume={25} />
          <Cloud position={[-15, 5, -45]} speed={0.08} opacity={0.8} color="#000000" bounds={[30, 10, 10]} volume={20} />
        </Clouds>

        {/* Layer 4: Post-Processing Pipeline */}
        <EffectComposer>
          <Bloom luminanceThreshold={0.9} luminanceSmoothing={0.1} height={300} intensity={2.5} />
          <LensingEffect />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
