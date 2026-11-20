// No-JS waitlist POST path (Marlon 00:24 item 2). `npm test` (node --test).
// DB/insert is mocked; no real Supabase or network.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  ACCEPTED,
  SERVER_ERROR,
  TOO_MANY,
} from "./waitlist-route.ts";
import { handleWaitlistRequest } from "./waitlist-post.ts";
import {
  WAITLIST_FORM_ACTION,
  WAITLIST_FORM_METHOD,
  parseWaitlistResult,
  waitlistRedirectPath,
} from "./waitlist-result.ts";
import { validateSignup } from "./validation.ts";

const FORM_TYPE = "application/x-www-form-urlencoded";
const JSON_TYPE = "application/json";
const FAKE_SECRET = "test-route-secret";

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

function formPost(body, headers = {}) {
  return new Request("http://localhost/api/waitlist", {
    method: "POST",
    headers: { "content-type": FORM_TYPE, ...headers },
    body,
  });
}

function jsonPost(payload, headers = {}) {
  return new Request("http://localhost/api/waitlist", {
    method: "POST",
    headers: { "content-type": JSON_TYPE, ...headers },
    body: JSON.stringify(payload),
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
  // Daniela's thank-you motion stays
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
  assert.equal(res.location, "/?waitlist=ok#waitlist");
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
  assert.equal(missing.location, "/?waitlist=required#waitlist");
  assert.equal(parseWaitlistResult("required"), "required");

  const invalid = await handleWaitlistRequest(
    formPost("email=not-an-email&source=final-cta"),
    deps({ joinWaitlist: join }),
  );
  assert.equal(invalid.status, 303);
  assert.equal(invalid.location, "/?waitlist=invalid#waitlist");
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
  assert.equal(limited.location, "/?waitlist=rate#waitlist");
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
  assert.equal(honey.location, "/?waitlist=ok#waitlist");
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
