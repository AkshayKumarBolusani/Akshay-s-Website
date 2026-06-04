"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  label,
  title,
  description,
}: {
  label: string;
  title: ReactNode;
  description?: string;
}) {
  return (
    <Reveal className="mx-auto mb-10 max-w-3xl px-1 text-center sm:mb-14">
      <p className="section-label">{label}</p>
      <h2 className="mt-3 text-balance text-[1.75rem] font-semibold leading-tight tracking-tight sm:mt-4 sm:text-4xl md:text-5xl lg:text-6xl">
        {title}
      </h2>
      {description && (
        <p className="mx-auto mt-4 max-w-2xl text-balance text-sm text-muted sm:mt-5 sm:text-base md:text-lg">
          {description}
        </p>
      )}
    </Reveal>
  );
}
