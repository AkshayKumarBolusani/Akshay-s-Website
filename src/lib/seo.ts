import type { Metadata } from "next";
import { site } from "@/lib/site";

/** Per-page metadata with canonical, Open Graph and Twitter all filled in (Next replaces, not merges, nested objects). */
export function pageMeta({
  title,
  description,
  path,
  image = site.ogImage,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  const fullTitle = `${title} — ${site.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: `${site.url}${path}`,
      siteName: site.brand,
      locale: "en_US",
      title: fullTitle,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [image], creator: "@akshay_bolusani" },
  };
}

export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${site.url}${t.path === "/" ? "" : t.path}`,
    })),
  };
}
