import test from "node:test";
import assert from "node:assert/strict";
import nextConfig from "../next.config.js";

test("next.config.js defines expected security headers", async () => {
  assert.equal(typeof nextConfig.headers, "function", "headers should be a function");

  const headersConfig = await nextConfig.headers();
  assert.ok(Array.isArray(headersConfig), "headers() should return an array");

  const globalRoute = headersConfig.find((entry) => entry.source === "/(.*)");
  assert.ok(globalRoute, "should have a catch-all route for security headers");

  const headerMap = Object.fromEntries(
    globalRoute.headers.map((h) => [h.key, h.value])
  );

  assert.equal(headerMap["X-Frame-Options"], "DENY");
  assert.equal(headerMap["X-Content-Type-Options"], "nosniff");
  assert.equal(headerMap["Referrer-Policy"], "strict-origin-when-cross-origin");
  assert.equal(headerMap["Permissions-Policy"], "camera=(), microphone=(), geolocation=()");
  assert.equal(headerMap["X-DNS-Prefetch-Control"], "on");
});
