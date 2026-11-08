import test from 'node:test';
import assert from 'node:assert/strict';
import { getPosts, getPostBySlug } from '../src/lib/wordpress.js';

test('getPosts uses timeout signal and aborts cleanly when request times out or is aborted', async (t) => {
  const originalFetch = global.fetch;
  t.after(() => {
    global.fetch = originalFetch;
  });

  let capturedSignal = null;
  global.fetch = async (url, options = {}) => {
    capturedSignal = options.signal;
    const error = new Error('The operation was aborted');
    error.name = 'AbortError';
    throw error;
  };

  const posts = await getPosts(1, 5);
  assert.ok(capturedSignal instanceof AbortSignal, 'fetch was called with an AbortSignal');
  assert.deepEqual(posts, [], 'getPosts returns empty array on timeout');
});

test('getPostBySlug uses timeout signal and returns null cleanly on AbortError', async (t) => {
  const originalFetch = global.fetch;
  t.after(() => {
    global.fetch = originalFetch;
  });

  let capturedSignal = null;
  global.fetch = async (url, options = {}) => {
    capturedSignal = options.signal;
    const error = new Error('The operation was aborted');
    error.name = 'AbortError';
    throw error;
  };

  const post = await getPostBySlug('test-slug');
  assert.ok(capturedSignal instanceof AbortSignal, 'fetch was called with an AbortSignal');
  assert.equal(post, null, 'getPostBySlug returns null on timeout');
});

test('getPosts returns valid data on successful fetch', async (t) => {
  const originalFetch = global.fetch;
  t.after(() => {
    global.fetch = originalFetch;
  });

  const mockPosts = [{ id: 1, slug: 'test-post', title: { rendered: 'Test' } }];
  global.fetch = async () => {
    return {
      ok: true,
      json: async () => mockPosts,
    };
  };

  const posts = await getPosts(1, 5);
  assert.deepEqual(posts, mockPosts, 'getPosts returns fetched posts');
});
