import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getAchievements, getProfile } from "@/lib/data";
import { site } from "@/lib/site";
import { breadcrumbLd, pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Counter, FadeUp, FitText, Scramble, SplitReveal, VelocityMarquee } from "@/components/ui/motion";

export const metadata: Metadata = pageMeta({
  title: "Ventures — ProjectKaro & Gopyata",
  description:
    "ProjectKaro is the software studio Akshay Kumar Bolusani founded in January 2024 (60+ projects, team of 23). He also founded Gopyata, DPDP privacy-readiness for Indian businesses.",
  path: "/ventures",
});

export default function VenturesPage() {
  const profile = getProfile();
  const ach = getAchievements();
  const pk = profile.projectKaro!;
  const g = profile.gopyata;

  return (
    <main className="relative pb-10">
      <JsonLd
        data={[
          breadcrumbLd([{ name: "Ventures", path: "/ventures" }]),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: "ProjectKaro — software development studio",
            provider: { "@id": `${site.url}/#organization` },
            areaServed: "Worldwide",
            serviceType: pk.services,
            url: pk.url,
          },
        ]}
      />
      {/* ── ProjectKaro hero ── */}
      <section className="gutter pt-28 sm:pt-36">
        <p className="eyebrow">Venture 01 · Software studio · since {pk.since ?? "2024"}</p>
        <h1 className="display-xl mt-4 text-[13.5vw] leading-[0.82] sm:text-[12.5vw]">
          <SplitReveal text="Project" />
          <span className="block text-accent">
            <SplitReveal text="Karo" delay={0.15} />
          </span>
        </h1>
        <div className="mt-10 grid gap-10 md:grid-cols-[1.3fr_1fr]">
          <FadeUp>
            <p className="font-display text-2xl font-medium leading-snug tracking-tight sm:text-3xl">{pk.description}</p>
          </FadeUp>
          <FadeUp delay={0.1} className="flex flex-col items-start gap-4 md:items-end md:justify-end">
            <a
              href={pk.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-full bg-accent px-7 py-4 font-display text-lg font-bold text-ink transition-transform hover:scale-105"
              data-cursor="Visit"
            >
              projectkaro.com <ArrowUpRight className="h-5 w-5 transition-transform group-hover:rotate-45" />
            </a>
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-muted">Founder &amp; Software Engineer</p>
          </FadeUp>
        </div>
      </section>

      {/* impact */}
      <section className={`gutter mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-[1.5rem] border border-border bg-border ${pk.impact.length === 3 ? "md:grid-cols-3" : pk.impact.length === 2 ? "md:grid-cols-2" : "md:grid-cols-4"}`}>
        {pk.impact.map((m) => {
          const num = parseInt(m.label, 10);
          const suffix = m.label.replace(/^[0-9]+/, "").split(" ")[0];
          return (
            <div key={m.label} className="bg-bg/90 p-6 backdrop-blur sm:p-8">
              <Counter to={num} suffix={suffix} className="display-xl block text-[14vw] sm:text-[7vw] md:text-[5vw]" />
              <p className="mt-2 font-display text-lg font-bold">{m.label.split(" ").slice(1).join(" ")}</p>
              <p className="text-sm text-muted">{m.note}</p>
            </div>
          );
        })}
      </section>

      {/* services */}
      <section className="mt-28">
        <div className="gutter">
          <p className="eyebrow">Services</p>
          <SplitReveal as="h2" text="What we build" className="display-xl mt-3 text-[12vw] sm:text-[7vw]" />
        </div>
        <ul className="mt-10 border-t border-border">
          {pk.services.map((s, i) => (
            <li key={s} className="group relative overflow-hidden border-b border-border">
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100" />
              <div className="gutter relative flex items-center justify-between py-5 transition-colors group-hover:text-ink sm:py-7">
                <span className="font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-3xl font-bold uppercase tracking-tight transition-transform duration-500 group-hover:-translate-x-3 sm:text-6xl">
                  {s}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* process */}
      <section className="gutter mt-28">
        <p className="eyebrow">How a project moves</p>
        <SplitReveal as="h2" text="The process" className="display-xl mt-3 text-[12vw] sm:text-[7vw]" />
        <div className="mt-10 grid gap-4 md:grid-cols-5">
          {pk.process.map((s, i) => (
            <FadeUp key={s.step} delay={i * 0.08}>
              <div className="group relative h-full overflow-hidden rounded-[1.25rem] border border-border bg-bg/80 p-6 backdrop-blur transition-colors hover:border-accent md:min-h-[18rem]">
                <span className="display-xl block text-7xl text-outline transition-colors group-hover:text-accent">{s.step}</span>
                <h3 className="mt-8 font-display text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted">{s.description}</p>
                {i < pk.process.length - 1 && (
                  <span className="absolute right-4 top-6 hidden font-mono text-muted md:block">→</span>
                )}
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* website studio */}
      <section className="gutter mt-28">
        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:items-end">
          <div>
            <p className="eyebrow">Websites, built for clients</p>
            <h2 className="display-xl mt-3 text-[22vw] leading-[0.8] text-accent sm:text-[12vw]">
              <Counter to={ach.websiteStudio.totalWebsites} suffix={ach.websiteStudio.suffix} />
            </h2>
            <p className="mt-4 max-w-sm text-muted">
              Responsive websites built and maintained for clients, with requirements gathered directly and support after launch.
            </p>
          </div>
          <div>
            <p className="eyebrow">For clients in</p>
            <ul className="mt-4 flex flex-wrap gap-3">
              {["Healthcare", "Education", "Real estate", "Business"].map((c) => (
                <li key={c} className="rounded-full border border-border bg-bg/70 px-6 py-3 font-display text-2xl font-bold backdrop-blur sm:text-3xl">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Gopyata ── */}
      <section id="gopyata" className="relative mt-32 scroll-mt-20 overflow-hidden border-y border-accent-2/40 bg-[#0b0817]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,#8b6cff55,transparent_50%),radial-gradient(circle_at_0%_100%,#ff3d7f30,transparent_45%)]" />
        <div className="dot-grid absolute inset-0 opacity-25" />
        <div className="relative border-b border-accent-2/30 bg-accent-2 py-2 text-ink">
          <VelocityMarquee baseVelocity={-3}>
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="pr-8 font-mono text-sm font-bold uppercase tracking-[0.25em]">
                Venture 02 — {g?.status ?? "Live"} — DPDP readiness for Indian businesses —
              </span>
            ))}
          </VelocityMarquee>
        </div>
        <div className="gutter relative py-24 sm:py-32">
          <p className="eyebrow text-accent-2">Venture 02 · Founder</p>
          <FitText
            as="h2"
            className="glitch display-xl mt-4 text-[13.5vw] leading-[0.82] sm:text-[12.5vw]"
            data-text={(g?.name ?? "Gopyata").toUpperCase()}
          >
            {(g?.name ?? "Gopyata").toUpperCase()}
          </FitText>
          <p className="mt-8 max-w-2xl font-display text-3xl font-medium leading-tight sm:text-4xl">
            <Scramble text={g?.tagline ?? "Privacy readiness, made practical."} />
          </p>
          <p className="mt-4 max-w-2xl text-lg text-fg/75">{g?.description}</p>

          <div className="mt-10 flex flex-wrap gap-3">
            {g?.url && (
              <a
                href={g.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-3 rounded-full bg-accent-2 px-7 py-4 font-display text-lg font-bold text-ink transition-transform hover:scale-105"
                data-cursor="Visit"
              >
                Visit gopyata.in <ArrowUpRight className="h-5 w-5" />
              </a>
            )}
          </div>

          {/* live site preview */}
          <div className="mt-16 grid items-end gap-6 lg:grid-cols-[2.2fr_1fr]">
            <FadeUp>
              <a href={g?.url} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden rounded-[1.25rem] border border-accent-2/40 bg-[#14102a] shadow-[0_40px_120px_-40px_rgba(139,108,255,0.5)]" data-cursor="Visit" aria-label="Open gopyata.in">
                <div className="flex items-center gap-2 border-b border-accent-2/30 px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  <span className="ml-3 truncate rounded-full bg-black/30 px-3 py-1 font-mono text-[0.72rem] text-muted">gopyata.in</span>
                </div>
                <Image src="/ventures/gopyata-desktop.webp" alt="Gopyata homepage: Privacy should feel clear, not complicated" width={1440} height={900} sizes="(max-width: 1024px) 100vw, 66vw" className="h-auto w-full transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.02]" />
              </a>
            </FadeUp>
            <FadeUp delay={0.1} className="mx-auto w-[min(17rem,70vw)]">
              <div className="overflow-hidden rounded-[2rem] border-4 border-[#14102a] bg-[#14102a] shadow-[0_30px_80px_-30px_rgba(139,108,255,0.5)]">
                <Image src="/ventures/gopyata-mobile.webp" alt="Gopyata on mobile" width={780} height={1688} sizes="17rem" className="h-auto w-full" />
              </div>
            </FadeUp>
          </div>

          {/* offerings */}
          {g?.offerings && (
            <div className="mt-20">
              <p className="eyebrow text-accent-2">Ways to work with Gopyata</p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {g.offerings.map((o, i) => (
                  <FadeUp key={o.name} delay={i * 0.08}>
                    <div className="h-full rounded-[1.25rem] border border-accent-2/30 bg-black/30 p-6 backdrop-blur">
                      <div className="flex items-center justify-between font-mono text-[0.72rem] uppercase tracking-[0.18em]">
                        <span className="text-muted">Step {o.step}</span>
                        <span className="rounded-full border border-accent-2/50 px-2.5 py-1 text-accent-2">{o.tag}</span>
                      </div>
                      <h3 className="mt-6 font-display text-2xl font-bold">{o.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-fg/70">{o.detail}</p>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          )}

          {g?.audiences && (
            <div className="mt-12">
              <p className="eyebrow text-accent-2">Built around</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.audiences.map((a) => (
                  <li key={a} className="rounded-full border border-accent-2/40 px-4 py-2 text-fg/85">
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {g?.disclaimer && <p className="mt-10 max-w-xl text-sm text-muted">{g.disclaimer}</p>}
        </div>
      </section>
    </main>
  );
}
