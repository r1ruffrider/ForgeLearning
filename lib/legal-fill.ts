/**
 * Shared legal-copy fill: substitute {contactEmail}, then split http(s) URLs
 * out as link parts so the legal page can render real <a> nodes (never HTML).
 */

export type LegalTextPart =
  | { type: "text"; value: string }
  | { type: "link"; href: string; value: string };

const CONTACT_TOKEN = /\{contactEmail\}/g;
const HTTP_URL = /https?:\/\/[^\s<>]+/gi;
const TRAILING_PUNCT = /[.,;:)]+$/;

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
    const href = raw.replace(TRAILING_PUNCT, "");
    if (match.index > last) {
      parts.push({ type: "text", value: filled.slice(last, match.index) });
    }
    if (isHttpUrl(href)) {
      parts.push({ type: "link", href, value: href });
      const trailing = raw.slice(href.length);
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

function isHttpUrl(value: string): boolean {
  try {
    const protocol = new URL(value).protocol;
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
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
