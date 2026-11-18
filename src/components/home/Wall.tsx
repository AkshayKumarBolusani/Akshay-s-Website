"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { Certification } from "@/lib/data";
import { FadeUp, SplitReveal } from "@/components/ui/motion";

type Highlight = { title: string; detail: string; year: string; kind: string };

// pseudo-random but stable scatter
function scatter(i: number) {
  const r = (n: number) => ((Math.sin(i * 91.7 + n * 13.1) * 43758.5453) % 1 + 1) % 1;
  const q = (v: number) => Math.round(v * 10) / 10;
  return { x: q(r(1) * 76), y: q(r(2) * 62), rot: q((r(3) - 0.5) * 26) };
}

export function Wall({
  certs,
  highlights,
  label = "(06) — Proof",
}: {
  certs: Certification[];
  highlights: Highlight[];
  label?: string;
}) {
  const board = useRef<HTMLDivElement>(null);
  const [z, setZ] = useState<number[]>(() => certs.map((_, i) => i));
  const [open, setOpen] = useState<Certification | null>(null);
  const top = useRef(certs.length);

  const bring = (i: number) =>
    setZ((prev) => {
      const next = [...prev];
      next[i] = ++top.current;
      return next;
    });

  return (
    <section className="section-pad relative" aria-label="Recognition and certifications">
      <p className="eyebrow mb-3">{label}</p>
      <SplitReveal as="h2" text="Receipts on the wall" className="display-xl text-[12vw] sm:text-[7vw] md:text-[6vw]" />
      <p className="mt-4 max-w-md text-muted">
        Drag them around. Click one to look closer. Hackathons, programs and certifications from 2022 onwards.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {highlights.map((h, i) => (
          <FadeUp key={h.title} delay={i * 0.08}>
            <div className="h-full rounded-2xl border border-border bg-bg/70 p-6 backdrop-blur-sm">
              <div className="flex justify-between font-mono text-[0.72rem] uppercase tracking-[0.2em] text-muted">
                <span className="text-accent">{h.kind}</span>
                <span>{h.year}</span>
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold leading-tight">{h.title}</h3>
              <p className="mt-2 text-sm text-fg/70">{h.detail}</p>
            </div>
          </FadeUp>
        ))}
      </div>

      {/* draggable desk (desktop) */}
      <div
        ref={board}
        className="dot-grid relative mt-10 hidden h-[44rem] overflow-hidden rounded-[1.75rem] border border-border bg-bg-soft/70 md:block"
      >
        <p className="display-xl pointer-events-none absolute inset-0 grid place-items-center text-[12vw] text-fg/[0.04]">
          DRAG ME
        </p>
        {certs.map((c, i) => {
          const s = scatter(i);
          return (
            <motion.button
              key={c.id ?? c.title}
              drag
              dragConstraints={board}
              dragElastic={0.15}
              dragMomentum
              onPointerDown={() => bring(i)}
              onTap={() => setOpen(c)}
              initial={{ opacity: 0, scale: 0.6, rotate: s.rot * 2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: s.rot }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 120, damping: 14, delay: i * 0.05 }}
              whileHover={{ scale: 1.04 }}
              whileDrag={{ scale: 1.08, rotate: 0, cursor: "grabbing" }}
              className="absolute w-56 rounded-md bg-[#f3f1ea] p-2.5 pb-3 text-left text-ink shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]"
              style={{ left: `${s.x}%`, top: `${s.y}%`, zIndex: z[i] }}
              data-cursor="Drag"
              aria-label={`${c.title} — ${c.issuer}, ${c.year}. Open`}
            >
              <div className="relative h-36 w-full overflow-hidden bg-neutral-300">
                {c.image && (
                  <Image src={c.image} alt="" fill sizes="224px" className="pointer-events-none object-cover" draggable={false} />
                )}
              </div>
              <p className="mt-2 line-clamp-1 text-sm font-semibold">{c.title}</p>
              <p className="font-mono text-[0.72rem] uppercase tracking-wider text-neutral-600">
                {c.issuer} · {c.year}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* swipe row (mobile) */}
      <div className="scroll-x-touch -mx-[var(--gutter)] mt-8 flex snap-x snap-mandatory gap-4 px-[var(--gutter)] md:hidden">
        {certs.map((c, i) => (
          <button
            key={c.id ?? c.title}
            onClick={() => setOpen(c)}
            className="w-64 shrink-0 snap-center rounded-md bg-[#f3f1ea] p-2.5 text-left text-ink"
            style={{ rotate: `${(i % 2 ? 1 : -1) * 2}deg` }}
          >
            <div className="relative h-40 w-full overflow-hidden bg-neutral-300">
              {c.image && <Image src={c.image} alt="" fill sizes="256px" className="object-cover" />}
            </div>
            <p className="mt-2 line-clamp-1 text-sm font-semibold">{c.title}</p>
            <p className="font-mono text-[0.72rem] uppercase tracking-wider text-neutral-600">
              {c.issuer} · {c.year}
            </p>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[130] grid place-items-center bg-bg/85 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={open.title}
            data-lenis-prevent
          >
            <motion.div
              initial={{ scale: 0.85, rotate: -4, y: 40 }}
              animate={{ scale: 1, rotate: 0, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 160, damping: 18 }}
              className="relative w-full max-w-3xl rounded-xl bg-[#f3f1ea] p-3 text-ink"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpen(null)}
                className="absolute -right-3 -top-3 grid h-11 w-11 place-items-center rounded-full bg-accent text-ink"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-200">
                {open.image && <Image src={open.image} alt={open.title} fill sizes="768px" className="object-contain" />}
              </div>
              <div className="p-3">
                <p className="font-mono text-[0.72rem] uppercase tracking-widest text-neutral-600">
                  {open.type ?? "Certificate"} · {open.issuer} · {open.year}
                </p>
                <p className="mt-1 font-display text-2xl font-bold">{open.title}</p>
                {open.description && <p className="mt-1 text-sm text-neutral-700">{open.description}</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
