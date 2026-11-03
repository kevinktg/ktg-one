import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import nextConfig from '../next.config.js';

describe('Security Headers Configuration', () => {
  test('headers() function is defined and returns security headers for all routes', async () => {
    assert.equal(typeof nextConfig.headers, 'function', 'nextConfig.headers should be a function');

    const headersConfig = await nextConfig.headers();
    assert.ok(Array.isArray(headersConfig), 'headers() should return an array');

    const catchAllRule = headersConfig.find((entry) => entry.source === '/(.*)');
    assert.ok(catchAllRule, 'Should have a rule matching "/(.*)"');

    const headersMap = new Map();
    for (const h of catchAllRule.headers) {
      headersMap.set(h.key, h.value);
    }

    assert.equal(headersMap.get('X-Frame-Options'), 'DENY');
    assert.equal(headersMap.get('X-Content-Type-Options'), 'nosniff');
    assert.equal(headersMap.get('Referrer-Policy'), 'strict-origin-when-cross-origin');
    assert.equal(headersMap.get('Permissions-Policy'), 'camera=(), microphone=(), geolocation=()');
    assert.equal(headersMap.get('X-DNS-Prefetch-Control'), 'on');
  });

  test('poweredByHeader is disabled to prevent framework fingerprinting', () => {
    assert.equal(nextConfig.poweredByHeader, false);
  });
});
