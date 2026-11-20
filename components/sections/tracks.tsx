import { site } from "@/content/site";

const first = site.tracks.items.find((t) => t.status === "first");
const rest = site.tracks.items.filter((t) => t.status !== "first");

/** Track list as a spec sheet: CISSP leads, the rest as a hairline list. */
export function Tracks() {
  return (
    <section
      id="tracks"
      className="relative border-b border-white/10 py-16 lg:py-24"
      aria-labelledby="tracks-heading"
    >
      <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <h2
            id="tracks-heading"
            className="text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl"
          >
            {site.tracks.heading}
          </h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
            {site.tracks.subheading}
          </p>
        </div>

        <div>
          {first && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-forge-gold/50 bg-forge-gold/[0.08] px-5 py-5 sm:px-6">
              <p className="text-3xl font-extrabold tracking-[-0.03em] text-forge-gold-soft sm:text-4xl">
                {first.name}
              </p>
              <span className="rounded-full bg-forge-gold px-3 py-1 font-mono text-xs font-medium uppercase tracking-[0.1em] text-forge-navy">
                {site.tracks.labels.first}
              </span>
            </div>
          )}
          <ul className="mt-4 grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3">
            {rest.map((t) => (
              <li
                key={t.name}
                className="flex items-baseline justify-between gap-3 border-b border-white/10 px-1 py-3.5 min-[420px]:pr-5"
              >
                <span className="text-base font-semibold">{t.name}</span>
                <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
                  {site.tracks.labels.soon}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
