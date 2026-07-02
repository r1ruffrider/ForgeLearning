import Link from "next/link";

import { site } from "@/content/site";
import { Logo } from "@/components/logo";
import { Footer } from "@/components/sections/footer";

type LegalDoc = {
  title: string;
  intro: string;
  sections: ReadonlyArray<{ heading: string; body: ReadonlyArray<string> }>;
};

/** Substitute tokens ({contactEmail}) shared across legal copy. */
function fill(text: string): string {
  return text.replace(/\{contactEmail\}/g, site.brand.contactEmail);
}

/**
 * Shared shell for /privacy and /terms — dark Forge theme, wordmark linking
 * home, a single readable prose column, and the site footer. Content comes
 * entirely from content/site.ts.
 */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-forge-gold focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-forge-navy"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center">
          <Link
            href="/"
            className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forge-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={`${site.brand.name} — home`}
          >
            <Logo />
          </Link>
        </div>
      </header>

      <main id="main" className="relative">
        <div className="forge-glow absolute inset-x-0 top-0 h-64 -z-10" aria-hidden="true" />
        <article className="container max-w-2xl py-16 lg:py-24">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {doc.title}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last updated: {site.legal.updated}
          </p>

          <p className="mt-8 text-lg leading-relaxed text-foreground/90">
            {fill(doc.intro)}
          </p>

          <div className="mt-10 space-y-10">
            {doc.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-semibold tracking-tight">
                  {section.heading}
                </h2>
                <div className="mt-3 space-y-4">
                  {section.body.map((paragraph, i) => (
                    <p
                      key={i}
                      className="leading-relaxed text-muted-foreground"
                    >
                      {fill(paragraph)}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-14 border-t border-white/10 pt-8">
            <Link
              href="/"
              className="text-sm font-medium text-forge-blue-soft underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forge-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              ← Back to Forge Learning
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
