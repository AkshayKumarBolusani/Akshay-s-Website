"use client";

import { Counter, FadeUp } from "@/components/ui/motion";

export type Stat = { value: number; decimals?: number; suffix?: string; label: string; note: string };

export function Stats({ stats }: { stats: Stat[] }) {
  return (
    <section className="gutter relative py-10" aria-label="By the numbers">
      <div className="grid grid-cols-2 border-l border-t border-border md:grid-cols-3">
        {stats.map((s, i) => (
          <FadeUp key={s.label} delay={(i % 3) * 0.08}>
            <div className="group relative h-full overflow-hidden border-b border-r border-border bg-bg/70 p-5 backdrop-blur-sm sm:p-8">
              <div className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100" />
              <div className="relative transition-colors duration-300 group-hover:text-ink">
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-muted group-hover:text-ink/70">
                  0{i + 1} / {s.label}
                </p>
                <Counter
                  to={s.value}
                  decimals={s.decimals}
                  suffix={s.suffix}
                  className="display-xl mt-6 block text-[17vw] sm:text-[9vw] md:text-[7.5vw]"
                />
                <p className="mt-3 max-w-[22ch] text-sm text-muted group-hover:text-ink/80">{s.note}</p>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
