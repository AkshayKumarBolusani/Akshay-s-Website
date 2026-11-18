"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "./useMedia";

/**
 * Two-part cursor: a precise dot + a lagging ring that inverts what's under it.
 * Any element with data-cursor="Label" grows the ring and shows the label.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);
  const fine = useMediaQuery("(pointer: fine)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const enabled = fine && !reduced;

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const lag = { ...pos };
    let raf = 0;

    const move = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor], a, button, [role=button], input, textarea, select, label");
      setHover(!!t);
      setLabel(t?.dataset.cursor ?? null);
    };
    const loop = () => {
      lag.x += (pos.x - lag.x) * 0.16;
      lag.y += (pos.y - lag.y) * 0.16;
      if (ring.current) ring.current.style.transform = `translate3d(${lag.x}px, ${lag.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const d = () => setDown(true);
    const u = () => setDown(false);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", d);
    window.addEventListener("pointerup", u);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", d);
      window.removeEventListener("pointerup", u);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  const size = label ? 96 : hover ? 56 : 30;
  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[200] mix-blend-difference"
      >
        <div
          className="grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white transition-[width,height,background-color] duration-300 ease-[var(--ease-out-expo)]"
          style={{
            width: size * (down ? 0.85 : 1),
            height: size * (down ? 0.85 : 1),
            backgroundColor: label || hover ? "#fff" : "transparent",
          }}
        >
          {label && (
            <span className="whitespace-nowrap font-mono text-[0.72rem] font-semibold uppercase tracking-widest text-black">
              {label}
            </span>
          )}
        </div>
      </div>
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[201] mix-blend-difference"
      >
        <div className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
      </div>
    </>
  );
}
