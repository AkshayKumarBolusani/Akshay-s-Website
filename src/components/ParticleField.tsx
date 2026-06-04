"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function Stars({ count = 1800, seed = 42, isMobile = false }: { count?: number; seed?: number; isMobile?: boolean }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const random = seededRandom(seed);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4 + random() * 8;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count, seed]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    if (isMobile) {
      ref.current.rotation.y += delta * 0.01;
    } else {
      ref.current.rotation.y += delta * 0.03;
      ref.current.rotation.x += delta * 0.008;
      const m = state.pointer;
      ref.current.position.x = m.x * 0.4;
      ref.current.position.y = m.y * 0.3;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isMobile ? 0.03 : 0.025}
        color="#9d8bff"
        transparent
        opacity={isMobile ? 0.6 : 0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function ParticleField() {
  const [isMobile, setIsMobile] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsMobile(!mq.matches);
    update();
    mq.addEventListener("change", update);
    
    const timer = setTimeout(() => setShouldRender(true), 100);
    
    return () => {
      mq.removeEventListener("change", update);
      clearTimeout(timer);
    };
  }, []);

  if (!shouldRender) return null;

  const count = isMobile ? 200 : 1000;

  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 60 }}
      dpr={isMobile ? 1 : [1, 1.5]}
      gl={{ 
        antialias: !isMobile, 
        alpha: true, 
        powerPreference: isMobile ? "low-power" : "high-performance",
        failIfMajorPerformanceCaveat: true,
      }}
      style={{ pointerEvents: "none" }}
      frameloop={isMobile ? "demand" : "always"}
    >
      <Stars count={count} isMobile={isMobile} />
    </Canvas>
  );
}
