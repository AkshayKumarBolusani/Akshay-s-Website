"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

function altFor(src: string, slug: string, i: number) {
  const base = decodeURIComponent(src.split("/").pop() ?? "").replace(/\.[a-z0-9]+$/i, "");
  const words = base.replace(/^\d+[-_ ]*/, "").replace(/[-_]+/g, " ").trim();
  return /^(pasted|screenshot|img|image)/i.test(words) || !words ? `${slug.replace(/-/g, " ")} screenshot ${i + 1}` : words;
}

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

  if (images.length === 0) return null;

  return (
    <>
      <div className="gutter mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <p className="eyebrow sm:col-span-2">Screens</p>
        {images.map((src, i) => (
          <motion.button
            key={src}
            onClick={() => setActive(src)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            data-cursor="Zoom"
            className={`group relative overflow-hidden rounded-2xl border border-border ${
              i === 0 && images.length % 2 === 1 ? "sm:col-span-2" : ""
            }`}
            style={{ boxShadow: `0 0 40px -24px ${accent}` }}
          >
            <Image
              src={src}
              alt={altFor(src, slug, i)}
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
            className="fixed inset-0 z-[130] grid place-items-center bg-bg/90 p-4 backdrop-blur-md sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            data-lenis-prevent
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
