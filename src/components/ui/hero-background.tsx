'use client';

import { useRef } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform float iTime;
  uniform vec2 iResolution;
  varying vec2 vUv;

  void main() {
    vec2 uv = (vUv * 2.0 - 1.0);
    uv.x *= iResolution.x / iResolution.y;

    float t = iTime * 0.2;
    
    vec3 color = vec3(0.0);
    for(float i = 1.0; i < 4.0; i++){
        uv.x += 0.6 / i * sin(i * 3.0 * uv.y + t);
        uv.y += 0.6 / i * cos(i * 3.0 * uv.x + t);
        color += 0.1 / length(uv) * vec3(
            sin(t + i), 
            cos(t + i * 2.0), 
            sin(t + i * 3.0)
        );
    }
    color *= 1.5;
    gl_FragColor = vec4(color, 1.0);
  }
`;

const FlowMaterial = shaderMaterial(
    { iTime: 0, iResolution: new THREE.Vector2(1, 1) },
    vertexShader,
    fragmentShader
);

extend({ FlowMaterial });

function ShaderPlane() {
    const materialRef = useRef<any>(null!);
    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.iTime = state.clock.elapsedTime;
            materialRef.current.iResolution.set(state.size.width, state.size.height);
        }
    });
    return (
        <mesh>
            <planeGeometry args={[2, 2]} />
            <flowMaterial ref={materialRef} />
        </mesh>
    );
}

export default function HeroBackground() {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <ShaderPlane />
            </Canvas>
        </div>
    );
}

declare module '@react-three/fiber' {
    interface ThreeElements {
        flowMaterial: any;
    }
}
