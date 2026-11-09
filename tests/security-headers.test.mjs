import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const nextConfig = require('../next.config.js');

test('next.config.js defines expected HTTP security headers', async () => {
  assert.equal(typeof nextConfig.headers, 'function');
  const headersConfig = await nextConfig.headers();
  assert.ok(Array.isArray(headersConfig));

  const globalRoute = headersConfig.find((entry) => entry.source === '/(.*)');
  assert.ok(globalRoute, 'Expected entry with source /(.*)');

  const headerMap = Object.fromEntries(
    globalRoute.headers.map((h) => [h.key, h.value])
  );

  assert.equal(headerMap['X-Frame-Options'], 'DENY');
  assert.equal(headerMap['X-Content-Type-Options'], 'nosniff');
  assert.equal(headerMap['Referrer-Policy'], 'strict-origin-when-cross-origin');
  assert.equal(headerMap['X-DNS-Prefetch-Control'], 'on');
  assert.ok(headerMap['Permissions-Policy'].includes('camera=()'));
});
