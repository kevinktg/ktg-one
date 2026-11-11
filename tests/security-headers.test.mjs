import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const nextConfig = require('../next.config.js');

test('nextConfig defines async headers() returning security headers', async () => {
  assert.equal(typeof nextConfig.headers, 'function', 'headers should be a function');

  const headerConfigs = await nextConfig.headers();
  assert(Array.isArray(headerConfigs), 'headers() should return an array');
  assert(headerConfigs.length > 0, 'headers() array should not be empty');

  const rootConfig = headerConfigs.find(
    (cfg) => cfg.source === '/:path*' || cfg.source === '/(.*)'
  );
  assert(rootConfig, 'should contain a configuration matching all routes');

  const headerMap = Object.fromEntries(
    rootConfig.headers.map((h) => [h.key, h.value])
  );

  assert.equal(headerMap['X-Frame-Options'], 'DENY');
  assert.equal(headerMap['X-Content-Type-Options'], 'nosniff');
  assert.equal(headerMap['Referrer-Policy'], 'strict-origin-when-cross-origin');
  assert.equal(
    headerMap['Permissions-Policy'],
    'camera=(), microphone=(), geolocation=()'
  );
  assert.equal(headerMap['X-DNS-Prefetch-Control'], 'on');
});
