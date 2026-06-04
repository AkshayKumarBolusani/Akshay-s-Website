"use client";

import { Download, FileText, Briefcase, Mail, MapPin, GraduationCap } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { site } from "@/lib/site";
import type { Profile } from "@/lib/data";

export function Recruiter({
  skills,
  resume,
  profile,
  projectCount,
}: {
  skills: Record<string, string[]>;
  resume: string | null;
  profile: Profile;
  projectCount: number;
}) {
  return (
    <section id="recruiters" className="section-pad relative mx-auto max-w-7xl">
      <div className="pointer-events-none absolute left-1/2 top-10 -z-10 h-64 w-[70%] -translate-x-1/2 rounded-full bg-accent-2/10 blur-[120px]" />
      <SectionHeading
        label="For Recruiters"
        title={
          <>
            The <span className="gradient-text">fast track</span>
          </>
        }
        description="Résumé, verified experience, stack, and contact — sourced from profile data on this site."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <div className="h-full rounded-2xl border border-border panel p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold">{site.name}</h3>
                <p className="mt-1 text-sm text-muted">{site.role}</p>
              </div>
              {resume ? (
                <a
                  href={resume}
                  download
                  className="inline-flex items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-sm font-semibold text-bg transition-transform hover:scale-105"
                >
                  <Download className="h-4 w-4" /> Download Résumé
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-border px-5 py-2.5 text-xs text-faint">
                  <FileText className="h-4 w-4" /> Add résumé to public/resume/
                </span>
              )}
            </div>

            <ul className="mt-6 space-y-4">
              {profile.experience.map((e) => (
                <li key={`${e.organization}-${e.period}`} className="flex gap-3">
                  <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-accent-2" />
                  <div>
                    <p className="text-sm font-medium">
                      {e.role} — {e.organization}
                    </p>
                    <p className="font-mono text-xs text-faint">{e.period}</p>
                    <p className="mt-1 text-sm text-muted">{e.description}</p>
                  </div>
                </li>
              ))}
              <li className="flex gap-3">
                <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-accent-2" />
                <div>
                  <p className="text-sm font-medium">{profile.education.degree}</p>
                  <p className="font-mono text-xs text-faint">
                    Graduated {profile.education.graduationYear}
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-accent-2" />
                <div>
                  <p className="text-sm font-medium">Portfolio on this site</p>
                  <p className="text-sm text-muted">
                    {projectCount} documented projects in the Project Universe and Labs
                    archive — AI/ML, full-stack, and research work from 2024–2026.
                  </p>
                </div>
              </li>
            </ul>

            <div className="mt-7 flex flex-wrap gap-4 border-t border-border pt-5 text-sm">
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-2 text-muted transition-colors hover:text-fg"
              >
                <Mail className="h-4 w-4" /> {site.email}
              </a>
              <span className="inline-flex items-center gap-2 text-muted">
                <MapPin className="h-4 w-4" /> {site.location}
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="h-full rounded-2xl border border-border panel p-5 sm:p-7">
            <h4 className="font-mono text-sm tracking-widest text-accent-2">
              STACK
            </h4>
            <div className="mt-5 space-y-5">
              {Object.entries(skills).map(([group, items]) => (
                <div key={group}>
                  <p className="text-xs font-medium text-muted">{group}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {items.map((s) => (
                      <span
                        key={s}
                        className="rounded-md bg-white/[0.05] px-2 py-1 font-mono text-[0.65rem] text-fg/90"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
