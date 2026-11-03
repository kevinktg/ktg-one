import test from 'node:test';
import assert from 'node:assert/strict';
import { getPosts, getPostBySlug } from '../src/lib/wordpress.js';

test('getPosts handles AbortError / timeout gracefully by returning an empty array', async () => {
  const originalFetch = global.fetch;
  try {
    // Mock fetch that respects AbortSignal and simulates an abort/timeout
    global.fetch = async (url, options) => {
      if (options?.signal) {
        return new Promise((resolve, reject) => {
          if (options.signal.aborted) {
            const err = new Error('The operation was aborted');
            err.name = 'AbortError';
            reject(err);
            return;
          }
          options.signal.addEventListener('abort', () => {
            const err = new Error('The operation was aborted');
            err.name = 'AbortError';
            reject(err);
          });
        });
      }
      return new Response(JSON.stringify([]));
    };

    // Fast-triggering abort test by simulating immediate timeout via mock
    global.fetch = async (url, options) => {
      assert.ok(options?.signal, 'fetch should receive an AbortSignal from fetchWithTimeout');
      const err = new Error('The operation was aborted');
      err.name = 'AbortError';
      throw err;
    };

    const posts = await getPosts();
    assert.deepEqual(posts, []);
  } finally {
    global.fetch = originalFetch;
  }
});

test('getPostBySlug handles AbortError / timeout gracefully by returning null', async () => {
  const originalFetch = global.fetch;
  try {
    global.fetch = async (url, options) => {
      assert.ok(options?.signal, 'fetch should receive an AbortSignal from fetchWithTimeout');
      const err = new Error('The operation was aborted');
      err.name = 'AbortError';
      throw err;
    };

    const post = await getPostBySlug('test-slug');
    assert.equal(post, null);
  } finally {
    global.fetch = originalFetch;
  }
});
