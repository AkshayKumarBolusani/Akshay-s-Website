import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { Stats } from "@/components/home/Stats";
import { WorkReel } from "@/components/home/WorkReel";
import { Ventures } from "@/components/home/Ventures";
import { Journey } from "@/components/home/Journey";
import { Lab } from "@/components/home/Lab";
import { Wall } from "@/components/home/Wall";
import { Voices } from "@/components/home/Voices";
import { Writing } from "@/components/home/Writing";
import {
  getTimeline,
  getCertifications,
  getProfile,
  getProjects,
  getProfileImagePath,
  getBlogPosts,
  getClients,
} from "@/lib/data";
import { site } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  const projects = getProjects();
  const timeline = getTimeline();
  const certs = getCertifications();
  const profile = getProfile();
  const projectCount = projects.length;
  const blogPosts = getBlogPosts();
  const clients = getClients();

  const reel = projects
    .filter((p) => p.featured)
    .slice(0, 8)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      tagline: p.tagline,
      category: p.category,
      year: p.year,
      accent: p.accent,
      tech: p.tech,
      metrics: p.metrics,
      image: p.images[0],
    }));

  const stats = [
    { value: 60, suffix: "+", label: "Projects delivered", note: "Web, AI, academic and startup builds" },
    { value: 100, suffix: "+", label: "Websites built", note: "Healthcare, education, real estate and business" },
    { value: 23, label: "Team members", note: "Developers, IoT team, interns and campus ambassadors" },
    { value: 8.97, decimals: 2, label: "CGPA", note: "B.Tech CSE, Malla Reddy University (2022–26)" },
    { value: 700, suffix: "+", label: "Students led", note: "As elected Vice President, Dept. of CSE" },
    { value: projectCount, label: "In the archive", note: "AI, research, security and full-stack builds" },
  ];

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Who is Akshay Kumar Bolusani?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Akshay Kumar Bolusani is an AI & Full-Stack Software Engineer based in Hyderabad, India, focused on local-first, citation-backed AI systems such as Cognora AI and India Invoice AI. He founded ProjectKaro (60+ projects, team of 23), built 100+ websites as a Web Development Intern at Digital Connect, and graduated B.Tech CSE from Malla Reddy University with a CGPA of 8.97.`,
        },
      },
      {
        "@type": "Question",
        name: "What was Akshay Kumar Bolusani's role at Digital Connect?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `${profile.digitalConnect.role} at ${profile.digitalConnect.company} (${profile.digitalConnect.period}). Responsibilities included designing and developing client websites and web applications, API integration, and deployment alongside completing a B.Tech in Computer Science.`,
        },
      },
      {
        "@type": "Question",
        name: "What kind of projects does Akshay build?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Akshay's portfolio documents ${projectCount} projects spanning: applied AI (retrieval-augmented document Q&A, GST invoice intelligence, skin disease detection), security (a SOC lab and phishing detection), full-stack applications and websites, and research (hybrid machine learning for soil contamination, quantum-inspired drug discovery).`,
        },
      },
      {
        "@type": "Question",
        name: "What technologies does Akshay Kumar Bolusani use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Akshay works with: Frontend (React, Next.js, TypeScript, Tailwind CSS), Backend (Node.js, Python, FastAPI, Django), AI/ML (PyTorch, TensorFlow, LangChain, OpenAI, Hugging Face), Databases (PostgreSQL, MongoDB, Redis, Vector DBs), and Cloud (AWS, Vercel, Docker).",
        },
      },
      {
        "@type": "Question",
        name: "Is Akshay Kumar Bolusani available for hire or freelance work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Akshay is open for collaborations, freelancing, full-time software engineering positions, and AI/ML opportunities. For professional inquiries, contact: akshaykumarbolusani@gmail.com or connect via LinkedIn at linkedin.com/in/akshaykumarbolusani.",
        },
      },
      {
        "@type": "Question",
        name: "What is ProjectKaro?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ProjectKaro (projectkaro.com) is a software studio founded by Akshay Kumar Bolusani in January 2024 that has delivered 60+ projects with a team of 23. It builds business websites, startup MVPs, and student and academic software and research projects.",
        },
      },
      {
        "@type": "Question",
        name: "What is Gopyata?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Gopyata (gopyata.in) is a privacy-readiness service for Indian businesses, founded by Akshay Kumar Bolusani. It helps coaching institutes, schools, clinics and small businesses understand the personal data they handle under India's DPDP framework, with a free readiness report, hands-on setup and monthly care. It is a readiness aid, not legal advice or a compliance guarantee.",
        },
      },
      {
        "@type": "Question",
        name: "What are Akshay Kumar Bolusani's notable AI projects?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Notable projects include: Shapeshift (free, offline, open-source file converter for macOS), Cognora AI (local-first retrieval-augmented document Q&A with per-page citations), India Invoice AI (open-source, review-first GST invoice intelligence), SkinCare AI (CNN-based skin disease detection with 92.6% accuracy), Hybrid Quantum GAN Drug Discovery (quantum-classical ML for molecule generation), Pharmaceutical Compliance Agent (RAG-based regulatory system), and AI Interview Bot (LLM-powered technical interviews).",
        },
      },
      {
        "@type": "Question",
        name: "Where is Akshay Kumar Bolusani located?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Akshay Kumar Bolusani is based in Hyderabad, Telangana, India. He works remotely and serves clients worldwide through ProjectKaro.",
        },
      },
      {
        "@type": "Question",
        name: "What is Akshay Kumar Bolusani's educational background?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Akshay holds a Bachelor of Technology (B.Tech) in Computer Science Engineering, from Malla Reddy University, Hyderabad (2022–2026, CGPA 8.97). He presented a research paper on soil contamination detection with hybrid ML models at PiCET 2026 (Scopus-indexed IET proceedings).",
        },
      },
      {
        "@type": "Question",
        name: "How can I contact Akshay Kumar Bolusani?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Contact Akshay via: Email (akshaykumarbolusani@gmail.com), LinkedIn (linkedin.com/in/akshaykumarbolusani), GitHub (github.com/AkshayKumarBolusani), or through the contact form on this website. For project inquiries, visit ProjectKaro at projectkaro.com.",
        },
      },
    ],
  };

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Featured Projects by Akshay Kumar Bolusani",
    description: `A curated list of ${projectCount} technical projects in AI, machine learning, and full-stack development`,
    numberOfItems: projectCount,
    itemListElement: projects.slice(0, 10).map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: project.title,
      description: project.description,
      url: `${site.url}/project/${project.slug}`,
    })),
  };

  return (
    <main className="relative">
      <Hero imageSrc={getProfileImagePath()} />
      <Manifesto />
      <Stats stats={stats} />
      <WorkReel projects={reel} total={projectCount} />
      {profile.projectKaro && <Ventures pk={profile.projectKaro} gopyata={profile.gopyata} />}
      <Journey timeline={timeline} />
      <Lab />
      <Wall certs={certs} highlights={profile.leadership ?? []} />
      <Voices clients={clients} />
      <Writing
        posts={blogPosts.slice(0, 5).map((p) => ({
          slug: p.slug,
          title: p.title,
          category: p.category,
          readTime: p.readTime,
          publishedAt: p.publishedAt,
          thumbnail: p.thumbnail,
        }))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
    </main>
  );
}
