import { ArrowDown } from "lucide-react";

import { site } from "@/content/site";
import { Button } from "@/components/ui/button";

/** Mid-page repeat of the one primary action. */
export function MidCta() {
  return (
    <section aria-label="Join the waitlist" className="border-b border-white/10">
      <div className="container flex flex-col items-start gap-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">{site.midCta.line}</p>
        <Button asChild variant="gold" size="lg" className="w-full sm:w-auto">
          <a href="#waitlist">
            {site.midCta.cta}
            <ArrowDown aria-hidden="true" />
          </a>
        </Button>
      </div>
    </section>
  );
}
