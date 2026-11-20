import { ArrowDown, Brain, Globe, Headphones, LineChart, Smartphone, Timer, type LucideIcon } from "lucide-react";

import { site } from "@/content/site";
import { Button } from "@/components/ui/button";

const ICONS: Record<string, LucideIcon> = {
  brain: Brain,
  headphones: Headphones,
  timer: Timer,
  chart: LineChart,
  globe: Globe,
  apple: Smartphone,
  android: Smartphone,
};

const first = site.tracks.items.find((t) => t.status === "first");
const next = site.tracks.items.filter((t) => t.status !== "first");

/**
 * Hero — server component. Left: the promise + primary CTA. Right: a spec-sheet
 * panel ("Forge CISSP at a glance") restating only facts from content/site.ts.
 * No scroll-triggered motion; the panel enters once from scale(0.95)+opacity
 * (240ms ease-out) and is static under prefers-reduced-motion.
 */
export function Hero() {
  const p = site.hero.panel;
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden border-b border-white/10"
      aria-labelledby="hero-heading"
    >
      <div className="hero-grid absolute inset-0 -z-10" aria-hidden="true" />

      <div className="container grid gap-12 pb-16 pt-12 sm:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:pb-24 lg:pt-20">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.16em] text-forge-gold-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-forge-gold" aria-hidden="true" />
            {site.hero.eyebrow}
          </p>

          <h1
            id="hero-heading"
            className="mt-5 text-[2.5rem] font-extrabold leading-[1.02] tracking-[-0.035em] min-[380px]:text-5xl sm:text-6xl lg:text-7xl"
          >
            {site.hero.tagline}
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {site.hero.descriptor}
          </p>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Button asChild variant="gold" size="lg">
              <a href="#waitlist">
                {site.hero.cta}
                <ArrowDown aria-hidden="true" />
              </a>
            </Button>
          </div>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            {site.hero.waitlistLine}
          </p>
        </div>

        {/* Spec sheet */}
        <aside
          aria-label={p.label}
          className="animate-enter rounded-[20px] border border-white/10 bg-forge-raised/90 backdrop-blur-sm"
          style={{ animationDelay: "60ms" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-5 py-4 sm:px-6">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-foreground/90">
              {p.label}
            </p>
            {first && (
              <span className="rounded-full border border-forge-gold/50 bg-forge-gold/10 px-2.5 py-1 font-mono text-xs font-medium text-forge-gold-soft">
                {first.name} · {p.status}
              </span>
            )}
          </div>

          <dl className="divide-y divide-white/10">
            <div className="px-5 py-4 sm:px-6">
              <dt className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">{p.modesLabel}</dt>
              <dd className="mt-3">
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {site.features.items.map((f) => {
                    const Icon = ICONS[f.icon] ?? Brain;
                    return (
                      <li key={f.title} className="flex items-center gap-2.5 text-[15px] font-medium">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-forge-blue/15 text-forge-blue-soft ring-1 ring-forge-blue/25">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        {f.title}
                      </li>
                    );
                  })}
                </ul>
              </dd>
            </div>

            <div className="px-5 py-4 sm:px-6">
              <dt className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">{p.platformsLabel}</dt>
              <dd className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                {site.platforms.items.map((pl) => {
                  const Icon = ICONS[pl.icon] ?? Globe;
                  return (
                    <span key={pl.name} className="inline-flex items-center gap-2 text-[15px]">
                      <Icon className={pl.live ? "h-4 w-4 text-forge-blue-soft" : "h-4 w-4 text-muted-foreground"} aria-hidden="true" />
                      <span className="font-medium">{pl.name}</span>
                      <span className={pl.live ? "font-mono text-xs text-forge-gold-soft" : "font-mono text-xs text-muted-foreground"}>
                        {pl.live ? site.platforms.liveLabel : site.platforms.comingSoonLabel}
                      </span>
                    </span>
                  );
                })}
              </dd>
            </div>

            <div className="px-5 py-4 sm:px-6">
              <dt className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">{p.nextLabel}</dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-foreground/90">
                {next.map((t) => t.name).join(" · ")}
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
