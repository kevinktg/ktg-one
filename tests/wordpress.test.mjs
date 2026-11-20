import test from "node:test";
import assert from "node:assert/strict";
import { getFeaturedImage, formatDate, getPosts, getPostBySlug } from "../src/lib/wordpress.js";

test("getFeaturedImage handles null and undefined safely", () => {
  assert.equal(getFeaturedImage(null), null);
  assert.equal(getFeaturedImage(undefined), null);
  assert.equal(getFeaturedImage({}), null);
  assert.equal(getFeaturedImage({ _embedded: {} }), null);
  assert.equal(
    getFeaturedImage({
      _embedded: {
        "wp:featuredmedia": [{ source_url: "https://example.com/image.png" }],
      },
    }),
    "https://example.com/image.png"
  );
});

test("formatDate handles valid, invalid, and null date strings", () => {
  assert.equal(formatDate(null), "");
  assert.equal(formatDate(""), "");
  assert.equal(formatDate("not-a-date"), "");
  const formatted = formatDate("2026-03-21T00:00:00Z");
  assert.match(formatted, /2026/);
});

test("getPosts and getPostBySlug pass abort signals to fetch requests", async () => {
  const originalFetch = globalThis.fetch;
  let capturedOptions = [];

  globalThis.fetch = async (url, options) => {
    capturedOptions.push(options);
    return {
      ok: true,
      json: async () => [],
    };
  };

  try {
    await getPosts(1, 5);
    await getPostBySlug("test-slug");

    // Assert all calls had a timeout signal passed
    assert.equal(capturedOptions.length, 2);
    for (const opt of capturedOptions) {
      assert.ok(opt.signal, "Expected request to include an AbortSignal");
    }
  } finally {
    globalThis.fetch = originalFetch;
  }
});
