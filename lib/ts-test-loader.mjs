import { existsSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

export async function resolve(specifier, context, nextResolve) {
  let candidate = specifier;
  if (specifier.startsWith("@/")) {
    candidate = pathToFileURL(join(root, specifier.slice(2))).href;
  }
  const tryUrls = [];
  if (candidate.startsWith("file://") || specifier.startsWith("./") || specifier.startsWith("../")) {
    const url = candidate.startsWith("file://")
      ? candidate
      : new URL(candidate, context.parentURL).href;
    if (!extname(fileURLToPath(url))) {
      for (const ext of [".ts", ".tsx", ".js", ".mjs"]) {
        tryUrls.push(url.endsWith("/") ? url : url + ext);
      }
    }
    tryUrls.unshift(url);
    for (const u of tryUrls) {
      try {
        if (existsSync(fileURLToPath(u))) {
          return { url: u, shortCircuit: true };
        }
      } catch {
        // ignore
      }
    }
  }
  return nextResolve(specifier, context);
}
