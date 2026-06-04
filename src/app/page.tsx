import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { ProjectVault } from "@/components/ProjectVault";
import { WebsiteShowcase } from "@/components/WebsiteShowcase";
import { ProjectKaro } from "@/components/ProjectKaro";
import { BlogSection } from "@/components/BlogSection";
import { Testimonials } from "@/components/Testimonials";
import { Certifications } from "@/components/Certifications";
import { MediaGallery } from "@/components/MediaGallery";
import { Recruiter } from "@/components/Recruiter";
import { Contact } from "@/components/Contact";
import {
  getTimeline,
  getCertifications,
  getMediaImages,
  getAchievements,
  getProfile,
  getProjects,
  getResumeFile,
  hasProfileImage,
  getProfileImagePath,
  getBlogPosts,
  getTestimonials,
} from "@/lib/data";
import { site } from "@/lib/site";

export default function Home() {
  const projects = getProjects();
  const timeline = getTimeline();
  const certs = getCertifications();
  const media = getMediaImages();
  const ach = getAchievements();
  const profile = getProfile();
  const projectCount = projects.length;
  const resume = getResumeFile();
  const blogPosts = getBlogPosts();
  const testimonials = getTestimonials();

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Who is Akshay Kumar Bolusani?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Akshay Kumar Bolusani is a Software Engineer, Full Stack Developer, and AI/ML Engineer based in Hyderabad, India. He specializes in building innovative solutions using Next.js, React, Python, and machine learning frameworks. B.Tech graduate in Computer Science Engineering, with experience as a Web Development Intern at Digital Connect, he has delivered 100+ websites and ${projectCount}+ technical projects.`,
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
          text: `Akshay's portfolio documents ${projectCount} projects spanning: AI & Machine Learning (computer vision, NLP, deep learning), LLM/RAG Systems (enterprise knowledge management, chatbots), Healthcare AI (medical imaging, disease detection), Full-Stack Applications (e-commerce, dashboards, APIs), and Research Projects (quantum computing, recommendation systems).`,
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
          text: "ProjectKaro (projectkaro.com) is a professional services platform founded by Akshay Kumar Bolusani. Services include: Website Development, AI/ML Solutions, Full-Stack Applications, Technical Consulting, Student Project Assistance (major/minor projects), Startup MVP Development, and Research Projects. Industries served include Healthcare, Education, E-commerce, and Startups.",
        },
      },
      {
        "@type": "Question",
        name: "What are Akshay Kumar Bolusani's notable AI projects?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Notable AI projects include: SkinCare AI (CNN-based skin disease detection with 92.6% accuracy), Hybrid Quantum GAN Drug Discovery (quantum-classical ML for molecule generation), Pharmaceutical Compliance Agent (RAG-based regulatory system), AI Interview Bot (LLM-powered technical interviews), and E-Commerce Recommendation System (hybrid collaborative filtering).",
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
          text: "Akshay holds a Bachelor of Technology (B.Tech) in Computer Science Engineering, graduated in 2026. His coursework included data structures, algorithms, machine learning, computer networks, and database systems.",
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

  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Hire Akshay Kumar Bolusani for Your Project",
    description: "Steps to engage Akshay for software development, AI/ML, or consulting services",
    totalTime: "PT24H",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: "Contact for quote",
    },
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Review Portfolio",
        text: "Browse the project gallery to understand Akshay's expertise and past work in AI, ML, and full-stack development.",
        url: `${site.url}/#projects`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Check Services",
        text: "Visit ProjectKaro to see available services including website development, AI solutions, and technical consulting.",
        url: `${site.url}/#projectkaro`,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Get in Touch",
        text: "Contact via email at akshaykumarbolusani@gmail.com or use the contact form with your project requirements.",
        url: `${site.url}/#contact`,
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Discuss Requirements",
        text: "Schedule a consultation to discuss project scope, timeline, and technical approach.",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Start Collaboration",
        text: "Begin the development process with clear milestones and regular communication.",
      },
    ],
  };

  return (
    <main className="relative">
      <Hero hasImage={hasProfileImage()} imageSrc={getProfileImagePath()} projectCount={projectCount} />
      <About timeline={timeline} />
      <ProjectVault projects={projects} />
      <WebsiteShowcase
        categories={ach.websiteCategories}
        totalWebsites={ach.websiteStudio.totalWebsites}
      />
      {profile.projectKaro && <ProjectKaro data={profile.projectKaro} />}
      <BlogSection posts={blogPosts} />
      <Testimonials testimonials={testimonials} />
      <Certifications certs={certs} />
      <MediaGallery images={media} />
      <Recruiter
        skills={ach.skills}
        resume={resume}
        profile={profile}
        projectCount={projectCount}
      />
      <Contact />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
      />
    </main>
  );
}
