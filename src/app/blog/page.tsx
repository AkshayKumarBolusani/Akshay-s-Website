import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Clock, Calendar } from "lucide-react";
import { getBlogPosts } from "@/lib/data";
import { site } from "@/lib/site";
import { breadcrumbLd, pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { toSchemaDateTime } from "@/lib/utils";
import { FadeUp, SplitReveal } from "@/components/ui/motion";

export const metadata: Metadata = pageMeta({
  title: "Writing — Notes on AI & Engineering",
  description:
    "Deep dives on AI agents, RAG, LLM inference, React and local-first software by Akshay Kumar Bolusani.",
  path: "/blog",
});

function BlogCard({ post, big }: { post: ReturnType<typeof getBlogPosts>[0]; big?: boolean }) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex flex-col overflow-hidden rounded-[1.5rem] border border-border bg-bg/80 backdrop-blur transition-colors duration-500 hover:border-accent ${big ? "lg:flex-row" : ""}`}
      data-cursor="Read"
    >
      <div className={`relative overflow-hidden bg-bg-soft ${big ? "aspect-[16/9] lg:aspect-auto lg:w-[58%]" : "aspect-[16/10]"}`}>
        <Image
          src={post.thumbnail}
          alt={post.title}
          fill
          className="object-cover grayscale-[40%] transition-[transform,filter] duration-700 group-hover:scale-105 group-hover:grayscale-0"
          sizes={big ? "(max-width: 1024px) 100vw, 58vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        />
        <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 font-mono text-[0.72rem] font-bold uppercase tracking-[0.15em] text-ink">
          {post.category}
        </span>
      </div>

      <div className={`flex flex-1 flex-col p-6 ${big ? "sm:p-10" : "sm:p-7"}`}>
        <div className="flex items-center gap-4 font-mono text-[0.72rem] uppercase tracking-[0.15em] text-muted">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {post.readTime}
          </span>
        </div>
        <h2 className={`mt-4 font-display font-bold leading-[1.05] tracking-tight transition-colors group-hover:text-accent ${big ? "text-3xl sm:text-5xl" : "text-2xl"}`}>
          {post.title}
        </h2>
        <p className={`mt-3 text-muted ${big ? "text-lg" : "line-clamp-2 text-sm"}`}>{post.excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-6 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-fg/80 group-hover:text-accent">
          Read <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
        </span>
      </div>
    </Link>
  );
}

export default function BlogPage() {
  const posts = getBlogPosts();

  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Akshay Kumar Bolusani's Blog",
    description: "Technical insights on AI, machine learning, and software engineering.",
    url: `${site.url}/blog`,
    author: {
      "@type": "Person",
      name: site.name,
      url: site.url,
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      datePublished: toSchemaDateTime(post.publishedAt),
      url: `${site.url}/blog/${post.slug}`,
      author: {
        "@type": "Person",
        name: post.author.name,
      },
    })),
  };

  return (
    <main className="gutter relative pb-24 pt-28 sm:pt-36">
      <p className="eyebrow">Writing · {posts.length} posts</p>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
        <h1 className="display-xl max-w-full min-w-0 text-[20vw] leading-[0.8] sm:text-[14vw]">
          <SplitReveal text="Notes" />
        </h1>
        <p className="mb-3 max-w-sm text-lg text-fg/75">
          Deep dives on AI agents, RAG, inference, React and the craft of shipping software.
        </p>
      </div>

      {posts[0] && (
        <FadeUp className="mt-14">
          <BlogCard post={posts[0]} big />
        </FadeUp>
      )}

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.slice(1).map((post, i) => (
          <FadeUp key={post.slug} delay={(i % 3) * 0.06}>
            <BlogCard post={post} />
          </FadeUp>
        ))}
      </div>

      <JsonLd data={[blogLd, breadcrumbLd([{ name: "Writing", path: "/blog" }])]} />
    </main>
  );
}
