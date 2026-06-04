"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Briefcase, Code2, Rocket, Users } from "lucide-react";
import { SectionHeading, Reveal } from "./Reveal";
import type { ProjectKaroData } from "@/lib/data";

const serviceIcons: Record<string, typeof Code2> = {
  "Website Development": Code2,
  "Personal Portfolio Websites": Users,
  "Full Stack Applications": Rocket,
  "AI Solutions": Briefcase,
  "Student Major Projects": Briefcase,
  "Student Minor Projects": Briefcase,
  "Research Projects": Briefcase,
  "Startup MVP Development": Rocket,
  "Business Websites": Code2,
  "Technical Consulting": Users,
};

export function ProjectKaro({ data }: { data: ProjectKaroData }) {
  return (
    <section id="projectkaro" className="section-pad relative mx-auto max-w-7xl">
      <SectionHeading
        label="Building Through"
        title={
          <>
            <span className="gradient-text">ProjectKaro</span>
          </>
        }
        description={data.description}
      />

      {/* Services Grid */}
      <Reveal>
        <div className="mb-16">
          <h3 className="mb-6 text-center font-mono text-xs uppercase tracking-widest text-faint">
            Services Offered
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {data.services.map((service, i) => {
              const Icon = serviceIcons[service] || Briefcase;
              return (
                <motion.div
                  key={service}
                  className="group relative flex flex-col items-center gap-2 rounded-xl border border-border bg-white/[0.02] p-4 text-center transition-colors hover:border-accent/30 hover:bg-white/[0.04]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Icon className="h-5 w-5 text-accent/70 transition-colors group-hover:text-accent" />
                  <span className="text-xs font-medium leading-tight text-muted transition-colors group-hover:text-fg">
                    {service}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* Process Section */}
      <Reveal delay={0.1}>
        <div className="mb-16">
          <h3 className="mb-8 text-center font-mono text-xs uppercase tracking-widest text-faint">
            The Process
          </h3>
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-1/2 top-6 hidden h-[calc(100%-3rem)] w-px -translate-x-1/2 bg-gradient-to-b from-accent/50 via-accent/20 to-transparent md:block" />
            
            <div className="grid gap-6 md:grid-cols-5">
              {data.process.map((step, i) => (
                <motion.div
                  key={step.step}
                  className="group relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="relative z-10 mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-accent/30 bg-bg text-accent transition-all group-hover:border-accent group-hover:shadow-lg group-hover:shadow-accent/10">
                      <span className="font-mono text-sm font-bold">{step.step}</span>
                    </div>
                    <h4 className="mb-1 text-sm font-semibold">{step.title}</h4>
                    <p className="text-xs leading-relaxed text-muted">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Impact & CTA */}
      <Reveal delay={0.2}>
        <div className="rounded-2xl border border-border bg-gradient-to-br from-white/[0.03] to-transparent p-6 sm:p-8 md:p-10">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h3 className="mb-4 text-xl font-bold sm:text-2xl">
                Ready to build something{" "}
                <span className="gradient-text">amazing</span>?
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-muted">
                Whether you need a stunning portfolio, a full-stack application, an AI solution, 
                or help with your academic project — ProjectKaro is here to turn your ideas into reality.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-bg transition-transform hover:scale-105 active:scale-95"
                >
                  Visit ProjectKaro
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <a
                  href={`${data.url}/contact`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:border-accent/50 hover:bg-white/[0.03]"
                >
                  Start a Project
                </a>
                <a
                  href="#contact"
                  className="touch-target inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:border-accent/50 hover:bg-white/[0.03]"
                >
                  Work With Me
                </a>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {data.impact.map((item, i) => (
                <motion.div
                  key={item.label}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div className="mb-1 text-2xl font-bold text-accent sm:text-3xl">
                    {i === 0 ? "✓" : i === 1 ? "★" : "◆"}
                  </div>
                  <div className="text-xs font-semibold sm:text-sm">{item.label}</div>
                  <div className="mt-1 text-[10px] text-muted sm:text-xs">
                    {item.note}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.3} className="mt-8 text-center">
        <p className="font-mono text-xs tracking-wide text-faint">
          ProjectKaro · Professional services for technical solutions
        </p>
      </Reveal>
    </section>
  );
}
