"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FitText, Scramble, SplitReveal } from "@/components/ui/motion";
import type { ProjectKaroData, Venture } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Ventures({ pk, gopyata }: { pk: ProjectKaroData; gopyata?: Venture }) {
  const [active, setActive] = useState<0 | 1>(0);

  return (
    <section id="projectkaro" className="section-pad relative">
      <p className="eyebrow mb-3">(03) — Ventures</p>
      <SplitReveal as="h2" text="Things I started" className="display-xl text-[13vw] sm:text-[8vw] md:text-[6.5vw]" />

      <div className="mt-10 flex h-auto flex-col gap-4 md:h-[78vh] md:flex-row">
        {/* ProjectKaro */}
        <motion.div
          layout
          onPointerEnter={() => setActive(0)}
          className={cn(
            "group relative overflow-hidden rounded-[1.75rem] bg-accent text-ink transition-[flex-grow] duration-700 ease-[var(--ease-out-expo)]",
            active === 0 ? "md:flex-[2.2]" : "md:flex-1",
          )}
        >
          <Link href="/ventures" className="flex h-full min-h-[34rem] flex-col p-6 sm:p-10" data-cursor="Explore">
            <div className="flex items-center justify-between font-mono text-[0.72rem] uppercase tracking-[0.2em]">
              <span>Software studio · since {pk.since ?? "2024"}</span>
              <span className="rounded-full border border-ink/30 px-3 py-1">Live</span>
            </div>
            <FitText as="h3" className="display-xl mt-6 text-[17vw] leading-[0.8] sm:text-[11vw] md:text-[6.4vw]">
              Project
              <br />
              Karo
            </FitText>
            <p className="mt-6 max-w-lg text-base font-medium leading-snug sm:text-lg">{pk.description}</p>
            <div className="mt-auto grid grid-cols-2 gap-x-6 gap-y-4 pt-8 sm:grid-cols-4">
              {pk.impact.map((m) => (
                <div key={m.label} className="border-t border-ink/25 pt-3">
                  <p className="font-display text-2xl font-extrabold sm:text-3xl">{m.label.split(" ")[0]}</p>
                  <p className="text-xs font-medium uppercase tracking-wider text-ink/70">
                    {m.label.split(" ").slice(1).join(" ")}
                  </p>
                </div>
              ))}
            </div>
            <ArrowUpRight className="absolute right-6 top-14 h-10 w-10 transition-transform duration-500 group-hover:rotate-45 sm:right-10 sm:h-14 sm:w-14" />
          </Link>
        </motion.div>

        {/* Gopyata */}
        <motion.div
          layout
          id="gopyata"
          onPointerEnter={() => setActive(1)}
          className={cn(
            "group relative overflow-hidden rounded-[1.75rem] border border-accent-2/40 bg-[#0d0a1a] transition-[flex-grow] duration-700 ease-[var(--ease-out-expo)]",
            active === 1 ? "md:flex-[2.2]" : "md:flex-1",
          )}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,#8b6cff55,transparent_55%),radial-gradient(circle_at_10%_100%,#ff3d7f33,transparent_50%)]" />
          <div className="dot-grid absolute inset-0 opacity-30" />
          <Link
            href="/ventures#gopyata"
            className="relative flex h-full min-h-[30rem] flex-col p-6 sm:p-10"
            data-cursor="Peek"
          >
            <div className="flex items-center justify-between font-mono text-[0.72rem] uppercase tracking-[0.2em] text-accent-2">
              <span>Venture 02 · Founder</span>
              <span className="flex items-center gap-2 rounded-full border border-accent-2/40 px-3 py-1">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-2" /> {gopyata?.status ?? "Live"}
              </span>
            </div>
            <FitText
              as="h3"
              className="glitch display-xl mt-6 text-[17vw] leading-[0.8] text-fg sm:text-[11vw] md:text-[4.4vw]"
              data-text={(gopyata?.name ?? "Gopyata").toUpperCase()}
            >
              {(gopyata?.name ?? "Gopyata").toUpperCase()}
            </FitText>
            <p className="mt-6 max-w-md text-lg text-fg/80">
              <Scramble text={gopyata?.tagline ?? "Privacy readiness, made practical."} />
            </p>
            <div className="mt-auto pt-8">
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-muted">DPDP readiness for</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {(gopyata?.audiences ?? []).map((a) => (
                  <li key={a} className="rounded-full border border-accent-2/40 px-3 py-1.5 text-sm text-fg/85">
                    {a}
                  </li>
                ))}
              </ul>
              <p className="mt-5 inline-flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-accent-2">
                gopyata.in <ArrowUpRight className="h-4 w-4" />
              </p>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
