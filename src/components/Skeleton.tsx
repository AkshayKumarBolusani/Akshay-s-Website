"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "card";
}

export function Skeleton({ className, variant = "rectangular" }: SkeletonProps) {
  const baseClasses =
    "animate-pulse bg-gradient-to-r from-white/[0.04] via-white/[0.08] to-white/[0.04] bg-[length:200%_100%]";

  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
    card: "rounded-2xl",
  };

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      aria-hidden="true"
    />
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-white/[0.02] p-4">
      <div className="flex items-start justify-between">
        <Skeleton className="h-3 w-3 rounded-full" variant="circular" />
        <Skeleton className="h-4 w-16" variant="text" />
      </div>
      <Skeleton className="mt-4 h-5 w-3/4" variant="text" />
      <Skeleton className="mt-2 h-4 w-full" variant="text" />
      <Skeleton className="mt-1 h-4 w-2/3" variant="text" />
      <div className="mt-4 flex flex-wrap gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
    </div>
  );
}

export function ImageSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-white/[0.02]",
        className
      )}
    >
      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="group rounded-2xl border border-border bg-white/[0.02] overflow-hidden">
      <Skeleton className="aspect-[16/9] w-full rounded-none" variant="rectangular" />
      <div className="p-5">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-24" variant="text" />
        </div>
        <Skeleton className="mt-3 h-6 w-full" variant="text" />
        <Skeleton className="mt-2 h-4 w-full" variant="text" />
        <Skeleton className="mt-1 h-4 w-3/4" variant="text" />
        <div className="mt-4 flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" variant="circular" />
          <div>
            <Skeleton className="h-4 w-24" variant="text" />
            <Skeleton className="mt-1 h-3 w-16" variant="text" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TestimonialSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-white/[0.02] p-6">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-4 w-4" variant="circular" />
        ))}
      </div>
      <Skeleton className="mt-4 h-4 w-full" variant="text" />
      <Skeleton className="mt-2 h-4 w-full" variant="text" />
      <Skeleton className="mt-2 h-4 w-2/3" variant="text" />
      <div className="mt-6 flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" variant="circular" />
        <div>
          <Skeleton className="h-4 w-28" variant="text" />
          <Skeleton className="mt-1 h-3 w-36" variant="text" />
        </div>
      </div>
    </div>
  );
}
