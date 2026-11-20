import {
  ACCEPTED,
  SERVER_ERROR,
  TOO_MANY,
  clientIp,
  coerceSource,
  limiterKey,
  rpcErrorOutcome,
} from "./waitlist-route";
import { waitlistRedirectPath, type WaitlistResult } from "./waitlist-result";

type ValidationResult =
  | { ok: true; data: { email: string; track: string | null; source: string } }
  | { ok: false; error: string };

export type JoinWaitlistArgs = {
  email: string;
  track: string | null;
  source: string;
  ip: string | null;
  secret: string;
};

export type WaitlistPostDeps = {
  rateLimited: (key: string) => boolean;
  isConfigured: boolean;
  secret: string | null;
  validateSignup: (input: {
    email?: unknown;
    track?: unknown;
    source?: unknown;
  }) => ValidationResult;
  joinWaitlist: (
    args: JoinWaitlistArgs,
  ) => Promise<{ error: { code?: string | null; message?: string | null } | null }>;
  logLocal?: (info: { domain: string; track: string | null; source: string }) => void;
  logMissingSecret?: () => void;
  logJoinError?: (code: string) => void;
};

export type WaitlistHttpResult = {
  status: number;
  body?: unknown;
  location?: string;
  headers?: Record<string, string>;
};

function isFormRequest(req: Request): boolean {
  const type = req.headers.get("content-type") ?? "";
  return (
    type.includes("application/x-www-form-urlencoded") ||
    type.includes("multipart/form-data")
  );
}

async function readPayload(
  req: Request,
): Promise<{ ok: true; payload: Record<string, unknown> } | { ok: false }> {
  if (isFormRequest(req)) {
    const form = await req.formData();
    const field = (name: string): string | undefined => {
      const value = form.get(name);
      return typeof value === "string" ? value : undefined;
    };
    return {
      ok: true,
      payload: {
        email: field("email"),
        track: field("track"),
        source: field("source"),
        company: field("company"),
      },
    };
  }
  try {
    const payload = (await req.json()) as unknown;
    if (payload === null || typeof payload !== "object" || Array.isArray(payload)) {
      return { ok: false };
    }
    return { ok: true, payload: payload as Record<string, unknown> };
  } catch {
    return { ok: false };
  }
}

function respond(
  req: Request,
  status: number,
  body: unknown,
  result: WaitlistResult,
): WaitlistHttpResult {
  if (isFormRequest(req)) {
    return { status: 303, location: waitlistRedirectPath(result) };
  }
  return { status, body };
}

function formResultForInvalid(payload: Record<string, unknown>): WaitlistResult {
  const raw = typeof payload.email === "string" ? payload.email.trim() : "";
  return raw ? "invalid" : "required";
}

/**
 * Shared JSON + urlencoded POST handler. GET never signs up.
 * Rate limit, honeypot, validateSignup, coerceSource, and join_waitlist
 * are the same protections as the JS path (the JS path has no origin or
 * consent check to mirror).
 */
export async function handleWaitlistRequest(
  req: Request,
  deps: WaitlistPostDeps,
): Promise<WaitlistHttpResult> {
  if (req.method !== "POST") {
    return { status: 405, headers: { Allow: "POST" }, body: { ok: false } };
  }

  const ip = clientIp(req.headers);
  if (deps.rateLimited(limiterKey(ip))) {
    return respond(req, 429, TOO_MANY, "rate");
  }

  const parsed = await readPayload(req);
  if (!parsed.ok) {
    return respond(req, 400, { ok: false, error: "Invalid request." }, "error");
  }
  const payload = parsed.payload;

  if (typeof payload.company === "string" && payload.company.trim() !== "") {
    return respond(req, 200, ACCEPTED, "ok");
  }

  const result = deps.validateSignup(payload);
  if (!result.ok) {
    return respond(
      req,
      400,
      { ok: false, error: result.error },
      formResultForInvalid(payload),
    );
  }

  const { email, track } = result.data;
  const source = coerceSource(result.data.source);

  if (!deps.isConfigured) {
    const domain = email.slice(email.lastIndexOf("@") + 1);
    deps.logLocal?.({ domain, track, source });
    return respond(req, 200, { ...ACCEPTED, mode: "local" }, "ok");
  }

  if (!deps.secret) {
    deps.logMissingSecret?.();
    return respond(req, 500, SERVER_ERROR, "error");
  }

  const { error } = await deps.joinWaitlist({
    email,
    track,
    source,
    ip,
    secret: deps.secret,
  });

  if (error) {
    const outcome = rpcErrorOutcome(error);
    if (outcome.logCode) deps.logJoinError?.(outcome.logCode);
    const formResult: WaitlistResult =
      outcome.status === 429 ? "rate" : outcome.status === 400 ? "invalid" : "error";
    return respond(req, outcome.status, outcome.body, formResult);
  }

  return respond(req, 200, ACCEPTED, "ok");
}
