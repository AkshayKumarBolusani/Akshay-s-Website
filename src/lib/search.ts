import type { Achievements, Profile } from "./data";

export type SearchDoc = {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  domains: string[];
  tech: string[];
  description: string;
  metrics: { label: string; value: string }[];
};

export type SearchIndex = {
  docs: SearchDoc[];
  facts: { q: string[]; a: string }[];
};

const STOP = new Set([
  "the", "a", "an", "is", "are", "of", "to", "and", "for", "in", "on",
  "what", "how", "many", "about", "tell", "me", "has", "have", "did",
  "does", "akshay", "you", "your", "with", "built", "build", "projects",
  "project", "which", "show", "list", "can", "i", "do",
]);

export function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

export function buildSearchIndex(
  docs: SearchDoc[],
  ach: Achievements,
  profile: Profile,
): SearchIndex {
  const projectTotal = docs.length;
  const featuredTotal = ach.stats.find((s) =>
    s.label.toLowerCase().includes("featured"),
  )?.value;

  const dc = profile.digitalConnect;

  const facts = [
    {
      q: [
        "digital connect",
        "where does akshay work",
        "internship",
        "work experience",
      ],
      a: `Akshay was a ${dc.role} at ${dc.company} (${dc.period}) while completing his B.Tech in Computer Science.`,
    },
    {
      q: [
        "how many websites",
        "websites delivered",
        "number of websites",
        "websites developed",
      ],
      a: `Exact client website counts are not published on this site. ${profile.websiteNote}`,
    },
    {
      q: [
        "how many projects",
        "number of projects",
        "projects built",
        "total projects",
        "portfolio",
      ],
      a: `This site documents ${projectTotal} portfolio projects (${featuredTotal ?? 10} featured in the Project Galaxy, the rest in the Labs archive), spanning AI/ML, full-stack, and research.`,
    },
    {
      q: ["years experience", "how long", "how much experience"],
      a: `Professional experience at ${dc.company} runs ${dc.period}.`,
    },
    {
      q: ["who is akshay", "about akshay", "tell me about yourself", "introduce"],
      a: `Akshay Kumar Bolusani is a Software Engineer, Full Stack Developer, and AI/ML Engineer based in Hyderabad, India. ${dc.role} at ${dc.company} (${dc.period}). Graduated with a ${profile.education.degree} in ${profile.education.graduationYear}.`,
    },
    {
      q: ["contact", "email", "hire", "reach", "get in touch"],
      a: `You can reach Akshay at akshaykumarbolusani@gmail.com, on LinkedIn (in/akshaykumarbolusani), GitHub (AkshayKumarBolusani), or Instagram (@askforakshaykumar). He is open for collaborations, freelancing, and software/AI roles.`,
    },
    {
      q: [
        "ai machine learning",
        "ai projects",
        "ml projects",
        "machine learning",
      ],
      a: `The portfolio includes AI/ML and computer-vision work such as Hybrid Quantum GAN Drug Discovery, SkinCare AI, MRI Epilepsy GNN, the Pharma Compliance RAG agent, and an e-commerce recommendation system — see Project Galaxy and Labs.`,
    },
    {
      q: ["resume", "cv", "download resume"],
      a: `A résumé download is available in the "For Recruiters" section when a PDF is added to public/resume/.`,
    },
    {
      q: ["education", "degree", "graduated", "b.tech"],
      a: `${profile.education.degree}. Graduated ${profile.education.graduationYear}.`,
    },
    {
      q: [
        "projectkaro",
        "project karo",
        "services",
        "hire akshay",
        "freelance",
        "client work",
        "consulting",
      ],
      a: profile.projectKaro
        ? `ProjectKaro is a professional services platform created by Akshay. Services include: ${profile.projectKaro.services.slice(0, 5).join(", ")}, and more. Visit ${profile.projectKaro.url} to start a project.`
        : "Akshay offers technical consulting and freelance services. Contact akshaykumarbolusani@gmail.com.",
    },
  ];

  return { docs, facts };
}

export type SearchResult = {
  answer: string;
  projects: SearchDoc[];
};

export function search(index: SearchIndex, query: string): SearchResult {
  const qTokensRaw = query.toLowerCase().trim();
  const tokens = tokenize(query);

  let bestFact: { score: number; a: string } | null = null;
  for (const f of index.facts) {
    for (const phrase of f.q) {
      const pTokens = tokenize(phrase);
      const overlap = pTokens.filter((t) => qTokensRaw.includes(t)).length;
      const score = overlap / Math.max(pTokens.length, 1);
      if (score > 0.5 && (!bestFact || score > bestFact.score)) {
        bestFact = { score, a: f.a };
      }
    }
  }

  const scored = index.docs
    .map((d) => {
      const hay = [
        d.title,
        d.tagline,
        d.category,
        d.domains.join(" "),
        d.tech.join(" "),
        d.description,
      ]
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

  if (bestFact) {
    return { answer: bestFact.a, projects: top.slice(0, 2) };
  }

  if (top.length > 0) {
    const lead = top[0];
    const m = lead.metrics.map((x) => `${x.label}: ${x.value}`).join(" · ");
    return {
      answer: `${lead.title} — ${lead.tagline}. ${lead.description}${
        m ? ` (${m})` : ""
      } Tech: ${lead.tech.slice(0, 6).join(", ")}.`,
      projects: top,
    };
  }

  return {
    answer:
      "Ask about Digital Connect, portfolio projects, education, or how to get in touch. Try: “Tell me about SkinCare AI” or “What is Akshay’s role at Digital Connect?”",
    projects: index.docs.slice(0, 3),
  };
}
