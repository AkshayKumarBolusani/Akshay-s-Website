"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

export function Gallery({ images }: { images: string[] }) {
  const [i, setI] = useState<number | null>(null);
  const [count, setCount] = useState(12);
  const go = useCallback(
    (d: number) => setI((v) => (v === null ? v : (v + d + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (i === null) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") setI(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [i, go]);

  if (!images.length) return null;

  return (
    <>
      <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3">
        {images.slice(0, count).map((src, idx) => (
          <motion.button
            key={src}
            onClick={() => setI(idx)}
            initial={{ opacity: 0, y: 30, rotate: idx % 2 ? 1.5 : -1.5 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: "-5% 0px" }}
            transition={{ duration: 0.7, delay: (idx % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="group relative block w-full break-inside-avoid overflow-hidden rounded-xl border border-border"
            data-cursor="Open"
            aria-label={`Open photo ${idx + 1}`}
          >
            <Image
              src={src}
              alt={`Moment ${idx + 1} from Akshay's journey`}
              width={800}
              height={idx % 3 === 0 ? 1000 : 600}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="h-auto w-full object-cover grayscale-[60%] transition-[transform,filter] duration-700 group-hover:scale-105 group-hover:grayscale-0"
            />
          </motion.button>
        ))}
      </div>
      {count < images.length && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setCount((c) => c + 12)}
            className="min-h-11 rounded-full border border-border px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] transition-colors hover:border-accent hover:text-accent"
          >
            Load more ({images.length - count})
          </button>
        </div>
      )}

      <AnimatePresence>
        {i !== null && (
          <motion.div
            className="fixed inset-0 z-[130] flex items-center justify-center bg-bg/95 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setI(null)}
            role="dialog"
            aria-modal="true"
            data-lenis-prevent
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35 }}
                className="relative h-[80vh] w-full max-w-5xl"
                onClick={(e) => e.stopPropagation()}
              >
                <Image src={images[i]} alt={`Photo ${i + 1}`} fill sizes="100vw" className="object-contain" />
              </motion.div>
            </AnimatePresence>
            <button onClick={() => setI(null)} className="absolute right-5 top-5 grid h-12 w-12 place-items-center rounded-full bg-accent text-ink" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
            <button onClick={(e) => (e.stopPropagation(), go(-1))} className="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-border bg-bg/70" aria-label="Previous">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button onClick={(e) => (e.stopPropagation(), go(1))} className="absolute right-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-border bg-bg/70" aria-label="Next">
              <ArrowRight className="h-5 w-5" />
            </button>
            <p className="absolute bottom-5 font-mono text-xs text-muted">
              {i + 1} / {images.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
