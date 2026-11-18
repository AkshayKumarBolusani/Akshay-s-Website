"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion";
import { SplitLetters } from "@/components/ui/motion";

const PHRASES = [
  "cites its sources.",
  "runs on your machine.",
  "checks before it files.",
  "ships to real users.",
  "explains itself.",
];

function RotatingPhrase() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % PHRASES.length), 2300);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="relative inline-flex h-[1.25em] overflow-hidden align-bottom text-accent">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={PHRASES[i]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block whitespace-nowrap"
        >
          {PHRASES[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function SpinBadge() {
  const text = "AVAILABLE FOR WORK • AI • FULL STACK • 2026 • ";
  return (
    <div className="relative h-24 w-24 sm:h-28 sm:w-28">
      <svg viewBox="0 0 100 100" className="animate-spin-slow h-full w-full">
        <defs>
          <path id="circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text className="fill-fg font-mono text-[8.4px] uppercase tracking-[0.18em]">
          <textPath href="#circle">{text}</textPath>
        </text>
      </svg>
      <span className="pulse-dot absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
    </div>
  );
}

export function Hero({ imageSrc }: { imageSrc: string }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const nameSpread = useTransform(p, [0, 1], ["-0.045em", "0.12em"]);
  const nameY = useTransform(p, [0, 1], ["0%", "-35%"]);
  const imgY = useTransform(p, [0, 1], ["0%", "18%"]);
  const imgScale = useTransform(p, [0, 1], [1, 0.86]);
  const fade = useTransform(p, [0, 0.6], [1, 0]);
  const outlineX = useTransform(p, [0, 1], ["0%", "-22%"]);

  const mx = useSpring(0, { stiffness: 60, damping: 20 });
  const my = useSpring(0, { stiffness: 60, damping: 20 });
  useEffect(() => {
    const on = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 2);
      my.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", on, { passive: true });
    return () => window.removeEventListener("pointermove", on);
  }, [mx, my]);
  const portraitX = useTransform(mx, (v) => v * -14);
  const backX = useTransform(mx, (v) => v * 22);
  const backY = useTransform(my, (v) => v * 10);

  return (
    <section
      ref={ref}
      id="home"
      className="relative flex h-[100svh] min-h-[min(640px,100svh)] flex-col overflow-hidden"
      aria-label="Introduction"
    >
      {/* giant name — behind the portrait */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-[11.75rem] flex justify-center min-[400px]:top-[9.5rem] sm:top-[11%]"
        style={{ y: nameY }}
      >
        <motion.div style={{ x: backX, y: backY }}>
        <motion.h1
          className="display-xl select-none text-[14.2vw] leading-none text-fg sm:text-[14.5vw] [@media(max-height:520px)]:!text-[22vh]"
          style={{ letterSpacing: nameSpread }}
        >
          <span className="sr-only">Akshay Kumar Bolusani — AI &amp; Full-Stack Software Engineer</span>
          <span aria-hidden>
            <SplitLetters text="AKSHAY" delay={0.15} stagger={0.06} />
          </span>
        </motion.h1>
        </motion.div>
      </motion.div>

      {/* portrait */}
      {imageSrc && (
        <motion.div
          className="absolute inset-x-0 bottom-0 flex justify-center"
          style={{ y: imgY, scale: imgScale, x: portraitX }}
        >
          <motion.div
            initial={{ opacity: 0, y: 120, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.4, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
          <div className="relative h-[64svh] w-[min(100vw,30rem)] sm:h-[72svh] sm:w-[min(66vw,36rem)] lg:h-[80svh] lg:w-[min(46vw,30rem)] [@media(max-height:520px)]:!h-[80svh]">
            <div className="absolute inset-x-[12%] bottom-[10%] top-[14%] rounded-full bg-accent/30 blur-[90px]" />
            <Image
              src={imageSrc}
              alt="Portrait of Akshay Kumar Bolusani"
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 46vw"
              className="object-contain object-bottom drop-shadow-[0_30px_60px_rgba(0,0,0,0.65)]"
            />
          </div>
          </motion.div>
        </motion.div>
      )}

      {/* outline surname — in front of the portrait */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[17%] whitespace-nowrap sm:bottom-[5%]"
        style={{ x: outlineX }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1 }}
      >
        <span className="display-xl block text-center text-[10.6vw] text-outline-accent opacity-90 sm:text-[10.5vw] [@media(max-height:520px)]:!text-[15vh]">
          BOLUSANI
        </span>
      </motion.div>

      {/* top-left intro copy */}
      <motion.div className="gutter relative z-10 mt-[5.25rem] max-w-md sm:absolute sm:bottom-[24%] sm:left-0 sm:mt-0 sm:max-w-[17rem] lg:max-w-xs" style={{ opacity: fade }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.1 }}
      >
        <p className="eyebrow mb-3">AI &amp; Full-Stack Software Engineer</p>
        <p className="hero-description text-lg leading-snug text-fg/90 sm:text-xl lg:text-2xl">
          I build AI that <RotatingPhrase />
        </p>
      </motion.div>
      </motion.div>

      {/* bottom bar */}
      <motion.div className="relative z-10 mt-auto" style={{ opacity: fade }}>
      <motion.div
        className="gutter flex items-end justify-between pb-6 sm:pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.3 }}
      >
        <div className="max-w-[46%] space-y-1 font-mono text-[0.72rem] uppercase leading-relaxed tracking-[0.16em] text-muted sm:max-w-none">
          <p>
            Founder — <Link href="/ventures" className="-my-3.5 inline-block py-3.5 text-fg hover:text-accent">ProjectKaro</Link> ·{" "}
            <Link href="/ventures#gopyata" className="-my-3.5 inline-block py-3.5 text-fg hover:text-accent">Gopyata</Link>
          </p>
          <p className="hidden sm:block">17.38°N 78.48°E · Hyderabad</p>
        </div>
        <SpinBadge />
      </motion.div>
      </motion.div>
    </section>
  );
}
