import { Globe, Smartphone, type LucideIcon } from "lucide-react";

import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

const ICONS: Record<string, LucideIcon> = {
  globe: Globe,
  apple: Smartphone,
  android: Smartphone,
};

export function Platforms() {
  return (
    <section
      id="platforms"
      className="relative py-12 lg:py-16"
      aria-labelledby="platforms-heading"
    >
      <div className="container">
        <Reveal className="glass mx-auto max-w-4xl rounded-2xl px-6 py-10 text-center sm:px-10">
          <h2
            id="platforms-heading"
            className="text-2xl font-bold tracking-tight sm:text-3xl"
          >
            {site.platforms.heading}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            {site.platforms.body}
          </p>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {site.platforms.items.map((platform) => {
              const Icon = ICONS[platform.icon] ?? Globe;
              return (
                <li
                  key={platform.name}
                  className={cn(
                    "inline-flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm font-medium",
                    platform.live
                      ? "border-forge-blue/30 bg-forge-blue/10 text-foreground"
                      : "border-white/10 bg-white/[0.03] text-foreground/75"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      platform.live
                        ? "text-forge-blue-soft"
                        : "text-muted-foreground"
                    )}
                    aria-hidden="true"
                  />
                  {platform.name}
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {platform.live
                      ? site.platforms.liveLabel
                      : site.platforms.comingSoonLabel}
                  </span>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
