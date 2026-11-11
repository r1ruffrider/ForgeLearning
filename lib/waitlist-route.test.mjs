// W-ANON r3 O5: unit tests for the waitlist route's pure logic. `npm test` (node --test; no extra deps).
// Node >= 22.18 / 23.6 runs the .ts module directly (type stripping).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  ACCEPTED,
  SERVER_ERROR,
  TOO_MANY,
  clientIp,
  coerceSource,
  ipv6Hextets,
  limiterKey,
  routeSecret,
  rpcErrorOutcome,
} from "./waitlist-route.ts";

const headers = (h) => new Headers(h);

test("clientIp: x-vercel-forwarded-for first entry, then x-real-ip, else null; never x-forwarded-for", () => {
  assert.equal(clientIp(headers({ "x-vercel-forwarded-for": " 198.51.100.7 , 10.0.0.1" })), "198.51.100.7");
  assert.equal(clientIp(headers({ "x-vercel-forwarded-for": "198.51.100.7", "x-real-ip": "203.0.113.9" })), "198.51.100.7");
  assert.equal(clientIp(headers({ "x-real-ip": " 203.0.113.9 " })), "203.0.113.9");
  assert.equal(clientIp(headers({ "x-forwarded-for": "6.6.6.6" })), null);
  assert.equal(clientIp(headers({ "x-forwarded-for": "6.6.6.6", "x-real-ip": "203.0.113.9" })), "203.0.113.9");
  assert.equal(clientIp(headers({ "x-vercel-forwarded-for": "  ", "x-real-ip": "" })), null);
  assert.equal(clientIp(headers({})), null);
});

test("ipv6Hextets: expands every :: form and a dotted tail; rejects malformed input", () => {
  assert.deepEqual(ipv6Hextets("2001:db8::1"), [0x2001, 0xdb8, 0, 0, 0, 0, 0, 1]);
  assert.deepEqual(ipv6Hextets("::"), [0, 0, 0, 0, 0, 0, 0, 0]);
  assert.deepEqual(ipv6Hextets("::ffff:1.2.3.4"), [0, 0, 0, 0, 0, 0xffff, 0x102, 0x304]);
  assert.deepEqual(ipv6Hextets("2001:DB8:0:0:0:0:0:1"), [0x2001, 0xdb8, 0, 0, 0, 0, 0, 1]);
  for (const bad of ["1::2::3", "2001:db8", "12345::1", "g::1", "1:2:3:4:5:6:7:8:9"]) {
    assert.equal(ipv6Hextets(bad), null, bad);
  }
});

test("S1: limiterKey buckets IPv6 by /64, IPv4 by host, IPv4-mapped IPv6 as its IPv4 host", () => {
  const same64 = Array.from({ length: 8 }, (_, i) => `2001:db8:aa:bb::${(i + 1).toString(16)}`);
  same64.push("2001:db8:aa:bb:ffff:ffff:ffff:ffff", "2001:0DB8:00AA:00BB:1:2:3:4");
  assert.equal(new Set(same64.map(limiterKey)).size, 1);
  assert.equal(limiterKey(same64[0]), "v6:2001:db8:aa:bb::/64");
  assert.notEqual(limiterKey("2001:db8:aa:bc::1"), limiterKey("2001:db8:aa:bb::1"));
  assert.equal(limiterKey("198.51.100.7"), "v4:198.51.100.7");
  assert.notEqual(limiterKey("198.51.100.7"), limiterKey("198.51.100.8"));
  assert.equal(limiterKey("::ffff:198.51.100.7"), "v4:198.51.100.7");
  assert.equal(limiterKey("::ffff:c633:6407"), "v4:198.51.100.7");
});

test("limiterKey: missing, malformed or masked input is the shared 'unknown' bucket (fails closed)", () => {
  for (const ip of [null, "", "not-an-ip", "198.51.100.7/24", "999.1.1.1", " 198.51.100.7", "fe80::1%eth0"]) {
    assert.equal(limiterKey(ip), "unknown", String(ip));
  }
});

