import test from 'node:test';
import assert from 'node:assert/strict';
import { getPosts, getPostBySlug, getFeaturedImage, formatDate } from '../src/lib/wordpress.js';

test('getFeaturedImage returns null safely if input is invalid or has no media', () => {
  assert.equal(getFeaturedImage(null), null);
  assert.equal(getFeaturedImage(undefined), null);
  assert.equal(getFeaturedImage({}), null);
  assert.equal(getFeaturedImage({ _embedded: {} }), null);
});

test('getFeaturedImage returns source_url when present', () => {
  const post = {
    _embedded: {
      'wp:featuredmedia': [
        { source_url: 'https://example.com/image.jpg' }
      ]
    }
  };
  assert.equal(getFeaturedImage(post), 'https://example.com/image.jpg');
});

test('formatDate formats valid date string and handles invalid safely', () => {
  assert.equal(formatDate(''), '');
  assert.equal(formatDate(null), '');
  assert.equal(formatDate('invalid-date'), '');
  assert.equal(formatDate('2025-01-15T12:00:00'), 'January 15, 2025');
});

test('getPosts and getPostBySlug abort cleanly when network call times out', async () => {
  const originalFetch = globalThis.fetch;
  try {
    // Simulate abort error thrown when request times out
    globalThis.fetch = async (_url, _options) => {
      const err = new Error('The operation was aborted');
      err.name = 'AbortError';
      throw err;
    };

    const posts = await getPosts(1, 5);
    assert.deepEqual(posts, []);

    const post = await getPostBySlug('test-slug');
    assert.equal(post, null);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
