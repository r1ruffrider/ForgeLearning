// O3 + S-1: only https://app.forgelearning.app URLs become link parts.
// Punctuation, other hosts, http, userinfo, ports, and untrusted markup stay text.
// `npm test` (node --test). Node >= 22.18 / 23.6 runs the .ts module directly.
import { test } from "node:test";
import assert from "node:assert/strict";
import { fillLegalText } from "./legal-fill.ts";
import { site } from "../content/site.ts";

const EMAIL = "info@inspirebusinesstechnology.com";

function assertStaysText(input, label = input) {
  const parts = fillLegalText(input, EMAIL);
  assert.deepEqual(parts, [{ type: "text", value: input }], label);
  assert.equal(
    parts.some((p) => p.type === "link"),
    false,
    label,
  );
}

test("real https app origin URL links; href is the parsed URL href; visible text is the source", () => {
  const parts = fillLegalText(
    "The Forge Learning web app at https://app.forgelearning.app uses accounts.",
    EMAIL,
  );
  assert.deepEqual(parts, [
    { type: "text", value: "The Forge Learning web app at " },
    {
      type: "link",
      href: "https://app.forgelearning.app/",
      value: "https://app.forgelearning.app",
    },
    { type: "text", value: " uses accounts." },
  ]);
});

test("real https app path URLs still link", () => {
  const privacy = fillLegalText(
    "Privacy Policy at https://app.forgelearning.app/privacy, not by this notice.",
    EMAIL,
  );
  assert.deepEqual(privacy, [
    { type: "text", value: "Privacy Policy at " },
    {
      type: "link",
      href: "https://app.forgelearning.app/privacy",
      value: "https://app.forgelearning.app/privacy",
    },
    { type: "text", value: ", not by this notice." },
  ]);

  const deletion = fillLegalText(
    "To delete an app account, see https://app.forgelearning.app/account-deletion.",
    EMAIL,
  );
  assert.deepEqual(deletion, [
    { type: "text", value: "To delete an app account, see " },
    {
      type: "link",
      href: "https://app.forgelearning.app/account-deletion",
      value: "https://app.forgelearning.app/account-deletion",
    },
    { type: "text", value: "." },
  ]);
});

test("trailing punctuation .,;:) is stripped from the match, not from the surrounding text", () => {
  const cases = [
    ["see https://app.forgelearning.app/privacy.", "https://app.forgelearning.app/privacy", "https://app.forgelearning.app/privacy", "."],
    ["see https://app.forgelearning.app/privacy,", "https://app.forgelearning.app/privacy", "https://app.forgelearning.app/privacy", ","],
    ["see https://app.forgelearning.app/account-deletion;", "https://app.forgelearning.app/account-deletion", "https://app.forgelearning.app/account-deletion", ";"],
    ["see https://app.forgelearning.app:", "https://app.forgelearning.app/", "https://app.forgelearning.app", ":"],
    ["(see https://app.forgelearning.app/privacy)", "https://app.forgelearning.app/privacy", "https://app.forgelearning.app/privacy", ")"],
  ];
  for (const [input, href, value, trail] of cases) {
    const parts = fillLegalText(input, EMAIL);
    const link = parts.find((p) => p.type === "link");
    assert.deepEqual(link, { type: "link", href, value }, input);
    const after = parts[parts.indexOf(link) + 1];
    assert.equal(after?.type, "text", input);
    assert.equal(after.value.startsWith(trail), true, input);
  }
});

test('trailing " is kept outside the link', () => {
  const parts = fillLegalText(
    'See "https://app.forgelearning.app/privacy"',
    EMAIL,
  );
  assert.deepEqual(parts, [
    { type: "text", value: 'See "' },
    {
      type: "link",
      href: "https://app.forgelearning.app/privacy",
      value: "https://app.forgelearning.app/privacy",
    },
    { type: "text", value: '"' },
  ]);
});

