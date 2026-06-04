"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { Reveal } from "./Reveal";
import type { BlogPost } from "@/lib/data";
import { cn } from "@/lib/utils";

function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border bg-white/[0.02] transition-all duration-300 hover:border-accent/30 hover:bg-white/[0.04]",
        featured && "md:flex-row"
      )}
    >
      <div
        className={cn(
          "relative aspect-[16/9] overflow-hidden bg-bg-soft",
          featured && "md:aspect-auto md:w-1/2"
        )}
      >
        <Image
          src={post.thumbnail}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg/60 to-transparent" />
        <span
          className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium backdrop-blur-md"
          style={{ background: "rgba(124, 92, 255, 0.2)", color: "#7c5cff" }}
        >
          {post.category}
        </span>
      </div>

      <div className={cn("flex flex-1 flex-col p-5 sm:p-6", featured && "md:p-8")}>
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

        <h3
          className={cn(
            "mt-3 font-semibold leading-snug tracking-tight transition-colors group-hover:text-accent",
            featured ? "text-xl sm:text-2xl" : "text-lg"
          )}
        >
          {post.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
          {post.excerpt}
        </p>

        <div className="mt-auto flex items-center gap-3 pt-5">
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-accent/20 to-accent-2/20">
            {post.author.avatar ? (
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                className="object-cover"
                style={{ objectPosition: "center 20%" }}
                sizes="32px"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xs font-bold">AK</span>
            )}
          </div>
          <div>
            <p className="text-sm font-medium">{post.author.name}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-accent">
          Read article
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

export function BlogSection({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  const featuredPost = posts.find((p) => p.featured) || posts[0];
  const otherPosts = posts.filter((p) => p.slug !== featuredPost.slug).slice(0, 5);

  return (
    <section id="blog" className="section-pad border-t border-border">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex items-end justify-between">
            <div>
              <p className="section-label">Blog</p>
              <h2 className="mt-4 text-balance text-[1.75rem] font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
                Insights & <span className="gradient-text">Technical Writing</span>
              </h2>
              <p className="mt-4 max-w-xl text-muted">
                Deep dives into AI, full-stack development, and software engineering best practices.
              </p>
            </div>
            <Link
              href="/blog"
              className="hidden items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-accent/40 hover:bg-white/[0.04] sm:flex"
            >
              View all articles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 space-y-6">
          {/* Featured Post */}
          <Reveal>
            <BlogCard post={featuredPost} featured />
          </Reveal>

          {/* Other Posts Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherPosts.map((post, i) => (
              <Reveal key={post.slug} delay={i * 0.1}>
                <BlogCard post={post} />
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-8 sm:hidden">
          <Link
            href="/blog"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium transition-colors hover:border-accent/40 hover:bg-white/[0.04]"
          >
            View all articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
