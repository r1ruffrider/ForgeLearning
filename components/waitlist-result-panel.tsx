import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { site } from "@/content/site";
import { type WaitlistResult } from "@/lib/waitlist-result";
import { TOO_MANY } from "@/lib/waitlist-route";

const copy = site.waitlistForm;

/** Existing JS-path strings only; invent no copy. */
export function waitlistResultMessage(result: WaitlistResult): string {
  if (result === "ok") return copy.thankYou.heading;
  if (result === "required") return copy.errors.emailRequired;
  if (result === "invalid") return copy.errors.emailInvalid;
  if (result === "rate") return TOO_MANY.error;
  return copy.errors.generic;
}

/**
 * Visible confirmation or error for a no-JS (or pre-hydration) POST.
 * No animation wrapper, so SSR markup is visible without JavaScript.
 */
export function WaitlistResultPanel({ result }: { result: WaitlistResult }) {
  const ok = result === "ok";
  return (
    <div className="glass flex flex-col items-center gap-3 rounded-2xl p-8 text-center">
      {ok ? (
        <div role="status" aria-live="polite">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-forge-gold/15 ring-1 ring-forge-gold/40">
            <CheckCircle2 className="h-6 w-6 text-forge-gold" aria-hidden="true" />
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">
            {copy.thankYou.heading}
          </h1>
          <p className="mt-3 max-w-sm text-muted-foreground">{copy.thankYou.body}</p>
        </div>
      ) : (
        <p role="alert" className="text-lg text-foreground">
          {waitlistResultMessage(result)}
        </p>
      )}
      <Link
        href="/#waitlist"
        className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-forge-blue-soft underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forge-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        ← Back to Forge Learning
      </Link>
    </div>
  );
}
