import type { Metadata } from "next";

import { site } from "@/content/site";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: `${site.legal.privacy.title} — ${site.brand.name}`,
  description: "How Forge Learning handles waitlist signups.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return <LegalPage doc={site.legal.privacy} />;
}
