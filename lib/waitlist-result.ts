/** Native form attributes. The JS path still preventDefault + fetch JSON to this URL. */
export const WAITLIST_FORM_METHOD = "post";
export const WAITLIST_FORM_ACTION = "/api/waitlist";

export const WAITLIST_RESULTS = [
  "ok",
  "required",
  "invalid",
  "rate",
  "error",
] as const;

export type WaitlistResult = (typeof WAITLIST_RESULTS)[number];

/** Status-only path for the static result pages; never includes user input. */
export function waitlistRedirectPath(result: WaitlistResult): string {
  return `/waitlist/${result}`;
}

export function parseWaitlistResult(value: unknown): WaitlistResult | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (typeof raw !== "string") return undefined;
  return (WAITLIST_RESULTS as readonly string[]).includes(raw)
    ? (raw as WaitlistResult)
    : undefined;
}
