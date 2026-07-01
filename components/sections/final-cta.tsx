import { site } from "@/content/site";
import { Reveal } from "@/components/motion/reveal";
import { WaitlistForm } from "@/components/waitlist-form";

export function FinalCta() {
  return (
    <section
      id="waitlist"
      className="relative scroll-mt-20 py-20 lg:py-28"
      aria-labelledby="final-cta-heading"
    >
      {/* focused glow to draw the eye to the form */}
      <div className="forge-glow absolute inset-0 -z-10 opacity-80" aria-hidden="true" />

      <div className="container">
        <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className="text-center lg:text-left">
            <h2
              id="final-cta-heading"
              className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
            >
              {site.finalCta.heading}
            </h2>
            <p className="mt-5 text-lg text-muted-foreground">
              {site.finalCta.subtext}
            </p>
            <p className="mt-4 text-sm text-muted-foreground/80">
              {site.finalCta.reassurance}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="glass rounded-2xl p-6 sm:p-8">
              <WaitlistForm source="final-cta" idPrefix="final" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
