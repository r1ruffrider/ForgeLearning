import { Brain, Headphones, LineChart, Timer, type LucideIcon } from "lucide-react";

import { site } from "@/content/site";

const ICONS: Record<string, LucideIcon> = {
  brain: Brain,
  headphones: Headphones,
  timer: Timer,
  chart: LineChart,
};

// Drawn as one study flow: practice → understand → listen → track.
const ORDER = ["timer", "brain", "headphones", "chart"];
const steps = ORDER.map((icon) => site.features.items.find((f) => f.icon === icon)!).filter(Boolean);

/**
 * "What you get" — the four features drawn as a connected flow on a rail
 * (vertical on phones, horizontal from lg), separated by hairlines rather than
 * boxed into identical cards.
 */
export function Features() {
  return (
    <section
      id="features"
      className="relative border-b border-white/10 bg-forge-raised py-16 lg:py-24"
      aria-labelledby="features-heading"
    >
      <div className="container">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-forge-gold-soft">
              {site.features.flowLabel}
            </p>
            <h2
              id="features-heading"
              className="mt-3 text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl lg:text-5xl"
            >
              {site.features.heading}
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground lg:justify-self-end">
            {site.features.subheading}
          </p>
        </div>

        <ol className="relative mt-12 grid gap-0 lg:mt-16 lg:grid-cols-4">
          {/* rail */}
          <span
            aria-hidden="true"
            className="absolute bottom-6 left-[23px] top-6 w-px bg-forge-gold/40 lg:bottom-auto lg:left-6 lg:right-6 lg:top-[23px] lg:h-px lg:w-auto"
          />
          {steps.map((f, i) => {
            const Icon = ICONS[f.icon] ?? Brain;
            return (
              <li key={f.title} className="relative flex gap-5 pb-10 last:pb-0 lg:flex-col lg:gap-6 lg:pb-0 lg:pr-8">
                <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-background text-forge-blue-soft">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")} · {f.step}
                  </p>
                  <h3 className="mt-2 text-xl font-bold tracking-[-0.02em]">{f.title}</h3>
                  <p className="mt-1 text-base font-semibold text-forge-gold-soft">{f.tagline}</p>
                  <p className="mt-2 max-w-sm text-base leading-relaxed text-muted-foreground">{f.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
