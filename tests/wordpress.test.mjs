import test from "node:test";
import assert from "node:assert/strict";
import { formatDate, getFeaturedImage, getPosts, getPostBySlug } from "../src/lib/wordpress.js";

test("formatDate handles various inputs safely", () => {
  assert.equal(formatDate(null), "");
  assert.equal(formatDate(undefined), "");
  assert.equal(formatDate(""), "");
  assert.equal(formatDate("invalid-date-string"), "");

  const formatted = formatDate("2026-03-21T12:00:00Z");
  assert.match(formatted, /March 21, 2026/);
});

test("getFeaturedImage handles null/undefined and missing media gracefully", () => {
  // Should return null and not crash with TypeError
  assert.equal(getFeaturedImage(null), null);
  assert.equal(getFeaturedImage(undefined), null);
  assert.equal(getFeaturedImage({}), null);
  assert.equal(getFeaturedImage({ _embedded: {} }), null);
  assert.equal(getFeaturedImage({ _embedded: { "wp:featuredmedia": [] } }), null);

  const validPost = {
    _embedded: {
      "wp:featuredmedia": [
        {
          source_url: "https://example.com/wp-content/uploads/sample.jpg",
        },
      ],
    },
  };
  assert.equal(
    getFeaturedImage(validPost),
    "https://example.com/wp-content/uploads/sample.jpg"
  );
});

test("getPosts handles fetch timeout/network errors gracefully", async () => {
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async () => {
      const err = new Error("Request timed out");
      err.name = "AbortError";
      throw err;
    };

    const posts = await getPosts(1, 10);
    assert.deepEqual(posts, []);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("getPostBySlug handles fetch timeout/network errors gracefully", async () => {
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async () => {
      const err = new Error("Network error");
      throw err;
    };

    const post = await getPostBySlug("test-slug");
    assert.equal(post, null);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