test("coerceSource: only 'landing' and 'final-cta' pass; anything else is 'landing'", () => {
  assert.equal(coerceSource("landing"), "landing");
  assert.equal(coerceSource("final-cta"), "final-cta");
  for (const s of ["evil", "", "Landing", "final-cta "]) assert.equal(coerceSource(s), "landing", s);
});

test("routeSecret: read from WAITLIST_ROUTE_SECRET only, trimmed; unset or blank is null (route fails closed)", () => {
  assert.equal(routeSecret({}), null);
  assert.equal(routeSecret({ WAITLIST_ROUTE_SECRET: "   " }), null);
  assert.equal(routeSecret({ WAITLIST_ROUTE_SECRET: " abc " }), "abc");
  assert.equal(routeSecret({ NEXT_PUBLIC_WAITLIST_ROUTE_SECRET: "abc" }), null);
});

test("rpcErrorOutcome: rate_limited -> 429, 22023 -> 400, 42501 and anything else -> 500 logging the code only", () => {
  assert.deepEqual(rpcErrorOutcome({ code: "rate_limited", message: "rate_limited: waitlist_ip" }), { status: 429, body: TOO_MANY, logCode: null });
  assert.deepEqual(rpcErrorOutcome({ code: "PGRST", message: "rate_limited: waitlist_all" }), { status: 429, body: TOO_MANY, logCode: null });
  assert.equal(rpcErrorOutcome({ code: "22023", message: "invalid_email" }).status, 400);
  assert.equal(rpcErrorOutcome({ code: "22023", message: "invalid_email" }).logCode, null);
  const refused = rpcErrorOutcome({ code: "42501", message: "forbidden" });
  assert.deepEqual(refused, { status: 500, body: SERVER_ERROR, logCode: "42501" });
  assert.deepEqual(rpcErrorOutcome({ message: "boom" }), { status: 500, body: SERVER_ERROR, logCode: "unknown" });
  assert.deepEqual(ACCEPTED, { ok: true });
});

test("route.ts wiring: uses the helpers, never x-forwarded-for or a NEXT_PUBLIC secret, logs no address or body", () => {
  const route = fs.readFileSync(new URL("../app/api/waitlist/route.ts", import.meta.url), "utf8");
  assert.match(route, /clientIp\(req\.headers\)/);
  assert.match(route, /rateLimited\(limiterKey\(ip\)\)/);
  assert.match(route, /coerceSource\(result\.data\.source\)/);
  assert.match(route, /routeSecret\(process\.env\)/);
  assert.match(route, /p_client_ip: ip,/);
  assert.match(route, /p_route_secret: secret,/);
  assert.doesNotMatch(route, /x-forwarded-for/i);
  assert.doesNotMatch(route, /NEXT_PUBLIC_WAITLIST/);
  assert.doesNotMatch(route, /\.from\(\s*["']waitlist["']\s*\)/);
  const logs = route.match(/console\.(log|info|warn|error)\([^;]*\);/g) ?? [];
  assert.equal(logs.length, 3);
  // Each log call is a fixed string plus at most one object literal whose keys are all allowlisted.
  const allowed = new Set(["code", "domain", "track", "source"]);
  for (const line of logs) {
    const args = line.slice(line.indexOf("(") + 1, line.lastIndexOf(")"));
    const objects = args.match(/\{[^{}]*\}/g) ?? [];
    const rest = args.replace(/\{[^{}]*\}/g, "").replace(/"[^"]*"/g, "").replace(/[\s,]/g, "");
    assert.equal(rest, "", `only a string and an object literal may be logged: ${line}`);
    assert.ok(objects.length <= 1, line);
    for (const obj of objects) {
      for (const part of obj.slice(1, -1).split(",")) {
        const key = part.split(":")[0].trim();
        assert.ok(allowed.has(key), `log key '${key}' is not allowlisted: ${line}`);
      }
    }
  }
  // every accepted path answers the same body
  assert.equal((route.match(/NextResponse\.json\(ACCEPTED\)/g) ?? []).length, 2);
});
