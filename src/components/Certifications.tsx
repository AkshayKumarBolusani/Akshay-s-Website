"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import type { Certification } from "@/lib/data";
import { SectionHeading } from "./Reveal";

export function Certifications({
  certs,
}: {
  certs: Certification[];
}) {
  const groups = certs.reduce<Record<string, Certification[]>>(
    (acc, cert) => {
      const group = cert.group || "Credentials & Achievements";

      if (!acc[group]) {
        acc[group] = [];
      }

      acc[group].push(cert);

      return acc;
    },
    {},
  );

  return (
    <section
      id="certifications"
      className="section-pad relative mx-auto max-w-7xl"
    >
      <SectionHeading
        label="Certifications"
        title={
          <>
            Credentials &{" "}
            <span className="gradient-text">continuous learning</span>
          </>
        }
        description="A collection of certifications, achievements, programs and professional learning."
      />

      {certs.length === 0 ? (
        <div className="mx-auto grid max-w-md place-items-center gap-3 rounded-2xl border border-dashed border-border panel py-16 text-center">
          <BadgeCheck className="h-8 w-8 text-faint" />

          <p className="text-sm text-muted">
            No certifications listed yet. Add entries to{" "}
            <code className="text-accent-2">
              data/certifications.json
            </code>{" "}
            and images to{" "}
            <code className="text-accent-2">
              public/certifications/
            </code>
            .
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(groups).map(([group, items]) => (
            <div key={group}>
              <h3 className="mb-5 font-mono text-xs uppercase tracking-[0.25em] text-accent-2">
                {group}
              </h3>

              {/* Masonry-style certificate layout */}
              <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
                {items.map((cert, index) => (
                  <motion.article
                    key={cert.title}
                    initial={{
                      opacity: 0,
                      y: 24,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      margin: "-50px",
                    }}
                    transition={{
                      duration: 0.45,
                      delay: Math.min(index * 0.05, 0.25),
                    }}
                    className="mb-5 break-inside-avoid"
                  >
                    <div className="group overflow-hidden rounded-2xl border border-border bg-white/[0.025] transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.045] hover:shadow-2xl">
                      {/* Certificate image */}
                      <div className="relative overflow-hidden bg-white">
                        {cert.image ? (
                          <Image
                            src={cert.image}
                            alt={cert.title}
                            width={1200}
                            height={850}
                            className="h-auto w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                          />
                        ) : (
                          <div className="flex aspect-[4/3] items-center justify-center bg-white/[0.04]">
                            <BadgeCheck className="h-10 w-10 text-accent-2" />
                          </div>
                        )}
                      </div>

                      {/* Certificate information */}
                      <div className="p-5">
                        <h4 className="text-base font-semibold leading-snug text-white">
                          {cert.title}
                        </h4>

                        <p className="mt-1 text-sm text-muted">
                          {cert.issuer}
                        </p>

                        {cert.year && (
                          <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-accent-2">
                            {cert.year}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}