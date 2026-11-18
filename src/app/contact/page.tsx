import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/lib/site";
import { breadcrumbLd, pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { BriefBuilder } from "@/components/contact/BriefBuilder";
import { FadeUp, Magnetic, SplitReveal } from "@/components/ui/motion";

export const metadata: Metadata = pageMeta({
  title: "Contact — Hire or Collaborate",
  description:
    "Contact Akshay Kumar Bolusani for software engineering and AI/ML roles, freelance builds through ProjectKaro, or collaborations. Replies within a day.",
  path: "/contact",
});

const LINKS = [
  { label: "Email", value: site.email, href: `mailto:${site.email}` },
  { label: "LinkedIn", value: "in/akshaykumarbolusani", href: site.socials.linkedin },
  { label: "GitHub", value: "AkshayKumarBolusani", href: site.socials.github },
  { label: "Instagram", value: "@askforakshaykumar", href: site.socials.instagram },
  { label: "X / Twitter", value: "@akshay_bolusani", href: site.socials.twitter },
  { label: "Studio", value: "projectkaro.com", href: site.projectKaro.url },
];

export default function ContactPage() {
  return (
    <main className="gutter relative pb-24 pt-28 sm:pt-36">
      <JsonLd
        data={[
          breadcrumbLd([{ name: "Contact", path: "/contact" }]),
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: `Contact ${site.name}`,
            url: `${site.url}/contact`,
            mainEntity: { "@id": `${site.url}/#person` },
          },
        ]}
      />
      <p className="eyebrow flex items-center gap-2">
        <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-accent" /> Available — replies within a day
      </p>
      <h1 className="display-xl mt-4 text-[19vw] leading-[0.8] sm:text-[13vw]">
        <SplitReveal text="Let's" />
        <span className="block text-outline-accent">
          <SplitReveal text="talk." delay={0.12} />
        </span>
      </h1>

      <div className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <FadeUp>
          <BriefBuilder />
        </FadeUp>

        <div>
          <FadeUp delay={0.1}>
            <Magnetic>
              <a
                href={`mailto:${site.email}`}
                className="group inline-flex flex-col rounded-[1.5rem] bg-accent p-8 text-ink"
                data-cursor="Email"
              >
                <span className="font-mono text-[0.72rem] uppercase tracking-[0.2em]">Prefer it plain?</span>
                <span className="mt-3 font-display text-[clamp(1.05rem,1.9vw,1.6rem)] font-extrabold [overflow-wrap:anywhere]">{site.email}</span>
                <ArrowUpRight className="mt-6 h-8 w-8 transition-transform duration-500 group-hover:rotate-45" />
              </a>
            </Magnetic>
          </FadeUp>
          <ul className="mt-10 border-t border-border">
            {LINKS.map((l, i) => (
              <FadeUp key={l.label} delay={0.05 * i}>
                <li>
                  <a
                    href={l.href}
                    target={l.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between border-b border-border py-5"
                  >
                    <span className="min-w-0">
                      <span className="block font-mono text-[0.72rem] uppercase tracking-[0.2em] text-muted">{l.label}</span>
                      <span className="block font-display text-xl font-bold transition-[color,transform] duration-500 [overflow-wrap:anywhere] group-hover:translate-x-2 group-hover:text-accent">
                        {l.value}
                      </span>
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-muted transition-all duration-500 group-hover:rotate-45 group-hover:text-accent" />
                  </a>
                </li>
              </FadeUp>
            ))}
          </ul>
          <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-muted">
            {site.location} · IST (UTC+5:30) · {site.languages.join(" / ")}
          </p>
        </div>
      </div>
    </main>
  );
}
