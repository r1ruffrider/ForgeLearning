import { Brain, Headphones, Timer, LineChart, type LucideIcon } from "lucide-react";

import { site } from "@/content/site";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

const ICONS: Record<string, LucideIcon> = {
  brain: Brain,
  headphones: Headphones,
  timer: Timer,
  chart: LineChart,
};

export function Features() {
  return (
    <section
      id="features"
      className="relative py-20 lg:py-28"
      aria-labelledby="features-heading"
    >
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2
            id="features-heading"
            className="text-3xl font-bold tracking-tight sm:text-4xl"
          >
            {site.features.heading}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {site.features.subheading}
          </p>
        </Reveal>

        <RevealGroup className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {site.features.items.map((feature) => {
            const Icon = ICONS[feature.icon] ?? Brain;
            return (
              <RevealItem key={feature.title}>
                <article className="glass group h-full rounded-2xl p-6 transition-colors duration-300 hover:border-forge-blue/30 hover:bg-white/[0.06]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forge-blue/15 ring-1 ring-forge-blue/25 transition-colors group-hover:bg-forge-blue/25">
                    <Icon
                      className="h-6 w-6 text-forge-blue-soft"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-forge-gold-soft">
                    {feature.tagline}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {feature.body}
                  </p>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
