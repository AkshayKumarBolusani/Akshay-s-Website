"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Folder,
  FolderOpen,
  ChevronRight,
  Search,
  ArrowUpRight,
  Terminal,
} from "lucide-react";
import type { ProjectWithImages } from "@/lib/data";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, string> = {
  "AI & Machine Learning": "🧠",
  "Computer Vision": "👁️",
  "Full Stack Applications": "⚡",
  "Research Projects": "🔬",
  "Startup Projects": "🚀",
  Healthcare: "🏥",
  Other: "📦",
};

export function ProjectVault({
  projects,
}: {
  projects: ProjectWithImages[];
}) {
  const reduce = useReducedMotion();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  const categories = useMemo(() => {
    const map = new Map<string, ProjectWithImages[]>();
    for (const p of projects) {
      const cat = p.category || "Other";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(p);
    }
    return Array.from(map.entries())
      .map(([name, projs]) => ({
        name,
        icon: CATEGORY_ICONS[name] || "📁",
        projects: projs.sort((a, b) => a.rank - b.rank),
      }))
      .sort((a, b) => b.projects.length - a.projects.length);
  }, [projects]);

  const filteredCategories = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return categories;
    return categories
      .map((cat) => ({
        ...cat,
        projects: cat.projects.filter((p) =>
          [p.title, p.tagline, p.category, ...p.tech, ...p.domains]
            .join(" ")
            .toLowerCase()
            .includes(q),
        ),
      }))
      .filter((cat) => cat.projects.length > 0);
  }, [categories, search]);

  const toggle = (name: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const expandAll = () => {
    setExpanded(new Set(categories.map((c) => c.name)));
  };

  const collapseAll = () => {
    setExpanded(new Set());
  };

  const totalProjects = projects.length;
  const featuredCount = projects.filter((p) => p.featured).length;

  return (
    <section id="projects" className="section-pad relative mx-auto max-w-6xl">
      {/* Vault Header */}
      <div className="mb-10 text-center sm:mb-14">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5"
        >
          <Terminal className="h-3.5 w-3.5 text-accent" />
          <span className="font-mono text-xs tracking-widest text-accent">
            PROJECT VAULT
          </span>
        </motion.div>

        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
        >
          <span className="gradient-text">{totalProjects}+</span> Engineering
          Case Studies
        </motion.h2>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mx-auto mt-4 max-w-2xl text-muted"
        >
          AI research, full-stack products, computer vision systems, and
          production applications. Click a folder to explore.
        </motion.p>

        {/* Stats Bar */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-6 font-mono text-xs tracking-wider text-faint sm:gap-10"
        >
          <span>
            <span className="text-fg">{totalProjects}</span> PROJECTS
          </span>
          <span>
            <span className="text-fg">{featuredCount}</span> FEATURED
          </span>
          <span>
            <span className="text-fg">{categories.length}</span> DOMAINS
          </span>
        </motion.div>
      </div>

      {/* Search & Controls */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-white/[0.02] px-4 py-2.5 sm:w-80">
          <Search className="h-4 w-4 text-faint" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            aria-label="Search projects"
            className="w-full bg-transparent text-sm outline-none placeholder:text-faint"
          />
          {search && (
            <span className="font-mono text-[0.65rem] text-faint">
              {filteredCategories.reduce((a, c) => a + c.projects.length, 0)}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={expandAll}
            className="rounded-lg border border-border px-3 py-1.5 font-mono text-[0.65rem] tracking-wider text-faint transition-colors hover:border-faint hover:text-muted"
          >
            EXPAND ALL
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="rounded-lg border border-border px-3 py-1.5 font-mono text-[0.65rem] tracking-wider text-faint transition-colors hover:border-faint hover:text-muted"
          >
            COLLAPSE
          </button>
        </div>
      </div>

      {/* Folder List */}
      <div className="space-y-3">
        {filteredCategories.map((cat, ci) => {
          const isOpen = expanded.has(cat.name);
          return (
            <motion.div
              key={cat.name}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: ci * 0.05 }}
              className="overflow-hidden rounded-xl border border-border bg-white/[0.01]"
            >
              {/* Folder Header */}
              <button
                type="button"
                onClick={() => toggle(cat.name)}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/[0.03] sm:px-5 sm:py-4"
              >
                <motion.span
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="h-4 w-4 text-faint" />
                </motion.span>

                {isOpen ? (
                  <FolderOpen className="h-5 w-5 text-accent" />
                ) : (
                  <Folder className="h-5 w-5 text-accent/70" />
                )}

                <span className="mr-1 text-lg">{cat.icon}</span>

                <span className="flex-1 font-medium">{cat.name}</span>

                <span className="rounded-md bg-white/[0.06] px-2 py-0.5 font-mono text-[0.65rem] text-muted">
                  {cat.projects.length} projects
                </span>
              </button>

              {/* Project List */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-3 border-t border-border bg-black/20 p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-3">
                      {cat.projects.map((p, pi) => (
                        <ProjectFile key={p.slug} project={p} index={pi} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {filteredCategories.length === 0 && (
        <div className="rounded-xl border border-border py-16 text-center">
          <p className="text-muted">No projects match your search.</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-10 text-center">
        <p className="font-mono text-xs tracking-wide text-faint">
          Each project includes architecture, stack, challenges & learnings
        </p>
      </div>
    </section>
  );
}

function ProjectFile({
  project: p,
  index,
}: {
  project: ProjectWithImages;
  index: number;
}) {
  const reduce = useReducedMotion();
  const statusColor = p.featured ? "text-green-400" : "text-faint";

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03 }}
    >
      <Link
        href={`/project/${p.slug}`}
        className="group relative flex flex-col rounded-lg border border-border bg-bg/50 p-4 transition-all hover:border-accent/40 hover:bg-white/[0.03]"
      >
        {/* File Header */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <span className="font-mono text-[0.6rem] tracking-widest text-faint">
            PROJECT_{String(p.rank).padStart(3, "0")}
          </span>
          <ArrowUpRight className="h-3.5 w-3.5 text-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
        </div>

        {/* Title */}
        <h3 className="mb-2 text-sm font-semibold leading-snug group-hover:text-accent">
          {p.title}
        </h3>

        {/* Meta */}
        <div className="mb-3 space-y-1.5 font-mono text-[0.6rem] tracking-wide">
          <div className="flex items-center gap-2">
            <span className="text-faint">STATUS:</span>
            <span className={cn("uppercase", statusColor)}>
              {p.featured ? "FEATURED" : "COMPLETE"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-faint">YEAR:</span>
            <span className="text-muted">{p.year}</span>
          </div>
        </div>

        {/* Stack */}
        <div className="mt-auto flex flex-wrap gap-1">
          {p.tech.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.55rem] text-muted"
            >
              {t}
            </span>
          ))}
          {p.tech.length > 3 && (
            <span className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.55rem] text-faint">
              +{p.tech.length - 3}
            </span>
          )}
        </div>

        {/* Accent glow */}
        <div
          className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full opacity-0 blur-2xl transition-opacity group-hover:opacity-40"
          style={{ background: p.accent }}
        />
      </Link>
    </motion.div>
  );
}
