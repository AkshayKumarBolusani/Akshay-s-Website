import "server-only";
import fs from "node:fs";
import path from "node:path";

export type Metric = { label: string; value: string };

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  domains: string[];
  year: string;
  rank: number;
  featured: boolean;
  accent: string;
  score: number;
  imagesFolder: string;
  tech: string[];
  github: string;
  metrics: Metric[];
  description: string;
  problem: string;
  solution: string;
  architecture: string;
  features: string[];
  challenges: string[];
  learnings: string[];
  futureScope: string[];
};

export type ProjectWithImages = Project & { images: string[] };

export type TimelineEntry = {
  year: string;
  title: string;
  paragraphs: string[];
  tags: string[];
};

export type Certification = {
  title: string;
  issuer: string;
  group: string;
  year: string;
  image?: string;
};

export type HeroStat = {
  label: string;
  value?: number;
  suffix?: string;
  display?: string;
};

export type ProjectKaroData = {
  name: string;
  tagline: string;
  url: string;
  description: string;
  services: string[];
  process: { step: string; title: string; description: string }[];
  impact: { label: string; note: string }[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: string;
  featured: boolean;
  thumbnail: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  projectRef?: string;
};

export type Profile = {
  digitalConnect: {
    company: string;
    role: string;
    period: string;
  };
  education: {
    degree: string;
    graduationYear: string;
  };
  experience: {
    role: string;
    organization: string;
    period: string;
    description: string;
  }[];
  projectKaro?: ProjectKaroData;
  websiteIndustries: string[];
  websiteNote: string;
};

type AchievementsRaw = {
  stats: {
    label: string;
    suffix?: string;
    display?: string;
    computed?: "projectsTotal" | "projectsFeatured";
    value?: number;
  }[];
  websiteStudio?: { totalWebsites: number; suffix?: string };
  websiteCategories: { name: string; count: number; accent: string }[];
  skills: Record<string, string[]>;
};

export type Achievements = {
  stats: HeroStat[];
  websiteStudio: { totalWebsites: number; suffix: string };
  websiteCategories: { name: string; count: number; accent: string }[];
  skills: Record<string, string[]>;
};

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data");
const PUBLIC_DIR = path.join(ROOT, "public");

const IMAGE_EXT = new Set([".webp", ".png", ".jpg", ".jpeg", ".avif", ".gif"]);

function readJSON<T>(file: string): T {
  const raw = fs.readFileSync(path.join(DATA_DIR, file), "utf-8");
  return JSON.parse(raw) as T;
}

export function readImageFolder(relDir: string): string[] {
  const dir = path.join(PUBLIC_DIR, relDir);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((f) => `/${relDir}/${f}`.replace(/\\/g, "/"));
}

let projectCache: Project[] | null = null;

function loadProjects(): Project[] {
  if (!projectCache) {
    projectCache = readJSON<Project[]>("projects.json").sort(
      (a, b) => a.rank - b.rank,
    );
  }
  return projectCache;
}

function withImages(p: Project): ProjectWithImages {
  return { ...p, images: readImageFolder(`projects/${p.imagesFolder}`) };
}

export function getProjects(): ProjectWithImages[] {
  return loadProjects().map(withImages);
}

export function getFeaturedProjects(): ProjectWithImages[] {
  return getProjects().filter((p) => p.featured);
}

export function getArchiveProjects(): ProjectWithImages[] {
  return getProjects().filter((p) => !p.featured);
}

export function getProject(slug: string): ProjectWithImages | undefined {
  const p = loadProjects().find((x) => x.slug === slug);
  return p ? withImages(p) : undefined;
}

export function getProjectSlugs(): string[] {
  return loadProjects().map((p) => p.slug);
}

export function getTimeline(): TimelineEntry[] {
  return readJSON<TimelineEntry[]>("timeline.json");
}

export function getCertifications(): Certification[] {
  const certs = readJSON<Certification[]>("certifications.json");
  const folderImages = readImageFolder("certifications");
  return certs.map((c, i) => ({ ...c, image: folderImages[i] }));
}

export function getCertificationImages(): string[] {
  return readImageFolder("certifications");
}

export function getMediaImages(): string[] {
  return [...readImageFolder("media"), ...readImageFolder("awards")];
}

export function getProfile(): Profile {
  return readJSON<Profile>("profile.json");
}

export function getAchievements(): Achievements {
  const raw = readJSON<AchievementsRaw>("achievements.json");
  const total = loadProjects().length;
  const featured = loadProjects().filter((p) => p.featured).length;

  const stats: HeroStat[] = raw.stats.map((s) => {
    if (s.display) {
      return { label: s.label, display: s.display };
    }
    if (s.computed === "projectsTotal") {
      return { label: s.label, value: total, suffix: s.suffix ?? "" };
    }
    if (s.computed === "projectsFeatured") {
      return { label: s.label, value: featured, suffix: s.suffix ?? "" };
    }
    return {
      label: s.label,
      value: s.value,
      suffix: s.suffix ?? "",
    };
  });

  return {
    stats,
    websiteStudio: {
      totalWebsites: raw.websiteStudio?.totalWebsites ?? 100,
      suffix: raw.websiteStudio?.suffix ?? "+",
    },
    websiteCategories: raw.websiteCategories,
    skills: raw.skills,
  };
}

export function getResumeFile(): string | null {
  const files = readImageFolderRaw("resume");
  const pdf = files.find((f) => f.toLowerCase().endsWith(".pdf"));
  return pdf ? `/resume/${pdf}` : null;
}

function readImageFolderRaw(relDir: string): string[] {
  const dir = path.join(PUBLIC_DIR, relDir);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => !f.startsWith("."));
}

