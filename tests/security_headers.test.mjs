import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const nextConfig = require("../next.config.js");

test("next.config.js defines headers function returning expected security headers", async () => {
  assert.strictEqual(typeof nextConfig.headers, "function");

  const headerConfigs = await nextConfig.headers();
  assert.ok(Array.isArray(headerConfigs), "headers() should return an array");

  const globalRule = headerConfigs.find((rule) => rule.source === "/:path*");
  assert.ok(globalRule, "should have a rule matching /:path*");
  assert.ok(Array.isArray(globalRule.headers), "headers list should be an array");

  const headersMap = Object.fromEntries(
    globalRule.headers.map((h) => [h.key, h.value])
  );

  assert.strictEqual(headersMap["X-Frame-Options"], "DENY");
  assert.strictEqual(headersMap["X-Content-Type-Options"], "nosniff");
  assert.strictEqual(
    headersMap["Referrer-Policy"],
    "strict-origin-when-cross-origin"
  );
  assert.strictEqual(
    headersMap["Permissions-Policy"],
    "camera=(), microphone=(), geolocation=()"
  );
});
