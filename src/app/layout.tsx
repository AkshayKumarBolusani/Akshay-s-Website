import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { CommandCenter } from "@/components/CommandCenter";
import { AskAkshayAI } from "@/components/AskAkshayAI";
import { getProjects, getAchievements, getProfile } from "@/lib/data";
import { buildSearchIndex } from "@/lib/search";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#05060a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Software Engineer & AI/ML Engineer | ${site.brand}`,
    template: `%s — ${site.name}`,
  },
  description: site.longDescription,
  keywords: [...site.keywords],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: site.brand,
    startupImage: [
      { url: "/splash.png", media: "(device-width: 375px) and (device-height: 812px)" },
    ],
  },
  openGraph: {
    type: "profile",
    locale: "en_US",
    url: site.url,
    siteName: site.brand,
    title: `${site.name} — Software Engineer & AI/ML Engineer`,
    description: site.longDescription,
    images: [
      { url: site.image, width: 1200, height: 1200, alt: `${site.name} - Profile Photo` },
      { url: "/og-image.png", width: 1200, height: 630, alt: `${site.name} - Portfolio` },
    ],
    firstName: "Akshay Kumar",
    lastName: "Bolusani",
    username: "akshaykumarbolusani",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Software Engineer & AI/ML Engineer`,
    description: site.longDescription,
    images: ["/og-image.png"],
    creator: "@akshaykumar",
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
  other: {
    "google-site-verification": "googlee8f5c2d0e346274f",
    "ai-content-declaration": "human-authored",
    "content-language": "en-US",
  },
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
      width: 400,
      height: 400,
    },
    jobTitle: "Software Engineer",
    additionalName: "AI/ML Engineer",
    description: site.longDescription,
    email: `mailto:${site.email}`,
    telephone: "",
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
    worksFor: {
      "@type": "Organization",
      name: site.work.company,
      url: "https://digitalconnect.in",
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "University",
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
    sameAs: [
      site.socials.linkedin,
      site.socials.github,
      site.socials.instagram,
    ],
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
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}/?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const profilePageLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${site.url}/#profilepage`,
    name: `${site.name}'s Portfolio`,
    description: site.longDescription,
    url: site.url,
    mainEntity: { "@id": `${site.url}/#person` },
    dateCreated: "2022-09-01",
    dateModified: new Date().toISOString().split("T")[0],
  };

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.projectKaro.name,
    alternateName: "ProjectKaro",
    url: site.projectKaro.url,
    logo: `${site.url}/icon.svg`,
    description: site.projectKaro.description,
    founder: { "@id": `${site.url}/#person` },
    foundingDate: "2022",
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

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: site.url,
      },
    ],
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <meta name="theme-color" content="#05060a" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="color-scheme" content="dark light" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="application-name" content={site.brand} />
        <meta name="apple-mobile-web-app-title" content={site.brand} />
        <meta name="msapplication-TileColor" content="#7c5cff" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="author" href="/humans.txt" />
        <link rel="me" href={site.socials.linkedin} />
        <link rel="me" href={site.socials.github} />
      </head>
      <body className="grain antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <a
          href="#projects"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-16 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to projects
        </a>
        <a
          href="#contact"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-28 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to contact
        </a>
        <CommandCenter />
        <div id="main-content">
          {children}
        </div>
        <AskAkshayAI index={searchIndex} />
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableLd) }}
        />
      </body>
    </html>
  );
}