export function hasProfileImage(): boolean {
  return (
    fs.existsSync(path.join(PUBLIC_DIR, "akshay.webp")) ||
    fs.existsSync(path.join(PUBLIC_DIR, "akshay.png"))
  );
}

export function getProfileImagePath(): string {
  if (fs.existsSync(path.join(PUBLIC_DIR, "akshay.webp"))) return "/akshay.webp";
  if (fs.existsSync(path.join(PUBLIC_DIR, "akshay.png"))) return "/akshay.png";
  return "";
}

export function getBlogPosts(): BlogPost[] {
  try {
    return readJSON<BlogPost[]>("blog.json").sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch {
    return [];
  }
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return getBlogPosts().find((p) => p.slug === slug);
}

export function getBlogSlugs(): string[] {
  return getBlogPosts().map((p) => p.slug);
}

export function getFeaturedBlogPosts(): BlogPost[] {
  return getBlogPosts().filter((p) => p.featured);
}

export function getTestimonials(): Testimonial[] {
  return [
    {
      id: "1",
      name: "Kiran Reddy",
      role: "Client",
      company: "Healthcare Startup, Hyderabad",
      avatar: "",
      content: "Got a skin disease detection model built for our clinic app. Clean code, good documentation, and explained everything clearly. Exactly what we needed.",
      rating: 5,
      projectRef: "skincare-ai"
    },
    {
      id: "2",
      name: "Sravanthi Naidu",
      role: "Client",
      company: "EdTech Platform, Vijayawada",
      avatar: "",
      content: "Needed a recommendation engine for our learning platform. Akshay delivered it on time, walked us through the logic, and even helped with deployment. Really solid work.",
      rating: 5,
      projectRef: "ecommerce-recommendation-system"
    },
    {
      id: "3",
      name: "Venkata Rao",
      role: "Client",
      company: "Pharma Research, Hyderabad",
      avatar: "",
      content: "The RAG-based compliance agent he built saved us serious time on regulatory documentation. He understood the domain fast and built something we actually use daily.",
      rating: 5,
      projectRef: "pharma-compliance-agent"
    },
    {
      id: "4",
      name: "Bhavana Srinivas",
      role: "Client",
      company: "Startup Founder, Vizag",
      avatar: "",
      content: "Came to ProjectKaro for a full-stack app — got exactly that. Good communication throughout, no surprises, and the UI looked professional right from the first build.",
      rating: 5,
      projectRef: undefined
    },
    {
      id: "5",
      name: "Suresh Varma",
      role: "Client",
      company: "E-commerce Business, Guntur",
      avatar: "",
      content: "He built a recommendation system that genuinely helped with our product discovery. The technical depth was impressive and he kept things simple to understand on our end.",
      rating: 5,
      projectRef: "ecommerce-recommendation-system"
    },
    {
      id: "6",
      name: "Padmavathi Rao",
      role: "Client",
      company: "MedTech Lab, Tirupati",
      avatar: "",
      content: "The MRI analysis project was technically complex — GNNs, multimodal data, the works. Akshay handled it well and the output was clear enough for our neurologists to actually use.",
      rating: 5,
      projectRef: "mri-epilepsy-gnn"
    }
  ];
}
