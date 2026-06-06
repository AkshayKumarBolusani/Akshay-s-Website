import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { getBlogPosts } from "@/lib/data";
import { site } from "@/lib/site";
import { toSchemaDateTime } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Blog",
  description: "Technical insights on AI, machine learning, full-stack development, and software engineering by Akshay Kumar Bolusani.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog — Akshay Kumar Bolusani",
    description: "Technical insights on AI, machine learning, full-stack development, and software engineering.",
    url: `${site.url}/blog`,
  },
};

function BlogCard({ post }: { post: ReturnType<typeof getBlogPosts>[0] }) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white/[0.02] transition-all duration-300 hover:border-accent/30 hover:bg-white/[0.04]"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-bg-soft">
        <Image
          src={post.thumbnail}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg/60 to-transparent" />
        <span
          className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium backdrop-blur-md"
          style={{ background: "rgba(124, 92, 255, 0.2)", color: "#7c5cff" }}
        >
          {post.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {post.readTime}
          </span>
        </div>

        <h2 className="mt-3 text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-accent">
          {post.title}
        </h2>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
          {post.excerpt}
        </p>

        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-white/[0.02] px-2.5 py-1 text-[0.65rem] text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
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
    <main className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[50vh]">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
      </div>

      <article className="mx-auto max-w-6xl px-4 pb-24 pt-[max(6.5rem,env(safe-area-inset-top,0px)+5rem)] sm:px-5 sm:pb-28 sm:pt-28">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-faint transition-colors hover:text-fg"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> BACK HOME
        </Link>

        <Reveal className="mt-8">
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Blog & <span className="gradient-text">Technical Writing</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Deep dives into AI, machine learning, full-stack development, and software engineering best practices.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.05}>
              <BlogCard post={post} />
            </Reveal>
          ))}
        </div>

        {posts.length === 0 && (
          <Reveal className="mt-12">
            <div className="rounded-2xl border border-border bg-white/[0.02] p-12 text-center">
              <p className="text-muted">No blog posts yet. Check back soon!</p>
            </div>
          </Reveal>
        )}
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }}
      />
    </main>
  );
}