test("trailing ' is kept outside the link", () => {
  const parts = fillLegalText(
    "See 'https://app.forgelearning.app/privacy'",
    EMAIL,
  );
  assert.deepEqual(parts, [
    { type: "text", value: "See '" },
    {
      type: "link",
      href: "https://app.forgelearning.app/privacy",
      value: "https://app.forgelearning.app/privacy",
    },
    { type: "text", value: "'" },
  ]);
});

test("trailing ! is kept outside the link", () => {
  const parts = fillLegalText(
    "See https://app.forgelearning.app/privacy!",
    EMAIL,
  );
  assert.deepEqual(parts, [
    { type: "text", value: "See " },
    {
      type: "link",
      href: "https://app.forgelearning.app/privacy",
      value: "https://app.forgelearning.app/privacy",
    },
    { type: "text", value: "!" },
  ]);
});

test("trailing ] is kept outside the link", () => {
  const parts = fillLegalText(
    "See [https://app.forgelearning.app/privacy]",
    EMAIL,
  );
  assert.deepEqual(parts, [
    { type: "text", value: "See [" },
    {
      type: "link",
      href: "https://app.forgelearning.app/privacy",
      value: "https://app.forgelearning.app/privacy",
    },
    { type: "text", value: "]" },
  ]);
});

test("userinfo @ trick stays plain text, character for character", () => {
  const s = "Visit https://app.forgelearning.app@example.com/x today.";
  const parts = fillLegalText(s, EMAIL);
  assert.deepEqual(parts, [{ type: "text", value: s }]);
});

test("http:// URLs stay plain text, character for character", () => {
  const s = "The app at http://app.forgelearning.app/privacy is not linked.";
  assertStaysText(s);
});

test("evil subdomain suffix stays plain text, character for character", () => {
  const s = "Look at https://app.forgelearning.app.evil.example/privacy please.";
  assertStaysText(s);
});

test("a non-empty port stays plain text, character for character", () => {
  const s = "See https://app.forgelearning.app:8443/privacy for a ported host.";
  assertStaysText(s);
});

test("a bad URL that makes the parse throw stays plain text, character for character", () => {
  const s = "Broken https://[ in the copy.";
  assertStaysText(s);
  try {
    // eslint-disable-next-line no-new
    new URL("https://[");
    assert.fail("expected new URL('https://[') to throw");
  } catch (err) {
    assert.equal(err instanceof TypeError, true);
  }
});

test("plain text with no URL is a single unchanged text part", () => {
  const s = "This website does not create or manage app accounts.";
  assertStaysText(s);
});

test("text containing <script> stays text, never a link or HTML", () => {
  const s = "Click <script>alert(1)</script> or javascript:alert(1) please.";
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
      value:
        "Questions about this notice? Reach us at info@inspirebusinesstechnology.com.",
    },
  ]);
});

test("privacy C2 intro and C8 body URLs are the expected app links", () => {
  const intro = fillLegalText(site.legal.privacy.intro, site.brand.contactEmail);
  const introLinks = intro.filter((p) => p.type === "link");
  assert.deepEqual(
    introLinks.map((p) => p.href),
    ["https://app.forgelearning.app/"],
  );
  assert.deepEqual(
    introLinks.map((p) => p.value),
    ["https://app.forgelearning.app"],
  );

  const c8 = site.legal.privacy.sections.find(
    (s) => s.heading === "Forge Learning app accounts",
  );
  assert.ok(c8, "C8 section present");
  const links = c8.body.flatMap((paragraph) =>
    fillLegalText(paragraph, site.brand.contactEmail).filter(
      (p) => p.type === "link",
    ),
  );
  assert.deepEqual(
    links.map((p) => p.href),
    [
      "https://app.forgelearning.app/",
      "https://app.forgelearning.app/privacy",
      "https://app.forgelearning.app/account-deletion",
    ],
  );
  assert.deepEqual(
    links.map((p) => p.value),
    [
      "https://app.forgelearning.app",
      "https://app.forgelearning.app/privacy",
      "https://app.forgelearning.app/account-deletion",
    ],
  );
});
