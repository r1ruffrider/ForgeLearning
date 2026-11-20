/**
 * Shared legal-copy fill: substitute {contactEmail}, then turn allowlisted
 * https://app.forgelearning.app URLs into link parts so the legal page can
 * render real <a> nodes (never HTML). Anything else stays plain text.
 */

export type LegalTextPart =
  | { type: "text"; value: string }
  | { type: "link"; href: string; value: string };

const CONTACT_TOKEN = /\{contactEmail\}/g;
const HTTP_URL = /https?:\/\/[^\s<>]+/gi;
const TRAILING_PUNCT = new Set([".", ",", ";", ":", ")", '"', "'", "!", "]"]);
const ALLOWED_HOST = "app.forgelearning.app";

export function fillLegalText(
  text: string,
  contactEmail: string,
): LegalTextPart[] {
  const filled = text.replace(CONTACT_TOKEN, contactEmail);
  const parts: LegalTextPart[] = [];
  const re = new RegExp(HTTP_URL.source, HTTP_URL.flags);
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(filled)) !== null) {
    const raw = match[0];
    const { candidate, trailing } = stripTrailingPunct(raw);
    if (match.index > last) {
      parts.push({ type: "text", value: filled.slice(last, match.index) });
    }
    const parsed = parseAllowedAppUrl(candidate);
    if (parsed) {
      parts.push({ type: "link", href: parsed.href, value: candidate });
      if (trailing) parts.push({ type: "text", value: trailing });
    } else {
      parts.push({ type: "text", value: raw });
    }
    last = match.index + raw.length;
  }
  if (last < filled.length) {
    parts.push({ type: "text", value: filled.slice(last) });
  }
  if (parts.length === 0) {
    parts.push({ type: "text", value: filled });
  }
  return mergeAdjacentText(parts);
}

function stripTrailingPunct(raw: string): {
  candidate: string;
  trailing: string;
} {
  let end = raw.length;
  while (end > 0 && TRAILING_PUNCT.has(raw[end - 1]!)) {
    end -= 1;
  }
  return { candidate: raw.slice(0, end), trailing: raw.slice(end) };
}

function parseAllowedAppUrl(candidate: string): URL | null {
  try {
    const url = new URL(candidate);
    if (
      url.protocol === "https:" &&
      url.hostname === ALLOWED_HOST &&
      url.username === "" &&
      url.password === "" &&
      url.port === ""
    ) {
      return url;
    }
    return null;
  } catch {
    return null;
  }
}

function mergeAdjacentText(parts: LegalTextPart[]): LegalTextPart[] {
  const out: LegalTextPart[] = [];
  for (const part of parts) {
    const prev = out[out.length - 1];
    if (part.type === "text" && part.value === "") continue;
    if (part.type === "text" && prev?.type === "text") {
      prev.value += part.value;
    } else {
      out.push(part.type === "text" ? { type: "text", value: part.value } : { ...part });
    }
  }
  return out;
}
