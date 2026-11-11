import { NextResponse } from "next/server";
import { validateSignup } from "@/lib/validation";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  ACCEPTED,
  SERVER_ERROR,
  TOO_MANY,
  clientIp,
  coerceSource,
  limiterKey,
  routeSecret,
  rpcErrorOutcome,
} from "@/lib/waitlist-route";

// Waitlist inserts must hit the live DB, never a static/edge cache.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Best-effort in-memory rate limiter (per-IP). Deliberately dependency-free to
 * keep "zero extra config" — no Upstash, no extra env vars. Because it lives in
 * process memory it resets on redeploy/scale-out and won't coordinate across
 * serverless instances. Good enough to slow bots, not a security boundary.
 *
 * The boundary is in the database: public.join_waitlist() (forge-app
 * migrations 0025/0026) accepts calls only with this route's secret, and counts
 * them in Postgres per visitor IP (the IP passed below; bucket `waitlist_ip`,
 * 5 a minute, the same budget as here) plus a global backstop
 * (`waitlist_all`), shared by every instance.
 *
 * Both limits key a visitor the same way (limiterKey in lib/waitlist-route.ts,
 * and 0025): an IPv4 address is one visitor; an IPv6 address counts as its /64,
 * the usual allocation for one subscriber, so rotating addresses inside it does
 * not buy more attempts; an IPv4-mapped IPv6 address (::ffff:a.b.c.d) counts as
 * that IPv4 address. Anything unparsable, or no IP at all, is "unknown".
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

export async function POST(req: Request) {
  sweep();

  const ip = clientIp(req.headers);
  if (rateLimited(limiterKey(ip))) {
    return NextResponse.json(TOO_MANY, { status: 429 });
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
    return NextResponse.json(ACCEPTED);
  }

  const result = validateSignup(payload);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: 400 }
    );
  }

  const { email, track } = result.data;
  const source = coerceSource(result.data.source);

  // Local-only fallback: no Supabase configured → log and succeed so the page
  // works end-to-end in development.
  if (!isSupabaseConfigured) {
    // Never a full address in logs: the domain only.
    const domain = email.slice(email.lastIndexOf("@") + 1);
    console.info("[waitlist] (local-only) signup:", { domain, track, source });
    return NextResponse.json({ ...ACCEPTED, mode: "local" });
  }

  const secret = routeSecret(process.env);
  if (!secret) {
    // Fail closed: without the secret the database refuses every call anyway.
    console.error("[waitlist] WAITLIST_ROUTE_SECRET is not set");
    return NextResponse.json(SERVER_ERROR, { status: 500 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(SERVER_ERROR, { status: 500 });
  }

  // The only write path (forge-app migrations 0025/0026). It returns nothing
  // either way, so a new address and one already on the list look the same.
  const { error } = await supabase.rpc("join_waitlist", {
    p_email: email,
    p_track: track,
    p_source: source,
    p_client_ip: ip,
    p_route_secret: secret,
  });

  if (error) {
    const outcome = rpcErrorOutcome(error);
    // 42501 (secret refused) and anything unexpected: log the code only. Never
    // log the secret or the request body sent to Supabase.
    if (outcome.logCode) console.error("[waitlist] join_waitlist failed:", { code: outcome.logCode });
    return NextResponse.json(outcome.body, { status: outcome.status });
  }

  return NextResponse.json(ACCEPTED);
}
