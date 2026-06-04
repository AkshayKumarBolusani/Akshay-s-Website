"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ImageIcon } from "lucide-react";

export function ProjectScreenshots({
  images,
  accent,
  slug,
}: {
  images: string[];
  accent: string;
  slug: string;
}) {
  const [active, setActive] = useState<string | null>(null);

  if (images.length === 0) {
    return (
      <div className="mt-12 grid place-items-center gap-3 rounded-2xl border border-dashed border-border panel py-14 text-center">
        <ImageIcon className="h-7 w-7 text-faint" />
        <p className="max-w-xs text-sm text-muted">
          Add screenshots to{" "}
          <code className="text-accent-2">public/projects/{slug}/</code> and they
          appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {images.map((src, i) => (
          <motion.button
            key={src}
            onClick={() => setActive(src)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className={`group relative overflow-hidden rounded-xl border border-border ${
              i === 0 && images.length % 2 === 1 ? "sm:col-span-2" : ""
            }`}
            style={{ boxShadow: `0 0 40px -24px ${accent}` }}
          >
            <Image
              src={src}
              alt={`Screenshot ${i + 1}`}
              width={1200}
              height={750}
              className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[95] grid place-items-center bg-bg/90 p-4 backdrop-blur-md sm:p-6"
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
            <Image
              src={active}
              alt="Screenshot preview"
              width={1600}
              height={1000}
              className="max-h-[85vh] w-auto rounded-xl object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
