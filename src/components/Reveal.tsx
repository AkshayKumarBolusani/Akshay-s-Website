"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);
  
  const mobileY = Math.min(y, 16);
  
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: isMobile ? mobileY : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ 
        duration: isMobile ? 0.4 : 0.6, 
        delay: isMobile ? Math.min(delay, 0.1) : delay, 
        ease: [0.25, 0.1, 0.25, 1] 
      }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  label,
  title,
  description,
  descriptionClassName,
}: {
  label: string;
  title: ReactNode;
  description?: string;
  descriptionClassName?: string;
}) {
  return (
    <Reveal className="mx-auto mb-10 max-w-3xl px-1 text-center sm:mb-14">
      <p className="section-label">{label}</p>
      <h2 className="mt-3 text-balance text-[1.75rem] font-semibold leading-tight tracking-tight sm:mt-4 sm:text-4xl md:text-5xl lg:text-6xl">
        {title}
      </h2>
      {description && (
        <p className={cn("mx-auto mt-4 max-w-2xl text-balance text-sm text-muted sm:mt-5 sm:text-base md:text-lg", descriptionClassName)}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
