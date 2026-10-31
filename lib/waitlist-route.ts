import { isIP } from "node:net";

/**
 * Pure helpers for app/api/waitlist/route.ts (no Next.js, no Supabase), so they
 * can be unit-tested with `node --test` (lib/waitlist-route.test.mjs; W-ANON r3 O5).
 * Only erasable TypeScript syntax is used, so Node runs this file directly.
 */

/** Anything with a Headers-like `get` (Request.headers in the route). */
export type HeaderSource = { get(name: string): string | null };

/**
 * The visitor's IP as Vercel's edge reports it (this site deploys to Vercel:
 * README "Deploying to Vercel"). Vercel sets `x-vercel-forwarded-for` and
 * `x-real-ip` itself and overwrites any client-sent value, so neither can be
 * spoofed by the caller; `x-vercel-forwarded-for` is preferred because it also
 * survives a proxy placed in front of Vercel. The first `x-forwarded-for` entry
 * is NOT used: off Vercel it is whatever the client sent. With neither header
 * (local `next dev`, or any non-Vercel host) every request shares one
 * "unknown" bucket, so the limiter fails closed rather than open.
 */
export function clientIp(headers: HeaderSource): string | null {
  const vercel = headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  if (vercel) return vercel;
  const real = headers.get("x-real-ip")?.trim();
  if (real) return real;
  return null;
}

/** Expands an IPv6 address (any :: form, optional dotted-IPv4 tail) to 8 hextets, or null. */
export function ipv6Hextets(address: string): number[] | null {
  let text = address.toLowerCase();
  const dotted = text.match(/^(.*:)(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (dotted) {
    const [a, b, c, d] = dotted.slice(2).map(Number);
    text = `${dotted[1]}${((a << 8) | b).toString(16)}:${((c << 8) | d).toString(16)}`;
  }
  const halves = text.split("::");
  if (halves.length > 2) return null;
  const head = halves[0] ? halves[0].split(":") : [];
  const tail = halves.length === 2 && halves[1] ? halves[1].split(":") : [];
  const fill = halves.length === 2 ? 8 - head.length - tail.length : 0;
  if (fill < 0 || (halves.length === 1 && head.length !== 8)) return null;
  const parts = [...head, ...Array<string>(fill).fill("0"), ...tail];
  if (parts.length !== 8 || parts.some((h) => !/^[0-9a-f]{1,4}$/.test(h))) return null;
  return parts.map((h) => parseInt(h, 16));
}

/**
 * One key per visitor, the same way forge-app 0025 buckets `waitlist_ip`: an
 * IPv4 address is one visitor; an IPv6 address counts as its /64 (the usual
 * single-subscriber allocation, W-ANON r3 S1); an IPv4-mapped IPv6 address
 * (::ffff:a.b.c.d) counts as that IPv4 address. Unparsable or missing: "unknown".
 */
export function limiterKey(ip: string | null): string {
  if (!ip) return "unknown";
  const family = isIP(ip);
  if (family === 4) return `v4:${ip}`;
  if (family !== 6) return "unknown";
  const h = ipv6Hextets(ip);
  if (!h) return "unknown";
  if (h.slice(0, 5).every((x) => x === 0) && h[5] === 0xffff) {
    return `v4:${h[6] >> 8}.${h[6] & 255}.${h[7] >> 8}.${h[7] & 255}`;
  }
  return `v6:${h.slice(0, 4).map((x) => x.toString(16)).join(":")}::/64`;
}

/** The DB accepts exactly these (CHECK waitlist_source_allowed); anything else is 'landing'. */
export const ALLOWED_SOURCES: readonly string[] = ["landing", "final-cta"];

export function coerceSource(source: string): string {
  return ALLOWED_SOURCES.includes(source) ? source : "landing";
}

/**
 * Server-only secret that join_waitlist() checks (sha256 against
 * public.rpc_settings). Never NEXT_PUBLIC_*, so it is never in the browser
 * bundle; set in Vercel's server-side env only. Never logged.
 */
export function routeSecret(env: Record<string, string | undefined>): string | null {
  const value = env.WAITLIST_ROUTE_SECRET?.trim();
  return value ? value : null;
}

// One body for every accepted signup, whether the address is new, already on
// the list, or caught by the honeypot (SF-2: no membership signal).
export const ACCEPTED = { ok: true } as const;
export const TOO_MANY = {
  ok: false,
  error: "Too many requests. Please try again shortly.",
} as const;
export const SERVER_ERROR = {
  ok: false,
  error: "Something went wrong. Please try again in a moment.",
} as const;
export const INVALID_EMAIL = {
  ok: false,
  error: "That doesn't look like a valid email address.",
} as const;

export type RpcErrorOutcome = {
  status: number;
  body: { ok: false; error: string };
  /** Set only when the route should log: the error code, never the message, body or secret. */
  logCode: string | null;
};

/** Maps a join_waitlist() error to the route's response. */
export function rpcErrorOutcome(error: { code?: string | null; message?: string | null }): RpcErrorOutcome {
  // The database's own rate limit (HTTP 429, code "rate_limited").
  if (error.code === "rate_limited" || /^rate_limited\b/.test(error.message ?? "")) {
    return { status: 429, body: TOO_MANY, logCode: null };
  }
  // Input the database refused (invalid_email / invalid_track / invalid_source,
  // 22023). The route's own checks normally catch it first.
  if (error.code === "22023") {
    return { status: 400, body: INVALID_EMAIL, logCode: null };
  }
  // 42501 = the database refused the route secret (wrong, rotated away, or no
  // hash row yet). Like every other failure: a 500, logging the code only.
  return { status: 500, body: SERVER_ERROR, logCode: error.code ?? "unknown" };
}
