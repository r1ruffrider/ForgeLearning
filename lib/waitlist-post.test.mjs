// Loads the no-JS waitlist POST tests after a resolver so Node can import
// the same .ts modules Next compiles (no new runtime dependency).
import { register } from "node:module";

register(new URL("./ts-test-loader.mjs", import.meta.url));
await import("./waitlist-post.cases.mjs");
