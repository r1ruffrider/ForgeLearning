// O3: http(s) URLs in legal copy become link parts; punctuation, plain text,
// and untrusted markup stay text. `npm test` (node --test).
// Node >= 22.18 / 23.6 runs the .ts module directly (type stripping).
import { test } from "node:test";
import assert from "node:assert/strict";
import { fillLegalText } from "./legal-fill.ts";
import { site } from "../content/site.ts";

const EMAIL = "info@inspirebusinesstechnology.com";

test("http(s) URLs become link parts with the same href and visible text", () => {
  const parts = fillLegalText(
    "The Forge Learning web app at https://app.forgelearning.app uses accounts.",
    EMAIL,
  );
  assert.deepEqual(parts, [
    { type: "text", value: "The Forge Learning web app at " },
    {
      type: "link",
      href: "https://app.forgelearning.app",
      value: "https://app.forgelearning.app",
    },
    { type: "text", value: " uses accounts." },
  ]);
});

test("trailing punctuation is stripped from the match, not from the surrounding text", () => {
  const cases = [
    ["see https://app.forgelearning.app/privacy.", "https://app.forgelearning.app/privacy", "."],
    ["see https://app.forgelearning.app/privacy,", "https://app.forgelearning.app/privacy", ","],
    ["see https://app.forgelearning.app/account-deletion;", "https://app.forgelearning.app/account-deletion", ";"],
    ["see https://app.forgelearning.app:", "https://app.forgelearning.app", ":"],
    ["(see https://app.forgelearning.app/privacy)", "https://app.forgelearning.app/privacy", ")"],
  ];
  for (const [input, href, trail] of cases) {
    const parts = fillLegalText(input, EMAIL);
    const link = parts.find((p) => p.type === "link");
    assert.deepEqual(link, { type: "link", href, value: href }, input);
    const after = parts[parts.indexOf(link) + 1];
    assert.equal(after?.type, "text", input);
    assert.equal(after.value.startsWith(trail), true, input);
  }
});

test("plain text with no URL is a single unchanged text part", () => {
  const s = "This website does not create or manage app accounts.";
  assert.deepEqual(fillLegalText(s, EMAIL), [{ type: "text", value: s }]);
});

test("text containing <script> stays text, never a link or HTML", () => {
  const s = 'Click <script>alert(1)</script> or javascript:alert(1) please.';
  const parts = fillLegalText(s, EMAIL);
  assert.deepEqual(parts, [{ type: "text", value: s }]);
  assert.equal(
    parts.some((p) => p.type === "link"),
    false,
  );
  assert.equal(JSON.stringify(parts).includes("<script>"), true);
});

test("{contactEmail} is substituted as plain text, same as before", () => {
  const parts = fillLegalText(
    "Questions about this notice? Reach us at {contactEmail}.",
    EMAIL,
  );
  assert.deepEqual(parts, [
    {
      type: "text",
      value: "Questions about this notice? Reach us at info@inspirebusinesstechnology.com.",
    },
  ]);
});

test("privacy C2 intro and C8 body URLs are the expected app links", () => {
  const intro = fillLegalText(site.legal.privacy.intro, site.brand.contactEmail);
  assert.deepEqual(
    intro.filter((p) => p.type === "link").map((p) => p.href),
    ["https://app.forgelearning.app"],
  );

  const c8 = site.legal.privacy.sections.find(
    (s) => s.heading === "Forge Learning app accounts",
  );
  assert.ok(c8, "C8 section present");
  const hrefs = c8.body.flatMap((paragraph) =>
    fillLegalText(paragraph, site.brand.contactEmail)
      .filter((p) => p.type === "link")
      .map((p) => p.href),
  );
  assert.deepEqual(hrefs, [
    "https://app.forgelearning.app",
    "https://app.forgelearning.app/privacy",
    "https://app.forgelearning.app/account-deletion",
  ]);
});
