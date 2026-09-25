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
      name: "Rajesh Sharma",
      role: "CTO",
      company: "HealthTech Solutions",
      avatar: "",
      content: "Akshay delivered an exceptional AI-powered diagnostic system for our healthcare platform. His expertise in computer vision and deep learning helped us achieve 94% accuracy in early disease detection. The project was delivered on time with excellent documentation.",
      rating: 5,
      projectRef: "skincare-ai"
    },
    {
      id: "2",
      name: "Priya Patel",
      role: "Founder",
      company: "EduStart India",
      avatar: "",
      content: "Working with Akshay on our e-learning platform was a game-changer. He built a sophisticated recommendation system that increased student engagement by 40%. His full-stack expertise and attention to detail made the collaboration seamless.",
      rating: 5,
      projectRef: "ecommerce-recommendation-system"
    },
    {
      id: "3",
      name: "Vikram Reddy",
      role: "Research Lead",
      company: "PharmaTech Labs",
      avatar: "",
      content: "The Pharmaceutical Compliance Agent that Akshay built has transformed how we handle regulatory documentation. His understanding of both AI and healthcare compliance requirements is remarkable. Highly recommended for enterprise AI projects.",
      rating: 5,
      projectRef: "pharma-compliance-agent"
    },
    {
      id: "4",
      name: "Ananya Krishnan",
      role: "Product Manager",
      company: "FinServe Digital",
      avatar: "",
      content: "Akshay developed a complete web application for our fintech startup through ProjectKaro. From design to deployment, everything was handled professionally. The modern UI and robust backend exceeded our expectations.",
      rating: 5,
      projectRef: undefined
    },
    {
      id: "5",
      name: "Suresh Menon",
      role: "Director of Engineering",
      company: "RetailMax Technologies",
      avatar: "",
      content: "The recommendation engine Akshay built increased our conversion rate by 35%. His deep understanding of machine learning algorithms combined with practical engineering skills is rare to find. Outstanding work!",
      rating: 5,
      projectRef: "ecommerce-recommendation-system"
    },
    {
      id: "6",
      name: "Deepa Nair",
      role: "CEO",
      company: "MedAI Innovations",
      avatar: "",
      content: "Akshay's work on our MRI analysis system was exceptional. His expertise in GNN architecture and medical imaging helped us build a tool that assists neurologists in epilepsy diagnosis. Truly innovative approach to healthcare AI.",
      rating: 5,
      projectRef: "mri-epilepsy-gnn"
    }
  ];
}
