import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const nextConfig = require('../next.config.js');

test('security headers are properly defined in next.config.js', async () => {
  assert.equal(typeof nextConfig.headers, 'function', 'nextConfig.headers should be a function');

  const headerRules = await nextConfig.headers();
  assert.ok(Array.isArray(headerRules), 'headers() should return an array');

  const globalRule = headerRules.find((rule) => rule.source === '/(.*)');
  assert.ok(globalRule, 'Should have a rule matching all routes (/(.*))');

  const headerMap = Object.fromEntries(
    globalRule.headers.map(({ key, value }) => [key, value])
  );

  assert.equal(headerMap['X-Frame-Options'], 'DENY');
  assert.equal(headerMap['X-Content-Type-Options'], 'nosniff');
  assert.equal(headerMap['Referrer-Policy'], 'strict-origin-when-cross-origin');
  assert.equal(headerMap['Permissions-Policy'], 'camera=(), microphone=(), geolocation=()');
  assert.equal(headerMap['X-DNS-Prefetch-Control'], 'on');
});
