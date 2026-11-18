import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, Tag, ArrowUpRight } from "lucide-react";
import { getBlogPost, getBlogSlugs, getBlogPosts } from "@/lib/data";
import { site } from "@/lib/site";
import { toSchemaDateTime } from "@/lib/utils";
import { FadeUp as Reveal } from "@/components/ui/motion";
import { ReadingProgress } from "@/components/blog/ReadingProgress";

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
      <ReadingProgress />
      <article className="gutter mx-auto max-w-4xl pb-24 pt-28 sm:pt-36">
        <Link
          href="/blog"
          className="inline-flex min-h-11 items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All writing
        </Link>

        <Reveal className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="rounded-full bg-accent px-3 py-1 font-mono text-[0.72rem] font-bold uppercase tracking-[0.15em] text-ink"
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

          <h1 className="mt-6 text-balance font-display text-4xl font-extrabold leading-[1] tracking-tight sm:text-6xl lg:text-7xl">
            {post.title}
          </h1>

          <p className="mt-6 text-xl leading-snug text-fg/75">{post.excerpt}</p>

          <div className="mt-6 flex items-center gap-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-accent">
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
              <p className="text-sm text-muted">AI &amp; Full-Stack Software Engineer</p>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-10">
          <div className="relative aspect-[2/1] overflow-hidden rounded-[1.5rem] border border-border bg-bg-soft">
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
          <div className="prose-ak mx-auto max-w-[44rem] rounded-[1.5rem] bg-bg/80 p-0 backdrop-blur sm:p-2">
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
            <h2 className="eyebrow mb-6">Keep reading</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {relatedPosts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group rounded-[1.25rem] border border-border bg-bg/80 p-5 transition-colors hover:border-accent"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted">{p.category}</span>
                    <ArrowUpRight className="h-4 w-4 text-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
                  </div>
                  <p className="mt-3 line-clamp-3 font-display text-lg font-bold leading-tight group-hover:text-accent">{p.title}</p>
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
