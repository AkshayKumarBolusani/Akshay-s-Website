// Point-cloud target shapes. Every generator returns exactly `n` xyz triplets
// so the particle field can morph between any two of them.

export type ShapeName = "sphere" | "knot" | "galaxy" | "helix" | "lattice" | "wave" | "ring";

function rand(seed: number) {
  // deterministic so server/client + re-mounts look identical
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sphere(n: number, r = 2.1) {
  const out = new Float32Array(n * 3);
  const g = Math.PI * (3 - Math.sqrt(5));
  const R = rand(1);
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = g * i;
    const j = r * (0.96 + R() * 0.08);
    out[i * 3] = Math.cos(th) * rad * j;
    out[i * 3 + 1] = y * j;
    out[i * 3 + 2] = Math.sin(th) * rad * j;
  }
  return out;
}

function knot(n: number) {
  const out = new Float32Array(n * 3);
  const R = rand(2);
  const p = 2;
  const q = 3;
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    const r = 1.15 + 0.55 * Math.cos(q * t);
    const cx = r * Math.cos(p * t);
    const cy = r * Math.sin(p * t);
    const cz = 0.55 * Math.sin(q * t);
    const a = R() * Math.PI * 2;
    const tube = 0.18 * Math.sqrt(R());
    out[i * 3] = (cx + Math.cos(a) * tube) * 1.15;
    out[i * 3 + 1] = (cy + Math.sin(a) * tube) * 1.15;
    out[i * 3 + 2] = (cz + Math.cos(a + 1.3) * tube) * 1.15;
  }
  return out;
}

function galaxy(n: number) {
  const out = new Float32Array(n * 3);
  const R = rand(3);
  const arms = 4;
  for (let i = 0; i < n; i++) {
    const radius = Math.pow(R(), 1.6) * 3.4;
    const arm = (i % arms) / arms;
    const spin = radius * 1.35;
    const angle = arm * Math.PI * 2 + spin;
    const spread = 0.38 * (1 - radius / 4);
    out[i * 3] = Math.cos(angle) * radius + (R() - 0.5) * spread;
    out[i * 3 + 1] = (R() - 0.5) * 0.25 * (1.2 - radius / 3.4);
    out[i * 3 + 2] = Math.sin(angle) * radius + (R() - 0.5) * spread;
  }
  return out;
}

function helix(n: number) {
  const out = new Float32Array(n * 3);
  const R = rand(4);
  const turns = 3.2;
  const h = 5.4;
  for (let i = 0; i < n; i++) {
    const t = R();
    const kind = i % 10;
    const ang = t * Math.PI * 2 * turns;
    const y = (t - 0.5) * h;
    if (kind < 4) {
      out[i * 3] = Math.cos(ang) * 1;
      out[i * 3 + 2] = Math.sin(ang) * 1;
    } else if (kind < 8) {
      out[i * 3] = Math.cos(ang + Math.PI) * 1;
      out[i * 3 + 2] = Math.sin(ang + Math.PI) * 1;
    } else {
      // rungs
      const step = Math.round(t * 34) / 34;
      const a2 = step * Math.PI * 2 * turns;
      const l = R() * 2 - 1;
      out[i * 3] = Math.cos(a2) * l;
      out[i * 3 + 2] = Math.sin(a2) * l;
      out[i * 3 + 1] = (step - 0.5) * h;
      continue;
    }
    out[i * 3] += (R() - 0.5) * 0.12;
    out[i * 3 + 2] += (R() - 0.5) * 0.12;
    out[i * 3 + 1] = y;
  }
  return out;
}

function lattice(n: number) {
  const out = new Float32Array(n * 3);
  const R = rand(5);
  const side = Math.ceil(Math.cbrt(n));
  const s = 3.6 / side;
  for (let i = 0; i < n; i++) {
    const x = i % side;
    const y = Math.floor(i / side) % side;
    const z = Math.floor(i / (side * side));
    out[i * 3] = (x - side / 2) * s + (R() - 0.5) * 0.02;
    out[i * 3 + 1] = (y - side / 2) * s;
    out[i * 3 + 2] = (z - side / 2) * s;
  }
  return out;
}

function wave(n: number) {
  const out = new Float32Array(n * 3);
  const side = Math.ceil(Math.sqrt(n));
  for (let i = 0; i < n; i++) {
    const x = (i % side) / side - 0.5;
    const z = Math.floor(i / side) / side - 0.5;
    out[i * 3] = x * 7;
    out[i * 3 + 2] = z * 7;
    out[i * 3 + 1] = Math.sin(x * 9) * 0.35 + Math.cos(z * 7) * 0.35 - 0.6;
  }
  return out;
}

function ring(n: number) {
  const out = new Float32Array(n * 3);
  const R = rand(7);
  for (let i = 0; i < n; i++) {
    const a = R() * Math.PI * 2;
    const band = i % 3;
    const r = 1.6 + band * 0.55 + (R() - 0.5) * 0.12;
    out[i * 3] = Math.cos(a) * r;
    out[i * 3 + 1] = (R() - 0.5) * 0.08 + Math.sin(a * 3) * 0.12;
    out[i * 3 + 2] = Math.sin(a) * r;
  }
  return out;
}

const generators: Record<ShapeName, (n: number) => Float32Array> = {
  sphere,
  knot,
  galaxy,
  helix,
  lattice,
  wave,
  ring,
};

const cache = new Map<string, Float32Array>();

export function getShape(name: ShapeName, n: number): Float32Array {
  const key = `${name}:${n}`;
  let s = cache.get(key);
  if (!s) {
    s = generators[name](n);
    cache.set(key, s);
  }
  return s;
}
