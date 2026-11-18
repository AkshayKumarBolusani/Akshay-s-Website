"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const NEEDS = ["Full-time role", "AI / RAG system", "Website", "Full-stack app", "Startup MVP", "Research project", "Collaboration", "Just saying hi"];
const TIMES = ["ASAP", "This month", "This quarter", "Flexible"];

/**
 * Lets visitors compose a brief by tapping chips, then send it. There is no mail server behind this site,
 * so it offers three ways that work on any device: Gmail in the browser, the visitor's own mail app,
 * or copying the text to send from anywhere.
 */
export function BriefBuilder() {
  const [needs, setNeeds] = useState<string[]>([]);
  const [time, setTime] = useState<string>("Flexible");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const toggle = (n: string) => setNeeds((v) => (v.includes(n) ? v.filter((x) => x !== n) : [...v, n]));
  const subject = `${needs[0] ?? "Hello"} — from ${name || "your website"}`;
  const body = [
    `Hi Akshay,`,
    ``,
    needs.length ? `I'm reaching out about: ${needs.join(", ")}.` : "",
    `Timeline: ${time}.`,
    ``,
    msg,
    ``,
    name ? `— ${name}` : "",
  ]
    .filter((l, i, a) => !(l === "" && a[i - 1] === ""))
    .join("\n");
  const q = `subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const mailtoHref = `mailto:${site.email}?${q}`;
  const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(site.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const ready = needs.length > 0 || msg.trim().length > 0;

  const copy = async () => {
    const text = `To: ${site.email}\nSubject: ${subject}\n\n${body}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // older browsers / insecure context: fall back to a hidden textarea
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const primary =
    "group inline-flex min-h-12 items-center gap-3 rounded-full bg-accent px-7 py-3.5 font-display text-lg font-bold text-ink transition-transform hover:scale-105";
  const secondary =
    "inline-flex min-h-12 items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium transition-colors hover:border-accent hover:text-accent";
  const off = "pointer-events-none opacity-40";

  return (
    <div className="rounded-[1.75rem] border border-border bg-bg/85 p-6 backdrop-blur-xl sm:p-10">
      <p className="eyebrow">Build your brief — 30 seconds</p>

      <fieldset className="mt-6">
        <legend className="font-display text-2xl font-bold">1. What are you after?</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {NEEDS.map((n) => {
            const on = needs.includes(n);
            return (
              <motion.button
                key={n}
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={() => toggle(n)}
                aria-pressed={on}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-colors",
                  on ? "border-accent bg-accent text-ink" : "border-border text-fg/80 hover:border-fg/50",
                )}
              >
                {on && <Check className="h-3.5 w-3.5" />}
                {n}
              </motion.button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className="font-display text-2xl font-bold">2. When?</legend>
        <div className="mt-4 inline-flex flex-wrap gap-1 rounded-full border border-border p-1">
          {TIMES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTime(t)}
              aria-pressed={time === t}
              className={cn("min-h-11 rounded-full px-4 py-2 text-sm transition-colors", time === t ? "bg-fg text-ink" : "text-muted hover:text-fg")}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_2fr]">
        <label className="block">
          <span className="font-display text-2xl font-bold">3. You are</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="mt-3 w-full border-b border-border bg-transparent py-3 text-lg outline-none transition-colors placeholder:text-faint focus:border-accent"
          />
        </label>
        <label className="block">
          <span className="font-display text-2xl font-bold">4. Anything else?</span>
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            rows={2}
            placeholder="A line or two about the idea, role or problem"
            className="mt-3 w-full resize-none border-b border-border bg-transparent py-3 text-lg outline-none transition-colors placeholder:text-faint focus:border-accent"
          />
        </label>
      </div>

      <div className="mt-10">
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={gmailHref}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(primary, !ready && off)}
            aria-disabled={!ready}
            data-cursor="Send"
          >
            Send with Gmail <ArrowUpRight className="h-5 w-5 transition-transform group-hover:rotate-45" />
          </a>
          <a href={mailtoHref} className={cn(secondary, !ready && off)} aria-disabled={!ready}>
            Use my email app
          </a>
          <button type="button" onClick={copy} disabled={!ready} className={cn(secondary, !ready && off)}>
            {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy brief"}
          </button>
        </div>
        <p className="mt-4 max-w-xl text-sm text-muted" role="status" aria-live="polite">
          {ready
            ? `Gmail opens in a new tab with everything filled in. No Gmail? Copy the brief and send it to ${site.email} from any app. Nothing is stored on this site.`
            : "Pick at least one option above, or write a line, to unlock the send buttons."}
        </p>
      </div>
    </div>
  );
}
