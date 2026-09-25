"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Command, X } from "lucide-react";
import { nav, site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function CommandCenter() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = nav.map((n) => n.id);
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const router = useRouter();

  const go = (href: string) => {
    setOpen(false);
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(href);
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          "pt-[env(safe-area-inset-top,0px)]",
          scrolled
            ? "border-b border-border/50 bg-bg/80 py-2 backdrop-blur-xl sm:py-3"
            : "py-3 sm:py-4",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-5">
          <button
            type="button"
            onClick={() => go("#home")}
            className="touch-target group flex shrink-0 items-center gap-2 text-sm font-semibold tracking-tight"
            aria-label="Akshay Kumar Bolusani - Go to home"
          >
            <span className="grid h-8 w-8 place-items-center rounded-md bg-accent/15 text-accent ring-1 ring-accent/30 sm:h-7 sm:w-7">
              AK
            </span>
            <span className="hidden sm:inline">{site.name}</span>
          </button>

          <nav
            className={cn(
              "hidden items-center gap-1 rounded-full border border-border px-2 py-1.5 lg:flex",
              scrolled ? "panel" : "bg-transparent",
            )}
            aria-label="Primary"
          >
            {nav.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => go(n.href)}
                className={cn(
                  "touch-target relative rounded-full px-3.5 py-1.5 font-mono text-[0.7rem] tracking-widest transition-colors",
                  active === n.id ? "text-fg" : "text-faint hover:text-muted",
                )}
              >
                {active === n.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-white/[0.07]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {n.label}
              </button>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="touch-target flex shrink-0 items-center gap-2 rounded-full border border-border panel px-3.5 py-2.5 font-mono text-[0.7rem] tracking-widest text-muted transition-colors active:text-fg sm:hover:text-fg"
            aria-label="Open navigation menu"
            aria-expanded={open}
          >
            <Command className="h-4 w-4" />
            <span>MENU</span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:items-start sm:pt-[max(12vh,5rem)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-bg/90 backdrop-blur-md"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="panel relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-bg-soft/95 shadow-2xl"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-5">
                <span className="font-mono text-xs tracking-widest text-accent-2">
                  NAVIGATE
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="touch-target grid place-items-center rounded-lg"
                  aria-label="Close"
                >
                  <X className="h-5 w-5 text-muted" />
                </button>
              </div>
              <ul className="max-h-[70vh] overflow-y-auto overscroll-contain p-2">
                {nav.map((n, i) => (
                  <motion.li
                    key={n.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i }}
                  >
                    <button
                      type="button"
                      onClick={() => go(n.href)}
                      className="flex min-h-[3rem] w-full items-center justify-between rounded-xl px-4 py-3.5 text-left transition-colors active:bg-white/[0.08] sm:hover:bg-white/[0.05]"
                    >
                      <span className="text-base font-medium">{n.label}</span>
                      <span className="font-mono text-xs text-faint">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </button>
                  </motion.li>
                ))}
              </ul>
              <div className="border-t border-border px-4 py-3 text-center">
                <span className="font-mono text-[0.65rem] tracking-widest text-faint">
                  Press ESC or tap outside to close
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
