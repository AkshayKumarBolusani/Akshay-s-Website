import type { MetadataRoute } from "next";
import { getProjects, getBlogPosts } from "@/lib/data";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastBuildDate = new Date("2026-06-04T00:00:00Z");
  
  const projectsData = getProjects();
  const projects = projectsData.map((p) => {
    const yearDate = new Date(`${p.year}-01-01T00:00:00Z`);
    return {
      url: `${site.url}/project/${p.slug}`,
      lastModified: yearDate > lastBuildDate ? lastBuildDate : yearDate,
      changeFrequency: "monthly" as const,
      priority: p.featured ? 0.9 : 0.7,
    };
  });

  const blogPostsData = getBlogPosts();
  const blogPosts = blogPostsData.map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: p.featured ? 0.85 : 0.75,
  }));

  return [
    {
      url: site.url,
      lastModified: lastBuildDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${site.url}/blog`,
      lastModified: lastBuildDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...projects,
    ...blogPosts,
  ];
}
