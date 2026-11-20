import { homepageMarkdown } from "@/lib/markdown-copy";

export const dynamic = "force-static";

export function GET() {
  return new Response(homepageMarkdown(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
