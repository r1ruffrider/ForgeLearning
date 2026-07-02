import type { Metadata } from "next";

import { site } from "@/content/site";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: `${site.legal.terms.title} — ${site.brand.name}`,
  description: "Interim terms for the Forge Learning waitlist.",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return <LegalPage doc={site.legal.terms} />;
}
