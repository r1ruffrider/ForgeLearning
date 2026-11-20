import { NextResponse } from "next/server";
import { validateSignup } from "@/lib/validation";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  ACCEPTED,
  clientIp,
  routeSecret,
} from "@/lib/waitlist-route";
import { handleWaitlistRequest } from "@/lib/waitlist-post";
import { site } from "@/content/site";

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
  const result = await handleWaitlistRequest(req, {
    rateLimited: (key) => rateLimited(key),
    isConfigured: isSupabaseConfigured,
    secret: routeSecret(process.env),
    validateSignup,
    joinWaitlist: async ({ email, track, source, ip: client, secret }) => {
      const supabase = getSupabase();
      if (!supabase) return { error: { code: "no_client" } };
      // The only write path (forge-app migrations 0025/0026). It returns nothing
      // either way, so a new address and one already on the list look the same.
      return supabase.rpc("join_waitlist", {
        p_email: email,
        p_track: track,
        p_source: source,
        p_client_ip: client,
        p_route_secret: secret,
      });
    },
    logLocal: (info) => {
      console.info("[waitlist] (local-only) signup:", { domain: info.domain, track: info.track, source: info.source });
    },
    logMissingSecret: () => {
      // Fail closed: without the secret the database refuses every call anyway.
      console.error("[waitlist] WAITLIST_ROUTE_SECRET is not set");
    },
    logJoinError: (code) => {
      // 42501 (secret refused) and anything unexpected: log the code only. Never
      // log the secret or the request body sent to Supabase.
      console.error("[waitlist] join_waitlist failed:", { code });
    },
  });

  if (result.location) {
    return NextResponse.redirect(new URL(result.location, site.seo.url), 303);
  }
  const response = NextResponse.json(result.body ?? ACCEPTED, { status: result.status });
  if (result.headers) {
    for (const [key, value] of Object.entries(result.headers)) {
      response.headers.set(key, value);
    }
  }
  return response;
}

/** GET must not sign anyone up (no body parsed, no insert). */
export async function GET() {
  return new NextResponse(null, { status: 405, headers: { Allow: "POST" } });
}
