// Pins the public contact email (Marlon 04:51 ruling). `npm test` (node --test).
// Node >= 22.18 / 23.6 runs the .ts module directly (type stripping).
import { test } from "node:test";
import assert from "node:assert/strict";
import { site } from "../content/site.ts";

const INSPIRE = "info@inspirebusinesstechnology.com";

test("brand.contactEmail is the Inspire public contact, not info@forgelearning.app", () => {
  assert.equal(site.brand.contactEmail, INSPIRE);
  const blob = JSON.stringify(site);
  assert.equal(blob.includes("info@forgelearning.app"), false);
  assert.equal(blob.includes(INSPIRE), true);
});

test("legal copy still uses {contactEmail} tokens (wording otherwise unchanged)", () => {
  const privacy = site.legal.privacy.sections.flatMap((s) => s.body).join("\n");
  const terms = site.legal.terms.sections.flatMap((s) => s.body).join("\n");
  assert.match(privacy, /Want off the list\? Email us at \{contactEmail\}/);
  assert.match(privacy, /Questions about this notice\? Reach us at \{contactEmail\}\./);
  assert.match(terms, /Questions\? Email us at \{contactEmail\}\./);
});
