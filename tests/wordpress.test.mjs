import test from 'node:test';
import assert from 'node:assert/strict';

test('getFeaturedImage handles null and undefined safely without throwing', async () => {
  const { getFeaturedImage } = await import('../src/lib/wordpress.js');

  assert.equal(getFeaturedImage(null), null);
  assert.equal(getFeaturedImage(undefined), null);
  assert.equal(getFeaturedImage({}), null);
  assert.equal(getFeaturedImage({ _embedded: {} }), null);
  assert.equal(getFeaturedImage({ _embedded: { 'wp:featuredmedia': [] } }), null);

  const samplePost = {
    _embedded: {
      'wp:featuredmedia': [
        {
          source_url: 'https://example.com/image.jpg',
        },
      ],
    },
  };
  assert.equal(getFeaturedImage(samplePost), 'https://example.com/image.jpg');
});

test('getPosts and getPostBySlug pass AbortSignal to global fetch', async () => {
  const originalFetch = global.fetch;
  const calls = [];

  global.fetch = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      json: async () => [{ id: 1, title: { rendered: 'Test Post' } }],
      text: async () => '',
    };
  };

  try {
    const { getPosts, getPostBySlug } = await import(`../src/lib/wordpress.js?cachebust=${Date.now()}`);

    calls.length = 0;
    await getPosts(1, 5);
    assert.equal(calls.length, 1);
    assert.ok(calls[0].options?.signal, 'getPosts should invoke fetch with an AbortSignal');

    calls.length = 0;
    await getPostBySlug('test-slug');
    assert.equal(calls.length, 1);
    assert.ok(calls[0].options?.signal, 'getPostBySlug should invoke fetch with an AbortSignal');
  } finally {
    global.fetch = originalFetch;
  }
});
