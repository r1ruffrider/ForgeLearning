import { ArrowUpRight, Globe, Smartphone, type LucideIcon } from "lucide-react";

import { site } from "@/content/site";

const ICONS: Record<string, LucideIcon> = {
  globe: Globe,
  apple: Smartphone,
  android: Smartphone,
};

/** Platforms as a single row of status lines; the live one carries the Log in link. */
export function Platforms() {
  return (
    <section
      id="platforms"
      className="relative border-b border-white/10 py-14 lg:py-20"
      aria-labelledby="platforms-heading"
    >
      <div className="container grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
        <div>
          <h2
            id="platforms-heading"
            className="text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl"
          >
            {site.platforms.heading}
          </h2>
          <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            {site.platforms.body}
          </p>
        </div>

        <ul className="grid gap-3 sm:grid-cols-3">
          {site.platforms.items.map((platform) => {
            const Icon = ICONS[platform.icon] ?? Globe;
            return (
              <li
                key={platform.name}
                className={
                  platform.live
                    ? "flex flex-col gap-2 rounded-[20px] border border-forge-blue/40 bg-forge-blue/10 px-5 py-4"
                    : "flex flex-col gap-2 rounded-[20px] border border-white/10 px-5 py-4"
                }
              >
                <span className="flex items-center gap-2.5 text-lg font-bold">
                  <Icon
                    className={platform.live ? "h-5 w-5 text-forge-blue-soft" : "h-5 w-5 text-muted-foreground"}
                    aria-hidden="true"
                  />
                  {platform.name}
                </span>
                <span className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
                  {platform.live ? site.platforms.liveLabel : site.platforms.comingSoonLabel}
                </span>
                {platform.live && (
                  <a
                    href={site.app.url}
                    className="-mx-1 inline-flex min-h-11 items-center gap-1 self-start rounded-md px-1 text-[15px] font-semibold text-forge-blue-soft underline-offset-4 transition-[color,transform] duration-200 ease-out hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forge-blue active:scale-[0.97] motion-reduce:active:scale-100"
                  >
                    {site.app.loginLabel}
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
