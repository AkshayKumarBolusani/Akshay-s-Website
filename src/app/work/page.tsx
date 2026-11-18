import type { Metadata } from "next";
import { getProjects } from "@/lib/data";
import { site } from "@/lib/site";
import { breadcrumbLd, pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { WorkGrid } from "@/components/work/WorkGrid";
import { SplitReveal } from "@/components/ui/motion";

export const metadata: Metadata = pageMeta({
  title: "Work — AI, Research, Security & Full-Stack Projects",
  description:
    "Every project by Akshay Kumar Bolusani: local-first RAG (Cognora AI), GST invoice intelligence, healthcare computer vision, quantum ML research, a SOC lab and full-stack products.",
  path: "/work",
});

export default function WorkPage() {
  const projects = getProjects();
  const items = projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    tagline: p.tagline,
    category: p.category,
    year: p.year,
    accent: p.accent,
    tech: p.tech,
    featured: p.featured,
    image: p.images[0],
  }));
  const years = projects.map((p) => Number(p.year)).filter(Boolean);

  return (
    <main className="gutter relative pb-24 pt-28 sm:pt-36">
      <JsonLd
        data={[
          breadcrumbLd([{ name: "Work", path: "/work" }]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `Work by ${site.name}`,
            url: `${site.url}/work`,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: projects.length,
              itemListElement: projects.map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `${site.url}/project/${p.slug}`,
                name: p.title,
              })),
            },
          },
        ]}
      />
      <p className="eyebrow">Archive · {Math.min(...years)}—{Math.max(...years)}</p>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
        <h1 className="display-xl max-w-full min-w-0 text-[22vw] leading-[0.8] sm:text-[16vw]">
          <SplitReveal text="Work" />
        </h1>
        <p className="mb-3 max-w-sm text-lg text-fg/75">
          <span className="font-display text-5xl font-extrabold text-accent">{projects.length}</span> projects across AI,
          research, security and full-stack. Filter them, flip the view, open any one for the full case study.
        </p>
      </div>
      <div className="mt-12">
        <WorkGrid items={items} />
      </div>
    </main>
  );
}
