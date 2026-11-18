"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { nav, site } from "@/lib/site";
import { Magnetic, VelocityMarquee } from "@/components/ui/motion";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-bg">
      <Link href="/contact" className="group block border-b border-border py-6 sm:py-10" data-cursor="Let's talk">
        <VelocityMarquee baseVelocity={-3}>
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className="display-xl flex items-center gap-[4vw] pr-[4vw] text-[16vw] sm:text-[11vw]">
              <span className="transition-colors duration-500 group-hover:text-accent">Let&apos;s build</span>
              <span className="text-outline">something</span>
              <span className="inline-block h-[0.6em] w-[0.6em] rounded-full bg-accent transition-transform duration-700 group-hover:scale-125" />
            </span>
          ))}
        </VelocityMarquee>
      </Link>

      <div className="gutter grid grid-cols-2 gap-10 py-14 md:grid-cols-4">
        <div className="col-span-2">
          <p className="eyebrow">Say hello</p>
          <Magnetic className="mt-4">
            <a
              href={`mailto:${site.email}`}
              className="group inline-flex items-center gap-3 break-all font-display text-2xl font-bold tracking-tight sm:text-4xl"
              data-cursor="Email"
            >
              {site.email}
              <ArrowUpRight className="h-7 w-7 shrink-0 text-accent transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </a>
          </Magnetic>
          <p className="mt-6 max-w-sm text-sm text-muted">
            Open to software engineering, AI/ML and full-stack roles, freelance builds and collaborations.
          </p>
        </div>
        <div>
          <p className="eyebrow">Sitemap</p>
          <ul className="mt-4 space-y-2">
            {nav.map((n) => (
              <li key={n.id}>
                <Link href={n.href} className="inline-block py-2.5 text-fg/80 transition-colors hover:text-accent">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow">Elsewhere</p>
          <ul className="mt-4 space-y-2">
            {[
              ["LinkedIn", site.socials.linkedin],
              ["GitHub", site.socials.github],
              ["Instagram", site.socials.instagram],
              ["X / Twitter", site.socials.twitter],
              ["ProjectKaro", site.projectKaro.url],
            ].map(([l, h]) => (
              <li key={l}>
                <a href={h} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1 py-2.5 text-fg/80 transition-colors hover:text-accent">
                  {l}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="gutter flex flex-col justify-between gap-2 border-t border-border py-6 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-faint sm:flex-row">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span>Designed &amp; engineered in Hyderabad</span>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="min-h-11 text-left hover:text-accent sm:text-right"
        >
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
