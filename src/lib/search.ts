import type { Achievements, Profile } from "./data";
import { site } from "./site";

export type SearchDoc = {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  domains: string[];
  tech: string[];
  description: string;
  metrics: { label: string; value: string }[];
  featured?: boolean;
  clients?: { name: string; org: string }[];
};

export type SearchIndex = {
  docs: SearchDoc[];
  // `chips` picks which project links appear under an answer: a group name or "slug:<project-slug>"
  facts: { q: string[]; a: string; chips?: string }[];
};

const STOP = new Set([
  "the", "a", "an", "is", "are", "of", "to", "and", "for", "in", "on",
  "what", "how", "many", "about", "tell", "me", "has", "have", "did",
  "does", "akshay", "you", "your", "with", "built", "build", "projects",
  "project", "which", "show", "list", "can", "i", "do", "my", "it", "any",
]);

export function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

const list = (items: string[]) =>
  items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

/**
 * The assistant answers in my voice ("I", "my") from facts that live in the site data, so it stays
 * in step with the rest of the site. Add a fact here and it becomes answerable.
 */
export function buildSearchIndex(docs: SearchDoc[], _ach: Achievements, profile: Profile): SearchIndex {
  void _ach;
  const total = docs.length;
  const flagship = docs.filter((d) => d.featured).slice(0, 4).map((d) => d.title);
  const siteClients = docs
    .filter((d) => d.category === "Website Development" || d.slug === "projectkaro")
    .flatMap((d) => (d.clients ?? []).map((c) => c.org));
  const otherClients = docs
    .filter((d) => d.category !== "Website Development" && d.slug !== "projectkaro")
    .flatMap((d) => (d.clients ?? []).map((c) => c.org));
  const pk = profile.projectKaro;
  const g = profile.gopyata;
  const edu = profile.educationList ?? [];
  const grad = edu[0];

  const facts: { q: string[]; a: string; chips?: string }[] = [
    {
      q: ["who are you", "about you", "introduce yourself", "tell me about yourself", "who is akshay", "about akshay", "who am i talking"],
      a: `I'm Akshay Kumar Bolusani, an AI and full-stack software engineer from Hyderabad. I build applied AI that people can check, I founded ProjectKaro and Gopyata, and I've shipped 60+ projects and 100+ websites for real clients.`,
    },
    {
      q: ["what have you built", "what do you build", "what projects", "your projects", "your work", "show me your work", "portfolio", "how many projects", "number of projects", "total projects"],
      chips: "featured",
      a: `I've shipped 60+ projects, and this site shows ${total} of them in detail. The ones I'd start with are ${list(flagship)}. The Work page has all of them, with filters.`,
    },
    {
      q: ["how many websites", "websites you", "websites built", "websites developed", "number of websites", "web development", "built websites", "built any websites"],
      chips: "websites",
      a: `I've built 100+ websites for clients in healthcare, education, real estate and business.${siteClients.length ? ` Recent ones include ${list(siteClients)}.` : ""} Most are WordPress or custom builds.`,
    },
    {
      q: ["digital connect", "internship", "work experience", "where do you work", "your experience", "your job", "current role"],
      a: `I'm the founder of ProjectKaro. Before that I was a web development intern at ${profile.digitalConnect.company} from Aug 2023 to Jan 2026, where I built and maintained 100+ responsive websites and worked directly with clients from requirements to support.`,
    },
    {
      q: ["education", "degree", "college", "university", "cgpa", "b.tech", "btech", "graduated", "where did you study", "marks"],
      a: grad
        ? `I did my ${grad.title} at ${grad.org} (${grad.period}) with a CGPA of 8.97. Before that I did Intermediate (MPC) at Sri Chaitanya Junior Kalasala and scored 975/1000.`
        : `I did my B.Tech in Computer Science and Engineering at Malla Reddy University, Hyderabad (2022 to 2026).`,
    },
    {
      q: ["contact", "email", "hire you", "hire me", "reach you", "get in touch", "talk to you", "linkedin", "github", "twitter", "instagram"],
      a: `You can email me at ${site.email}, or find me on LinkedIn (in/akshaykumarbolusani), GitHub (AkshayKumarBolusani), X (@akshay_bolusani) and Instagram (@askforakshaykumar). The Contact page has a short form that writes the email for you. I'm open to software and AI/ML roles, freelance builds and collaborations.`,
    },
    {
      q: ["ai projects", "machine learning", "ml projects", "ai work", "your ai", "rag", "llm", "deep learning", "computer vision"],
      chips: "ai",
      a: `My recent AI work: Cognora AI (document Q&A that shows the exact page behind every answer), India Invoice AI (GST invoice checks before filing) and SkinCare AI (skin lesion detection with DINOv2 and ResNet50). I also built a pharma compliance agent and a hybrid quantum GAN for drug discovery.`,
    },
    {
      q: ["security", "cyber", "soc lab", "wazuh", "siem", "phishing", "mitre"],
      chips: "security",
      a: `On the security side I built an Enterprise SOC Lab with Wazuh, Elastic Stack and Suricata mapped to MITRE ATT&CK, and PhishGuard AI, an explainable phishing detector for URLs, emails and websites.`,
    },
    {
      q: ["shapeshift", "file converter", "mac app", "macos", "menu bar"],
      chips: "slug:shapeshift",
      a: `Shapeshift is a free, open-source file converter for macOS that I built in Swift. You drag a file, tap a key, and drop it on a wedge of a wheel to convert it or run a tool on it. It works fully offline. You can download it from the project page.`,
    },
    {
      q: ["projectkaro", "project karo", "your studio", "your company", "your team", "services", "freelance", "client work", "consulting", "startup mvp"],
      chips: "slug:projectkaro",
      a: pk
        ? `ProjectKaro is the software studio I founded in January 2024. I lead a team of 23 and we build websites, AI solutions, full-stack apps, startup MVPs, and student and research projects. Start at ${pk.url}.`
        : `I run ProjectKaro, a software studio. Email me at ${site.email} to start a project.`,
    },
    {
      q: ["gopyata", "dpdp", "data protection", "privacy", "readiness report", "your startup", "founder"],
      a: g
        ? `I founded Gopyata (${g.url}). It helps Indian businesses get ready for the DPDP data-protection law with a free readiness report, hands-on setup and monthly care. It is a readiness aid, not legal advice or a compliance guarantee.`
        : `I founded ProjectKaro and I'm building Gopyata.`,
    },
    {
      q: ["skills", "tech stack", "technologies", "what languages", "tools do you use", "python", "react", "next.js", "fastapi", "docker"],
      a: `For AI I mostly use Python, PyTorch, TensorFlow and Scikit-Learn, with Docling, Qdrant and Ollama for retrieval. On the web I use FastAPI, React and Node.js, with MySQL, PostgreSQL, MongoDB and SQLite for data. I ship with Docker, Git, Linux and AWS, and I use Power BI for analytics.`,
    },
    {
      q: ["research", "paper", "publication", "published", "picet", "vice president", "leadership", "class representative"],
      a: `I presented a research paper, Soil Contamination Detection Using Hybrid Machine Learning Models, at PiCET 2026 (Scopus-indexed IET proceedings). I was also elected Vice President of the CSE department (2024 to 2025), representing 700+ students.`,
    },
    {
      q: ["clients", "who have you worked with", "reviews", "testimonials", "customers"],
      a: `I've built for colleges, labs and local businesses.${otherClients.length || siteClients.length ? ` Some of them: ${list([...otherClients, ...siteClients])}.` : ""} You'll find them in the "Built for real people" section on the home page.`,
    },
    {
      q: ["resume", "cv", "download resume"],
      a: `You can download my résumé from the About page.`,
    },
    {
      q: ["where are you", "location", "based in", "where do you live", "available", "open to work", "looking for", "relocate"],
      a: `I'm based in Hyderabad, India, and I work with clients worldwide. I'm open to software engineering and AI/ML roles, freelance work and collaborations.`,
    },
    {
      q: ["languages do you speak", "speak", "telugu", "hindi", "english"],
      a: `I speak English, Telugu and Hindi.`,
    },
    {
      q: ["blog", "writing", "articles", "do you write"],
      a: `I write about AI agents, RAG, LLM inference, React and local-first software. You'll find the posts on the Writing page.`,
    },
  ];

  return { docs, facts };
}

