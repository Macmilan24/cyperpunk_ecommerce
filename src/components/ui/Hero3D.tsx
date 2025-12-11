"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, PerspectiveCamera } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Artifact() {
  const meshRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
    if (outerRef.current) {
      outerRef.current.rotation.x = -state.clock.getElapsedTime() * 0.1;
      outerRef.current.rotation.y = -state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {/* Inner Core */}
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial 
            color="#CCFF00" 
            wireframe 
            emissive="#CCFF00"
            emissiveIntensity={0.5}
          />
        </mesh>
        
        {/* Outer Shell */}
        <mesh ref={outerRef}>
          <octahedronGeometry args={[2.5, 0]} />
          <meshStandardMaterial 
            color="#00F0FF" 
            wireframe 
            transparent
            opacity={0.3}
          />
        </mesh>
      </Float>
    </group>
  );
}

export function Hero3D() {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#CCFF00" intensity={0.5} />
        
        <Artifact />
        
        <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate 
            autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
