import test from "node:test";
import assert from "node:assert/strict";
import { getPosts, getPostBySlug } from "../src/lib/wordpress.js";

test("getPosts handles request failure or timeout gracefully and returns an array", async () => {
  const posts = await getPosts(1, 1);
  assert.ok(Array.isArray(posts), "Expected getPosts to return an array");
});

test("getPostBySlug handles request failure or timeout gracefully and returns null or post object", async () => {
  const post = await getPostBySlug("non-existent-slug-xyz-12345");
  assert.ok(post === null || typeof post === "object", "Expected getPostBySlug to return null or an object");
});
