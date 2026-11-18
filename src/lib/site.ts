const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://akshaykumarbolusani.vercel.app";

export const site = {
  name: "Akshay Kumar Bolusani",
  shortName: "Akshay",
  brand: "Akshay Labs",
  role: "AI & Full-Stack Software Engineer",
  tagline: "I build AI that shows its work.",
  location: "Hyderabad, India",
  locationDetailed: {
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    countryCode: "IN",
  },
  email: "akshaykumarbolusani@gmail.com",
  url: SITE_URL,
  image: "/akshaykumar.webp",
  ogImage: "/og/home.png",
  description:
    "AI & Full-Stack Software Engineer in Hyderabad. Builds local-first, citation-backed AI (Cognora AI, India Invoice AI) and founded ProjectKaro: 60+ projects, team of 23.",
  // First-person copy shown to visitors on the page. `description` and `longDescription` stay in the
  // third person on purpose: they feed search results, social cards and structured data.
  bio:
    "I'm an AI and full-stack engineer from Hyderabad. I build applied AI that people can check: a document Q&A tool that shows the page behind every answer (Cognora AI), a GST invoice checker that catches errors before filing (India Invoice AI), and a skin disease detector built on DINOv2 and ResNet50 (SkinCare AI). I founded ProjectKaro, lead a team of 23, and have shipped 60+ projects and 100+ websites for real clients. I finished my B.Tech in Computer Science at Malla Reddy University with a CGPA of 8.97, and I presented a research paper at PiCET 2026.",
  longDescription:
    "Akshay Kumar Bolusani is an AI & Full-Stack Software Engineer from Hyderabad, India. He builds applied AI systems — a citation-backed document Q&A platform (Cognora AI), a review-first GST invoice intelligence tool (India Invoice AI) and a DINOv2 + ResNet50 skin disease detector (SkinCare AI). Founder of ProjectKaro, a software studio that has delivered 60+ projects with a team of 23; former Web Development Intern at Digital Connect (100+ websites). B.Tech CSE, Malla Reddy University (CGPA 8.97), with a research paper at PiCET 2026.",
  socials: {
    linkedin: "https://www.linkedin.com/in/akshaykumarbolusani/",
    github: "https://github.com/AkshayKumarBolusani",
    instagram: "https://www.instagram.com/askforakshaykumar/",
    twitter: "https://x.com/akshay_bolusani",
  },
  keywords: [
    "Akshay Kumar Bolusani",
    "Bolusani Akshay Kumar",
    "Software Engineer Hyderabad",
    "Full Stack Developer Hyderabad",
    "AI Developer Hyderabad",
    "Machine Learning Engineer Hyderabad",
    "React Developer Hyderabad",
    "Python Developer Hyderabad",
    "AI Engineer",
    "Portfolio",
    "Web Developer India",
    "Computer Vision Engineer",
    "LLM Developer",
    "RAG Systems",
    "Deep Learning Engineer",
    "ProjectKaro",
    "Gopyata",
    "RAG Engineer",
    "Local-first AI",
    "Cognora AI",
    "India Invoice AI",
  ],
  skills: {
    languages: ["Python", "Java", "JavaScript", "SQL"],
    frontend: ["React.js"],
    backend: ["FastAPI", "Node.js", "REST APIs"],
    ai: ["PyTorch", "TensorFlow", "Scikit-Learn", "NLP", "Retrieval-augmented generation", "Computer vision"],
    databases: ["MySQL", "PostgreSQL", "MongoDB", "SQLite"],
    cloud: ["Docker", "AWS", "Linux"],
    tools: ["Git", "Power BI", "Wazuh SIEM", "Elastic Stack", "Suricata IDS", "MITRE ATT&CK", "Kali Linux"],
  },
  expertise: [
    "Applied AI and machine learning",
    "Retrieval-augmented generation (RAG)",
    "Computer vision",
    "Full-stack web development",
    "FastAPI and REST APIs",
    "Security monitoring (SIEM and IDS)",
    "Data analytics with Power BI",
  ],
  projectKaro: {
    name: "ProjectKaro",
    url: "https://projectkaro.com",
    description: "Professional services platform for technical solutions including website development, AI solutions, full-stack applications, and technical consulting.",
  },
  education: {
    degree: "B.Tech in Computer Science and Engineering — Malla Reddy University",
    status: "Completed",
    graduationYear: "2026",
  },
  work: {
    company: "Digital Connect",
    role: "Web Development Intern",
    period: "Aug 2023 – Jan 2026",
  },
  availability: [
    "Collaborations",
    "Freelancing",
    "Software Engineering Opportunities",
    "AI/ML Opportunities",
  ],
  languages: ["English", "Hindi", "Telugu"],
  birthYear: 2004,
} as const;

export const nav = [
  { id: "home", label: "Index", href: "/" },
  { id: "work", label: "Work", href: "/work" },
  { id: "ventures", label: "Ventures", href: "/ventures" },
  { id: "about", label: "About", href: "/about" },
  { id: "blog", label: "Writing", href: "/blog" },
  { id: "contact", label: "Contact", href: "/contact" },
] as const;
