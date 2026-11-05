import test from 'node:test';
import assert from 'node:assert/strict';
import { getPosts, getPostBySlug, getFeaturedImage, formatDate } from '../src/lib/wordpress.js';

test('formatDate handles valid and invalid date strings', () => {
  assert.equal(formatDate('2026-03-21T00:00:00Z'), 'March 21, 2026');
  assert.equal(formatDate(''), '');
  assert.equal(formatDate('invalid-date'), '');
});

test('getFeaturedImage extracts image URL safely', () => {
  assert.equal(getFeaturedImage(null), null);
  assert.equal(getFeaturedImage({}), null);
  const samplePost = {
    _embedded: {
      'wp:featuredmedia': [{ source_url: 'https://example.com/image.jpg' }]
    }
  };
  assert.equal(getFeaturedImage(samplePost), 'https://example.com/image.jpg');
});

test('getPosts and getPostBySlug gracefully handle network errors or aborts with empty/null fallback', async () => {
  // Test with an invalid endpoint that fails quickly or times out
  const posts = await getPosts(1, 1);
  assert.ok(Array.isArray(posts));

  const post = await getPostBySlug('nonexistent-post-slug-12345');
  assert.equal(post, null);
});
