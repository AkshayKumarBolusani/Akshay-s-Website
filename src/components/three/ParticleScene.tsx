"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { getShape, type ShapeName } from "./shapes";

export type SceneTimeline = { shapes: ShapeName[]; tilt?: number };

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uBurst;
  attribute float aRandom;
  varying float vRandom;
  varying float vDepth;
  void main() {
    vec3 p = position;
    float w = sin(uTime * 0.9 + aRandom * 6.2831) * 0.035;
    p += normalize(p + 0.0001) * (w + uBurst * aRandom * 0.9);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.45 + aRandom) * (1.0 / -mv.z);
    vRandom = aRandom;
    vDepth = clamp((-mv.z - 3.0) / 6.0, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  varying float vRandom;
  varying float vDepth;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a = pow(a, 1.6);
    vec3 col = vRandom > 0.93 ? uColorC : mix(uColorA, uColorB, smoothstep(0.15, 0.95, vRandom));
    gl_FragColor = vec4(col, a * (1.0 - vDepth * 0.65));
  }
`;

function Particles({
  timeline,
  count,
  reduced,
}: {
  timeline: SceneTimeline;
  count: number;
  reduced: boolean;
}) {
  const points = useRef<THREE.Points>(null);
  const group = useRef<THREE.Group>(null);
  const { gl, size } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);
  const velocity = useRef(0);
  const lastY = useRef(0);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const start = getShape(timeline.shapes[0], count);
    // start exploded out so the first frame "assembles"
    const cur = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) cur[i] = start[i] * (reduced ? 1 : 3.2);
    const rnd = new Float32Array(count);
    for (let i = 0; i < count; i++) rnd[i] = ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1;
    g.setAttribute("position", new THREE.BufferAttribute(cur, 3));
    g.setAttribute("aRandom", new THREE.BufferAttribute(rnd, 1));
    return g;
    // timeline is intentionally read once; morph targets update below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: 26 },
          uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
          uBurst: { value: 0 },
          uColorA: { value: new THREE.Color("#c6ff3d") },
          uColorB: { value: new THREE.Color("#8b6cff") },
          uColorC: { value: new THREE.Color("#ff3d7f") },
        },
      }),
    [gl],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.current = max > 0 ? window.scrollY / max : 0;
      velocity.current += Math.abs(window.scrollY - lastY.current);
      lastY.current = window.scrollY;
    };
    onScroll();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const mat = () => points.current?.material as THREE.ShaderMaterial | undefined;

  useEffect(() => {
    const m = mat();
    if (m) m.uniforms.uSize.value = size.width < 768 ? 20 : 26;
  }, [size.width]);

  // when the page (timeline) changes, kick a burst so the morph reads as an event
  useEffect(() => {
    const m = mat();
    if (m) m.uniforms.uBurst.value = reduced ? 0 : 0.6;
  }, [timeline, reduced]);

  useFrame((state, delta) => {
    const pts = points.current;
    if (!pts) return;
    const m = pts.material as THREE.ShaderMaterial;
    const dt = Math.min(delta, 0.05);
    m.uniforms.uTime.value = state.clock.elapsedTime;
    m.uniforms.uBurst.value += (Math.min(velocity.current / 900, 0.35) - m.uniforms.uBurst.value) * 0.06;
    velocity.current *= 0.9;

    const shapes = timeline.shapes;
    const segs = shapes.length - 1;
    const f = segs > 0 ? Math.min(scroll.current, 0.9999) * segs : 0;
    const i0 = Math.floor(f);
    const k = f - i0;
    const e = k * k * (3 - 2 * k);
    const A = getShape(shapes[i0], count);
    const B = getShape(shapes[Math.min(i0 + 1, segs)], count);
    const pos = pts.geometry.attributes.position as THREE.BufferAttribute;
    const current = pos.array as Float32Array;
    const lerp = reduced ? 1 : 1 - Math.pow(0.0025, dt);
    for (let i = 0; i < count * 3; i++) {
      const target = A[i] + (B[i] - A[i]) * e;
      current[i] += (target - current[i]) * lerp;
    }
    pos.needsUpdate = true;

    if (group.current && !reduced) {
      group.current.rotation.y += dt * 0.08;
      group.current.rotation.x += ((mouse.current.y * 0.35 + (timeline.tilt ?? 0.2)) - group.current.rotation.x) * 0.04;
      group.current.rotation.z += (-mouse.current.x * 0.15 - group.current.rotation.z) * 0.04;
      group.current.position.x += (mouse.current.x * 0.25 - group.current.position.x) * 0.03;
    }
  });

  return (
    <group ref={group}>
      <points ref={points} geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}

export default function ParticleScene({
  timeline,
  reduced,
}: {
  timeline: SceneTimeline;
  reduced: boolean;
}) {
  const count = useMemo(() => {
    if (typeof window === "undefined") return 6000;
    const small = window.innerWidth < 768;
    const lowCores = (navigator.hardwareConcurrency ?? 8) <= 4;
    return small || lowCores ? 3800 : 7600;
  }, []);

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 7.2], fov: 45 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      frameloop={reduced ? "demand" : "always"}
    >
      <Particles timeline={timeline} count={count} reduced={reduced} />
    </Canvas>
  );
}
