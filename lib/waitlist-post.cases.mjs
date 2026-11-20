// No-JS waitlist POST path (Marlon 00:24 item 2) plus S-3/E-12–E-15, E-19.
// `npm test` (node --test). DB/insert is mocked; no real Supabase or network.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  ACCEPTED,
  SERVER_ERROR,
  TOO_MANY,
} from "./waitlist-route.ts";
import {
  handleWaitlistRequest,
  isJsonContentType,
  waitlistAllowedOrigin,
} from "./waitlist-post.ts";
import {
  WAITLIST_FORM_ACTION,
  WAITLIST_FORM_METHOD,
  parseWaitlistResult,
  waitlistRedirectPath,
} from "./waitlist-result.ts";
import { validateSignup } from "./validation.ts";
import { site } from "../content/site.ts";

const FORM_TYPE = "application/x-www-form-urlencoded";
const JSON_TYPE = "application/json";
const FAKE_SECRET = "test-route-secret";
const SITE_ORIGIN = waitlistAllowedOrigin();

function deps(overrides = {}) {
  return {
    rateLimited: () => false,
    isConfigured: true,
    secret: FAKE_SECRET,
    validateSignup,
    joinWaitlist: async () => ({ error: null }),
    ...overrides,
  };
}

function headers(contentType, extra = {}) {
  const h = { "content-type": contentType, origin: SITE_ORIGIN, ...extra };
  for (const key of Object.keys(h)) {
    if (h[key] == null) delete h[key];
  }
  return h;
}

function formPost(body, extra = {}) {
  return new Request("http://localhost/api/waitlist", {
    method: "POST",
    headers: headers(FORM_TYPE, extra),
    body,
  });
}

function jsonPost(payload, extra = {}, contentType = JSON_TYPE) {
  return new Request("http://localhost/api/waitlist", {
    method: "POST",
    headers: headers(contentType, extra),
    body: typeof payload === "string" ? payload : JSON.stringify(payload),
  });
}

