"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import type { Certification } from "@/lib/data";
import { SectionHeading } from "./Reveal";

export function Certifications({ certs }: { certs: Certification[] }) {
  const groups = certs.reduce<Record<string, Certification[]>>((acc, c) => {
    (acc[c.group] ??= []).push(c);
    return acc;
  }, {});
  const order = ["Google", "Microsoft", "Deloitte", "Coursera", "Others"];
  const sorted = Object.keys(groups).sort(
    (a, b) => (order.indexOf(a) + 99) % 100 - ((order.indexOf(b) + 99) % 100),
  );

  return (
    <section id="certifications" className="section-pad relative mx-auto max-w-7xl">
      <SectionHeading
        label="Certifications"
        title={
          <>
            Credentials &{" "}
            <span className="gradient-text">continuous learning</span>
          </>
        }
        description="Drop certificate images into public/certifications/ and they appear here automatically."
      />

      {certs.length === 0 ? (
        <div className="mx-auto grid max-w-md place-items-center gap-3 rounded-2xl border border-dashed border-border panel py-16 text-center">
          <BadgeCheck className="h-8 w-8 text-faint" />
          <p className="text-sm text-muted">
            No certifications listed yet. Add entries to{" "}
            <code className="text-accent-2">data/certifications.json</code> and
            images to{" "}
            <code className="text-accent-2">public/certifications/</code>.
          </p>
        </div>
      ) : (
      <div className="space-y-12">
        {sorted.map((group) => (
          <div key={group}>
            <h3 className="mb-5 font-mono text-sm tracking-widest text-accent-2">
              {group.toUpperCase()}
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {groups[group].map((c, i) => (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group flex items-center gap-4 overflow-hidden rounded-2xl border border-border panel p-4"
                >
                  <div className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-white/[0.04]">
                    {c.image ? (
                      <Image
                        src={c.image}
                        alt={c.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <BadgeCheck className="h-7 w-7 text-accent-2" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{c.title}</p>
                    <p className="text-xs text-muted">
                      {c.issuer} · {c.year}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
      )}
    </section>
  );
}
