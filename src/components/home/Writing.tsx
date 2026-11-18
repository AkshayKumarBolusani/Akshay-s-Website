"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SplitReveal } from "@/components/ui/motion";

export type PostLite = { slug: string; title: string; category: string; readTime: string; publishedAt: string; thumbnail: string };

export function Writing({ posts }: { posts: PostLite[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 25 });
  const sy = useSpring(y, { stiffness: 200, damping: 25 });

  return (
    <section
      className="section-pad relative"
      aria-label="Writing"
      onPointerMove={(e) => {
        x.set(e.clientX);
        y.set(e.clientY);
      }}
    >
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="min-w-0 max-w-full">
          <p className="eyebrow mb-3">(08) — Writing</p>
          <SplitReveal as="h2" text="Notes from the build" className="display-xl text-[12vw] sm:text-[7vw] md:text-[6vw]" />
        </div>
        <Link href="/blog" className="group inline-flex min-h-11 items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted hover:text-accent">
          All posts <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
        </Link>
      </div>

      <ul className="mt-12 border-t border-border" onPointerLeave={() => setHover(null)}>
        {posts.map((p, i) => (
          <li key={p.slug} onPointerEnter={() => setHover(i)}>
            <Link
              href={`/blog/${p.slug}`}
              className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-4 overflow-hidden border-b border-border py-6 sm:gap-10 sm:py-8"
              data-cursor="Read"
            >
              <span className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
              <span className="relative font-mono text-xs text-muted group-hover:text-ink">0{i + 1}</span>
              <span className="relative font-display text-xl font-bold leading-tight tracking-tight transition-[color,transform] duration-500 group-hover:translate-x-3 group-hover:text-ink sm:text-3xl md:text-4xl">
                {p.title}
              </span>
              <span className="relative hidden text-right font-mono text-[0.72rem] uppercase tracking-wider text-muted group-hover:text-ink sm:block">
                {p.category}
                <br />
                {p.readTime}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {hover !== null && posts[hover]?.thumbnail && (
          <motion.div
            className="pointer-events-none fixed left-0 top-0 z-[60] hidden h-48 w-72 overflow-hidden rounded-xl md:block"
            style={{ x: sx, y: sy, translateX: "-50%", translateY: "-115%" }}
            initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.3 }}
          >
            <Image src={posts[hover].thumbnail} alt="" fill sizes="288px" className="object-cover" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
