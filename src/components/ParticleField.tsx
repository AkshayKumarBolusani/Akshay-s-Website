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

function Stars({ count = 1800, seed = 42 }: { count?: number; seed?: number }) {
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
    ref.current.rotation.y += delta * 0.03;
    ref.current.rotation.x += delta * 0.008;
    const m = state.pointer;
    ref.current.position.x = m.x * 0.4;
    ref.current.position.y = m.y * 0.3;
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
        size={0.025}
        color="#9d8bff"
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function ParticleField() {
  const [count, setCount] = useState(600);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setCount(mq.matches ? 1400 : 600);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 60 }}
      dpr={[1, 1.25]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <Stars count={count} />
    </Canvas>
  );
}
