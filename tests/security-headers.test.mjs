import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const nextConfig = require("../next.config.js");

test("next.config.js configures essential security headers", async () => {
  assert.equal(typeof nextConfig.headers, "function");

  const headerConfigs = await nextConfig.headers();
  assert.ok(Array.isArray(headerConfigs), "headers() should return an array");

  const globalRule = headerConfigs.find((rule) => rule.source === "/(.*)");
  assert.ok(globalRule, "should contain a wildcard route rule /(.*)");

  const headersMap = new Map(
    globalRule.headers.map((h) => [h.key, h.value])
  );

  assert.equal(headersMap.get("X-Frame-Options"), "DENY");
  assert.equal(headersMap.get("X-Content-Type-Options"), "nosniff");
  assert.equal(headersMap.get("Referrer-Policy"), "strict-origin-when-cross-origin");
  assert.equal(headersMap.get("X-DNS-Prefetch-Control"), "on");
  assert.equal(
    headersMap.get("Strict-Transport-Security"),
    "max-age=63072000; includeSubDomains; preload"
  );
  assert.equal(
    headersMap.get("Permissions-Policy"),
    "camera=(), microphone=(), geolocation=()"
  );
});
