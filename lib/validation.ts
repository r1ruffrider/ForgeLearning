import { trackNames } from "@/content/site";

// Pragmatic email check — good enough for a waitlist, not RFC-perfect.
// The DB unique constraint is the real source of truth.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ValidatedSignup = {
  email: string;
  track: string | null;
  source: string;
};

export type ValidationResult =
  | { ok: true; data: ValidatedSignup }
  | { ok: false; error: string };

/**
 * Normalize + validate a waitlist submission. Shared shape between client and
 * server so error messaging stays consistent.
 */
export function validateSignup(input: {
  email?: unknown;
  track?: unknown;
  source?: unknown;
}): ValidationResult {
  const email =
    typeof input.email === "string" ? input.email.trim().toLowerCase() : "";

  if (!email) {
    return { ok: false, error: "Please enter your email address." };
  }
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return {
      ok: false,
      error: "That doesn't look like a valid email address.",
    };
  }

  // Track is optional; only accept values from our known list.
  let track: string | null = null;
  if (typeof input.track === "string" && input.track.trim()) {
    const candidate = input.track.trim();
    track = trackNames.includes(candidate) ? candidate : null;
  }

  const source =
    typeof input.source === "string" && input.source.trim()
      ? input.source.trim().slice(0, 64)
      : "landing";

  return { ok: true, data: { email, track, source } };
}

export function isValidEmail(email: string): boolean {
  const value = email.trim().toLowerCase();
  return value.length > 0 && value.length <= 254 && EMAIL_RE.test(value);
}
