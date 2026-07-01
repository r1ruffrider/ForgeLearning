import { NextResponse } from "next/server";
import { validateSignup } from "@/lib/validation";
import {
  getSupabase,
  isSupabaseConfigured,
  PG_UNIQUE_VIOLATION,
} from "@/lib/supabase";

// Waitlist inserts must hit the live DB, never a static/edge cache.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Best-effort in-memory rate limiter (per-IP). Deliberately dependency-free to
 * keep "zero extra config" — no Upstash, no extra env vars. Because it lives in
 * process memory it resets on redeploy/scale-out and won't coordinate across
 * serverless instances. Good enough to slow bots, not a security boundary.
 */
const WINDOW_MS = 60_000;
const MAX_HITS = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  if (entry.count > MAX_HITS) return true;
  return false;
}

// Opportunistic cleanup so the map can't grow unbounded.
function sweep() {
  if (hits.size < 5_000) return;
  const now = Date.now();
  for (const [ip, entry] of hits) {
    if (now > entry.resetAt) hits.delete(ip);
  }
}

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: Request) {
  sweep();

  const ip = clientIp(req);
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again shortly." },
      { status: 429 }
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }

  // Honeypot: real users never fill a hidden field. Pretend success so bots
  // don't learn they were caught.
  if (typeof payload.company === "string" && payload.company.trim() !== "") {
    return NextResponse.json({ ok: true, deduped: false });
  }

  const result = validateSignup(payload);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: 400 }
    );
  }

  const { email, track, source } = result.data;

  // Local-only fallback: no Supabase configured → log and succeed so the page
  // works end-to-end in development.
  if (!isSupabaseConfigured) {
    console.info("[waitlist] (local-only) signup:", { email, track, source });
    return NextResponse.json({ ok: true, deduped: false, mode: "local" });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again in a moment." },
      { status: 500 }
    );
  }

  const { error } = await supabase
    .from("waitlist")
    .insert({ email, track, source });

  if (error) {
    // Duplicate email = already on the list → treat as success.
    if (error.code === PG_UNIQUE_VIOLATION) {
      return NextResponse.json({ ok: true, deduped: true });
    }
    console.error("[waitlist] insert failed:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again in a moment." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, deduped: false });
}
