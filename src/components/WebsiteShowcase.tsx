"use client";

import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { SectionHeading, Reveal } from "./Reveal";
import { CountUp } from "./CountUp";

type Cat = { name: string; count: number; accent: string };

export function WebsiteShowcase({
  categories,
  totalWebsites,
}: {
  categories: Cat[];
  totalWebsites: number;
}) {
  const max = Math.max(...categories.map((c) => c.count));

  return (
    <section className="section-pad relative mx-auto max-w-7xl">
      <SectionHeading
        label="Website Studio"
        title={
          <>
            <CountUp to={totalWebsites} suffix="+" /> websites,{" "}
            <span className="gradient-text">delivered</span>
          </>
        }
        description="Client work across industries during my Web Development Internship at Digital Connect. Client identities stay private — here is the shape of the work."
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <Reveal>
          <div className="space-y-5">
            {categories.map((c, i) => (
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
                    whileInView={{ width: `${(c.count / max) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1,
                      delay: 0.1 * i,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {categories.map((c, i) => (
              <motion.div
                key={c.name}
                className="group aspect-[4/3] overflow-hidden rounded-xl border border-border panel"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="flex h-6 items-center gap-1 border-b border-border bg-white/[0.03] px-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-faint/50" />
                  <span className="h-1.5 w-1.5 rounded-full bg-faint/50" />
                  <span className="h-1.5 w-1.5 rounded-full bg-faint/50" />
                </div>
                <div className="relative grid h-[calc(100%-1.5rem)] place-items-center">
                  <div
                    className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-40"
                    style={{
                      background: `radial-gradient(circle at 50% 30%, ${c.accent}, transparent 70%)`,
                    }}
                  />
                  <Globe
                    className="relative h-6 w-6 text-muted transition-transform group-hover:scale-110"
                    style={{ color: c.accent }}
                  />
                  <span className="relative mt-2 font-mono text-[0.6rem] tracking-widest text-faint">
                    {c.name.toUpperCase()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-10 text-center">
        <p className="font-mono text-xs tracking-wide text-faint">
          Client names withheld for confidentiality · screenshots available on request
        </p>
      </Reveal>
    </section>
  );
}
