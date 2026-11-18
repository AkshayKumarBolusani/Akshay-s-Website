import type { Metadata, Viewport } from "next";
import { Syne, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { toSchemaDateTime } from "@/lib/utils";
import { Experience } from "@/components/shell/Experience";
import { Footer } from "@/components/shell/Footer";
import { LazyAskAkshayAI } from "@/components/LazyAskAkshayAI";
import { getProjects, getAchievements, getProfile } from "@/lib/data";
import { buildSearchIndex } from "@/lib/search";

const display = Syne({ variable: "--nf-display", subsets: ["latin"], weight: ["500", "700", "800"], display: "swap" });
const body = Space_Grotesk({ variable: "--nf-body", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--nf-mono", subsets: ["latin"], display: "swap" });

export const viewport: Viewport = {
  themeColor: "#060607",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — AI & Full-Stack Software Engineer`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: site.brand,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.brand,
    title: `${site.name} — AI & Full-Stack Software Engineer`,
    description: site.description,
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: `${site.name} — AI & Full-Stack Software Engineer, Hyderabad` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — AI & Full-Stack Software Engineer`,
    description: site.description,
    images: [site.ogImage],
    creator: "@akshay_bolusani",
    site: "@akshay_bolusani",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
  classification: "Portfolio",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  other: { "content-language": "en-US" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const projects = getProjects();
  const achievements = getAchievements();
  const profile = getProfile();
  const searchIndex = buildSearchIndex(
    projects.map((p) => ({
      slug: p.slug,
      title: p.title,
      tagline: p.tagline,
      category: p.category,
      domains: p.domains,
      tech: p.tech,
      description: p.description,
      metrics: p.metrics,
      featured: p.featured,
      clients: p.clients?.map((c) => ({ name: c.name, org: c.org })),
    })),
    achievements,
    profile,
  );

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${site.url}/#person`,
    name: site.name,
    givenName: "Akshay Kumar",
    familyName: "Bolusani",
    url: site.url,
    image: {
      "@type": "ImageObject",
      url: `${site.url}${site.image}`,
      width: 1086,
      height: 1448,
    },
    jobTitle: "AI & Full-Stack Software Engineer",
    description: site.longDescription,
    email: `mailto:${site.email}`,
    birthPlace: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressCountry: "IN" },
    },
    nationality: { "@type": "Country", name: "India" },
    address: {
      "@type": "PostalAddress",
      addressLocality: site.locationDetailed.city,
      addressRegion: site.locationDetailed.state,
      addressCountry: site.locationDetailed.countryCode,
    },
    worksFor: [{ "@id": `${site.url}/#organization` }, { "@id": `${site.url}/#gopyata` }],
    sameAs: [site.socials.linkedin, site.socials.github, site.socials.instagram, site.socials.twitter, site.projectKaro.url],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Malla Reddy University",
    },
    hasOccupation: [
      {
        "@type": "Occupation",
        name: "Software Engineer",
        occupationLocation: { "@type": "Country", name: "India" },
        skills: site.skills.languages.join(", "),
      },
      {
        "@type": "Occupation",
        name: "AI/ML Engineer",
        occupationLocation: { "@type": "Country", name: "India" },
        skills: site.skills.ai.join(", "),
      },
    ],
    knowsAbout: [
      ...site.expertise,
      ...site.skills.languages,
      ...site.skills.frontend,
      ...site.skills.backend,
      ...site.skills.ai,
    ],
    knowsLanguage: site.languages.map((lang) => ({
      "@type": "Language",
      name: lang,
    })),
  };

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.brand,
    alternateName: site.name,
    url: site.url,
    description: site.description,
    inLanguage: "en-US",
    author: { "@id": `${site.url}/#person` },
    publisher: { "@id": `${site.url}/#person` },
  };

  const profilePageLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${site.url}/#profilepage`,
    name: `${site.name} — Portfolio`,
    description: site.longDescription,
    url: site.url,
    mainEntity: { "@id": `${site.url}/#person` },
    dateCreated: toSchemaDateTime("2022-09-01"),
    dateModified: toSchemaDateTime("2026-11-18"),
  };

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.projectKaro.name,
    alternateName: "ProjectKaro",
    url: site.projectKaro.url,
    logo: `${site.url}/icons/icon-512.png`,
    description: site.projectKaro.description,
    numberOfEmployees: { "@type": "QuantitativeValue", value: 23 },
    founder: { "@id": `${site.url}/#person` },
    foundingDate: "2024-01-01",
    foundingLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: site.locationDetailed.city,
        addressCountry: site.locationDetailed.countryCode,
      },
    },
    areaServed: "Worldwide",
    serviceType: [
      "Website Development",
      "AI Solutions",
      "Full Stack Development",
      "Technical Consulting",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Technical Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Website Development",
            description: "Custom website design and development using modern technologies",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "AI/ML Solutions",
            description: "Artificial intelligence and machine learning integration",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Full Stack Development",
            description: "End-to-end application development",
          },
        },
      ],
    },
    sameAs: [site.socials.linkedin, site.socials.github],
  };

  const gopyataLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#gopyata`,
    name: "Gopyata",
    url: "https://gopyata.in",
    slogan: "Privacy readiness, made practical.",
    description:
      "DPDP (Digital Personal Data Protection) readiness for Indian businesses: a free readiness report, hands-on setup and monthly care. A readiness aid, not legal advice.",
    founder: { "@id": `${site.url}/#person` },
    areaServed: "IN",
  };

  const speakableLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${site.url}/#webpage`,
    url: site.url,
    name: `${site.name} - Portfolio`,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".hero-description", ".about-summary"],
    },
    mainEntity: { "@id": `${site.url}/#person` },
  };

  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <head>
        <meta name="msapplication-TileColor" content="#C6FF3D" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="author" href="/humans.txt" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs" />
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="LLMs (full)" />
        <link rel="me" href={site.socials.linkedin} />
        <link rel="me" href={site.socials.github} />
        <link rel="me" href={site.socials.twitter} />
      </head>
      <body className="grain antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to main content
        </a>
        <Experience>
          <div id="main-content">{children}</div>
          <Footer />
        </Experience>
        <LazyAskAkshayAI index={searchIndex} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(gopyataLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableLd) }}
        />
      </body>
    </html>
  );
}
