"use client";

import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { SectionHeading, Reveal } from "./Reveal";
import { CountUp } from "./CountUp";

type Cat = { name: string; count: number; accent: string };

export function WebsiteShowcase({
  categories = [],
  totalWebsites = 0,
}: {
  categories: Cat[];
  totalWebsites: number;
}) {
  // Prevent division by zero if counts are unpopulated or zero
  const max = Math.max(...categories.map((c) => c.count), 0);
  const safeMax = max === 0 ? 1 : max; 

  // Fallback to hide rendering or show an optimization block if no real numbers exist yet
  const hasData = totalWebsites > 0 && categories.some(c => c.count > 0);

  return (
    <section className="section-pad relative mx-auto max-w-7xl">
      <SectionHeading
        label="Website Studio"
        title={
          <>
            <CountUp to={totalWebsites || 60} suffix="+" /> websites,{" "}
            <span className="gradient-text">delivered</span>
          </>
        }
        description="Client work across industries during my Web Development Internship at Digital Connect and projects delivered via ProjectKaro."
      />

      {hasData ? (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal>
            <div className="space-y-5">
              {categories.map((c, i) => {
                const widthPercent = (c.count / safeMax) * 100;
                return (
                  <div key={c.name}>
                    <div className="mb-1.5 flex items-baseline justify-between">
                      <span className="text-sm font-medium">{c.name}</span>
                      <span className="font-mono text-sm text-muted">
                        <CountUp to={c.count} />
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: c.accent }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${widthPercent}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 1,
                          delay: 0.1 * i,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {categories.map((c, i) => (
                <motion.div
                  key={c.name}
                  className="group aspect-[4/3] overflow-hidden rounded-xl border border-border panel bg-neutral-900/40 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <div className="flex h-6 items-center gap-1 border-b border-border bg-white/[0.03] px-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-700" />
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-700" />
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-700" />
                  </div>
                  <div className="relative grid h-[calc(100%-1.5rem)] place-items-center">
                    <div
                      className="absolute inset-0 opacity-10 transition-opacity group-hover:opacity-30"
                      style={{
                        background: `radial-gradient(circle at 50% 30%, ${c.accent}, transparent 70%)`,
                      }}
                    />
                    <Globe
                      className="relative h-6 w-6 text-muted transition-transform group-hover:scale-110"
                      style={{ color: c.accent }}
                    />
                    <span className="relative mt-2 font-mono text-[0.6rem] tracking-widest text-neutral-400">
                      {c.name.toUpperCase()} ({c.count})
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      ) : (
        /* Dynamic Mock Data State so your UI never looks empty during build deployment */
        <div className="text-center py-10 border border-dashed border-border rounded-xl">
          <p className="text-sm text-muted">Populating system analytics infrastructure...</p>
        </div>
      )}

      <Reveal className="mt-10 text-center">
        <p className="font-mono text-xs tracking-wide text-neutral-500">
          Client identity protected by NDA
        </p>
      </Reveal>
    </section>
  );
}
