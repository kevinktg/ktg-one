import test from 'node:test';
import assert from 'node:assert/strict';
import { getFeaturedImage, formatDate } from '../src/lib/wordpress.js';

test('getFeaturedImage returns null for null or undefined post', () => {
  assert.equal(getFeaturedImage(null), null);
  assert.equal(getFeaturedImage(undefined), null);
});

test('getFeaturedImage returns null when _embedded or wp:featuredmedia is missing', () => {
  assert.equal(getFeaturedImage({}), null);
  assert.equal(getFeaturedImage({ _embedded: {} }), null);
  assert.equal(getFeaturedImage({ _embedded: { 'wp:featuredmedia': [] } }), null);
});

test('getFeaturedImage returns source_url when media is present', () => {
  const post = {
    _embedded: {
      'wp:featuredmedia': [
        { source_url: 'https://example.com/image.jpg' }
      ]
    }
  };
  assert.equal(getFeaturedImage(post), 'https://example.com/image.jpg');
});

test('formatDate handles empty, invalid, and valid date inputs', () => {
  assert.equal(formatDate(null), '');
  assert.equal(formatDate(undefined), '');
  assert.equal(formatDate(''), '');
  assert.equal(formatDate('invalid-date'), '');
  assert.equal(formatDate('2026-03-21T12:00:00Z'), 'March 21, 2026');
});
