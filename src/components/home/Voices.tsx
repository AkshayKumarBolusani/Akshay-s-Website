"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SplitReveal, VelocityMarquee } from "@/components/ui/motion";

export type ClientCard = { name: string; org: string; url?: string; quote?: string; project: string; slug: string };

function Card({ c }: { c: ClientCard }) {
  const initials = c.name
    .replace(/^Dr\.?\s*/i, "")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);
  return (
    <figure className="mr-5 flex w-[80vw] shrink-0 flex-col justify-between rounded-[1.5rem] border border-border bg-bg-soft/90 p-7 whitespace-normal backdrop-blur-sm sm:w-[26rem]">
      <div>
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-muted">Built for</p>
        <p className="mt-2 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{c.org}</p>
        {c.quote && (
          <blockquote className="mt-4 text-lg leading-snug text-fg/85">
            <span className="text-accent">“</span>
            {c.quote}
            <span className="text-accent">”</span>
          </blockquote>
        )}
      </div>
      <figcaption className="mt-8 flex items-center justify-between gap-4">
        <span className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent font-display font-bold text-ink">
            {initials}
          </span>
          <span>
            <span className="block font-semibold">{c.name}</span>
            <Link href={`/project/${c.slug}`} className="inline-flex min-h-11 items-center font-mono text-[0.72rem] uppercase tracking-wider text-muted hover:text-accent">
              {c.project} →
            </Link>
          </span>
        </span>
        {c.url && (
          <a
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border transition-colors hover:border-accent hover:text-accent"
            aria-label={`Visit ${c.org}`}
            data-cursor="Visit"
          >
            <ArrowUpRight className="h-5 w-5" />
          </a>
        )}
      </figcaption>
    </figure>
  );
}

export function Voices({ clients }: { clients: ClientCard[] }) {
  if (!clients.length) return null;
  // the marquee needs enough cards to loop smoothly
  const row = Array.from({ length: Math.max(clients.length, 6) }, (_, i) => clients[i % clients.length]);
  return (
    <section className="relative py-24 sm:py-32" aria-label="Clients">
      <div className="gutter">
        <p className="eyebrow mb-3">(07) — Clients</p>
        <SplitReveal as="h2" text="Built for real people" className="display-xl text-[12vw] sm:text-[7vw] md:text-[6vw]" />
        <p className="mt-4 max-w-md text-muted">
          Colleges, labs and local businesses I&apos;ve shipped software for. Tap a name to see the project.
        </p>
      </div>
      <div className="mask-fade-x mt-12">
        <VelocityMarquee baseVelocity={-1.2}>
          {row.map((c, i) => (
            <Card key={`${c.slug}-${c.org}-${i}`} c={c} />
          ))}
        </VelocityMarquee>
      </div>
    </section>
  );
}
