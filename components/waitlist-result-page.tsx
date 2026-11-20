import Link from "next/link";

import { site } from "@/content/site";
import { Logo } from "@/components/logo";
import { Footer } from "@/components/sections/footer";
import { WaitlistResultPanel } from "@/components/waitlist-result-panel";
import { type WaitlistResult } from "@/lib/waitlist-result";

export function WaitlistResultPage({ result }: { result: WaitlistResult }) {
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
            className="inline-flex min-h-11 items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forge-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={`${site.brand.name} — home`}
          >
            <Logo />
          </Link>
        </div>
      </header>

      <main id="main" className="relative">
        <div className="forge-glow absolute inset-x-0 top-0 h-64 -z-10" aria-hidden="true" />
        <div className="container max-w-lg py-16 lg:py-24">
          <WaitlistResultPanel result={result} />
        </div>
      </main>

      <Footer />
    </>
  );
}
