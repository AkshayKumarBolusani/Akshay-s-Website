"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { AnimatePresence, motion } from "framer-motion";
import { nav, site } from "@/lib/site";
import { cn } from "@/lib/utils";

function useClock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const f = () =>
      setT(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Kolkata",
        }).format(new Date()),
      );
    f();
    const id = setInterval(f, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();
  const clock = useClock();
  const lenis = useLenis();
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  // lock page scroll while the menu is open, then hand focus to the first link / back to the toggle
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const t = setTimeout(() => menu.current?.querySelector<HTMLElement>("a")?.focus(), 350);
    const btn = toggle.current;
    return () => {
      clearTimeout(t);
      lenis?.start();
      btn?.focus({ preventScroll: true });
    };
  }, [open, lenis]);

  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      setHidden(y > 160 && y > last);
      last = y;
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  return (
    <>
      <header
        className={cn(
          "gutter fixed inset-x-0 top-0 z-[120] flex items-center justify-between py-4 mix-blend-difference transition-transform duration-500 ease-[var(--ease-out-expo)] sm:py-5",
          hidden && !open && "-translate-y-full",
        )}
      >
        <Link href="/" className="group flex min-h-11 items-center gap-2 text-white" data-cursor="Home">
          <span className="font-display text-xl font-extrabold tracking-tight">AKB</span>
          <span className="font-mono text-[0.72rem] text-white/70 transition-transform group-hover:rotate-180">©</span>
        </Link>

        <div className="hidden items-center gap-8 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-white/80 md:flex">
          <span>Hyderabad, IN</span>
          <span className="tabular-nums">{clock} IST</span>
        </div>

        <button
          ref={toggle}
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="site-menu"
          className="touch-target group flex items-center gap-3 text-white"
          data-cursor={open ? "Close" : "Menu"}
        >
          <span className="hidden font-mono text-[0.7rem] uppercase tracking-[0.2em] sm:inline">
            {open ? "Close" : "Menu"}
          </span>
          <span className="relative block h-3 w-8">
            <span
              className={cn(
                "absolute left-0 top-0 h-[2px] w-full bg-white transition-transform duration-500",
                open && "translate-y-[5px] rotate-45",
              )}
            />
            <span
              className={cn(
                "absolute bottom-0 left-0 h-[2px] w-full bg-white transition-transform duration-500",
                open && "-translate-y-[5px] -rotate-45",
              )}
            />
          </span>
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            ref={menu}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-[110] flex flex-col bg-accent text-ink"
            initial={{ clipPath: "circle(0% at calc(100% - 3rem) 2.5rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 3rem) 2.5rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 3rem) 2.5rem)" }}
            transition={{ duration: 0.8, ease: [0.85, 0, 0.15, 1] }}
            data-lenis-prevent
          >
            <nav className="gutter flex flex-1 flex-col justify-center pt-20">
              {nav.map((item, i) => {
                const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <div key={item.id} className="overflow-hidden border-b border-ink/15">
                    <motion.div
                      initial={{ y: "110%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "110%" }}
                      transition={{ duration: 0.7, delay: 0.15 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="group flex items-baseline gap-4 py-1 sm:gap-8"
                        data-cursor="Go"
                      >
                        <span className="font-mono text-xs">0{i + 1}</span>
                        <span
                          className={cn(
                            "display-xl text-[10.5vw] transition-[letter-spacing,transform] duration-500 group-hover:translate-x-4 group-hover:tracking-[-0.01em] sm:text-[8vw] md:text-[6.5vw]",
                            active && "italic",
                          )}
                        >
                          {item.label}
                        </span>
                        {active && <span className="ml-auto font-mono text-xs">● you are here</span>}
                      </Link>
                    </motion.div>
                  </div>
                );
              })}
            </nav>
            <div className="gutter flex flex-wrap justify-between gap-4 py-6 font-mono text-xs uppercase tracking-[0.18em]">
              <a href={`mailto:${site.email}`} className="underline-offset-4 hover:underline">
                {site.email}
              </a>
              <div className="flex gap-6">
                <a href={site.socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
                <a href={site.socials.github} target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
                <a href={site.socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a>
                <a href={site.socials.twitter} target="_blank" rel="noopener noreferrer" className="hover:underline">X</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
