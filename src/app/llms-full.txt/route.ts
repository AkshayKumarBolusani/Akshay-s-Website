import { getBlogPosts, getProfile, getProjects } from "@/lib/data";
import { site } from "@/lib/site";

// Full plain-text knowledge file for AI answer engines (GEO). Generated from the same data as the site,
// so it can never drift out of date.
export function GET() {
  const profile = getProfile();
  const projects = getProjects();
  const posts = getBlogPosts();
  const L: string[] = [];

  L.push(`# ${site.name} — ${site.role}`, "", `> ${site.longDescription}`, "");
  L.push("## Facts", "");
  L.push(`- Location: ${site.location}`);
  L.push(`- Email: ${site.email}`);
  L.push(`- Website: ${site.url}`);
  L.push(`- LinkedIn: ${site.socials.linkedin}`);
  L.push(`- GitHub: ${site.socials.github}`);
  L.push(`- X (Twitter): ${site.socials.twitter}`);
  L.push(`- Languages: ${site.languages.join(", ")}`);
  L.push(`- Open to: ${site.availability.join("; ")}`, "");

  L.push("## Experience", "");
  for (const e of profile.experience) L.push(`- **${e.role}**, ${e.organization} (${e.period}): ${e.description}`);
  L.push("", "## Education", "");
  for (const ed of profile.educationList ?? []) L.push(`- **${ed.title}**, ${ed.org} (${ed.period}) — ${ed.score}`);
  L.push("", "## Research, leadership and achievements", "");
  for (const l of profile.leadership ?? []) L.push(`- **${l.title}** (${l.year}): ${l.detail}`);

  if (profile.projectKaro) {
    const pk = profile.projectKaro;
    L.push("", "## ProjectKaro (founded " + (pk.since ?? "2024") + ")", "", pk.description, "");
    L.push(`Website: ${pk.url}`, `Services: ${pk.services.join(", ")}`);
  }
  if (profile.gopyata) {
    const g = profile.gopyata;
    L.push("", `## ${g.name} (founder: ${site.name})`, "", `${g.tagline} ${g.description}`, "", `Website: ${g.url}`);
    if (g.audiences?.length) L.push(`Built around: ${g.audiences.join(", ")}`);
    for (const o of g.offerings ?? []) L.push(`- ${o.name} (${o.tag}): ${o.detail}`);
    if (g.disclaimer) L.push("", g.disclaimer);
  }

  const clientLines = projects.flatMap((p) => (p.clients ?? []).map((c) => `- ${c.name}, ${c.org} — ${p.title}${c.url ? ` (${c.url})` : ""}`));
  if (clientLines.length) L.push("", "## Clients", "", ...clientLines);

  L.push("", "## Skills", "");
  for (const [k, v] of Object.entries(site.skills)) L.push(`- ${k}: ${v.join(", ")}`);

  L.push("", "## Projects", "");
  for (const p of projects) {
    L.push(`### ${p.title} (${p.year}, ${p.category})`, "", p.tagline, "");
    L.push(p.description, "");
    if (p.problem) L.push(`- Problem: ${p.problem}`);
    if (p.solution) L.push(`- Solution: ${p.solution}`);
    if (p.tech.length) L.push(`- Tech: ${p.tech.join(", ")}`);
    if (p.metrics.length) L.push(`- Metrics: ${p.metrics.map((m) => `${m.label} ${m.value}`).join("; ")}`);
    L.push(`- Case study: ${site.url}/project/${p.slug}`, "");
  }

  L.push("## Writing", "");
  for (const post of posts) L.push(`- [${post.title}](${site.url}/blog/${post.slug}) — ${post.excerpt}`);
  L.push("", `Updated: ${new Date().toISOString().slice(0, 10)}`, "");

  return new Response(L.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400" },
  });
}
