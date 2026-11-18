import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ArrowRight } from "lucide-react";
import { Github } from "@/components/icons";
import { ProjectArt } from "@/components/ui/ProjectArt";
import { FadeUp, SplitReveal } from "@/components/ui/motion";
import { getProject, getProjectSlugs, getProjects } from "@/lib/data";
import { site } from "@/lib/site";
import { ProjectScreenshots } from "@/components/ProjectScreenshots";

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  const title = `${p.title} — ${p.tagline}`;
  const url = `${site.url}/project/${p.slug}`;
  const og = p.images[0] ?? site.ogImage;
  return {
    title: p.title,
    description: p.description,
    keywords: [...p.tech, ...p.domains, p.category, "Akshay Kumar Bolusani"],
    alternates: { canonical: `/project/${p.slug}` },
    openGraph: {
      title,
      description: p.description,
      url,
      type: "article",
      images: [{ url: og, alt: p.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: p.description,
      images: [og],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const all = getProjects();
  const idx = all.findIndex((x) => x.slug === p.slug);
  const next = all[(idx + 1) % all.length];
  const flow = p.architecture.split(/\s*→\s*/).filter(Boolean);

  const sections: { title: string; body: string }[] = [
    { title: "Overview", body: p.description },
    { title: "Problem", body: p.problem },
    { title: "Solution", body: p.solution },
    { title: "Architecture", body: p.architecture },
  ];

  const lists: { title: string; items: string[] }[] = [
    { title: "Key Features", items: p.features },
    { title: "Engineering Challenges", items: p.challenges },
    { title: "Lessons Learned", items: p.learnings },
    { title: "Future Scope", items: p.futureScope },
  ];

  const ld = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: p.title,
    description: p.description,
    url: `${site.url}/project/${p.slug}`,
    ...(p.github ? { codeRepository: p.github } : {}),
    programmingLanguage: p.tech,
    applicationCategory: p.category,
    author: { "@type": "Person", name: site.name, url: site.url },
    keywords: [...p.tech, ...p.domains].join(", "),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: `${site.url}/work`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: p.title,
        item: `${site.url}/project/${p.slug}`,
      },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is ${p.title}?`,
        acceptedAnswer: { "@type": "Answer", text: p.description },
      },
      ...(p.problem
        ? [
            {
              "@type": "Question",
              name: `What problem does ${p.title} solve?`,
              acceptedAnswer: { "@type": "Answer", text: p.problem },
            },
          ]
        : []),
      {
        "@type": "Question",
        name: `What technologies power ${p.title}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${p.title} is built with ${p.tech.join(", ")}.`,
        },
      },
    ],
  };

  return (
    <main className="relative">
      <article className="pb-10">
        <header className="gutter pt-28 sm:pt-36">
          <Link
            href="/work"
            className="inline-flex min-h-11 items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All work
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-3 font-mono text-[0.72rem] uppercase tracking-[0.2em]">
            <span className="rounded-full px-3 py-1 text-ink" style={{ background: p.accent }}>
              {p.category}
            </span>
            <span className="text-muted">{p.year}</span>
            <span className="text-muted">·</span>
            <span className="text-muted">{p.domains.join(" / ")}</span>
          </div>
          <SplitReveal
            as="h1"
            text={p.title}
            className="display-xl mt-6 text-[14vw] sm:text-[10vw] md:text-[8.5vw]"
          />
          <div className="mt-6 grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-end">
            <p className="max-w-2xl text-xl leading-snug text-fg/85 sm:text-2xl">{p.tagline}</p>
            <div className="flex flex-wrap gap-3 md:justify-end">
              {(p.links ?? []).map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-ink transition-transform hover:scale-105"
                  data-cursor="Get it"
                >
                  {l.label} <ArrowUpRight className="h-4 w-4" />
                </a>
              ))}
              {p.github && (
                <a
                  href={p.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-bg/60 px-5 py-3 text-sm backdrop-blur transition-colors hover:border-accent hover:text-accent"
                  data-cursor="Code"
                >
                  <Github className="h-4 w-4" /> Source on GitHub
                </a>
              )}
            </div>
          </div>
        </header>

        <FadeUp className="gutter mt-12">
          <ProjectArt
            title={p.title}
            accent={p.accent}
            image={p.images[0]}
            index={idx}
            className="group h-[52vh] min-h-[320px] w-full rounded-[1.75rem] border border-border sm:h-[70vh]"
            sizes="100vw"
          />
        </FadeUp>

        {p.metrics.length > 0 && (
          <div className="gutter mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-[1.25rem] border border-border bg-border sm:grid-cols-3">
            {p.metrics.map((m) => (
              <div key={m.label} className="bg-bg/90 p-6 backdrop-blur sm:p-8">
                <p className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl" style={{ color: p.accent }}>
                  {m.value}
                </p>
                <p className="mt-2 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-muted">{m.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="gutter mt-20 grid gap-12 md:grid-cols-[14rem_1fr] lg:gap-20">
          <aside className="hidden md:block">
            <div className="sticky top-28 space-y-6">
              <div>
                <p className="eyebrow">Stack</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <span key={t} className="rounded-full border border-border px-2.5 py-1 font-mono text-[0.72rem] text-fg/80">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="eyebrow">Year</p>
                <p className="mt-2 font-display text-2xl font-bold">{p.year}</p>
              </div>
            </div>
          </aside>

          <div className="max-w-3xl space-y-16">
            {sections
              .filter((s) => s.body && s.title !== "Architecture")
              .map((s, i) => (
                <FadeUp key={s.title}>
                  <section>
                    <p className="eyebrow">
                      ({String(i + 1).padStart(2, "0")}) {s.title}
                    </p>
                    <p className="mt-4 font-display text-2xl font-medium leading-snug tracking-tight text-fg/90 sm:text-3xl">
                      {s.body}
                    </p>
                  </section>
                </FadeUp>
              ))}

            {p.clients && p.clients.length > 0 && (
              <FadeUp>
                <section>
                  <p className="eyebrow">Built for</p>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {p.clients.map((c) => (
                      <li key={c.org} className="rounded-[1.25rem] border border-border bg-bg/70 p-5 backdrop-blur">
                        <p className="font-display text-2xl font-bold leading-tight">{c.org}</p>
                        <p className="mt-1 text-sm text-muted">{c.name}</p>
                        {c.quote && <p className="mt-3 text-fg/85">“{c.quote}”</p>}
                        {c.url && (
                          <a
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex min-h-11 items-center gap-1.5 font-mono text-[0.72rem] uppercase tracking-[0.15em] hover:text-accent"
                            style={{ color: p.accent }}
                            data-cursor="Visit"
                          >
                            Visit live site <ArrowUpRight className="h-4 w-4" />
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              </FadeUp>
            )}

            {flow.length > 1 && (
              <FadeUp>
                <section>
                  <p className="eyebrow">(04) Architecture</p>
                  <ol className="mt-6 space-y-3">
                    {flow.map((step, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <span
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-full font-mono text-xs font-bold text-ink"
                          style={{ background: p.accent }}
                        >
                          {i + 1}
                        </span>
                        <span className="rounded-xl border border-border bg-bg/70 px-4 py-2.5 font-mono text-sm leading-relaxed text-fg/85 backdrop-blur">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </section>
              </FadeUp>
            )}

            <div className="md:hidden">
              <p className="eyebrow">Stack</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.tech.map((t) => (
                  <span key={t} className="rounded-full border border-border px-2.5 py-1 font-mono text-[0.72rem] text-fg/80">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {lists
                .filter((l) => l.items.length > 0)
                .map((l) => (
                  <FadeUp key={l.title}>
                    <section className="h-full rounded-[1.25rem] border border-border bg-bg/70 p-6 backdrop-blur">
                      <h2 className="font-display text-xl font-bold">{l.title}</h2>
                      <ul className="mt-4 space-y-2.5">
                        {l.items.map((it) => (
                          <li key={it} className="flex gap-3 text-sm leading-relaxed text-fg/80">
                            <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0" style={{ color: p.accent }} />
                            {it}
                          </li>
                        ))}
                      </ul>
                    </section>
                  </FadeUp>
                ))}
            </div>
          </div>
        </div>

        <ProjectScreenshots images={p.images.slice(1)} accent={p.accent} slug={p.slug} />
      </article>

      {next && next.slug !== p.slug && (
        <Link
          href={`/project/${next.slug}`}
          className="group gutter relative mt-16 block overflow-hidden border-t border-border py-16 sm:py-24"
          data-cursor="Next"
        >
          <span
            className="absolute inset-0 origin-bottom scale-y-0 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-y-100"
            style={{ background: next.accent }}
          />
          <span className="relative block font-mono text-[0.72rem] uppercase tracking-[0.2em] text-muted group-hover:text-ink">
            Next project →
          </span>
          <span className="display-xl relative mt-4 flex items-center justify-between gap-6 text-[12vw] transition-colors group-hover:text-ink sm:text-[8vw]">
            {next.title}
            <ArrowUpRight className="h-[0.6em] w-[0.6em] shrink-0 transition-transform duration-500 group-hover:rotate-45" />
          </span>
        </Link>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </main>
  );
}
