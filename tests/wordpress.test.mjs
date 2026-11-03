import test from 'node:test';
import assert from 'node:assert/strict';
import { getFeaturedImage, formatDate } from '../src/lib/wordpress.js';

test('getFeaturedImage returns source_url when embedded featured media is present', () => {
  const post = {
    _embedded: {
      'wp:featuredmedia': [
        {
          source_url: 'https://example.com/image.jpg',
        },
      ],
    },
  };
  assert.equal(getFeaturedImage(post), 'https://example.com/image.jpg');
});

test('getFeaturedImage returns null when featuredmedia is missing or empty', () => {
  assert.equal(getFeaturedImage({}), null);
  assert.equal(getFeaturedImage({ _embedded: {} }), null);
  assert.equal(getFeaturedImage({ _embedded: { 'wp:featuredmedia': [] } }), null);
});

test('getFeaturedImage safely returns null when post is null or undefined without throwing', () => {
  assert.equal(getFeaturedImage(null), null);
  assert.equal(getFeaturedImage(undefined), null);
});

test('formatDate formats valid ISO dates correctly', () => {
  const formatted = formatDate('2026-03-21T12:00:00Z');
  assert.equal(typeof formatted, 'string');
  assert.match(formatted, /2026/);
});

test('formatDate safely returns empty string on empty or invalid input', () => {
  assert.equal(formatDate(null), '');
  assert.equal(formatDate(undefined), '');
  assert.equal(formatDate('invalid-date'), '');
});
