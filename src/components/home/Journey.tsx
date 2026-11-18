"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import type { TimelineEntry } from "@/lib/data";
import { SplitReveal } from "@/components/ui/motion";

export function Journey({ timeline, label = "(04) — Journey" }: { timeline: TimelineEntry[]; label?: string }) {
  const ref = useRef<HTMLElement>(null);
  const [idx, setIdx] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.6", "end 0.6"] });
  const line = useSpring(scrollYProgress, { stiffness: 100, damping: 25 });

  return (
    <section ref={ref} id="journey" className="section-pad relative">
      <p className="eyebrow mb-3">{label}</p>
      <SplitReveal as="h2" text="How I got here" className="display-xl text-[13vw] sm:text-[8vw] md:text-[6.5vw]" />

      <div className="mt-14 grid gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        {/* sticky giant year */}
        <div className="hidden md:block">
          <div className="@container sticky top-[22vh] overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p
                key={timeline[idx]?.year}
                initial={{ y: "100%", rotate: 6 }}
                animate={{ y: "0%", rotate: 0 }}
                exit={{ y: "-100%", rotate: -6 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="display-xl text-[23cqw] leading-[0.85] text-accent"
              >
                {timeline[idx]?.year}
              </motion.p>
            </AnimatePresence>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-muted">
              Chapter {idx + 1} / {timeline.length}
            </p>
          </div>
        </div>

        <div className="relative pl-8 sm:pl-12">
          <div className="absolute bottom-0 left-0 top-0 w-[2px] bg-border">
            <motion.div className="w-full origin-top bg-accent" style={{ scaleY: line, height: "100%" }} />
          </div>
          {timeline.map((t, i) => (
            <motion.article
              key={t.year}
              initial={{ opacity: 0.15 }}
              whileInView={{ opacity: 1 }}
              viewport={{ margin: "-49% 0px -49% 0px" }}
              onViewportEnter={() => setIdx(i)}
              transition={{ duration: 0.5 }}
              className="relative pb-24 last:pb-4"
            >
              <span
                className="absolute -left-8 top-2 h-4 w-4 -translate-x-[7px] rounded-full border-2 border-accent bg-bg sm:-left-12"
                aria-hidden
              />
              <p className="display-xl mb-3 text-6xl text-accent md:hidden">{t.year}</p>
              <h3 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl">{t.title}</h3>
              {t.paragraphs.map((para, j) => (
                <p key={j} className="mt-4 max-w-xl text-lg leading-relaxed text-fg/75">
                  {para}
                </p>
              ))}
              <div className="mt-5 flex flex-wrap gap-2">
                {t.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-border bg-bg/60 px-3 py-1 font-mono text-[0.72rem] uppercase tracking-wider text-muted">
                    {tag}
                  </span>
                ))}
              </div>
              <span className="sr-only">Step {i + 1}</span>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
