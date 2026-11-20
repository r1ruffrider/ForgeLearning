import { site } from "@/content/site";
import { WaitlistForm } from "@/components/waitlist-form";
import { type WaitlistResult } from "@/lib/waitlist-result";

/** Final CTA on the gold brand band; the form sits in a dark panel on it. */
export function FinalCta({ waitlistResult, waitlistError }: { waitlistResult?: WaitlistResult; waitlistError?: string | null }) {
  return (
    <section
      id="waitlist"
      className="relative scroll-mt-16 bg-forge-gold py-16 text-forge-navy lg:py-24"
      aria-labelledby="final-cta-heading"
    >
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,28rem)] lg:gap-16">
          <div>
            <h2
              id="final-cta-heading"
              className="text-4xl font-extrabold leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl"
            >
              {site.finalCta.heading}
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-forge-gold-ink">
              {site.finalCta.subtext}
            </p>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.12em] text-forge-gold-ink">
              {site.finalCta.reassurance}
            </p>
          </div>

          <div className="dark-panel rounded-[20px] bg-background p-5 text-foreground shadow-[0_24px_60px_-24px_hsl(var(--forge-navy)/0.7)] sm:p-8">
            <WaitlistForm source="final-cta" idPrefix="final" initialResult={waitlistResult} initialError={waitlistError} />
          </div>
        </div>
      </div>
    </section>
  );
}
