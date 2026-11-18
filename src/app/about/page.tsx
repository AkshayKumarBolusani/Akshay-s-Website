import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, Download } from "lucide-react";
import {
  getAchievements,
  getCertifications,
  getMediaImages,
  getProfile,
  getProfileImagePath,
  getResumeFile,
  getTimeline,
} from "@/lib/data";
import { site } from "@/lib/site";
import { breadcrumbLd, pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { FadeUp, FitText, SplitReveal, Tilt, VelocityMarquee } from "@/components/ui/motion";
import { Journey } from "@/components/home/Journey";
import { Wall } from "@/components/home/Wall";
import { Gallery } from "@/components/about/Gallery";

export const metadata: Metadata = pageMeta({
  title: "About — Experience, Education & Skills",
  description:
    "Akshay Kumar Bolusani: AI & Full-Stack Software Engineer in Hyderabad. Founder of ProjectKaro, ex-Digital Connect (100+ websites), B.Tech CSE (CGPA 8.97), PiCET 2026 paper.",
  path: "/about",
});

export default function AboutPage() {
  const profile = getProfile();
  const ach = getAchievements();
  const img = getProfileImagePath();
  const resume = getResumeFile();

  return (
    <main className="relative">
      <JsonLd
        data={[
          breadcrumbLd([{ name: "About", path: "/about" }]),
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: `About ${site.name}`,
            url: `${site.url}/about`,
            mainEntity: { "@id": `${site.url}/#person` },
          },
        ]}
      />
      {/* hero */}
      <section className="gutter grid gap-10 pt-28 sm:pt-36 lg:grid-cols-[1.25fr_1fr] lg:items-end">
        <div>
          <p className="eyebrow">About · Hyderabad, India</p>
          <h1 className="display-xl mt-4 text-[17vw] leading-[0.82] sm:text-[12vw] lg:text-[8.6vw]">
            <SplitReveal text="Hi, I'm" />
            <span className="block text-accent">
              <SplitReveal text="Akshay." delay={0.12} />
            </span>
          </h1>
          <FadeUp delay={0.2}>
            <p className="mt-8 max-w-xl font-display text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
              An AI &amp; full-stack software engineer who likes building things people can trust — and then actually shipping them.
            </p>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg/70">{site.bio}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {resume && (
                <a
                  href={resume}
                  download
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-display font-bold text-ink transition-transform hover:scale-105"
                  data-cursor="PDF"
                >
                  <Download className="h-4 w-4" /> Download résumé
                </a>
              )}
              <a
                href={site.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 font-display font-bold transition-colors hover:border-accent hover:text-accent"
              >
                LinkedIn <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </FadeUp>
        </div>
        {img && (
          <FadeUp delay={0.15}>
            <Tilt className="mx-auto max-w-sm rounded-[2rem]" max={8}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] border border-border bg-accent">
                <div className="dot-grid absolute inset-0 opacity-30" />
                <span className="display-xl absolute -left-2 top-4 text-[5.5rem] leading-none text-ink/15">AKB</span>
                <Image src={img} alt={`Portrait of ${site.name}`} fill sizes="(max-width: 1024px) 80vw, 24rem" className="object-contain object-bottom" />
              </div>
              <div className="absolute -bottom-4 -left-4 rotate-[-6deg] rounded-full bg-fg px-4 py-2 font-mono text-[0.72rem] font-bold uppercase tracking-[0.15em] text-ink">
                Open to work ✺
              </div>
            </Tilt>
          </FadeUp>
        )}
      </section>

      {/* experience */}
      <section className="section-pad">
        <p className="eyebrow">Experience</p>
        <SplitReveal as="h2" text="Where I've worked" className="display-xl mt-3 text-[12vw] sm:text-[7vw]" />
        <div className="mt-10 border-t border-border">
          {profile.experience.map((e) => (
            <FadeUp key={e.role + e.organization}>
              <article className="grid gap-4 border-b border-border py-10 md:grid-cols-[1fr_1.4fr_auto]">
                <div>
                  <h3 className="font-display text-3xl font-bold tracking-tight">{e.role}</h3>
                  <p className="mt-1 text-accent">{e.organization}</p>
                </div>
                <p className="max-w-xl text-fg/75">{e.description}</p>
                <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted md:text-right">{e.period}</p>
              </article>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* education */}
      {profile.educationList && (
        <section className="gutter">
          <p className="eyebrow">Education</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {profile.educationList.map((ed, i) => (
              <FadeUp key={ed.title} delay={i * 0.08}>
                <div className="group relative h-full overflow-hidden rounded-[1.5rem] border border-border bg-bg/80 p-8 backdrop-blur">
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">{ed.period}</p>
                  <h3 className="mt-4 font-display text-2xl font-bold leading-tight sm:text-3xl">{ed.title}</h3>
                  <p className="mt-1 text-fg/70">{ed.org}</p>
                  <FitText as="p" className="display-xl mt-8 text-6xl text-accent sm:text-7xl">{ed.score}</FitText>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>
      )}

      {/* skills */}
      <section className="mt-28">
        <div className="gutter">
          <p className="eyebrow">Toolbox</p>
          <SplitReveal as="h2" text="What I work with" className="display-xl mt-3 text-[12vw] sm:text-[7vw]" />
        </div>
        <div className="mt-10 space-y-3">
          {Object.entries(ach.skills).map(([group, items], i) => (
            <div key={group} className="border-y border-border bg-bg/60 py-4 backdrop-blur">
              <VelocityMarquee baseVelocity={i % 2 ? 1.4 : -1.4}>
                <span className="flex items-center gap-6 pr-6">
                  <span className="rounded-full bg-accent px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-ink">
                    {group}
                  </span>
                  {items.map((s) => (
                    <span key={s} className="flex items-center gap-6 font-display text-3xl font-bold uppercase tracking-tight sm:text-5xl">
                      {s} <span className="text-base text-accent">✺</span>
                    </span>
                  ))}
                </span>
              </VelocityMarquee>
            </div>
          ))}
        </div>
      </section>

      <Journey timeline={getTimeline()} label="Timeline" />

      <Wall certs={getCertifications()} highlights={profile.leadership ?? []} label="Recognition" />

      <section className="section-pad">
        <p className="eyebrow">Off the screen</p>
        <SplitReveal as="h2" text="Moments" className="display-xl mt-3 text-[14vw] sm:text-[8vw]" />
        <p className="mt-4 max-w-md text-muted">Events, hackathons, teams and the people who made the journey.</p>
        <div className="mt-10">
          <Gallery images={getMediaImages()} />
        </div>
      </section>
    </main>
  );
}
