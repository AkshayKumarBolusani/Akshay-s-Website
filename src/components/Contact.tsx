"use client";

import { Mail, MapPin, ArrowUpRight } from "lucide-react";
import { Github, Linkedin, Instagram } from "./icons";
import { Reveal } from "./Reveal";
import { site } from "@/lib/site";

const links = [
  { label: "Email", value: site.email, href: `mailto:${site.email}`, Icon: Mail },
  { label: "LinkedIn", value: "in/akshaykumarbolusani", href: site.socials.linkedin, Icon: Linkedin },
  { label: "GitHub", value: "AkshayKumarBolusani", href: site.socials.github, Icon: Github },
  { label: "Instagram", value: "@askforakshaykumar", href: site.socials.instagram, Icon: Instagram },
];

export function Contact() {
  return (
    <footer id="contact" className="relative overflow-hidden border-t border-border">
      <div className="pointer-events-none absolute bottom-[-30%] left-1/2 h-[60vh] w-[90vw] -translate-x-1/2 rounded-full bg-accent/15 blur-[120px]" />
      <div className="section-pad mx-auto max-w-7xl">
        <Reveal>
          <p className="section-label">Contact</p>
          <h2 className="mt-4 max-w-3xl text-balance text-[1.75rem] font-semibold leading-tight tracking-tight sm:text-4xl md:text-6xl">
            Let&apos;s build something <span className="gradient-text">unforgettable</span>.
          </h2>
          <p className="mt-5 max-w-xl text-muted">
            Open for collaborations, freelancing, and software / AI&nbsp;·&nbsp;ML
            opportunities. Based in {site.location} — working worldwide.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {links.map((l, i) => (
            <Reveal key={l.label} delay={i * 0.06}>
              <a
                href={l.href}
                target={l.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="group flex min-h-[3.5rem] items-center justify-between rounded-2xl border border-border panel p-5 transition-colors active:border-faint sm:hover:border-faint"
              >
                <div className="flex items-center gap-4">
                  <l.Icon className="h-5 w-5 text-accent-2" />
                  <div>
                    <p className="font-mono text-[0.65rem] tracking-widest text-faint">
                      {l.label.toUpperCase()}
                    </p>
                    <p className="text-sm font-medium">{l.value}</p>
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
              </a>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-sm text-faint sm:flex-row sm:items-center">
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4" /> {site.location}
          </span>
          <span className="font-mono text-xs">
            © {new Date().getFullYear()} {site.name} · {site.brand}
          </span>
        </div>
      </div>
    </footer>
  );
}
