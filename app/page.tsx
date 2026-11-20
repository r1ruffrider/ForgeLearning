import { Header } from "@/components/header";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { MidCta } from "@/components/sections/mid-cta";
import { Tracks } from "@/components/sections/tracks";
import { Platforms } from "@/components/sections/platforms";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { Footer } from "@/components/sections/footer";
import { JsonLd } from "@/components/json-ld";
import { parseWaitlistResult, type WaitlistResult } from "@/lib/waitlist-result";
import { site } from "@/content/site";
import { TOO_MANY } from "@/lib/waitlist-route";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ waitlist?: string | string[] }>;
}) {
  const waitlistResult = parseWaitlistResult((await searchParams).waitlist);
  const waitlistError = waitlistErrorMessage(waitlistResult);
  return (
    <>
      {/* Skip link for keyboard users */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-forge-gold focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-forge-navy"
      >
        Skip to content
      </a>

      <Header />

      <main id="main">
        <Hero />
        <Features />
        <MidCta />
        <Tracks />
        <Platforms />
        <Faq />
        <FinalCta waitlistResult={waitlistResult} waitlistError={waitlistError} />
      </main>

      <Footer />
      <JsonLd />
    </>
  );
}

function waitlistErrorMessage(result?: WaitlistResult): string | null {
  // Reuse the JS-path strings; invent no copy.
  if (!result || result === "ok") return null;
  if (result === "required") return site.waitlistForm.errors.emailRequired;
  if (result === "invalid") return site.waitlistForm.errors.emailInvalid;
  if (result === "rate") return TOO_MANY.error;
  return site.waitlistForm.errors.generic;
}
