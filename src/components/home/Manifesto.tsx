"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { VelocityMarquee } from "@/components/ui/motion";

const TEXT =
  "I'm Akshay — an engineer who builds AI that shows its work. Answers that cite the page they came from. Invoices checked before they're filed. Models that run on your own machine. I've shipped 60+ projects and 100+ websites for real clients, I lead a team of 23, and I still get excited every time something goes live.";

const HIGHLIGHT = new Set(["shows", "its", "work.", "60+", "23,", "100+", "live."]);

function Word({ w, range, progress }: { w: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [8, 0]);
  return (
    <motion.span style={{ opacity, y }} className={`mr-[0.25em] inline-block ${HIGHLIGHT.has(w) ? "text-accent" : ""}`}>
      {w}
    </motion.span>
  );
}

const STACK = [
  "Python", "PyTorch", "RAG", "FastAPI", "React", "Qdrant", "Ollama", "Docling", "DINOv2",
  "Node.js", "PostgreSQL", "Docker", "AWS", "Wazuh", "Power BI",
];

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = TEXT.split(" ");

  return (
    <section id="about" className="relative">
      <div className="-rotate-2 border-y border-ink bg-accent py-3 text-ink">
        <VelocityMarquee baseVelocity={-2.5}>
          {STACK.map((s) => (
            <span key={s} className="flex items-center gap-6 pr-6 font-display text-2xl font-bold uppercase sm:text-4xl">
              {s} <span className="text-lg">✺</span>
            </span>
          ))}
        </VelocityMarquee>
      </div>
      <div className="rotate-1 border-y border-border bg-bg py-3">
        <VelocityMarquee baseVelocity={2}>
          {["Local-first AI", "Citations by default", "Review-first", "Shipped, not slides", "Healthcare AI", "Founder mode"].map((s) => (
            <span key={s} className="flex items-center gap-6 pr-6 font-mono text-sm uppercase tracking-[0.2em] text-muted sm:text-base">
              {s} <span className="text-accent">/</span>
            </span>
          ))}
        </VelocityMarquee>
      </div>

      <div ref={ref} className="section-pad mx-auto max-w-6xl">
        <p className="eyebrow mb-8">(01) — Manifesto</p>
        <p className="about-summary font-display text-[1.9rem] font-bold leading-[1.12] tracking-tight sm:text-5xl md:text-6xl">
          {words.map((w, i) => {
            const start = i / words.length;
            return <Word key={i} w={w} range={[start, start + 1 / words.length]} progress={scrollYProgress} />;
          })}
        </p>
      </div>
    </section>
  );
}
