"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { TimelineEntry } from "@/lib/data";
import { SectionHeading, Reveal } from "./Reveal";

export function About({ timeline }: { timeline: TimelineEntry[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="about" className="section-pad relative mx-auto max-w-7xl">
      <SectionHeading
        label="Who is Akshay"
        title={
          <>
            A journey from <span className="gradient-text">first commit</span> to
            research-grade AI
          </>
        }
        description="From web development intern to research-grade AI — five chapters of growth, delivery, and what comes next."
      />

      <div ref={ref} className="relative mx-auto max-w-3xl">
        {/* spine */}
        <div className="absolute left-[19px] top-2 h-full w-px bg-border md:left-1/2 md:-translate-x-1/2" />
        <motion.div
          style={{ scaleY: lineScale }}
          className="absolute left-[19px] top-2 h-full w-px origin-top bg-gradient-to-b from-accent via-accent-2 to-transparent md:left-1/2 md:-translate-x-1/2"
        />

        <ul className="space-y-12">
          {timeline.map((t, i) => (
            <li
              key={t.year}
              className={`relative pl-12 sm:pl-14 md:w-1/2 md:pl-0 ${
                i % 2 === 0
                  ? "md:pr-12 md:text-right"
                  : "md:ml-auto md:pl-12"
              }`}
            >
              <span
                className={`absolute top-1.5 left-[11px] z-10 h-4 w-4 rounded-full border-2 border-accent bg-bg ${
                  i % 2 === 0
                    ? "md:left-auto md:right-[-8px]"
                    : "md:left-[-8px] md:right-auto"
                }`}
              />
              <Reveal y={30}>
                <span className="font-mono text-sm tracking-widest text-accent-2">
                  {t.year}
                </span>
                <h3 className="mt-2 text-xl font-semibold sm:text-2xl">
                  {t.title}
                </h3>
                <div className="mt-2 space-y-2">
                  {t.paragraphs.map((p, j) => (
                    <p key={`${t.year}-${j}`} className="text-sm text-muted">
                      {p}
                    </p>
                  ))}
                </div>
                <div
                  className={`mt-3 flex flex-wrap gap-2 ${
                    i % 2 === 0 ? "md:justify-end" : ""
                  }`}
                >
                  {t.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[0.65rem] tracking-wide text-faint"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