export type SearchResult = {
  answer: string;
  projects: SearchDoc[];
};

function chipsFor(docs: SearchDoc[], mode?: string): SearchDoc[] {
  if (!mode) return [];
  if (mode.startsWith("slug:")) return docs.filter((d) => d.slug === mode.slice(5));
  if (mode === "featured") return docs.filter((d) => d.featured).slice(0, 3);
  if (mode === "websites") return docs.filter((d) => d.category === "Website Development").slice(0, 3);
  if (mode === "security") return docs.filter((d) => d.category === "Cyber Security").slice(0, 3);
  if (mode === "ai")
    return docs.filter((d) => d.featured && /AI|Vision|Machine/.test(d.category)).slice(0, 3);
  return [];
}

export function search(index: SearchIndex, query: string): SearchResult {
  const qRaw = query.toLowerCase().trim();
  const tokens = tokenize(query);

  // 1) facts: an exact phrase inside the question wins; otherwise most of the phrase's key words must appear
  let bestFact: { score: number; a: string; chips?: string } | null = null;
  for (const f of index.facts) {
    for (const phrase of f.q) {
      let score = 0;
      if (qRaw.includes(phrase)) {
        score = 1 + phrase.length / 100;
      } else {
        const pTokens = tokenize(phrase);
        if (pTokens.length) {
          const overlap = pTokens.filter((t) => qRaw.includes(t)).length;
          score = overlap / pTokens.length;
          if (score <= 0.5) score = 0;
        }
      }
      if (score > 0 && (!bestFact || score > bestFact.score)) bestFact = { score, a: f.a, chips: f.chips };
    }
  }

  // 2) projects: title hits count most
  const scored = index.docs
    .map((d) => {
      const hay = [d.title, d.tagline, d.category, d.domains.join(" "), d.tech.join(" "), d.description]
        .join(" ")
        .toLowerCase();
      let score = 0;
      for (const t of tokens) {
        if (d.title.toLowerCase().includes(t)) score += 5;
        else if (hay.includes(t)) score += 1;
      }
      return { d, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  const top = scored.slice(0, 3).map((x) => x.d);

  // a project named in the question beats a generic fact
  const named = scored.find((x) => tokens.some((t) => x.d.title.toLowerCase().includes(t)) && x.score >= 5);
  if (named && (!bestFact || bestFact.score < 1.2)) {
    const lead = named.d;
    const m = lead.metrics.map((x) => `${x.label}: ${x.value}`).join(", ");
    return {
      answer: `${lead.title}: ${lead.tagline}. ${lead.description}${m ? ` (${m})` : ""} I built it with ${list(lead.tech.slice(0, 5))}.`,
      projects: top,
    };
  }

  if (bestFact) return { answer: bestFact.a, projects: chipsFor(index.docs, bestFact.chips) };

  if (top.length > 0) {
    const lead = top[0];
    const m = lead.metrics.map((x) => `${x.label}: ${x.value}`).join(", ");
    return {
      answer: `The closest thing I've built is ${lead.title}. ${lead.tagline}. ${lead.description}${m ? ` (${m})` : ""} I used ${list(lead.tech.slice(0, 5))}.`,
      projects: top,
    };
  }

  return {
    answer:
      "I can tell you about my projects, the websites I've built, ProjectKaro, Gopyata, my education, or how to reach me. Try \"What have you built?\" or \"Tell me about Cognora AI\".",
    projects: index.docs.filter((d) => d.featured).slice(0, 3),
  };
}
