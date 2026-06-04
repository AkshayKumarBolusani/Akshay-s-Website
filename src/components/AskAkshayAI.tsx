"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, Send, ArrowUpRight } from "lucide-react";
import { search, type SearchIndex, type SearchDoc } from "@/lib/search";
import { cn } from "@/lib/utils";

type Msg = {
  role: "user" | "ai";
  text: string;
  projects?: SearchDoc[];
};

const SUGGESTIONS = [
  "What projects has Akshay built?",
  "Tell me about SkinCare AI",
  "How many websites has Akshay developed?",
  "What AI/ML work has he done?",
];

export function AskAkshayAI({ index }: { index: SearchIndex }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "ai",
      text: "Hi — I'm Akshay AI. Ask me anything about Akshay's projects, websites, experience, or how to get in touch.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const ask = (q: string) => {
    const query = q.trim();
    if (!query) return;
    const res = search(index, query);
    setMessages((m) => [
      ...m,
      { role: "user", text: query },
      { role: "ai", text: res.answer, projects: res.projects },
    ]);
    setInput("");
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  };

  const handleClose = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
        return;
      }

      if (e.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusableElements = dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    inputRef.current?.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.button
        ref={triggerRef}
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2 }}
        className={cn(
          "fixed z-[80] flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full bg-fg px-4 py-3 text-sm font-semibold text-bg shadow-lg shadow-accent/20 transition-transform active:scale-95 sm:hover:scale-105",
          "bottom-[max(1rem,env(safe-area-inset-bottom,0px))] right-[max(1rem,env(safe-area-inset-right,0px))]",
          open && "pointer-events-none opacity-0",
        )}
        aria-label="Ask Akshay AI"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Sparkles className="h-4 w-4 shrink-0" />
        <span className="truncate">Ask Akshay AI</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[84] bg-bg/50 backdrop-blur-sm"
              onClick={handleClose}
              aria-hidden="true"
            />
            <motion.div
              ref={dialogRef}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed z-[85] flex max-h-[min(90dvh,36rem)] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-bg-soft/95 backdrop-blur-xl sm:rounded-3xl"
              style={{
                bottom: "max(1rem, env(safe-area-inset-bottom, 0px))",
                right: "max(1rem, env(safe-area-inset-right, 0px))",
                left: "max(1rem, env(safe-area-inset-left, 0px))",
                marginLeft: "auto",
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Akshay AI assistant"
            >
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-accent/15 text-accent">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Akshay AI</p>
                    <p className="font-mono text-[0.6rem] tracking-widest text-faint">
                      LOCAL · NO LLM COST
                    </p>
                  </div>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={handleClose}
                  className="touch-target grid place-items-center rounded-lg transition-colors hover:bg-white/5"
                  aria-label="Close assistant"
                >
                  <X className="h-5 w-5 text-muted" />
                </button>
              </div>

              <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm",
                      m.role === "user"
                        ? "ml-auto bg-accent/20 text-fg"
                        : "bg-white/[0.05] text-fg/90",
                    )}
                  >
                    <p>{m.text}</p>
                    {m.projects && m.projects.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        {m.projects.map((p) => (
                          <Link
                            key={p.slug}
                            href={`/project/${p.slug}`}
                            onClick={handleClose}
                            className="flex items-center justify-between rounded-lg border border-border bg-bg/60 px-2.5 py-1.5 text-xs transition-colors hover:border-faint"
                          >
                            <span className="truncate">{p.title}</span>
                            <ArrowUpRight className="h-3 w-3 shrink-0 text-faint" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {messages.length <= 1 && (
                  <div className="space-y-1.5 pt-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => ask(s)}
                        className="touch-target block w-full rounded-lg border border-border px-3 py-3 text-left text-xs text-muted transition-colors active:border-faint active:text-fg sm:py-2 sm:hover:border-faint sm:hover:text-fg"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  ask(input);
                }}
                className="flex items-center gap-2 border-t border-border p-3"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Akshay…"
                  aria-label="Ask a question"
                  className="flex-1 rounded-full border border-border bg-bg px-4 py-2.5 text-sm outline-none placeholder:text-faint focus:border-accent/50"
                />
                <button
                  type="submit"
                  aria-label="Send"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-fg text-bg transition-transform hover:scale-105"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
