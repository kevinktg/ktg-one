import test from "node:test";
import assert from "node:assert/strict";
import nextConfig from "../next.config.js";

test("nextConfig defines async headers() function", () => {
  assert.equal(typeof nextConfig.headers, "function", "headers should be a function");
});

test("nextConfig.headers() configures HTTP security headers for all routes", async () => {
  const headerEntries = await nextConfig.headers();
  assert.ok(Array.isArray(headerEntries), "headers() should return an array");

  const globalRule = headerEntries.find((entry) => entry.source === "/(.*)");
  assert.ok(globalRule, "Global route rule `/(.*)` should be configured");

  const headerMap = Object.fromEntries(
    globalRule.headers.map((h) => [h.key, h.value])
  );

  assert.equal(headerMap["X-Frame-Options"], "DENY", "X-Frame-Options should be DENY");
  assert.equal(headerMap["X-Content-Type-Options"], "nosniff", "X-Content-Type-Options should be nosniff");
  assert.equal(headerMap["Referrer-Policy"], "strict-origin-when-cross-origin", "Referrer-Policy should be strict-origin-when-cross-origin");
  assert.equal(
    headerMap["Permissions-Policy"],
    "camera=(), microphone=(), geolocation=()",
    "Permissions-Policy should restrict camera, microphone, and geolocation"
  );
  assert.equal(headerMap["X-DNS-Prefetch-Control"], "on", "X-DNS-Prefetch-Control should be on");
});
