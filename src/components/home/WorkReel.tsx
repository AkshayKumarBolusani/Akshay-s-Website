"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ProjectArt } from "@/components/ui/ProjectArt";
import { SplitReveal } from "@/components/ui/motion";

export type ReelProject = {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  year: string;
  accent: string;
  tech: string[];
  metrics: { label: string; value: string }[];
  image?: string;
};

function Card({ p, i }: { p: ReelProject; i: number }) {
  return (
    <Link
      href={`/project/${p.slug}`}
      className="group relative flex h-full w-[86vw] shrink-0 flex-col overflow-hidden rounded-[1.75rem] border border-border bg-bg-soft sm:w-[62vw] lg:w-[46vw]"
      data-cursor="View case"
    >
      <ProjectArt title={p.title} accent={p.accent} image={p.image} index={i} className="h-[46%] w-full [@media(max-height:820px)]:h-[38%]" />
      <div className="flex min-h-0 flex-1 flex-col p-6 sm:p-8 [@media(max-height:820px)]:sm:p-5">
        <div className="flex items-center justify-between font-mono text-[0.72rem] uppercase tracking-[0.2em] text-muted">
          <span>
            <span style={{ color: p.accent }}>●</span> {p.category}
          </span>
          <span>{p.year}</span>
        </div>
        <h3 className="mt-4 font-display text-[clamp(1.6rem,min(3.6vw,6vh),4rem)] [@media(max-height:820px)]:!text-[clamp(1.3rem,3.9vh,2.2rem)] font-extrabold uppercase leading-[0.92] tracking-tight [overflow-wrap:anywhere]">
          {p.title}
        </h3>
        <p className="mt-3 line-clamp-2 max-w-md text-muted">{p.tagline}</p>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-4">
          <div className="flex gap-6">
            {p.metrics.slice(0, 2).map((m) => (
              <div key={m.label}>
                <p className="font-display text-2xl font-bold" style={{ color: p.accent }}>
                  {m.value}
                </p>
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-muted">{m.label}</p>
              </div>
            ))}
          </div>
          <span
            className="grid h-14 w-14 place-items-center [@media(max-height:820px)]:h-11 [@media(max-height:820px)]:w-11 rounded-full border border-border transition-all duration-500 group-hover:rotate-45 group-hover:border-transparent"
            style={{ backgroundColor: "transparent" }}
          >
            <ArrowUpRight className="h-6 w-6" />
          </span>
        </div>
      </div>
      <span className="pointer-events-none absolute left-5 top-4 font-display text-7xl font-extrabold text-fg/90 mix-blend-difference sm:text-8xl [@media(max-height:820px)]:!text-5xl">
        {String(i + 1).padStart(2, "0")}
      </span>
    </Link>
  );
}

export function WorkReel({ projects, total }: { projects: ReelProject[]; total: number }) {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  // translate so the last card lands at the right edge
  const [dist, setDist] = useState(0);
  useEffect(() => {
    const measure = () => {
      const el = track.current;
      if (el) setDist(Math.max(el.scrollWidth - window.innerWidth, 0));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  const x = useTransform(p, (v) => `${-v * dist}px`);
  const bar = useTransform(p, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={ref}
      id="projects"
      className="relative"
      style={{ height: `calc(100svh + ${dist}px)` }}
      aria-label="Selected work"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pt-20 sm:pt-24">
        <div className="gutter flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-3">(02) — Selected work</p>
            <SplitReveal
              as="h2"
              text="Things I've shipped"
              className="display-xl text-[min(13vw,8.5vh)] sm:text-[min(8vw,8.5vh)] md:text-[min(6.5vw,8.5vh)]"
            />
          </div>
          <p className="hidden max-w-[18rem] pb-2 text-sm text-muted md:block">
            Scroll sideways through {projects.length} favourites. {total} projects live in the full archive.
          </p>
        </div>

        <div className="mt-6 min-h-0 flex-1 pb-8 sm:mt-10 [@media(max-height:820px)]:mt-4 [@media(max-height:820px)]:pb-4">
          <motion.div ref={track} style={{ x }} className="gutter flex h-full gap-5 will-change-transform sm:gap-8">
            {projects.map((proj, i) => (
              <Card key={proj.slug} p={proj} i={i} />
            ))}
            <Link
              href="/work"
              className="group relative flex h-full w-[70vw] shrink-0 flex-col items-center justify-center overflow-hidden rounded-[1.75rem] bg-accent text-ink sm:w-[36vw]"
              data-cursor="Archive"
            >
              <span className="display-xl text-center text-[16vw] leading-[0.85] transition-transform duration-700 group-hover:scale-105 sm:text-[7vw]">
                All
                <br />
                {total}
                <br />
                Projects
              </span>
              <ArrowUpRight className="mt-6 h-12 w-12 transition-transform duration-500 group-hover:rotate-45" />
            </Link>
          </motion.div>
        </div>

        <div className="gutter pb-6">
          <div className="h-[2px] w-full bg-border">
            <motion.div className="h-full bg-accent" style={{ width: bar }} />
          </div>
        </div>
      </div>
    </section>
  );
}
