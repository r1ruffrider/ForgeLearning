import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { site } from "@/content/site";
import { WaitlistResultPage } from "@/components/waitlist-result-page";
import { waitlistResultMessage } from "@/components/waitlist-result-panel";
import {
  WAITLIST_RESULTS,
  parseWaitlistResult,
} from "@/lib/waitlist-result";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return WAITLIST_RESULTS.map((result) => ({ result }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ result: string }>;
}): Promise<Metadata> {
  const result = parseWaitlistResult((await params).result);
  if (!result) return { robots: { index: false, follow: false } };
  return {
    title: `${waitlistResultMessage(result)} — ${site.brand.name}`,
    robots: { index: false, follow: false },
  };
}

export default async function WaitlistStatusPage({
  params,
}: {
  params: Promise<{ result: string }>;
}) {
  const result = parseWaitlistResult((await params).result);
  if (!result) notFound();
  return <WaitlistResultPage result={result} />;
}
