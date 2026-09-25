import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Github } from "@/components/icons";
import { getProject, getProjectSlugs, getProjects } from "@/lib/data";
import { site } from "@/lib/site";
import { ProjectScreenshots } from "@/components/ProjectScreenshots";
import { Reveal } from "@/components/Reveal";

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
  const og = p.images[0] ?? site.image;
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
  const related = all.filter((x) => x.slug !== p.slug && x.featured).slice(0, 3);

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
    codeRepository: p.github,
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
        item: `${site.url}/#projects`,
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
      {
        "@type": "Question",
        name: `What problem does ${p.title} solve?`,
        acceptedAnswer: { "@type": "Answer", text: p.problem },
      },
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
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[60vh]"
        style={{
          background: `radial-gradient(60% 60% at 50% 0%, ${p.accent}26, transparent 70%)`,
        }}
      />

      <article className="mx-auto max-w-3xl px-4 pb-24 pt-[max(6.5rem,env(safe-area-inset-top,0px)+5rem)] sm:px-5 sm:pb-28 sm:pt-28">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-faint transition-colors hover:text-fg"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> BACK TO GALAXY
        </Link>

        <Reveal className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="rounded-full px-3 py-1 font-mono text-[0.65rem] tracking-widest"
              style={{ background: `${p.accent}22`, color: p.accent }}
            >
              {p.category.toUpperCase()}
            </span>
            <span className="font-mono text-xs tracking-widest text-faint">
              {p.year} · RANK #{p.rank}
            </span>
          </div>
          <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            {p.title}
          </h1>
          <p className="mt-4 text-balance text-lg text-muted">{p.tagline}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={p.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border panel px-4 py-2 text-sm transition-colors hover:border-faint"
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
          </div>
        </Reveal>

        {/* Metrics */}
        {p.metrics.length > 0 && (
          <Reveal className="mt-10">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {p.metrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl border border-border panel p-4"
                >
                  <div
                    className="text-lg font-semibold"
                    style={{ color: p.accent }}
                  >
                    {m.value}
                  </div>
                  <div className="mt-1 text-xs text-faint">{m.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {/* Screenshots */}
        <ProjectScreenshots images={p.images} accent={p.accent} slug={p.slug} />

        {/* Text sections */}
        <div className="mt-14 space-y-12">
          {sections.map((s) => (
            <Reveal key={s.title}>
              <section>
                <h2 className="section-label">{s.title}</h2>
                <p className="mt-3 text-balance leading-relaxed text-fg/85">
                  {s.body}
                </p>
              </section>
            </Reveal>
          ))}

          <Reveal>
            <section>
              <h2 className="section-label">Tech Stack</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-lg border border-border bg-white/[0.04] px-3 py-1.5 font-mono text-xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </section>
          </Reveal>

          {lists.map((l) => (
            <Reveal key={l.title}>
              <section>
                <h2 className="section-label">{l.title}</h2>
                <ul className="mt-4 space-y-2.5">
                  {l.items.map((it) => (
                    <li key={it} className="flex gap-3 text-fg/85">
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: p.accent }}
                      />
                      <span className="leading-relaxed">{it}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          ))}
        </div>

        {/* Related */}
        <div className="mt-20 border-t border-border pt-10">
          <h2 className="section-label mb-5">More from the galaxy</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/project/${r.slug}`}
                className="group rounded-xl border border-border panel p-4 transition-colors hover:border-faint"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: r.accent }}
                  />
                  <ArrowUpRight className="h-4 w-4 text-faint group-hover:text-fg" />
                </div>
                <p className="mt-3 text-sm font-semibold">{r.title}</p>
                <p className="mt-1 text-xs text-muted">{r.category}</p>
              </Link>
            ))}
          </div>
        </div>
      </article>

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
