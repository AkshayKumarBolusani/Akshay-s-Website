import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Cover visual for a project. Uses the first screenshot when one exists,
 * otherwise renders a generative poster from the project's accent + monogram.
 */
export function ProjectArt({
  title,
  accent,
  image,
  index,
  className,
  sizes = "(max-width: 768px) 90vw, 50vw",
}: {
  title: string;
  accent: string;
  image?: string;
  index: number;
  className?: string;
  sizes?: string;
}) {
  const mono = title
    .replace(/[^A-Za-z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const variant = index % 4;

  return (
    <div className={cn("relative overflow-hidden bg-bg-soft", className)} style={{ ["--a" as string]: accent }}>
      {image ? (
        <>
          <Image
            src={image}
            alt={`${title} screenshot`}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/10 to-transparent" />
        </>
      ) : (
        <>
          <div
            className="absolute inset-0"
            style={{
              background:
                variant === 0
                  ? `radial-gradient(circle at 30% 30%, ${accent} 0%, transparent 45%), radial-gradient(circle at 80% 90%, ${accent}55 0%, transparent 50%), #0b0b0d`
                  : variant === 1
                    ? `conic-gradient(from 210deg at 70% 40%, ${accent}, #0b0b0d 30%, ${accent}66 55%, #0b0b0d 80%)`
                    : variant === 2
                      ? `linear-gradient(135deg, #0b0b0d 0%, #0b0b0d 45%, ${accent} 45%, ${accent} 55%, #0b0b0d 55%)`
                      : `repeating-radial-gradient(circle at 50% 120%, ${accent}aa 0 2px, transparent 2px 22px), #0b0b0d`,
            }}
          />
          <div className="dot-grid absolute inset-0 opacity-40" />
          <span
            className="display-xl absolute -bottom-[0.12em] -right-[0.04em] select-none text-[11rem] leading-none transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-3 sm:text-[15rem]"
            style={{ color: "transparent", WebkitTextStroke: `2px ${accent}` }}
            aria-hidden
          >
            {mono}
          </span>
        </>
      )}
    </div>
  );
}
