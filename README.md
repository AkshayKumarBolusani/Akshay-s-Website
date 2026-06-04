# Akshay Labs

> An interactive software engineering & AI laboratory — the personal brand site of **Akshay Kumar Bolusani**.

Not a portfolio template. A cinematic, scroll-driven experience: an animated hero, an
interactive **Project Galaxy**, a searchable **Labs** archive, a website studio, auto-loading
media & certifications, a recruiter fast-track, and a local **Ask Akshay AI** assistant — all
statically generated, SEO/AEO/GEO-optimized, and accessible.

## Tech stack

- **Next.js 16** (App Router) · **TypeScript** · **React 19**
- **Tailwind CSS v4** · **Framer Motion** · **Three.js / React Three Fiber**
- **lucide-react** icons · zero database (file-based content)

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static production build
```

## Add your photo

Drop a transparent PNG at **`public/akshay.png`**. The hero reveals it automatically
(a graceful silhouette fallback shows until then).

## Content is managed with files — no CMS, no database

### Projects

1. Edit **`data/projects.json`**. Each entry:

```json
{
  "slug": "skincare-ai",
  "title": "SkinCare AI",
  "tagline": "...",
  "category": "Computer Vision",
  "domains": ["Healthcare AI"],
  "year": "2025",
  "rank": 2,
  "featured": true,
  "accent": "#FF6B8B",
  "imagesFolder": "skincare-ai",
  "tech": ["FastAPI", "Groq"],
  "github": "https://github.com/...",
  "metrics": [{ "label": "Accuracy", "value": "92.6%" }],
  "description": "...", "problem": "...", "solution": "...", "architecture": "...",
  "features": [], "challenges": [], "learnings": [], "futureScope": []
}
```

- `featured: true` → appears in the **Project Galaxy** (feature the top ~10).
- `featured: false` → appears in the **Labs** archive.
- `rank` controls ordering and star size.

2. **Drop screenshots** into `public/projects/<imagesFolder>/`. Every image is detected
   automatically (`.webp`, `.png`, `.jpg`, `.avif`) — no code changes needed. New project
   pages are generated at build time.

### Certifications

- Add metadata to `data/certifications.json` (grouped by Google / Microsoft / Deloitte / Coursera / Others).
- Drop certificate images into `public/certifications/` — matched in order to the JSON entries.

### Media & Awards

- Drop photos into `public/media/` or `public/awards/`. The gallery + lightbox build themselves.

### Résumé

- Drop a PDF into `public/resume/`. The "For Recruiters" section auto-links it for download.

### Timeline & stats

- `data/timeline.json` — the animated About journey.
- `data/achievements.json` — hero stats, website-category counts, and the recruiter skill matrix.

## SEO / AEO / GEO

- Per-page `Metadata` (Open Graph, Twitter cards, canonical URLs).
- Structured data: **Person**, **WebSite**, **FAQPage**, **BreadcrumbList**, and
  **SoftwareSourceCode** schema on every project page.
- `sitemap.xml` and `robots.txt` generated from your data.
- Semantic HTML, keyboard navigation, skip links, and `prefers-reduced-motion` support.

Update your domain in **`src/lib/site.ts`** (`url`) before deploying.

## Deploy to Vercel

```bash
vercel        # or push to GitHub and import the repo on vercel.com
```

No environment variables required — the AI assistant uses a local search index (no LLM cost).

---

© Akshay Kumar Bolusani · Hyderabad, India
