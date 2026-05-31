"use client";

import React, { forwardRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { LensingEffectImpl } from './LensingEffect';
import * as THREE from 'three';

export const LensingEffect = forwardRef(function LensingEffect(props, ref): React.JSX.Element {
  // Memoize the custom post-processing effect
  const effect = useMemo(() => new LensingEffectImpl(), []);
  const { size } = useThree();

  useFrame((state) => {
    // Convert R3F normalized pointer (-1 to 1) to Screen UV coordinates (0 to 1)
    const x = (state.pointer.x + 1) / 2;
    // R3F y is positive at the top, which matches WebGL UV y (positive at top)
    const y = (state.pointer.y + 1) / 2;
    
    // Gently lerp the mouse uniform to the actual mouse position for smooth, weighty lensing
    const target = new THREE.Vector2(x, y);
    effect.uniforms.get('uMouse')!.value.lerp(target, 0.15);
    
    // Keep aspect ratio uniform updated to prevent oval-shaped black holes
    effect.uniforms.get('uAspect')!.value = size.width / size.height;
  });

  return <primitive ref={ref} object={effect} dispose={null} /> as React.JSX.Element;
});
