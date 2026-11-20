import { site } from "@/content/site";
import { fillFaq } from "@/components/sections/faq";

/** Organization + WebSite + FAQPage structured data, generated from content/site.ts. */
export function JsonLd() {
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: site.brand.name,
      url: site.seo.url,
      logo: `${site.seo.url}/icon.svg`,
      email: site.brand.contactEmail,
      description: site.hero.descriptor,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: site.brand.name,
      url: site.seo.url,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: site.faq.items.map((i) => ({
        "@type": "Question",
        name: i.q,
        acceptedAnswer: { "@type": "Answer", text: fillFaq(i.a) },
      })),
    },
  ];
  return (
    <script
      type="application/ld+json"
      // JSON from our own static content; "<" escaped so it can't close the tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
