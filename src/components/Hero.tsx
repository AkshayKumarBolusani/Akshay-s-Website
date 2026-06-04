"use client";

import { useRef, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowRight,
  Code2,
  Cpu,
  Sparkles,
  Terminal,
  Zap,
  Globe,
  Layers,
} from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const ParticleField = dynamic(() => import("./ParticleField"), { ssr: false });

export function Hero({
  hasImage,
  imageSrc,
  projectCount = 50,
}: {
  hasImage: boolean;
  imageSrc: string;
  projectCount?: number;
}) {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  const opacity = useTransform(smoothProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(smoothProgress, [0, 0.5], [1, 0.98]);
  const imgY = useTransform(smoothProgress, [0, 1], ["0%", "15%"]);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-[100dvh] overflow-hidden"
    >
      {/* Ambient Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
        {mounted && !reduce && <ParticleField />}
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 dot-grid opacity-20" />

      {/* Gradient Orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -left-[15%] top-[15%] h-[50vh] w-[50vh] rounded-full bg-accent/20 blur-[120px]"
          animate={reduce ? {} : { scale: [1, 1.1, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-[5%] top-[30%] h-[45vh] w-[45vh] rounded-full bg-accent-2/15 blur-[100px]"
          animate={reduce ? {} : { scale: [1.1, 1, 1.1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[10%] left-[30%] h-[35vh] w-[35vh] rounded-full bg-accent-3/10 blur-[80px]"
          animate={reduce ? {} : { scale: [1, 1.2, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        className="relative mx-auto grid min-h-[100dvh] max-w-7xl grid-cols-1 items-center gap-6 px-4 pb-20 pt-24 sm:px-6 sm:pt-28 lg:grid-cols-[1fr_1.1fr] lg:gap-8 lg:pb-0 lg:pt-20"
        style={{ opacity: reduce ? 1 : opacity, scale: reduce ? 1 : scale }}
      >
        {/* Left Content */}
        <div className="relative z-10 order-2 lg:order-1">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2.5 sm:mb-5"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="font-mono text-[0.6rem] tracking-wider text-green-400 sm:text-xs">
              AVAILABLE FOR OPPORTUNITIES
            </span>
          </motion.div>

          {/* Main Headline */}
          <div className="mb-4 space-y-0.5 sm:mb-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
                  100+
                </span>{" "}
                <span className="text-fg">Websites</span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-accent-2 to-accent bg-clip-text text-transparent">
                  {projectCount}+
                </span>{" "}
                <span className="text-fg">Projects</span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h1 className="text-3xl font-bold leading-[1.05] tracking-tight text-muted sm:text-4xl lg:text-5xl">
                One Builder.
              </h1>
            </motion.div>
          </div>

          {/* Role Tags */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-4 flex flex-wrap gap-2 sm:mb-5"
          >
            {["Software Engineer", "Full Stack Developer", "AI & ML Engineer"].map(
              (role, i) => (
                <span
                  key={role}
                  className={cn(
                    "rounded-full border px-3 py-1 text-[0.65rem] font-medium sm:px-3.5 sm:text-xs",
                    i === 0
                      ? "border-accent/30 bg-accent/10 text-accent"
                      : i === 1
                        ? "border-accent-2/30 bg-accent-2/10 text-accent-2"
                        : "border-accent-3/30 bg-accent-3/10 text-accent-3",
                  )}
                >
                  {role}
                </span>
              ),
            )}
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mb-5 max-w-md text-sm leading-relaxed text-muted sm:mb-6 sm:text-base"
          >
            From client websites to{" "}
            <span className="text-fg">quantum drug discovery</span>, computer
            vision,{" "}
            <span className="text-fg">enterprise AI agents</span>, and startup
            products.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-wrap gap-3"
          >
            <button
              type="button"
              onClick={() =>
                document
                  .querySelector("#projects")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-5 py-2.5 text-sm font-semibold text-bg transition-all hover:shadow-lg hover:shadow-accent/25 sm:px-6 sm:py-3"
            >
              Explore the Vault
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>

            <Link
              href="#projectkaro"
              className="flex items-center gap-2.5 rounded-full border border-border bg-white/[0.03] px-5 py-2.5 text-sm font-medium transition-colors hover:border-accent/40 hover:bg-white/[0.06] sm:px-6 sm:py-3"
            >
              <Terminal className="h-4 w-4 text-accent" />
              Work With Me
            </Link>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-6 flex items-center gap-6 border-t border-border/40 pt-5 sm:mt-8 sm:gap-8 sm:pt-6"
          >
            <div>
              <div className="text-lg font-bold text-fg sm:text-xl">3+</div>
              <div className="text-[0.6rem] text-muted sm:text-xs">Years Experience</div>
            </div>
            <div className="h-5 w-px bg-border/50 sm:h-6" />
            <div className="flex items-center gap-1.5 text-[0.65rem] text-muted sm:text-sm">
              <Sparkles className="h-3 w-3 text-accent sm:h-3.5 sm:w-3.5" />
              AI × Full Stack × Research
            </div>
          </motion.div>
        </div>

        {/* Right - Profile Image with Floating Elements */}
        <motion.div
          className="relative order-1 flex items-center justify-center lg:order-2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          style={{ y: reduce ? 0 : imgY }}
        >
          {/* Floating Graphics Container */}
          <div className="relative h-[340px] w-[260px] sm:h-[420px] sm:w-[320px] lg:h-[520px] lg:w-[400px]">
            
            {/* Floating Icon - Top Left */}
            <motion.div
              className="absolute -left-2 top-8 z-20 flex h-10 w-10 items-center justify-center rounded-xl border border-accent/30 bg-bg/80 backdrop-blur-md sm:-left-4 sm:top-12 sm:h-12 sm:w-12 lg:h-14 lg:w-14"
              animate={reduce ? {} : { y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Code2 className="h-4 w-4 text-accent sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
            </motion.div>

            {/* Floating Icon - Top Right */}
            <motion.div
              className="absolute -right-2 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-xl border border-accent-2/30 bg-bg/80 backdrop-blur-md sm:-right-4 sm:top-8 sm:h-12 sm:w-12 lg:h-14 lg:w-14"
              animate={reduce ? {} : { y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <Cpu className="h-4 w-4 text-accent-2 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
            </motion.div>

            {/* Floating Icon - Middle Right */}
            <motion.div
              className="absolute -right-4 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-accent-3/30 bg-bg/80 backdrop-blur-md sm:-right-6 sm:h-11 sm:w-11 lg:h-12 lg:w-12"
              animate={reduce ? {} : { x: [0, 6, 0], y: [0, -4, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <Zap className="h-4 w-4 text-accent-3 sm:h-5 sm:w-5" />
            </motion.div>

            {/* Floating Icon - Bottom Left */}
            <motion.div
              className="absolute -left-3 bottom-20 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-accent/30 bg-bg/80 backdrop-blur-md sm:-left-5 sm:bottom-24 sm:h-11 sm:w-11 lg:h-12 lg:w-12"
              animate={reduce ? {} : { y: [0, 8, 0], x: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            >
              <Globe className="h-4 w-4 text-accent sm:h-5 sm:w-5" />
            </motion.div>

            {/* Floating Icon - Bottom Right */}
            <motion.div
              className="absolute -right-2 bottom-16 z-20 flex h-10 w-10 items-center justify-center rounded-xl border border-accent-2/30 bg-bg/80 backdrop-blur-md sm:-right-4 sm:bottom-20 sm:h-12 sm:w-12 lg:h-14 lg:w-14"
              animate={reduce ? {} : { y: [0, -6, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            >
              <Layers className="h-4 w-4 text-accent-2 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
            </motion.div>

            {/* Decorative Ring */}
            <motion.div
              className="absolute inset-4 rounded-3xl border border-dashed border-accent/20 sm:inset-6"
              animate={reduce ? {} : { rotate: [0, 360] }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            />

            {/* Glow Effect */}
            <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-accent/25 via-accent-2/20 to-accent-3/15 blur-3xl" />

            {/* Main Image Container */}
            <div className="relative z-10 mx-auto h-[300px] w-[220px] sm:h-[380px] sm:w-[280px] lg:h-[480px] lg:w-[360px]">
              <div className="relative h-full w-full overflow-hidden rounded-3xl border-2 border-white/10 bg-bg-soft shadow-2xl shadow-accent/10">
                {hasImage && (
                  <Image
                    src={imageSrc}
                    alt={site.name}
                    fill
                    priority
                    className="object-cover"
                    style={{ objectPosition: "center 5%" }}
                  />
                )}
                
                {!hasImage && (
                  <div className="flex h-full items-center justify-center bg-bg-soft">
                    <p className="rounded-lg border border-border px-3 py-2 font-mono text-[0.65rem] text-muted">
                      Add <code className="text-accent">public/akshay.webp</code>
                    </p>
                  </div>
                )}
                
                {/* Bottom Gradient */}
                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-bg via-bg/70 to-transparent" />
                
                {/* Name Badge */}
                <motion.div 
                  className="absolute inset-x-3 bottom-3 rounded-2xl border border-white/15 bg-bg/85 p-3 backdrop-blur-xl sm:inset-x-4 sm:bottom-4 sm:p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-2 text-xs font-bold text-bg shadow-lg shadow-accent/30 sm:h-10 sm:w-10 sm:text-sm">
                      AK
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-fg sm:text-base">{site.name}</p>
                      <p className="text-[0.65rem] text-muted sm:text-xs">{site.location}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Corner Accents */}
                <div className="absolute left-3 top-3 h-8 w-8 rounded-lg border border-accent/30 bg-accent/10 sm:left-4 sm:top-4 sm:h-10 sm:w-10" />
                <div className="absolute right-3 top-3 h-6 w-6 rounded-full border border-accent-2/30 bg-accent-2/10 sm:right-4 sm:top-4 sm:h-8 sm:w-8" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
      >
        <span className="font-mono text-[0.6rem] tracking-widest text-faint">
          SCROLL
        </span>
        <motion.div
          className="h-8 w-px bg-gradient-to-b from-accent/50 to-transparent"
          animate={reduce ? {} : { scaleY: [0.5, 1, 0.5], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
