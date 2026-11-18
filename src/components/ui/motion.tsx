"use client";

import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const EXPO = [0.16, 1, 0.3, 1] as const;

/**
 * Shrinks an element's font-size until its longest unbreakable word fits the available width.
 * Display type uses huge vw-based sizes (and a very wide typeface), so without this long words
 * such as "Discovery" or "Writing" get clipped on phones.
 */
export function useFit(ref: React.RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      el.style.fontSize = "";
      const avail = el.clientWidth;
      const need = el.scrollWidth;
      if (avail > 0 && need > avail + 1) {
        const fs = parseFloat(getComputedStyle(el).fontSize);
        el.style.fontSize = `${Math.floor(fs * (avail / need) * 0.97 * 100) / 100}px`;
      }
    };
    fit();
    // the display font loads after first paint and is wider than the fallback: refit when it arrives
    const fonts = document.fonts;
    fonts?.ready.then(fit);
    fonts?.addEventListener?.("loadingdone", fit);
    const late = [250, 900].map((ms) => setTimeout(fit, ms));
    const ro = new ResizeObserver(fit);
    ro.observe(el.parentElement ?? el);
    return () => {
      ro.disconnect();
      fonts?.removeEventListener?.("loadingdone", fit);
      late.forEach(clearTimeout);
    };
  }, [ref]);
}

/** A heading/paragraph whose font-size auto-shrinks to fit its container (see useFit). */
export function FitText({
  as = "span",
  className,
  children,
  ...rest
}: {
  as?: "span" | "h1" | "h2" | "h3" | "p";
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  useFit(ref);
  const Tag = as as unknown as React.ComponentType<React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }>;
  return (
    <Tag ref={ref} className={cn("block", className)} {...rest}>
      {children}
    </Tag>
  );
}

/** Words slide up from a mask when scrolled into view. */
export function SplitReveal({
  text,
  className,
  delay = 0,
  as: Tag = "span",
  stagger = 0.04,
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  useFit(ref);
  const words = text.split(" ");
  return (
    <Tag ref={ref as never} className={cn("block", className)} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", rotate: 4 }}
            animate={inView ? { y: "0%", rotate: 0 } : undefined}
            transition={{ duration: 0.9, delay: delay + i * stagger, ease: EXPO }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Letter-by-letter rise, used for giant display words. */
export function SplitLetters({
  text,
  className,
  delay = 0,
  stagger = 0.05,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  return (
    <span className={cn("inline-flex overflow-hidden", className)} aria-label={text}>
      {text.split("").map((c, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block"
          initial={{ y: "105%" }}
          animate={{ y: "0%" }}
          transition={{ duration: 1.1, delay: delay + i * stagger, ease: EXPO }}
        >
          {c === " " ? " " : c}
        </motion.span>
      ))}
    </span>
  );
}

export function FadeUp({
  children,
  className,
  delay = 0,
  y = 40,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.9, delay, ease: EXPO }}
    >
      {children}
    </motion.div>
  );
}

/** Pulls toward the pointer while hovered. */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 180, damping: 14, mass: 0.2 });
  const y = useSpring(0, { stiffness: 180, damping: 14, mass: 0.2 });
  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

function wrap(min: number, max: number, v: number) {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
}

/** Infinite marquee whose speed + direction react to scroll velocity. */
export function VelocityMarquee({
  children,
  baseVelocity = -2,
  className,
}: {
  children: React.ReactNode;
  baseVelocity?: number;
  className?: string;
}) {
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const vel = useVelocity(scrollY);
  const smooth = useSpring(vel, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 5], { clamp: false });
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);
  const dir = useRef(1);
  useAnimationFrame((_, delta) => {
    let move = dir.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += dir.current * move * f;
    base.set(base.get() + move);
  });
  return (
    <div className={cn("flex overflow-hidden whitespace-nowrap", className)}>
      <motion.div className="flex shrink-0 flex-nowrap" style={{ x }}>
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

/** Odometer-ish count-up when in view. */
export function Counter({
  to,
  decimals = 0,
  suffix = "",
  className,
  duration = 1.8,
}: {
  to: number;
  decimals?: number;
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [v, setV] = useState(0);
  useFit(ref);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      setV(to * (1 - Math.pow(1 - p, 4)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return (
    <span ref={ref} className={cn("relative inline-block max-w-full whitespace-nowrap tabular-nums", className)} aria-label={`${to.toFixed(decimals)}${suffix}`}>
      {/* invisible copy of the final number holds the width, so the font fit uses the widest state */}
      <span aria-hidden className="invisible">
        {to.toFixed(decimals)}
        {suffix}
      </span>
      <span aria-hidden className="absolute left-0 top-0">
        {v.toFixed(decimals)}
        {suffix}
      </span>
    </span>
  );
}

const GLYPHS = "!<>-_\\/[]{}—=+*^?#ABCDEFX01";

/** Hacker-style text scramble that resolves into the real text (on view + on hover). */
export function Scramble({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [out, setOut] = useState(text);
  const run = useRef<() => void>(() => {});

  useEffect(() => {
    let raf = 0;
    run.current = () => {
      cancelAnimationFrame(raf);
      let frame = 0;
      const total = 24;
      const step = () => {
        frame++;
        setOut(
          text
            .split("")
            .map((c, i) =>
              c === " " || frame / total > i / text.length
                ? c
                : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
            )
            .join(""),
        );
        if (frame < total) raf = requestAnimationFrame(step);
        else setOut(text);
      };
      raf = requestAnimationFrame(step);
    };
    return () => cancelAnimationFrame(raf);
  }, [text]);

  useEffect(() => {
    if (inView) run.current();
  }, [inView]);

  return (
    <span ref={ref} className={className} onPointerEnter={() => run.current()} aria-label={text}>
      <span aria-hidden>{out}</span>
    </span>
  );
}

/** 3D tilt + glare following the pointer. */
export function Tilt({
  children,
  className,
  max = 10,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(0, { stiffness: 150, damping: 15 });
  const ry = useSpring(0, { stiffness: 150, damping: 15 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glare = useTransform(
    [gx, gy] as MotionValue<number>[],
    ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.18), transparent 55%)`,
  );
  return (
    <motion.div
      ref={ref}
      className={cn("relative [transform-style:preserve-3d]", className)}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * max * 2);
        rx.set(-(py - 0.5) * max * 2);
        gx.set(px * 100);
        gy.set(py * 100);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      {children}
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ background: glare }} />
    </motion.div>
  );
}
