import { ArrowDown } from "lucide-react";

import { site } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Embers } from "@/components/embers";

/**
 * Hero is a server component. The entrance is CSS-driven (`animate-rise`) rather
 * than JS/Framer-Motion, so the LCP heading paints immediately, stays visible
 * without JavaScript, and collapses to its final state under
 * prefers-reduced-motion (see globals.css).
 */
export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* ambient glow + texture */}
      <div className="forge-glow absolute inset-0 -z-10" aria-hidden="true" />
      <div className="grain absolute inset-0 -z-10 opacity-40" aria-hidden="true" />
      <Embers />

      <div className="container flex flex-col items-center pb-20 pt-24 text-center sm:pt-28 lg:pb-28 lg:pt-36">
        <div className="flex max-w-3xl flex-col items-center">
          <p
            className="mb-5 inline-flex animate-rise items-center rounded-full border border-forge-blue/25 bg-forge-blue/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-forge-blue-soft"
            style={{ animationDelay: "0ms" }}
          >
            {site.hero.eyebrow}
          </p>

          <h1
            id="hero-heading"
            className="animate-rise text-balance text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "80ms" }}
          >
            {site.hero.tagline}
          </h1>

          <p
            className="mt-6 max-w-2xl animate-rise text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl"
            style={{ animationDelay: "180ms" }}
          >
            {site.hero.descriptor}
          </p>

          <div
            className="mt-10 flex w-full animate-rise flex-col items-center gap-3"
            style={{ animationDelay: "280ms" }}
          >
            <Button asChild variant="gold" size="lg" className="w-full sm:w-auto">
              <a href="#waitlist">
                {site.hero.cta}
                <ArrowDown aria-hidden="true" />
              </a>
            </Button>
            <p className="max-w-md text-sm text-muted-foreground">
              {site.hero.waitlistLine}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
