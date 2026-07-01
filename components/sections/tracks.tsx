import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

export function Tracks() {
  return (
    <section
      id="tracks"
      className="relative py-20 lg:py-28"
      aria-labelledby="tracks-heading"
    >
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2
            id="tracks-heading"
            className="text-3xl font-bold tracking-tight sm:text-4xl"
          >
            {site.tracks.heading}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {site.tracks.subheading}
          </p>
        </Reveal>

        <RevealGroup
          className="mx-auto mt-12 flex max-w-4xl flex-wrap items-center justify-center gap-3"
          stagger={0.04}
        >
          {site.tracks.items.map((track) => {
            const isFirst = track.status === "first";
            return (
              <RevealItem key={track.name}>
                <span
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium",
                    isFirst
                      ? "border-forge-gold/50 bg-forge-gold/10 text-forge-gold-soft"
                      : "border-white/10 bg-white/[0.04] text-foreground/80"
                  )}
                >
                  {track.name}
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                      isFirst
                        ? "bg-forge-gold/20 text-forge-gold-soft"
                        : "bg-white/5 text-muted-foreground"
                    )}
                  >
                    {isFirst
                      ? site.tracks.labels.first
                      : site.tracks.labels.soon}
                  </span>
                </span>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
