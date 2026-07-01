import { Header } from "@/components/header";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { Tracks } from "@/components/sections/tracks";
import { Platforms } from "@/components/sections/platforms";
import { FinalCta } from "@/components/sections/final-cta";
import { Footer } from "@/components/sections/footer";

export default function Home() {
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
        <Tracks />
        <Platforms />
        <FinalCta />
      </main>

      <Footer />
    </>
  );
}
