"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SplitReveal, Tilt } from "@/components/ui/motion";

const LINES: { t: string; c?: string }[] = [
  { t: "$ cognora ask \"What is the refund window?\" --doc policy.pdf" },
  { t: "  ↳ docling: 42 pages extracted · provenance kept", c: "text-muted" },
  { t: "  ↳ hybrid retrieval: 18 candidates → rerank → top 4", c: "text-muted" },
  { t: "  answer: 30 days from delivery  [p.12] [p.13]", c: "text-accent" },
  { t: "" },
  { t: "$ invoice-ai check INV-2026-0412.pdf" },
  { t: "  ↳ CGST 9% + SGST 9% on ₹48,250.00 … ok", c: "text-muted" },
  { t: "  ⚠ total mismatch: ₹56,935.00 ≠ ₹56,953.00 → sent to review", c: "text-[#ff8a3d]" },
  { t: "" },
  { t: "$ wazuh alerts --tail" },
  { t: "  [T1110] brute force · 23 failed ssh logins · 10.0.4.17", c: "text-accent-3" },
  { t: "  ↳ rule 5712 fired · host isolated · ticket opened", c: "text-muted" },
  { t: "" },
  { t: "$ whoami" },
  { t: "  akshay — builds AI that shows its work", c: "text-accent" },
];

function Terminal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const [line, setLine] = useState(0);
  const [char, setChar] = useState(0);

  useEffect(() => {
    if (!inView || line >= LINES.length) return;
    const full = LINES[line].t;
    const isCmd = full.startsWith("$");
    if (char < full.length) {
      const id = setTimeout(() => setChar((c) => c + (isCmd ? 1 : 3)), isCmd ? 28 : 8);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      setLine((l) => l + 1);
      setChar(0);
    }, isCmd ? 260 : 90);
    return () => clearTimeout(id);
  }, [inView, line, char]);

  return (
    <div ref={ref} className="overflow-hidden rounded-2xl border border-border bg-[#09090b]/95 shadow-[0_40px_120px_-30px_rgba(198,255,61,0.25)]">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-[0.7rem] text-muted">akshay@lab — zsh</span>
      </div>
      <pre className="h-[25rem] overflow-hidden whitespace-pre-wrap p-5 font-mono text-[0.72rem] leading-relaxed sm:text-[0.8rem]" aria-label="Animated terminal demo of Cognora AI, India Invoice AI and the SOC lab">
        {LINES.slice(0, line).map((l, i) => (
          <div key={i} className={l.c}>
            {l.t || " "}
          </div>
        ))}
        {line < LINES.length && (
          <div className={LINES[line].c}>
            {LINES[line].t.slice(0, char)}
            <span className="animate-blink ml-0.5 inline-block h-[1.1em] w-2 translate-y-[0.2em] bg-accent" />
          </div>
        )}
        {line >= LINES.length && <span className="animate-blink inline-block h-[1.1em] w-2 bg-accent" />}
      </pre>
    </div>
  );
}

const CARDS = [
  { slug: "cognora-ai", title: "Cognora AI", k: "RAG", d: "Every answer comes with the page it came from." },
  { slug: "india-invoice-ai", title: "India Invoice AI", k: "Document AI", d: "Catches GST errors before filing, not after." },
  { slug: "soc-lab", title: "SOC Lab", k: "Security", d: "Wazuh + Elastic + Suricata, mapped to MITRE ATT&CK." },
];

export function Lab() {
  return (
    <section className="section-pad relative" aria-label="The lab">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow mb-3">(05) — The lab</p>
          <SplitReveal as="h2" text="Local-first. Cited. Checked." className="display-xl text-[12vw] sm:text-[7vw] md:text-[5.2vw]" />
          <p className="mt-6 max-w-lg text-lg text-fg/75">
            My recent work is about AI you can actually trust: retrieval that cites sources, extraction that gets reviewed by a human,
            and systems that keep your data on your own machine. Plus a SOC lab where I attack my own servers to learn how to defend them.
          </p>
          <div className="mt-8 grid gap-3">
            {CARDS.map((c) => (
              <Link
                key={c.slug}
                href={`/project/${c.slug}`}
                className="group flex items-center justify-between gap-4 border-b border-border py-4 transition-colors hover:border-accent"
                data-cursor="Open"
              >
                <div>
                  <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-muted">{c.k}</p>
                  <p className="font-display text-2xl font-bold transition-transform duration-500 group-hover:translate-x-2 sm:text-3xl">
                    {c.title}
                  </p>
                  <p className="text-sm text-muted">{c.d}</p>
                </div>
                <ArrowUpRight className="h-7 w-7 shrink-0 text-muted transition-all duration-500 group-hover:rotate-45 group-hover:text-accent" />
              </Link>
            ))}
          </div>
        </div>
        <Tilt max={6} className="rounded-2xl">
          <Terminal />
        </Tilt>
      </div>
    </section>
  );
}
