import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatDate,
  getFeaturedImage,
  testWordPressConnection,
  getPosts,
  getPostBySlug,
} from '../src/lib/wordpress.js';

test('formatDate formats valid date string correctly', () => {
  const formatted = formatDate('2026-03-21T12:00:00Z');
  assert.equal(formatted, 'March 21, 2026');
});

test('formatDate handles empty or invalid date strings gracefully', () => {
  assert.equal(formatDate(''), '');
  assert.equal(formatDate(null), '');
  assert.equal(formatDate(undefined), '');
  assert.equal(formatDate('invalid-date-format'), '');
});

test('getFeaturedImage extracts source_url when present', () => {
  const postWithMedia = {
    _embedded: {
      'wp:featuredmedia': [
        {
          source_url: 'https://example.com/image.png',
        },
      ],
    },
  };
  assert.equal(getFeaturedImage(postWithMedia), 'https://example.com/image.png');
});

test('getFeaturedImage returns null when featuredmedia is missing or malformed', () => {
  assert.equal(getFeaturedImage({}), null);
  assert.equal(getFeaturedImage({ _embedded: {} }), null);
  assert.equal(getFeaturedImage({ _embedded: { 'wp:featuredmedia': [] } }), null);
  assert.equal(getFeaturedImage({ _embedded: { 'wp:featuredmedia': [{}] } }), null);
});

test('testWordPressConnection returns true on ok response', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({}), { status: 200 });

  try {
    const result = await testWordPressConnection();
    assert.equal(result, true);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('testWordPressConnection returns false on failure or abort', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    const err = new Error('The operation was aborted');
    err.name = 'AbortError';
    throw err;
  };

  try {
    const result = await testWordPressConnection();
    assert.equal(result, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('getPosts returns parsed post array on success', async () => {
  const mockPosts = [{ id: 1, title: { rendered: 'Post 1' }, slug: 'post-1' }];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify(mockPosts), { status: 200 });

  try {
    const result = await getPosts(1, 10);
    assert.deepEqual(result, mockPosts);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('getPosts handles non-array responses gracefully', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ code: 'error' }), { status: 200 });

  try {
    const result = await getPosts(1, 10);
    assert.deepEqual(result, []);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('getPosts returns empty array on abort/timeout', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    const err = new Error('The operation was aborted');
    err.name = 'AbortError';
    throw err;
  };

  try {
    const result = await getPosts(1, 10);
    assert.deepEqual(result, []);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('getPosts provides an AbortSignal to fetch', async () => {
  let capturedSignal = null;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    capturedSignal = options?.signal;
    return new Response(JSON.stringify([]), { status: 200 });
  };

  try {
    await getPosts(1, 10);
    assert.ok(capturedSignal, 'Signal should be passed to fetch');
    assert.equal(typeof capturedSignal.aborted, 'boolean');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('getPostBySlug returns single post on success', async () => {
  const mockPost = { id: 2, title: { rendered: 'Post 2' }, slug: 'test-slug' };
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify([mockPost]), { status: 200 });

  try {
    const result = await getPostBySlug('test-slug');
    assert.deepEqual(result, mockPost);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('getPostBySlug returns null when post is not found or empty array', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify([]), { status: 200 });

  try {
    const result = await getPostBySlug('nonexistent');
    assert.equal(result, null);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('getPostBySlug returns null on abort/timeout', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    const err = new Error('The operation was aborted');
    err.name = 'AbortError';
    throw err;
  };

  try {
    const result = await getPostBySlug('timeout-slug');
    assert.equal(result, null);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('getPostBySlug provides an AbortSignal to fetch', async () => {
  let capturedSignal = null;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    capturedSignal = options?.signal;
    return new Response(JSON.stringify([]), { status: 200 });
  };

  try {
    await getPostBySlug('test-slug');
    assert.ok(capturedSignal, 'Signal should be passed to fetch');
    assert.equal(typeof capturedSignal.aborted, 'boolean');
  } finally {
    globalThis.fetch = originalFetch;
  }
});
