"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

export function CountUp({
  to,
  suffix = "",
  duration = 1.6,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px" });
  const reduce = useReducedMotion();
  // Start at `to` so SSR/pre-hydration always shows the real number
  const [value, setValue] = useState(to);
  const [animated, setAnimated] = useState(false);

  // On mount, reset to 0 so we can animate up from 0 on the client
  useEffect(() => {
    setValue(0);
  }, []);

  useEffect(() => {
    if (!inView || animated) return;
    setAnimated(true);

    if (reduce) {
      setValue(to);
      return;
    }

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration, reduce, animated]);

  return (
    <span ref={ref} suppressHydrationWarning>
      {value}
      {suffix}
    </span>
  );
}
