"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MotionConfig } from "framer-motion";
import { ReactLenis, useLenis } from "lenis/react";
import type { SceneTimeline } from "@/components/three/ParticleScene";
import { Cursor } from "./Cursor";
import { Loader } from "./Loader";
import { Nav } from "./Nav";
import { useMediaQuery, useWebGL } from "./useMedia";

const ParticleScene = dynamic(() => import("@/components/three/ParticleScene"), {
  ssr: false,
});

function timelineFor(path: string): SceneTimeline {
  if (path === "/") return { shapes: ["sphere", "knot", "galaxy", "helix", "lattice", "ring", "sphere"] };
  if (path.startsWith("/work")) return { shapes: ["galaxy", "galaxy", "ring"], tilt: 0.55 };
  if (path.startsWith("/project")) return { shapes: ["knot", "lattice"] };
  if (path.startsWith("/ventures")) return { shapes: ["lattice", "knot", "ring"] };
  if (path.startsWith("/about")) return { shapes: ["helix", "helix", "sphere"], tilt: 0 };
  if (path.startsWith("/blog")) return { shapes: ["wave", "wave"], tilt: 0.35 };
  if (path.startsWith("/contact")) return { shapes: ["ring", "sphere"] };
  return { shapes: ["sphere", "knot"] };
}

function ScrollReset() {
  const pathname = usePathname();
  const lenis = useLenis();
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true, force: true });
  }, [pathname, lenis]);
  return null;
}

export function Experience({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const webgl = useWebGL();
  const timeline = useMemo(() => timelineFor(pathname), [pathname]);
  // the 3D background is decoration: fetch and start it once the page is painted and the browser is idle,
  // so it never competes with the text and portrait for bandwidth or the main thread
  const [sceneReady, setSceneReady] = useState(false);
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setSceneReady(true), { timeout: 2000 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = setTimeout(() => setSceneReady(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
    <ReactLenis root options={{ lerp: reduced ? 1 : 0.09, smoothWheel: !reduced }}>
      <ScrollReset />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,#14141a_0%,#060607_70%)]" />
        {webgl && sceneReady && <ParticleScene timeline={timeline} reduced={reduced} />}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
      </div>
      <Loader />
      <Cursor />
      <Nav />
      <div className="relative z-10">{children}</div>
    </ReactLenis>
    </MotionConfig>
  );
}
