"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// decided once per page load (survives React strict-mode double effects)
let introDecision: boolean | null = null;

const WORDS = ["Engineer", "Founder", "Builder", "Researcher", "Akshay"];

/** Intro: counter 000→100 + cycling words, then a split-curtain reveal. Once per session. */
export function Loader() {
  const [show, setShow] = useState(false);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (introDecision === null) {
      let seen = false;
      try {
        seen = sessionStorage.getItem("ak-intro") === "1";
        sessionStorage.setItem("ak-intro", "1");
      } catch {}
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      introDecision = !(seen || reduced);
    }
    if (!introDecision) return;
    // sessionStorage is only readable after hydration, so the intro has to be switched on here
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShow(true);
    document.documentElement.style.overflow = "hidden";
    const start = performance.now();
    const dur = 2100;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else
        setTimeout(() => {
          introDecision = false;
          setShow(false);
          document.documentElement.style.overflow = "";
        }, 280);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = "";
    };
  }, []);

  const word = WORDS[Math.min(Math.floor(n / 21), WORDS.length - 1)];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[150] flex flex-col"
          exit={{ pointerEvents: "none" }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="relative flex-1 bg-accent"
            exit={{ y: "-100%" }}
            transition={{ duration: 0.9, ease: [0.85, 0, 0.15, 1] }}
          >
            <div className="gutter absolute inset-x-0 top-6 flex justify-between font-mono text-[0.7rem] uppercase tracking-[0.25em] text-ink">
              <span>Akshay Kumar Bolusani</span>
              <span>Portfolio — 2026</span>
            </div>
            <div className="gutter absolute bottom-0 left-0 overflow-hidden">
              <AnimatePresence mode="popLayout">
                <motion.p
                  key={word}
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="display-xl pb-2 text-[18vw] text-ink sm:text-[12vw]"
                >
                  {word}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>
          <motion.div
            className="relative flex h-[22vh] items-center justify-between bg-ink"
            exit={{ y: "100%" }}
            transition={{ duration: 0.9, ease: [0.85, 0, 0.15, 1] }}
          >
            <div className="gutter flex w-full items-end justify-between">
              <div className="h-[2px] flex-1 bg-border">
                <div className="h-full bg-accent" style={{ width: `${n}%` }} />
              </div>
              <span className="display-xl ml-6 w-[3.6ch] text-right text-[13vw] tabular-nums text-fg sm:text-[8vw]">
                {String(n).padStart(3, "0")}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
