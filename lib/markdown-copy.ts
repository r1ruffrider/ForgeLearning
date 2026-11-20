import { site } from "@/content/site";

const fill = (t: string) => t.replace(/\{contactEmail\}/g, site.brand.contactEmail);
const first = site.tracks.items.find((t) => t.status === "first");
const soon = site.tracks.items.filter((t) => t.status !== "first").map((t) => t.name);

/** Homepage as clean markdown (served at /index.md), generated from content/site.ts. */
export function homepageMarkdown(): string {
  return [
    `# ${site.brand.name} — ${site.hero.tagline}`,
    "",
    site.hero.descriptor,
    "",
    `- ${site.hero.cta}: ${site.seo.url}/#waitlist`,
    `- ${site.app.loginLabel} (web app): ${site.app.url}`,
    "",
    `## ${site.features.heading}`,
    "",
    site.features.subheading,
    "",
    ...site.features.items.map((f) => `- **${f.title}** — ${f.tagline} ${f.body}`),
    "",
    `## ${site.tracks.heading}`,
    "",
    site.tracks.subheading,
    "",
    ...(first ? [`- ${first.name} — ${site.tracks.labels.first}`] : []),
    ...soon.map((n) => `- ${n} — ${site.tracks.labels.soon}`),
    "",
    `## ${site.platforms.heading}`,
    "",
    site.platforms.body,
    "",
    ...site.platforms.items.map(
      (p) => `- ${p.name}: ${p.live ? site.platforms.liveLabel : site.platforms.comingSoonLabel}`
    ),
    "",
    `## ${site.faq.heading}`,
    "",
    ...site.faq.items.flatMap((i) => [`### ${i.q}`, "", fill(i.a), ""]),
    `## ${site.finalCta.heading}`,
    "",
    site.finalCta.subtext,
    "",
    "## Links",
    "",
    `- Home: ${site.seo.url}`,
    `- Join the waitlist: ${site.seo.url}/#waitlist`,
    `- Web app (log in): ${site.app.url}`,
    `- Privacy Policy: ${site.seo.url}/privacy`,
    `- Terms: ${site.seo.url}/terms`,
    `- Contact: ${site.brand.contactEmail}`,
    "",
  ].join("\n");
}

/** llms.txt, generated from content/site.ts. */
export function llmsTxt(): string {
  return [
    `# ${site.brand.name}`,
    "",
    `> ${site.hero.descriptor} ${first ? `Forge ${first.name} is ${site.tracks.labels.first.toLowerCase()}.` : ""} Operated by Inspire Business Group LLC.`,
    "",
    "## What it does",
    ...site.features.items.map((f) => `- **${f.title}** - ${f.body}`),
    "",
    "## Who it is for",
    `- People studying for IT, cybersecurity and professional certifications: ${site.tracks.items.map((t) => t.name).join(", ")}.`,
    "",
    "## Platforms",
    ...site.platforms.items.map(
      (p) => `- ${p.name}: ${p.live ? site.platforms.liveLabel : site.platforms.comingSoonLabel}`
    ),
    "",
    "## FAQ",
    ...site.faq.items.flatMap((i) => [`- **${i.q}** ${fill(i.a)}`]),
    "",
    "## Links",
    `- [Homepage](${site.seo.url}/): waitlist`,
    `- [Homepage as markdown](${site.seo.url}/index.md)`,
    `- [Web app login](${site.app.url})`,
    `- [Privacy Policy](${site.seo.url}/privacy)`,
    `- [Terms](${site.seo.url}/terms)`,
    `- Contact: ${site.brand.contactEmail}`,
    "",
  ].join("\n");
}
