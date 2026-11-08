import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { getPosts, getPostBySlug, getFeaturedImage, formatDate } from "../src/lib/wordpress.js";

describe("WordPress API Client", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("getFeaturedImage safely handles null and undefined inputs", () => {
    assert.strictEqual(getFeaturedImage(null), null);
    assert.strictEqual(getFeaturedImage(undefined), null);
    assert.strictEqual(getFeaturedImage({}), null);
    assert.strictEqual(
      getFeaturedImage({
        _embedded: {
          "wp:featuredmedia": [{ source_url: "https://example.com/image.jpg" }],
        },
      }),
      "https://example.com/image.jpg"
    );
  });

  test("formatDate correctly formats date strings", () => {
    assert.strictEqual(formatDate(null), "");
    assert.strictEqual(formatDate(""), "");
    assert.strictEqual(formatDate("invalid-date"), "");
    const formatted = formatDate("2026-01-15T00:00:00");
    assert.ok(formatted.includes("January") && formatted.includes("2026"));
  });

  test("getPosts passes signal to fetch (fetchWithTimeout)", async () => {
    let capturedOptions = null;
    globalThis.fetch = async (url, options) => {
      capturedOptions = options;
      return {
        ok: true,
        json: async () => [{ id: 1, title: { rendered: "Test Post" } }],
      };
    };

    const posts = await getPosts(1, 5);
    assert.strictEqual(posts.length, 1);
    assert.strictEqual(posts[0].id, 1);
    assert.ok(capturedOptions?.signal instanceof AbortSignal, "Signal should be an AbortSignal instance");
  });

  test("getPostBySlug passes signal to fetch (fetchWithTimeout)", async () => {
    let capturedOptions = null;
    globalThis.fetch = async (url, options) => {
      capturedOptions = options;
      return {
        ok: true,
        json: async () => [{ id: 10, slug: "test-slug", title: { rendered: "Test" } }],
      };
    };

    const post = await getPostBySlug("test-slug");
    assert.strictEqual(post.id, 10);
    assert.ok(capturedOptions?.signal instanceof AbortSignal, "Signal should be an AbortSignal instance");
  });

  test("getPosts gracefully handles AbortError timeout without crashing", async () => {
    globalThis.fetch = async () => {
      const abortError = new Error("The operation was aborted");
      abortError.name = "AbortError";
      throw abortError;
    };

    const posts = await getPosts(1, 5);
    assert.deepStrictEqual(posts, [], "Should gracefully return empty array on abort timeout");
  });

  test("getPostBySlug gracefully handles AbortError timeout without crashing", async () => {
    globalThis.fetch = async () => {
      const abortError = new Error("The operation was aborted");
      abortError.name = "AbortError";
      throw abortError;
    };

    const post = await getPostBySlug("slow-post");
    assert.strictEqual(post, null, "Should gracefully return null on abort timeout");
  });
});
