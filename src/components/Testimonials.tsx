"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Reveal } from "./Reveal";
import type { Testimonial } from "@/lib/data";
import { cn } from "@/lib/utils";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < rating ? "fill-amber-400 text-amber-400" : "text-border"
          )}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial, isActive }: { testimonial: Testimonial; isActive: boolean }) {
  const initials = testimonial.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isActive ? 1 : 0.5, scale: isActive ? 1 : 0.95 }}
      className={cn(
        "rounded-2xl border border-border bg-white/[0.02] p-6 transition-all duration-300 sm:p-8",
        isActive && "border-accent/30 bg-white/[0.04] shadow-lg shadow-accent/5"
      )}
    >
      <div className="flex items-start justify-between">
        <StarRating rating={testimonial.rating} />
        <Quote className="h-8 w-8 text-accent/20" />
      </div>

      <p className="mt-5 text-pretty leading-relaxed text-fg/90">
        &ldquo;{testimonial.content}&rdquo;
      </p>

      <div className="mt-6 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-accent-2/20 font-semibold text-fg">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-fg">{testimonial.name}</p>
          <p className="text-sm text-muted">
            {testimonial.role}, {testimonial.company}
          </p>
        </div>
      </div>

      {testimonial.projectRef && (
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.02] px-3 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-2" />
          <span className="font-mono text-[0.65rem] tracking-wider text-muted">
            PROJECT: {testimonial.projectRef.toUpperCase().replace(/-/g, " ")}
          </span>
        </div>
      )}
    </motion.div>
  );
}

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((i) => (i + 1) % testimonials.length);
  const prev = () => setCurrentIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="section-pad border-t border-border">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="section-label">Testimonials</p>
          <h2 className="mt-4 max-w-2xl text-balance text-[1.75rem] font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            What <span className="gradient-text">clients say</span>
          </h2>
          <p className="mt-4 max-w-xl text-muted">
            Feedback from clients and collaborators across different projects and industries.
          </p>
        </Reveal>

        <div className="mt-12">
          {/* Desktop Grid */}
          <div className="hidden gap-6 lg:grid lg:grid-cols-3">
            {testimonials.slice(0, 6).map((t, i) => (
              <Reveal key={t.id} delay={i * 0.1}>
                <TestimonialCard testimonial={t} isActive={true} />
              </Reveal>
            ))}
          </div>

          {/* Mobile/Tablet Carousel */}
          <div className="lg:hidden">
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <TestimonialCard
                    testimonial={testimonials[currentIndex]}
                    isActive={true}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={prev}
                className="grid h-10 w-10 place-items-center rounded-full border border-border transition-colors hover:border-accent/40 hover:bg-white/[0.04]"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex gap-1">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className="flex h-11 w-11 items-center justify-center"
                    aria-label={`Go to testimonial ${i + 1}`}
                  >
                    <span
                      className={cn(
                        "block h-2 rounded-full transition-all",
                        i === currentIndex
                          ? "w-6 bg-accent"
                          : "w-2 bg-border hover:bg-muted"
                      )}
                    />
                  </button>
                ))}
              </div>

              <button
                onClick={next}
                className="grid h-10 w-10 place-items-center rounded-full border border-border transition-colors hover:border-accent/40 hover:bg-white/[0.04]"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
