"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, X } from "lucide-react";
import { SectionHeading } from "./Reveal";

export function MediaGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="media" className="section-pad relative mx-auto max-w-7xl">
      <SectionHeading
        label="Media"
        title={
          <>
            Events, talks &{" "}
            <span className="gradient-text">moments</span>
          </>
        }
        description="Conferences, hackathons, workshops, and awards. Drop photos into public/media/ or public/awards/ — the gallery builds itself."
      />

      {images.length === 0 ? (
        <div className="mx-auto grid max-w-md place-items-center gap-3 rounded-2xl border border-dashed border-border panel py-16 text-center">
          <Camera className="h-8 w-8 text-faint" />
          <p className="text-sm text-muted">
            No media yet. Add images to{" "}
            <code className="text-accent-2">public/media/</code> to populate this
            gallery automatically.
          </p>
        </div>
      ) : (
        <div className="columns-2 gap-3 sm:columns-2 sm:gap-4 md:columns-3 lg:columns-4">
          {images.map((src, i) => (
            <motion.button
              key={src}
              onClick={() => setActive(src)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 8) * 0.04 }}
              className="group relative mb-4 block w-full overflow-hidden rounded-xl border border-border"
            >
              <Image
                src={src}
                alt={`Media ${i + 1}`}
                width={500}
                height={500}
                className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </motion.button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[95] grid place-items-center bg-bg/90 p-4 backdrop-blur-md sm:p-6"
            style={{
              paddingTop: "max(1rem, env(safe-area-inset-top))",
              paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <button
              className="absolute right-6 top-6 rounded-full border border-border panel p-2"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              className="relative max-h-[85vh] max-w-[90vw]"
            >
              <Image
                src={active}
                alt="Media preview"
                width={1400}
                height={1400}
                className="max-h-[85vh] w-auto rounded-xl object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
