import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, Tag, ArrowUpRight } from "lucide-react";
import { getBlogPost, getBlogSlugs, getBlogPosts } from "@/lib/data";
import { site } from "@/lib/site";
import { toSchemaDateTime } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";

export const dynamicParams = false;

export function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    keywords: [...post.tags, post.category, "Akshay Kumar Bolusani"],
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${site.url}/blog/${post.slug}`,
      type: "article",
      publishedTime: toSchemaDateTime(post.publishedAt),
      authors: [post.author.name],
      images: [{ url: post.thumbnail, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.thumbnail],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const allPosts = getBlogPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.thumbnail,
    datePublished: toSchemaDateTime(post.publishedAt),
    dateModified: toSchemaDateTime(post.publishedAt),
    author: {
      "@type": "Person",
      name: post.author.name,
      url: site.url,
    },
    publisher: {
      "@type": "Person",
      name: site.name,
      url: site.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${site.url}/blog/${post.slug}`,
    },
    keywords: post.tags.join(", "),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog` },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${site.url}/blog/${post.slug}`,
      },
    ],
  };

  return (
    <main className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[60vh]">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
      </div>

      <article className="mx-auto max-w-3xl px-4 pb-24 pt-[max(6.5rem,env(safe-area-inset-top,0px)+5rem)] sm:px-5 sm:pb-28 sm:pt-28">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-faint transition-colors hover:text-fg"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> BACK TO BLOG
        </Link>

        <Reveal className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={{ background: "rgba(124, 92, 255, 0.15)", color: "#7c5cff" }}
            >
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <Calendar className="h-3.5 w-3.5" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}
            </span>
          </div>

          <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <p className="mt-4 text-lg text-muted">{post.excerpt}</p>

          <div className="mt-6 flex items-center gap-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gradient-to-br from-accent to-accent-2">
              {post.author.avatar ? (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                  style={{ objectPosition: "center 20%" }}
                  sizes="48px"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-sm font-bold text-bg">AK</span>
              )}
            </div>
            <div>
              <p className="font-medium">{post.author.name}</p>
              <p className="text-sm text-muted">Software Engineer & AI Engineer</p>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-10">
          <div className="relative aspect-[2/1] overflow-hidden rounded-2xl bg-bg-soft">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        </Reveal>

        <Reveal className="mt-12">
          <div className="prose prose-invert prose-lg max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-h2:mt-10 prose-h2:text-2xl prose-h3:mt-8 prose-h3:text-xl prose-p:leading-relaxed prose-p:text-fg/85 prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-strong:text-fg prose-code:rounded prose-code:bg-white/[0.05] prose-code:px-1.5 prose-code:py-0.5 prose-code:font-normal prose-code:text-accent-2 prose-pre:rounded-xl prose-pre:border prose-pre:border-border prose-pre:bg-bg-soft prose-li:text-fg/85 prose-img:rounded-xl">
            {post.content.split("\n\n").map((paragraph, i) => {
              if (paragraph.startsWith("## ")) {
                return (
                  <h2 key={i} className="mt-10 text-2xl font-semibold">
                    {paragraph.replace("## ", "")}
                  </h2>
                );
              }
              if (paragraph.startsWith("### ")) {
                return (
                  <h3 key={i} className="mt-8 text-xl font-semibold">
                    {paragraph.replace("### ", "")}
                  </h3>
                );
              }
              if (paragraph.startsWith("```")) {
                const lines = paragraph.split("\n");
                const code = lines.slice(1, -1).join("\n");
                return (
                  <pre key={i} className="overflow-x-auto rounded-xl border border-border bg-bg-soft p-4">
                    <code className="text-sm">{code}</code>
                  </pre>
                );
              }
              if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                return (
                  <p key={i} className="font-semibold text-fg">
                    {paragraph.replace(/\*\*/g, "")}
                  </p>
                );
              }
              if (paragraph.startsWith("- ")) {
                const items = paragraph.split("\n").filter(line => line.startsWith("- "));
                return (
                  <ul key={i} className="list-disc pl-6 space-y-2">
                    {items.map((item, j) => (
                      <li key={j}>{item.replace("- ", "")}</li>
                    ))}
                  </ul>
                );
              }
              if (paragraph.match(/^\d+\. /)) {
                const items = paragraph.split("\n").filter(line => line.match(/^\d+\. /));
                return (
                  <ol key={i} className="list-decimal pl-6 space-y-2">
                    {items.map((item, j) => (
                      <li key={j}>{item.replace(/^\d+\. /, "")}</li>
                    ))}
                  </ol>
                );
              }
              return <p key={i}>{paragraph}</p>;
            })}
          </div>
        </Reveal>

        <Reveal className="mt-12">
          <div className="flex flex-wrap items-center gap-2">
            <Tag className="h-4 w-4 text-muted" />
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-white/[0.02] px-3 py-1.5 text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </Reveal>

        {relatedPosts.length > 0 && (
          <div className="mt-16 border-t border-border pt-12">
            <h2 className="section-label mb-6">Related Articles</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {relatedPosts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group rounded-xl border border-border bg-white/[0.02] p-4 transition-colors hover:border-accent/30 hover:bg-white/[0.04]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted">{p.category}</span>
                    <ArrowUpRight className="h-4 w-4 text-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm font-medium">{p.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
    </main>
  );
}
