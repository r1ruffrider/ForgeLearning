import type { MetadataRoute } from "next";
import { site } from "@/content/site";

const AI_CRAWLERS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "Claude-SearchBot",
  "anthropic-ai", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot",
  "Applebot-Extended", "meta-externalagent", "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
      ...AI_CRAWLERS.map((ua) => ({ userAgent: ua, allow: "/", disallow: "/api/" })),
    ],
    sitemap: `${site.seo.url}/sitemap.xml`,
  };
}