test("the form renders with method=post and the waitlist action; JS fetch path is unchanged", () => {
  const src = fs.readFileSync(new URL("../components/waitlist-form.tsx", import.meta.url), "utf8");
  assert.match(src, /method=["']post["']/);
  assert.match(src, /action=["']\/api\/waitlist["']/);
  assert.equal(WAITLIST_FORM_METHOD, "post");
  assert.equal(WAITLIST_FORM_ACTION, "/api/waitlist");
  assert.match(src, /e\.preventDefault\(\)/);
  assert.match(src, /fetch\(\s*["']\/api\/waitlist["']\s*,/);
  assert.match(src, /method:\s*["']POST["']/);
  assert.match(src, /["']Content-Type["']:\s*["']application\/json["']/);
  assert.match(src, /JSON\.stringify\(/);
  assert.match(src, /name=["']source["']/);
  assert.match(src, /name=["']company["']/);
  // Daniela's thank-you motion stays on the JS success path
  assert.match(src, /duration:\s*0\.24,\s*ease:\s*["']easeOut["']/);
});

test("urlencoded POST with a valid email goes through the same insert path and 303s to the success state", async () => {
  const inserted = [];
  const res = await handleWaitlistRequest(
    formPost("email=qa%40example.com&source=final-cta&company="),
    deps({
      joinWaitlist: async (args) => {
        inserted.push(args);
        return { error: null };
      },
    }),
  );
  assert.equal(res.status, 303);
  assert.equal(res.location, waitlistRedirectPath("ok"));
  assert.equal(res.location, "/waitlist/ok");
  assert.equal(inserted.length, 1);
  assert.equal(inserted[0].email, "qa@example.com");
  assert.equal(inserted[0].source, "final-cta");
  assert.equal(inserted[0].track, null);
  assert.equal(inserted[0].secret, FAKE_SECRET);
});

test("an invalid or missing email gets the error state and no insert", async () => {
  const inserted = [];
  const join = async (args) => {
    inserted.push(args);
    return { error: null };
  };

  const missing = await handleWaitlistRequest(formPost("email=&source=final-cta"), deps({ joinWaitlist: join }));
  assert.equal(missing.status, 303);
  assert.equal(missing.location, "/waitlist/required");
  assert.equal(parseWaitlistResult("required"), "required");

  const invalid = await handleWaitlistRequest(
    formPost("email=not-an-email&source=final-cta"),
    deps({ joinWaitlist: join }),
  );
  assert.equal(invalid.status, 303);
  assert.equal(invalid.location, "/waitlist/invalid");
  assert.equal(inserted.length, 0);
});

test("a GET can't sign up", async () => {
  let called = 0;
  const res = await handleWaitlistRequest(
    new Request("http://localhost/api/waitlist?email=qa%40example.com", { method: "GET" }),
    deps({
      joinWaitlist: async () => {
        called += 1;
        return { error: null };
      },
    }),
  );
  assert.equal(res.status, 405);
  assert.equal(called, 0);
  assert.equal(res.location, undefined);
});

test("the email never appears in a redirect URL", async () => {
  const cases = [
    formPost("email=qa%40example.com&source=final-cta"),
    formPost("email=not-an-email"),
    formPost("email="),
    formPost("email=qa%40example.com&company=bot"),
  ];
  for (const req of cases) {
    const res = await handleWaitlistRequest(req, deps());
    assert.equal(res.status, 303);
    assert.ok(res.location);
    const lower = res.location.toLowerCase();
    assert.equal(lower.includes("qa@example.com"), false, res.location);
    assert.equal(lower.includes("qa%40example.com"), false, res.location);
    assert.equal(lower.includes("@"), false, res.location);
    assert.equal(new URL(res.location, "http://localhost").searchParams.has("email"), false);
  }
});

test("the JS JSON path is unchanged: accepted signup returns JSON, not a redirect", async () => {
  const inserted = [];
  const res = await handleWaitlistRequest(
    jsonPost({
      email: "qa@example.com",
      track: null,
      source: "final-cta",
      company: "",
    }),
    deps({
      joinWaitlist: async (args) => {
        inserted.push(args);
        return { error: null };
      },
    }),
  );
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, ACCEPTED);
  assert.equal(res.location, undefined);
  assert.equal(inserted.length, 1);
  assert.equal(inserted[0].email, "qa@example.com");
});

test("form POST keeps rate-limit, honeypot and source coercion on the no-JS path", async () => {
  let called = 0;
  const limited = await handleWaitlistRequest(
    formPost("email=qa%40example.com&source=final-cta"),
    deps({
      rateLimited: () => true,
      joinWaitlist: async () => {
        called += 1;
        return { error: null };
      },
    }),
  );
  assert.equal(limited.status, 303);
  assert.equal(limited.location, "/waitlist/rate");
  assert.equal(called, 0);
  assert.equal(TOO_MANY.error, "Too many requests. Please try again shortly.");

  const honey = await handleWaitlistRequest(
    formPost("email=qa%40example.com&source=final-cta&company=bot"),
    deps({
      joinWaitlist: async () => {
        called += 1;
        return { error: null };
      },
    }),
  );
  assert.equal(honey.status, 303);
  assert.equal(honey.location, "/waitlist/ok");
  assert.equal(called, 0);

  const inserted = [];
  const coerced = await handleWaitlistRequest(
    formPost("email=qa%40example.com&source=not-a-source"),
    deps({
      joinWaitlist: async (args) => {
        inserted.push(args);
        return { error: null };
      },
    }),
  );
  assert.equal(coerced.status, 303);
  assert.equal(inserted[0].source, "landing");
  assert.equal(SERVER_ERROR.ok, false);
});

test("S-3/E-12: allowed origin is taken from site.seo.url, not a second hardcoded copy", () => {
  assert.equal(SITE_ORIGIN, new URL(site.seo.url).origin);
  assert.equal(SITE_ORIGIN, "https://forgelearning.app");
  assert.equal(isJsonContentType("application/json"), true);
  assert.equal(isJsonContentType("application/json; charset=utf-8"), true);
  assert.equal(isJsonContentType("application/json;charset=UTF-8"), true);
  assert.equal(isJsonContentType("text/plain"), false);
  assert.equal(isJsonContentType("text/plain;charset=utf-8"), false);
  assert.equal(isJsonContentType(null), false);
});

test("S-3/E-12: a cross-site form POST is 403 and does not insert", async () => {
  let called = 0;
  const res = await handleWaitlistRequest(
    formPost("email=qa%40example.com&source=final-cta", { origin: "https://evil.example" }),
    deps({
      joinWaitlist: async () => {
        called += 1;
        return { error: null };
      },
    }),
  );
  assert.equal(res.status, 403);
  assert.equal(res.location, undefined);
  assert.equal(called, 0);
});

test("S-3/E-12: a foreign Origin is 403 even when Referer is same-site, and does not insert", async () => {
  let called = 0;
  const res = await handleWaitlistRequest(
    formPost("email=qa%40example.com&source=final-cta", {
      origin: "https://evil.example",
      referer: `${SITE_ORIGIN}/`,
    }),
    deps({
      joinWaitlist: async () => {
        called += 1;
        return { error: null };
      },
    }),
  );
  assert.equal(res.status, 403);
  assert.equal(called, 0);
});

test("S-3/E-12: missing Origin and Referer is 403 and does not insert", async () => {
  let called = 0;
  const res = await handleWaitlistRequest(
    formPost("email=qa%40example.com&source=final-cta", { origin: null }),
    deps({
      joinWaitlist: async () => {
        called += 1;
        return { error: null };
      },
    }),
  );
  assert.equal(res.status, 403);
  assert.equal(called, 0);
});

test("S-3/E-12: Referer-only same-site is accepted and inserts", async () => {
  const inserted = [];
  const res = await handleWaitlistRequest(
    formPost("email=qa%40example.com&source=final-cta", {
      origin: null,
      referer: `${SITE_ORIGIN}/#waitlist`,
    }),
    deps({
      joinWaitlist: async (args) => {
        inserted.push(args);
        return { error: null };
      },
    }),
  );
  assert.equal(res.status, 303);
  assert.equal(res.location, "/waitlist/ok");
  assert.equal(inserted.length, 1);
});

test("S-3/E-12: no-cors-style text/plain JSON is 415 and does not insert", async () => {
  let called = 0;
  const res = await handleWaitlistRequest(
    jsonPost(
      { email: "qa@example.com", track: null, source: "final-cta", company: "" },
      {},
      "text/plain",
    ),
    deps({
      joinWaitlist: async () => {
        called += 1;
        return { error: null };
      },
    }),
  );
  assert.equal(res.status, 415);
  assert.equal(res.location, undefined);
  assert.equal(called, 0);
});

test("S-3/E-12: enctype=text/plain is 415 and does not insert", async () => {
  let called = 0;
  const res = await handleWaitlistRequest(
    new Request("http://localhost/api/waitlist", {
      method: "POST",
      headers: headers("text/plain", {}),
      body: '{"email":"qa@example.com","pad":"="}',
    }),
    deps({
      joinWaitlist: async () => {
        called += 1;
        return { error: null };
      },
    }),
  );
  assert.equal(res.status, 415);
  assert.equal(called, 0);
});

test("S-3/E-12: a same-origin form POST and a same-origin JSON POST still insert", async () => {
  const inserted = [];
  const join = async (args) => {
    inserted.push(args);
    return { error: null };
  };

  const form = await handleWaitlistRequest(
    formPost("email=form%40example.com&source=final-cta&track=CISSP"),
    deps({ joinWaitlist: join }),
  );
  assert.equal(form.status, 303);
  assert.equal(form.location, "/waitlist/ok");

  const json = await handleWaitlistRequest(
    jsonPost({
      email: "json@example.com",
      track: "CISSP",
      source: "final-cta",
      company: "",
    }),
    deps({ joinWaitlist: join }),
  );
  assert.equal(json.status, 200);
  assert.deepEqual(json.body, ACCEPTED);
  assert.equal(inserted.length, 2);
  assert.equal(inserted[0].email, "form@example.com");
  assert.equal(inserted[0].track, "CISSP");
  assert.equal(inserted[1].email, "json@example.com");
});

test("S-3/E-12: JSON with application/json; charset=utf-8 still inserts", async () => {
  const inserted = [];
  const res = await handleWaitlistRequest(
    jsonPost(
      { email: "qa@example.com", source: "final-cta", company: "" },
      {},
      "application/json; charset=utf-8",
    ),
    deps({
      joinWaitlist: async (args) => {
        inserted.push(args);
        return { error: null };
      },
    }),
  );
  assert.equal(res.status, 200);
  assert.equal(inserted.length, 1);
});

test("O-2/E-17: the 303 Location is built on site.seo.url, not req.url", () => {
  const route = fs.readFileSync(new URL("../app/api/waitlist/route.ts", import.meta.url), "utf8");
  assert.match(route, /NextResponse\.redirect\(\s*new URL\(\s*result\.location,\s*site\.seo\.url\s*\)\s*,\s*303\s*\)/);
  assert.doesNotMatch(route, /new URL\(\s*result\.location,\s*req\.url\s*\)/);
  assert.equal(
    new URL(waitlistRedirectPath("ok"), site.seo.url).href,
    "https://forgelearning.app/waitlist/ok",
  );
  assert.equal(
    new URL(waitlistRedirectPath("error"), site.seo.url).href,
    "https://forgelearning.app/waitlist/error",
  );
});

test("E-13: the no-JS thank-you has no opacity:0 in its markup (visible without JS)", () => {
  const pageSrc = fs.readFileSync(
    new URL("../components/waitlist-result-panel.tsx", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(pageSrc, /framer-motion/);
  assert.doesNotMatch(pageSrc, /initial=/);
  assert.doesNotMatch(pageSrc, /opacity:\s*0/);
  assert.doesNotMatch(pageSrc, /translateY/);
  assert.match(pageSrc, /copy\.thankYou\.heading/);
  assert.match(pageSrc, /href="\/#waitlist"/);
  assert.match(pageSrc, /role="status"/);
});

test("E-14 and E-19: Radix is hidden until hydrated; a named native track select stays in the DOM", () => {
  const src = fs.readFileSync(new URL("../components/waitlist-form.tsx", import.meta.url), "utf8");
  assert.match(src, /hidden=\{!hydrated\}/);
  assert.match(src, /waitlist-js-track/);
  assert.match(src, /<noscript>/);
  assert.match(src, /\.waitlist-js-track\{display:none!important\}/);
  assert.match(src, /name=["']track["']/);
  assert.match(src, /<select/);
  // The native select is in the regular tree (pre-hydration + no-JS), not only in noscript.
  const noscriptBlock = src.slice(src.indexOf("<noscript>"), src.indexOf("</noscript>") + 11);
  assert.doesNotMatch(noscriptBlock, /name=["']track["']/);
  assert.match(src, /onValueChange=\{setTrack\}/);
  assert.match(src, /value=\{track\}/);
});

test("E-15: / stays static; form results go to noindex /waitlist/{ok,required,invalid,rate,error}", () => {
  const home = fs.readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(home, /searchParams/);
  assert.match(home, /export default function Home\(\)/);

  const resultPage = fs.readFileSync(
    new URL("../app/waitlist/[result]/page.tsx", import.meta.url),
    "utf8",
  );
  assert.match(resultPage, /generateStaticParams/);
  assert.match(resultPage, /index:\s*false/);
  assert.match(resultPage, /dynamicParams\s*=\s*false/);
  for (const result of ["ok", "required", "invalid", "rate", "error"]) {
    assert.equal(waitlistRedirectPath(result), `/waitlist/${result}`);
    assert.equal(parseWaitlistResult(result), result);
  }
});
