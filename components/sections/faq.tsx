import { Plus } from "lucide-react";

import { site } from "@/content/site";

export function fillFaq(text: string): string {
  return text.replace(/\{contactEmail\}/g, site.brand.contactEmail);
}

/** FAQ — native <details>, works without JS; answers restate site copy only. */
export function Faq() {
  return (
    <section
      id="faq"
      className="relative border-b border-white/10 bg-forge-raised py-16 lg:py-24"
      aria-labelledby="faq-heading"
    >
      <div className="container grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <h2 id="faq-heading" className="text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
          {site.faq.heading}
        </h2>
        <div className="border-t border-white/10">
          {site.faq.items.map((item) => (
            <details key={item.q} className="group border-b border-white/10">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-md py-4 text-lg font-semibold tracking-[-0.01em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forge-blue [&::-webkit-details-marker]:hidden">
                {item.q}
                <Plus
                  className="h-5 w-5 shrink-0 text-forge-gold-soft transition-transform duration-200 ease-out group-open:rotate-45"
                  aria-hidden="true"
                />
              </summary>
              <p className="max-w-2xl pb-5 text-base leading-relaxed text-muted-foreground">
                {fillFaq(item.a)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
