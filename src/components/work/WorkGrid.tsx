"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, LayoutGrid, List } from "lucide-react";
import { ProjectArt } from "@/components/ui/ProjectArt";
import { Tilt } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

export type WorkItem = {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  year: string;
  accent: string;
  tech: string[];
  featured: boolean;
  image?: string;
};

export function WorkGrid({ items }: { items: WorkItem[] }) {
  const cats = useMemo(() => {
    const m = new Map<string, number>();
    items.forEach((p) => m.set(p.category, (m.get(p.category) ?? 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [items]);
  const [cat, setCat] = useState<string>("All");
  const [view, setView] = useState<"grid" | "index">("grid");
  const shown = cat === "All" ? items : items.filter((p) => p.category === cat);

  return (
    <div>
      <div className="sticky top-16 z-20 -mx-[var(--gutter)] flex items-center gap-3 border-y border-border bg-bg/80 px-[var(--gutter)] py-3 backdrop-blur-xl sm:top-[4.5rem]">
        <div className="scroll-x-touch flex flex-1 gap-2">
          {[["All", items.length] as [string, number], ...cats].map(([c, n]) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "min-h-11 shrink-0 rounded-full border px-4 py-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] transition-colors",
                cat === c ? "border-accent bg-accent text-ink" : "border-border text-muted hover:border-fg/40 hover:text-fg",
              )}
            >
              {c} <span className="ml-1 opacity-60">{n}</span>
            </button>
          ))}
        </div>
        <div className="flex shrink-0 rounded-full border border-border p-1">
          {(["grid", "index"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              aria-label={`${v} view`}
              aria-pressed={view === v}
              className={cn("grid h-11 w-11 place-items-center rounded-full transition-colors", view === v ? "bg-fg text-ink" : "text-muted")}
            >
              {v === "grid" ? <LayoutGrid className="h-4 w-4" /> : <List className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </div>

      {view === "grid" ? (
        <motion.div layout className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {shown.map((p, i) => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: Math.min(i, 8) * 0.04, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href={`/project/${p.slug}`} className="group block" data-cursor="View">
                  <Tilt className="rounded-[1.5rem]" max={7}>
                    <ProjectArt
                      title={p.title}
                      accent={p.accent}
                      image={p.image}
                      index={i}
                      className="aspect-[4/3.2] w-full rounded-[1.5rem] border border-border"
                      sizes="(max-width: 640px) 92vw, (max-width: 1280px) 46vw, 31vw"
                    />
                    {p.featured && (
                      <span className="absolute left-4 top-4 rounded-full bg-bg/80 px-3 py-1 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-accent backdrop-blur">
                        ★ Featured
                      </span>
                    )}
                  </Tilt>
                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-muted">
                        <span style={{ color: p.accent }}>●</span> {p.category} · {p.year}
                      </p>
                      <h3 className="mt-2 font-display text-2xl font-bold leading-tight tracking-tight transition-colors group-hover:text-accent sm:text-3xl">
                        {p.title}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-sm text-muted">{p.tagline}</p>
                    </div>
                    <ArrowUpRight className="mt-1 h-6 w-6 shrink-0 text-muted transition-all duration-500 group-hover:rotate-45 group-hover:text-accent" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <ul className="mt-6">
          {shown.map((p, i) => (
            <motion.li
              key={p.slug}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i, 12) * 0.03 }}
            >
              <Link
                href={`/project/${p.slug}`}
                className="group relative grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 overflow-hidden border-b border-border py-5 sm:grid-cols-[3rem_1.2fr_1fr_6rem]"
                data-cursor="View"
              >
                <span
                  className="absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100"
                  style={{ background: p.accent }}
                />
                <span className="relative font-mono text-xs text-muted group-hover:text-ink">{String(i + 1).padStart(2, "0")}</span>
                <span className="relative font-display text-xl font-bold tracking-tight transition-[color,transform] duration-500 group-hover:translate-x-2 group-hover:text-ink sm:text-3xl">
                  {p.title}
                </span>
                <span className="relative hidden text-sm text-muted group-hover:text-ink/80 sm:block">{p.category}</span>
                <span className="relative text-right font-mono text-xs text-muted group-hover:text-ink">{p.year}</span>
              </Link>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
